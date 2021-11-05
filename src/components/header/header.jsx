import React from 'react';
import { Link } from 'react-router-dom';
import { Typography } from 'antd';

import logo from '../../assets/header/logo.png'
import './header.css'

const { Title } = Typography;

const WebHeader = ({ accountAddress, accountBalance }) =>  (
    <div>
        <div className="header">
            <img className="header-logo" src={logo} alt="校徽" />
            <div className="header-title">
                <Title level={2}>NFT拍卖平台</Title>
            </div>
            <div className="header-state-on">
                <h4>账号地址 : {accountAddress}</h4>
            </div>
        </div>
        <nav className="navbar navbar-expand-sm bg-light navbar-black">
            <ul
            className="navbar-nav"
            >
            <li className="nav-item">
                <Link to="/" className="nav-link">
                首页
                </Link>
            </li>
            <li className="nav-item">
                <Link to="/marketplace" className="nav-link">
                拍卖市场
                </Link>
            </li>
            <li className="nav-item">
                <Link to="/createNFT" className="nav-link">
                铸造代币
                </Link>
            </li>
            </ul>
        </nav>
    </div>
)

export default WebHeader