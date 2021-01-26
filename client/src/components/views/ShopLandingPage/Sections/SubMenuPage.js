import React from 'react'
import { Menu } from 'antd';
const { SubMenu } = Menu;

function SubMenuPage(props) {

    const onClick = (e) => {
        console.log('onClick', e);
        let newFilter = [];
        newFilter.push(parseInt(e.key))
        props.handleFilters(newFilter);
    }

    return (
        <div>
            <Menu
                onClick={onClick}
                style={{ width: 256 }}
                mode="inline"
            >
                <SubMenu key="sub" title="분류">
                    <SubMenu key="Outer" title="Outer">
                        <Menu.Item key="1">Jackets</Menu.Item>
                        <Menu.Item key="2">Coat</Menu.Item>
                    </SubMenu>
                    <SubMenu key="Top" title="Top">
                        <Menu.Item key="3">Long Sleeve</Menu.Item>
                        <Menu.Item key="4">Short Sleeve</Menu.Item>
                    </SubMenu>
                    <SubMenu key="Bottom" title="Bottom">
                        <Menu.Item key="5">Jeans</Menu.Item>
                        <Menu.Item key="6">Pants</Menu.Item>
                    </SubMenu>
                </SubMenu>
            </Menu>
        </div>
    )
}

export default SubMenuPage
