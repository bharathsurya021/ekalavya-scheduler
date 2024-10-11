import { Link } from 'react-router-dom';
import { styled } from '@mui/material';

const LinkStyled = styled(Link)(() => ({
  height: '70px',
  width: '180px',
  overflow: 'hidden',
  display: 'block',
}));

const Logo = () => {
  return <LinkStyled to="/">Logo</LinkStyled>;
};

export default Logo;
