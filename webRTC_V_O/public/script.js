const socket = io();
const localVideo = document.createElement('video');
const remoteVideo = document.createElement('video');
localVideo.autoplay = true;
remoteVideo.autoplay = true;
document.body.appendChild(localVideo);
document.body.appendChild(remoteVideo);
const chatBox = document.createElement('textarea');
const sendButton = document.createElement('button');
sendButton.textContent = "Send";
document.body.appendChild(chatBox);
document.body.appendChild(sendButton);
const chatMessages = document.createElement('div');
document.body.appendChild(chatMessages);

navigator.mediaDevices.getUserMedia({ video: true, audio: true })
    .then(stream => {
        localVideo.srcObject = stream;
        localPeer.addStream(stream);
    });

const localPeer = new RTCPeerConnection({
    iceServers: [{ urls: "stun:stun.l.google.com:19302" }]
});

localPeer.onicecandidate = event => {
    if (event.candidate) {
        socket.emit('candidate', event.candidate);
    }
};

localPeer.ontrack = event => {
    remoteVideo.srcObject = event.streams[0];
};

socket.on('offer', async offer => {
    await localPeer.setRemoteDescription(new RTCSessionDescription(offer));
    const answer = await localPeer.createAnswer();
    await localPeer.setLocalDescription(answer);
    socket.emit('answer', answer);
});

socket.on('answer', async answer => {
    await localPeer.setRemoteDescription(new RTCSessionDescription(answer));
});

socket.on('candidate', async candidate => {
    await localPeer.addIceCandidate(new RTCIceCandidate(candidate));
});

sendButton.addEventListener('click', () => {
    const message = chatBox.value;
    socket.emit('message', message);
    chatMessages.innerHTML += `<p>You: ${message}</p>`;
    chatBox.value = '';
});

socket.on('message', message => {
    chatMessages.innerHTML += `<p>Peer: ${message}</p>`;
});

async function startCall() {
    const offer = await localPeer.createOffer();
    await localPeer.setLocalDescription(offer);
    socket.emit('offer', offer);
}
