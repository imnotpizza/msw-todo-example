import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { startMsw } from './mocks/startMsw.ts';

/** 
 * NEXT_PUBLIC_MSW_ENABLED env 주입된 경우만 실행
*/
(() => {
  const mswEnabled = import.meta.env.NEXT_PUBLIC_MSW_ENABLED === 'true';
  if (mswEnabled) {
    startMsw();
  }
})();


async function enableMocking() {


  const { worker } = await import('./mocks/browser')

  return worker.start()
}

enableMocking().then(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
})
