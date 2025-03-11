import React from 'react';
import { NavBar } from 'zarm';
import { useNavigate } from 'react-router-dom';
import s from './style.module.less';

const Header = ({ title = '' }) => {
  const navigate = useNavigate();
  return (
    <div className={s.headerWrap}>
      <NavBar
        className={s.header}
        left={<span onClick={() => navigate(-1)}>返回</span>}
        title={title}
      />
    </div>
  );
};

export default Header;