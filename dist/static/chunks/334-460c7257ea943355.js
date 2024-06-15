"use strict";(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[334],{2540:function(e,n,t){t.d(n,{T:function(){return s}});var l=t(5893),r=t(2734);let s=()=>{let e=(0,r.Z)(),n=e.palette.primary.main;return(0,l.jsxs)("svg",{fill:"none",height:"100%",viewBox:"0 0 24 24",width:"100%",xmlns:"http://www.w3.org/2000/svg",children:[(0,l.jsx)("path",{opacity:.16,d:"M7.242 11.083c.449-1.674 2.17-3.394 3.843-3.843l10.434-2.796c1.673-.448 2.666.545 2.218 2.218L20.94 17.096c-.449 1.674-2.17 3.394-3.843 3.843L6.664 23.735c-1.673.448-2.666-.545-2.218-2.218l2.796-10.434Z",fill:n}),(0,l.jsx)("path",{d:"M3.06 6.9c.448-1.674 2.168-3.394 3.842-3.843L17.336.261c1.673-.448 2.667.545 2.218 2.218l-2.796 10.434c-.449 1.674-2.169 3.394-3.843 3.843L2.481 19.552C.808 20-.185 19.007.263 17.334L3.06 6.9Z",fill:n})]})}},2377:function(e,n,t){t.d(n,{L:function(){return o}});var l=t(7297),r=t(4096),s=t(948);function i(){let e=(0,l.Z)([""]);return i=function(){return e},e}let o=(0,s.ZP)(r.Z)(i())},2662:function(e,n,t){t.d(n,{a:function(){return s}});var l=t(7294),r=t(3521);let s=()=>(0,l.useContext)(r.Vo)},8334:function(e,n,t){t.d(n,{A:function(){return X}});var l,r=t(5893),s=t(7294),i=t(9332),o=t(948),a=t(1163),c=t(5697),p=t.n(c),h=t(3521);let x=e=>{let{children:n}=e,t=(0,a.useRouter)(),{isAuthenticated:l}=(0,h.Eu)(),r=(0,s.useRef)(!1),[i,o]=(0,s.useState)(!1);return((0,s.useEffect)(()=>{t.isReady&&!r.current&&(r.current=!0,l?o(!0):(console.log("Not authenticated, redirecting"),t.replace({pathname:"/auth/login",query:"/"!==t.asPath?{continueUrl:t.asPath}:void 0}).catch(console.error)))},[t.isReady]),i)?n:null};x.propTypes={children:p().node};var d=t(1664),u=t.n(d),f=t(8396),j=t(6822),m=t(5861),Z=t(7720),g=t(6216),b=t(7533),y=t(2540),v=t(2377),C=t(9773),w=t(7796),k=t(2823),P=t(9721),S=t(3219),z=t(6339),I=t(8571),R=t(311),L=t(2133),E=t(8309),O=t(923);let T=[{title:"Reportes",path:"/",icon:(0,r.jsx)(S.Z,{fontSize:"small",children:(0,r.jsx)(C.Z,{})})},{title:"Usuarios",path:"/customers",icon:(0,r.jsx)(S.Z,{fontSize:"small",children:(0,r.jsx)(P.Z,{})}),subItems:[{title:"Listado",path:"/customers",icon:(0,r.jsx)(S.Z,{fontSize:"small",children:(0,r.jsx)(O.Z,{})})},{title:"Nuevo",path:"/customers/new",icon:(0,r.jsx)(S.Z,{fontSize:"small",children:(0,r.jsx)(E.Z,{})})}]},{title:"Miembros",path:"/members",icon:(0,r.jsx)(S.Z,{fontSize:"small",children:(0,r.jsx)(I.Z,{})})},{title:"Iglesias",path:"/churchs",icon:(0,r.jsx)(S.Z,{fontSize:"small",children:(0,r.jsx)(R.Z,{})})},{title:"Ofrendas",path:"/companies",icon:(0,r.jsx)(S.Z,{fontSize:"small",children:(0,r.jsx)(z.Z,{})})},{title:"Inventario",path:"/inventory",icon:(0,r.jsx)(S.Z,{fontSize:"small",children:(0,r.jsx)(L.Z,{})})},{title:"Gastos",path:"/expenses",icon:(0,r.jsx)(S.Z,{fontSize:"small",children:(0,r.jsx)(w.Z,{})})},{title:"Mi Perfil",path:"/account",icon:(0,r.jsx)(S.Z,{fontSize:"small",children:(0,r.jsx)(k.Z,{})})}];var F=t(7739),M=t(7922);let N=e=>{let{active:n=!1,disabled:t,external:l,icon:i,path:o,title:a,subItems:c}=e,[p,h]=(0,s.useState)(!1),x=o?l?{component:"a",href:o,target:"_blank"}:{component:u(),href:o}:{},d=()=>{h(!p)};return(0,r.jsxs)("li",{children:[(0,r.jsxs)(F.Z,{sx:{alignItems:"center",borderRadius:1,display:"flex",justifyContent:"flex-start",pl:"16px",pr:"16px",py:"6px",textAlign:"left",width:"100%",...n&&{backgroundColor:"rgba(255, 255, 255, 0.04)"},"&:hover":{backgroundColor:"rgba(255, 255, 255, 0.04)"}},onClick:d,...x,children:[i&&(0,r.jsx)(j.Z,{component:"span",sx:{alignItems:"center",color:"neutral.400",display:"inline-flex",justifyContent:"center",mr:2,...n&&{color:"primary.lightest"}},children:i}),(0,r.jsx)(j.Z,{component:"span",sx:{color:"neutral.400",flexGrow:1,fontFamily:e=>e.typography.fontFamily,fontSize:14,fontWeight:600,lineHeight:"24px",whiteSpace:"nowrap",...n&&{color:"common.white"},...t&&{color:"neutral.500"}},children:a})]}),c&&(0,r.jsx)(M.Z,{in:p,sx:{pl:"30px"},children:c.map(e=>(0,r.jsx)(N,{...e},e.path))})]})};N.propTypes={active:p().bool,disabled:p().bool,external:p().bool,icon:p().node,path:p().string,title:p().string.isRequired,subItems:p().arrayOf(p().shape({path:p().string,title:p().string.isRequired}))};let q=e=>{let{open:n,onClose:t}=e,l=(0,i.usePathname)(),s=(0,f.Z)(e=>e.breakpoints.up("lg")),o=(0,r.jsx)(v.L,{sx:{height:"100%","& .simplebar-content":{height:"100%"},"& .simplebar-scrollbar:before":{background:"neutral.400"}},children:(0,r.jsxs)(j.Z,{sx:{display:"flex",flexDirection:"column",height:"100%"},children:[(0,r.jsxs)(j.Z,{sx:{p:3},children:[(0,r.jsx)(j.Z,{component:u(),href:"/",sx:{display:"inline-flex",height:32,width:32},children:(0,r.jsx)(y.T,{})}),(0,r.jsxs)("div",{children:[(0,r.jsx)(m.Z,{color:"inherit",variant:"h4",children:"IMPCH Za\xf1artu"}),(0,r.jsx)(m.Z,{color:"neutral.400",variant:"body2",children:"Iglesia Metodista Pentecostal de Chile"})]})]}),(0,r.jsx)(Z.Z,{sx:{borderColor:"neutral.700"}}),(0,r.jsx)(j.Z,{component:"nav",sx:{flexGrow:1,px:2,py:3},children:(0,r.jsx)(g.Z,{component:"ul",spacing:.5,sx:{listStyle:"none",p:0,m:0},children:T.map(e=>{let n=!!e.path&&l===e.path;return(0,r.jsx)(N,{active:n,disabled:e.disabled,external:e.external,icon:e.icon,path:e.path,title:e.title,subItems:e.subItems},e.title)})})})]})});return s?(0,r.jsx)(b.ZP,{anchor:"left",open:!0,PaperProps:{sx:{backgroundColor:"neutral.800",color:"common.white",width:302}},variant:"permanent",children:o}):(0,r.jsx)(b.ZP,{anchor:"left",onClose:t,open:n,PaperProps:{sx:{backgroundColor:"neutral.800",color:"common.white",width:302}},sx:{zIndex:e=>e.zIndex.appBar+100},variant:"temporary",children:o})};q.propTypes={onClose:p().func,open:p().bool};var _=t(4149),H=t(4674),B=t(9661),G=t(4581),A=t(5724),D=t(4118),U=t(431),W=t(2662);let Q=e=>{let{anchorEl:n,onClose:t,open:l}=e,o=(0,i.useRouter)(),a=(0,W.a)(),c=(0,s.useCallback)(()=>{null==t||t(),a.signOut(),o.push("/auth/login")},[t,a,o]);return(0,r.jsxs)(A.ZP,{anchorEl:n,anchorOrigin:{horizontal:"left",vertical:"bottom"},onClose:t,open:l,PaperProps:{sx:{width:200}},children:[(0,r.jsxs)(j.Z,{sx:{py:1.5,px:2},children:[(0,r.jsx)(m.Z,{variant:"overline",children:"Cuenta"}),(0,r.jsx)(m.Z,{color:"text.secondary",variant:"body2",children:"Hugo Quinteros"})]}),(0,r.jsx)(Z.Z,{}),(0,r.jsx)(D.Z,{disablePadding:!0,dense:!0,sx:{p:"8px","& > *":{borderRadius:1}},children:(0,r.jsx)(U.Z,{onClick:c,children:"Salir"})})]})};Q.propTypes={anchorEl:p().any,onClose:p().func,open:p().bool.isRequired};let V=e=>{let{onNavOpen:n}=e,t=(0,f.Z)(e=>e.breakpoints.up("lg")),l=function(){let e=(0,s.useRef)(null),[n,t]=(0,s.useState)(!1),l=(0,s.useCallback)(()=>{t(!0)},[]),r=(0,s.useCallback)(()=>{t(!1)},[]),i=(0,s.useCallback)(()=>{t(e=>!e)},[]);return{anchorRef:e,handleClose:r,handleOpen:l,handleToggle:i,open:n}}();return(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)(j.Z,{component:"header",sx:{backdropFilter:"blur(6px)",backgroundColor:e=>(0,G.Fq)(e.palette.background.default,.8),position:"sticky",left:{lg:"".concat(302,"px")},top:0,width:{lg:"calc(100% - ".concat(302,"px)")},zIndex:e=>e.zIndex.appBar},children:(0,r.jsxs)(g.Z,{alignItems:"center",direction:"row",justifyContent:"space-between",spacing:2,sx:{minHeight:90,px:2},children:[(0,r.jsx)(g.Z,{alignItems:"center",direction:"row",spacing:2,children:!t&&(0,r.jsx)(H.Z,{onClick:n,children:(0,r.jsx)(S.Z,{fontSize:"small",children:(0,r.jsx)(_.Z,{})})})}),(0,r.jsx)(g.Z,{alignItems:"center",direction:"row",spacing:2,children:(0,r.jsx)(B.Z,{onClick:l.handleOpen,ref:l.anchorRef,sx:{cursor:"pointer",height:70,width:70},src:"/assets/avatars/avatar-cao-yu.png"})})]})}),(0,r.jsx)(Q,{anchorEl:l.anchorRef.current,open:l.open,onClose:l.handleClose})]})};V.propTypes={onNavOpen:p().func};let J=(0,o.ZP)("div")(e=>{let{theme:n}=e;return{display:"flex",flex:"1 1 auto",maxWidth:"100%",[n.breakpoints.up("lg")]:{paddingLeft:302}}}),K=(0,o.ZP)("div")({display:"flex",flex:"1 1 auto",flexDirection:"column",width:"100%"}),X=(l=e=>{let{children:n}=e,t=(0,i.usePathname)(),[l,o]=(0,s.useState)(!1),a=(0,s.useCallback)(()=>{l&&o(!1)},[l]);return(0,s.useEffect)(()=>{a()},[t]),(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)(V,{onNavOpen:()=>o(!0)}),(0,r.jsx)(q,{onClose:()=>o(!1),open:l}),(0,r.jsx)(J,{children:(0,r.jsx)(K,{children:n})})]})},e=>(0,r.jsx)(x,{children:(0,r.jsx)(l,{...e})}))}}]);