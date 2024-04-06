import Google from '../assets/icons/google.svg';

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
  google: Google,
} as unknown as { [key: string]: React.FC<ISvg> };

export default svgRegister;
