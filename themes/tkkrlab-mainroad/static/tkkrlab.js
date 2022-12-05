;
var printer = [{}, {}];
var printerName = ["Prusa Mini #1", "Prusa Mini #2"];

function escapeHtml(unsafe) {
    return unsafe.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#039;');
}

function setSpaceState(state=null) {
        console.log("Spacestate changed to ", state);
        if (state != null) lastSpacestate = state;
        var elem = document.getElementById("space-status");
        var text = "";
        if (lastSpacestate=="1") {
                text = state_prefix+"<span class='open'>open</span>";
        } else if (lastSpacestate=="0") {
                text = state_prefix+"<span class='closed'>closed</span>";
        } else {
                text = state_prefix + "<span class='unknown'>unknown</span>";
        }
        if (temperature) text += "<br />T: "+escapeHtml(String(temperature).substring(0, 6))+"&deg;c";
        if (humidity)    text += " / H: "+escapeHtml(String(humidity).substring(0, 6))+"%"
        elem.innerHTML = text;
}

// called when a message arrives
function onMessageArrived(message) {
  console.log("onMessageArrived:",message.destinationName,message.payloadString);

  if (message.destinationName=="tkkrlab/spacestate") {
          setSpaceState(message.payloadString);
  } else if (message.destinationName=="tkkrlab/sensors/temperature") {
          temperature = message.payloadString;
          setSpaceState();
  } else if (message.destinationName=="tkkrlab/sensors/humidity") {
          humidity = message.payloadString;
          setSpaceState();
  } else if (message.destinationName=="tkkrlab/sensors/3d/1") {
          printer[0] = JSON.parse(message.payloadString);
          showPrintStatus();
  } else if (message.destinationName=="tkkrlab/sensors/3d/2") {
          printer[1] = JSON.parse(message.payloadString);
          showPrintStatus();
  } else {
          //Ignore.
  }
}

function showPrintStatus() {
  var output = "";
  for (let i = 0; i < printer.length; i++) {
    output += printerName[i] + "<table><tbody><tr>";
    if ("state" in printer[i]) {
      output += "<td>State</td><td>" + escapeHtml(String(printer[i].state)) + "</td>";
    }
    if ("progress" in printer[i] && printer[i].progress !== null) {
      output += "<td>Progress</td><td>" + escapeHtml(String(printer[i].progress.completion * 100)) + "%</td>";
      output += "<td>Time remaining</td><td>" + escapeHtml(String(Math.round(printer[i].progress.printTimeLeft / 60))) + " minutes</td>";
    }
    if ("job" in printer[i] && printer[i].job !== null) {
      output += "<td>File</td><td>" + escapeHtml(String(printer[i].job.file.name)) + "</td>";
    }
    output += "</tr></tbody></table>";
  }
  document.getElementById("3dprinter").innerHTML = output;
}

/*function progressCreate() {
  if (document.getElementById("progress1")!=null) {
    console.log("Found progress1!");
    progress['test1'] = new ProgressBar.Line('#progress1', {
      strokeWidth: 4,
      color: '#F3ED18',
      duration: 1400,
      easing: 'easeInOut',
      trailColor: '#F0F0F0',
      trailWidth: 1 
    });
    progress['test1'].animate(0);
  } else {
    console.log("No progress #1!");
  }

  if (document.getElementById("progress2")!=null) {
    console.log("Found progress2!");
    progress['test2'] = new ProgressBar.SemiCircle('#progress2', {
      strokeWidth: 8,
      color: '#F3ED18',
      duration: 1400,
      easing: 'easeInOut',
      trailColor: '#F0F0F0',
      trailWidth: 1,
      from: {color: '#FFEA82'},
      to: {color: '#ED6A5A'},
      step: (state, bar) => {
        bar.path.setAttribute('stroke', state.color);
        var value = Math.round(bar.value() * 100);
        if (value === 0) {
          bar.setText('');
        } else {
          bar.setText(value);
        }
        bar.text.style.color = state.color;
      }
    });
    progress['test2'].animate(0);
  } else {
    console.log("No progress #2!");
  }
}*/

function fadeSubtitleText() {
        $(".logo__tagline").fadeOut(function() {
                $(this).text("Hackerspace Enschede").fadeIn();
        });
}

window.onload = function onLoad() {
  /*if (initial_status) {
    document.getElementById("space-status").innerHTML = state_prefix+"<span class='open'>open</span>";
  } else {
    document.getElementById("space-status").innerHTML = state_prefix+"<span class='closed'>gesloten</span>";
  }*/
  mqttClientCreate();
  mqttClientConnect();
  //progressCreate();
  //drawChat();
}
