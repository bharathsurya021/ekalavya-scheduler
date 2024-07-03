import { Link } from 'react-router-dom';
import { styled } from '@mui/material';

const LinkStyled = styled(Link)(() => ({
  height: '70px',
  width: '180px',
  overflow: 'hidden',
  display: 'block',
  textDecoration: 'None',
  fontSize: '18px',
  color: '#f2f0f',
}));

const Logo = () => {
  return <LinkStyled to="/">Ekalavya</LinkStyled>;
};

export default Logo;
