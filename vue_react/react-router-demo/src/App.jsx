// 页面级别组件
// 二级路由 about  /about

import {
  Outlet,
  NavLink
} from "react-router-dom"
function App() {
  return (
    <>
      <header>
        <nav>
          <NavLink to="/">Home</NavLink>
          <NavLink to="/about">About</NavLink>
        </nav>
        <br />
      </header>
      <Outlet />
    </>
  )
}
export default App