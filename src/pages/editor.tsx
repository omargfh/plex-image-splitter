import * as React from 'react';

import EditorCanvas from '@/components/editor/EditorCanvas';
import EditorSidebar from '@/components/editor/EditorSidebar';
import Layout from '@/components/layout/Layout';
import Seo from '@/components/Seo';

import { EditorProvider } from '@/store/editor';

export default function HomePage() {
  return (
    <Layout>
      {/* <Seo templateTitle='Home' /> */}
      <Seo />

      <EditorProvider>
        <div className='flex'>
          <aside className='h-screen w-[320px]'>
            <EditorSidebar />
          </aside>
          <main className='h-screen w-full'>
            <EditorCanvas />
          </main>
        </div>
      </EditorProvider>
    </Layout>
  );
}
