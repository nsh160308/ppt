import React from 'react';
import { Menu } from 'antd';
const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;

function LeftMenu(props) {
  return (
    <Menu mode={props.mode}>
    <Menu.Item key="Subscription">
      <a href="/subscription">구독 영상</a>
    </Menu.Item>
    <SubMenu title={<span>프로젝트</span>}>
      <MenuItemGroup title="2개의 프로젝트가 있습니다.">
        <Menu.Item key="Shop"><a href="/Shop">쇼핑몰</a></Menu.Item>
        <Menu.Item key="Tube"><a href="/MyTube">*튜브</a></Menu.Item>
      </MenuItemGroup>
      
    </SubMenu>
  </Menu>
  )
}

export default LeftMenu