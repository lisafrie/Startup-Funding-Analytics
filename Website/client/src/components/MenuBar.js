import React from 'react';
import {
    Navbar,
    NavbarBrand,
    Nav,
    NavItem,
    NavLink
  } from "shards-react";

class MenuBar extends React.Component {
    render() {
        return(
            <Navbar type="dark" theme="secondary" expand="md">
        <NavbarBrand href="/">Home</NavbarBrand>
          <Nav navbar>
            <NavItem>
              <NavLink active href="/dashboard">
                Dashboard
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink active  href="/company">
                Company
              </NavLink>
            </NavItem>
            <NavItem>
            <NavLink active href="/investor">
                Investor
              </NavLink>
            </NavItem>
          </Nav>
      </Navbar>
        )
    }
}

export default MenuBar
