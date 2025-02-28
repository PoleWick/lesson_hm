import React from 'react';
// 前后端分离 前端独立的路由功能
import {
  // HashRouter as Router
  // ES6 模块化语法
  BrowserRouter as Router,// hash #,history /
  Routes,
  Route
} from 'react-router-dom'
import routes from './router'
import { ConfigProvider, Button } from 'zarm'
import 'zarm/dist/zarm.css'

export default function App(){
  return(
    <ConfigProvider primaryColor='#007fff'>
      <Router>
        <Routes>
          { routes.map(route => <Route key={route.path} path={route.path} elment={<route.component />}/>) }
        </Routes>
        <Button theme="primary">Hello World!</Button> 
      </Router>
    </ConfigProvider>
  )
}