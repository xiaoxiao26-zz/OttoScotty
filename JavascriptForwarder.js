var url = "https://quiet-depths-46144.herokuapp.com/";

//Load jQuery library using plain JavaScript
//http://www.sitepoint.com/dynamically-load-jquery-library-javascript/
(function(){
  var newscript = document.createElement('script');
     newscript.type = 'text/javascript';
     newscript.async = true;
     newscript.src = 'https://ajax.googleapis.com/ajax/libs/jquery/1.6.1/jquery.min.js';
  (document.getElementsByTagName('head')[0]||document.getElementsByTagName('body')[0]).appendChild(newscript);
})();

//http://stackoverflow.com/questions/6157929/how-to-simulate-a-mouse-click-using-javascript
function simulate(element, eventName)
{
    var options = extend(defaultOptions, arguments[2] || {});
    var oEvent, eventType = null;

    for (var name in eventMatchers)
    {
        if (eventMatchers[name].test(eventName)) { eventType = name; break; }
    }

    if (!eventType)
        throw new SyntaxError('Only HTMLEvents and MouseEvents interfaces are supported');

    if (document.createEvent)
    {
        oEvent = document.createEvent(eventType);
        if (eventType == 'HTMLEvents')
        {
            oEvent.initEvent(eventName, options.bubbles, options.cancelable);
        }
        else
        {
            oEvent.initMouseEvent(eventName, options.bubbles, options.cancelable, document.defaultView,
            options.button, options.pointerX, options.pointerY, options.pointerX, options.pointerY,
            options.ctrlKey, options.altKey, options.shiftKey, options.metaKey, options.button, element);
        }
        element.dispatchEvent(oEvent);
    }
    else
    {
        options.clientX = options.pointerX;
        options.clientY = options.pointerY;
        var evt = document.createEventObject();
        oEvent = extend(evt, options);
        element.fireEvent('on' + eventName, oEvent);
    }
    return element;
}

function extend(destination, source) {
    for (var property in source)
      destination[property] = source[property];
    return destination;
}

var eventMatchers = {
    'HTMLEvents': /^(?:load|unload|abort|error|select|change|submit|reset|focus|blur|resize|scroll)$/,
    'MouseEvents': /^(?:click|dblclick|mouse(?:down|up|over|move|out))$/
}
var defaultOptions = {
    pointerX: 0,
    pointerY: 0,
    button: 0,
    ctrlKey: false,
    altKey: false,
    shiftKey: false,
    metaKey: false,
    bubbles: true,
    cancelable: true
}
function sendMessageMobile(msg)
{
  document.getElementById("composerInput").value=msg;
  simulate(document.getElementById("composerInput"),"focus");
  simulate(document.getElementsByName("send")[0],"click")
}

function sendMessage(msg)
{
  if(msg.length == 0)
  {
    return;
  }
  var currentMessages = allMessages[document.location.href];
  if(currentMessages === undefined)
  {
    currentMessages = getMessages();
  }
  currentMessages.push(new Message(msg,null, true));
  document.getElementsByName("message_body")[0].value=msg;
  document.querySelector("[value=Reply]").click();
}

function getMessages()
{
  var messages = document.getElementsByClassName("_38");
  var msgs = [];
  for(var i = 0; i < messages.length; i++)
  {
    var parent = $(messages[i]).closest("._42ef");
    if(parent.find)
    {
      var timestamp = parent.find(".timestamp").attr("data-utime");
      var isScotty = false;
      msgs.push(new Message(messages[i].innerText,timestamp, isScotty));
    }
    else
    {
      window.parents = parent;
      console.log(parent);
      msgs.push(new Message(messages[i].innerText,null, true));
    }
  }
  return msgs;
}

var blacklist = ["window.location","print","innerHTML","document","window"];

function blacklisted(msg)
{
  for(var i = 0; i < blacklist.length; i++)
  {
    if(msg.indexOf(blacklist[i])!=-1)
    {
      return true;
    }
  }
  return false;
}

function processRequests()
{
  var chats = document.getElementsByClassName("_k_");
  for(var i = 0; i < chats.length; i++)
  {
    var news = chats[i].getElementsByClassName("_l6");
    if(news.length > 0 && news[0].innerText.indexOf("new")!=-1)
    {
      simulate(chats[i],"click");
      setTimeout(function(){
        checkMessages();
        setTimeout(processRequests,1000);
      }, 1000);

      return;
    }
  }
  checkMessages();
  setTimeout(processRequests,1000);
}

function processMessage(msg)
{
  if(msg.length > 0 && msg.charAt(0)=="$")
  {
    msg = msg.substring(1);
  }
  else
  {
    return;
  }
  if(blacklisted(msg))
  {
    sendMessage("[BLACKLISTED]");
  }
  else
  {
    try
    {
      //var result = eval(msg);
      $.post(url + 'run_javascript',{'code': msg}, function(data){
        console.log("done sending!");
        console.log(data.result);
        sendMessage(data.result);
      });
      //sendMessage(result);
    }
    catch(e)
    {
      sendMessage(e);
    }
  }
}

function peek(arr)
{
  return arr[arr-1];
}

function Message(msg, timestamp, isScotty)
{
  this.msg = msg;
  this.timestamp = timestamp;
  this.isScotty = isScotty;
}

function hasMessage(current, msg)
{
  for(var j = 0; j < current.length; j++)
  {
    if(current[j].msg === msg.msg && (current[j].isScotty || current[j].timestamp === msg.timestamp))
    {
      return true;
    }
  }
  return false;
}

var allMessages = {};
function checkMessages()
{
  var href = document.location.href;
  if(allMessages[href] === undefined)
  {
    allMessages[href] = getMessages();
    sendMessage("Hi, I'm Otto Scotty! Send me a message starting with $ for Javascript or $$ for Latex.");
  }
  else
  {
    var currentMessages = allMessages[href];

    var msgs = getMessages();
    for(var i = msgs.length-1; i>=0; i--)
    {
      
      if(!hasMessage(currentMessages, msgs[i]))
      {
        console.log("Got " + msgs[i].msg);
        currentMessages.push(msgs[i]);
        processMessage(msgs[i].msg);
      }
    }
  }
}

processRequests();


//  //document.getElementsByTagName("form")[0].submit()

//document.querySelectorAll("[data-sigil=message-text]")

