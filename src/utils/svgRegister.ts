import Facebook from '../assets/icons/facebook.svg';
import Twitter from '../assets/icons/twitter.svg'
import Linkedin from '../assets/icons/linkedin.svg'

export interface ISvg {
  icon?: string;
  width?: number;
  height?: number;
  className?: string;
  stroke?: string;
  fill?: string;
  onClick?: () => void;
}

const svgRegister = {
  facebook: Facebook,
  twitter: Twitter,
  linkedin: Linkedin
} as unknown as { [key: string]: React.FC<ISvg> };

export default svgRegister;
