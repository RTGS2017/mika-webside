import tls from "node:tls";

function b64(value) {
  return Buffer.from(value, "utf8").toString("base64");
}

export function sendMail({ host, port, user, pass, to, subject, text }) {
  return new Promise((resolve, reject) => {
    const socket = tls.connect({
      host,
      port: Number(port) || 465,
      servername: host
    });
    let buffer = "";
    let pending = null;
    const queue = [];

    function fail(error) {
      socket.destroy();
      reject(error);
    }

    function pump() {
      let index = buffer.indexOf("\r\n");
      while (index >= 0) {
        const line = buffer.slice(0, index);
        buffer = buffer.slice(index + 2);
        const more = line[3] === "-";
        if (!more && pending) {
          const done = pending;
          pending = null;
          done(line);
        }
        index = buffer.indexOf("\r\n");
      }
    }

    function readCode(expect) {
      return new Promise((ok, no) => {
        pending = (line) => {
          const code = Number(line.slice(0, 3));
          if (!expect.includes(code)) no(new Error(line));
          else ok(line);
        };
        pump();
      });
    }

    function write(line) {
      socket.write(line + "\r\n");
    }

    socket.on("data", (chunk) => {
      buffer += chunk.toString("utf8");
      pump();
    });
    socket.on("error", fail);

    (async () => {
      await readCode([220]);
      write(`EHLO mikaovo.ai`);
      await readCode([250]);
      write("AUTH LOGIN");
      await readCode([334]);
      write(b64(user));
      await readCode([334]);
      write(b64(pass));
      await readCode([235]);
      write(`MAIL FROM:<${user}>`);
      await readCode([250]);
      write(`RCPT TO:<${to}>`);
      await readCode([250, 251]);
      write("DATA");
      await readCode([354]);
      const stuffed = String(text)
        .replace(/\r?\n/g, "\r\n")
        .split("\r\n")
        .map((line) => (line.startsWith(".") ? `.${line}` : line))
        .join("\r\n");
      const body = [
        `From: Mika <${user}>`,
        `To: <${to}>`,
        `Subject: =?UTF-8?B?${b64(subject)}?=`,
        "MIME-Version: 1.0",
        "Content-Type: text/plain; charset=UTF-8",
        "",
        stuffed,
        "."
      ].join("\r\n");
      write(body);
      await readCode([250]);
      write("QUIT");
      socket.end();
      resolve();
    })().catch(fail);
  });
}
