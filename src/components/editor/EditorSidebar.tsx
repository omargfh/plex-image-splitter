import Boundary from '@/components/Boundary';
import EditorButtonCollection from '@/components/editor/EditorButtonCollection';
import EditorImageInput from '@/components/editor/EditorImageInput';
import UnderlineLink from '@/components/links/UnderlineLink';

const EditorSidebar = () => {
  return (
    <div className='flex h-screen w-full flex-col justify-center gap-9 overflow-y-auto bg-gray-900 px-4 text-white'>
      <div className='flex h-screen flex-col justify-center gap-2 overflow-y-scroll'>
        <img
          src='/images/svg/logo.svg'
          alt='logo'
          className='mx-auto w-24 pb-2'
          style={{ filter: 'brightness(100)' }}
        />
        <EditorImageInput />
        <EditorButtonCollection />
        <footer className='border-gray-700 pt-1 text-center text-xs'>
          <Boundary />
          <p className='pt-4 text-center'>
            Created by{' '}
            <UnderlineLink href='https://github.com/omargfh'>
              Omar Ibrahim
            </UnderlineLink>
          </p>
        </footer>
      </div>
    </div>
  );
};

export default EditorSidebar;
