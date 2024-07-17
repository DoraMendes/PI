'use client';
// Chakra imports
import {
  Portal,
  Box,
  useDisclosure,
  useColorModeValue,
} from '@chakra-ui/react';
import Footer from 'components/footer/FooterAdmin';
// Layout components
import Navbar from 'components/navbar/NavbarAdmin';
import Sidebar from 'components/sidebar/Sidebar';
import { SidebarContext, } from 'contexts/SidebarContext';
import { subscribe } from 'messagesRequests';
import { usePathname } from 'next/navigation';
import { PropsWithChildren, useEffect, useState, } from 'react';
import routes from 'routes';
import { WebsocketClient, } from 'socket';
import {
  getActiveNavbar,
  getActiveNavbarText,
  getActiveRoute,
} from 'utils/navigation';

interface DashboardLayoutProps extends PropsWithChildren {
  [x: string]: any;
}

// Custom Chakra theme
export default function AdminLayout(props: DashboardLayoutProps) {
  const { children, ...rest } = props;
  // states and functions
  const [fixed,] = useState(false);
  const [,setRefresh] = useState(0);
  const [toggleSidebar, setToggleSidebar,] = useState(false);
  // functions for changing the states from components
  const { onOpen, } = useDisclosure();

  useEffect(() => {
    window.document.documentElement.dir = 'ltr';
  });

  const a = usePathname()

  useEffect(() => {
    setRefresh(new Date().getTime())
  }, [a]);


  const urlB64ToUint8Array = (base64String: string) =>  {
      const padding = '='.repeat((4 - base64String.length % 4) % 4);
      const base64 = (base64String + padding)
        .replace(/\-/g, '+')
        .replace(/_/g, '/');

      const rawData = atob(base64);
      const outputArray = new Uint8Array(rawData.length);

      for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
      }
      return outputArray;
  }

  const b = async () => {
      const result = await Notification.requestPermission();
      if (result === 'denied') {
        console.error('The user explicitly denied the permission request.');
        return;
      }
      if (result === 'granted') { 
        const subscription = await (await navigator.serviceWorker.getRegistration())
            .pushManager.subscribe({ userVisibleOnly: true,  applicationServerKey: urlB64ToUint8Array(process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY) });
        if (subscription) {
            subscribe(subscription.toJSON()); 
        }
        console.info('The user accepted the permission request.');
      }
  };

  useEffect(() => {
      WebsocketClient.init();
      if ('serviceWorker' in navigator && 'PushManager' in window) {
        navigator.serviceWorker.register('/service-worker.js').then(serviceWorkerRegistration => {
          console.info('Service worker was registered.');
          b();
        }).catch(error => {
          console.error('An error occurred while registering the service worker.');
        });
      } else {
        console.error('Browser does not support service workers or push messages.');
      }
  }, [])

  const bg = useColorModeValue('secondaryGray.300', 'navy.900');

  return (
    <Box h="100vh" w="100vw" bg={bg}>
      <SidebarContext.Provider
        value={{
          toggleSidebar,
          setToggleSidebar,
        }}
      >
        <Sidebar routes={routes} display="none" {...rest} />
        <Box
          float="right"
          minHeight="100vh"
          height="100%"
          overflow="auto"
          position="relative"
          maxHeight="100%"
          w={{ base: '100%', xl: 'calc( 100% - 290px )', }}
          maxWidth={{ base: '100%', xl: 'calc( 100% - 290px )', }}
          transition="all 0.33s cubic-bezier(0.685, 0.0473, 0.346, 1)"
          transitionDuration=".2s, .2s, .35s"
          transitionProperty="top, bottom, width"
          transitionTimingFunction="linear, linear, ease"
        >
          <Portal>
            <Box>
              <Navbar
                onOpen={onOpen}
                logoText={'Horizon UI Dashboard PRO'}
                brandText={getActiveRoute(routes)}
                secondary={getActiveNavbar(routes)}
                message={getActiveNavbarText(routes)}
                fixed={fixed}
                {...rest}
              />
            </Box>
          </Portal>

          <Box
            mx="auto"
            p={{ base: '20px', md: '30px', }}
            pe="20px"
            minH="100vh"
            pt="50px"
          >
            {children}
          </Box>
          <Box>
            <Footer />
          </Box>
        </Box>
      </SidebarContext.Provider>
    </Box>
  );
}
