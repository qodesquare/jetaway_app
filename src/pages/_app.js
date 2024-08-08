import "@/styles/tabler.css"
import '@/styles/tabler-vendors.css'
import '@/styles/fontawesome_free_6/css/all.css'

import '@/styles/custom.css';

import Layout from "./layout"

import store from '../store/store'
import { Provider } from 'react-redux'

export default function App({ Component, pageProps }) {

  return (
    <Provider store={store}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </Provider>
  );
}
