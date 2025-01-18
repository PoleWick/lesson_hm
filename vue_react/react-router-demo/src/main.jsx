
import { createRoot } from 'react-dom/client'
import Approuter from './router'
import './App.css';


// vue.use
// web应用离不开路由 react-router 丰富的组件
createRoot(document.getElementById('root')).render(
  <Approuter />
)
