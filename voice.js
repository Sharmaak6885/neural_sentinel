document.addEventListener("DOMContentLoaded", () => {
  const orbContainer = document.getElementById("voiceOrb");
  if (!orbContainer) return;

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  
  if (!SpeechRecognition) {
    console.warn("Speech Recognition API is not supported in this browser.");
    orbContainer.style.display = 'none';
    return;
  }

  const recognition = new SpeechRecognition();
  recognition.continuous = true;
  recognition.interimResults = false;
  recognition.lang = 'en-US';

  let isListening = false;
  let isCommandMode = false;
  let commandTimeout = null;

  function startListening() {
    try {
      recognition.start();
      isListening = true;
      orbContainer.classList.add("active");
    } catch (e) {
      console.log("Recognition already started or failed to start.");
    }
  }

  // Auto-start listening (Requires browser permission, might fail without user interaction)
  // We attach a click handler as a fallback
  orbContainer.addEventListener('click', () => {
    if (!isListening) {
      startListening();
    }
  });

  // Try to start immediately
  startListening();

  recognition.onend = () => {
    isListening = false;
    orbContainer.classList.remove("active");
    // Restart listening automatically to keep it continuous
    setTimeout(startListening, 1000);
  };

  recognition.onresult = (event) => {
    const lastResultIndex = event.results.length - 1;
    const transcript = event.results[lastResultIndex][0].transcript.toLowerCase().trim();
    console.log("Heard:", transcript);

    // Wake word
    if (transcript.includes("hello neural") || transcript.includes("neural")) {
      activateCommandMode();
    }

    // Command processing
    if (isCommandMode || transcript.includes("hello neural") || transcript.includes("neural")) {
      processCommand(transcript);
    }
  };

  function activateCommandMode() {
    isCommandMode = true;
    orbContainer.classList.add("listening");
    clearTimeout(commandTimeout);
    
    // Stay in command mode for 8 seconds
    commandTimeout = setTimeout(() => {
      isCommandMode = false;
      orbContainer.classList.remove("listening");
    }, 8000);
  }

  function processCommand(transcript) {
    if (transcript.includes("open") || transcript.includes("go to") || transcript.includes("show")) {
      if (transcript.includes("threat intel") || transcript.includes("intel")) {
        window.location.hash = "#intel";
        successFeedback();
      } else if (transcript.includes("lab") || transcript.includes("site lab")) {
        window.location.hash = "#lab";
        successFeedback();
      } else if (transcript.includes("services")) {
        window.location.hash = "#services";
        successFeedback();
      } else if (transcript.includes("blog")) {
        window.location.href = "blog.html";
      } else if (transcript.includes("admin")) {
        window.location.href = "admin.html";
      } else if (transcript.includes("contact")) {
        window.location.hash = "#contact";
        successFeedback();
      }
    }
  }

  function successFeedback() {
    orbContainer.classList.remove("listening");
    orbContainer.classList.add("success");
    isCommandMode = false;
    setTimeout(() => {
      orbContainer.classList.remove("success");
    }, 2000);
  }
});
