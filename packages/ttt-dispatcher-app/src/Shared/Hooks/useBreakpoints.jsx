
import useMediaQuery from '@mui/material/useMediaQuery';

export function useBreakpoints() {
  const isXs = useMediaQuery(theme => theme.breakpoints.down('xs'));
  const isSm = useMediaQuery(theme => theme.breakpoints.down('sm'));
  const isMd = useMediaQuery(theme => theme.breakpoints.down('md'));
  const isLg = useMediaQuery(theme => theme.breakpoints.down('lg'));
  const isXl = useMediaQuery(theme => theme.breakpoints.down('xl'));

  const isXsUp = useMediaQuery(theme => theme.breakpoints.up('xs'));
  const isSmUp = useMediaQuery(theme => theme.breakpoints.up('sm'));
  const isMdUp = useMediaQuery(theme => theme.breakpoints.up('md'));
  const isLgUp = useMediaQuery(theme => theme.breakpoints.up('lg'));
  const isXlUp = useMediaQuery(theme => theme.breakpoints.up('xl'));

  const getCurrentSize = () => {
    if (isXs) return 'xs';
    if (isSm) return 'sm';
    if (isMd) return 'md';
    if (isLg) return 'lg';
    if (isXl) return 'xl';
    return 'unknown';
  }

  const up = {
    xs: isXsUp,
    sm: isSmUp,
    md: isMdUp,
    lg: isLgUp,
    xl: isXlUp
  }

  const down = {
    xs: isXs,
    sm: isSm,
    md: isMd,
    lg: isLg,
    xl: isXl
  }

  return [ 
    isXs, 
    isSm, 
    isMd, 
    isLg, 
    isXl,
    up,
    down,
    getCurrentSize 
  ]
}

export default useBreakpoints;
