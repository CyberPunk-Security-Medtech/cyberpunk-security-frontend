import { usePathname } from 'next/navigation';
import React, { Dispatch, ReactNode, SetStateAction, memo } from 'react';
import { motion } from 'motion/react';
import { ArrowLeftIcon } from '@heroicons/react/16/solid';
import { navigation } from '@data/data';
import Link from 'next/link';
import { classNames } from '@utils/helper';
import Image from 'next/image';
import logo from '@public/logo.svg';

interface MdMenuProps {
    sidebarMinimize: boolean;
    setSidebarMinimize: Dispatch<SetStateAction<boolean>>;
}

function MdMenu({
    sidebarMinimize,
    setSidebarMinimize,
}: MdMenuProps): ReactNode {
    const pathName = usePathname();
    return (
        <>
            <motion.div
                key={`${sidebarMinimize}`}
                initial={{ width: 60 }}
                animate={{ width: sidebarMinimize ? 60 : 150 }}
                transition={{ type: 'spring' }}
                className="hidden md:flex md:w-full md:flex-col md:inset-y-0 h-[100vh]"
            >
                <div className="flex-1 flex flex-col min-h-0 bg-primary-800">
                    <div className="flex items-center justify-between h-16 flex-shrink-0 px-2">
                        <section className="">
                            <Image
                                onClick={() => {
                                    setSidebarMinimize(!sidebarMinimize);
                                }}
                                className="rounded-md w-[100px] h-[80px] cursor-pointer p-2"
                                src={logo}
                                width={100}
                                height={80}
                                alt="logo"
                            />
                        </section>

                        <button
                            type="button"
                            className={sidebarMinimize ? `hidden` : `block`}
                            onClick={() => {
                                setSidebarMinimize(!sidebarMinimize);
                            }}
                        >
                            <ArrowLeftIcon className="w-4 text-secondary-100 border-l border-secondary-100" />
                        </button>
                    </div>
                    <div className="flex-1 flex flex-col overflow-y-auto h-full">
                        <nav className="flex-1 px-2 py-4 space-y-1">
                            {navigation.slice(0, -2).map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={classNames(
                                        pathName.startsWith(item.href)
                                            ? 'bg-secondary-400 text-primary-100'
                                            : 'text-gray-300 hover:bg-gray-700 hover:text-secondary-100',
                                        'group flex items-center text-sm font-medium rounded-md'
                                    )}
                                >
                                    <item.icon
                                        className={classNames(
                                            pathName.startsWith(item.href)
                                                ? 'text-primary-100'
                                                : 'text-gray-400 group-hover:text-gray-300',
                                            `${sidebarMinimize ? '' : ''} flex-shrink-0 w-10 p-2 rounded-md`
                                        )}
                                        aria-hidden="true"
                                    />
                                    {sidebarMinimize ? '' : item.name}
                                </Link>
                            ))}
                        </nav>
                        <nav className="px-2 py-4 space-y-1">
                            {navigation.slice(-2).map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={classNames(
                                        pathName.startsWith(item.href)
                                            ? 'bg-secondary-400 text-primary-100'
                                            : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                                        'group flex items-center text-sm font-medium rounded-md'
                                    )}
                                >
                                    <item.icon
                                        className={classNames(
                                            pathName.startsWith(item.href)
                                                ? 'text-primary-100'
                                                : 'text-gray-400 group-hover:text-gray-300',
                                            `${sidebarMinimize ? '' : ''} flex-shrink-0 w-10 p-2 rounded-md`
                                        )}
                                        aria-hidden="true"
                                    />
                                    {sidebarMinimize ? '' : item.name}
                                </Link>
                            ))}
                        </nav>
                    </div>
                </div>
            </motion.div>
        </>
    );
}

export default memo(MdMenu);
