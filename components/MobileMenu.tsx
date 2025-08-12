import { navigation } from '@data/data';
import {
    Dialog,
    DialogBackdrop,
    Transition,
    TransitionChild,
} from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/16/solid';
import { classNames } from '@utils/helper';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, {
    Dispatch,
    Fragment,
    ReactNode,
    SetStateAction,
    memo,
} from 'react';
import logo from '@public/logo.svg';
import Image from 'next/image';

interface MobileMenuProps {
    sidebarOpen: boolean;
    setSidebarOpen: Dispatch<SetStateAction<boolean>>;
}
function MobileMenu({
    sidebarOpen,
    setSidebarOpen,
}: MobileMenuProps): ReactNode {
    const pathName = usePathname();

    return (
        <div>
            {' '}
            <Transition show={sidebarOpen} as={Fragment}>
                <Dialog
                    as="div"
                    className="fixed inset-0 flex z-40 md:hidden font-sans"
                    onClose={() => setSidebarOpen(false)}
                >
                    <TransitionChild
                        as={Fragment}
                        enter="transition-opacity ease-linear duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="transition-opacity ease-linear duration-300"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <DialogBackdrop className="fixed inset-0 bg-gray-600 bg-opacity-75" />
                    </TransitionChild>
                    <TransitionChild
                        as={Fragment}
                        enter="transition ease-in-out duration-300 transform"
                        enterFrom="-translate-x-full"
                        enterTo="translate-x-0"
                        leave="transition ease-in-out duration-300 transform"
                        leaveFrom="translate-x-0"
                        leaveTo="-translate-x-full"
                    >
                        <div className="relative flex-1 flex flex-col max-w-xs w-full pt-5 pb-4 bg-primary-100">
                            <TransitionChild
                                as={Fragment}
                                enter="ease-in-out duration-300"
                                enterFrom="opacity-0"
                                enterTo="opacity-100"
                                leave="ease-in-out duration-300"
                                leaveFrom="opacity-100"
                                leaveTo="opacity-0"
                            >
                                <div className="absolute top-0 right-0 -mr-12 pt-2">
                                    <button
                                        type="button"
                                        className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                                        onClick={() => setSidebarOpen(false)}
                                    >
                                        <span className="sr-only">Close sidebar</span>
                                        <XMarkIcon
                                            className="h-6 w-6 text-white"
                                            aria-hidden="true"
                                        />
                                    </button>
                                </div>
                            </TransitionChild>
                            <div className="flex-shrink-0 flex items-center px-4">
                                <Image height={80} width={100} src={logo} alt="logo" />
                            </div>
                            <div className="mt-5 flex-1 h-0 flex flex-col justify-between overflow-y-auto">
                                <nav className="px-2 space-y-1">
                                    {navigation.slice(0, -2).map((item) => (
                                        <Link
                                            key={item.name}
                                            href={item.href}
                                            onClick={() => setSidebarOpen(false)}
                                            className={classNames(
                                                pathName.startsWith(item.href)
                                                    ? 'bg-secondary-400 text-primary-100'
                                                    : 'text-gray-300 hover:bg-gray-700 hover:text-secondary-100',
                                                'group flex items-center px-2 py-2 text-base font-medium rounded-md'
                                            )}
                                        >
                                            <item.icon
                                                className={classNames(
                                                    pathName.startsWith(item.href)
                                                        ? 'text-primary-100'
                                                        : 'text-gray-400 group-hover:text-gray-300',
                                                    'mr-4 flex-shrink-0 h-6 w-6 '
                                                )}
                                                aria-hidden="true"
                                            />
                                            {item.name}
                                        </Link>
                                    ))}
                                </nav>
                                <nav className="px-2 space-y-1">
                                    {navigation.slice(-2).map((item) => (
                                        <Link
                                            key={item.name}
                                            href={item.href}
                                            onClick={() => setSidebarOpen(false)}
                                            className={classNames(
                                                pathName.startsWith(item.href)
                                                    ? 'bg-secondary-400 text-primary-100'
                                                    : 'text-gray-300 hover:bg-gray-700 hover:text-secondary-100',
                                                'group flex items-center px-2 py-2 text-base font-medium rounded-md'
                                            )}
                                        >
                                            <item.icon
                                                className={classNames(
                                                    pathName.startsWith(item.href)
                                                        ? 'text-primary-100'
                                                        : 'text-gray-400 group-hover:text-gray-300',
                                                    'mr-4 flex-shrink-0 h-6 w-6 '
                                                )}
                                                aria-hidden="true"
                                            />
                                            {item.name}
                                        </Link>
                                    ))}
                                </nav>
                            </div>
                        </div>
                    </TransitionChild>
                    <div className="flex-shrink-0 w-14" aria-hidden="true"></div>
                </Dialog>
            </Transition>
        </div>
    );
}

export default memo(MobileMenu);
