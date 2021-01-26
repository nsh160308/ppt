import React from 'react';
import { Menu } from 'antd';
const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;
const MenuStyle = {
  fontSize:"14px",
  fontFamily:"Georgia",
  fontWeight:"bold",
}


function LeftMenu(props) {
  return (
    <Menu mode={props.mode}>
    <Menu.Item key="Subscription">
      <a href="/subscription" style={MenuStyle}>Favorite Video</a>
    </Menu.Item>
{/*     
    <SubMenu title={<span>프로젝트</span>}>
      <MenuItemGroup title="2개의 프로젝트가 있습니다.">
        <Menu.Item key="Shop"><a href="/Shop">쇼핑몰</a></Menu.Item>
        <Menu.Item key="Tube"><a href="/MyTube">*튜브</a></Menu.Item>
      </MenuItemGroup>
    </SubMenu> */}

{/* 수정 */}
    <Menu.Item key="Lookbook">
      <a href="/Mytube" style={MenuStyle}>Lookbook</a>
    </Menu.Item>
    <Menu.Item key="All">
      <a href="/Shop" style={MenuStyle}>All Items</a>
    </Menu.Item>
    <Menu.Item key="Outer">
      <a href="/Shop" style={MenuStyle}>Outer</a>
    </Menu.Item>
    <SubMenu style={MenuStyle} title={<span>Top</span>}>
      <MenuItemGroup>
        <Menu.Item key="LongSleeve"><a href="/Shop" style={MenuStyle}>Long Sleeve</a></Menu.Item>
        <Menu.Item key="ShortSleeve"><a href="/Shop" style={MenuStyle}>Short Sleeve</a></Menu.Item>
      </MenuItemGroup>
    </SubMenu>
    <SubMenu style={MenuStyle} title={<span>Bottom</span>}>
      <MenuItemGroup>
        <Menu.Item key="Jean"><a href="/Shop" style={MenuStyle}>Jean</a></Menu.Item>
        <Menu.Item key="Pants"><a href="/Shop" style={MenuStyle}>Pants</a></Menu.Item>
      </MenuItemGroup>
    </SubMenu>


  </Menu>

  )
}

export default LeftMenu