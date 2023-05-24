const localVideo = document.querySelector('#localVideo')
const remoteVideo = document.querySelector('#remoteVideo')

navigator.mediaDevices
  .getUserMedia({
    audio: false,
    video: true
  })
  .then(stream => {
    localVideo.srcObject = stream
    const pc = new RTCPeerConnection({
      iceServers: [
        { url: 'stun:stun01.sipphone.com' },
        { url: 'stun:stun.ekiga.net' },
        { url: 'stun:stun.fwdnet.net' },
        { url: 'stun:stun.ideasip.com' },
        { url: 'stun:stun.iptel.org' },
        { url: 'stun:stun.rixtelecom.se' },
        { url: 'stun:stun.schlund.de' },
        { url: 'stun:stun.l.google.com:19302' },
        { url: 'stun:stun1.l.google.com:19302' },
        { url: 'stun:stun2.l.google.com:19302' },
        { url: 'stun:stun3.l.google.com:19302' },
        { url: 'stun:stun4.l.google.com:19302' },
        { url: 'stun:stunserver.org' },
        { url: 'stun:stun.softjoys.com' },
        { url: 'stun:stun.voiparound.com' },
        { url: 'stun:stun.voipbuster.com' },
        { url: 'stun:stun.voipstunt.com' },
        { url: 'stun:stun.voxgratia.org' },
        { url: 'stun:stun.xten.com' },
        {
          url: 'turn:numb.viagenie.ca',
          credential: 'muazkh',
          username: 'webrtc@live.com'
        },
        {
          url: 'turn:192.158.29.39:3478?transport=udp',
          credential: 'JZEOEt2V3Qb0y27GRntt2u2PAYA=',
          username: '28224511:1379330808'
        },
        {
          url: 'turn:192.158.29.39:3478?transport=tcp',
          credential: 'JZEOEt2V3Qb0y27GRntt2u2PAYA=',
          username: '28224511:1379330808'
        }
      ]
    })
    let i
    pc.addEventListener('icecandidate', event => {
      if (event.candidate && !i) {
        i = true
        axios
          .post(!location.hash ? '/candidate?i=true' : '/candidate', {
            sdpMLineIndex: event.candidate.sdpMLineIndex,
            sdpMid: event.candidate.sdpMid,
            candidate: event.candidate.candidate
          })
          .then(({ data }) => {
            var candidate = new RTCIceCandidate(data)
            pc.addIceCandidate(candidate)
          })
      }
    })
    pc.addEventListener('addstream', e => {
      remoteVideo.srcObject = event.stream
      remoteVideo.onloadedmetadata = function (e) {
        remoteVideo.play()
      }
    })
    pc.addStream(stream)

    if (!location.hash) {
      pc.createOffer()
        .then(offer => {
          pc.setLocalDescription(offer)
          return axios.post('/api?i=true', offer)
        })
        .then(({ data }) => {
          pc.setRemoteDescription(new RTCSessionDescription(data))
        })
    } else {
      axios.get('/get').then(({ data }) => {
        pc.setRemoteDescription(new RTCSessionDescription(data))
        pc.createAnswer().then(offer => {
          pc.setLocalDescription(offer)
          return axios.post('/api', offer)
        })
      })
    }
  })
