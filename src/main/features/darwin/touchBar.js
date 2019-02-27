import { app, TouchBar } from 'electron';
import path from 'path';

const { TouchBarButton, TouchBarSlider, TouchBarSpacer } = TouchBar;

let playing = false;
let mainWindow;
let mediaSlider;
let renderTouchBar = () => {};
const _getTouchBar = () => {
  // Previous track button
  const prevTrack = new TouchBarButton({
    icon: path.resolve(`${__dirname}/../../../assets/img/media_controls/previous.png`),
    click: () => {
      Emitter.sendToGooglePlayMusic('playback:previousTrack');
      renderTouchBar();
    },
  });

  // Play button
  const play = new TouchBarButton({
    icon: path.resolve(`${__dirname}/../../../assets/img/media_controls/${(playing ? 'pause' : 'play')}.png`),
    click: () => {
      Emitter.sendToGooglePlayMusic('playback:playPause');
      renderTouchBar();
    },
  });

  // Next track button
  const nextTrack = new TouchBarButton({
    icon: path.resolve(`${__dirname}/../../../assets/img/media_controls/next.png`),
    click: () => {
      Emitter.sendToGooglePlayMusic('playback:nextTrack');
      renderTouchBar();
    },
  });

  // media slider
  const time = PlaybackAPI.currentTime();
  mediaSlider = new TouchBarSlider({
    value: time.current,
    maxValue: time.total,
    change: (newValue) => {
      Emitter.sendToGooglePlayMusic('playback:seek', newValue);
    },
  });

  // Thumb up track button
  const thumbsUp = new TouchBarButton({
    label: '👍',
    click: () => {
      Emitter.sendToGooglePlayMusic('playback:thumbsUp');
      renderTouchBar();
    },
  });

  // Thumb down track button
  const thumbsDown = new TouchBarButton({
    label: '👎',
    click: () => {
      Emitter.sendToGooglePlayMusic('playback:thumbsDown');
      renderTouchBar();
    },
  });

  const touchBar = new TouchBar([
    prevTrack,
    play,
    nextTrack,
    new TouchBarSpacer({ size: 'small' }),
    mediaSlider,
    new TouchBarSpacer({ size: 'small' }),
    thumbsUp,
    thumbsDown,
  ]);

  return touchBar;
};

renderTouchBar = () => {
  mainWindow = WindowManager.getAll('main')[0];
  if (mainWindow) {
    mainWindow.setTouchBar(_getTouchBar());
  } else {
    // Something went wrong
    app.quit();
  }
};

app.on('browser-window-focus', renderTouchBar);

PlaybackAPI.on('change:state', (nextState) => {
  playing = nextState;
  renderTouchBar();
});

PlaybackAPI.on('change:time', ({ current }) => {
  mediaSlider.value = current;
});
