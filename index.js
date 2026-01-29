const print = (text) => {
  const x = document.getElementById("debug");
  if (x) {
    x.appendChild(document.createTextNode("\n" + text));
  } else {
    const div = document.createElement("pre");
    const css = `display:block;
      position:fixed;
      z-index:99999999;
      padding:5px;
      bottom:15px;
      left:15px;
      right:15px;
      max-height:300px;
      background:#333;
      color:#ddd;
      overflow: auto;
      margin:0;`;
    div.id = "_html_logs_";
    div.style.cssText = css;
    div.textContent = text;
    document.body.appendChild(div);

    // Auto-scroll to bottom on change
    const observer = new MutationObserver(() => {
      div.scrollTop = div.scrollHeight;
    });
    observer.observe(div, {
      childList: true,
      subtree: true,
      characterData: true
    });
  }
};

const jsonFix = () => {
  const seen = new WeakSet();
  return (key, value) => {
    if (typeof value === "object" && value !== null) {
      if (seen.has(value)) {
        return;
      }
      seen.add(value);
    }
    return value;
  };
};

const timeFormatter = new Intl.DateTimeFormat("en-GB", {
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  fractionalSecondDigits: 3,
  hour12: false,
});

export const log = (...get) => {
  const timestamp = timeFormatter.format(new Date()).replace(".", ":");

  console.log(get); //eslint-disable-line

  const output = get.map((item) => {
    if (typeof item === "object") {
      return String(JSON.stringify(item, jsonFix()));
    }
    return String(item);
  });

  print(`${timestamp} ${output.join(" ")}`);
};
