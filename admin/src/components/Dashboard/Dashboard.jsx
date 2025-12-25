import { Layout} from 'antd';
import { Outlet } from 'react-router-dom';
const { Header, Content, Footer, Sider } = Layout;
import styles from './Dashboard.module.css';
import Menu from './Menu/Menu';



const Dashboard = () => {

   return (
      <Layout style={{ minHeight: '100vh' }}>
         <Sider collapsible >
            <Menu/>
         </Sider>
         <Layout>
            <Content style={{  backgroundColor: 'white' }}>
               <div
                  className={styles.contentContainer}
               >
                  <Outlet/>
               </div>
            </Content>
         </Layout>
      </Layout>
   );
};


export default Dashboard;
