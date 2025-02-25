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

export default function App(){
  return(
    <Router>
      <Routes>
        { routes.map(route => <Route key={route.path} path={route.path} elment={<route.component />}/>) }
      </Routes> 
    </Router>
  )
}