export const WAY_UP_STEP = 5;

export const roadClassName = (loco) => {
  return loco.road.toLowerCase().replace(/ /g, '-');
}

export const formattedAddress = (loco) => loco?.address && loco.address.length > 2
  ? loco.address.substring(0, 2)
  : loco.address;