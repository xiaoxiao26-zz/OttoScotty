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
  currentMessages.push(msg);
  document.getElementsByName("message_body")[0].value=msg;
  document.querySelector("[value=Reply]").click();
}

function getMessages()
{
  var messages = document.getElementsByClassName("_38");
  var msgs = [];
  for(var i = 0; i < messages.length; i++)
  {
    msgs.push(messages[i].innerText);
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
    var txt = chats[i].innerText;
    if(txt.indexOf("new")!=-1 && txt.toLowerCase().indexOf("yo")!=-1)
    {
      simulate(chats[i],"click");
      setTimeout(function(){
        currentMessages = getMessages();
        setTimeout(processRequests,5000);
      }, 1000);

      return;
    }
  }
  setTimeout(processRequests,2000);
}

function processMessage(msg)
{
  var msg_is_javascript = true;

  var send_to_client = function(data) {
    console.log("done sending!");
    console.log(data.result);
    sendMessage(data.result);
  }

  if(msg.length > 2 && msg.charAt(1) == "$" && msg.charAt(0) == "$") { // latex message
    msg = msg.substring(2);
    msg_is_javascript = false;
  }
  else if(msg.length > 1 && msg.charAt(0)=="$") // javascript message
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
      if (msg_is_javascript) 
      {
        $.post(url + 'run_javascript',{'code': msg}, send_to_client);
        console.log("sending javascript");
      }
      else
      {
        $.post(url + 'run_latex',{'code': msg}, send_to_client);
        console.log("sending latex");
      }
      //sendMessage(result);
    }
    catch(e)
    {
      sendMessage(e);
    }
  }
}

var currentMessages = getMessages();
function checkMessages()
{
  var msgs = getMessages();
  if(msgs.length > currentMessages.length)
  {
    for(var i = currentMessages.length; i < msgs.length; i++)
    {
      processMessage(msgs[i]);
      currentMessages.push(msgs[i]);
    }
  }
}

setInterval(checkMessages,1000);
processRequests();


//  //document.getElementsByTagName("form")[0].submit()

//document.querySelectorAll("[data-sigil=message-text]")

