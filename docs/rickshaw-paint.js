/* Paint after the frame from personal.mp4, in its original 720 × 1280 coordinates.
   The player owns clearing any transparent lettering canvas before each repaint. */
function drawThirdNames(ctx, seconds, firstName, secondName) {
  const ramp = (start, end) => Math.max(0, Math.min(1, (seconds - start) / (end - start)));
  const first = String(firstName || '').trim();
  const second = String(secondName || '').trim();
  function line(value,x,y,size,width,colour,opacity,italic) {
    ctx.globalAlpha = opacity;
    ctx.fillStyle = colour;
    ctx.font = (italic ? 'italic ' : '') + size + 'px Georgia, serif';
    ctx.fillText(value, x, y, width);
  }
  ctx.save();
  ctx.textAlign = 'center';
  ctx.textBaseline = 'alphabetic';
  if (seconds < 7.60) {
    // The lettering enters with its own parallax, then follows the rickshaw wall.
    const dx = 161 * Math.max(0, 2.84 - seconds) - 108.5 * Math.max(0, seconds - 4.32);
    const leave = 1-ramp(7.36,7.60);
    const ink = '#781012';
    const initials = (Array.from(first)[0] || '') + ' · ' + (Array.from(second)[0] || '');
    line(initials,347+dx,734,89,195,ink,ramp(.13,1.9)*leave,true);
    line(first+' & '+second,350+dx,824,38,253,ink,ramp(1.7,2.9)*leave,false);
  } else if (seconds >= 13 && seconds <= 36.23) {
    // The paper stops for reading, zooms back, and travels off-camera.
    const zoom = ramp(34.02,35.32);
    const s = 1-.1931*zoom;
    const x = 43.6*zoom - Math.max(0,seconds-35.32)*125;
    const y = 141.75*zoom;
    ctx.translate(x,y);ctx.scale(s,s);
    const leave = 1-ramp(35.80,36.08);
    line(first,360,418,64,555,'#b77320',ramp(13.17,13.98)*leave,false);
    line(second,341,733,64,555,'#b77320',ramp(13.53,14.35)*leave,false);
  }
  ctx.restore();
}
