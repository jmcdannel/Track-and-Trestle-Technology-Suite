
import useMediaQuery from '@mui/material/useMediaQuery';

export function useBreakpoints() {
  const isXs = useMediaQuery(theme => theme.breakpoints.down('xs'));
  const isSm = useMediaQuery(theme => theme.breakpoints.down('sm'));
  const isMd = useMediaQuery(theme => theme.breakpoints.down('md'));
  const isLg = useMediaQuery(theme => theme.breakpoints.down('lg'));
  const isXl = useMediaQuery(theme => theme.breakpoints.down('xl'));

  const getCurrentSize = () => {
    if (isXs) return 'xs';
    if (isSm) return 'sm';
    if (isMd) return 'md';
    if (isLg) return 'lg';
    if (isXl) return 'xl';
    return 'unknown';
  }

  return { isXs, isSm, isMd, isLg, isXl, getCurrentSize }
}

export default useBreakpoints;
