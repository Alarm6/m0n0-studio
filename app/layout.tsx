import type { Metadata } from "next";
export const metadata:Metadata={title:"m0n0 — интерактивная digital-студия",description:"Сайты, с которыми интересно взаимодействовать"};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="ru"><body>{children}</body></html>}