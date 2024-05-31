function setError(error) {
  document.getElementById("nano-error").dataset.error = error;
}

window.addEventListener("load", async function () {
  try {
    const hasAI = window.ai != null;

    const hasNano =
      (hasAI && (await window.ai.canCreateTextSession())) === "readily";

    if (!hasNano) {
      setError(!hasAI ? "not supported in this browser" : "not ready yet");
      document.getElementById('how-to').dataset.help = true;
      return;
    }

    const session = await window.ai.createTextSession();

    const askElement = document.getElementById('ask-button');
    const questionElement = document.getElementById('ask-question');
    const responseElement = document.getElementById('ask-response');

    let asking = false;

    async function ask() {
      if (asking) {
        return;
      }

      const prompt = questionElement.value;
      const stream = session.promptStreaming(prompt);
      try {
        asking = true;
        askElement.disabled = true;
        setError('');
        for await (const chunk of stream) {
          responseElement.textContent = chunk;
        }
      } catch (err) {
        setError(err.message);
      }

      asking = false;
      askElement.disabled = false;
    };

    askElement.addEventListener('click', () => {
      ask();
    });

    document.addEventListener('keydown', (event) => {
      if (!asking && event.shiftKey && event.key === "Enter") {
        askElement.focus();
        event.preventDefault();
        ask();
      }
    })

    document.body.setAttribute("data-ready", "true");
  } catch (err) {
    setError(err.message);
  }
});
