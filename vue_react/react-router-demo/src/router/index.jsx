import {
    BrowserRouter,
    Routes,
    Route
} from 'react-router-dom'
import App from '../App'
import About from '../pages/About'
import Home from '../pages/Home'
import NotFound from '../pages/NotFound'
import { postRoutes } from '../pages/post/post.routes'

const AppRouter = () => {
    return (
        <BrowserRouter>
            {/* 这样可以避免不必要的路由匹配尝试，并确保应用按预期工作。 */}
            <Routes>
                <Route path="/" element={<App />} />
                < Route index element={<Home />} />
                <Route path="/about" element={<About />} />
                { postRoutes }
                {/* 这里的星号(*)是一个通配符，意味着它可以匹配任何没有被前面的 <Route> 定义所匹配的路径 */}
                <Route path="*" element={<NotFound />} />
            </Routes>
        </BrowserRouter>
    )
}

export default AppRouter