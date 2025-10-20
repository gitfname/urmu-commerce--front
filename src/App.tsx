import { useEffect, lazy, Suspense } from "react"
import { Route, Routes } from "react-router-dom"
import WebsiteLayout from "./layouts/WebsiteLayout"
import myProfileStore from "./stores/MyProfileStore"
import ProtectedRoute from "./components/ProtectedRoute"

// pages
import Home from "./pages/Home"
import ProductSearch from "./pages/Search"
import Profile from "./pages/Profile"
import Profile__Overview from "./pages/Profile__Overview"
import Profile__Favorites from "./pages/Profile_Favorites"
// import Profile__PersonalInfo from "./pages/Profile__PersonalInfo"
// import Profile__Orders from "./pages/Profile__Orders"
// import Profile__Notifications from "./pages/Profile__Notifications"
// import Profile__MyAddresses from "./pages/Profile__MyAddresses"
// import Profile__Logout from "./pages/Profile__Logout"
// import LoginSignUp from "./pages/LoginSignUp"
// import ProductCompare from "./pages/ProductCompare/ProductCompare"
import SingleProductPage from "./pages/SingleProduct_v2/SingleProductPage"
import Cart from "./pages/Cart/Cart"
// import BlogPage from "./pages/Blog/BlogPage"
// import SingleArticle from "./pages/SingleArticle/SingleArticle"
// import FoundArticlesByTag from "./pages/FoundArticlesByTag/FoundArticlesByTag"
// import Checkout from "./pages/CheckOut/Checkout"
// import PaymentCallback from "./pages/Payment/Callback"
// import Profile__WholeSale from "./pages/Profile__WholeSale/Profile__WholeSale"
import WholeSaledProductsSearch from "./pages/WholeSaledProducts/WholeSaledProducts"
// import ContactUs from "./pages/ContactUs"
// import AmazingProducts from "./pages/AmazingProducts/AmazingProducts"
// import Dashboard from "./pages/Dashboard/Dashboard"
import ScrollTopOnNavigation from "./components/ScrollTopOnNavigation"
// import AvailableBrandOfCategory from "./pages/AvailableBrandOfCategory"
// import AboutUs from "./pages/AboutUs"

const Profile__Orders = lazy(() => import("./pages/Profile__Orders"))
const Profile__PersonalInfo = lazy(() => import("./pages/Profile__PersonalInfo"))
const Profile__Logout = lazy(() => import("./pages/Profile__Logout"))
const ProductCompare = lazy(() => import("./pages/ProductCompare/ProductCompare"))
const BlogPage = lazy(() => import("./pages/Blog/BlogPage"))
const SingleArticle = lazy(() => import("./pages/SingleArticle/SingleArticle"))
const FoundArticlesByTag = lazy(() => import("./pages/FoundArticlesByTag/FoundArticlesByTag"))
const Checkout = lazy(() => import("./pages/CheckOut/Checkout"))
const PaymentCallback = lazy(() => import("./pages/Payment/Callback"))
const Profile__WholeSale = lazy(() => import("./pages/Profile__WholeSale/Profile__WholeSale"))
const AboutUs = lazy(() => import("./pages/AboutUs"))
const AvailableBrandOfCategory = lazy(() => import("./pages/AvailableBrandOfCategory"))
const AmazingProducts = lazy(() => import("./pages/AmazingProducts/AmazingProducts"))
const Dashboard = lazy(() => import("./pages/Dashboard/Dashboard"))
const ContactUs = lazy(() => import("./pages/ContactUs"))
const LoginSignUp = lazy(() => import("./pages/LoginSignUp"))

function App() {

  useEffect(() => { myProfileStore.fetchMyProfile() }, [])
  
  useEffect(() => {
    // Goftino Chat Widget Script
    const goftinoScript = document.createElement('script');
    goftinoScript.innerHTML = `
      !function(){var i="tT8GDR",a=window,d=document;function g(){var g=d.createElement("script"),s="https://www.goftino.com/widget/"+i,l=localStorage.getItem("goftino_"+i);g.async=!0,g.src=l?s+"?o="+l:s;d.getElementsByTagName("head")[0].appendChild(g);}"complete"===d.readyState?g():a.attachEvent?a.attachEvent("onload",g):a.addEventListener("load",g,!1);}();
    `;
    document.head.appendChild(goftinoScript);
    
    return () => {
      // Clean up the script when component unmounts
      if (goftinoScript.parentNode) {
        document.head.removeChild(goftinoScript);
      }
    };
  }, [])

  return (
    <Routes>

      <Route
        index
        element={
          <WebsiteLayout>
            <Home />
          </WebsiteLayout>
        }
      />

      <Route
        path="/products/:id"
        element={
          <ScrollTopOnNavigation>
            <WebsiteLayout>
              <SingleProductPage
                breadcrumbs={[
                  { title: 'خانه', href: '/' },
                  { title: 'دسته‌بندی', href: '/category' },
                  { title: 'محصول', href: '#', isActive: true }
                ]}
              />
            </WebsiteLayout>
          </ScrollTopOnNavigation>
        }
      />

      <Route
        path="/available-brands/:brandCategoryId"
        element={
          <WebsiteLayout>
            <Suspense>
              <AvailableBrandOfCategory />
            </Suspense>
          </WebsiteLayout>
        }
      />

      <Route
        path="/cart"
        element={
          <WebsiteLayout>
            <ProtectedRoute>
              <Cart />
            </ProtectedRoute>
          </WebsiteLayout>
        }
      />

      <Route
        path="/checkout"
        element={
          <WebsiteLayout>
            <ProtectedRoute>
              <Suspense><Checkout /></Suspense>
            </ProtectedRoute>
          </WebsiteLayout>
        }
      />

      <Route
        path="/payment/callback"
        element={
          <WebsiteLayout>
            <ProtectedRoute>
              <Suspense><PaymentCallback /></Suspense>
            </ProtectedRoute>
          </WebsiteLayout>
        }
      />

      <Route
        path="/aboutUs"
        element={
          <WebsiteLayout>
            <Suspense><AboutUs /></Suspense>
          </WebsiteLayout>
        }
      />

      <Route
        path="/contactUs"
        element={
          <WebsiteLayout>
            <Suspense><ContactUs /></Suspense>
          </WebsiteLayout>
        }
      />

      <Route
        path="/compare"
        element={
          <WebsiteLayout>
            <Suspense><ProductCompare /></Suspense>
          </WebsiteLayout>
        }
      />

      <Route
        path="/search"
        element={
          <ScrollTopOnNavigation>
            <WebsiteLayout>
              <ProductSearch />
            </WebsiteLayout>
          </ScrollTopOnNavigation>
        }
      />

      <Route
        path="/amazing-products"
        element={
          <ScrollTopOnNavigation>
            <WebsiteLayout>
              <Suspense>
                <AmazingProducts />
              </Suspense>
            </WebsiteLayout>
          </ScrollTopOnNavigation>
        }
      />

      <Route
        path="/whole-sale-products"
        element={
          <ScrollTopOnNavigation>
            <WebsiteLayout>
              <WholeSaledProductsSearch />
            </WebsiteLayout>
          </ScrollTopOnNavigation>
        }
      />

      <Route
        path="/blog"
        element={
          <ScrollTopOnNavigation>
            <WebsiteLayout>
              <Suspense><BlogPage /></Suspense>
            </WebsiteLayout>
          </ScrollTopOnNavigation>
        }
      />

      <Route
        path="/articles/tags/:tag"
        element={
          <ScrollTopOnNavigation>
            <WebsiteLayout>
              <Suspense><FoundArticlesByTag /></Suspense>
            </WebsiteLayout>
          </ScrollTopOnNavigation>
        }
      />

      <Route
        path="/articles/:slug"
        element={
          <ScrollTopOnNavigation>
            <WebsiteLayout>
              <Suspense><SingleArticle /></Suspense>
            </WebsiteLayout>
          </ScrollTopOnNavigation>
        }
      />

      <Route
        path="/login-register"
        element={
          <WebsiteLayout>
            <Suspense>
              <LoginSignUp />
            </Suspense>
          </WebsiteLayout>
        }
      />

      <Route
        path="/dashboard"
        element={
          <WebsiteLayout>
            <ProtectedRoute requireAdmin requireSuperAdmin>
              <Suspense>
                <Dashboard />
              </Suspense>
            </ProtectedRoute>
          </WebsiteLayout>
        }
      />

      <Route
        path="/profile"
        element={
          <ScrollTopOnNavigation>
            <WebsiteLayout>
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            </WebsiteLayout>
          </ScrollTopOnNavigation>
        }
      >
        <Route index element={<Profile__Overview />} />
        <Route path="my-orders" element={<Suspense><Profile__Orders /></Suspense>} />
        <Route path="my-favorites" element={<Profile__Favorites />} />
        {/* <Route path="notifications" element={<Profile__Notifications />} /> */}
        {/* <Route path="my-addresses" element={<Profile__MyAddresses />} /> */}
        <Route path="personal-info" element={<Suspense><Profile__PersonalInfo /></Suspense>} />
        <Route path="whole-sale" element={<Suspense><Profile__WholeSale /></Suspense>} />
      </Route>

      <Route
        path="/logout"
        element={
          <WebsiteLayout>
            <Suspense><Profile__Logout /></Suspense>
          </WebsiteLayout>
        }
      />

    </Routes>
  )
}

export default App