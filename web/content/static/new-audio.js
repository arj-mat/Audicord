(() => {

    document.addEventListener('DOMContentLoaded', () => {
        if (!(window.AudioContext || window.webkitAudioContext)) {
            $('.recording-card-wide .mdl-card__supporting-text').html('<p>Audio recording is not supported by this browser.</p>');
            return;
        }

        $('#recorder button')[0].onclick = () => {
            startRecording();
        }

        $('#player .btn-submit').on('click', () => {
            submitRecording();
        });

        $('#player .btn-reset').on('click', () => {
            resetRecording();
        });
    });

    let recordingStartTime;
    let recorder;
    let mediaStream;

    var startRecording = () => {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        let audioContext = new AudioContext();

        navigator.mediaDevices.getUserMedia({
            audio: true,
            video: false
        })
            .then((stream) => {
                mediaStream = stream;
                recorder = new window.MediaRecorder(mediaStream);
                recorder.ondataavailable = (event) => {
                    audioChunks.push(event.data);

                    let duration = Date.now() - recordingStartTime;
                    let minutes = Math.floor( duration / 60000 );
                    let seconds = Math.floor( duration >= 60000 ? duration % 60000 : duration / 1000 );

                    $('#recorder .timer').html( `0${minutes}:${(seconds > 9 ? seconds : '0' + seconds)} <font color="gray">/ 01:00</font>` );

                    if (duration == 60) {
                        stopRecording();
                    }
                }

                recorder.onstop = recorderStopped;

                recorder.start(1000);
                recordingStartTime = Date.now();

                $('#recorder .timer').html( `00:00 <font color="gray">/ 01:00</font>` );

                $('#recorder button')[0].onclick = () => {
                    stopRecording();
                };

                $('#recorder button').css('background-color', 'coral');

                $('#recorder button').removeClass('btn-record').addClass('btn-stop');
            })
            .catch(error => {
                $('.recording-card-wide .mdl-card__supporting-text').html(`<p>Unable to access audio device<br>${String(error)}.</p>`);
            });
    }

    var stopRecording = () => {
        recorder.stop();
        mediaStream.getAudioTracks()[0].stop();
    }

    var recorderStopped = () => {
        audioBlob = new Blob(audioChunks, { 'type': 'audio/ogg; codecs=opus' });
        audioChunks = [];
        $('#recorder').css('display', 'none');
        $('#player').css('display', 'block');

        let audioElem = document.createElement('audio');
        audioElem.controls = true;
        audioElem.src = URL.createObjectURL(audioBlob);

        $('#player').prepend(audioElem);
    }

    let audioBlob;
    let audioChunks = [];

    var resetRecording = () => {
        recordingStartTime = 0;
        recorder = null;
        mediaStream = null;
        audioChunks = [];
        audioBlob = null;

        $('#player audio').remove();
        $('#recorder button')[0].onclick = () => {
            startRecording();
        }
        $('#recorder .timer').html( `00:00 <font color="gray">/ 01:00</font>` );
        $('#recorder').css('display', 'block');
        $('#player').css('display', 'none');
        $('#player .upload-failed').remove();
    }

    var submitRecording = () => {
        $('#submission-progress').css('display', 'block');
        $('#player').css('display', 'none');
        $('#player .upload-failed').remove();

        let reader = new FileReader();
        reader.onloadend = () => {
            jQuery.ajax({
                url: `${window.location.protocol}//${window.location.host}/submit-audio?token=${REQUEST_TOKEN}`,
                method: 'POST',
                dataType: 'json',
                data: encodeURIComponent(reader.result.split(',')[1]),
                contentType: 'application/octet-stream',
                processData: false,
                error: (ajax, status, error) => {
                    $('#submission-progress').css('display', 'none');
                    $('#player').css('display', 'block');
                    $('#player').append(`<p class="upload-failed">There was a problem while uploading your audio message.<br>${status} - ${error}</p>`);
                }
            })
                .done((data) => {
                    if (data && data.success)
                        $('#submission-progress').html(`Your audio message has been sent!<br>You can now close this page and return to Discord.`);
                    else {
                        $('#submission-progress').html(`<p class="upload-failed">Upload failed.<br>${String(data.error)}</p>`);
                    }
                })
        }
        reader.readAsDataURL(audioBlob);
    }
})();
