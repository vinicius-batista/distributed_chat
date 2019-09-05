// We need to import the CSS so that webpack will load it.
// The MiniCssExtractPlugin is used to separate it out into
// its own CSS file.
import css from "../css/app.css";

import { Socket, Presence } from "phoenix";

let socket = new Socket("/socket", {
  params: { user_id: window.location.search.split("=")[1] }
});

let channel = socket.channel("room:lobby", {});
let presence = new Presence(channel);

function renderOnlineUsers(presence) {
  let response = "";

  presence.list((id, { metas: [first, ...rest] }) => {
    let count = rest.length + 1;
    response += `<br>${id} (count: ${count})</br>`;
  });

  document.getElementById("users").innerHTML = response;
}

function sendMessage(e) {
  e.preventDefault();
  const message = document.getElementById("message-input").value;
  channel.push("new-message", message);
}

document.getElementById("form-message").addEventListener("submit", sendMessage);

channel.on("new-message", payload => {
  const response = `<br>${payload.user_id}: ${payload.message}</br>`;
  document.getElementById("messages").innerHTML += response;
});

socket.connect();

presence.onSync(() => renderOnlineUsers(presence));

channel.join();
