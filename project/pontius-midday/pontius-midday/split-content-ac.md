ay/ui/input";
16 | import {
17 |   Select,
18 |   SelectContent,
19 |   SelectItem,
20 |   SelectTrigger,
21 |   SelectValue,
22 | } from "@midday/ui/select";
23 | import { Textarea } from "@midday/ui/textarea";
24 | import { useToast } from "@midday/ui/use-toast";
25 | import { Loader2 } from "lucide-react";
26 | import { useAction } from "next-safe-action/hooks";
27 | import { useForm } from "react-hook-form";
28 | import type { z } from "zod";
29 |
30 | export function SupportForm() {
31 |   const { toast } = useToast();
32 |
33 |   const form = useForm<z.infer<typeof sendSupportSchema>>({
34 |     resolver: zodResolver(sendSupportSchema),
35 |     defaultValues: {
36 |       email: "",
37 |       fullName: "",
38 |       subject: "",
39 |       type: "",
40 |       priority: "",
41 |       message: "",
42 |     },
43 |   });
44 |
45 |   const sendSupport = useAction(sendSupportAction, {
46 |     onSuccess: () => {
47 |       toast({
48 |         duration: 2500,
49 |         title: "Support ticket sent.",
50 |         variant: "success",
51 |       });
52 |
53 |       form.reset();
54 |     },
55 |     onError: () => {
56 |       toast({
57 |         duration: 3500,
58 |         variant: "error",
59 |         title: "Something went wrong pleaase try again.",
60 |       });
61 |     },
62 |   });
63 |
64 |   return (
65 |     <Form {...form}>
66 |       <form
67 |         onSubmit={form.handleSubmit(sendSupport.execute)}
68 |         className="space-y-8"
69 |       >
70 |         <div className="flex space-x-4">
71 |           <FormField
72 |             control={form.control}
73 |             name="email"
74 |             render={({ field }) => (
75 |               <FormItem className="w-full">
76 |                 <FormLabel>Email</FormLabel>
77 |                 <FormControl>
78 |                   <Input placeholder="Email" type="email" {...field} />
79 |                 </FormControl>
80 |                 <FormMessage />
81 |               </FormItem>
82 |             )}
83 |           />
84 |
85 |           <FormField
86 |             control={form.control}
87 |             name="fullName"
88 |             render={({ field }) => (
89 |               <FormItem className="w-full">
90 |                 <FormLabel>Full Name</FormLabel>
91 |                 <FormControl>
92 |                   <Input placeholder="John Doe" {...field} />
93 |                 </FormControl>
94 |                 <FormMessage />
95 |               </FormItem>
96 |             )}
97 |           />
98 |         </div>
99 |
100 |         <FormField
101 |           control={form.control}
102 |           name="subject"
103 |           render={({ field }) => (
104 |             <FormItem>
105 |               <FormLabel>Subject</FormLabel>
106 |               <FormControl>
107 |                 <Input
108 |                   placeholder="Summary of the problem you have"
109 |                   {...field}
110 |                 />
111 |               </FormControl>
112 |               <FormMessage />
113 |             </FormItem>
114 |           )}
115 |         />
116 |
117 |         <div className="flex space-x-4">
118 |           <FormField
119 |             control={form.control}
120 |             name="type"
121 |             render={({ field }) => (
122 |               <FormItem className="w-full">
123 |                 <FormLabel>Product</FormLabel>
124 |                 <Select
125 |                   onValueChange={field.onChange}
126 |                   defaultValue={field.value}
127 |                 >
128 |                   <FormControl>
129 |                     <SelectTrigger>
130 |                       <SelectValue placeholder="Select Product" />
131 |                     </SelectTrigger>
132 |                   </FormControl>
133 |                   <SelectContent>
134 |                     <SelectItem value="Transactions">Transactions</SelectItem>
135 |                     <SelectItem value="Vault">Vault</SelectItem>
136 |                     <SelectItem value="Inbox">Inbox</SelectItem>
137 |                     <SelectItem value="Invoicing">Invoicing</SelectItem>
138 |                     <SelectItem value="Tracker">Tracker</SelectItem>
139 |                     <SelectItem value="AI">AI</SelectItem>
140 |                     <SelectItem value="General">General</SelectItem>
141 |                   </SelectContent>
142 |                 </Select>
143 |                 <FormMessage />
144 |               </FormItem>
145 |             )}
146 |           />
147 |           <FormField
148 |             control={form.control}
149 |             name="priority"
150 |             render={({ field }) => (
151 |               <FormItem className="w-full">
152 |                 <FormLabel>Severity</FormLabel>
153 |                 <Select
154 |                   onValueChange={field.onChange}
155 |                   defaultValue={field.value}
156 |                 >
157 |                   <FormControl>
158 |                     <SelectTrigger>
159 |                       <SelectValue placeholder="Select severity" />
160 |                     </SelectTrigger>
161 |                   </FormControl>
162 |                   <SelectContent>
163 |                     <SelectItem value="low">Low</SelectItem>
164 |                     <SelectItem value="normal">Normal</SelectItem>
165 |                     <SelectItem value="high">High</SelectItem>
166 |                     <SelectItem value="urgent">Urgent</SelectItem>
167 |                   </SelectContent>
168 |                 </Select>
169 |                 <FormMessage />
170 |               </FormItem>
171 |             )}
172 |           />
173 |         </div>
174 |
175 |         <FormField
176 |           control={form.control}
177 |           name="message"
178 |           render={({ field }) => (
179 |             <FormItem>
180 |               <FormLabel>Message</FormLabel>
181 |               <FormControl>
182 |                 <Textarea
183 |                   placeholder="Describe the issue you're facing, along with any relevant information. Please be as detailed and specific as possible."
184 |                   className="resize-none min-h-[150px]"
[TRUNCATED]
```

apps/website/src/components/testimonials.tsx
```
1 | import { InfiniteMovingCards } from "@/components/infinite-moving-cards";
2 |
3 | const testimonials = [
4 |   {
5 |     name: "Lucas Grey",
6 |     avatarUrl:
7 |       "https://pbs.twimg.com/profile_images/1843079229073981440/pQqZJX5G_400x400.jpg",
8 |     handle: "@ImLucasGrey",
9 |     verified: true,
10 |     quote: "This is so ingenious and good!",
11 |   },
12 |   {
13 |     name: "Patrick Tobler",
14 |     avatarUrl:
15 |       "https://pbs.twimg.com/profile_images/1821352126406127616/We8itUSn_400x400.jpg",
16 |     handle: "@Padierfind",
17 |     verified: true,
18 |     quote: "I love this",
19 |   },
20 |   {
21 |     name: "Ben Tossell",
22 |     avatarUrl:
23 |       "https://pbs.twimg.com/profile_images/1595060668897677314/pHMUc1Zb_400x400.jpg",
24 |     handle: "@bentossell",
25 |     verified: true,
26 |     quote:
27 |       "well, an actually enjoyable way to organise my whole in and out of my business, plus highlighted a bunch of things I need to cancel",
28 |   },
29 |   {
30 |     name: "Christian Alares",
31 |     avatarUrl:
32 |       "https://pbs.twimg.com/profile_images/1194368464946974728/1D2biimN_400x400.jpg",
33 |     handle: "@c_alares",
34 |     verified: true,
35 |     quote: "Omg, this is so cool!",
36 |   },
37 |   {
38 |     name: "Zeno Rocha",
39 |     avatarUrl:
40 |       "https://pbs.twimg.com/profile_images/1792735373887696896/Nys5Q2b3_400x400.jpg",
41 |     handle: "@zenorocha",
42 |     verified: true,
43 |     quote: "this is absolutely amazing",
44 |   },
45 |   {
46 |     name: "Bailey Simrell",
47 |     avatarUrl:
48 |       "https://pbs.twimg.com/profile_images/1488962358609330178/tdTC7o6M_400x400.jpg",
49 |     handle: "@baileysimrell",
50 |     verified: true,
51 |     quote: "Awesome man, looks amazing 🔥",
52 |   },
53 |   {
54 |     name: "Darshan Gajara",
55 |     handle: "@WeirdoWizard",
56 |     verified: false,
57 |     quote: "No sweat! Your smooth integration with banking data blew me away.",
58 |     avatarUrl:
59 |       "https://pbs.twimg.com/profile_images/1117472858836434944/FbWce7CZ_400x400.jpg",
60 |   },
61 |   {
62 |     name: "Cal.com",
63 |     avatarUrl:
64 |       "https://pbs.twimg.com/profile_images/1839412200760610816/Lce29ADc_400x400.jpg",
65 |     handle: "@calcom",
66 |     verified: true,
67 |     quote: "We love @middayai 🖤",
68 |   },
69 |   {
70 |     name: "Guillermo Rauch",
71 |     avatarUrl:
72 |       "https://pbs.twimg.com/profile_images/1783856060249595904/8TfcCN0r_400x400.jpg",
73 |     handle: "@rauchg",
74 |     verified: true,
75 |     quote:
76 |       "nice to see @middayai generative ui features built on @vercel AI sdk midday is becoming one of the best OSS @nextjs real-world apps",
77 |   },
78 |   {
79 |     name: "Kyle @ KyTech",
80 |     avatarUrl:
81 |       "https://pbs.twimg.com/profile_images/1586538348964978689/nkpJWZxG_400x400.png",
82 |     handle: "@KyTechInc",
83 |     verified: true,
84 |     quote: "so ready! 🙌",
85 |   },
86 |   {
87 |     name: "Steven Tey",
88 |     avatarUrl:
89 |       "https://pbs.twimg.com/profile_images/1506792347840888834/dS-r50Je_400x400.jpg",
90 |     handle: "@steventey",
91 |     verified: true,
92 |     quote: `Just found my new favorite open-source project → http://midday.ai
93 |
94 |     It's a modern layer on top of Quickbooks/Xero that lets you automate the tedious accounting aspects of your business and focus on what matters – your product.
95 |
96 |     Built by the 🐐s
97 |     @pontusab
98 |      +
99 |     @viktorhofte
100 |      👏`,
101 |   },
102 |   {
103 |     name: "Gokul",
104 |     avatarUrl:
105 |       "https://pbs.twimg.com/profile_images/1805103400549318656/EEQpiO7e_400x400.jpg",
106 |     handle: "@KyTechInc",
107 |     verified: true,
108 |     quote: "🖤 Awesome work. just love it.",
109 |   },
110 |   {
111 |     name: "Peer Richelsen — oss/acc",
112 |     avatarUrl:
113 |       "https://pbs.twimg.com/profile_images/1816814706000080897/uSIidPHz_400x400.png",
114 |     handle: "@peer_rich",
115 |     verified: true,
116 |     quote:
117 |       "the best thing i couldve done as a founder is build something that helps other founders. so proud 🖤 @middayai",
118 |   },
119 | ];
120 |
121 | export function Testimonials() {
122 |   return (
123 |     <div className="relative pb-22">
124 |       <h3 className="text-4xl mb-8 font-medium">What people say</h3>
125 |       <InfiniteMovingCards items={testimonials} direction="left" speed="slow" />
126 |     </div>
127 |   );
128 | }
```

apps/website/src/components/text-generate-effect.tsx
```
1 | "use client";
2 |
3 | import { cn } from "@midday/ui/cn";
4 | import { motion, stagger, useAnimate } from "framer-motion";
5 |
6 | export const TextGenerateEffect = ({
7 |   words,
8 |   className,
9 | }: {
10 |   words: string;
11 |   className?: string;
12 | }) => {
13 |   const [scope, animate] = useAnimate();
14 |   const wordsArray = words.split(" ");
15 |
16 |   const renderWords = () => {
17 |     return (
18 |       <motion.div ref={scope}>
19 |         {wordsArray.map((word, idx) => {
20 |           return (
21 |             <motion.span
22 |               key={word + idx.toString()}
23 |               className="text-primary opacity-0"
24 |             >
25 |               {word}{" "}
26 |             </motion.span>
27 |           );
28 |         })}
29 |       </motion.div>
30 |     );
31 |   };
32 |
33 |   return (
34 |     <motion.div
35 |       onViewportEnter={() => {
36 |         animate(
37 |           "span",
38 |           {
39 |             opacity: 1,
40 |           },
41 |           {
42 |             duration: 1,
43 |             delay: stagger(0.13),
44 |           },
45 |         );
46 |       }}
47 |       className={cn("text-center font-medium", className)}
48 |     >
49 |       {renderWords()}
50 |     </motion.div>
51 |   );
52 | };
```

apps/website/src/components/theme-provider.tsx
```
1 | "use client";
2 |
3 | import { ThemeProvider as NextThemesProvider } from "next-themes";
4 | import * as React from "react";
5 |
6 | type ThemeProviderProps = Parameters<typeof NextThemesProvider>[0];
7 |
8 | export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
9 |   return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
10 | }
```

apps/website/src/components/ticker.tsx
```
1 | import type { Database } from "@midday/supabase/types";
2 | import { createServerClient } from "@supabase/ssr";
3 | import Link from "next/link";
4 |
5 | const currency = "USD";
6 |
7 | export async function Ticker() {
8 |   const client = createServerClient<Database>(
9 |     process.env.NEXT_PUBLIC_SUPABASE_URL!,
10 |     process.env.SUPABASE_SERVICE_KEY!,
11 |     {
12 |       cookies: {
13 |         get() {
14 |           return null;
15 |         },
16 |         set() {
17 |           return null;
18 |         },
19 |         remove() {
20 |           return null;
21 |         },
22 |       },
23 |     },
24 |   );
25 |
26 |   const [
27 |     { data: totalSum },
28 |     { count: businessCount },
29 |     { count: transactionCount },
30 |   ] = await Promise.all([
31 |     client.rpc("calculate_total_sum", {
32 |       target_currency: currency,
33 |     }),
34 |     client.from("teams").select("id", { count: "exact", head: true }).limit(1),
35 |     client
36 |       .from("transactions")
37 |       .select("id", { count: "exact", head: true })
38 |       .limit(1),
39 |   ]);
40 |
41 |   return (
42 |     <div className="text-center flex flex-col mt-[120px] md:mt-[280px] mb-[120px] md:mb-[250px] space-y-4 md:space-y-10">
43 |       <span className="font-medium font-mono text-center text-[40px] md:text-[80px] lg:text-[100px] xl:text-[130px] 2xl:text-[160px] md:mb-2 text-stroke leading-none">
44 |         {Intl.NumberFormat("en-US", {
45 |           style: "currency",
46 |           currency: currency,
47 |           maximumFractionDigits: 0,
48 |         }).format(totalSum ?? 0)}
49 |       </span>
50 |       <span className="text-[#878787]">
51 |         Through our system{" "}
52 |         <Link href="/open-startup" className="underline">
53 |           {Intl.NumberFormat("en-US", {
54 |             maximumFractionDigits: 0,
55 |           }).format(transactionCount ?? 0)}
56 |         </Link>{" "}
57 |         transactions across{" "}
58 |         <Link href="/open-startup" className="underline">
59 |           {Intl.NumberFormat("en-US", {
60 |             maximumFractionDigits: 0,
61 |           }).format(businessCount ?? 0)}
62 |         </Link>{" "}
63 |         businesses.
64 |       </span>
65 |     </div>
66 |   );
67 | }
```

apps/website/src/components/tray.tsx
```
1 | "use client";
2 |
3 | import { format } from "date-fns";
4 | import { useEffect, useState } from "react";
5 |
6 | export function Tray() {
7 |   const [date, setDate] = useState<string | undefined>();
8 |
9 |   useEffect(() => {
10 |     const interval = setInterval(() => {
11 |       setDate(new Date().toISOString());
12 |     }, 60000);
13 |
14 |     return () => clearInterval(interval);
15 |   }, []);
16 |
17 |   return (
18 |     <div className="flex items-center space-x-3 absolute top-2 right-4 md:right-6 md:top-4 scale-75 md:scale-100">
19 |       <svg
20 |         className="relative -top-0.5"
21 |         xmlns="http://www.w3.org/2000/svg"
22 |         width={14}
23 |         height={13}
24 |         fill="none"
25 |       >
26 |         <path
27 |           fill="#F5F5F3"
28 |           fillRule="evenodd"
29 |           d="M6.368 0a6.47 6.47 0 0 0-2.723.728l2.723 4.715V0Zm0 7.558-2.722 4.714A6.47 6.47 0 0 0 6.368 13V7.558ZM6.934 13V7.555l2.723 4.716A6.47 6.47 0 0 1 6.934 13Zm0-7.554V0c.98.042 1.903.3 2.723.729L6.934 5.446Zm-5.771 4.55 4.716-2.722-2.723 4.715a6.54 6.54 0 0 1-1.993-1.993Zm10.976-6.99L7.424 5.728l2.723-4.716a6.54 6.54 0 0 1 1.992 1.994ZM1.162 3.005a6.54 6.54 0 0 1 1.994-1.994L5.879 5.73 1.162 3.005Zm-.283.49A6.47 6.47 0 0 0 .15 6.218h5.445L.88 3.495Zm0 6.012A6.47 6.47 0 0 1 .15 6.784h5.446L.879 9.507Zm6.828-3.289h5.443a6.47 6.47 0 0 0-.727-2.723L7.707 6.218Zm4.715 3.288L7.707 6.784h5.443a6.47 6.47 0 0 1-.728 2.722ZM7.425 7.274l2.721 4.714a6.54 6.54 0 0 0 1.993-1.992L7.425 7.274Z"
30 |           clipRule="evenodd"
31 |         />
32 |       </svg>
33 |
34 |       <svg
35 |         xmlns="http://www.w3.org/2000/svg"
36 |         width={20}
37 |         height={21}
38 |         fill="none"
39 |       >
40 |         <g filter="url(#a)">
41 |           <path
42 |             fill="#fff"
43 |             fillOpacity={0.9}
44 |             fillRule="evenodd"
45 |             d="M14.15 7.625c0 1.11-.361 2.136-.973 2.965l2.504 2.505a.75.75 0 0 1-.977 1.133l-.084-.073-2.504-2.504a5 5 0 1 1 2.035-4.026Zm-5 4a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z"
46 |             clipRule="evenodd"
47 |           />
48 |         </g>
49 |         <defs>
50 |           <filter
51 |             id="a"
52 |             width={19.75}
53 |             height={19.75}
54 |             x={0.15}
55 |             y={0.625}
56 |             colorInterpolationFilters="sRGB"
57 |             filterUnits="userSpaceOnUse"
58 |           >
59 |             <feFlood floodOpacity={0} result="BackgroundImageFix" />
60 |             <feColorMatrix
61 |               in="SourceAlpha"
62 |               result="hardAlpha"
63 |               values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
64 |             />
65 |             <feOffset dy={2} />
66 |             <feGaussianBlur stdDeviation={2} />
67 |             <feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.22 0" />
68 |             <feBlend
69 |               in2="BackgroundImageFix"
70 |               result="effect1_dropShadow_2085_4748"
71 |             />
72 |             <feBlend
73 |               in="SourceGraphic"
74 |               in2="effect1_dropShadow_2085_4748"
75 |               result="shape"
76 |             />
77 |           </filter>
78 |         </defs>
79 |       </svg>
80 |       <svg
81 |         xmlns="http://www.w3.org/2000/svg"
82 |         width={25}
83 |         height={19}
84 |         fill="none"
85 |       >
86 |         <g filter="url(#a)">
87 |           <path
88 |             fill="#fff"
89 |             fillOpacity={0.9}
90 |             fillRule="evenodd"
91 |             d="M12.75 2a9.982 9.982 0 0 1 7.85 3.804L19.12 7.16A7.987 7.987 0 0 0 12.75 4c-2.6 0-4.909 1.24-6.37 3.16L4.9 5.804A9.982 9.982 0 0 1 12.75 2Zm4.888 6.52A5.992 5.992 0 0 0 12.75 6c-2.016 0-3.8.994-4.888 2.52l1.492 1.366A3.997 3.997 0 0 1 12.75 8c1.434 0 2.69.754 3.397 1.886l1.491-1.367Zm-3.019 2.767a2 2 0 0 0-3.738 0L12.751 13l1.868-1.713Z"
92 |             clipRule="evenodd"
93 |           />
[TRUNCATED]
```

apps/website/src/components/updates-toolbar.tsx
```
1 | "use client";
2 |
3 | import { Button } from "@midday/ui/button";
4 | import { cn } from "@midday/ui/cn";
5 | import {
6 |   Dialog,
7 |   DialogContent,
8 |   DialogHeader,
9 |   DialogTitle,
10 |   DialogTrigger,
11 | } from "@midday/ui/dialog";
12 | import { Icons } from "@midday/ui/icons";
13 | import {
14 |   Tooltip,
15 |   TooltipContent,
16 |   TooltipProvider,
17 |   TooltipTrigger,
18 | } from "@midday/ui/tooltip";
19 | import { usePathname } from "next/navigation";
20 | import { useHotkeys } from "react-hotkeys-hook";
21 | import { FaXTwitter } from "react-icons/fa6";
22 | import { CopyInput } from "./copy-input";
23 |
24 | const popupCenter = ({ url, title, w, h }) => {
25 |   const dualScreenLeft =
26 |     window.screenLeft !== undefined ? window.screenLeft : window.screenX;
27 |   const dualScreenTop =
28 |     window.screenTop !== undefined ? window.screenTop : window.screenY;
29 |
30 |   const width = window.innerWidth
31 |     ? window.innerWidth
32 |     : document.documentElement.clientWidth
33 |       ? document.documentElement.clientWidth
34 |       : screen.width;
35 |   const height = window.innerHeight
36 |     ? window.innerHeight
37 |     : document.documentElement.clientHeight
38 |       ? document.documentElement.clientHeight
39 |       : screen.height;
40 |
41 |   const systemZoom = width / window.screen.availWidth;
42 |   const left = (width - w) / 2 / systemZoom + dualScreenLeft;
43 |   const top = (height - h) / 2 / systemZoom + dualScreenTop;
44 |   const newWindow = window.open(
45 |     url,
46 |     title,
47 |     `
48 |       scrollbars=yes,
49 |       width=${w / systemZoom},
50 |       height=${h / systemZoom},
51 |       top=${top},
52 |       left=${left}
53 |       `,
54 |   );
55 |
56 |   return newWindow;
57 | };
58 |
59 | export function UpdatesToolbar({ posts }) {
60 |   const pathname = usePathname();
61 |   const currentIndex = posts.findIndex((a) => pathname.endsWith(a.slug)) ?? 0;
62 |
63 |   const currentPost = posts[currentIndex];
64 |
65 |   const handlePrev = () => {
66 |     if (currentIndex > 0) {
67 |       const nextPost = posts[currentIndex - 1];
68 |
69 |       const element = document.getElementById(nextPost?.slug);
70 |       element?.scrollIntoView({
71 |         behavior: "smooth",
72 |       });
73 |     }
74 |   };
75 |
76 |   const handleNext = () => {
77 |     if (currentIndex !== posts.length - 1) {
78 |       const nextPost = posts[currentIndex + 1];
79 |
80 |       const element = document.getElementById(nextPost?.slug);
81 |
82 |       element?.scrollIntoView({
83 |         behavior: "smooth",
84 |       });
85 |     }
86 |   };
87 |
88 |   useHotkeys("arrowRight", () => handleNext(), [handleNext]);
89 |   useHotkeys("arrowLeft", () => handlePrev(), [handlePrev]);
90 |
91 |   const handleOnShare = () => {
92 |     const popup = popupCenter({
93 |       url: `https://twitter.com/intent/tweet?text=${currentPost.title} https://midday.ai/updates/${currentPost.slug}`,
94 |       title: currentPost.title,
95 |       w: 800,
96 |       h: 400,
97 |     });
98 |
99 |     popup?.focus();
100 |   };
101 |
102 |   return (
103 |     <Dialog>
104 |       <div className="fixed right-6 bottom-0 top-0 flex-col items-center justify-center hidden md:flex">
105 |         <TooltipProvider delayDuration={20}>
106 |           <div className="flex flex-col items-center backdrop-filter backdrop-blur-lg dark:bg-[#1A1A1A]/80 p-2 border dark:border-[#2C2C2C] bg-white space-y-4 rounded-full">
107 |             <Tooltip>
108 |               <TooltipTrigger>
109 |                 <DialogTrigger asChild>
110 |                   <Icons.Share size={18} className="text-[#606060] -mt-[1px]" />
111 |                 </DialogTrigger>
112 |               </TooltipTrigger>
113 |               <TooltipContent
114 |                 className="py-1 px-3 rounded-sm"
115 |                 sideOffset={25}
116 |                 side="right"
117 |               >
118 |                 <span className="text-xs">Share</span>
119 |               </TooltipContent>
120 |             </Tooltip>
121 |
122 |             <div className="flex flex-col items-center border-t-[1px] border-border space-y-2 pt-2">
123 |               <Tooltip>
124 |                 <TooltipTrigger asChild>
125 |                   <button
126 |                     type="button"
127 |                     className={cn(currentIndex === 0 && "opacity-50")}
128 |                     onClick={handlePrev}
129 |                   >
130 |                     <Icons.ChevronUp className="h-6 w-6" />
131 |                   </button>
132 |                 </TooltipTrigger>
133 |                 <TooltipContent
134 |                   className="py-1 px-3 rounded-sm"
135 |                   sideOffset={25}
136 |                   side="right"
137 |                 >
138 |                   <span className="text-xs">Previous post</span>
139 |                 </TooltipContent>
140 |               </Tooltip>
141 |               <Tooltip>
142 |                 <TooltipTrigger asChild>
143 |                   <button
144 |                     type="button"
145 |                     className={cn(
146 |                       currentIndex === posts.length - 1 && "opacity-50",
147 |                     )}
148 |                     onClick={handleNext}
149 |                   >
150 |                     <Icons.ChevronDown className="h-6 w-6" />
151 |                   </button>
152 |                 </TooltipTrigger>
153 |                 <TooltipContent
154 |                   className="py-1 px-3 rounded-sm"
155 |                   sideOffset={25}
156 |                   side="right"
157 |                 >
158 |                   <span className="text-xs">Next post</span>
[TRUNCATED]
```

apps/website/src/components/vote-button.tsx
```
1 | "use client";
2 |
3 | import { voteAction } from "@/actions/vote-action";
4 | import { Button } from "@midday/ui/button";
5 | import { ChevronUp } from "lucide-react";
6 | import { useOptimisticAction } from "next-safe-action/hooks";
7 |
8 | type Props = {
9 |   id: string;
10 |   count: number;
11 | };
12 |
13 | export function VoteButton({ count, id }: Props) {
14 |   const { execute, optimisticState } = useOptimisticAction(voteAction, {
15 |     currentState: count,
16 |     updateFn: () => {
17 |       return +count + 1;
18 |     },
19 |   });
20 |
21 |   return (
22 |     <Button
23 |       variant="outline"
24 |       className="p-6 flex-col w-14 h-16"
25 |       onClick={() => execute({ id })}
26 |     >
27 |       <div className="flex space-x-2 items-center flex-col">
28 |         <ChevronUp size={16} />
29 |         {optimisticState}
30 |       </div>
31 |     </Button>
32 |   );
33 | }
```

apps/website/src/components/vote.tsx
```
1 | import { VoteButton } from "@/components/vote-button";
2 | import { client } from "@midday/kv";
3 |
4 | type Props = {
5 |   id: string;
6 | };
7 |
8 | export async function Vote({ id }: Props) {
9 |   const count = await client.mget(`apps:${id}`);
10 |
11 |   return <VoteButton count={count.at(0)} id={id} />;
12 | }
```

apps/website/src/components/word-animation.tsx
```
1 | "use client";
2 |
3 | import { AnimatePresence, motion } from "framer-motion";
4 | import { useEffect, useState } from "react";
5 |
6 | const words = [
7 |   "Freelancers",
8 |   "Agencies",
9 |   "Consultants",
10 |   "Startups",
11 |   "Entrepreneurs",
12 |   "Founders",
13 | ];
14 |
15 | function useWordCycle(words: string[], interval: number) {
16 |   const [index, setIndex] = useState(0);
17 |   const [isInitial, setIsInitial] = useState(true);
18 |
19 |   useEffect(() => {
20 |     if (isInitial) {
21 |       setIndex(Math.floor(Math.random() * words.length));
22 |       setIsInitial(false);
23 |       return;
24 |     }
25 |
26 |     const timer = setInterval(() => {
27 |       setIndex((current) => (current + 1) % words.length);
28 |     }, interval);
29 |     return () => clearInterval(timer);
30 |   }, [words, interval, isInitial]);
31 |
32 |   return words[index];
33 | }
34 |
35 | export function WordAnimation() {
36 |   const word = useWordCycle(words, 2100);
37 |
38 |   return (
39 |     <AnimatePresence mode="wait">
40 |       <motion.div key={word} className="text-primary inline-block">
41 |         {word?.split("").map((char, index) => (
42 |           <motion.span
43 |             key={`${word}-${char}-${index.toString()}`}
44 |             initial={{ y: 10, opacity: 0 }}
45 |             animate={{ y: 0, opacity: 1 }}
46 |             exit={{ y: -10, opacity: 0 }}
47 |             transition={{
48 |               duration: 0.15,
49 |               delay: index * 0.015,
50 |               ease: "easeOut",
51 |             }}
52 |             style={{ display: "inline-block", whiteSpace: "pre" }}
53 |           >
54 |             {char}
55 |           </motion.span>
56 |         ))}
57 |       </motion.div>
58 |     </AnimatePresence>
59 |   );
60 | }
```

apps/website/src/lib/blog.ts
```
1 | import fs from "node:fs";
2 | import path from "node:path";
3 |
4 | type Metadata = {
5 |   title: string;
6 |   publishedAt: string;
7 |   summary: string;
8 |   image?: string;
9 |   tag: string;
10 | };
11 |
12 | function parseFrontmatter(fileContent: string) {
13 |   const frontmatterRegex = /---\s*([\s\S]*?)\s*---/;
14 |   const match = frontmatterRegex.exec(fileContent);
15 |   const frontMatterBlock = match?.[1];
16 |   const content = fileContent.replace(frontmatterRegex, "").trim();
17 |   const frontMatterLines = frontMatterBlock?.trim().split("\n") || [];
18 |   const metadata: Partial<Metadata> = {};
19 |
20 |   for (const line of frontMatterLines) {
21 |     const [key, ...valueArr] = line.split(": ");
22 |     if (key) {
23 |       let value = valueArr.join(": ").trim();
24 |       value = value.replace(/^['"](.*)['"]$/, "$1"); // Remove quotes
25 |       metadata[key.trim() as keyof Metadata] = value;
26 |     }
27 |   }
28 |
29 |   return { metadata: metadata as Metadata, content };
30 | }
31 |
32 | function getMDXFiles(dir: string) {
33 |   return fs.readdirSync(dir).filter((file) => path.extname(file) === ".mdx");
34 | }
35 |
36 | function readMDXFile(filePath: string) {
37 |   const rawContent = fs.readFileSync(filePath, "utf-8");
38 |   return parseFrontmatter(rawContent);
39 | }
40 |
41 | function getMDXData(dir: string) {
42 |   const mdxFiles = getMDXFiles(dir);
43 |   return mdxFiles.map((file) => {
44 |     const { metadata, content } = readMDXFile(path.join(dir, file));
45 |     const slug = path.basename(file, path.extname(file));
46 |
47 |     return {
48 |       metadata,
49 |       slug,
50 |       content,
51 |     };
52 |   });
53 | }
54 |
55 | export function getBlogPosts() {
56 |   return getMDXData(path.join(process.cwd(), "src", "app", "updates", "posts"));
57 | }
```

apps/website/src/lib/fetch-github-stars.ts
```
1 | "use server";
2 |
3 | export async function fetchGithubStars() {
4 |   const response = await fetch(
5 |     "https://api.github.com/repos/midday-ai/midday",
6 |     {
7 |       next: {
8 |         revalidate: 3600,
9 |       },
10 |     },
11 |   );
12 |
13 |   return response.json();
14 | }
```

apps/website/src/lib/fetch-github.ts
```
1 | "use server";
2 |
3 | async function getAllStargazers({ owner, name }) {
4 |   let endCursor = undefined;
5 |   let hasNextPage = true;
6 |   let added = [];
7 |
8 |   while (hasNextPage) {
9 |     const request = await fetch("https://api.github.com/graphql", {
10 |       method: "POST",
11 |       headers: {
12 |         "Content-Type": "application/json",
13 |         Authorization: `bearer ${process.env.GITHUB_TOKEN}`,
14 |       },
15 |       body: JSON.stringify({
16 |         variables: { after: endCursor, owner, name },
17 |         query: `query Repository($owner: String!, $name: String!, $after: String) {
18 |             repository(owner: $owner, name: $name) {
19 |               stargazers (first: 100, after: $after) {
20 |                 pageInfo {
21 |                   endCursor
22 |                   hasNextPage
23 |                 }
24 |                 edges {
25 |                  starredAt
26 |                 }
27 |               }
28 |             }
29 |           }`,
30 |       }),
31 |     });
32 |
33 |     const { data } = await request.json();
34 |
35 |     added = added.concat(data.repository.stargazers.edges);
36 |     hasNextPage = data.repository.stargazers.pageInfo.hasNextPage;
37 |     endCursor = data.repository.stargazers.pageInfo.endCursor;
38 |   }
39 |
40 |   return added;
41 | }
42 |
43 | async function githubRequest({ owner, name }) {
44 |   const request = await fetch("https://api.github.com/graphql", {
45 |     method: "POST",
46 |     headers: {
47 |       "Content-Type": "application/json",
48 |       Authorization: `bearer ${process.env.GITHUB_TOKEN}`,
49 |     },
50 |     body: JSON.stringify({
51 |       variables: { owner, name },
52 |       query: `query Repository($owner: String!, $name: String!) {
53 |             repository(owner: $owner, name: $name) {
54 |               forks {
55 |                 totalCount
56 |               }
57 |               watchers {
58 |                 totalCount
59 |               }
60 |               stargazers {
61 |                 totalCount
62 |               }
63 |                commits:object(expression: "main") {
64 |                 ... on Commit {
65 |                   history {
66 |                     totalCount
67 |                   }
68 |                 }
69 |               }
70 |             }
71 |           }`,
72 |     }),
73 |   });
74 |
75 |   return request.json();
76 | }
77 |
78 | export async function getGithubStats() {
79 |   const stargazers = await getAllStargazers({
80 |     owner: "midday-ai",
81 |     name: "midday",
82 |   });
83 |
84 |   const {
85 |     data: { repository },
86 |   } = await githubRequest({
87 |     owner: "midday-ai",
88 |     name: "midday",
89 |   });
90 |
91 |   const starsPerDate = stargazers.reduce((acc, curr) => {
92 |     const date = curr.starredAt.substring(0, 10);
93 |
94 |     if (acc[date]) {
95 |       acc[date]++;
96 |     } else {
97 |       acc[date] = 1;
98 |     }
99 |     return acc;
100 |   }, {});
101 |
102 |   const stats = Object.keys(starsPerDate).map((key) => {
103 |     return {
104 |       date: new Date(key),
105 |       value: starsPerDate[key],
106 |     };
107 |   });
108 |
109 |   return {
110 |     stats,
111 |     repository,
112 |   };
113 | }
```

apps/website/src/lib/fetch-stats.ts
```
1 | "use server";
2 |
3 | import type { Database } from "@midday/supabase/types";
4 | import { createServerClient } from "@supabase/ssr";
5 |
6 | export async function fetchStats() {
7 |   const supabase = createServerClient<Database>(
8 |     process.env.NEXT_PUBLIC_SUPABASE_URL!,
9 |     process.env.SUPABASE_SERVICE_KEY!,
10 |     {
11 |       cookies: {
12 |         get() {
13 |           return null;
14 |         },
15 |         set() {
16 |           return null;
17 |         },
18 |         remove() {
19 |           return null;
20 |         },
21 |       },
22 |     },
23 |   );
24 |
25 |   const supabaseStorage = createServerClient<Database>(
26 |     process.env.NEXT_PUBLIC_SUPABASE_URL!,
27 |     process.env.SUPABASE_SERVICE_KEY!,
28 |     {
29 |       cookies: {
30 |         get() {
31 |           return null;
32 |         },
33 |         set() {
34 |           return null;
35 |         },
36 |         remove() {
37 |           return null;
38 |         },
39 |       },
40 |       db: { schema: "storage" },
41 |     },
42 |   );
43 |
44 |   const [
45 |     { count: users },
46 |     { count: transactions },
47 |     { count: bankAccounts },
48 |     { count: trackerEntries },
49 |     { count: inboxItems },
50 |     { count: bankConnections },
51 |     { count: trackerProjects },
52 |     { count: reports },
53 |     { count: vaultObjects },
54 |     { count: transactionEnrichments },
55 |     { count: invoices },
56 |     { count: invoiceCustomers },
57 |   ] = await Promise.all([
58 |     supabase
59 |       .from("teams")
60 |       .select("id", { count: "exact", head: true })
61 |       .limit(1),
62 |     supabase
63 |       .from("transactions")
64 |       .select("id", { count: "exact", head: true })
65 |       .limit(1),
66 |     supabase
67 |       .from("bank_accounts")
68 |       .select("id", { count: "exact", head: true })
69 |       .limit(1),
70 |     supabase
71 |       .from("tracker_entries")
72 |       .select("id", { count: "exact", head: true })
73 |       .limit(1),
74 |     supabase
75 |       .from("inbox")
76 |       .select("id", { count: "exact", head: true })
77 |       .limit(1),
78 |     supabase
79 |       .from("bank_connections")
80 |       .select("id", { count: "exact", head: true })
81 |       .limit(1),
82 |     supabase
83 |       .from("tracker_projects")
84 |       .select("id", { count: "exact", head: true })
85 |       .limit(1),
86 |     supabase
87 |       .from("reports")
88 |       .select("id", { count: "exact", head: true })
89 |       .limit(1),
90 |     supabaseStorage
91 |       .from("objects")
92 |       .select("id", { count: "exact", head: true })
93 |       .limit(1),
94 |     supabase
95 |       .from("transaction_enrichments")
96 |       .select("id", { count: "exact", head: true })
97 |       .limit(1),
98 |     supabase
99 |       .from("invoices")
100 |       .select("id", { count: "exact", head: true })
101 |       .limit(1),
102 |     supabase
103 |       .from("customers")
104 |       .select("id", { count: "exact", head: true })
105 |       .limit(1),
106 |   ]);
107 |
108 |   return {
109 |     users,
110 |     transactions,
111 |     bankAccounts,
112 |     trackerEntries,
113 |     inboxItems,
114 |     bankConnections,
115 |     trackerProjects,
116 |     reports,
117 |     vaultObjects,
118 |     transactionEnrichments,
119 |     invoices,
120 |     invoiceCustomers,
121 |   };
122 | }
```

apps/website/src/styles/globals.css
```
1 | @tailwind base;
2 | @tailwind components;
3 | @tailwind utilities;
4 |
5 | :root {
6 |     --sh-class: #FFFFFF;
7 |     --sh-identifier: #FFFFFF;
8 |     --sh-sign: #8996a3;
9 |     --sh-string: #A7A7A7;
10 |     --sh-keyword: #A7A7A7;
11 |     --sh-comment: #a19595;
12 |     --sh-jsxliterals: #FFFFFF;
13 |     --sh-property: #A7A7A7;
14 |     --sh-entity: #A7A7A7;
15 | }
16 |
17 | .updates p {
18 |     min-height: 1.87em;
19 |     margin-top: 1px;
20 |     margin-bottom: 1px;
21 |     padding: 3px 2px;
22 | }
23 |
24 | .updates h2 {
25 |     font-size: 26px;
26 |     margin-top: .8em;
27 |     margin-bottom: 10px;
28 |     font-weight: 500;
29 | }
30 |
31 | .updates h4 {
32 |     display: block;
33 |     font-weight: 600;
34 |     color: white;
35 |     margin-top: 15px;
36 | }
37 |
38 | .updates h3 {
39 |     font-size: 1.25em;
40 |     margin-top: .8em;
41 |     margin-bottom: 1px;
42 |     font-weight: 500;
43 | }
44 |
45 | .updates p,
46 | .updates li {
47 |     color: #707070;
48 | }
49 |
50 | .updates ul li {
51 |     margin-top: 1px;
52 |     margin-bottom: 1px;
53 |     padding-left: 12px;
54 |     padding-top: 3px;
55 |     padding-bottom: 2px;
56 | }
57 |
58 | .updates ul {
59 |     list-style-type: disc;
60 |     list-style-position: inside;
61 | }
62 |
63 | .updates p code span {
64 |     font-family: var(--font-geist-mono);
65 |     color: #eb5757 !important;
66 |     font-size: 85%;
67 |     font-weight: 600;
68 | }
69 |
70 | .updates p code {
71 |     border-radius: 4px;
72 |     background: hsla(44, 6%, 50%, .15);
73 |     padding: 0 .4em 3px .4em;
74 |     line-height: normal;
75 |
76 | }
77 |
78 | .updates a {
79 |     text-decoration: underline;
80 | }
81 |
82 | .updates blockquote p {
83 |     margin: 7px 2px;
84 |     padding-left: 14px;
85 |     padding-right: 14px;
86 |     border-left: 3px solid;
87 |     color: hsl(var(--foreground));
88 | }
89 |
90 | .updates b,
91 | .updates strong {
92 |     font-weight: 500;
93 | }
94 |
95 | pre::-webkit-scrollbar {
96 |     display: none;
97 | }
98 |
99 | pre {
100 |     -ms-overflow-style: none; /* IE and Edge */
101 |     scrollbar-width: none; /* Firefox */
102 |     padding: 20px;
103 |     border: 1px solid;
104 |     border-color: hsl(var(--border));
105 |     border-radius: 10px;
106 |     margin: 20px 0 !important;
107 |     background-color: #0C0C0C;
108 |     overflow: auto;
109 | }
110 |
111 | pre code {
112 |     font-size: 13px;
113 |     font-weight: 500 !important;
114 | }
115 |
116 | .dark .dotted-bg {
117 |     background-image: radial-gradient(circle at 1px 1px, #232323 1px, transparent 0);
118 |     background-size: 8px 8px;
119 | }
120 |
121 | .light .dotted-bg {
122 |     background-image: radial-gradient(circle at 1px 1px, #e7e7e7 1px, transparent 0);
123 |     background-size: 8px 8px;
124 | }
125 |
126 | .text-stroke {
127 |     color: white;
128 |     text-shadow: -1px 1px 0 black,
129 |     1px 1px 0 black,
130 |     1px -1px 0 black,
131 |     -1px -1px 0 black;
132 | }
133 |
134 |
135 | .dark .text-stroke {
136 |     color: black;
137 |     text-shadow: -1px 1px 0 white,
138 |     1px 1px 0 white,
139 |     1px -1px 0 white,
140 |     -1px -1px 0 white;
141 | }
142 |
143 | .dark .text-dotted {
144 |     background-image: radial-gradient(circle at 0.4px 0.2px, #fff 1px, transparent 0);
145 |     background-size: 5px 5px;
146 |     background-clip: text;
147 |    -webkit-text-fill-color: transparent;
148 | }
149 |
150 | .text-dotted {
151 |     background-image: radial-gradient(circle at 0.4px 0.2px, #000 1px, transparent 0);
152 |     background-size: 5px 5px;
153 |     background-clip: text;
154 |    -webkit-text-fill-color: transparent;
155 | }
156 |
157 | ::selection {
158 |     background: #00cc9937;
159 |     color: #007763fd
160 | }
161 |
162 | img::selection {
163 |     background: transparent;
164 |  }
```

apps/website/src/utils/resend.ts
```
1 | import { Resend } from "resend";
2 |
3 | export const resend = new Resend(process.env.RESEND_API_KEY!);
```

packages/app-store/src/cal/config.ts
```
1 | import { Logo } from "./assets/logo";
2 |
3 | export default {
4 |   name: "Cal.com",
5 |   id: "cal",
6 |   active: false,
7 |   logo: Logo,
8 |   short_description:
9 |     "Integrating with Cal.com automatically synchronizes your tracked hours with your calendar, allowing you to easily monitor your progress on your projects.",
10 |   description:
11 |     "Integrating with Xero streamlines your financial processes by seamlessly syncing transactions and attachments directly into your bookkeeping software. This integration ensures that your financial data is neatly organized, eliminating the hassle of manual data entry and reducing the likelihood of errors. With transactions and attachments automatically sorted within your accounting system, you and your accountant can efficiently reconcile accounts and close your books in a timelier manner. This not only saves valuable time but also enhances the accuracy and reliability of your financial records, providing you with a clearer picture of your business's financial health.",
12 |   images: [],
13 |   onInitialize: () => {},
14 |   settings: {},
15 |   config: {},
16 | };
```

packages/app-store/src/db/index.ts
```
1 | import { createClient } from "@midday/supabase/server";
2 |
3 | export async function createApp(params: any) {
4 |   const client = createClient({ admin: true });
5 |
6 |   const { data, error } = await client
7 |     .from("apps")
8 |     .upsert(params)
9 |     .select()
10 |     .single();
11 |
12 |   if (error) {
13 |     throw new Error(error.message);
14 |   }
15 |
16 |   return data;
17 | }
```

packages/app-store/src/fortnox/config.ts
```
1 | import { Logo } from "./assets/logo";
2 |
3 | export default {
4 |   name: "Fortnox",
5 |   id: "fortnox",
6 |   active: false,
7 |   logo: Logo,
8 |   short_description:
9 |     "By seamlessly integrating with Fortnox, you gain the ability to effortlessly synchronize every transaction and attachment, ensuring meticulous organization within your bookkeeping software. ",
10 |   description: null,
11 |   images: [],
12 |   onInitialize: () => {},
13 |   settings: {},
14 |   config: {},
15 | };
```

packages/app-store/src/quick-books/config.ts
```
1 | import { Logo } from "./assets/logo";
2 |
3 | export default {
4 |   name: "QuickBooks",
5 |   id: "quick-books",
6 |   active: false,
7 |   logo: Logo,
8 |   short_description:
9 |     "Integrating with QuickBooks enables you to synchronize transactions and attachments, neatly organizing them in your bookkeeping software. This streamlines the process for you or your accountant to close your books faster.",
10 |   description: null,
11 |   images: [],
12 |   onInitialize: () => {},
13 |   settings: {},
14 |   config: {},
15 | };
```

packages/app-store/src/raycast/config.ts
```
1 | import { Logo } from "./assets/logo";
2 |
3 | export default {
4 |   name: "Raycast",
5 |   id: "raycast",
6 |   category: "Time Tracking",
7 |   active: false,
8 |   logo: Logo,
9 |   short_description:
10 |     "Track time directly in Raycast. You can start a timer, add time to an existing project or create a new project directly from Raycast.",
11 |   description: null,
12 |   images: [],
13 | };
```

packages/app-store/src/slack/config.ts
```
1 | import image from "./assets/image.png";
2 | import { Logo } from "./assets/logo";
3 | import { onInitialize } from "./initialize";
4 |
5 | export default {
6 |   name: "Slack",
7 |   id: "slack",
8 |   category: "Assistant",
9 |   active: true,
10 |   logo: Logo,
11 |   short_description:
12 |     "Integrating with Slack enables you to use Midday Assistant right from your Slack workspace, you will also get notifications when you have new transactions and more.",
13 |   description:
14 |     "Integrating Midday with Slack brings powerful financial management capabilities directly into your team's communication hub. With this integration, you can seamlessly interact with Midday Assistant without leaving your Slack workspace, enabling quick access to financial insights and actions. \n\nYou'll receive timely notifications about new transactions, ensuring you're always up-to-date with your financial activities. Moreover, this integration streamlines your workflow by allowing you to upload attachments for transactions directly from Slack. \n\nWhether it's receipts, invoices, or any other relevant documents, you can easily attach them to your transactions without switching between multiple applications. This feature not only saves time but also ensures that all your financial documentation is properly organized and linked to the correct transactions, enhancing your overall bookkeeping efficiency.",
15 |   images: [image],
16 |   onInitialize,
17 |   settings: [
18 |     {
19 |       id: "transactions",
20 |       label: "Transactions",
21 |       description:
22 |         "Get notified when a new transaction is added. This will notify you in the channel you have selected.",
23 |       type: "switch",
24 |       required: false,
25 |       value: true,
26 |     },
27 |   ],
28 | };
```

packages/app-store/src/slack/index.ts
```
1 | export { default as config } from "./config";
2 | export { verifySlackRequest } from "@slack/bolt";
3 | export * from "./lib";
```

packages/app-store/src/slack/initialize.ts
```
1 | export const onInitialize = async () => {
2 |   const response = await fetch("/api/apps/slack/install-url").then((res) =>
3 |     res.json(),
4 |   );
5 |
6 |   const { url } = response;
7 |
8 |   const width = 600;
9 |   const height = 800;
10 |   const left = window.screenX + (window.outerWidth - width) / 2;
11 |   const top = window.screenY + (window.outerHeight - height) / 2.5;
12 |
13 |   const popup = window.open(
14 |     url,
15 |     "",
16 |     `toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=${width}, height=${height}, top=${top}, left=${left}`,
17 |   );
18 |
19 |   // The popup might have been blocked, so we redirect the user to the URL instead
20 |   if (!popup) {
21 |     window.location.href = url;
22 |     return;
23 |   }
24 |
25 |   const listener = (e: MessageEvent) => {
26 |     if (e.data === "app_oauth_completed") {
27 |       window.location.reload();
28 |       window.removeEventListener("message", listener);
29 |       popup.close();
30 |     }
31 |   };
32 |
33 |   window.addEventListener("message", listener);
34 | };
```

packages/app-store/src/visma/config.ts
```
1 | import { Logo } from "./assets/logo";
2 |
3 | export default {
4 |   name: "Visma",
5 |   id: "visma",
6 |   active: false,
7 |   logo: Logo,
8 |   short_description:
9 |     "Integrating with Visma allows you to synchronize transactions and attachments, neatly organizing them within your bookkeeping software. This streamlines the process for you or your accountant to close your books faster.",
10 |   description: null,
11 |   images: [],
12 |   onInitialize: () => {},
13 |   settings: {},
14 |   config: {},
15 | };
```

packages/app-store/src/xero/config.ts
```
1 | import { Logo } from "./assets/logo";
2 |
3 | export default {
4 |   name: "Xero",
5 |   id: "xero",
6 |   active: false,
7 |   logo: Logo,
8 |   short_description:
9 |     "Integrating with Xero allows you to synchronize transactions and attachments neatly organized in your bookkeeping software, making it easier for you or your accountant to close your books faster.",
10 |   description: null,
11 |   images: [],
12 |   onInitialize: () => {},
13 |   settings: {},
14 |   config: {},
15 | };
```

packages/app-store/src/zapier/config.ts
```
1 | import { Logo } from "./assets/logo";
2 |
3 | export default {
4 |   name: "Zapier",
5 |   id: "zapier",
6 |   category: "Automation",
7 |   active: false,
8 |   logo: Logo,
9 |   short_description:
10 |     "Zapier lets you connect Midday to other apps and automate powerful workflows.",
11 |   description: null,
12 |   images: [],
13 |   onInitialize: () => {},
14 | };
```

packages/documents/src/provider/azure.ts
```
1 | import DocumentIntelligence from "@azure-rest/ai-document-intelligence";
2 |
3 | export const client = DocumentIntelligence(
4 |   process.env.AZURE_DOCUMENT_INTELLIGENCE_ENDPOINT!,
5 |   {
6 |     key: process.env.AZURE_DOCUMENT_INTELLIGENCE_KEY!,
7 |   },
8 | );
```

packages/invoice/src/editor/index.tsx
```
1 | export function Editor() {
2 |   return null;
3 | }
```

packages/invoice/src/templates/types.ts
```
1 | export type Template = {
2 |   logo_url?: string;
3 |   from_label: string;
4 |   customer_label: string;
5 |   invoice_no_label: string;
6 |   issue_date_label: string;
7 |   due_date_label: string;
8 |   date_format: string;
9 |   payment_label: string;
10 |   note_label: string;
11 |   description_label: string;
12 |   quantity_label: string;
13 |   price_label: string;
14 |   total_label: string;
15 |   total_summary_label: string;
16 |   tax_label: string;
17 |   vat_label: string;
18 |   locale: string;
19 |   timezone: string;
20 |   include_decimals: boolean;
21 |   include_units: boolean;
22 |   include_qr: boolean;
23 |   include_vat: boolean;
24 |   title: string;
25 |   subtotal_label: string;
26 |   subtotal: number;
27 | };
28 |
29 | export type LineItem = {
30 |   name: string;
31 |   quantity: number;
32 |   price: number;
33 |   unit?: string;
34 |   invoice_number?: string;
35 |   issue_date?: string;
36 |   due_date?: string;
37 | };
38 |
39 | export type TemplateProps = {
40 |   title: string;
41 |   invoice_number: string;
42 |   discount?: number;
43 |   issue_date: string;
44 |   due_date: string;
45 |   template: Template;
46 |   line_items: LineItem[];
47 |   customer_details?: JSON;
48 |   payment_details?: JSON;
49 |   from_details?: JSON;
50 |   note_details?: JSON;
51 |   currency: string;
52 |   amount: number;
53 |   customer_name?: string;
54 |   vat?: number;
55 |   tax?: number;
56 |   width: number;
57 |   height: number;
58 |   token: string;
59 |   size: "letter" | "a4";
60 |   top_block?: JSON;
61 |   bottom_block?: JSON;
62 |   subtotal?: number;
63 | };
64 |
65 | export interface EditorDoc {
66 |   type: "doc";
67 |   content: EditorNode[];
68 | }
69 |
70 | export interface EditorNode {
71 |   type: string;
72 |   content?: InlineContent[];
73 | }
74 |
75 | interface InlineContent {
76 |   type: string;
77 |   text?: string;
78 |   marks?: Mark[];
79 | }
80 |
81 | export interface Mark {
82 |   type: string;
83 |   attrs?: {
84 |     href?: string;
85 |   };
86 | }
87 |
88 | export interface TextStyle {
89 |   fontSize: number;
90 |   fontWeight?: number;
91 |   fontStyle?: "normal" | "italic" | "oblique";
92 |   color?: string;
93 |   textDecoration?: string;
94 | }
```

packages/invoice/src/utils/calculate.test.ts
```
1 | import { describe, expect, it } from "bun:test";
2 | import { calculateLineItemTotal, calculateTotal } from "./calculate";
3 |
4 | describe("calculateTotal", () => {
5 |   const sampleLineItems = [
6 |     { price: 100, quantity: 2 },
7 |     { price: 50, quantity: 1 },
8 |   ];
9 |
10 |   it("should calculate subtotal correctly", () => {
11 |     const result = calculateTotal({ lineItems: sampleLineItems });
12 |     expect(result.subTotal).toBe(250); // (100 * 2) + (50 * 1)
13 |   });
14 |
15 |   it("should calculate VAT correctly when included", () => {
16 |     const result = calculateTotal({
17 |       lineItems: sampleLineItems,
18 |       includeVAT: true,
19 |       vatRate: 10,
20 |     });
21 |     expect(result.vat).toBe(25); // 250 * 0.1
22 |   });
23 |
24 |   it("should not include VAT when disabled", () => {
25 |     const result = calculateTotal({
26 |       lineItems: sampleLineItems,
27 |       includeVAT: false,
28 |       vatRate: 10,
29 |     });
30 |     expect(result.vat).toBe(0);
31 |   });
32 |
33 |   it("should apply discount correctly", () => {
34 |     const result = calculateTotal({
35 |       lineItems: sampleLineItems,
36 |       discount: 20,
37 |       includeVAT: true,
38 |       vatRate: 10,
39 |     });
40 |     expect(result.total).toBe(255); // (250 + 25 - 20)
41 |   });
42 |
43 |   it("should calculate tax correctly when included", () => {
44 |     const result = calculateTotal({
45 |       lineItems: sampleLineItems,
46 |       taxRate: 15,
47 |       includeTax: true,
48 |       includeVAT: true,
49 |       vatRate: 10,
50 |     });
51 |     expect(result.tax).toBe(41.25); // (250 + 25) * 0.15
52 |   });
53 |
54 |   it("should handle empty line items", () => {
55 |     const result = calculateTotal({ lineItems: [] });
56 |     expect(result.subTotal).toBe(0);
57 |     expect(result.total).toBe(0);
58 |     expect(result.vat).toBe(0);
59 |     expect(result.tax).toBe(0);
60 |   });
61 | });
62 |
63 | describe("calculateLineItemTotal", () => {
64 |   it("should calculate total price correctly", () => {
65 |     const result = calculateLineItemTotal({
66 |       price: 100,
67 |       quantity: 2,
68 |     });
69 |     expect(result).toBe(200);
70 |   });
71 |
72 |   it("should handle zero values", () => {
73 |     const result = calculateLineItemTotal({});
74 |     expect(result).toBe(0);
75 |   });
76 |
77 |   it("should handle undefined values", () => {
78 |     const result = calculateLineItemTotal({
79 |       price: undefined,
80 |       quantity: undefined,
81 |     });
82 |     expect(result).toBe(0);
83 |   });
84 | });
```

packages/invoice/src/utils/calculate.ts
```
1 | export function calculateTotal({
2 |   lineItems,
3 |   taxRate = 0,
4 |   vatRate = 0,
5 |   discount = 0,
6 |   includeVAT = true,
7 |   includeTax = true,
8 | }: {
9 |   lineItems: Array<{ price?: number; quantity?: number }>;
10 |   taxRate?: number;
11 |   vatRate?: number;
12 |   discount?: number;
13 |   includeVAT?: boolean;
14 |   includeTax?: boolean;
15 | }) {
16 |   // Calculate Subtotal: Sum of all Base Prices for line items
17 |   const subTotal = lineItems.reduce((acc, item) => {
18 |     return acc + (item.price ?? 0) * (item.quantity ?? 0);
19 |   }, 0);
20 |
21 |   // Calculate VAT (Total): Calculate VAT on the Subtotal
22 |   const totalVAT = includeVAT ? (subTotal * vatRate) / 100 : 0;
23 |
24 |   // Calculate Total: Subtotal + VAT - Discount
25 |   const total = subTotal + (includeVAT ? totalVAT : 0) - discount;
26 |
27 |   // Calculate tax (if included)
28 |   const tax = includeTax ? (total * taxRate) / 100 : 0;
29 |
30 |   return {
31 |     subTotal,
32 |     total: total + tax,
33 |     vat: totalVAT,
34 |     tax,
35 |   };
36 | }
37 |
38 | export function calculateLineItemTotal({
39 |   price = 0,
40 |   quantity = 0,
41 | }: {
42 |   price?: number;
43 |   quantity?: number;
44 | }) {
45 |   // Calculate and return total price
46 |   return price * quantity;
47 | }
```

packages/invoice/src/utils/content.ts
```
1 | export function isValidJSON(str: string | null | undefined): boolean {
2 |   if (!str) return false;
3 |   try {
4 |     JSON.parse(str);
5 |     return true;
6 |   } catch {
7 |     return false;
8 |   }
9 | }
```

packages/invoice/src/utils/default.ts
```
1 | import { getCountryCode, getLocale, getTimezone } from "@midday/location";
2 | import { currencies } from "@midday/location/currencies";
3 | import { getUser } from "@midday/supabase/cached-queries";
4 |
5 | export type Settings = {
6 |   currency: string;
7 |   size: string;
8 |   include_tax: boolean;
9 |   include_vat: boolean;
10 |   include_discount: boolean;
11 |   include_decimals: boolean;
12 |   include_units: boolean;
13 |   include_qr: boolean;
14 |   timezone: string;
15 |   locale: string;
16 | };
17 |
18 | export async function getDefaultSettings(): Promise<Settings> {
19 |   const countryCode = getCountryCode();
20 |
21 |   const { data: userData } = await getUser();
22 |
23 |   const currency =
24 |     userData?.team?.base_currency ??
25 |     currencies[countryCode as keyof typeof currencies] ??
26 |     "USD";
27 |
28 |   const timezone = userData?.timezone ?? getTimezone();
29 |   const locale = userData?.locale ?? getLocale();
30 |
31 |   // Default to letter size for US/CA, A4 for rest of world
32 |   const size = ["US", "CA"].includes(countryCode) ? "letter" : "a4";
33 |
34 |   // Default to include sales tax for countries where it's common
35 |   const include_tax = ["US", "CA", "AU", "NZ", "SG", "MY", "IN"].includes(
36 |     countryCode,
37 |   );
38 |
39 |   return {
40 |     currency: currency.toUpperCase(),
41 |     size,
42 |     include_tax,
43 |     include_vat: !include_tax,
44 |     include_discount: false,
45 |     include_decimals: false,
46 |     include_units: false,
47 |     include_qr: true,
48 |     timezone,
49 |     locale,
50 |   };
51 | }
```

packages/invoice/src/utils/logo.ts
```
1 | export async function isValidLogoUrl(url: string): Promise<boolean> {
2 |   if (!url) return false;
3 |
4 |   try {
5 |     const response = await fetch(url);
6 |
7 |     return response.ok;
8 |   } catch {
9 |     return false;
10 |   }
11 | }
```

packages/invoice/src/utils/number.test.ts
```
1 | import { describe, expect, it, test } from "bun:test";
2 | import { generateInvoiceNumber } from "./number";
3 |
4 | describe("Generate invoice number", () => {
5 |   it("should generate correct invoice number for count less than 10", () => {
6 |     expect(generateInvoiceNumber(0)).toBe("INV-001");
7 |     expect(generateInvoiceNumber(5)).toBe("INV-006");
8 |     expect(generateInvoiceNumber(9)).toBe("INV-010");
9 |   });
10 |
11 |   it("should generate correct invoice number for count between 10 and 99", () => {
12 |     expect(generateInvoiceNumber(10)).toBe("INV-011");
13 |     expect(generateInvoiceNumber(50)).toBe("INV-051");
14 |     expect(generateInvoiceNumber(99)).toBe("INV-100");
15 |   });
16 |
17 |   it("should generate correct invoice number for count 100 and above", () => {
18 |     expect(generateInvoiceNumber(100)).toBe("INV-101");
19 |     expect(generateInvoiceNumber(500)).toBe("INV-501");
20 |     expect(generateInvoiceNumber(999)).toBe("INV-1000");
21 |   });
22 |
23 |   it("should handle large numbers correctly", () => {
24 |     expect(generateInvoiceNumber(9999)).toBe("INV-10000");
25 |     expect(generateInvoiceNumber(99999)).toBe("INV-100000");
26 |   });
27 | });
```

packages/supabase/src/client/client.ts
```
1 | import { createBrowserClient } from "@supabase/ssr";
2 | import type { Database } from "../types";
3 |
4 | export const createClient = () => {
5 |   return createBrowserClient<Database>(
6 |     process.env.NEXT_PUBLIC_SUPABASE_URL!,
7 |     process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
8 |     {
9 |       global: {
10 |         headers: {
11 |           // https://supabase.com/docs/guides/platform/read-replicas#experimental-routing
12 |           "sb-lb-routing-mode": "alpha-all-services",
13 |         },
14 |       },
15 |     },
16 |   );
17 | };
```

packages/supabase/src/client/job.ts
```
1 | import { createClient as createSupabaseClient } from "@supabase/supabase-js";
2 | import type { Database } from "../types/db";
3 |
4 | export const createClient = () =>
5 |   createSupabaseClient<Database>(
6 |     process.env.NEXT_PUBLIC_SUPABASE_URL!,
7 |     process.env.SUPABASE_SERVICE_KEY!,
8 |     {
9 |       global: {
10 |         headers: {
11 |           "sb-lb-routing-mode": "alpha-all-services",
12 |         },
13 |       },
14 |     },
15 |   );
```

packages/supabase/src/client/middleware.ts
```
1 | import { type CookieOptions, createServerClient } from "@supabase/ssr";
2 | import type { NextRequest, NextResponse } from "next/server";
3 |
4 | export async function updateSession(
5 |   request: NextRequest,
6 |   response: NextResponse,
7 | ) {
8 |   const supabase = createServerClient(
9 |     process.env.NEXT_PUBLIC_SUPABASE_URL!,
10 |     process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
11 |     {
12 |       global: {
13 |         headers: {
14 |           // https://supabase.com/docs/guides/platform/read-replicas#experimental-routing
15 |           "sb-lb-routing-mode": "alpha-all-services",
16 |         },
17 |       },
18 |       cookies: {
19 |         get(name: string) {
20 |           return request.cookies.get(name)?.value;
21 |         },
22 |         set(name: string, value: string, options: CookieOptions) {
23 |           request.cookies.set({ name, value, ...options });
24 |           response.cookies.set({ name, value, ...options });
25 |         },
26 |         remove(name: string, options: CookieOptions) {
27 |           request.cookies.set({ name, value: "", ...options });
28 |           response.cookies.set({ name, value: "", ...options });
29 |         },
30 |       },
31 |     },
32 |   );
33 |
34 |   await supabase.auth.getUser();
35 |
36 |   return response;
37 | }
```

packages/supabase/src/client/server.ts
```
1 | import { type CookieOptions, createServerClient } from "@supabase/ssr";
2 | import { cookies, headers } from "next/headers";
3 | import type { Database } from "../types";
4 |
5 | const conWarn = console.warn;
6 | const conLog = console.log;
7 |
8 | const IGNORE_WARNINGS = [
9 |   "Using the user object as returned from supabase.auth.getSession()",
10 | ];
11 |
12 | console.warn = (...args) => {
13 |   const match = args.find((arg) =>
14 |     typeof arg === "string"
15 |       ? IGNORE_WARNINGS.find((warning) => arg.includes(warning))
16 |       : false,
17 |   );
18 |   if (!match) {
19 |     conWarn(...args);
20 |   }
21 | };
22 |
23 | console.log = (...args) => {
24 |   const match = args.find((arg) =>
25 |     typeof arg === "string"
26 |       ? IGNORE_WARNINGS.find((warning) => arg.includes(warning))
27 |       : false,
28 |   );
29 |   if (!match) {
30 |     conLog(...args);
31 |   }
32 | };
33 |
34 | type CreateClientOptions = {
35 |   admin?: boolean;
36 |   schema?: "public" | "storage";
37 | };
38 |
39 | export const createClient = (options?: CreateClientOptions) => {
40 |   const { admin = false, ...rest } = options ?? {};
41 |
42 |   const cookieStore = cookies();
43 |
44 |   const key = admin
45 |     ? process.env.SUPABASE_SERVICE_KEY!
46 |     : process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
47 |
48 |   const auth = admin
49 |     ? {
50 |         persistSession: false,
51 |         autoRefreshToken: false,
52 |         detectSessionInUrl: false,
53 |       }
54 |     : {};
55 |
56 |   return createServerClient<Database>(
57 |     process.env.NEXT_PUBLIC_SUPABASE_URL!,
58 |     key,
59 |     {
60 |       ...rest,
61 |       cookies: {
62 |         get(name: string) {
63 |           return cookieStore.get(name)?.value;
64 |         },
65 |         set(name: string, value: string, options: CookieOptions) {
66 |           try {
67 |             cookieStore.set({ name, value, ...options });
68 |           } catch (error) {}
69 |         },
70 |         remove(name: string, options: CookieOptions) {
71 |           try {
72 |             cookieStore.set({ name, value: "", ...options });
73 |           } catch (error) {}
74 |         },
75 |       },
76 |       auth,
77 |       global: {
78 |         headers: {
79 |           // Pass user agent from browser
80 |           "user-agent": headers().get("user-agent") as string,
81 |           // https://supabase.com/docs/guides/platform/read-replicas#experimental-routing
82 |           "sb-lb-routing-mode": "alpha-all-services",
83 |         },
84 |       },
85 |     },
86 |   );
87 | };
```

packages/supabase/src/mutations/index.ts
```
1 | import { getAccessValidForDays } from "@midday/engine/gocardless/utils";
2 | import { addDays } from "date-fns";
3 | import { getCurrentUserTeamQuery, getUserInviteQuery } from "../queries";
4 | import type { Client } from "../types";
5 |
6 | type CreateBankConnectionPayload = {
7 |   accounts: {
8 |     account_id: string;
9 |     institution_id: string;
10 |     logo_url: string;
11 |     name: string;
12 |     bank_name: string;
13 |     currency: string;
14 |     enabled: boolean;
15 |     balance: number;
16 |     type: "depository" | "credit" | "other_asset" | "loan" | "other_liability";
17 |     account_reference: string | null;
18 |   }[];
19 |   balance: number;
20 |   accessToken?: string;
21 |   enrollmentId?: string;
22 |   referenceId?: string;
23 |   teamId: string;
24 |   userId: string;
25 |   provider: "gocardless" | "teller" | "plaid";
26 | };
27 |
28 | export async function createBankConnection(
29 |   supabase: Client,
30 |   {
31 |     accounts,
32 |     accessToken,
33 |     enrollmentId,
34 |     referenceId,
35 |     teamId,
36 |     userId,
37 |     provider,
38 |   }: CreateBankConnectionPayload,
39 | ) {
40 |   // Get first account to create a bank connection
41 |   const account = accounts?.at(0);
42 |
43 |   if (!account) {
44 |     return;
45 |   }
46 |
47 |   // NOTE: GoCardLess connection expires after 90-180 days
48 |   const expiresAt =
49 |     provider === "gocardless"
50 |       ? addDays(
51 |           new Date(),
52 |           getAccessValidForDays({ institutionId: account.institution_id }),
53 |         ).toDateString()
54 |       : undefined;
55 |
56 |   const bankConnection = await supabase
57 |     .from("bank_connections")
58 |     .upsert(
59 |       {
60 |         institution_id: account.institution_id,
61 |         name: account.bank_name,
62 |         logo_url: account.logo_url,
63 |         team_id: teamId,
64 |         provider,
65 |         access_token: accessToken,
66 |         enrollment_id: enrollmentId,
67 |         reference_id: referenceId,
68 |         expires_at: expiresAt,
69 |       },
70 |       {
71 |         onConflict: "institution_id, team_id",
72 |       },
73 |     )
74 |     .select()
75 |     .single();
76 |
77 |   await supabase.from("bank_accounts").upsert(
78 |     accounts.map(
79 |       (account) => ({
80 |         account_id: account.account_id,
81 |         bank_connection_id: bankConnection?.data?.id,
82 |         team_id: teamId,
83 |         created_by: userId,
84 |         name: account.name,
85 |         currency: account.currency,
86 |         enabled: account.enabled,
87 |         type: account.type,
88 |         account_reference: account.account_reference,
89 |         balance: account.balance ?? 0,
90 |       }),
91 |       {
92 |         onConflict: "account_id",
93 |       },
94 |     ),
95 |   );
96 |
97 |   return bankConnection;
98 | }
99 |
100 | type UpdateBankConnectionData = {
101 |   id: string;
102 |   referenceId?: string;
103 | };
104 |
105 | // NOTE: Only GoCardLess needs to be updated
106 | export async function updateBankConnection(
107 |   supabase: Client,
108 |   data: UpdateBankConnectionData,
109 | ) {
110 |   const { id, referenceId } = data;
111 |
112 |   return await supabase
113 |     .from("bank_connections")
114 |     .update({
115 |       expires_at: addDays(
116 |         new Date(),
117 |         getAccessValidForDays({ institutionId: id }),
118 |       ).toDateString(),
119 |       reference_id: referenceId,
120 |     })
121 |     .eq("id", id)
122 |     .select()
123 |     .single();
124 | }
125 |
126 | type CreateTransactionsData = {
127 |   transactions: any[];
128 |   teamId: string;
129 | };
130 |
131 | export async function createTransactions(
132 |   supabase: Client,
133 |   data: CreateTransactionsData,
134 | ) {
135 |   const { transactions, teamId } = data;
136 |
137 |   return supabase.from("transactions").insert(
138 |     transactions.map((transaction) => ({
139 |       ...transaction,
140 |       team_id: teamId,
141 |     })),
142 |   );
143 | }
144 |
145 | export async function updateTransaction(
146 |   supabase: Client,
147 |   id: string,
148 |   data: any,
149 | ) {
150 |   return supabase
151 |     .from("transactions")
152 |     .update(data)
153 |     .eq("id", id)
154 |     .select("id, category, category_slug, team_id, name, status, internal")
155 |     .single();
156 | }
157 |
158 | export async function updateUser(supabase: Client, data: any) {
159 |   const {
160 |     data: { session },
161 |   } = await supabase.auth.getSession();
162 |
163 |   if (!session?.user) {
164 |     return;
165 |   }
166 |
167 |   return supabase
168 |     .from("users")
169 |     .update(data)
170 |     .eq("id", session.user.id)
171 |     .select()
172 |     .single();
173 | }
174 |
175 | export async function deleteUser(supabase: Client) {
176 |   const {
177 |     data: { session },
178 |   } = await supabase.auth.getSession();
179 |
180 |   if (!session?.user) {
181 |     return;
182 |   }
183 |
184 |   await Promise.all([
185 |     supabase.auth.admin.deleteUser(session.user.id),
186 |     supabase.from("users").delete().eq("id", session.user.id),
187 |     supabase.auth.signOut(),
188 |   ]);
189 |
190 |   return session.user.id;
191 | }
192 |
193 | export async function updateTeam(supabase: Client, data: any) {
[TRUNCATED]
```

packages/supabase/src/queries/cached-queries.ts
```
1 | import "server-only";
2 |
3 | import { unstable_cache } from "next/cache";
4 | import { cache } from "react";
5 | import { createClient } from "../client/server";
6 | import {
7 |   type GetBurnRateQueryParams,
8 |   type GetCategoriesParams,
9 |   type GetCustomersQueryParams,
10 |   type GetExpensesQueryParams,
11 |   type GetInvoiceSummaryParams,
12 |   type GetInvoicesQueryParams,
13 |   type GetMetricsParams,
14 |   type GetRunwayQueryParams,
15 |   type GetSpendingParams,
16 |   type GetTeamBankAccountsParams,
17 |   type GetTrackerProjectsQueryParams,
18 |   type GetTrackerRecordsByRangeParams,
19 |   type GetTransactionsParams,
20 |   getBankAccountsBalancesQuery,
21 |   getBankAccountsCurrenciesQuery,
22 |   getBankConnectionsByTeamIdQuery,
23 |   getBurnRateQuery,
24 |   getCategoriesQuery,
25 |   getCustomersQuery,
26 |   getExpensesQuery,
27 |   getInvoiceSummaryQuery,
28 |   getInvoiceTemplatesQuery,
29 |   getInvoicesQuery,
30 |   getLastInvoiceNumberQuery,
31 |   getMetricsQuery,
32 |   getPaymentStatusQuery,
33 |   getRunwayQuery,
34 |   getSpendingQuery,
35 |   getTagsQuery,
36 |   getTeamBankAccountsQuery,
37 |   getTeamInvitesQuery,
38 |   getTeamMembersQuery,
39 |   getTeamSettingsQuery,
40 |   getTeamUserQuery,
41 |   getTeamsByUserIdQuery,
42 |   getTrackerProjectsQuery,
43 |   getTrackerRecordsByRangeQuery,
44 |   getTransactionsQuery,
45 |   getUserInvitesQuery,
46 |   getUserQuery,
47 | } from "../queries";
48 |
49 | export const getTransactions = async (
50 |   params: Omit<GetTransactionsParams, "teamId">,
51 | ) => {
52 |   const supabase = createClient();
53 |   const user = await getUser();
54 |   const teamId = user?.data?.team_id;
55 |
56 |   if (!teamId) {
57 |     return null;
58 |   }
59 |
60 |   return unstable_cache(
61 |     async () => {
62 |       return getTransactionsQuery(supabase, { ...params, teamId });
63 |     },
64 |     ["transactions", teamId],
65 |     {
66 |       revalidate: 600,
67 |       tags: [`transactions_${teamId}`],
68 |     },
69 |   )(params);
70 | };
71 |
72 | // Cache per request
73 | export const getSession = cache(async () => {
74 |   const supabase = createClient();
75 |
76 |   return supabase.auth.getSession();
77 | });
78 |
79 | // Cache per request and revalidate every 30 minutes
80 | export const getUser = cache(async () => {
81 |   const {
82 |     data: { session },
83 |   } = await getSession();
84 |
85 |   const userId = session?.user?.id;
86 |
87 |   if (!userId) {
88 |     return null;
89 |   }
90 |
91 |   const supabase = createClient();
92 |
93 |   return unstable_cache(
94 |     async () => {
95 |       return getUserQuery(supabase, userId);
96 |     },
97 |     ["user", userId],
98 |     {
99 |       tags: [`user_${userId}`],
100 |       // 30 minutes, jwt expires in 1 hour
101 |       revalidate: 1800,
102 |     },
103 |   )();
104 | });
105 |
106 | export const getTeamUser = async () => {
107 |   const supabase = createClient();
108 |   const { data } = await getUser();
109 |
110 |   return unstable_cache(
111 |     async () => {
112 |       return getTeamUserQuery(supabase, {
113 |         userId: data.id,
114 |         teamId: data.team_id,
115 |       });
116 |     },
117 |     ["team", "user", data.id],
118 |     {
119 |       tags: [`team_user_${data.id}`],
120 |       revalidate: 1800,
121 |     },
122 |   )(data.id);
123 | };
124 |
125 | export const getBankConnectionsByTeamId = async () => {
126 |   const supabase = createClient();
127 |   const user = await getUser();
128 |   const teamId = user?.data?.team_id;
129 |
130 |   if (!teamId) {
131 |     return null;
132 |   }
133 |
134 |   return unstable_cache(
135 |     async () => {
136 |       return getBankConnectionsByTeamIdQuery(supabase, teamId);
137 |     },
138 |     ["bank_connections", teamId],
139 |     {
140 |       tags: [`bank_connections_${teamId}`],
141 |       revalidate: 3600,
142 |     },
143 |   )(teamId);
144 | };
145 |
146 | export const getTeamBankAccounts = async (
147 |   params?: Omit<GetTeamBankAccountsParams, "teamId">,
148 | ) => {
149 |   const supabase = createClient();
150 |
151 |   const user = await getUser();
152 |   const teamId = user?.data?.team_id;
153 |
154 |   if (!teamId) {
155 |     return null;
156 |   }
157 |
158 |   return unstable_cache(
159 |     async () => {
160 |       return getTeamBankAccountsQuery(supabase, { ...params, teamId });
161 |     },
162 |     ["bank_accounts", teamId],
163 |     {
164 |       tags: [`bank_accounts_${teamId}`],
165 |       revalidate: 180,
166 |     },
167 |   )(params);
168 | };
169 |
170 | export const getTeamMembers = async () => {
171 |   const supabase = createClient();
172 |
173 |   const user = await getUser();
174 |   const teamId = user?.data?.team_id;
175 |
176 |   if (!teamId) {
177 |     return null;
178 |   }
179 |
180 |   return unstable_cache(
181 |     async () => {
182 |       return getTeamMembersQuery(supabase, teamId);
183 |     },
184 |     ["team_members", teamId],
185 |     {
186 |       tags: [`team_members_${teamId}`],
187 |       revalidate: 180,
188 |     },
189 |   )(teamId);
190 | };
191 |
192 | export const getSpending = async (
193 |   params: Omit<GetSpendingParams, "teamId">,
194 | ) => {
195 |   const supabase = createClient();
196 |   const user = await getUser();
197 |   const teamId = user?.data?.team_id;
198 |
199 |   if (!teamId) {
200 |     return null;
[TRUNCATED]
```

packages/supabase/src/queries/client.ts
```
1 | export { useQuery } from "@supabase-cache-helpers/postgrest-react-query";
```

packages/supabase/src/queries/index.ts
```
1 | import { UTCDate } from "@date-fns/utc";
2 | import {
3 |   addDays,
4 |   endOfMonth,
5 |   formatISO,
6 |   isWithinInterval,
7 |   startOfMonth,
8 |   subYears,
9 | } from "date-fns";
10 | import type { Client } from "../types";
11 |
12 | function transactionCategory(transaction) {
13 |   return (
14 |     transaction?.category ?? {
15 |       id: "uncategorized",
16 |       name: "Uncategorized",
17 |       color: "#606060",
18 |     }
19 |   );
20 | }
21 |
22 | export function getPercentageIncrease(a: number, b: number) {
23 |   return a > 0 && b > 0 ? Math.abs(((a - b) / b) * 100).toFixed() : 0;
24 | }
25 |
26 | export async function getUserQuery(supabase: Client, userId: string) {
27 |   return supabase
28 |     .from("users")
29 |     .select(
30 |       `
31 |       *,
32 |       team:team_id(*)
33 |     `,
34 |     )
35 |     .eq("id", userId)
36 |     .single()
37 |     .throwOnError();
38 | }
39 |
40 | export async function getCurrentUserTeamQuery(supabase: Client) {
41 |   const {
42 |     data: { session },
43 |   } = await supabase.auth.getSession();
44 |
45 |   if (!session?.user) {
46 |     return;
47 |   }
48 |
49 |   return getUserQuery(supabase, session.user?.id);
50 | }
51 |
52 | export async function getBankConnectionsByTeamIdQuery(
53 |   supabase: Client,
54 |   teamId: string,
55 | ) {
56 |   return supabase
57 |     .from("bank_connections")
58 |     .select("*")
59 |     .eq("team_id", teamId)
60 |     .throwOnError();
61 | }
62 |
63 | export type GetTeamBankAccountsParams = {
64 |   teamId: string;
65 |   enabled?: boolean;
66 | };
67 |
68 | export async function getTeamBankAccountsQuery(
69 |   supabase: Client,
70 |   params: GetTeamBankAccountsParams,
71 | ) {
72 |   const { teamId, enabled } = params;
73 |
74 |   const query = supabase
75 |     .from("bank_accounts")
76 |     .select("*, bank:bank_connections(*)")
77 |     .eq("team_id", teamId)
78 |     .order("created_at", { ascending: true })
79 |     .order("name", { ascending: false })
80 |     .throwOnError();
81 |
82 |   if (enabled) {
83 |     query.eq("enabled", enabled);
84 |   }
85 |
86 |   return query;
87 | }
88 |
89 | export async function getTeamMembersQuery(supabase: Client, teamId: string) {
90 |   const { data } = await supabase
91 |     .from("users_on_team")
92 |     .select(
93 |       `
94 |       id,
95 |       role,
96 |       team_id,
97 |       user:users(id, full_name, avatar_url, email)
98 |     `,
99 |     )
100 |     .eq("team_id", teamId)
101 |     .order("created_at")
102 |     .throwOnError();
103 |
104 |   return {
105 |     data,
106 |   };
107 | }
108 |
109 | type GetTeamUserParams = {
110 |   teamId: string;
111 |   userId: string;
112 | };
113 |
114 | export async function getTeamUserQuery(
115 |   supabase: Client,
116 |   params: GetTeamUserParams,
117 | ) {
118 |   const { data } = await supabase
119 |     .from("users_on_team")
120 |     .select(
121 |       `
122 |       id,
123 |       role,
124 |       team_id,
125 |       user:users(id, full_name, avatar_url, email)
126 |     `,
127 |     )
128 |     .eq("team_id", params.teamId)
129 |     .eq("user_id", params.userId)
130 |     .throwOnError()
131 |     .single();
132 |
133 |   return {
134 |     data,
135 |   };
136 | }
137 |
138 | export type GetSpendingParams = {
139 |   from: string;
140 |   to: string;
141 |   teamId: string;
142 |   currency?: string;
143 | };
144 |
145 | export async function getSpendingQuery(
146 |   supabase: Client,
147 |   params: GetSpendingParams,
148 | ) {
149 |   return supabase.rpc("get_spending_v3", {
150 |     team_id: params.teamId,
151 |     date_from: params.from,
152 |     date_to: params.to,
153 |     base_currency: params.currency,
154 |   });
155 | }
156 |
157 | export type GetTransactionsParams = {
158 |   teamId: string;
159 |   to: number;
160 |   from: number;
161 |   sort?: [string, "asc" | "desc"];
162 |   searchQuery?: string;
163 |   filter?: {
164 |     statuses?: string[];
165 |     attachments?: "include" | "exclude";
166 |     categories?: string[];
167 |     tags?: string[];
168 |     accounts?: string[];
169 |     assignees?: string[];
170 |     type?: "income" | "expense";
171 |     start?: string;
172 |     end?: string;
173 |     recurring?: string[];
174 |     amount_range?: [number, number];
175 |     amount?: [string, string];
176 |   };
177 | };
178 |
179 | export async function getTransactionsQuery(
180 |   supabase: Client,
181 |   params: GetTransactionsParams,
182 | ) {
183 |   const { from = 0, to, filter, sort, teamId, searchQuery } = params;
184 |
185 |   const {
186 |     statuses,
187 |     attachments,
188 |     categories,
189 |     tags,
190 |     type,
191 |     accounts,
192 |     start,
193 |     end,
194 |     assignees,
195 |     recurring,
196 |     amount_range,
197 |     amount,
198 |   } = filter || {};
199 |
200 |   const columns = [
201 |     "id",
202 |     "date",
203 |     "amount",
204 |     "currency",
205 |     "method",
206 |     "status",
207 |     "note",
208 |     "manual",
[TRUNCATED]
```

packages/supabase/src/types/db.ts
```
1 | export type Json =
2 |   | string
3 |   | number
4 |   | boolean
5 |   | null
6 |   | { [key: string]: Json | undefined }
7 |   | Json[]
8 |
9 | export type Database = {
10 |   public: {
11 |     Tables: {
12 |       apps: {
13 |         Row: {
14 |           app_id: string
15 |           config: Json | null
16 |           created_at: string | null
17 |           created_by: string | null
18 |           id: string
19 |           settings: Json | null
20 |           team_id: string | null
21 |         }
22 |         Insert: {
23 |           app_id: string
24 |           config?: Json | null
25 |           created_at?: string | null
26 |           created_by?: string | null
27 |           id?: string
28 |           settings?: Json | null
29 |           team_id?: string | null
30 |         }
31 |         Update: {
32 |           app_id?: string
33 |           config?: Json | null
34 |           created_at?: string | null
35 |           created_by?: string | null
36 |           id?: string
37 |           settings?: Json | null
38 |           team_id?: string | null
39 |         }
40 |         Relationships: [
41 |           {
42 |             foreignKeyName: "apps_created_by_fkey"
43 |             columns: ["created_by"]
44 |             isOneToOne: false
45 |             referencedRelation: "users"
46 |             referencedColumns: ["id"]
47 |           },
48 |           {
49 |             foreignKeyName: "integrations_team_id_fkey"
50 |             columns: ["team_id"]
51 |             isOneToOne: false
52 |             referencedRelation: "teams"
53 |             referencedColumns: ["id"]
54 |           },
55 |         ]
56 |       }
57 |       bank_accounts: {
58 |         Row: {
59 |           account_id: string
60 |           account_reference: string | null
61 |           balance: number | null
62 |           bank_connection_id: string | null
63 |           base_balance: number | null
64 |           base_currency: string | null
65 |           created_at: string
66 |           created_by: string
67 |           currency: string | null
68 |           enabled: boolean
69 |           error_details: string | null
70 |           error_retries: number | null
71 |           id: string
72 |           manual: boolean | null
73 |           name: string | null
74 |           team_id: string
75 |           type: Database["public"]["Enums"]["account_type"] | null
76 |         }
77 |         Insert: {
78 |           account_id: string
79 |           account_reference?: string | null
80 |           balance?: number | null
81 |           bank_connection_id?: string | null
82 |           base_balance?: number | null
83 |           base_currency?: string | null
84 |           created_at?: string
85 |           created_by: string
86 |           currency?: string | null
87 |           enabled?: boolean
88 |           error_details?: string | null
89 |           error_retries?: number | null
90 |           id?: string
91 |           manual?: boolean | null
92 |           name?: string | null
93 |           team_id: string
94 |           type?: Database["public"]["Enums"]["account_type"] | null
95 |         }
96 |         Update: {
97 |           account_id?: string
98 |           account_reference?: string | null
99 |           balance?: number | null
100 |           bank_connection_id?: string | null
101 |           base_balance?: number | null
102 |           base_currency?: string | null
103 |           created_at?: string
104 |           created_by?: string
105 |           currency?: string | null
106 |           enabled?: boolean
107 |           error_details?: string | null
108 |           error_retries?: number | null
109 |           id?: string
110 |           manual?: boolean | null
111 |           name?: string | null
112 |           team_id?: string
113 |           type?: Database["public"]["Enums"]["account_type"] | null
114 |         }
115 |         Relationships: [
116 |           {
117 |             foreignKeyName: "bank_accounts_bank_connection_id_fkey"
118 |             columns: ["bank_connection_id"]
119 |             isOneToOne: false
120 |             referencedRelation: "bank_connections"
121 |             referencedColumns: ["id"]
122 |           },
123 |           {
124 |             foreignKeyName: "bank_accounts_created_by_fkey"
125 |             columns: ["created_by"]
126 |             isOneToOne: false
127 |             referencedRelation: "users"
128 |             referencedColumns: ["id"]
129 |           },
130 |           {
131 |             foreignKeyName: "public_bank_accounts_team_id_fkey"
132 |             columns: ["team_id"]
133 |             isOneToOne: false
134 |             referencedRelation: "teams"
135 |             referencedColumns: ["id"]
136 |           },
137 |         ]
138 |       }
139 |       bank_connections: {
140 |         Row: {
141 |           access_token: string | null
142 |           created_at: string
143 |           enrollment_id: string | null
144 |           error_details: string | null
145 |           error_retries: number | null
146 |           expires_at: string | null
147 |           id: string
148 |           institution_id: string
149 |           last_accessed: string | null
150 |           logo_url: string | null
151 |           name: string
152 |           provider: Database["public"]["Enums"]["bank_providers"] | null
153 |           reference_id: string | null
154 |           status: Database["public"]["Enums"]["connection_status"] | null
155 |           team_id: string
156 |         }
157 |         Insert: {
158 |           access_token?: string | null
159 |           created_at?: string
160 |           enrollment_id?: string | null
161 |           error_details?: string | null
[TRUNCATED]
```

packages/supabase/src/types/index.ts
```
1 | import type { SupabaseClient } from "@supabase/supabase-js";
2 | import type { Database } from "../types/db";
3 |
4 | export type Client = SupabaseClient<Database>;
5 |
6 | export * from "./db";
```

packages/supabase/src/utils/storage.ts
```
1 | import type { SupabaseClient } from "@supabase/supabase-js";
2 |
3 | export const EMPTY_FOLDER_PLACEHOLDER_FILE_NAME = ".emptyFolderPlaceholder";
4 |
5 | type UploadParams = {
6 |   file: File;
7 |   path: string[];
8 |   bucket: string;
9 | };
10 |
11 | export async function upload(
12 |   client: SupabaseClient,
13 |   { file, path, bucket }: UploadParams,
14 | ) {
15 |   const storage = client.storage.from(bucket);
16 |
17 |   const result = await storage.upload(path.join("/"), file, {
18 |     upsert: true,
19 |     cacheControl: "3600",
20 |   });
21 |
22 |   if (!result.error) {
23 |     return storage.getPublicUrl(path.join("/")).data.publicUrl;
24 |   }
25 |
26 |   throw result.error;
27 | }
28 |
29 | type RemoveParams = {
30 |   path: string[];
31 |   bucket: string;
32 | };
33 |
34 | export async function remove(
35 |   client: SupabaseClient,
36 |   { bucket, path }: RemoveParams,
37 | ) {
38 |   return client.storage
39 |     .from(bucket)
40 |     .remove([decodeURIComponent(path.join("/"))]);
41 | }
42 |
43 | type DeleteFolderParams = {
44 |   path: string[];
45 |   bucket: string;
46 | };
47 |
48 | export async function deleteFolder(
49 |   client: SupabaseClient,
50 |   { bucket, path }: DeleteFolderParams,
51 | ) {
52 |   const { data: list } = await client.storage
53 |     .from(bucket)
54 |     .list(decodeURIComponent(path.join("/")));
55 |
56 |   const filesToRemove = list?.flatMap((file) => {
57 |     // Folder, remove empty file before folder
58 |     if (!file.id) {
59 |       return [
60 |         `${decodeURIComponent(
61 |           [...path, file.name].join("/"),
62 |         )}/${EMPTY_FOLDER_PLACEHOLDER_FILE_NAME}`,
63 |         decodeURIComponent([...path, file.name].join("/")),
64 |       ];
65 |     }
66 |
67 |     return [decodeURIComponent([...path, file.name].join("/"))];
68 |   });
69 |
70 |   return client.storage.from(bucket).remove(filesToRemove);
71 | }
72 |
73 | type CreateFolderParams = {
74 |   path: string[];
75 |   name: string;
76 |   bucket: string;
77 | };
78 |
79 | export async function createFolder(
80 |   client: SupabaseClient,
81 |   { bucket, path, name }: CreateFolderParams,
82 | ) {
83 |   const fullPath = decodeURIComponent(
84 |     [...path, name, EMPTY_FOLDER_PLACEHOLDER_FILE_NAME].join("/"),
85 |   );
86 |
87 |   const { error, data } = await client.storage
88 |     .from(bucket)
89 |     .upload(fullPath, new File([], EMPTY_FOLDER_PLACEHOLDER_FILE_NAME));
90 |
91 |   if (error) {
92 |     throw Error(error.message);
93 |   }
94 |
95 |   return data;
96 | }
97 |
98 | type DownloadParams = {
99 |   path: string;
100 |   bucket: string;
101 | };
102 |
103 | export async function download(
104 |   client: SupabaseClient,
105 |   { bucket, path }: DownloadParams,
106 | ) {
107 |   return client.storage.from(bucket).download(path);
108 | }
109 |
110 | type ShareParams = {
111 |   path: string;
112 |   bucket: string;
113 |   expireIn: number;
114 |   options?: {
115 |     download?: boolean;
116 |   };
117 | };
118 |
119 | export async function share(
120 |   client: SupabaseClient,
121 |   { bucket, path, expireIn, options }: ShareParams,
122 | ) {
123 |   return client.storage.from(bucket).createSignedUrl(path, expireIn, options);
124 | }
```

packages/ui/src/components/accordion.stories.tsx
```
1 | import type { Meta, StoryObj } from "@storybook/react";
2 | import {
3 |   Accordion,
4 |   AccordionContent,
5 |   AccordionItem,
6 |   AccordionTrigger,
7 | } from "./accordion";
8 |
9 | const meta: Meta<typeof Accordion> = {
10 |   component: () => (
11 |     <Accordion type="single" collapsible className="w-full max-w-[500px]">
12 |       <AccordionItem value="item-1">
13 |         <AccordionTrigger>Is it accessible?</AccordionTrigger>
14 |         <AccordionContent>
15 |           Yes. It adheres to the WAI-ARIA design pattern.
16 |         </AccordionContent>
17 |       </AccordionItem>
18 |       <AccordionItem value="item-2">
19 |         <AccordionTrigger>Is it styled?</AccordionTrigger>
20 |         <AccordionContent>
21 |           Yes. It comes with default styles that matches the other
22 |           components&apos; aesthetic.
23 |         </AccordionContent>
24 |       </AccordionItem>
25 |       <AccordionItem value="item-3">
26 |         <AccordionTrigger>Is it animated?</AccordionTrigger>
27 |         <AccordionContent>
28 |           Yes. It&apos;s animated by default, but you can disable it if you
29 |           prefer.
30 |         </AccordionContent>
31 |       </AccordionItem>
32 |     </Accordion>
33 |   ),
34 | };
35 |
36 | export default meta;
37 |
38 | type Story = StoryObj<typeof Accordion>;
39 |
40 | export const Default: Story = {};
```

packages/ui/src/components/accordion.tsx
```
1 | "use client";
2 |
3 | import * as AccordionPrimitive from "@radix-ui/react-accordion";
4 | import { ChevronDown } from "lucide-react";
5 | import * as React from "react";
6 | import { cn } from "../utils";
7 |
8 | const Accordion = AccordionPrimitive.Root;
9 |
10 | const AccordionItem = React.forwardRef<
11 |   React.ElementRef<typeof AccordionPrimitive.Item>,
12 |   React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
13 | >(({ className, ...props }, ref) => (
14 |   <AccordionPrimitive.Item
15 |     ref={ref}
16 |     className={cn("border-b border-border", className)}
17 |     {...props}
18 |   />
19 | ));
20 | AccordionItem.displayName = "AccordionItem";
21 | const AccordionTrigger = React.forwardRef<
22 |   React.ElementRef<typeof AccordionPrimitive.Trigger>,
23 |   React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger> & {
24 |     chevronBefore?: boolean;
25 |   }
26 | >(({ className, children, chevronBefore, ...props }, ref) => (
27 |   <AccordionPrimitive.Header className="flex w-full">
28 |     <AccordionPrimitive.Trigger
29 |       ref={ref}
30 |       className={cn(
31 |         "flex flex-1 items-center justify-between py-4 font-medium transition-all [&[data-state=open]>svg]:rotate-180",
32 |         chevronBefore && "[&[data-state=open]>svg]:rotate-0",
33 |         className,
34 |       )}
35 |       {...props}
36 |     >
37 |       {chevronBefore && (
38 |         <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200 -rotate-90" />
39 |       )}
40 |       {children}
41 |       {!chevronBefore && (
42 |         <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200" />
43 |       )}
44 |     </AccordionPrimitive.Trigger>
45 |   </AccordionPrimitive.Header>
46 | ));
47 | AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName;
48 |
49 | const AccordionContent = React.forwardRef<
50 |   React.ElementRef<typeof AccordionPrimitive.Content>,
51 |   React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
52 | >(({ className, children, ...props }, ref) => (
53 |   <AccordionPrimitive.Content
54 |     ref={ref}
55 |     className={cn(
56 |       "overflow-hidden text-sm transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down",
57 |       className,
58 |     )}
59 |     {...props}
60 |   >
61 |     <div className="pb-4 pt-0">{children}</div>
62 |   </AccordionPrimitive.Content>
63 | ));
64 | AccordionContent.displayName = AccordionPrimitive.Content.displayName;
65 |
66 | export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
```

packages/ui/src/components/alert-dialog.stories.tsx
```
1 | import type { Meta, StoryObj } from "@storybook/react";
2 | import {
3 |   AlertDialog,
4 |   AlertDialogAction,
5 |   AlertDialogCancel,
6 |   AlertDialogContent,
7 |   AlertDialogDescription,
8 |   AlertDialogFooter,
9 |   AlertDialogHeader,
10 |   AlertDialogTitle,
11 |   AlertDialogTrigger,
12 | } from "./alert-dialog";
13 | import { Button } from "./button";
14 |
15 | const meta: Meta<typeof AlertDialog> = {
16 |   component: () => (
17 |     <AlertDialog>
18 |       <AlertDialogTrigger asChild>
19 |         <Button variant="outline">Show Dialog</Button>
20 |       </AlertDialogTrigger>
21 |       <AlertDialogContent>
22 |         <AlertDialogHeader>
23 |           <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
24 |           <AlertDialogDescription>
25 |             This action cannot be undone. This will permanently delete your
26 |             account and remove your data from our servers.
27 |           </AlertDialogDescription>
28 |         </AlertDialogHeader>
29 |         <AlertDialogFooter>
30 |           <AlertDialogCancel>Cancel</AlertDialogCancel>
31 |           <AlertDialogAction>Continue</AlertDialogAction>
32 |         </AlertDialogFooter>
33 |       </AlertDialogContent>
34 |     </AlertDialog>
35 |   ),
36 | };
37 |
38 | export default meta;
39 |
40 | type Story = StoryObj<typeof AlertDialog>;
41 |
42 | export const Default: Story = {};
```

packages/ui/src/components/alert-dialog.tsx
```
1 | "use client";
2 |
3 | import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog";
4 | import * as React from "react";
5 | import { cn } from "../utils";
6 | import { buttonVariants } from "./button";
7 |
8 | const AlertDialog = AlertDialogPrimitive.Root;
9 |
10 | const AlertDialogTrigger = AlertDialogPrimitive.Trigger;
11 |
12 | const AlertDialogPortal = AlertDialogPrimitive.Portal;
13 |
14 | const AlertDialogOverlay = React.forwardRef<
15 |   React.ElementRef<typeof AlertDialogPrimitive.Overlay>,
16 |   React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Overlay>
17 | >(({ className, children, ...props }, ref) => (
18 |   <AlertDialogPrimitive.Overlay
19 |     className={cn(
20 |       "fixed inset-0 z-50 bg-[#f6f6f3]/60 dark:bg-[#121212]/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
21 |       className
22 |     )}
23 |     {...props}
24 |     ref={ref}
25 |   />
26 | ));
27 | AlertDialogOverlay.displayName = AlertDialogPrimitive.Overlay.displayName;
28 |
29 | const AlertDialogContent = React.forwardRef<
30 |   React.ElementRef<typeof AlertDialogPrimitive.Content>,
31 |   React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Content>
32 | >(({ className, ...props }, ref) => (
33 |   <AlertDialogPortal>
34 |     <AlertDialogOverlay />
35 |     <AlertDialogPrimitive.Content
36 |       ref={ref}
37 |       className={cn(
38 |         "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] md:w-full",
39 |         className
40 |       )}
41 |       {...props}
42 |     />
43 |   </AlertDialogPortal>
44 | ));
45 | AlertDialogContent.displayName = AlertDialogPrimitive.Content.displayName;
46 |
47 | const AlertDialogHeader = ({
48 |   className,
49 |   ...props
50 | }: React.HTMLAttributes<HTMLDivElement>) => (
51 |   <div
52 |     className={cn(
53 |       "flex flex-col space-y-2 text-center sm:text-left",
54 |       className
55 |     )}
56 |     {...props}
57 |   />
58 | );
59 | AlertDialogHeader.displayName = "AlertDialogHeader";
60 |
61 | const AlertDialogFooter = ({
62 |   className,
63 |   ...props
64 | }: React.HTMLAttributes<HTMLDivElement>) => (
65 |   <div
66 |     className={cn(
67 |       "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
68 |       className
69 |     )}
70 |     {...props}
71 |   />
72 | );
73 | AlertDialogFooter.displayName = "AlertDialogFooter";
74 |
75 | const AlertDialogTitle = React.forwardRef<
76 |   React.ElementRef<typeof AlertDialogPrimitive.Title>,
77 |   React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Title>
78 | >(({ className, ...props }, ref) => (
79 |   <AlertDialogPrimitive.Title
80 |     ref={ref}
81 |     className={cn("text-lg font-medium", className)}
82 |     {...props}
83 |   />
84 | ));
85 | AlertDialogTitle.displayName = AlertDialogPrimitive.Title.displayName;
86 |
87 | const AlertDialogDescription = React.forwardRef<
88 |   React.ElementRef<typeof AlertDialogPrimitive.Description>,
89 |   React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Description>
90 | >(({ className, ...props }, ref) => (
91 |   <AlertDialogPrimitive.Description
92 |     ref={ref}
93 |     className={cn("text-sm text-[#606060]", className)}
94 |     {...props}
95 |   />
96 | ));
97 | AlertDialogDescription.displayName =
98 |   AlertDialogPrimitive.Description.displayName;
99 |
100 | const AlertDialogAction = React.forwardRef<
101 |   React.ElementRef<typeof AlertDialogPrimitive.Action>,
102 |   React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Action>
103 | >(({ className, ...props }, ref) => (
104 |   <AlertDialogPrimitive.Action
105 |     ref={ref}
106 |     className={cn(buttonVariants(), className)}
107 |     {...props}
108 |   />
109 | ));
110 | AlertDialogAction.displayName = AlertDialogPrimitive.Action.displayName;
111 |
112 | const AlertDialogCancel = React.forwardRef<
113 |   React.ElementRef<typeof AlertDialogPrimitive.Cancel>,
114 |   React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Cancel>
115 | >(({ className, ...props }, ref) => (
116 |   <AlertDialogPrimitive.Cancel
117 |     ref={ref}
118 |     className={cn(
119 |       buttonVariants({ variant: "outline" }),
120 |       "mt-2 sm:mt-0",
121 |       className
122 |     )}
123 |     {...props}
124 |   />
125 | ));
126 | AlertDialogCancel.displayName = AlertDialogPrimitive.Cancel.displayName;
127 |
128 | export {
129 |   AlertDialog,
130 |   AlertDialogPortal,
131 |   AlertDialogOverlay,
132 |   AlertDialogTrigger,
133 |   AlertDialogContent,
134 |   AlertDialogHeader,
135 |   AlertDialogFooter,
136 |   AlertDialogTitle,
137 |   AlertDialogDescription,
138 |   AlertDialogAction,
139 |   AlertDialogCancel,
140 | };
```

packages/ui/src/components/alert.tsx
```
1 | import { type VariantProps, cva } from "class-variance-authority";
2 | import * as React from "react";
3 | import { cn } from "../utils";
4 |
5 | const alertVariants = cva(
6 |   "relative w-full border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground",
7 |   {
8 |     variants: {
9 |       variant: {
10 |         default: "bg-background text-foreground",
11 |         destructive:
12 |           "border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive",
13 |         warning: "dark:border-[#4a2800] dark:bg-[#1f1400]",
14 |       },
15 |     },
16 |     defaultVariants: {
17 |       variant: "default",
18 |     },
19 |   }
20 | );
21 |
22 | const Alert = React.forwardRef<
23 |   HTMLDivElement,
24 |   React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof alertVariants>
25 | >(({ className, variant, ...props }, ref) => (
26 |   <div
27 |     ref={ref}
28 |     role="alert"
29 |     className={cn(alertVariants({ variant }), className)}
30 |     {...props}
31 |   />
32 | ));
33 | Alert.displayName = "Alert";
34 |
35 | const AlertTitle = React.forwardRef<
36 |   HTMLParagraphElement,
37 |   React.HTMLAttributes<HTMLHeadingElement>
38 | >(({ className, ...props }, ref) => (
39 |   <h5
40 |     ref={ref}
41 |     className={cn("mb-1 font-medium leading-none tracking-tight", className)}
42 |     {...props}
43 |   />
44 | ));
45 | AlertTitle.displayName = "AlertTitle";
46 |
47 | const AlertDescription = React.forwardRef<
48 |   HTMLParagraphElement,
49 |   React.HTMLAttributes<HTMLParagraphElement>
50 | >(({ className, ...props }, ref) => (
51 |   <div
52 |     ref={ref}
53 |     className={cn("text-sm [&_p]:leading-relaxed", className)}
54 |     {...props}
55 |   />
56 | ));
57 | AlertDescription.displayName = "AlertDescription";
58 |
59 | export { Alert, AlertTitle, AlertDescription };
```

packages/ui/src/components/animated-size-container.tsx
```
1 | import { motion } from "framer-motion";
2 | import {
3 |   type ComponentPropsWithoutRef,
4 |   type PropsWithChildren,
5 |   forwardRef,
6 |   useRef,
7 | } from "react";
8 | import { useResizeObserver } from "../hooks";
9 | import { cn } from "../utils";
10 |
11 | type AnimatedSizeContainerProps = PropsWithChildren<{
12 |   width?: boolean;
13 |   height?: boolean;
14 | }> &
15 |   Omit<ComponentPropsWithoutRef<typeof motion.div>, "animate" | "children">;
16 |
17 | /**
18 |  * A container with animated width and height (each optional) based on children dimensions
19 |  */
20 | const AnimatedSizeContainer = forwardRef<
21 |   HTMLDivElement,
22 |   AnimatedSizeContainerProps
23 | >(
24 |   (
25 |     {
26 |       width = false,
27 |       height = false,
28 |       className,
29 |       transition,
30 |       children,
31 |       ...rest
32 |     }: AnimatedSizeContainerProps,
33 |     forwardedRef,
34 |   ) => {
35 |     const containerRef = useRef<HTMLDivElement>(null);
36 |     const resizeObserverEntry = useResizeObserver(containerRef);
37 |
38 |     return (
39 |       <motion.div
40 |         ref={forwardedRef}
41 |         className={cn("overflow-hidden", className)}
42 |         animate={{
43 |           width: width
44 |             ? resizeObserverEntry?.contentRect?.width ?? "auto"
45 |             : "auto",
46 |           height: height
47 |             ? resizeObserverEntry?.contentRect?.height ?? "auto"
48 |             : "auto",
49 |         }}
50 |         transition={transition ?? { type: "spring", duration: 0.3 }}
51 |         {...rest}
52 |       >
53 |         <div
54 |           ref={containerRef}
55 |           className={cn(height && "h-max", width && "w-max")}
56 |         >
57 |           {children}
58 |         </div>
59 |       </motion.div>
60 |     );
61 |   },
62 | );
63 |
64 | AnimatedSizeContainer.displayName = "AnimatedSizeContainer";
65 |
66 | export { AnimatedSizeContainer };
```

packages/ui/src/components/avatar.stories.tsx
```
1 | import type { Meta, StoryObj } from "@storybook/react";
2 | import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
3 |
4 | const meta: Meta<typeof Avatar> = {
5 |   component: () => (
6 |     <Avatar>
7 |       <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
8 |       <AvatarFallback>CN</AvatarFallback>
9 |     </Avatar>
10 |   ),
11 | };
12 |
13 | export default meta;
14 |
15 | type Story = StoryObj<typeof Avatar>;
16 |
17 | export const Default: Story = {};
```

packages/ui/src/components/avatar.tsx
```
1 | "use client";
2 |
3 | import * as AvatarPrimitive from "@radix-ui/react-avatar";
4 | import Image from "next/image";
5 | import * as React from "react";
6 | import { cn } from "../utils";
7 |
8 | const Avatar = React.forwardRef<
9 |   React.ElementRef<typeof AvatarPrimitive.Root>,
10 |   React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>
11 | >(({ className, ...props }, ref) => (
12 |   <AvatarPrimitive.Root
13 |     ref={ref}
14 |     className={cn(
15 |       "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full",
16 |       className,
17 |     )}
18 |     {...props}
19 |   />
20 | ));
21 | Avatar.displayName = AvatarPrimitive.Root.displayName;
22 |
23 | export const AvatarImageNext = React.forwardRef<
24 |   React.ElementRef<typeof Image>,
25 |   React.ComponentPropsWithoutRef<typeof Image>
26 | >(({ className, onError, ...props }, ref) => {
27 |   const [hasError, setHasError] = React.useState(false);
28 |
29 |   if (hasError || !props.src) {
30 |     return null;
31 |   }
32 |
33 |   return (
34 |     <Image
35 |       ref={ref}
36 |       className={cn("aspect-square h-full w-full absolute z-10", className)}
37 |       onError={(e) => {
38 |         setHasError(true);
39 |         onError?.(e);
40 |       }}
41 |       {...props}
42 |     />
43 |   );
44 | });
45 |
46 | AvatarImageNext.displayName = "AvatarImageNext";
47 |
48 | const AvatarImage = React.forwardRef<
49 |   React.ElementRef<typeof AvatarPrimitive.Image>,
50 |   React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>
51 | >(({ className, ...props }, ref) => (
52 |   <AvatarPrimitive.Image
53 |     ref={ref}
54 |     className={cn("aspect-square h-full w-full", className)}
55 |     {...props}
56 |   />
57 | ));
58 | AvatarImage.displayName = AvatarPrimitive.Image.displayName;
59 |
60 | const AvatarFallback = React.forwardRef<
61 |   React.ElementRef<typeof AvatarPrimitive.Fallback>,
62 |   React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>
63 | >(({ className, ...props }, ref) => (
64 |   <AvatarPrimitive.Fallback
65 |     ref={ref}
66 |     className={cn(
67 |       "flex h-full w-full items-center justify-center rounded-full bg-accent",
68 |       className,
69 |     )}
70 |     {...props}
71 |   />
72 | ));
73 | AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName;
74 |
75 | export { Avatar, AvatarImage, AvatarFallback };
```

packages/ui/src/components/badge.tsx
```
1 | import { type VariantProps, cva } from "class-variance-authority";
2 | import type * as React from "react";
3 | import { cn } from "../utils";
4 |
5 | const badgeVariants = cva(
6 |   "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
7 |   {
8 |     variants: {
9 |       variant: {
10 |         default:
11 |           "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
12 |         secondary:
13 |           "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
14 |         destructive:
15 |           "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
16 |         outline: "text-foreground",
17 |         tag: "font-mono text-[#878787] bg-[#F2F1EF] text-[10px] dark:bg-[#1D1D1D] border-none font-normal rounded-none",
18 |       },
19 |     },
20 |     defaultVariants: {
21 |       variant: "default",
22 |     },
23 |   },
24 | );
25 |
26 | export interface BadgeProps
27 |   extends React.HTMLAttributes<HTMLDivElement>,
28 |     VariantProps<typeof badgeVariants> {}
29 |
30 | function Badge({ className, variant, ...props }: BadgeProps) {
31 |   return (
32 |     <div className={cn(badgeVariants({ variant }), className)} {...props} />
33 |   );
34 | }
35 |
36 | export { Badge, badgeVariants };
```

packages/ui/src/components/breadcrumb.tsx
```
1 | import { ChevronRightIcon, DotsHorizontalIcon } from "@radix-ui/react-icons";
2 | import { Slot } from "@radix-ui/react-slot";
3 | import * as React from "react";
4 | import { cn } from "../utils";
5 |
6 | const Breadcrumb = React.forwardRef<
7 |   HTMLElement,
8 |   React.ComponentPropsWithoutRef<"nav"> & {
9 |     separator?: React.ReactNode;
10 |   }
11 | >(({ ...props }, ref) => <nav ref={ref} aria-label="breadcrumb" {...props} />);
12 | Breadcrumb.displayName = "Breadcrumb";
13 |
14 | const BreadcrumbList = React.forwardRef<
15 |   HTMLOListElement,
16 |   React.ComponentPropsWithoutRef<"ol">
17 | >(({ className, ...props }, ref) => (
18 |   <ol
19 |     ref={ref}
20 |     className={cn(
21 |       "flex flex-wrap items-center gap-1.5 break-words text-sm text-muted-foreground sm:gap-2.5",
22 |       className
23 |     )}
24 |     {...props}
25 |   />
26 | ));
27 | BreadcrumbList.displayName = "BreadcrumbList";
28 |
29 | const BreadcrumbItem = React.forwardRef<
30 |   HTMLLIElement,
31 |   React.ComponentPropsWithoutRef<"li">
32 | >(({ className, ...props }, ref) => (
33 |   <li
34 |     ref={ref}
35 |     className={cn("inline-flex items-center gap-1.5", className)}
36 |     {...props}
37 |   />
38 | ));
39 | BreadcrumbItem.displayName = "BreadcrumbItem";
40 |
41 | const BreadcrumbLink = React.forwardRef<
42 |   HTMLAnchorElement,
43 |   React.ComponentPropsWithoutRef<"a"> & {
44 |     asChild?: boolean;
45 |   }
46 | >(({ asChild, className, ...props }, ref) => {
47 |   const Comp = asChild ? Slot : "a";
48 |
49 |   return (
50 |     <Comp
51 |       ref={ref}
52 |       className={cn("transition-colors hover:text-foreground", className)}
53 |       {...props}
54 |     />
55 |   );
56 | });
57 | BreadcrumbLink.displayName = "BreadcrumbLink";
58 |
59 | const BreadcrumbPage = React.forwardRef<
60 |   HTMLSpanElement,
61 |   React.ComponentPropsWithoutRef<"span">
62 | >(({ className, ...props }, ref) => (
63 |   <span
64 |     ref={ref}
65 |     role="link"
66 |     aria-disabled="true"
67 |     aria-current="page"
68 |     className={cn("font-normal text-foreground", className)}
69 |     {...props}
70 |   />
71 | ));
72 | BreadcrumbPage.displayName = "BreadcrumbPage";
73 |
74 | const BreadcrumbSeparator = ({
75 |   children,
76 |   className,
77 |   ...props
78 | }: React.ComponentProps<"li">) => (
79 |   <li
80 |     role="presentation"
81 |     aria-hidden="true"
82 |     className={cn("[&>svg]:size-3.5", className)}
83 |     {...props}
84 |   >
85 |     {children ?? <ChevronRightIcon />}
86 |   </li>
87 | );
88 | BreadcrumbSeparator.displayName = "BreadcrumbSeparator";
89 |
90 | const BreadcrumbEllipsis = ({
91 |   className,
92 |   ...props
93 | }: React.ComponentProps<"span">) => (
94 |   <span
95 |     role="presentation"
96 |     aria-hidden="true"
97 |     className={cn("flex h-9 w-9 items-center justify-center", className)}
98 |     {...props}
99 |   >
100 |     <DotsHorizontalIcon className="h-4 w-4" />
101 |     <span className="sr-only">More</span>
102 |   </span>
103 | );
104 | BreadcrumbEllipsis.displayName = "BreadcrumbElipssis";
105 |
106 | export {
107 |   Breadcrumb,
108 |   BreadcrumbList,
109 |   BreadcrumbItem,
110 |   BreadcrumbLink,
111 |   BreadcrumbPage,
112 |   BreadcrumbSeparator,
113 |   BreadcrumbEllipsis,
114 | };
```

packages/ui/src/components/button.stories.tsx
```
1 | import type { Meta, StoryObj } from "@storybook/react";
2 | import { ChevronRight } from "lucide-react";
3 | import { Button } from "./button";
4 |
5 | const meta: Meta<typeof Button> = {
6 |   component: Button,
7 | };
8 |
9 | export default meta;
10 |
11 | type Story = StoryObj<typeof Button>;
12 |
13 | export const Primary: Story = {
14 |   args: {
15 |     children: "Button",
16 |   },
17 | };
18 |
19 | export const Secondary: Story = {
20 |   args: {
21 |     children: "Button",
22 |     variant: "secondary",
23 |   },
24 | };
25 |
26 | export const Destructive: Story = {
27 |   args: {
28 |     children: "Button",
29 |     variant: "destructive",
30 |   },
31 | };
32 |
33 | export const Outline: Story = {
34 |   args: {
35 |     children: "Button",
36 |     variant: "outline",
37 |   },
38 | };
39 |
40 | export const Ghost: Story = {
41 |   args: {
42 |     children: "Button",
43 |     variant: "ghost",
44 |   },
45 | };
46 |
47 | export const Icon: Story = {
48 |   args: {
49 |     children: <ChevronRight />,
50 |     variant: "outline",
51 |     size: "icon",
52 |   },
53 | };
```

packages/ui/src/components/button.tsx
```
1 | import { Slot } from "@radix-ui/react-slot";
2 | import { type VariantProps, cva } from "class-variance-authority";
3 | import * as React from "react";
4 | import { cn } from "../utils";
5 |
6 | const buttonVariants = cva(
7 |   "inline-flex items-center justify-center text-sm font-medium transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50",
8 |   {
9 |     variants: {
10 |       variant: {
11 |         default: "bg-primary text-primary-foreground hover:bg-primary/90",
12 |         destructive:
13 |           "bg-destructive text-destructive-foreground hover:bg-destructive/90",
14 |         outline:
15 |           "border border bg-transparent hover:bg-accent hover:text-accent-foreground",
16 |         secondary:
17 |           "bg-secondary text-secondary-foreground hover:bg-secondary/80",
18 |         ghost: "hover:bg-accent hover:text-accent-foreground",
19 |         link: "text-primary underline-offset-4 hover:underline",
20 |       },
21 |       size: {
22 |         default: "h-9 px-4 py-2",
23 |         sm: "h-8 px-3 text-xs",
24 |         lg: "h-10 px-8",
25 |         icon: "h-9 w-9",
26 |       },
27 |     },
28 |     defaultVariants: {
29 |       variant: "default",
30 |       size: "default",
31 |     },
32 |   },
33 | );
34 |
35 | export interface ButtonProps
36 |   extends React.ButtonHTMLAttributes<HTMLButtonElement>,
37 |     VariantProps<typeof buttonVariants> {
38 |   asChild?: boolean;
39 | }
40 |
41 | const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
42 |   ({ className, variant, size, asChild = false, ...props }, ref) => {
43 |     const Comp = asChild ? Slot : "button";
44 |     return (
45 |       <Comp
46 |         className={cn(buttonVariants({ variant, size, className }))}
47 |         ref={ref}
48 |         {...props}
49 |       />
50 |     );
51 |   },
52 | );
53 | Button.displayName = "Button";
54 |
55 | export { Button, buttonVariants };
```

packages/ui/src/components/calendar.stories.tsx
```
1 | import type { Meta, StoryObj } from "@storybook/react";
2 | import { Calendar } from "./calendar";
3 |
4 | const meta: Meta<typeof Calendar> = {
5 |   component: () => (
6 |     <Calendar
7 |       mode="single"
8 |       selected={new Date("2024-01-01")}
9 |       onSelect={() => {}}
10 |       className="rounded-md border"
11 |     />
12 |   ),
13 | };
14 |
15 | export default meta;
16 |
17 | type Story = StoryObj<typeof Calendar>;
18 |
19 | export const Default: Story = {};
```

packages/ui/src/components/calendar.tsx
```
1 | "use client";
2 |
3 | import { ChevronLeft, ChevronRight } from "lucide-react";
4 | import type * as React from "react";
5 | import { DayPicker } from "react-day-picker";
6 | import { cn } from "../utils";
7 | import { buttonVariants } from "./button";
8 |
9 | export type CalendarProps = React.ComponentProps<typeof DayPicker>;
10 |
11 | function Calendar({
12 |   className,
13 |   classNames,
14 |   showOutsideDays = true,
15 |   ...props
16 | }: CalendarProps) {
17 |   return (
18 |     <DayPicker
19 |       showOutsideDays={showOutsideDays}
20 |       className={cn("p-3", className)}
21 |       classNames={{
22 |         months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
23 |         month: "space-y-4",
24 |         caption: "flex justify-center pt-1 relative items-center",
25 |         caption_label: "text-sm font-medium",
26 |         nav: "space-x-1 flex items-center",
27 |         nav_button: cn(
28 |           buttonVariants({ variant: "outline" }),
29 |           "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100",
30 |         ),
31 |         nav_button_previous: "absolute left-1",
32 |         nav_button_next: "absolute right-1",
33 |         table: "w-full border-collapse space-y-1",
34 |         head_row: "flex",
35 |         head_cell:
36 |           "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
37 |         row: "flex w-full mt-2",
38 |         cell: "h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
39 |         day: cn(
40 |           buttonVariants({ variant: "ghost" }),
41 |           "h-9 w-9 p-0 font-normal aria-selected:opacity-100",
42 |         ),
43 |         day_range_end: "day-range-end",
44 |         day_selected:
45 |           "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
46 |         day_today: "bg-accent text-accent-foreground",
47 |         day_outside:
48 |           "day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
49 |         day_disabled: "text-muted-foreground opacity-50",
50 |         day_range_middle:
51 |           "aria-selected:bg-accent aria-selected:text-accent-foreground",
52 |         day_hidden: "invisible",
53 |         ...classNames,
54 |       }}
55 |       components={{
56 |         IconLeft: ({ ...props }) => <ChevronLeft className="h-4 w-4" />,
57 |         IconRight: ({ ...props }) => <ChevronRight className="h-4 w-4" />,
58 |       }}
59 |       {...props}
60 |     />
61 |   );
62 | }
63 | Calendar.displayName = "Calendar";
64 |
65 | export { Calendar };
```

packages/ui/src/components/card.tsx
```
1 | import * as React from "react";
2 | import { cn } from "../utils";
3 |
4 | const Card = React.forwardRef<
5 |   HTMLDivElement,
6 |   React.HTMLAttributes<HTMLDivElement>
7 | >(({ className, ...props }, ref) => (
8 |   <div
9 |     ref={ref}
10 |     className={cn("border bg-background text-card-foreground", className)}
11 |     {...props}
12 |   />
13 | ));
14 | Card.displayName = "Card";
15 |
16 | const CardHeader = React.forwardRef<
17 |   HTMLDivElement,
18 |   React.HTMLAttributes<HTMLDivElement>
19 | >(({ className, ...props }, ref) => (
20 |   <div
21 |     ref={ref}
22 |     className={cn("flex flex-col space-y-1.5 p-6", className)}
23 |     {...props}
24 |   />
25 | ));
26 | CardHeader.displayName = "CardHeader";
27 |
28 | const CardTitle = React.forwardRef<
29 |   HTMLParagraphElement,
30 |   React.HTMLAttributes<HTMLHeadingElement>
31 | >(({ className, ...props }, ref) => (
32 |   <h3
33 |     ref={ref}
34 |     className={cn(
35 |       "text-lg font-medium leading-none tracking-tight mb-2",
36 |       className
37 |     )}
38 |     {...props}
39 |   />
40 | ));
41 | CardTitle.displayName = "CardTitle";
42 |
43 | const CardDescription = React.forwardRef<
44 |   HTMLParagraphElement,
45 |   React.HTMLAttributes<HTMLParagraphElement>
46 | >(({ className, ...props }, ref) => (
47 |   <p ref={ref} className={cn("text-sm text-[#606060]", className)} {...props} />
48 | ));
49 | CardDescription.displayName = "CardDescription";
50 |
51 | const CardContent = React.forwardRef<
52 |   HTMLDivElement,
53 |   React.HTMLAttributes<HTMLDivElement>
54 | >(({ className, ...props }, ref) => (
55 |   <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
56 | ));
57 | CardContent.displayName = "CardContent";
58 |
59 | const CardFooter = React.forwardRef<
60 |   HTMLDivElement,
61 |   React.HTMLAttributes<HTMLDivElement>
62 | >(({ className, ...props }, ref) => (
63 |   <div
64 |     ref={ref}
65 |     className={cn(
66 |       "flex items-center p-6 border-t text-xs text-[#606060]",
67 |       className
68 |     )}
69 |     {...props}
70 |   />
71 | ));
72 | CardFooter.displayName = "CardFooter";
73 |
74 | export {
75 |   Card,
76 |   CardHeader,
77 |   CardFooter,
78 |   CardTitle,
79 |   CardDescription,
80 |   CardContent,
81 | };
```

packages/ui/src/components/carousel.tsx
```
1 | "use client";
2 |
3 | import useEmblaCarousel, {
4 |   type UseEmblaCarouselType,
5 | } from "embla-carousel-react";
6 | import * as React from "react";
7 | import { cn } from "../utils";
8 | import { Button } from "./button";
9 | import { Icons } from "./icons";
10 |
11 | type CarouselApi = UseEmblaCarouselType[1];
12 | type UseCarouselParameters = Parameters<typeof useEmblaCarousel>;
13 | type CarouselOptions = UseCarouselParameters[0];
14 | type CarouselPlugin = UseCarouselParameters[1];
15 |
16 | type CarouselProps = {
17 |   opts?: CarouselOptions;
18 |   plugins?: CarouselPlugin;
19 |   orientation?: "horizontal" | "vertical";
20 |   setApi?: (api: CarouselApi) => void;
21 | };
22 |
23 | type CarouselContextProps = {
24 |   carouselRef: ReturnType<typeof useEmblaCarousel>[0];
25 |   api: ReturnType<typeof useEmblaCarousel>[1];
26 |   scrollPrev: () => void;
27 |   scrollNext: () => void;
28 |   canScrollPrev: boolean;
29 |   canScrollNext: boolean;
30 |   scrollTo: (index: number) => void;
31 | } & CarouselProps;
32 |
33 | const CarouselContext = React.createContext<CarouselContextProps | null>(null);
34 |
35 | function useCarousel() {
36 |   const context = React.useContext(CarouselContext);
37 |
38 |   if (!context) {
39 |     throw new Error("useCarousel must be used within a <Carousel />");
40 |   }
41 |
42 |   return context;
43 | }
44 |
45 | const Carousel = React.forwardRef<
46 |   HTMLDivElement,
47 |   React.HTMLAttributes<HTMLDivElement> & CarouselProps
48 | >(
49 |   (
50 |     {
51 |       orientation = "horizontal",
52 |       opts,
53 |       setApi,
54 |       plugins,
55 |       className,
56 |       children,
57 |       ...props
58 |     },
59 |     ref,
60 |   ) => {
61 |     const [carouselRef, api] = useEmblaCarousel(
62 |       {
63 |         ...opts,
64 |         axis: orientation === "horizontal" ? "x" : "y",
65 |       },
66 |       plugins,
67 |     );
68 |     const [canScrollPrev, setCanScrollPrev] = React.useState(false);
69 |     const [canScrollNext, setCanScrollNext] = React.useState(false);
70 |
71 |     const onSelect = React.useCallback((api: CarouselApi) => {
72 |       if (!api) {
73 |         return;
74 |       }
75 |
76 |       setCanScrollPrev(api.canScrollPrev());
77 |       setCanScrollNext(api.canScrollNext());
78 |     }, []);
79 |
80 |     const scrollPrev = React.useCallback(() => {
81 |       api?.scrollPrev();
82 |     }, [api]);
83 |
84 |     const scrollNext = React.useCallback(() => {
85 |       api?.scrollNext();
86 |     }, [api]);
87 |
88 |     const scrollTo = React.useCallback(
89 |       (index: number) => {
90 |         api?.scrollTo(index);
91 |       },
92 |       [api],
93 |     );
94 |
95 |     React.useEffect(() => {
96 |       if (!api || !setApi) {
97 |         return;
98 |       }
99 |
100 |       setApi(api);
101 |     }, [api, setApi]);
102 |
103 |     React.useEffect(() => {
104 |       if (!api) {
105 |         return;
106 |       }
107 |
108 |       onSelect(api);
109 |       api.on("reInit", onSelect);
110 |       api.on("select", onSelect);
111 |
112 |       return () => {
113 |         api?.off("select", onSelect);
114 |       };
115 |     }, [api, onSelect]);
116 |
117 |     return (
118 |       <CarouselContext.Provider
119 |         value={{
120 |           carouselRef,
121 |           api: api,
122 |           opts,
123 |           orientation:
124 |             orientation || (opts?.axis === "y" ? "vertical" : "horizontal"),
125 |           scrollPrev,
126 |           scrollNext,
127 |           canScrollPrev,
128 |           canScrollNext,
129 |           scrollTo,
130 |         }}
131 |       >
132 |         <div
133 |           ref={ref}
134 |           className={cn("relative", className)}
135 |           role="region"
136 |           aria-roledescription="carousel"
137 |           {...props}
138 |         >
139 |           {children}
140 |         </div>
141 |       </CarouselContext.Provider>
142 |     );
143 |   },
144 | );
145 | Carousel.displayName = "Carousel";
146 |
147 | const CarouselContent = React.forwardRef<
148 |   HTMLDivElement,
149 |   React.HTMLAttributes<HTMLDivElement>
150 | >(({ className, ...props }, ref) => {
151 |   const { carouselRef, orientation } = useCarousel();
152 |
153 |   return (
154 |     <div ref={carouselRef} className="overflow-hidden">
155 |       <div
156 |         ref={ref}
157 |         className={cn(
158 |           "flex",
159 |           orientation === "horizontal" ? "-ml-4" : "-mt-4 flex-col",
160 |           className,
161 |         )}
162 |         {...props}
163 |       />
164 |     </div>
165 |   );
166 | });
167 | CarouselContent.displayName = "CarouselContent";
168 |
169 | const CarouselItem = React.forwardRef<
170 |   HTMLDivElement,
171 |   React.HTMLAttributes<HTMLDivElement>
172 | >(({ className, ...props }, ref) => {
173 |   const { orientation } = useCarousel();
174 |
175 |   return (
176 |     <div
177 |       ref={ref}
178 |       role="group"
179 |       aria-roledescription="slide"
180 |       className={cn(
181 |         "min-w-0 shrink-0 grow-0 basis-full",
182 |         orientation === "horizontal" ? "pl-4" : "pt-4",
183 |         className,
184 |       )}
185 |       {...props}
186 |     />
187 |   );
188 | });
189 | CarouselItem.displayName = "CarouselItem";
190 |
191 | const CarouselPrevious = React.forwardRef<
192 |   HTMLButtonElement,
193 |   React.ComponentProps<typeof Button>
194 | >(({ className, variant = "outline", size = "icon", ...props }, ref) => {
195 |   const { orientation, scrollPrev, canScrollPrev } = useCarousel();
196 |
197 |   return (
198 |     <Button
[TRUNCATED]
```

packages/ui/src/components/chart.tsx
```
1 | "use client";
2 |
3 | import * as React from "react";
4 | import * as RechartsPrimitive from "recharts";
5 | import { cn } from "../utils";
6 |
7 | // Format: { THEME_NAME: CSS_SELECTOR }
8 | const THEMES = { light: "", dark: ".dark" } as const;
9 |
10 | export type ChartConfig = {
11 |   [k in string]: {
12 |     label?: React.ReactNode;
13 |     icon?: React.ComponentType;
14 |   } & (
15 |     | { color?: string; theme?: never }
16 |     | { color?: never; theme: Record<keyof typeof THEMES, string> }
17 |   );
18 | };
19 |
20 | type ChartContextProps = {
21 |   config: ChartConfig;
22 | };
23 |
24 | const ChartContext = React.createContext<ChartContextProps | null>(null);
25 |
26 | function useChart() {
27 |   const context = React.useContext(ChartContext);
28 |
29 |   if (!context) {
30 |     throw new Error("useChart must be used within a <ChartContainer />");
31 |   }
32 |
33 |   return context;
34 | }
35 |
36 | const ChartContainer = React.forwardRef<
37 |   HTMLDivElement,
38 |   React.ComponentProps<"div"> & {
39 |     config: ChartConfig;
40 |     children: React.ComponentProps<
41 |       typeof RechartsPrimitive.ResponsiveContainer
42 |     >["children"];
43 |   }
44 | >(({ id, className, children, config, ...props }, ref) => {
45 |   const uniqueId = React.useId();
46 |   const chartId = `chart-${id || uniqueId.replace(/:/g, "")}`;
47 |
48 |   return (
49 |     <ChartContext.Provider value={{ config }}>
50 |       <div
51 |         data-chart={chartId}
52 |         ref={ref}
53 |         className={cn(
54 |           "flex aspect-video justify-center text-xs [&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground [&_.recharts-cartesian-grid_line[stroke='#ccc']]:stroke-border/50 [&_.recharts-curve.recharts-tooltip-cursor]:stroke-border [&_.recharts-dot[stroke='#fff']]:stroke-transparent [&_.recharts-layer]:outline-none [&_.recharts-polar-grid_[stroke='#ccc']]:stroke-border [&_.recharts-radial-bar-background-sector]:fill-muted [&_.recharts-rectangle.recharts-tooltip-cursor]:fill-muted [&_.recharts-reference-line_[stroke='#ccc']]:stroke-border [&_.recharts-sector[stroke='#fff']]:stroke-transparent [&_.recharts-sector]:outline-none [&_.recharts-surface]:outline-none",
55 |           className,
56 |         )}
57 |         {...props}
58 |       >
59 |         <ChartStyle id={chartId} config={config} />
60 |         <RechartsPrimitive.ResponsiveContainer>
61 |           {children}
62 |         </RechartsPrimitive.ResponsiveContainer>
63 |       </div>
64 |     </ChartContext.Provider>
65 |   );
66 | });
67 | ChartContainer.displayName = "Chart";
68 |
69 | const ChartStyle = ({ id, config }: { id: string; config: ChartConfig }) => {
70 |   const colorConfig = Object.entries(config).filter(
71 |     ([_, config]) => config.theme || config.color,
72 |   );
73 |
74 |   if (!colorConfig.length) {
75 |     return null;
76 |   }
77 |
78 |   return (
79 |     <style
80 |       // biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
81 |       dangerouslySetInnerHTML={{
82 |         __html: Object.entries(THEMES)
83 |           .map(
84 |             ([theme, prefix]) => `
85 | ${prefix} [data-chart=${id}] {
86 | ${colorConfig
87 |   .map(([key, itemConfig]) => {
88 |     const color =
89 |       itemConfig.theme?.[theme as keyof typeof itemConfig.theme] ||
90 |       itemConfig.color;
91 |     return color ? `  --color-${key}: ${color};` : null;
92 |   })
93 |   .join("\n")}
94 | }
95 | `,
96 |           )
97 |           .join("\n"),
98 |       }}
99 |     />
100 |   );
101 | };
102 |
103 | const ChartTooltip = RechartsPrimitive.Tooltip;
104 |
105 | const ChartTooltipContent = React.forwardRef<
106 |   HTMLDivElement,
107 |   React.ComponentProps<typeof RechartsPrimitive.Tooltip> &
108 |     React.ComponentProps<"div"> & {
109 |       hideLabel?: boolean;
110 |       hideIndicator?: boolean;
111 |       indicator?: "line" | "dot" | "dashed";
112 |       nameKey?: string;
113 |       labelKey?: string;
114 |     }
115 | >(
116 |   (
117 |     {
118 |       active,
119 |       payload,
120 |       className,
121 |       indicator = "dot",
122 |       hideLabel = false,
123 |       hideIndicator = false,
124 |       label,
125 |       labelFormatter,
126 |       labelClassName,
127 |       formatter,
128 |       color,
129 |       nameKey,
130 |       labelKey,
131 |     },
132 |     ref,
133 |   ) => {
134 |     const { config } = useChart();
135 |
136 |     const tooltipLabel = React.useMemo(() => {
137 |       if (hideLabel || !payload?.length) {
138 |         return null;
139 |       }
140 |
141 |       const [item] = payload;
142 |       const key = `${labelKey || item?.dataKey || item?.name || "value"}`;
143 |       const itemConfig = getPayloadConfigFromPayload(config, item, key);
144 |       const value =
145 |         !labelKey && typeof label === "string"
146 |           ? config[label as keyof typeof config]?.label || label
147 |           : itemConfig?.label;
148 |
149 |       if (labelFormatter) {
150 |         return (
151 |           <div className={cn("font-medium", labelClassName)}>
152 |             {labelFormatter(value, payload)}
153 |           </div>
154 |         );
155 |       }
156 |
157 |       if (!value) {
158 |         return null;
159 |       }
160 |
161 |       return <div className={cn("font-medium", labelClassName)}>{value}</div>;
162 |     }, [
163 |       label,
164 |       labelFormatter,
165 |       payload,
[TRUNCATED]
```

packages/ui/src/components/checkbox.tsx
```
1 | "use client";
2 |
3 | import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
4 | import { CheckIcon } from "@radix-ui/react-icons";
5 | import * as React from "react";
6 | import { cn } from "../utils";
7 |
8 | const Checkbox = React.forwardRef<
9 |   React.ElementRef<typeof CheckboxPrimitive.Root>,
10 |   React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
11 | >(({ className, ...props }, ref) => (
12 |   <CheckboxPrimitive.Root
13 |     ref={ref}
14 |     className={cn(
15 |       "peer h-4 w-4 shrink-0 border focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground",
16 |       className
17 |     )}
18 |     {...props}
19 |   >
20 |     <CheckboxPrimitive.Indicator
21 |       className={cn("flex items-center justify-center text-current")}
22 |     >
23 |       <CheckIcon className="h-4 w-4" />
24 |     </CheckboxPrimitive.Indicator>
25 |   </CheckboxPrimitive.Root>
26 | ));
27 | Checkbox.displayName = CheckboxPrimitive.Root.displayName;
28 |
29 | export { Checkbox };
```

packages/ui/src/components/collapsible.tsx
```
1 | "use client";
2 |
3 | import * as CollapsiblePrimitive from "@radix-ui/react-collapsible";
4 |
5 | const Collapsible = CollapsiblePrimitive.Root;
6 |
7 | const CollapsibleTrigger = CollapsiblePrimitive.CollapsibleTrigger;
8 |
9 | const CollapsibleContent = CollapsiblePrimitive.CollapsibleContent;
10 |
11 | export { Collapsible, CollapsibleTrigger, CollapsibleContent };
```

packages/ui/src/components/combobox-dropdown.tsx
```
1 | "use client";
2 |
3 | import { Check, ChevronsUpDown } from "lucide-react";
4 | import * as React from "react";
5 |
6 | import { CommandList } from "cmdk";
7 | import { cn } from "../utils";
8 | import { Button } from "./button";
9 | import {
10 |   Command,
11 |   CommandEmpty,
12 |   CommandGroup,
13 |   CommandInput,
14 |   CommandItem,
15 | } from "./command";
16 | import { Popover, PopoverContent, PopoverTrigger } from "./popover";
17 |
18 | export type ComboboxItem = {
19 |   id: string;
20 |   label: string;
21 |   disabled?: boolean;
22 | };
23 |
24 | type Props<T> = {
25 |   placeholder?: React.ReactNode;
26 |   searchPlaceholder?: string;
27 |   items: T[];
28 |   onSelect: (item: T) => void;
29 |   selectedItem?: T;
30 |   renderSelectedItem?: (selectedItem: T) => React.ReactNode;
31 |   renderOnCreate?: (value: string) => React.ReactNode;
32 |   renderListItem?: (listItem: {
33 |     isChecked: boolean;
34 |     item: T;
35 |   }) => React.ReactNode;
36 |   emptyResults?: React.ReactNode;
37 |   popoverProps?: React.ComponentProps<typeof PopoverContent>;
38 |   disabled?: boolean;
39 |   onCreate?: (value: string) => void;
40 |   headless?: boolean;
41 |   className?: string;
42 | };
43 |
44 | export function ComboboxDropdown<T extends ComboboxItem>({
45 |   headless,
46 |   placeholder,
47 |   searchPlaceholder,
48 |   items,
49 |   onSelect,
50 |   selectedItem: incomingSelectedItem,
51 |   renderSelectedItem = (item) => item.label,
52 |   renderListItem,
53 |   renderOnCreate,
54 |   emptyResults,
55 |   popoverProps,
56 |   disabled,
57 |   onCreate,
58 |   className,
59 | }: Props<T>) {
60 |   const [open, setOpen] = React.useState(false);
61 |   const [internalSelectedItem, setInternalSelectedItem] = React.useState<
62 |     T | undefined
63 |   >();
64 |   const [inputValue, setInputValue] = React.useState("");
65 |
66 |   const selectedItem = incomingSelectedItem ?? internalSelectedItem;
67 |
68 |   const filteredItems = items.filter((item) =>
69 |     item.label.toLowerCase().includes(inputValue.toLowerCase()),
70 |   );
71 |
72 |   const showCreate = onCreate && Boolean(inputValue) && !filteredItems.length;
73 |
74 |   const Component = (
75 |     <Command loop shouldFilter={false}>
76 |       <CommandInput
77 |         value={inputValue}
78 |         onValueChange={setInputValue}
79 |         placeholder={searchPlaceholder ?? "Search item..."}
80 |         className="px-3"
81 |       />
82 |
83 |       <CommandGroup>
84 |         <CommandList className="max-h-[225px] overflow-auto">
85 |           {filteredItems.map((item) => {
86 |             const isChecked = selectedItem?.id === item.id;
87 |
88 |             return (
89 |               <CommandItem
90 |                 disabled={item.disabled}
91 |                 className={cn("cursor-pointer", className)}
92 |                 key={item.id}
93 |                 value={item.id}
94 |                 onSelect={(id) => {
95 |                   const foundItem = items.find((item) => item.id === id);
96 |
97 |                   if (!foundItem) {
98 |                     console.log("No item found", id);
99 |                     return;
100 |                   }
101 |
102 |                   onSelect(foundItem);
103 |                   setInternalSelectedItem(foundItem);
104 |                   setOpen(false);
105 |                 }}
106 |               >
107 |                 {renderListItem ? (
108 |                   renderListItem({ isChecked, item })
109 |                 ) : (
110 |                   <>
111 |                     <Check
112 |                       className={cn(
113 |                         "mr-2 h-4 w-4",
114 |                         isChecked ? "opacity-100" : "opacity-0",
115 |                       )}
116 |                     />
117 |                     {item.label}
118 |                   </>
119 |                 )}
120 |               </CommandItem>
121 |             );
122 |           })}
123 |
124 |           <CommandEmpty>{emptyResults ?? "No item found"}</CommandEmpty>
125 |
126 |           {showCreate && (
127 |             <CommandItem
128 |               key={inputValue}
129 |               value={inputValue}
130 |               onSelect={() => {
131 |                 onCreate(inputValue);
132 |                 setOpen(false);
133 |                 setInputValue("");
134 |               }}
135 |               onMouseDown={(event) => {
136 |                 event.preventDefault();
137 |                 event.stopPropagation();
138 |               }}
139 |             >
140 |               {renderOnCreate ? renderOnCreate(inputValue) : null}
141 |             </CommandItem>
142 |           )}
143 |         </CommandList>
144 |       </CommandGroup>
145 |     </Command>
146 |   );
147 |
148 |   if (headless) {
149 |     return Component;
150 |   }
151 |
152 |   return (
153 |     <Popover open={open} onOpenChange={setOpen} modal>
154 |       <PopoverTrigger asChild disabled={disabled} className="w-full">
155 |         <Button
156 |           variant="outline"
157 |           aria-expanded={open}
158 |           className="w-full justify-between relative"
159 |         >
160 |           <span className="truncate text-ellipsis pr-3">
161 |             {selectedItem
162 |               ? ((
163 |                   <span className="flex items-center overflow-hidden whitespace-nowrap text-ellipsis block">
164 |                     {renderSelectedItem?.(selectedItem)}
165 |                   </span>
166 |                 ) ?? selectedItem.label)
167 |               : (placeholder ?? "Select item...")}
168 |           </span>
169 |           <ChevronsUpDown className="size-4 opacity-50 absolute right-2" />
170 |         </Button>
171 |       </PopoverTrigger>
172 |
173 |       <PopoverContent
174 |         className="p-0"
175 |         {...popoverProps}
176 |         style={{
177 |           width: "var(--radix-popover-trigger-width)",
178 |           ...popoverProps?.style,
179 |         }}
180 |       >
181 |         {Component}
182 |       </PopoverContent>
183 |     </Popover>
184 |   );
185 | }
```

packages/ui/src/components/combobox.tsx
```
1 | "use client";
2 |
3 | import { Command as CommandPrimitive } from "cmdk";
4 | import { Loader2 } from "lucide-react";
5 | import { useCallback, useRef, useState } from "react";
6 | import { cn } from "../utils";
7 | import {
8 |   CommandGroup,
9 |   CommandInput,
10 |   CommandItem,
11 |   CommandList,
12 | } from "./command";
13 | import { Icons } from "./icons";
14 |
15 | export type Option = Record<"id" | "name", string> & Record<string, string>;
16 |
17 | type ComboboxProps = {
18 |   options: Option[];
19 |   emptyMessage: string;
20 |   value?: Option;
21 |   onSelect?: (value?: Option) => void;
22 |   onCreate?: (value?: string) => void;
23 |   onRemove?: () => void;
24 |   onValueChange?: (value: string) => void;
25 |   isLoading?: boolean;
26 |   disabled?: boolean;
27 |   placeholder?: string;
28 |   className?: string;
29 |   classNameList?: string;
30 |   autoFocus?: boolean;
31 |   showIcon?: boolean;
32 |   CreateComponent?: React.ReactElement<{ value: string }>;
33 | };
34 |
35 | export const Combobox = ({
36 |   options,
37 |   placeholder,
38 |   value,
39 |   onSelect,
40 |   onRemove,
41 |   onCreate,
42 |   disabled,
43 |   className,
44 |   classNameList,
45 |   isLoading = false,
46 |   showIcon = true,
47 |   autoFocus,
48 |   onValueChange,
49 |   CreateComponent,
50 | }: ComboboxProps) => {
51 |   const inputRef = useRef<HTMLInputElement>(null);
52 |   const [isOpen, setOpen] = useState(false);
53 |   const [selected, setSelected] = useState<Option | undefined>(value as Option);
54 |   const [inputValue, setInputValue] = useState<string>(value?.name || "");
55 |
56 |   const handleOnValueChange = (value: string) => {
57 |     setInputValue(value);
58 |     onValueChange?.(value);
59 |
60 |     if (value) {
61 |       setOpen(true);
62 |     } else {
63 |       setOpen(false);
64 |     }
65 |   };
66 |
67 |   const handleOnRemove = () => {
68 |     setSelected(undefined);
69 |     setInputValue("");
70 |     onRemove?.();
71 |   };
72 |
73 |   const handleBlur = useCallback(() => {
74 |     setOpen(false);
75 |     setInputValue(selected?.name);
76 |   }, [selected]);
77 |
78 |   const handleOnFocus = () => {
79 |     if (inputValue !== value?.name) {
80 |       setOpen(true);
81 |     }
82 |   };
83 |
84 |   const handleSelectOption = useCallback(
85 |     (selectedOption: Option) => {
86 |       setInputValue(selectedOption.name);
87 |
88 |       setSelected(selectedOption);
89 |       onSelect?.(selectedOption);
90 |
91 |       // This is a hack to prevent the input from being focused after the user selects an option
92 |       // We can call this hack: "The next tick"
93 |       setTimeout(() => {
94 |         inputRef?.current?.blur();
95 |       }, 0);
96 |     },
97 |     [onSelect],
98 |   );
99 |
100 |   return (
101 |     <CommandPrimitive className="w-full">
102 |       <div className="flex items-center w-full relative">
103 |         {showIcon && (
104 |           <Icons.Search className="w-[18px] h-[18px] absolute left-4 pointer-events-none" />
105 |         )}
106 |
107 |         <CommandInput
108 |           ref={inputRef}
109 |           value={inputValue}
110 |           onValueChange={handleOnValueChange}
111 |           onBlur={handleBlur}
112 |           onFocus={handleOnFocus}
113 |           placeholder={placeholder}
114 |           disabled={disabled}
115 |           className={className}
116 |           autoFocus={autoFocus}
117 |         />
118 |
119 |         {isLoading && (
120 |           <Loader2 className="w-[16px] h-[16px] absolute right-2 animate-spin text-dark-gray" />
121 |         )}
122 |
123 |         {!isLoading && selected && onRemove && (
124 |           <Icons.Close
125 |             className="w-[18px] h-[18px] absolute right-2"
126 |             onClick={handleOnRemove}
127 |           />
128 |         )}
129 |       </div>
130 |
131 |       <div className="relative w-full">
132 |         <CommandList
133 |           className="w-full outline-none animate-in fade-in-0 zoom-in-95"
134 |           hidden={!isOpen}
135 |         >
136 |           {inputValue?.length > 0 && (
137 |             <CommandGroup
138 |               className={cn(
139 |                 "bg-background absolute z-10 w-full max-h-[250px] overflow-auto py-2 border px-2",
140 |                 classNameList,
141 |               )}
142 |             >
143 |               {options?.map(({ component: Component, ...option }) => {
144 |                 return (
145 |                   <CommandItem
146 |                     key={option.id}
147 |                     value={`${option.name}_${option.id}`}
148 |                     onMouseDown={(event) => {
149 |                       event.preventDefault();
150 |                       event.stopPropagation();
151 |                     }}
152 |                     onSelect={() => handleSelectOption(option)}
153 |                     className="flex items-center gap-2 w-full px-2"
154 |                   >
155 |                     {Component ? <Component /> : option.name}
156 |                   </CommandItem>
157 |                 );
158 |               })}
159 |
160 |               {onCreate &&
161 |                 !options?.find(
162 |                   (o) => o.name.toLowerCase() === inputValue.toLowerCase(),
163 |                 ) && (
164 |                   <CommandItem
165 |                     key={inputValue}
166 |                     value={inputValue}
167 |                     onSelect={() => onCreate(inputValue)}
168 |                     onMouseDown={(event) => {
169 |                       event.preventDefault();
170 |                       event.stopPropagation();
171 |                     }}
172 |                   >
173 |                     {CreateComponent ? (
174 |                       <CreateComponent value={inputValue} />
175 |                     ) : (
176 |                       `Create "${inputValue}"`
177 |                     )}
178 |                   </CommandItem>
179 |                 )}
180 |             </CommandGroup>
181 |           )}
[TRUNCATED]
```

packages/ui/src/components/command.tsx
```
1 | "use client";
2 |
3 | import type { DialogProps } from "@radix-ui/react-dialog";
4 | import { Command as CommandPrimitive } from "cmdk";
5 | import * as React from "react";
6 | import { cn } from "../utils";
7 | import { Dialog, DialogContent } from "./dialog";
8 |
9 | const Command = React.forwardRef<
10 |   React.ElementRef<typeof CommandPrimitive>,
11 |   React.ComponentPropsWithoutRef<typeof CommandPrimitive>
12 | >(({ className, ...props }, ref) => (
13 |   <CommandPrimitive
14 |     ref={ref}
15 |     className={cn(
16 |       "flex h-full w-full flex-col overflow-hidden text-popover-foreground",
17 |       className,
18 |     )}
19 |     {...props}
20 |   />
21 | ));
22 | Command.displayName = CommandPrimitive.displayName;
23 |
24 | interface CommandDialogProps extends DialogProps {}
25 |
26 | const CommandDialog = ({ children, ...props }: CommandDialogProps) => {
27 |   return (
28 |     <Dialog {...props}>
29 |       <DialogContent className="overflow-hidden p-0 max-w-[740px]" hideClose>
30 |         <Command className="h-[480px] &_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 [&_[cmdk-group]]:px-2 [&_[cmdk-input-wrapper]_svg]:h-5 [&_[cmdk-input-wrapper]_svg]:w-5 [&_[cmdk-input]]:h-12 [&_[cmdk-item]]:px-2 [&_[cmdk-item]]:py-3 [&_[cmdk-item]_svg]:h-5 [&_[cmdk-item]_svg]:w-5">
31 |           {children}
32 |         </Command>
33 |       </DialogContent>
34 |     </Dialog>
35 |   );
36 | };
37 |
38 | const CommandInput = React.forwardRef<
39 |   React.ElementRef<typeof CommandPrimitive.Input>,
40 |   React.ComponentPropsWithoutRef<typeof CommandPrimitive.Input>
41 | >(({ className, ...props }, ref) => (
42 |   <div className="flex items-center w-full" cmdk-input-wrapper="">
43 |     <CommandPrimitive.Input
44 |       ref={ref}
45 |       className={cn(
46 |         "flex h-10 w-full bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50",
47 |         className,
48 |       )}
49 |       {...props}
50 |     />
51 |   </div>
52 | ));
53 |
54 | CommandInput.displayName = CommandPrimitive.Input.displayName;
55 |
56 | const CommandList = React.forwardRef<
57 |   React.ElementRef<typeof CommandPrimitive.List>,
58 |   React.ComponentPropsWithoutRef<typeof CommandPrimitive.List>
59 | >(({ className, ...props }, ref) => (
60 |   <CommandPrimitive.List
61 |     ref={ref}
62 |     className={cn(
63 |       "max-h-[350px] w-full overflow-y-auto overflow-x-hidden",
64 |       className,
65 |     )}
66 |     {...props}
67 |   />
68 | ));
69 |
70 | CommandList.displayName = CommandPrimitive.List.displayName;
71 |
72 | const CommandEmpty = React.forwardRef<
73 |   React.ElementRef<typeof CommandPrimitive.Empty>,
74 |   React.ComponentPropsWithoutRef<typeof CommandPrimitive.Empty>
75 | >((props, ref) => (
76 |   <CommandPrimitive.Empty
77 |     ref={ref}
78 |     className="py-6 text-center text-sm"
79 |     {...props}
80 |   />
81 | ));
82 |
83 | CommandEmpty.displayName = CommandPrimitive.Empty.displayName;
84 |
85 | const CommandGroup = React.forwardRef<
86 |   React.ElementRef<typeof CommandPrimitive.Group>,
87 |   React.ComponentPropsWithoutRef<typeof CommandPrimitive.Group>
88 | >(({ className, ...props }, ref) => (
89 |   <CommandPrimitive.Group
90 |     ref={ref}
91 |     className={cn(
92 |       "overflow-hidden p-1 text-foreground [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground",
93 |       className,
94 |     )}
95 |     {...props}
96 |   />
97 | ));
98 |
99 | CommandGroup.displayName = CommandPrimitive.Group.displayName;
100 |
101 | const CommandSeparator = React.forwardRef<
102 |   React.ElementRef<typeof CommandPrimitive.Separator>,
103 |   React.ComponentPropsWithoutRef<typeof CommandPrimitive.Separator>
104 | >(({ className, ...props }, ref) => (
105 |   <CommandPrimitive.Separator
106 |     ref={ref}
107 |     className={cn("-mx-1 h-px bg-border", className)}
108 |     {...props}
109 |   />
110 | ));
111 | CommandSeparator.displayName = CommandPrimitive.Separator.displayName;
112 |
113 | const CommandItem = React.forwardRef<
114 |   React.ElementRef<typeof CommandPrimitive.Item>,
115 |   React.ComponentPropsWithoutRef<typeof CommandPrimitive.Item>
116 | >(({ className, ...props }, ref) => (
117 |   <CommandPrimitive.Item
118 |     ref={ref}
119 |     className={cn(
120 |       "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none aria-selected:bg-accent aria-selected:text-accent-foreground",
121 |       className,
122 |     )}
123 |     {...props}
124 |   />
125 | ));
126 |
127 | CommandItem.displayName = CommandPrimitive.Item.displayName;
128 |
129 | const CommandShortcut = ({
130 |   className,
131 |   ...props
132 | }: React.HTMLAttributes<HTMLSpanElement>) => {
133 |   return (
134 |     <span
135 |       className={cn(
136 |         "ml-auto text-xs tracking-widest text-muted-foreground",
137 |         className,
138 |       )}
139 |       {...props}
140 |     />
141 |   );
142 | };
143 | CommandShortcut.displayName = "CommandShortcut";
144 |
145 | export {
146 |   Command,
147 |   CommandDialog,
148 |   CommandInput,
149 |   CommandList,
150 |   CommandEmpty,
151 |   CommandGroup,
[TRUNCATED]
```

packages/ui/src/components/context-menu.tsx
```
1 | "use client";
2 |
3 | import * as ContextMenuPrimitive from "@radix-ui/react-context-menu";
4 | import { Check, ChevronRight, Circle } from "lucide-react";
5 | import * as React from "react";
6 | import { cn } from "../utils";
7 |
8 | const ContextMenu = ContextMenuPrimitive.Root;
9 |
10 | const ContextMenuTrigger = ContextMenuPrimitive.Trigger;
11 |
12 | const ContextMenuGroup = ContextMenuPrimitive.Group;
13 |
14 | const ContextMenuPortal = ContextMenuPrimitive.Portal;
15 |
16 | const ContextMenuSub = ContextMenuPrimitive.Sub;
17 |
18 | const ContextMenuRadioGroup = ContextMenuPrimitive.RadioGroup;
19 |
20 | const ContextMenuSubTrigger = React.forwardRef<
21 |   React.ElementRef<typeof ContextMenuPrimitive.SubTrigger>,
22 |   React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.SubTrigger> & {
23 |     inset?: boolean;
24 |   }
25 | >(({ className, inset, children, ...props }, ref) => (
26 |   <ContextMenuPrimitive.SubTrigger
27 |     ref={ref}
28 |     className={cn(
29 |       "flex cursor-default select-none items-center px-2 py-1.5 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground",
30 |       inset && "pl-8",
31 |       className
32 |     )}
33 |     {...props}
34 |   >
35 |     {children}
36 |     <ChevronRight className="ml-auto h-4 w-4" />
37 |   </ContextMenuPrimitive.SubTrigger>
38 | ));
39 | ContextMenuSubTrigger.displayName = ContextMenuPrimitive.SubTrigger.displayName;
40 |
41 | const ContextMenuSubContent = React.forwardRef<
42 |   React.ElementRef<typeof ContextMenuPrimitive.SubContent>,
43 |   React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.SubContent>
44 | >(({ className, ...props }, ref) => (
45 |   <ContextMenuPrimitive.SubContent
46 |     ref={ref}
47 |     className={cn(
48 |       "z-50 min-w-[8rem] overflow-hidden border bg-background p-1 text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
49 |       className
50 |     )}
51 |     {...props}
52 |   />
53 | ));
54 | ContextMenuSubContent.displayName = ContextMenuPrimitive.SubContent.displayName;
55 |
56 | const ContextMenuContent = React.forwardRef<
57 |   React.ElementRef<typeof ContextMenuPrimitive.Content>,
58 |   React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Content>
59 | >(({ className, ...props }, ref) => (
60 |   <ContextMenuPrimitive.Portal>
61 |     <ContextMenuPrimitive.Content
62 |       ref={ref}
63 |       className={cn(
64 |         "z-50 min-w-[8rem] overflow-hidden border bg-background p-1 text-popover-foreground shadow-md animate-in fade-in-80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
65 |         className
66 |       )}
67 |       {...props}
68 |     />
69 |   </ContextMenuPrimitive.Portal>
70 | ));
71 | ContextMenuContent.displayName = ContextMenuPrimitive.Content.displayName;
72 |
73 | const ContextMenuItem = React.forwardRef<
74 |   React.ElementRef<typeof ContextMenuPrimitive.Item>,
75 |   React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Item> & {
76 |     inset?: boolean;
77 |   }
78 | >(({ className, inset, ...props }, ref) => (
79 |   <ContextMenuPrimitive.Item
80 |     ref={ref}
81 |     className={cn(
82 |       "relative flex cursor-default select-none items-center px-2 py-1.5 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
83 |       inset && "pl-8",
84 |       className
85 |     )}
86 |     {...props}
87 |   />
88 | ));
89 | ContextMenuItem.displayName = ContextMenuPrimitive.Item.displayName;
90 |
91 | const ContextMenuCheckboxItem = React.forwardRef<
92 |   React.ElementRef<typeof ContextMenuPrimitive.CheckboxItem>,
93 |   React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.CheckboxItem>
94 | >(({ className, children, checked, ...props }, ref) => (
95 |   <ContextMenuPrimitive.CheckboxItem
96 |     ref={ref}
97 |     className={cn(
98 |       "relative flex cursor-default select-none items-center py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
99 |       className
100 |     )}
101 |     checked={checked}
102 |     {...props}
103 |   >
104 |     <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
105 |       <ContextMenuPrimitive.ItemIndicator>
106 |         <Check className="h-4 w-4" />
107 |       </ContextMenuPrimitive.ItemIndicator>
108 |     </span>
109 |     {children}
110 |   </ContextMenuPrimitive.CheckboxItem>
111 | ));
112 | ContextMenuCheckboxItem.displayName =
113 |   ContextMenuPrimitive.CheckboxItem.displayName;
114 |
115 | const ContextMenuRadioItem = React.forwardRef<
116 |   React.ElementRef<typeof ContextMenuPrimitive.RadioItem>,
117 |   React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.RadioItem>
118 | >(({ className, children, ...props }, ref) => (
119 |   <ContextMenuPrimitive.RadioItem
120 |     ref={ref}
121 |     className={cn(
[TRUNCATED]
```

packages/ui/src/components/currency-input.tsx
```
1 | import { NumericFormat, type NumericFormatProps } from "react-number-format";
2 | import { Input } from "./input";
3 |
4 | export function CurrencyInput({
5 |   thousandSeparator = true,
6 |   ...props
7 | }: NumericFormatProps) {
8 |   return (
9 |     <NumericFormat
10 |       thousandSeparator={thousandSeparator}
11 |       customInput={Input}
12 |       {...props}
13 |     />
14 |   );
15 | }
```

packages/ui/src/components/date-range-picker.tsx
```
1 | "use client";
2 |
3 | import type React from "react";
4 | import type { DateRange } from "react-day-picker";
5 | import { cn } from "../utils";
6 | import { Button } from "./button";
7 | import { Calendar } from "./calendar";
8 | import { Icons } from "./icons";
9 | import { Popover, PopoverContent, PopoverTrigger } from "./popover";
10 |
11 | type Props = {
12 |   range: DateRange;
13 |   className: React.HTMLAttributes<HTMLDivElement>;
14 |   onSelect: (range?: DateRange) => void;
15 |   placeholder: string;
16 |   disabled?: boolean;
17 | };
18 |
19 | export function DateRangePicker({
20 |   className,
21 |   range,
22 |   disabled,
23 |   onSelect,
24 |   placeholder,
25 | }: Props) {
26 |   return (
27 |     <div className={cn("grid gap-2", className)}>
28 |       <Popover>
29 |         <PopoverTrigger asChild disabled={disabled}>
30 |           <Button
31 |             variant="outline"
32 |             className={cn("justify-start text-left font-medium space-x-2")}
33 |           >
34 |             <span>{placeholder}</span>
35 |             <Icons.ChevronDown />
36 |           </Button>
37 |         </PopoverTrigger>
38 |         <PopoverContent className="w-auto p-0 mt-2" align="end">
39 |           <Calendar
40 |             initialFocus
41 |             mode="range"
42 |             defaultMonth={range?.from}
43 |             selected={range}
44 |             onSelect={onSelect}
45 |             numberOfMonths={2}
46 |           />
47 |         </PopoverContent>
48 |       </Popover>
49 |     </div>
50 |   );
51 | }
```

packages/ui/src/components/dialog.tsx
```
1 | "use client";
2 |
3 | import * as DialogPrimitive from "@radix-ui/react-dialog";
4 | import { Cross2Icon } from "@radix-ui/react-icons";
5 | import * as React from "react";
6 | import { cn } from "../utils";
7 |
8 | const Dialog = DialogPrimitive.Root;
9 |
10 | const DialogTrigger = DialogPrimitive.Trigger;
11 |
12 | const DialogPortal = DialogPrimitive.Portal;
13 |
14 | const DialogOverlay = React.forwardRef<
15 |   React.ElementRef<typeof DialogPrimitive.Overlay>,
16 |   React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
17 | >(({ className, ...props }, ref) => (
18 |   <DialogPrimitive.Overlay
19 |     ref={ref}
20 |     className={cn(
21 |       "fixed inset-0 z-50 bg-[#f6f6f3]/60 dark:bg-[#121212]/80 data-[state=closed]:animate-[dialog-overlay-hide_100ms] data-[state=open]:animate-[dialog-overlay-show_100ms]",
22 |       className,
23 |     )}
24 |     {...props}
25 |   />
26 | ));
27 | DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;
28 |
29 | const DialogContent = React.forwardRef<
30 |   React.ElementRef<typeof DialogPrimitive.Content>,
31 |   React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
32 | >(({ className, children, hideClose, ...props }, ref) => (
33 |   <DialogPortal>
34 |     <DialogOverlay />
35 |     <DialogPrimitive.Content
36 |       ref={ref}
37 |       className={cn(
38 |         "bg-background border-border border fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-xl dark:p-px text-primary z-50 data-[state=closed]:animate-[dialog-content-hide_100ms] data-[state=open]:animate-[dialog-content-show_100ms]",
39 |         className,
40 |       )}
41 |       {...props}
42 |     >
43 |       {children}
44 |
45 |       {!hideClose && (
46 |         <DialogPrimitive.Close className="absolute right-6 top-6 opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
47 |           <Cross2Icon className="h-4 w-4" />
48 |           <span className="sr-only">Close</span>
49 |         </DialogPrimitive.Close>
50 |       )}
51 |     </DialogPrimitive.Content>
52 |   </DialogPortal>
53 | ));
54 | DialogContent.displayName = DialogPrimitive.Content.displayName;
55 |
56 | const DialogContentFrameless = React.forwardRef<
57 |   React.ElementRef<typeof DialogPrimitive.Content>,
58 |   React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
59 | >(({ className, children, ...props }, ref) => (
60 |   <DialogPortal>
61 |     <DialogOverlay />
62 |     <DialogPrimitive.Content
63 |       ref={ref}
64 |       className={cn(
65 |         "fixed bg-background top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-xl border dark:border-none dark:p-px text-primary z-50 data-[state=closed]:animate-[dialog-content-hide_100ms] data-[state=open]:animate-[dialog-content-show_100ms]",
66 |         className,
67 |       )}
68 |       {...props}
69 |     >
70 |       {children}
71 |     </DialogPrimitive.Content>
72 |   </DialogPortal>
73 | ));
74 |
75 | const DialogHeader = ({
76 |   className,
77 |   ...props
78 | }: React.HTMLAttributes<HTMLDivElement>) => (
79 |   <div
80 |     className={cn("flex flex-col space-y-1.5 text-left", className)}
81 |     {...props}
82 |   />
83 | );
84 | DialogHeader.displayName = "DialogHeader";
85 |
86 | const DialogFooter = ({
87 |   className,
88 |   ...props
89 | }: React.HTMLAttributes<HTMLDivElement>) => (
90 |   <div
91 |     className={cn(
92 |       "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
93 |       className,
94 |     )}
95 |     {...props}
96 |   />
97 | );
98 | DialogFooter.displayName = "DialogFooter";
99 |
100 | const DialogTitle = React.forwardRef<
101 |   React.ElementRef<typeof DialogPrimitive.Title>,
102 |   React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
103 | >(({ className, ...props }, ref) => (
104 |   <DialogPrimitive.Title
105 |     ref={ref}
106 |     className={cn(
107 |       "text-lg font-semibold leading-none tracking-tight mb-4",
108 |       className,
109 |     )}
110 |     {...props}
111 |   />
112 | ));
113 | DialogTitle.displayName = DialogPrimitive.Title.displayName;
114 |
115 | const DialogDescription = React.forwardRef<
116 |   React.ElementRef<typeof DialogPrimitive.Description>,
117 |   React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
118 | >(({ className, ...props }, ref) => (
119 |   <DialogPrimitive.Description
120 |     ref={ref}
121 |     className={cn("text-sm text-[#878787]", className)}
122 |     {...props}
123 |   />
124 | ));
125 | DialogDescription.displayName = DialogPrimitive.Description.displayName;
126 |
127 | export {
128 |   Dialog,
129 |   DialogPortal,
130 |   DialogOverlay,
131 |   DialogTrigger,
132 |   DialogContent,
133 |   DialogHeader,
134 |   DialogFooter,
135 |   DialogTitle,
136 |   DialogDescription,
137 |   DialogContentFrameless,
138 | };
```

packages/ui/src/components/drawer.tsx
```
1 | "use client";
2 |
3 | import * as React from "react";
4 | import { Drawer as DrawerPrimitive } from "vaul";
5 | import { cn } from "../utils";
6 |
7 | const Drawer = ({
8 |   shouldScaleBackground = true,
9 |   ...props
10 | }: React.ComponentProps<typeof DrawerPrimitive.Root>) => (
11 |   <DrawerPrimitive.Root
12 |     shouldScaleBackground={shouldScaleBackground}
13 |     {...props}
14 |   />
15 | );
16 | Drawer.displayName = "Drawer";
17 |
18 | const DrawerTrigger = DrawerPrimitive.Trigger;
19 |
20 | const DrawerPortal = DrawerPrimitive.Portal;
21 |
22 | const DrawerClose = DrawerPrimitive.Close;
23 |
24 | const DrawerOverlay = React.forwardRef<
25 |   React.ElementRef<typeof DrawerPrimitive.Overlay>,
26 |   React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Overlay>
27 | >(({ className, ...props }, ref) => (
28 |   <DrawerPrimitive.Overlay
29 |     ref={ref}
30 |     className={cn("fixed inset-0 z-50 bg-black/80", className)}
31 |     {...props}
32 |   />
33 | ));
34 | DrawerOverlay.displayName = DrawerPrimitive.Overlay.displayName;
35 |
36 | const DrawerContent = React.forwardRef<
37 |   React.ElementRef<typeof DrawerPrimitive.Content>,
38 |   React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Content>
39 | >(({ className, children, ...props }, ref) => (
40 |   <DrawerPortal>
41 |     <DrawerOverlay />
42 |     <DrawerPrimitive.Content
43 |       ref={ref}
44 |       className={cn(
45 |         "fixed inset-x-0 bottom-0 z-50 mt-24 flex h-auto flex-col rounded-t-[10px] border bg-background",
46 |         className
47 |       )}
48 |       {...props}
49 |     >
50 |       <div className="mx-auto mt-4 h-2 w-[100px] rounded-full bg-accent" />
51 |       {children}
52 |     </DrawerPrimitive.Content>
53 |   </DrawerPortal>
54 | ));
55 | DrawerContent.displayName = "DrawerContent";
56 |
57 | const DrawerHeader = ({
58 |   className,
59 |   ...props
60 | }: React.HTMLAttributes<HTMLDivElement>) => (
61 |   <div
62 |     className={cn("grid gap-1.5 p-4 text-center sm:text-left", className)}
63 |     {...props}
64 |   />
65 | );
66 | DrawerHeader.displayName = "DrawerHeader";
67 |
68 | const DrawerFooter = ({
69 |   className,
70 |   ...props
71 | }: React.HTMLAttributes<HTMLDivElement>) => (
72 |   <div
73 |     className={cn("mt-auto flex flex-col gap-2 p-4", className)}
74 |     {...props}
75 |   />
76 | );
77 | DrawerFooter.displayName = "DrawerFooter";
78 |
79 | const DrawerTitle = React.forwardRef<
80 |   React.ElementRef<typeof DrawerPrimitive.Title>,
81 |   React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Title>
82 | >(({ className, ...props }, ref) => (
83 |   <DrawerPrimitive.Title
84 |     ref={ref}
85 |     className={cn(
86 |       "text-lg font-semibold leading-none tracking-tight",
87 |       className
88 |     )}
89 |     {...props}
90 |   />
91 | ));
92 | DrawerTitle.displayName = DrawerPrimitive.Title.displayName;
93 |
94 | const DrawerDescription = React.forwardRef<
95 |   React.ElementRef<typeof DrawerPrimitive.Description>,
96 |   React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Description>
97 | >(({ className, ...props }, ref) => (
98 |   <DrawerPrimitive.Description
99 |     ref={ref}
100 |     className={cn("text-sm text-muted-foreground", className)}
101 |     {...props}
102 |   />
103 | ));
104 | DrawerDescription.displayName = DrawerPrimitive.Description.displayName;
105 |
106 | export {
107 |   Drawer,
108 |   DrawerPortal,
109 |   DrawerOverlay,
110 |   DrawerTrigger,
111 |   DrawerClose,
112 |   DrawerContent,
113 |   DrawerHeader,
114 |   DrawerFooter,
115 |   DrawerTitle,
116 |   DrawerDescription,
117 | };
```

packages/ui/src/components/dropdown-menu.tsx
```
1 | "use client";
2 |
3 | import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
4 | import {
5 |   CheckIcon,
6 |   ChevronRightIcon,
7 |   DotFilledIcon,
8 | } from "@radix-ui/react-icons";
9 | import * as React from "react";
10 | import { cn } from "../utils";
11 |
12 | const DropdownMenu = DropdownMenuPrimitive.Root;
13 |
14 | const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger;
15 |
16 | const DropdownMenuGroup = DropdownMenuPrimitive.Group;
17 |
18 | const DropdownMenuPortal = DropdownMenuPrimitive.Portal;
19 |
20 | const DropdownMenuSub = DropdownMenuPrimitive.Sub;
21 |
22 | const DropdownMenuRadioGroup = DropdownMenuPrimitive.RadioGroup;
23 |
24 | const DropdownMenuSubTrigger = React.forwardRef<
25 |   React.ElementRef<typeof DropdownMenuPrimitive.SubTrigger>,
26 |   React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubTrigger> & {
27 |     inset?: boolean;
28 |   }
29 | >(({ className, inset, children, ...props }, ref) => (
30 |   <DropdownMenuPrimitive.SubTrigger
31 |     ref={ref}
32 |     className={cn(
33 |       "flex cursor-default select-none items-center px-2 py-1.5 text-sm outline-none focus:bg-accent data-[state=open]:bg-accent",
34 |       inset && "pl-8",
35 |       className,
36 |     )}
37 |     {...props}
38 |   >
39 |     {children}
40 |     <ChevronRightIcon className="ml-auto h-4 w-4" />
41 |   </DropdownMenuPrimitive.SubTrigger>
42 | ));
43 | DropdownMenuSubTrigger.displayName =
44 |   DropdownMenuPrimitive.SubTrigger.displayName;
45 |
46 | const DropdownMenuSubContent = React.forwardRef<
47 |   React.ElementRef<typeof DropdownMenuPrimitive.SubContent>,
48 |   React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubContent>
49 | >(({ className, ...props }, ref) => (
50 |   <DropdownMenuPrimitive.SubContent
51 |     ref={ref}
52 |     className={cn(
53 |       "z-50 min-w-[8rem] overflow-hidden border bg-background p-1 text-popover-foreground shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
54 |       className,
55 |     )}
56 |     {...props}
57 |   />
58 | ));
59 | DropdownMenuSubContent.displayName =
60 |   DropdownMenuPrimitive.SubContent.displayName;
61 |
62 | const DropdownMenuContent = React.forwardRef<
63 |   React.ElementRef<typeof DropdownMenuPrimitive.Content>,
64 |   React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content>
65 | >(({ className, sideOffset = 4, ...props }, ref) => (
66 |   <DropdownMenuPrimitive.Portal>
67 |     <DropdownMenuPrimitive.Content
68 |       ref={ref}
69 |       sideOffset={sideOffset}
70 |       className={cn(
71 |         "z-50 min-w-[8rem] overflow-hidden border bg-background p-1 text-popover-foreground shadow-md",
72 |         "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
73 |         className,
74 |       )}
75 |       {...props}
76 |     />
77 |   </DropdownMenuPrimitive.Portal>
78 | ));
79 | DropdownMenuContent.displayName = DropdownMenuPrimitive.Content.displayName;
80 |
81 | const DropdownMenuItem = React.forwardRef<
82 |   React.ElementRef<typeof DropdownMenuPrimitive.Item>,
83 |   React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item> & {
84 |     inset?: boolean;
85 |     asDialogTrigger?: boolean;
86 |   }
87 | >(({ className, inset, asDialogTrigger, ...props }, ref) => (
88 |   <DropdownMenuPrimitive.Item
89 |     ref={ref}
90 |     className={cn(
91 |       "relative flex cursor-default select-none items-center px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
92 |       inset && "pl-8",
93 |       className,
94 |     )}
95 |     {...(asDialogTrigger && { onSelect: (evt) => evt.preventDefault() })}
96 |     {...props}
97 |   />
98 | ));
99 | DropdownMenuItem.displayName = DropdownMenuPrimitive.Item.displayName;
100 |
101 | const DropdownMenuCheckboxItem = React.forwardRef<
102 |   React.ElementRef<typeof DropdownMenuPrimitive.CheckboxItem>,
103 |   React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.CheckboxItem>
104 | >(({ className, children, checked, ...props }, ref) => (
105 |   <DropdownMenuPrimitive.CheckboxItem
106 |     ref={ref}
107 |     className={cn(
108 |       "relative flex cursor-default select-none items-center py-1.5 pl-4 pr-12 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
109 |       className,
110 |     )}
111 |     checked={checked}
112 |     {...props}
113 |   >
114 |     {children}
115 |
116 |     <span className="absolute right-2 flex h-2 w-2 items-center justify-center">
117 |       <DropdownMenuPrimitive.ItemIndicator>
118 |         <CheckIcon className="h-4 w-4" />
119 |       </DropdownMenuPrimitive.ItemIndicator>
120 |     </span>
121 |   </DropdownMenuPrimitive.CheckboxItem>
122 | ));
123 | DropdownMenuCheckboxItem.displayName =
124 |   DropdownMenuPrimitive.CheckboxItem.displayName;
125 |
126 | const DropdownMenuRadioItem = React.forwardRef<
127 |   React.ElementRef<typeof DropdownMenuPrimitive.RadioItem>,
128 |   React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.RadioItem>
[TRUNCATED]
```

packages/ui/src/components/form.tsx
```
1 | import type * as LabelPrimitive from "@radix-ui/react-label";
2 | import { Slot } from "@radix-ui/react-slot";
3 | import * as React from "react";
4 | import {
5 |   Controller,
6 |   type ControllerProps,
7 |   type FieldPath,
8 |   type FieldValues,
9 |   FormProvider,
10 |   useFormContext,
11 | } from "react-hook-form";
12 | import { cn } from "../utils";
13 | import { Label } from "./label";
14 |
15 | const Form = FormProvider;
16 |
17 | type FormFieldContextValue<
18 |   TFieldValues extends FieldValues = FieldValues,
19 |   TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
20 | > = {
21 |   name: TName;
22 | };
23 |
24 | const FormFieldContext = React.createContext<FormFieldContextValue>(
25 |   {} as FormFieldContextValue,
26 | );
27 |
28 | const FormField = <
29 |   TFieldValues extends FieldValues = FieldValues,
30 |   TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
31 | >({
32 |   ...props
33 | }: ControllerProps<TFieldValues, TName>) => {
34 |   return (
35 |     <FormFieldContext.Provider value={{ name: props.name }}>
36 |       <Controller {...props} />
37 |     </FormFieldContext.Provider>
38 |   );
39 | };
40 |
41 | const useFormField = () => {
42 |   const fieldContext = React.useContext(FormFieldContext);
43 |   const itemContext = React.useContext(FormItemContext);
44 |   const { getFieldState, formState } = useFormContext();
45 |
46 |   const fieldState = getFieldState(fieldContext.name, formState);
47 |
48 |   if (!fieldContext) {
49 |     throw new Error("useFormField should be used within <FormField>");
50 |   }
51 |
52 |   const { id } = itemContext;
53 |
54 |   return {
55 |     id,
56 |     name: fieldContext.name,
57 |     formItemId: `${id}-form-item`,
58 |     formDescriptionId: `${id}-form-item-description`,
59 |     formMessageId: `${id}-form-item-message`,
60 |     ...fieldState,
61 |   };
62 | };
63 |
64 | type FormItemContextValue = {
65 |   id: string;
66 | };
67 |
68 | const FormItemContext = React.createContext<FormItemContextValue>(
69 |   {} as FormItemContextValue,
70 | );
71 |
72 | const FormItem = React.forwardRef<
73 |   HTMLDivElement,
74 |   React.HTMLAttributes<HTMLDivElement>
75 | >(({ className, ...props }, ref) => {
76 |   const id = React.useId();
77 |
78 |   return (
79 |     <FormItemContext.Provider value={{ id }}>
80 |       <div ref={ref} className={cn("space-y-2", className)} {...props} />
81 |     </FormItemContext.Provider>
82 |   );
83 | });
84 | FormItem.displayName = "FormItem";
85 |
86 | const FormLabel = React.forwardRef<
87 |   React.ElementRef<typeof LabelPrimitive.Root>,
88 |   React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>
89 | >(({ className, ...props }, ref) => {
90 |   const { error, formItemId } = useFormField();
91 |
92 |   return (
93 |     <Label
94 |       ref={ref}
95 |       className={cn(error && "text-destructive", className)}
96 |       htmlFor={formItemId}
97 |       {...props}
98 |     />
99 |   );
100 | });
101 | FormLabel.displayName = "FormLabel";
102 |
103 | const FormControl = React.forwardRef<
104 |   React.ElementRef<typeof Slot>,
105 |   React.ComponentPropsWithoutRef<typeof Slot>
106 | >(({ ...props }, ref) => {
107 |   const { error, formItemId, formDescriptionId, formMessageId } =
108 |     useFormField();
109 |
110 |   return (
111 |     <Slot
112 |       ref={ref}
113 |       id={formItemId}
114 |       aria-describedby={
115 |         !error
116 |           ? `${formDescriptionId}`
117 |           : `${formDescriptionId} ${formMessageId}`
118 |       }
119 |       aria-invalid={!!error}
120 |       {...props}
121 |     />
122 |   );
123 | });
124 | FormControl.displayName = "FormControl";
125 |
126 | const FormDescription = React.forwardRef<
127 |   HTMLParagraphElement,
128 |   React.HTMLAttributes<HTMLParagraphElement>
129 | >(({ className, ...props }, ref) => {
130 |   const { formDescriptionId } = useFormField();
131 |
132 |   return (
133 |     <p
134 |       ref={ref}
135 |       id={formDescriptionId}
136 |       className={cn("text-[0.8rem] text-muted-foreground", className)}
137 |       {...props}
138 |     />
139 |   );
140 | });
141 | FormDescription.displayName = "FormDescription";
142 |
143 | const FormMessage = React.forwardRef<
144 |   HTMLParagraphElement,
145 |   React.HTMLAttributes<HTMLParagraphElement>
146 | >(({ className, children, ...props }, ref) => {
147 |   const { error, formMessageId } = useFormField();
148 |   const body = error ? String(error?.message) : children;
149 |
150 |   if (!body) {
151 |     return null;
152 |   }
153 |
154 |   return (
155 |     <p
156 |       ref={ref}
157 |       id={formMessageId}
158 |       className={cn("text-[0.8rem] font-medium text-destructive", className)}
159 |       {...props}
160 |     >
161 |       {body}
162 |     </p>
163 |   );
164 | });
165 | FormMessage.displayName = "FormMessage";
166 |
167 | export {
168 |   useFormField,
169 |   Form,
170 |   FormItem,
171 |   FormLabel,
172 |   FormControl,
173 |   FormDescription,
174 |   FormMessage,
175 |   FormField,
176 | };
```

packages/ui/src/components/hover-card.tsx
```
1 | "use client";
2 |
3 | import * as HoverCardPrimitive from "@radix-ui/react-hover-card";
4 | import * as React from "react";
5 | import { cn } from "../utils";
6 |
7 | const HoverCard = HoverCardPrimitive.Root;
8 |
9 | const HoverCardTrigger = HoverCardPrimitive.Trigger;
10 |
11 | const HoverCardContent = React.forwardRef<
12 |   React.ElementRef<typeof HoverCardPrimitive.Content>,
13 |   React.ComponentPropsWithoutRef<typeof HoverCardPrimitive.Content>
14 | >(({ className, align = "center", sideOffset = 4, ...props }, ref) => (
15 |   <HoverCardPrimitive.Portal>
16 |     <HoverCardPrimitive.Content
17 |       ref={ref}
18 |       align={align}
19 |       sideOffset={sideOffset}
20 |       className={cn(
21 |         "z-50 w-64 border bg-background p-4 text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
22 |         className
23 |       )}
24 |       {...props}
25 |     />
26 |   </HoverCardPrimitive.Portal>
27 | ));
28 | HoverCardContent.displayName = HoverCardPrimitive.Content.displayName;
29 |
30 | export { HoverCard, HoverCardTrigger, HoverCardContent };
```

packages/ui/src/components/icons.tsx
```
1 | import { ArchiveIcon } from "@radix-ui/react-icons";
2 | import { FaXTwitter } from "react-icons/fa6";
3 | import { FiGithub } from "react-icons/fi";
4 | import {
5 |   MdAdd,
6 |   MdAddLink,
7 |   MdArrowBack,
8 |   MdArrowLeft,
9 |   MdArrowRight,
10 |   MdArrowRightAlt,
11 |   MdArrowUpward,
12 |   MdAttachMoney,
13 |   MdAutoAwesome,
14 |   MdBarChart,
15 |   MdChangeHistory,
16 |   MdChevronLeft,
17 |   MdChevronRight,
18 |   MdClose,
19 |   MdDescription,
20 |   MdDownloading,
21 |   MdDragIndicator,
22 |   MdDriveFileMove,
23 |   MdEditCalendar,
24 |   MdErrorOutline,
25 |   MdExpandLess,
26 |   MdExpandMore,
27 |   MdFence,
28 |   MdFolder,
29 |   MdFolderSpecial,
30 |   MdFolderZip,
31 |   MdFormatBold,
32 |   MdFormatItalic,
33 |   MdFormatStrikethrough,
34 |   MdFormatUnderlined,
35 |   MdInventory2,
36 |   MdIosShare,
37 |   MdKeyboardArrowDown,
38 |   MdKeyboardArrowLeft,
39 |   MdKeyboardArrowRight,
40 |   MdKeyboardArrowUp,
41 |   MdMenu,
42 |   MdMoreHoriz,
43 |   MdOutlineAccountBalance,
44 |   MdOutlineAccountCircle,
45 |   MdOutlineApps,
46 |   MdOutlineArchive,
47 |   MdOutlineArrowDownward,
48 |   MdOutlineArrowForward,
49 |   MdOutlineArrowOutward,
50 |   MdOutlineAssuredWorkload,
51 |   MdOutlineAttachFile,
52 |   MdOutlineAttachMoney,
53 |   MdOutlineAutoAwesome,
54 |   MdOutlineBackspace,
55 |   MdOutlineBrokenImage,
56 |   MdOutlineCalculate,
57 |   MdOutlineCalendarMonth,
58 |   MdOutlineCancel,
59 |   MdOutlineCategory,
60 |   MdOutlineChatBubbleOutline,
61 |   MdOutlineClear,
62 |   MdOutlineCloseFullscreen,
63 |   MdOutlineConfirmationNumber,
64 |   MdOutlineContentCopy,
65 |   MdOutlineCreateNewFolder,
66 |   MdOutlineCropFree,
67 |   MdOutlineDashboardCustomize,
68 |   MdOutlineDelete,
69 |   MdOutlineDescription,
70 |   MdOutlineDone,
71 |   MdOutlineDownload,
72 |   MdOutlineEditNote,
73 |   MdOutlineEmail,
74 |   MdOutlineEqualizer,
75 |   MdOutlineExitToApp,
76 |   MdOutlineFace,
77 |   MdOutlineFactCheck,
78 |   MdOutlineFileDownload,
79 |   MdOutlineFilterList,
80 |   MdOutlineForwardToInbox,
81 |   MdOutlineHandyman,
82 |   MdOutlineHourglassTop,
83 |   MdOutlineInbox,
84 |   MdOutlineInsertPhoto,
85 |   MdOutlineInventory2,
86 |   MdOutlineLaunch,
87 |   MdOutlineListAlt,
88 |   MdOutlineMoreTime,
89 |   MdOutlineMoreVert,
90 |   MdOutlineMoveToInbox,
91 |   MdOutlineNotificationsNone,
92 |   MdOutlineOpenInFull,
93 |   MdOutlineOpenInNew,
94 |   MdOutlinePalette,
95 |   MdOutlinePause,
96 |   MdOutlinePlayArrow,
97 |   MdOutlineQrCode2,
98 |   MdOutlineQuestionAnswer,
99 |   MdOutlineRepeat,
100 |   MdOutlineSettings,
101 |   MdOutlineSpellcheck,
102 |   MdOutlineSquareFoot,
103 |   MdOutlineStyle,
104 |   MdOutlineSubject,
105 |   MdOutlineTask,
106 |   MdOutlineTimer,
107 |   MdOutlineTune,
108 |   MdOutlineUploadFile,
109 |   MdOutlineVisibility,
110 |   MdOutlineVolumeOff,
111 |   MdOutlineVolumeUp,
112 |   MdOutlineWrapText,
113 |   MdPause,
114 |   MdPauseCircle,
115 |   MdPeople,
116 |   MdPerson,
117 |   MdPictureAsPdf,
118 |   MdPlayArrow,
119 |   MdPlayCircle,
120 |   MdRefresh,
121 |   MdRemove,
122 |   MdReplay,
123 |   MdRuleFolder,
124 |   MdSearch,
125 |   MdSecurity,
126 |   MdSignalCellularAlt,
127 |   MdSnippetFolder,
128 |   MdSort,
129 |   MdSubdirectoryArrowLeft,
130 |   MdTopic,
131 |   MdTrendingDown,
132 |   MdTrendingUp,
133 | } from "react-icons/md";
134 | import { PiDiscordLogo } from "react-icons/pi";
135 |
136 | export const Icons = {
137 |   LogoSmall: (props: any) => (
138 |     <svg
139 |       xmlns="http://www.w3.org/2000/svg"
140 |       width={32}
141 |       height={32}
142 |       fill="none"
143 |       {...props}
144 |     >
145 |       <path
146 |         fill="currentColor"
147 |         fillRule="evenodd"
148 |         d="M15.304 0c-2.41.103-4.681.739-6.7 1.792l6.7 11.606V0Zm0 18.603-6.7 11.605a15.927 15.927 0 0 0 6.7 1.792V18.603ZM16.697 32V18.595L23.4 30.206A15.928 15.928 0 0 1 16.697 32Zm0-18.594V0c2.41.103 4.684.74 6.704 1.794l-6.704 11.612Zm-14.205 11.2L14.1 17.904 7.398 29.51a16.1 16.1 0 0 1-4.906-4.905Zm27.02-17.208-11.607 6.701 6.701-11.607a16.101 16.101 0 0 1 4.905 4.906ZM2.49 7.396A16.1 16.1 0 0 1 7.398 2.49l6.704 11.61L2.49 7.396Zm-.697 1.206A15.927 15.927 0 0 0 0 15.306h13.406L1.793 8.602ZM1.794 23.4A15.927 15.927 0 0 1 0 16.699h13.401L1.794 23.4Zm16.805-8.095H32a15.927 15.927 0 0 0-1.792-6.702l-11.61 6.702ZM30.207 23.4l-11.604-6.7H32c-.104 2.41-.74 4.68-1.793 6.7Zm-12.3-5.494 6.699 11.604a16.1 16.1 0 0 0 4.904-4.905l-11.604-6.7Z"
149 |         clipRule="evenodd"
150 |       />
151 |     </svg>
152 |   ),
153 |   LogoIcon: (props: any) => (
154 |     <svg
155 |       xmlns="http://www.w3.org/2000/svg"
156 |       width={16}
157 |       height={17}
158 |       fill="none"
159 |       {...props}
160 |     >
161 |       <path
162 |         fill="currentColor"
163 |         fillRule="evenodd"
[TRUNCATED]
```

packages/ui/src/components/input-otp.tsx
```
1 | "use client";
2 |
3 | import { DashIcon } from "@radix-ui/react-icons";
4 | import { OTPInput, type SlotProps } from "input-otp";
5 | import * as React from "react";
6 | import { cn } from "../utils";
7 |
8 | const InputOTP = React.forwardRef<
9 |   React.ElementRef<typeof OTPInput>,
10 |   React.ComponentPropsWithoutRef<typeof OTPInput>
11 | >(({ className, ...props }, ref) => (
12 |   <OTPInput
13 |     ref={ref}
14 |     containerClassName={cn("flex items-center gap-2", className)}
15 |     {...props}
16 |   />
17 | ));
18 | InputOTP.displayName = "InputOTP";
19 |
20 | const InputOTPGroup = React.forwardRef<
21 |   React.ElementRef<"div">,
22 |   React.ComponentPropsWithoutRef<"div">
23 | >(({ className, ...props }, ref) => (
24 |   <div ref={ref} className={cn("flex items-center", className)} {...props} />
25 | ));
26 | InputOTPGroup.displayName = "InputOTPGroup";
27 |
28 | const InputOTPSlot = React.forwardRef<
29 |   React.ElementRef<"div">,
30 |   SlotProps & React.ComponentPropsWithoutRef<"div">
31 | >(({ char, hasFakeCaret, isActive, className, ...props }, ref) => {
32 |   return (
33 |     <div
34 |       ref={ref}
35 |       className={cn(
36 |         "relative flex h-16 w-16 items-center justify-center border-y border-r border-input text-2xl transition-all first:rounded-l-md first:border-l last:rounded-r-md",
37 |         isActive && "z-10 ring-1 ring-ring",
38 |         className,
39 |       )}
40 |       {...props}
41 |     >
42 |       {char}
43 |       {hasFakeCaret && (
44 |         <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
45 |           <div className="animate-caret-blink h-4 w-px bg-foreground duration-1000" />
46 |         </div>
47 |       )}
48 |     </div>
49 |   );
50 | });
51 | InputOTPSlot.displayName = "InputOTPSlot";
52 |
53 | const InputOTPSeparator = React.forwardRef<
54 |   React.ElementRef<"div">,
55 |   React.ComponentPropsWithoutRef<"div">
56 | >(({ ...props }, ref) => (
57 |   <div ref={ref} {...props}>
58 |     <DashIcon />
59 |   </div>
60 | ));
61 | InputOTPSeparator.displayName = "InputOTPSeparator";
62 |
63 | export { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator };
```

packages/ui/src/components/input.tsx
```
1 | import * as React from "react";
2 | import { cn } from "../utils";
3 |
4 | export interface InputProps
5 |   extends React.InputHTMLAttributes<HTMLInputElement> {}
6 |
7 | const Input = React.forwardRef<HTMLInputElement, InputProps>(
8 |   ({ className, type, ...props }, ref) => {
9 |     return (
10 |       <input
11 |         type={type}
12 |         className={cn(
13 |           "flex h-9 w-full border bg-transparent px-3 py-1 text-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
14 |           className,
15 |         )}
16 |         ref={ref}
17 |         {...props}
18 |       />
19 |     );
20 |   },
21 | );
22 | Input.displayName = "Input";
23 |
24 | export { Input };
```

packages/ui/src/components/label.tsx
```
1 | "use client";
2 |
3 | import * as LabelPrimitive from "@radix-ui/react-label";
4 | import { type VariantProps, cva } from "class-variance-authority";
5 | import * as React from "react";
6 | import { cn } from "../utils";
7 |
8 | const labelVariants = cva(
9 |   "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
10 | );
11 |
12 | const Label = React.forwardRef<
13 |   React.ElementRef<typeof LabelPrimitive.Root>,
14 |   React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> &
15 |     VariantProps<typeof labelVariants>
16 | >(({ className, ...props }, ref) => (
17 |   <LabelPrimitive.Root
18 |     ref={ref}
19 |     className={cn(labelVariants(), className)}
20 |     {...props}
21 |   />
22 | ));
23 | Label.displayName = LabelPrimitive.Root.displayName;
24 |
25 | export { Label };
```

packages/ui/src/components/multiple-selector.tsx
```
1 | "use client";
2 |
3 | import { Command as CommandPrimitive, useCommandState } from "cmdk";
4 | import { X } from "lucide-react";
5 | import * as React from "react";
6 | import { forwardRef, useEffect } from "react";
7 |
8 | import { cn } from "../utils";
9 | import { Badge } from "./badge";
10 | import { Command, CommandGroup, CommandItem, CommandList } from "./command";
11 |
12 | export interface Option {
13 |   value: string;
14 |   label: string;
15 |   create?: boolean;
16 |   disable?: boolean;
17 |   /** fixed option that can't be removed. */
18 |   fixed?: boolean;
19 |   /** Group the options by providing key. */
20 |   [key: string]: string | boolean | undefined;
21 | }
22 | interface GroupOption {
23 |   [key: string]: Option[];
24 | }
25 |
26 | interface MultipleSelectorProps {
27 |   value?: Option[];
28 |   defaultOptions?: Option[];
29 |   /** manually controlled options */
30 |   options?: Option[];
31 |   placeholder?: string;
32 |   /** Loading component. */
33 |   loadingIndicator?: React.ReactNode;
34 |   /** Empty component. */
35 |   emptyIndicator?: React.ReactNode;
36 |   /** Debounce time for async search. Only work with `onSearch`. */
37 |   delay?: number;
38 |   /**
39 |    * Only work with `onSearch` prop. Trigger search when `onFocus`.
40 |    * For example, when user click on the input, it will trigger the search to get initial options.
41 |    **/
42 |   triggerSearchOnFocus?: boolean;
43 |   /** async search */
44 |   onSearch?: (value: string) => Promise<Option[]>;
45 |   /**
46 |    * sync search. This search will not showing loadingIndicator.
47 |    * The rest props are the same as async search.
48 |    * i.e.: creatable, groupBy, delay.
49 |    **/
50 |   onSearchSync?: (value: string) => Option[];
51 |   onChange?: (options: Option[]) => void;
52 |   onCreate?: (option: Option) => void;
53 |   /** Limit the maximum number of selected options. */
54 |   maxSelected?: number;
55 |   /** When the number of selected options exceeds the limit, the onMaxSelected will be called. */
56 |   onMaxSelected?: (maxLimit: number) => void;
57 |   /** Hide the placeholder when there are options selected. */
58 |   hidePlaceholderWhenSelected?: boolean;
59 |   disabled?: boolean;
60 |   /** Group the options base on provided key. */
61 |   groupBy?: string;
62 |   className?: string;
63 |   badgeClassName?: string;
64 |   /**
65 |    * First item selected is a default behavior by cmdk. That is why the default is true.
66 |    * This is a workaround solution by add a dummy item.
67 |    *
68 |    * @reference: https://github.com/pacocoursey/cmdk/issues/171
69 |    */
70 |   selectFirstItem?: boolean;
71 |   /** Allow user to create option when there is no option matched. */
72 |   creatable?: boolean;
73 |   /** Props of `Command` */
74 |   commandProps?: React.ComponentPropsWithoutRef<typeof Command>;
75 |   /** Props of `CommandInput` */
76 |   inputProps?: Omit<
77 |     React.ComponentPropsWithoutRef<typeof CommandPrimitive.Input>,
78 |     "value" | "placeholder" | "disabled"
79 |   >;
80 |   /** hide the clear all button. */
81 |   hideClearAllButton?: boolean;
82 |
83 |   renderOption?: (option: Option) => React.ReactNode;
84 | }
85 |
86 | export interface MultipleSelectorRef {
87 |   selectedValue: Option[];
88 |   input: HTMLInputElement;
89 |   focus: () => void;
90 |   reset: () => void;
91 | }
92 |
93 | export function useDebounce<T>(value: T, delay?: number): T {
94 |   const [debouncedValue, setDebouncedValue] = React.useState<T>(value);
95 |
96 |   useEffect(() => {
97 |     const timer = setTimeout(() => setDebouncedValue(value), delay || 500);
98 |
99 |     return () => {
100 |       clearTimeout(timer);
101 |     };
102 |   }, [value, delay]);
103 |
104 |   return debouncedValue;
105 | }
106 |
107 | function transToGroupOption(options: Option[], groupBy?: string) {
108 |   if (options.length === 0) {
109 |     return {};
110 |   }
111 |   if (!groupBy) {
112 |     return {
113 |       "": options,
114 |     };
115 |   }
116 |
117 |   const groupOption: GroupOption = {};
118 |   options.forEach((option) => {
119 |     const key = (option[groupBy] as string) || "";
120 |     if (!groupOption[key]) {
121 |       groupOption[key] = [];
122 |     }
123 |     groupOption[key].push(option);
124 |   });
125 |   return groupOption;
126 | }
127 |
128 | function removePickedOption(groupOption: GroupOption, picked: Option[]) {
129 |   const cloneOption = JSON.parse(JSON.stringify(groupOption)) as GroupOption;
130 |
131 |   for (const [key, value] of Object.entries(cloneOption)) {
132 |     cloneOption[key] = value.filter(
133 |       (val) => !picked.find((p) => p.value === val.value),
134 |     );
135 |   }
136 |   return cloneOption;
137 | }
138 |
139 | function isOptionsExist(groupOption: GroupOption, targetOption: Option[]) {
140 |   for (const [, value] of Object.entries(groupOption)) {
141 |     if (
142 |       value.some((option) => targetOption.find((p) => p.value === option.value))
143 |     ) {
144 |       return true;
145 |     }
146 |   }
147 |   return false;
148 | }
149 |
150 | /**
151 |  * The `CommandEmpty` of shadcn/ui will cause the cmdk empty not rendering correctly.
152 |  * So we create one and copy the `Empty` implementation from `cmdk`.
153 |  *
[TRUNCATED]
```

packages/ui/src/components/navigation-menu.tsx
```
1 | import { ChevronDownIcon } from "@radix-ui/react-icons";
2 | import * as NavigationMenuPrimitive from "@radix-ui/react-navigation-menu";
3 | import { cva } from "class-variance-authority";
4 | import * as React from "react";
5 | import { cn } from "../utils";
6 |
7 | const NavigationMenu = React.forwardRef<
8 |   React.ElementRef<typeof NavigationMenuPrimitive.Root>,
9 |   React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Root>
10 | >(({ className, children, ...props }, ref) => (
11 |   <NavigationMenuPrimitive.Root
12 |     ref={ref}
13 |     className={cn("relative z-10 flex flex-1 items-center", className)}
14 |     {...props}
15 |   >
16 |     {children}
17 |     <NavigationMenuViewport />
18 |   </NavigationMenuPrimitive.Root>
19 | ));
20 | NavigationMenu.displayName = NavigationMenuPrimitive.Root.displayName;
21 |
22 | const NavigationMenuList = React.forwardRef<
23 |   React.ElementRef<typeof NavigationMenuPrimitive.List>,
24 |   React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.List>
25 | >(({ className, ...props }, ref) => (
26 |   <NavigationMenuPrimitive.List
27 |     ref={ref}
28 |     className={cn(
29 |       "group flex flex-1 list-none items-center justify-center space-x-1",
30 |       className
31 |     )}
32 |     {...props}
33 |   />
34 | ));
35 | NavigationMenuList.displayName = NavigationMenuPrimitive.List.displayName;
36 |
37 | const NavigationMenuItem = NavigationMenuPrimitive.Item;
38 |
39 | const navigationMenuTriggerStyle = cva(
40 |   "h-8 items-center justify-center text-sm font-medium transition-colors px-3 py-2 inline-flex text-secondary-foreground hover:bg-secondary"
41 | );
42 |
43 | const NavigationMenuTrigger = React.forwardRef<
44 |   React.ElementRef<typeof NavigationMenuPrimitive.Trigger>,
45 |   React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Trigger>
46 | >(({ className, children, ...props }, ref) => (
47 |   <NavigationMenuPrimitive.Trigger
48 |     ref={ref}
49 |     className={cn(navigationMenuTriggerStyle(), "group", className)}
50 |     {...props}
51 |   >
52 |     {children}{" "}
53 |     <ChevronDownIcon
54 |       className="relative top-0 ml-1 h-3 w-3 transition duration-300 group-data-[state=open]:rotate-180"
55 |       aria-hidden="true"
56 |     />
57 |   </NavigationMenuPrimitive.Trigger>
58 | ));
59 | NavigationMenuTrigger.displayName = NavigationMenuPrimitive.Trigger.displayName;
60 |
61 | const NavigationMenuContent = React.forwardRef<
62 |   React.ElementRef<typeof NavigationMenuPrimitive.Content>,
63 |   React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Content>
64 | >(({ className, ...props }, ref) => (
65 |   <NavigationMenuPrimitive.Content
66 |     ref={ref}
67 |     className={cn(
68 |       "left-0 top-0 w-full data-[motion^=from-]:animate-in data-[motion^=to-]:animate-out data-[motion^=from-]:fade-in data-[motion^=to-]:fade-out data-[motion=from-end]:slide-in-from-right-52 data-[motion=from-start]:slide-in-from-left-52 data-[motion=to-end]:slide-out-to-right-52 data-[motion=to-start]:slide-out-to-left-52 md:absolute md:w-auto ",
69 |       className
70 |     )}
71 |     {...props}
72 |   />
73 | ));
74 | NavigationMenuContent.displayName = NavigationMenuPrimitive.Content.displayName;
75 |
76 | const NavigationMenuLink = NavigationMenuPrimitive.Link;
77 |
78 | const NavigationMenuViewport = React.forwardRef<
79 |   React.ElementRef<typeof NavigationMenuPrimitive.Viewport>,
80 |   React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Viewport>
81 | >(({ className, ...props }, ref) => (
82 |   <div className={cn("absolute left-0 top-full flex justify-center")}>
83 |     <NavigationMenuPrimitive.Viewport
84 |       className={cn(
85 |         "origin-top-center relative mt-1.5 h-[var(--radix-navigation-menu-viewport-height)] w-full overflow-hidden border border-border bg-popover text-popover-foreground shadow-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-90 md:w-[var(--radix-navigation-menu-viewport-width)]",
86 |         className
87 |       )}
88 |       ref={ref}
89 |       {...props}
90 |     />
91 |   </div>
92 | ));
93 | NavigationMenuViewport.displayName =
94 |   NavigationMenuPrimitive.Viewport.displayName;
95 |
96 | const NavigationMenuIndicator = React.forwardRef<
97 |   React.ElementRef<typeof NavigationMenuPrimitive.Indicator>,
98 |   React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Indicator>
99 | >(({ className, ...props }, ref) => (
100 |   <NavigationMenuPrimitive.Indicator
101 |     ref={ref}
102 |     className={cn(
103 |       "top-full z-[1] flex h-1.5 items-end justify-center overflow-hidden data-[state=visible]:animate-in data-[state=hidden]:animate-out data-[state=hidden]:fade-out data-[state=visible]:fade-in",
104 |       className
105 |     )}
106 |     {...props}
107 |   >
108 |     <div className="relative top-[60%] h-2 w-2 rotate-45 bg-border shadow-md" />
109 |   </NavigationMenuPrimitive.Indicator>
110 | ));
111 | NavigationMenuIndicator.displayName =
112 |   NavigationMenuPrimitive.Indicator.displayName;
113 |
114 | export {
115 |   navigationMenuTriggerStyle,
116 |   NavigationMenu,
117 |   NavigationMenuList,
118 |   NavigationMenuItem,
119 |   NavigationMenuContent,
120 |   NavigationMenuTrigger,
121 |   NavigationMenuLink,
122 |   NavigationMenuIndicator,
123 |   NavigationMenuViewport,
124 | };
```

packages/ui/src/components/popover.tsx
```
1 | "use client";
2 |
3 | import * as PopoverPrimitive from "@radix-ui/react-popover";
4 | import * as React from "react";
5 | import { cn } from "../utils";
6 |
7 | const Popover = PopoverPrimitive.Root;
8 |
9 | const PopoverTrigger = PopoverPrimitive.Trigger;
10 |
11 | const PopoverContent = React.forwardRef<
12 |   React.ElementRef<typeof PopoverPrimitive.Content>,
13 |   React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>
14 | >(({ className, align = "center", sideOffset = 4, ...props }, ref) => (
15 |   <PopoverPrimitive.Portal>
16 |     <PopoverPrimitive.Content
17 |       ref={ref}
18 |       align={align}
19 |       sideOffset={sideOffset}
20 |       className={cn(
21 |         "z-50 w-72 border bg-background p-4 text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
22 |         className
23 |       )}
24 |       {...props}
25 |     />
26 |   </PopoverPrimitive.Portal>
27 | ));
28 | PopoverContent.displayName = PopoverPrimitive.Content.displayName;
29 |
30 | const PopoverContentWithoutPortal = React.forwardRef<
31 |   React.ElementRef<typeof PopoverPrimitive.Content>,
32 |   React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>
33 | >(({ className, align = "center", sideOffset = 4, ...props }, ref) => (
34 |   <PopoverPrimitive.Content
35 |     ref={ref}
36 |     align={align}
37 |     sideOffset={sideOffset}
38 |     className={cn(
39 |       "z-50 w-72 border bg-background p-4 text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
40 |       className
41 |     )}
42 |     {...props}
43 |   />
44 | ));
45 |
46 | export { Popover, PopoverTrigger, PopoverContent, PopoverContentWithoutPortal };
```

packages/ui/src/components/progress.tsx
```
1 | "use client";
2 |
3 | import * as ProgressPrimitive from "@radix-ui/react-progress";
4 | import * as React from "react";
5 | import { cn } from "../utils";
6 |
7 | const Progress = React.forwardRef<
8 |   React.ElementRef<typeof ProgressPrimitive.Root>,
9 |   React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>
10 | >(({ className, value, ...props }, ref) => (
11 |   <ProgressPrimitive.Root
12 |     ref={ref}
13 |     className={cn(
14 |       "relative h-4 w-full overflow-hidden bg-secondary",
15 |       className
16 |     )}
17 |     {...props}
18 |   >
19 |     <ProgressPrimitive.Indicator
20 |       className="h-full w-full flex-1 bg-primary transition-all"
21 |       style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
22 |     />
23 |   </ProgressPrimitive.Root>
24 | ));
25 | Progress.displayName = ProgressPrimitive.Root.displayName;
26 |
27 | export { Progress };
```

packages/ui/src/components/quantity-input.tsx
```
1 | import { Minus, Plus } from "lucide-react";
2 | import * as React from "react";
3 | import { cn } from "../utils";
4 |
5 | type Props = {
6 |   value?: number;
7 |   min?: number;
8 |   max?: number;
9 |   onChange?: (value: number) => void;
10 |   onBlur?: () => void;
11 |   onFocus?: () => void;
12 |   className?: string;
13 | };
14 |
15 | export function QuantityInput({
16 |   value = 0,
17 |   min = Number.NEGATIVE_INFINITY,
18 |   max = Number.POSITIVE_INFINITY,
19 |   onChange,
20 |   onBlur,
21 |   onFocus,
22 |   className,
23 | }: Props) {
24 |   const inputRef = React.useRef<HTMLInputElement>(null);
25 |   const [rawValue, setRawValue] = React.useState(String(value));
26 |
27 |   const handleInput: React.ChangeEventHandler<HTMLInputElement> = ({
28 |     currentTarget: el,
29 |   }) => {
30 |     const input = el.value;
31 |     setRawValue(input);
32 |
33 |     // Check if input can be parsed as a valid number
34 |     const num = Number.parseFloat(input);
35 |     if (!Number.isNaN(num) && min <= num && num <= max) {
36 |       onChange?.(num);
37 |     }
38 |   };
39 |
40 |   const handlePointerDown =
41 |     (diff: number) => (event: React.PointerEvent<HTMLButtonElement>) => {
42 |       if (event.pointerType === "mouse") {
43 |         event.preventDefault();
44 |         inputRef.current?.focus();
45 |       }
46 |       const newVal = Math.min(Math.max(value + diff, min), max);
47 |       onChange?.(newVal);
48 |       setRawValue(String(newVal));
49 |     };
50 |
51 |   return (
52 |     <div
53 |       className={cn(
54 |         "group flex items-stretch transition-[box-shadow] font-mono",
55 |         className,
56 |       )}
57 |     >
58 |       <button
59 |         aria-label="Decrease"
60 |         className="flex items-center pr-[.325em]"
61 |         disabled={value <= min}
62 |         onPointerDown={handlePointerDown(-1)}
63 |         type="button"
64 |         tabIndex={-1}
65 |       >
66 |         <Minus
67 |           className="size-2"
68 |           absoluteStrokeWidth
69 |           strokeWidth={3.5}
70 |           tabIndex={-1}
71 |         />
72 |       </button>
73 |       <div className="relative grid items-center justify-items-center text-center">
74 |         <input
75 |           ref={inputRef}
76 |           className="flex w-8 text-center transition-colors file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 p-0 border-0 h-6 text-xs !bg-transparent border-b border-transparent focus:border-border [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [-moz-appearance:textfield]"
77 |           style={{ fontKerning: "none" }}
78 |           type="number"
79 |           min={min}
80 |           max={max}
81 |           autoComplete="off"
82 |           step={0.1}
83 |           value={rawValue}
84 |           onInput={handleInput}
85 |           onBlur={onBlur}
86 |           onFocus={onFocus}
87 |           inputMode="decimal"
88 |         />
89 |       </div>
90 |       <button
91 |         aria-label="Increase"
92 |         className="flex items-center pl-[.325em]"
93 |         disabled={value >= max}
94 |         onPointerDown={handlePointerDown(1)}
95 |         type="button"
96 |         tabIndex={-1}
97 |       >
98 |         <Plus
99 |           className="size-2"
100 |           absoluteStrokeWidth
101 |           strokeWidth={3.5}
102 |           tabIndex={-1}
103 |         />
104 |       </button>
105 |     </div>
106 |   );
107 | }
```

packages/ui/src/components/radio-group.tsx
```
1 | "use client";
2 |
3 | import { CheckIcon } from "@radix-ui/react-icons";
4 | import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
5 | import * as React from "react";
6 | import { cn } from "../utils";
7 |
8 | const RadioGroup = React.forwardRef<
9 |   React.ElementRef<typeof RadioGroupPrimitive.Root>,
10 |   React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>
11 | >(({ className, ...props }, ref) => {
12 |   return (
13 |     <RadioGroupPrimitive.Root
14 |       className={cn("grid gap-2", className)}
15 |       {...props}
16 |       ref={ref}
17 |     />
18 |   );
19 | });
20 | RadioGroup.displayName = RadioGroupPrimitive.Root.displayName;
21 |
22 | const RadioGroupItem = React.forwardRef<
23 |   React.ElementRef<typeof RadioGroupPrimitive.Item>,
24 |   React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>
25 | >(({ className, children, ...props }, ref) => {
26 |   return (
27 |     <RadioGroupPrimitive.Item
28 |       ref={ref}
29 |       className={cn(
30 |         "aspect-square h-4 w-4 rounded-full border border-primary text-primary focus:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
31 |         className
32 |       )}
33 |       {...props}
34 |     >
35 |       <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
36 |         <CheckIcon className="h-3.5 w-3.5 fill-primary" />
37 |       </RadioGroupPrimitive.Indicator>
38 |     </RadioGroupPrimitive.Item>
39 |   );
40 | });
41 | RadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName;
42 |
43 | export { RadioGroup, RadioGroupItem };
```

packages/ui/src/components/scroll-area.tsx
```
1 | "use client";
2 |
3 | import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area";
4 | import * as React from "react";
5 | import { cn } from "../utils";
6 |
7 | const ScrollArea = React.forwardRef<
8 |   React.ElementRef<typeof ScrollAreaPrimitive.Root>,
9 |   React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Root> & {
10 |     hideScrollbar?: boolean;
11 |   }
12 | >(({ className, children, hideScrollbar, ...props }, ref) => (
13 |   <ScrollAreaPrimitive.Root
14 |     className={cn("relative overflow-hidden", className)}
15 |     {...props}
16 |   >
17 |     <ScrollAreaPrimitive.Viewport
18 |       className="h-full w-full rounded-[inherit]"
19 |       ref={ref}
20 |     >
21 |       {children}
22 |     </ScrollAreaPrimitive.Viewport>
23 |     <ScrollBar className={hideScrollbar ? "hidden" : undefined} />
24 |     <ScrollAreaPrimitive.Corner />
25 |   </ScrollAreaPrimitive.Root>
26 | ));
27 | ScrollArea.displayName = ScrollAreaPrimitive.Root.displayName;
28 |
29 | const ScrollBar = React.forwardRef<
30 |   React.ElementRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>,
31 |   React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>
32 | >(({ className, orientation = "vertical", ...props }, ref) => (
33 |   <ScrollAreaPrimitive.ScrollAreaScrollbar
34 |     ref={ref}
35 |     orientation={orientation}
36 |     className={cn(
37 |       "flex touch-none select-none transition-colors",
38 |       orientation === "vertical" &&
39 |         "h-full w-2.5 border-l border-l-transparent p-[1px]",
40 |       orientation === "horizontal" &&
41 |         "h-2.5 flex-col border-t border-t-transparent p-[1px]",
42 |       className,
43 |     )}
44 |     {...props}
45 |   >
46 |     <ScrollAreaPrimitive.ScrollAreaThumb
47 |       className={cn(
48 |         "relative rounded-full bg-border",
49 |         orientation === "vertical" && "flex-1",
50 |       )}
51 |     />
52 |   </ScrollAreaPrimitive.ScrollAreaScrollbar>
53 | ));
54 | ScrollBar.displayName = ScrollAreaPrimitive.ScrollAreaScrollbar.displayName;
55 |
56 | export { ScrollArea, ScrollBar };
```

packages/ui/src/components/select.tsx
```
1 | "use client";
2 |
3 | import {
4 |   CheckIcon,
5 |   ChevronDownIcon,
6 |   ChevronUpIcon,
7 | } from "@radix-ui/react-icons";
8 | import * as SelectPrimitive from "@radix-ui/react-select";
9 | import * as React from "react";
10 | import { cn } from "../utils";
11 | import { Icons } from "./icons";
12 |
13 | const Select = SelectPrimitive.Root;
14 |
15 | const SelectGroup = SelectPrimitive.Group;
16 |
17 | const SelectValue = SelectPrimitive.Value;
18 |
19 | const SelectTrigger = React.forwardRef<
20 |   React.ElementRef<typeof SelectPrimitive.Trigger>,
21 |   React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger> & {
22 |     hideIcon?: boolean;
23 |   }
24 | >(({ className, children, hideIcon = false, ...props }, ref) => (
25 |   <SelectPrimitive.Trigger
26 |     ref={ref}
27 |     className={cn(
28 |       "!flex h-9 w-full items-center justify-between whitespace-nowrap border border-border bg-transparent px-3 py-2 text-sm font-normal placeholder:text-muted-foreground focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1",
29 |       className,
30 |     )}
31 |     {...props}
32 |   >
33 |     <span className="line-clamp-1">{children}</span>
34 |     {!hideIcon && (
35 |       <div className="h-4 w-4">
36 |         <SelectPrimitive.Icon asChild>
37 |           <Icons.ChevronDown className="h-4 w-4" />
38 |         </SelectPrimitive.Icon>
39 |       </div>
40 |     )}
41 |   </SelectPrimitive.Trigger>
42 | ));
43 | SelectTrigger.displayName = SelectPrimitive.Trigger.displayName;
44 |
45 | const SelectScrollUpButton = React.forwardRef<
46 |   React.ElementRef<typeof SelectPrimitive.ScrollUpButton>,
47 |   React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollUpButton>
48 | >(({ className, ...props }, ref) => (
49 |   <SelectPrimitive.ScrollUpButton
50 |     ref={ref}
51 |     className={cn(
52 |       "flex cursor-default items-center justify-center py-1",
53 |       className,
54 |     )}
55 |     {...props}
56 |   >
57 |     <ChevronUpIcon />
58 |   </SelectPrimitive.ScrollUpButton>
59 | ));
60 | SelectScrollUpButton.displayName = SelectPrimitive.ScrollUpButton.displayName;
61 |
62 | const SelectScrollDownButton = React.forwardRef<
63 |   React.ElementRef<typeof SelectPrimitive.ScrollDownButton>,
64 |   React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollDownButton>
65 | >(({ className, ...props }, ref) => (
66 |   <SelectPrimitive.ScrollDownButton
67 |     ref={ref}
68 |     className={cn(
69 |       "flex cursor-default items-center justify-center py-1",
70 |       className,
71 |     )}
72 |     {...props}
73 |   >
74 |     <ChevronDownIcon />
75 |   </SelectPrimitive.ScrollDownButton>
76 | ));
77 | SelectScrollDownButton.displayName =
78 |   SelectPrimitive.ScrollDownButton.displayName;
79 |
80 | const SelectContent = React.forwardRef<
81 |   React.ElementRef<typeof SelectPrimitive.Content>,
82 |   React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
83 | >(({ className, children, position = "popper", ...props }, ref) => (
84 |   <SelectPrimitive.Portal>
85 |     <SelectPrimitive.Content
86 |       ref={ref}
87 |       className={cn(
88 |         "relative z-50 max-h-96 min-w-[8rem] overflow-hidden border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
89 |         position === "popper" &&
90 |           "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
91 |         className,
92 |       )}
93 |       position={position}
94 |       {...props}
95 |     >
96 |       <SelectScrollUpButton />
97 |       <SelectPrimitive.Viewport
98 |         className={cn(
99 |           "p-1",
100 |           position === "popper" &&
101 |             "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]",
102 |         )}
103 |       >
104 |         {children}
105 |       </SelectPrimitive.Viewport>
106 |       <SelectScrollDownButton />
107 |     </SelectPrimitive.Content>
108 |   </SelectPrimitive.Portal>
109 | ));
110 | SelectContent.displayName = SelectPrimitive.Content.displayName;
111 |
112 | const SelectLabel = React.forwardRef<
113 |   React.ElementRef<typeof SelectPrimitive.Label>,
114 |   React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label>
115 | >(({ className, ...props }, ref) => (
116 |   <SelectPrimitive.Label
117 |     ref={ref}
118 |     className={cn("px-2 py-1.5 text-sm font-medium", className)}
119 |     {...props}
120 |   />
121 | ));
122 | SelectLabel.displayName = SelectPrimitive.Label.displayName;
123 |
124 | const SelectItem = React.forwardRef<
125 |   React.ElementRef<typeof SelectPrimitive.Item>,
126 |   React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
127 | >(({ className, children, ...props }, ref) => (
128 |   <SelectPrimitive.Item
129 |     ref={ref}
130 |     className={cn(
131 |       "relative flex w-full cursor-default select-none items-center py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
132 |       className,
133 |     )}
134 |     {...props}
135 |   >
[TRUNCATED]
```

packages/ui/src/components/separator.tsx
```
1 | "use client";
2 |
3 | import * as SeparatorPrimitive from "@radix-ui/react-separator";
4 | import * as React from "react";
5 | import { cn } from "../utils";
6 |
7 | const Separator = React.forwardRef<
8 |   React.ElementRef<typeof SeparatorPrimitive.Root>,
9 |   React.ComponentPropsWithoutRef<typeof SeparatorPrimitive.Root>
10 | >(
11 |   (
12 |     { className, orientation = "horizontal", decorative = true, ...props },
13 |     ref
14 |   ) => (
15 |     <SeparatorPrimitive.Root
16 |       ref={ref}
17 |       decorative={decorative}
18 |       orientation={orientation}
19 |       className={cn(
20 |         "shrink-0 bg-border",
21 |         orientation === "horizontal" ? "h-[1px] w-full" : "h-full w-[1px]",
22 |         className
23 |       )}
24 |       {...props}
25 |     />
26 |   )
27 | );
28 | Separator.displayName = SeparatorPrimitive.Root.displayName;
29 |
30 | export { Separator };
```

packages/ui/src/components/sheet.tsx
```
1 | "use client";
2 |
3 | import * as SheetPrimitive from "@radix-ui/react-dialog";
4 | import { type VariantProps, cva } from "class-variance-authority";
5 | import * as React from "react";
6 | import { cn } from "../utils";
7 |
8 | const Sheet = SheetPrimitive.Root;
9 |
10 | const SheetTrigger = SheetPrimitive.Trigger;
11 |
12 | const SheetClose = SheetPrimitive.Close;
13 |
14 | const SheetPortal = SheetPrimitive.Portal;
15 |
16 | const SheetOverlay = React.forwardRef<
17 |   React.ElementRef<typeof SheetPrimitive.Overlay>,
18 |   React.ComponentPropsWithoutRef<typeof SheetPrimitive.Overlay>
19 | >(({ className, ...props }, ref) => (
20 |   <SheetPrimitive.Overlay
21 |     className={cn(
22 |       "fixed inset-0 z-50 bg-[#f6f6f3]/60 dark:bg-black/60 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
23 |       className,
24 |     )}
25 |     {...props}
26 |     ref={ref}
27 |   />
28 | ));
29 | SheetOverlay.displayName = SheetPrimitive.Overlay.displayName;
30 |
31 | const sheetVariants = cva(
32 |   "fixed z-50 gap-4 transition ease-in-out data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:duration-200 data-[state=open]:duration-300",
33 |   {
34 |     variants: {
35 |       side: {
36 |         top: "inset-x-0 top-0 data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top",
37 |         bottom:
38 |           "inset-x-0 bottom-0 data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom",
39 |         left: "inset-y-0 left-0 h-full w-3/4 data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left sm:max-w-sm",
40 |         right:
41 |           "inset-y-0 right-0 h-full w-3/4 data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right sm:max-w-[520px]",
42 |       },
43 |     },
44 |     defaultVariants: {
45 |       side: "right",
46 |     },
47 |   },
48 | );
49 |
50 | interface SheetContentProps
51 |   extends React.ComponentPropsWithoutRef<typeof SheetPrimitive.Content>,
52 |     VariantProps<typeof sheetVariants> {
53 |   stack?: boolean;
54 | }
55 |
56 | const SheetContent = React.forwardRef<
57 |   React.ElementRef<typeof SheetPrimitive.Content>,
58 |   SheetContentProps
59 | >(
60 |   (
61 |     { side = "right", stack = false, className, children, title, ...props },
62 |     ref,
63 |   ) => (
64 |     <SheetPortal>
65 |       <SheetOverlay />
66 |       <SheetPrimitive.Content
67 |         onOpenAutoFocus={(e) => e.preventDefault()}
68 |         ref={ref}
69 |         className={cn("md:p-4", sheetVariants({ side }))}
70 |         aria-describedby={props["aria-describedby"] || undefined}
71 |         {...props}
72 |       >
73 |         <div
74 |           className={cn(
75 |             "border w-full h-full bg-[#FAFAF9] dark:bg-[#121212] p-6 relative overflow-hidden",
76 |             className,
77 |           )}
78 |         >
79 |           <SheetTitle className="sr-only">{title}</SheetTitle>
80 |           {children}
81 |         </div>
82 |       </SheetPrimitive.Content>
83 |     </SheetPortal>
84 |   ),
85 | );
86 | SheetContent.displayName = SheetPrimitive.Content.displayName;
87 |
88 | const SheetHeader = ({
89 |   className,
90 |   ...props
91 | }: React.HTMLAttributes<HTMLDivElement>) => (
92 |   <div
93 |     className={cn(
94 |       "flex flex-col space-y-2 text-center sm:text-left",
95 |       className,
96 |     )}
97 |     {...props}
98 |   />
99 | );
100 | SheetHeader.displayName = "SheetHeader";
101 |
102 | const SheetFooter = ({
103 |   className,
104 |   ...props
105 | }: React.HTMLAttributes<HTMLDivElement>) => (
106 |   <div
107 |     className={cn(
108 |       "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
109 |       className,
110 |     )}
111 |     {...props}
112 |   />
113 | );
114 | SheetFooter.displayName = "SheetFooter";
115 |
116 | const SheetTitle = React.forwardRef<
117 |   React.ElementRef<typeof SheetPrimitive.Title>,
118 |   React.ComponentPropsWithoutRef<typeof SheetPrimitive.Title>
119 | >(({ className, ...props }, ref) => (
120 |   <SheetPrimitive.Title
121 |     ref={ref}
122 |     className={cn("text-lg font-semibold text-foreground", className)}
123 |     {...props}
124 |   />
125 | ));
126 | SheetTitle.displayName = SheetPrimitive.Title.displayName;
127 |
128 | const SheetDescription = React.forwardRef<
129 |   React.ElementRef<typeof SheetPrimitive.Description>,
130 |   React.ComponentPropsWithoutRef<typeof SheetPrimitive.Description>
131 | >(({ className, ...props }, ref) => (
132 |   <SheetPrimitive.Description
133 |     ref={ref}
134 |     className={cn("text-sm text-muted-foreground", className)}
135 |     {...props}
136 |   />
137 | ));
138 | SheetDescription.displayName = SheetPrimitive.Description.displayName;
139 |
140 | export {
141 |   Sheet,
142 |   SheetPortal,
143 |   SheetOverlay,
144 |   SheetTrigger,
145 |   SheetClose,
146 |   SheetContent,
147 |   SheetHeader,
148 |   SheetFooter,
149 |   SheetTitle,
150 |   SheetDescription,
151 | };
```

packages/ui/src/components/skeleton.tsx
```
1 | import type * as React from "react";
2 | import { cn } from "../utils";
3 |
4 | function Skeleton({
5 |   className,
6 |   ...props
7 | }: React.HTMLAttributes<HTMLDivElement>) {
8 |   return (
9 |     <div className={cn("animate-pulse bg-primary/10", className)} {...props} />
10 |   );
11 | }
12 |
13 | export { Skeleton };
```

packages/ui/src/components/slider.tsx
```
1 | "use client";
2 |
3 | import * as SliderPrimitive from "@radix-ui/react-slider";
4 | import * as React from "react";
5 | import { cn } from "../utils";
6 |
7 | const Slider = React.forwardRef<
8 |   React.ElementRef<typeof SliderPrimitive.Root>,
9 |   React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
10 | >(({ className, ...props }, ref) => (
11 |   <SliderPrimitive.Root
12 |     ref={ref}
13 |     className={cn(
14 |       "relative flex w-full touch-none select-none items-center",
15 |       className,
16 |     )}
17 |     {...props}
18 |   >
19 |     <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-secondary">
20 |       <SliderPrimitive.Range className="absolute h-full bg-primary" />
21 |     </SliderPrimitive.Track>
22 |     <SliderPrimitive.Thumb className="block h-5 w-5 rounded-full border-2 border-primary bg-background ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50" />
23 |     <SliderPrimitive.Thumb className="block h-5 w-5 rounded-full border-2 border-primary bg-background ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50" />
24 |   </SliderPrimitive.Root>
25 | ));
26 | Slider.displayName = SliderPrimitive.Root.displayName;
27 |
28 | export { Slider };
```

packages/ui/src/components/spinner.tsx
```
1 | const bars = Array(12).fill(0);
2 |
3 | export const Spinner = ({ size = 16 }) => {
4 |   return (
5 |     <div className="loading-parent">
6 |       <div
7 |         className="loading-wrapper"
8 |         data-visible
9 |         // @ts-ignore
10 |         style={{ "--spinner-size": `${size}px` }}
11 |       >
12 |         <div className="spinner">
13 |           {bars.map((_, i) => (
14 |             <div className="loading-bar" key={`spinner-bar-${i.toString()}`} />
15 |           ))}
16 |         </div>
17 |       </div>
18 |     </div>
19 |   );
20 | };
```

packages/ui/src/components/submit-button.tsx
```
1 | import { Loader2 } from "lucide-react";
2 | import { cn } from "../utils";
3 | import { Button, type ButtonProps } from "./button";
4 |
5 | export function SubmitButton({
6 |   children,
7 |   isSubmitting,
8 |   disabled,
9 |   ...props
10 | }: {
11 |   children: React.ReactNode;
12 |   isSubmitting: boolean;
13 |   disabled?: boolean;
14 | } & ButtonProps) {
15 |   return (
16 |     <Button
17 |       disabled={isSubmitting || disabled}
18 |       {...props}
19 |       className={cn(props.className, "relative")}
20 |     >
21 |       <span className={cn({ "opacity-0": isSubmitting })}>{children}</span>
22 |
23 |       {isSubmitting && (
24 |         <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
25 |           <Loader2 className="h-4 w-4 animate-spin" />
26 |         </span>
27 |       )}
28 |     </Button>
29 |   );
30 | }
```

packages/ui/src/components/switch.tsx
```
1 | "use client";
2 |
3 | import * as SwitchPrimitives from "@radix-ui/react-switch";
4 | import * as React from "react";
5 | import { cn } from "../utils";
6 |
7 | const Switch = React.forwardRef<
8 |   React.ElementRef<typeof SwitchPrimitives.Root>,
9 |   React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>
10 | >(({ className, ...props }, ref) => (
11 |   <SwitchPrimitives.Root
12 |     className={cn(
13 |       "peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input",
14 |       className
15 |     )}
16 |     {...props}
17 |     ref={ref}
18 |   >
19 |     <SwitchPrimitives.Thumb
20 |       className={cn(
21 |         "pointer-events-none block h-5 w-5 rounded-full bg-background ring-0 transition-transform data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0"
22 |       )}
23 |     />
24 |   </SwitchPrimitives.Root>
25 | ));
26 | Switch.displayName = SwitchPrimitives.Root.displayName;
27 |
28 | export { Switch };
```

packages/ui/src/components/table.tsx
```
1 | import * as React from "react";
2 | import { cn } from "../utils";
3 |
4 | const Table = React.forwardRef<
5 |   HTMLTableElement,
6 |   React.HTMLAttributes<HTMLTableElement>
7 | >(({ className, ...props }, ref) => (
8 |   <table
9 |     ref={ref}
10 |     className={cn("w-full caption-bottom text-sm relative", className)}
11 |     {...props}
12 |   />
13 | ));
14 | Table.displayName = "Table";
15 |
16 | const TableHeader = React.forwardRef<
17 |   HTMLTableSectionElement,
18 |   React.HTMLAttributes<HTMLTableSectionElement>
19 | >(({ className, ...props }, ref) => (
20 |   <thead
21 |     ref={ref}
22 |     className={cn("[&_tr]:border-b border", className)}
23 |     {...props}
24 |   />
25 | ));
26 | TableHeader.displayName = "TableHeader";
27 |
28 | const TableBody = React.forwardRef<
29 |   HTMLTableSectionElement,
30 |   React.HTMLAttributes<HTMLTableSectionElement>
31 | >(({ className, ...props }, ref) => (
32 |   <tbody
33 |     ref={ref}
34 |     className={cn("[&_tr:last-child]:border-0 border", className)}
35 |     {...props}
36 |   />
37 | ));
38 | TableBody.displayName = "TableBody";
39 |
40 | const TableFooter = React.forwardRef<
41 |   HTMLTableSectionElement,
42 |   React.HTMLAttributes<HTMLTableSectionElement>
43 | >(({ className, ...props }, ref) => (
44 |   <tfoot
45 |     ref={ref}
46 |     className={cn("bg-primary font-medium text-primary-foreground", className)}
47 |     {...props}
48 |   />
49 | ));
50 | TableFooter.displayName = "TableFooter";
51 |
52 | const TableRow = React.forwardRef<
53 |   HTMLTableRowElement,
54 |   React.HTMLAttributes<HTMLTableRowElement>
55 | >(({ className, ...props }, ref) => (
56 |   <tr ref={ref} className={cn("border-b", className)} {...props} />
57 | ));
58 | TableRow.displayName = "TableRow";
59 |
60 | const TableHead = React.forwardRef<
61 |   HTMLTableCellElement,
62 |   React.ThHTMLAttributes<HTMLTableCellElement>
63 | >(({ className, ...props }, ref) => (
64 |   <th
65 |     ref={ref}
66 |     className={cn(
67 |       "h-12 px-4 text-left align-middle font-semibold [&:has([role=checkbox])]:pr-0 border-r last:border-none w-auto",
68 |       className
69 |     )}
70 |     {...props}
71 |   />
72 | ));
73 | TableHead.displayName = "TableHead";
74 |
75 | const TableCell = React.forwardRef<
76 |   HTMLTableCellElement,
77 |   React.TdHTMLAttributes<HTMLTableCellElement>
78 | >(({ className, ...props }, ref) => (
79 |   <td
80 |     ref={ref}
81 |     className={cn(
82 |       "px-4 py-2 align-middle [&:has([role=checkbox])]:pr-0 border-r last:border-none",
83 |       className
84 |     )}
85 |     {...props}
86 |   />
87 | ));
88 | TableCell.displayName = "TableCell";
89 |
90 | const TableCaption = React.forwardRef<
91 |   HTMLTableCaptionElement,
92 |   React.HTMLAttributes<HTMLTableCaptionElement>
93 | >(({ className, ...props }, ref) => (
94 |   <caption
95 |     ref={ref}
96 |     className={cn("mt-4 text-sm text-muted-foreground", className)}
97 |     {...props}
98 |   />
99 | ));
100 | TableCaption.displayName = "TableCaption";
101 |
102 | export {
103 |   Table,
104 |   TableHeader,
105 |   TableBody,
106 |   TableFooter,
107 |   TableHead,
108 |   TableRow,
109 |   TableCell,
110 |   TableCaption,
111 | };
```

packages/ui/src/components/tabs.tsx
```
1 | "use client";
2 |
3 | import * as TabsPrimitive from "@radix-ui/react-tabs";
4 | import * as React from "react";
5 | import { cn } from "../utils";
6 |
7 | const Tabs = TabsPrimitive.Root;
8 |
9 | const TabsList = React.forwardRef<
10 |   React.ElementRef<typeof TabsPrimitive.List>,
11 |   React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
12 | >(({ className, ...props }, ref) => (
13 |   <TabsPrimitive.List
14 |     ref={ref}
15 |     className={cn(
16 |       "inline-flex h-10 items-center justify-center bg-accent p-1 text-muted-foreground",
17 |       className
18 |     )}
19 |     {...props}
20 |   />
21 | ));
22 | TabsList.displayName = TabsPrimitive.List.displayName;
23 |
24 | const TabsTrigger = React.forwardRef<
25 |   React.ElementRef<typeof TabsPrimitive.Trigger>,
26 |   React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
27 | >(({ className, ...props }, ref) => (
28 |   <TabsPrimitive.Trigger
29 |     ref={ref}
30 |     className={cn(
31 |       "inline-flex items-center justify-center whitespace-nowrap px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground",
32 |       className
33 |     )}
34 |     {...props}
35 |   />
36 | ));
37 | TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;
38 |
39 | const TabsContent = React.forwardRef<
40 |   React.ElementRef<typeof TabsPrimitive.Content>,
41 |   React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
42 | >(({ className, ...props }, ref) => (
43 |   <TabsPrimitive.Content
44 |     ref={ref}
45 |     className={cn(
46 |       "mt-2 ring-offset-background focus-visible:outline-none",
47 |       className
48 |     )}
49 |     {...props}
50 |   />
51 | ));
52 | TabsContent.displayName = TabsPrimitive.Content.displayName;
53 |
54 | export { Tabs, TabsList, TabsTrigger, TabsContent };
```

packages/ui/src/components/textarea.tsx
```
1 | import * as React from "react";
2 | import { cn } from "../utils";
3 |
4 | export interface TextareaProps
5 |   extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}
6 |
7 | const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
8 |   ({ className, ...props }, ref) => {
9 |     return (
10 |       <textarea
11 |         className={cn(
12 |           "flex min-h-[60px] w-full border bg-transparent px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
13 |           className
14 |         )}
15 |         ref={ref}
16 |         {...props}
17 |       />
18 |     );
19 |   }
20 | );
21 | Textarea.displayName = "Textarea";
22 |
23 | export { Textarea };
```

packages/ui/src/components/time-range-input.tsx
```
1 | "use client";
2 |
3 | import { differenceInMinutes, parse } from "date-fns";
4 | import { useEffect, useState } from "react";
5 | import { Icons } from "./icons";
6 |
7 | export function TimeRangeInput({
8 |   value,
9 |   onChange,
10 | }: {
11 |   value: { start: string; end: string };
12 |   onChange: (value: { start: string; end: string }) => void;
13 | }) {
14 |   const [startTime, setStartTime] = useState(value.start);
15 |   const [endTime, setEndTime] = useState(value.end);
16 |   const [duration, setDuration] = useState("");
17 |
18 |   useEffect(() => {
19 |     setStartTime(value.start);
20 |     setEndTime(value.end);
21 |   }, [value]);
22 |
23 |   useEffect(() => {
24 |     if (!startTime || !endTime) {
25 |       return;
26 |     }
27 |
28 |     const start = parse(startTime, "HH:mm", new Date());
29 |     const end = parse(endTime, "HH:mm", new Date());
30 |     const diff = differenceInMinutes(end, start);
31 |     const hours = Math.floor(diff / 60);
32 |     const minutes = diff % 60;
33 |     setDuration(`${hours}h ${minutes}min`);
34 |   }, [startTime, endTime]);
35 |
36 |   return (
37 |     <div className="flex items-center w-full border border-border px-4 py-2">
38 |       <div className="flex items-center space-x-2 flex-1">
39 |         <Icons.Time className="w-5 h-5 text-[#878787]" />
40 |         <input
41 |           type="time"
42 |           value={startTime}
43 |           onChange={(e) => {
44 |             setStartTime(e.target.value);
45 |             onChange({ ...value, start: e.target.value });
46 |           }}
47 |           className="bg-transparent focus:outline-none text-sm"
48 |         />
49 |       </div>
50 |       <div className="flex items-center justify-center flex-shrink-0 mx-4">
51 |         <Icons.ArrowRightAlt className="w-5 h-5 text-[#878787]" />
52 |       </div>
53 |       <div className="flex items-center space-x-2 flex-1 justify-end">
54 |         <input
55 |           type="time"
56 |           value={endTime}
57 |           onChange={(e) => {
58 |             setEndTime(e.target.value);
59 |             onChange({ ...value, end: e.target.value });
60 |           }}
61 |           className="bg-transparent focus:outline-none text-sm"
62 |         />
63 |         <span className="text-[#878787] text-sm">{duration}</span>
64 |       </div>
65 |     </div>
66 |   );
67 | }
```

packages/ui/src/components/toast.tsx
```
1 | import * as ToastPrimitives from "@radix-ui/react-toast";
2 | import { type VariantProps, cva } from "class-variance-authority";
3 | import { X } from "lucide-react";
4 | import * as React from "react";
5 | import { cn } from "../utils";
6 |
7 | const ToastProvider = ToastPrimitives.Provider;
8 |
9 | const ToastViewport = React.forwardRef<
10 |   React.ElementRef<typeof ToastPrimitives.Viewport>,
11 |   React.ComponentPropsWithoutRef<typeof ToastPrimitives.Viewport>
12 | >(({ className, ...props }, ref) => (
13 |   <ToastPrimitives.Viewport
14 |     ref={ref}
15 |     className={cn(
16 |       "fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:left-0 sm:top-auto sm:flex-col md:max-w-[420px]",
17 |       className,
18 |     )}
19 |     {...props}
20 |   />
21 | ));
22 | ToastViewport.displayName = ToastPrimitives.Viewport.displayName;
23 |
24 | const toastVariants = cva(
25 |   "dark:bg-secondary text-foreground border bg-[#F6F6F3] group pointer-events-auto relative flex w-full items-center overflow-hidden border p-5 pr-5 transition-all data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-left-full data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-bottom-full",
26 |   {
27 |     variants: {
28 |       variant: {
29 |         default: "",
30 |         error: "",
31 |         success: "",
32 |         progress: "",
33 |         spinner: "",
34 |         ai: "",
35 |         destructive:
36 |           "destructive group border-destructive bg-destructive text-destructive-foreground",
37 |       },
38 |     },
39 |     defaultVariants: {
40 |       variant: "default",
41 |     },
42 |   },
43 | );
44 |
45 | const Toast = React.forwardRef<
46 |   React.ElementRef<typeof ToastPrimitives.Root>,
47 |   React.ComponentPropsWithoutRef<typeof ToastPrimitives.Root> &
48 |     VariantProps<typeof toastVariants>
49 | >(({ className, variant, ...props }, ref) => {
50 |   return (
51 |     <ToastPrimitives.Root
52 |       ref={ref}
53 |       className={cn(toastVariants({ variant }), className)}
54 |       {...props}
55 |     />
56 |   );
57 | });
58 | Toast.displayName = ToastPrimitives.Root.displayName;
59 |
60 | const ToastAction = React.forwardRef<
61 |   React.ElementRef<typeof ToastPrimitives.Action>,
62 |   React.ComponentPropsWithoutRef<typeof ToastPrimitives.Action>
63 | >(({ className, ...props }, ref) => (
64 |   <ToastPrimitives.Action
65 |     ref={ref}
66 |     className={cn(
67 |       "inline-flex h-8 shrink-0 items-center justify-center border bg-transparent px-3 text-sm font-medium ring-offset-background transition-colors hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 group-[.destructive]:border-muted/40 group-[.destructive]:hover:border-destructive/30 group-[.destructive]:hover:bg-destructive group-[.destructive]:hover:text-destructive-foreground group-[.destructive]:focus:ring-destructive",
68 |       className,
69 |     )}
70 |     {...props}
71 |   />
72 | ));
73 | ToastAction.displayName = ToastPrimitives.Action.displayName;
74 |
75 | const ToastClose = React.forwardRef<
76 |   React.ElementRef<typeof ToastPrimitives.Close>,
77 |   React.ComponentPropsWithoutRef<typeof ToastPrimitives.Close>
78 | >(({ className, ...props }, ref) => (
79 |   <ToastPrimitives.Close
80 |     ref={ref}
81 |     className={cn(
82 |       "absolute right-2 top-2 p-1 text-foreground/50 opacity-0 transition-opacity hover:text-foreground focus:opacity-100 focus:outline-none focus:ring-2 group-hover:opacity-100 group-[.destructive]:text-red-300 group-[.destructive]:hover:text-red-50 group-[.destructive]:focus:ring-red-400 group-[.destructive]:focus:ring-offset-red-600",
83 |       className,
84 |     )}
85 |     toast-close=""
86 |     {...props}
87 |   >
88 |     <X className="h-4 w-4" />
89 |   </ToastPrimitives.Close>
90 | ));
91 | ToastClose.displayName = ToastPrimitives.Close.displayName;
92 |
93 | const ToastTitle = React.forwardRef<
94 |   React.ElementRef<typeof ToastPrimitives.Title>,
95 |   React.ComponentPropsWithoutRef<typeof ToastPrimitives.Title>
96 | >(({ className, ...props }, ref) => (
97 |   <ToastPrimitives.Title
98 |     ref={ref}
99 |     className={cn("text-sm", className)}
100 |     {...props}
101 |   />
102 | ));
103 | ToastTitle.displayName = ToastPrimitives.Title.displayName;
104 |
105 | const ToastDescription = React.forwardRef<
106 |   React.ElementRef<typeof ToastPrimitives.Description>,
107 |   React.ComponentPropsWithoutRef<typeof ToastPrimitives.Description>
108 | >(({ className, ...props }, ref) => (
109 |   <ToastPrimitives.Description
110 |     ref={ref}
111 |     className={cn("text-xs text-[#878787]", className)}
112 |     {...props}
113 |   />
114 | ));
115 | ToastDescription.displayName = ToastPrimitives.Description.displayName;
116 |
117 | type ToastProps = React.ComponentPropsWithoutRef<typeof Toast>;
118 |
119 | type ToastActionElement = React.ReactElement<typeof ToastAction>;
120 |
121 | export {
122 |   type ToastProps,
123 |   type ToastActionElement,
124 |   ToastProvider,
125 |   ToastViewport,
126 |   Toast,
127 |   ToastTitle,
128 |   ToastDescription,
129 |   ToastClose,
130 |   ToastAction,
131 | };
```

packages/ui/src/components/toaster.tsx
```
1 | "use client";
2 |
3 | import { Loader2 } from "lucide-react";
4 | import { Icons } from "./icons";
5 | import { Progress } from "./progress";
6 | import {
7 |   Toast,
8 |   ToastClose,
9 |   ToastDescription,
10 |   ToastProvider,
11 |   ToastTitle,
12 |   ToastViewport,
13 | } from "./toast";
14 | import { useToast } from "./use-toast";
15 |
16 | export function Toaster() {
17 |   const { toasts } = useToast();
18 |
19 |   return (
20 |     <ToastProvider>
21 |       {toasts.map(
22 |         ({
23 |           id,
24 |           title,
25 |           description,
26 |           progress = 0,
27 |           action,
28 |           footer,
29 |           ...props
30 |         }) => {
31 |           return (
32 |             <Toast key={id} {...props} className="flex flex-col">
33 |               <div className="flex w-full">
34 |                 <div className="space-y-2 w-full justify-center">
35 |                   <div className="flex space-x-2 justify-between">
36 |                     <div className="flex space-x-2 items-center">
37 |                       {props?.variant && (
38 |                         <div className="w-[20px] h-[20px] flex items-center">
39 |                           {props.variant === "ai" && (
40 |                             <Icons.AI className="text-[#0064D9]" />
41 |                           )}
42 |                           {props?.variant === "success" && <Icons.Check />}
43 |                           {props?.variant === "error" && (
44 |                             <Icons.Error className="text-[#FF3638]" />
45 |                           )}
46 |                           {props?.variant === "progress" && (
47 |                             <Loader2 className="h-4 w-4 animate-spin" />
48 |                           )}
49 |                           {props?.variant === "spinner" && (
50 |                             <Loader2 className="h-4 w-4 animate-spin" />
51 |                           )}
52 |                         </div>
53 |                       )}
54 |                       <div>{title && <ToastTitle>{title}</ToastTitle>}</div>
55 |                     </div>
56 |
57 |                     <div>
58 |                       {props?.variant === "progress" && (
59 |                         <span className="text-sm text-[#878787]">
60 |                           {progress}%
61 |                         </span>
62 |                       )}
63 |                     </div>
64 |                   </div>
65 |
66 |                   {props.variant === "progress" && (
67 |                     <Progress
68 |                       value={progress}
69 |                       className="w-full rounded-none h-[3px] bg-border"
70 |                     />
71 |                   )}
72 |
73 |                   {description && (
74 |                     <ToastDescription>{description}</ToastDescription>
75 |                   )}
76 |                 </div>
77 |                 {action}
78 |                 <ToastClose />
79 |               </div>
80 |
81 |               <div className="w-full flex justify-end">{footer}</div>
82 |             </Toast>
83 |           );
84 |         },
85 |       )}
86 |       <ToastViewport />
87 |     </ToastProvider>
88 |   );
89 | }
```

packages/ui/src/components/tooltip.tsx
```
1 | "use client";
2 |
3 | import * as TooltipPrimitive from "@radix-ui/react-tooltip";
4 | import * as React from "react";
5 | import { cn } from "../utils";
6 |
7 | const TooltipProvider = TooltipPrimitive.Provider;
8 |
9 | const Tooltip = TooltipPrimitive.Root;
10 |
11 | const TooltipTrigger = TooltipPrimitive.Trigger;
12 |
13 | const TooltipContent = React.forwardRef<
14 |   React.ElementRef<typeof TooltipPrimitive.Content>,
15 |   React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
16 | >(({ className, sideOffset = 4, ...props }, ref) => (
17 |   <TooltipPrimitive.Portal>
18 |     <TooltipPrimitive.Content
19 |       ref={ref}
20 |       sideOffset={sideOffset}
21 |       className={cn(
22 |         "z-50 overflow-hidden border bg-background backdrop-filter dark:border-[#2C2C2C] backdrop-blur-lg dark:bg-[#1A1A1A]/95 px-4 py-3 text-sm text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
23 |         className,
24 |       )}
25 |       {...props}
26 |     />
27 |   </TooltipPrimitive.Portal>
28 | ));
29 | TooltipContent.displayName = TooltipPrimitive.Content.displayName;
30 |
31 | export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider };
```

packages/ui/src/components/use-toast.tsx
```
1 | // Inspired by react-hot-toast library
2 | import * as React from "react";
3 | import type { ToastActionElement, ToastProps } from "./toast";
4 |
5 | const TOAST_LIMIT = 1;
6 | const TOAST_REMOVE_DELAY = 1000000;
7 |
8 | type ToasterToast = ToastProps & {
9 |   id: string;
10 |   title?: React.ReactNode;
11 |   description?: React.ReactNode;
12 |   action?: ToastActionElement;
13 |   progress?: number;
14 |   footer?: React.ReactNode;
15 | };
16 |
17 | const actionTypes = {
18 |   ADD_TOAST: "ADD_TOAST",
19 |   UPDATE_TOAST: "UPDATE_TOAST",
20 |   DISMISS_TOAST: "DISMISS_TOAST",
21 |   REMOVE_TOAST: "REMOVE_TOAST",
22 | } as const;
23 |
24 | let count = 0;
25 |
26 | function genId() {
27 |   count = (count + 1) % Number.MAX_VALUE;
28 |   return count.toString();
29 | }
30 |
31 | type ActionType = typeof actionTypes;
32 |
33 | type Action =
34 |   | {
35 |       type: ActionType["ADD_TOAST"];
36 |       toast: ToasterToast;
37 |     }
38 |   | {
39 |       type: ActionType["UPDATE_TOAST"];
40 |       toast: Partial<ToasterToast>;
41 |     }
42 |   | {
43 |       type: ActionType["DISMISS_TOAST"];
44 |       toastId?: ToasterToast["id"];
45 |     }
46 |   | {
47 |       type: ActionType["REMOVE_TOAST"];
48 |       toastId?: ToasterToast["id"];
49 |     };
50 |
51 | interface State {
52 |   toasts: ToasterToast[];
53 | }
54 |
55 | const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>();
56 |
57 | const addToRemoveQueue = (toastId: string) => {
58 |   if (toastTimeouts.has(toastId)) {
59 |     return;
60 |   }
61 |
62 |   const timeout = setTimeout(() => {
63 |     toastTimeouts.delete(toastId);
64 |     dispatch({
65 |       type: "REMOVE_TOAST",
66 |       toastId: toastId,
67 |     });
68 |   }, TOAST_REMOVE_DELAY);
69 |
70 |   toastTimeouts.set(toastId, timeout);
71 | };
72 |
73 | export const reducer = (state: State, action: Action): State => {
74 |   switch (action.type) {
75 |     case "ADD_TOAST":
76 |       return {
77 |         ...state,
78 |         toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
79 |       };
80 |
81 |     case "UPDATE_TOAST":
82 |       return {
83 |         ...state,
84 |         toasts: state.toasts.map((t) =>
85 |           t.id === action.toast.id ? { ...t, ...action.toast } : t,
86 |         ),
87 |       };
88 |
89 |     case "DISMISS_TOAST": {
90 |       const { toastId } = action;
91 |
92 |       // ! Side effects ! - This could be extracted into a dismissToast() action,
93 |       // but I'll keep it here for simplicity
94 |       if (toastId) {
95 |         addToRemoveQueue(toastId);
96 |       } else {
97 |         for (const toast of state.toasts) {
98 |           addToRemoveQueue(toast.id);
99 |         }
100 |       }
101 |
102 |       return {
103 |         ...state,
104 |         toasts: state.toasts.map((t) =>
105 |           t.id === toastId || toastId === undefined
106 |             ? {
107 |                 ...t,
108 |                 open: false,
109 |               }
110 |             : t,
111 |         ),
112 |       };
113 |     }
114 |     case "REMOVE_TOAST":
115 |       if (action.toastId === undefined) {
116 |         return {
117 |           ...state,
118 |           toasts: [],
119 |         };
120 |       }
121 |       return {
122 |         ...state,
123 |         toasts: state.toasts.filter((t) => t.id !== action.toastId),
124 |       };
125 |   }
126 | };
127 |
128 | const listeners: Array<(state: State) => void> = [];
129 |
130 | let memoryState: State = { toasts: [] };
131 |
132 | function dispatch(action: Action) {
133 |   memoryState = reducer(memoryState, action);
134 |   for (const listener of listeners) {
135 |     listener(memoryState);
136 |   }
137 | }
138 |
139 | type Toast = Omit<ToasterToast, "id">;
140 |
141 | function toast({ ...props }: Toast) {
142 |   const id = genId();
143 |
144 |   const update = (props: ToasterToast) =>
145 |     dispatch({
146 |       type: "UPDATE_TOAST",
147 |       toast: { ...props, id },
148 |     });
149 |
150 |   const dismiss = () => dispatch({ type: "DISMISS_TOAST", toastId: id });
151 |
152 |   dispatch({
153 |     type: "ADD_TOAST",
154 |     toast: {
155 |       ...props,
156 |       id,
157 |       open: true,
158 |       onOpenChange: (open) => {
159 |         if (!open) dismiss();
160 |       },
161 |     },
162 |   });
163 |
164 |   return {
165 |     id: id,
166 |     dismiss,
167 |     update,
168 |   };
169 | }
170 |
171 | function useToast() {
172 |   const [state, setState] = React.useState<State>(memoryState);
173 |
174 |   React.useEffect(() => {
175 |     listeners.push(setState);
176 |     return () => {
177 |       const index = listeners.indexOf(setState);
178 |
179 |       if (index > -1) {
180 |         listeners.splice(index, 1);
181 |       }
182 |     };
183 |   }, [state]);
184 |
185 |   return {
186 |     ...state,
187 |     toast,
188 |     dismiss: (toastId?: string) => dispatch({ type: "DISMISS_TOAST", toastId }),
189 |     update: (toastId: string, props: ToasterToast) =>
190 |       dispatch({ type: "UPDATE_TOAST", toast: { ...props, id: toastId } }),
191 |   };
[TRUNCATED]
```

packages/ui/src/hooks/index.ts
```
1 | export * from "./use-media-query";
2 | export * from "./use-resize-observer";
3 | export * from "./use-enter-submit";
```

packages/ui/src/hooks/use-enter-submit.ts
```
1 | import { type RefObject, useRef } from "react";
2 |
3 | export function useEnterSubmit(): {
4 |   formRef: RefObject<HTMLFormElement>;
5 |   onKeyDown: (event: React.KeyboardEvent<HTMLTextAreaElement>) => void;
6 | } {
7 |   const formRef = useRef<HTMLFormElement>(null);
8 |
9 |   const handleKeyDown = (
10 |     event: React.KeyboardEvent<HTMLTextAreaElement>,
11 |   ): void => {
12 |     if (
13 |       event.key === "Enter" &&
14 |       !event.shiftKey &&
15 |       !event.nativeEvent.isComposing
16 |     ) {
17 |       formRef.current?.requestSubmit();
18 |       event.preventDefault();
19 |     }
20 |   };
21 |
22 |   return { formRef, onKeyDown: handleKeyDown };
23 | }
```

packages/ui/src/hooks/use-media-query.ts
```
1 | import { useEffect, useState } from "react";
2 |
3 | export function useMediaQuery(query: string) {
4 |   const [value, setValue] = useState(false);
5 |
6 |   useEffect(() => {
7 |     function onChange(event: MediaQueryListEvent) {
8 |       setValue(event.matches);
9 |     }
10 |
11 |     const result = matchMedia(query);
12 |     result.addEventListener("change", onChange);
13 |     setValue(result.matches);
14 |
15 |     return () => result.removeEventListener("change", onChange);
16 |   }, [query]);
17 |
18 |   return value;
19 | }
```

packages/ui/src/hooks/use-resize-observer.ts
```
1 | import { type RefObject, useEffect, useState } from "react";
2 |
3 | export function useResizeObserver(
4 |   elementRef: RefObject<Element>,
5 | ): ResizeObserverEntry | undefined {
6 |   const [entry, setEntry] = useState<ResizeObserverEntry>();
7 |
8 |   const updateEntry = ([entry]: ResizeObserverEntry[]): void => {
9 |     setEntry(entry);
10 |   };
11 |
12 |   useEffect(() => {
13 |     const node = elementRef?.current;
14 |     if (!node) return;
15 |
16 |     const observer = new ResizeObserver(updateEntry);
17 |
18 |     observer.observe(node);
19 |
20 |     return () => observer.disconnect();
21 |   }, [elementRef]);
22 |
23 |   return entry;
24 | }
```

packages/ui/src/utils/cn.ts
```
1 | import { type ClassValue, clsx } from "clsx";
2 | import { twMerge } from "tailwind-merge";
3 |
4 | export function cn(...inputs: ClassValue[]) {
5 |   return twMerge(clsx(inputs));
6 | }
```

packages/ui/src/utils/index.ts
```
1 | export * from "./cn";
2 | export * from "./truncate";
```

packages/ui/src/utils/truncate.ts
```
1 | export const truncate = (
2 |   str: string | null | undefined,
3 |   length: number,
4 | ): string | null => {
5 |   if (!str || str.length <= length) return str ?? null;
6 |   return `${str.slice(0, length - 3)}...`;
7 | };
```

apps/api/supabase/functions/generate-category-embedding/index.ts
```
1 | /// <reference types="https://esm.sh/@supabase/functions-js/src/edge-runtime.d.ts" />
2 |
3 | import { createClient } from "npm:@supabase/supabase-js@2.45.2";
4 | import type { Database, Tables } from "../../src/types";
5 |
6 | type TransactionCategoriesRecord = Tables<"transaction_categories">;
7 | interface WebhookPayload {
8 |   type: "INSERT";
9 |   table: string;
10 |   record: TransactionCategoriesRecord;
11 |   schema: "public";
12 |   old_record: null | TransactionCategoriesRecord;
13 | }
14 |
15 | const supabase = createClient<Database>(
16 |   Deno.env.get("SUPABASE_URL")!,
17 |   Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
18 | );
19 |
20 | const model = new Supabase.ai.Session("gte-small");
21 |
22 | Deno.serve(async (req) => {
23 |   const payload: WebhookPayload = await req.json();
24 |   const { id, name } = payload.record;
25 |
26 |   if (name === payload?.old_record?.name) {
27 |     return new Response("No change");
28 |   }
29 |
30 |   const embedding = await model.run(name, {
31 |     mean_pool: true,
32 |     normalize: true,
33 |   });
34 |
35 |   const { error } = await supabase
36 |     .from("transaction_categories")
37 |     .update({
38 |       embedding: JSON.stringify(embedding),
39 |     })
40 |     .eq("id", id);
41 |
42 |   if (error) {
43 |     console.warn(error.message);
44 |   }
45 |
46 |   return new Response(JSON.stringify(embedding, null, 2));
47 | });
```

apps/api/supabase/functions/generate-document-embedding/index.ts
```
1 | /// <reference types="https://esm.sh/@supabase/functions-js/src/edge-runtime.d.ts" />
2 |
3 | import { createClient } from "npm:@supabase/supabase-js@2.45.2";
4 | import { openai } from "https://esm.sh/@ai-sdk/openai@0.0.54";
5 | import { CSVLoader } from "https://esm.sh/@langchain/community@0.2.31/document_loaders/fs/csv";
6 | import { DocxLoader } from "https://esm.sh/@langchain/community@0.2.31/document_loaders/fs/docx";
7 | import { generateObject } from "https://esm.sh/ai@3.3.20";
8 | import { TextLoader } from "https://esm.sh/langchain@0.2.17/document_loaders/fs/text";
9 | import { extractText, getDocumentProxy } from "https://esm.sh/unpdf@0.11.0";
10 | import { z } from "https://esm.sh/zod@3.21.4";
11 | import type { Database, Tables } from "../../src/types";
12 | import { TAGS } from "./tags.ts";
13 |
14 | type DocumentsRecord = Tables<"documents">;
15 |
16 | interface WebhookPayload {
17 |   type: "INSERT";
18 |   table: string;
19 |   record: DocumentsRecord;
20 |   schema: "public";
21 |   old_record: null | DocumentsRecord;
22 | }
23 |
24 | const supabase = createClient<Database>(
25 |   Deno.env.get("SUPABASE_URL")!,
26 |   Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
27 | );
28 |
29 | Deno.serve(async (req) => {
30 |   const payload: WebhookPayload = await req.json();
31 |
32 |   const { id, name, metadata, team_id } = payload.record;
33 |
34 |   const { data: fileData } = await supabase.storage
35 |     .from("vault")
36 |     .download(name);
37 |
38 |   let document: string | null = null;
39 |
40 |   if (!fileData) {
41 |     return new Response("File not found", {
42 |       status: 404,
43 |     });
44 |   }
45 |
46 |   switch (metadata.mimetype) {
47 |     case "application/pdf": {
48 |       const content = await fileData.arrayBuffer();
49 |       const pdf = await getDocumentProxy(content);
50 |
51 |       const { text } = await extractText(pdf, {
52 |         mergePages: true,
53 |       });
54 |
55 |       // Unsupported Unicode escape sequence
56 |       document = text.replaceAll("\u0000", "");
57 |
58 |       break;
59 |     }
60 |     case "text/csv": {
61 |       const loader = new CSVLoader(fileData, {
62 |         splitPages: false,
63 |       });
64 |
65 |       document = await loader
66 |         .load()
67 |         .then((docs) => docs.map((doc) => doc.pageContent).join("\n"));
68 |       break;
69 |     }
70 |     case "application/docx": {
71 |       const loader = new DocxLoader(fileData);
72 |       document = await loader
73 |         .load()
74 |         .then((docs) => docs.map((doc) => doc.pageContent).join("\n"));
75 |
76 |       break;
77 |     }
78 |     case "text/plain": {
79 |       const loader = new TextLoader(fileData);
80 |
81 |       document = await loader
82 |         .load()
83 |         .then((docs) => docs.map((doc) => doc.pageContent).join("\n"));
84 |       break;
85 |     }
86 |     default:
87 |       return new Response(`Unsupported mimetype: ${metadata.mimetype}`, {
88 |         status: 400,
89 |       });
90 |   }
91 |
92 |   if (!document) {
93 |     return new Response("Unsupported file type or empty content", {
94 |       status: 400,
95 |     });
96 |   }
97 |
98 |   const { data: teamData } = await supabase
99 |     .from("teams")
100 |     .select("id, document_classification")
101 |     .eq("id", team_id)
102 |     .single();
103 |
104 |   let response: { title: string | null; tag: string | null } | null = null;
105 |
106 |   if (teamData?.document_classification) {
107 |     const { object } = await generateObject({
108 |       model: openai("gpt-4o"),
109 |       schema: z.object({
110 |         title: z
111 |           .string()
112 |           .nullable()
113 |           .describe("Company name, supplier name, or a document name"),
114 |         tag: TAGS.describe("Classification of the document").nullable(),
115 |       }),
116 |       prompt: `
117 |         Analyze the document and extract:
118 |         1. Title: Company name, supplier name, or document name
119 |         2. Tag: Classify using predefined tags only; return null if no match
120 |         Provide concise, accurate results based on the document content.
121 |         Document: ${document.slice(0, 1000)}
122 |     `,
123 |       temperature: 0.5,
124 |     });
125 |
126 |     response = {
127 |       title: object?.title ?? null,
128 |       tag: object?.tag ?? null,
129 |     };
130 |   }
131 |
132 |   const { error: updateError } = await supabase
133 |     .from("documents")
134 |     .update({
135 |       title: response?.title,
136 |       body: document,
137 |       tag: response?.tag,
138 |     })
139 |     .eq("id", id);
140 |
141 |   if (updateError) {
142 |     console.log(`Error updating document: ${updateError.message}`);
143 |   }
144 |
145 |   return new Response("Document processed and embedded successfully", {
146 |     status: 200,
147 |     headers: { "Content-Type": "application/json" },
148 |   });
149 | });
```

apps/api/supabase/functions/generate-document-embedding/tags.ts
```
1 | import { z } from "https://esm.sh/zod@3.21.4";
2 |
3 | export const TAGS = z.enum([
4 |   "bylaws",
5 |   "shareholder_agreements",
6 |   "board_meeting",
7 |   "corporate_policies",
8 |   "annual_reports",
9 |   "budget_reports",
10 |   "audit_reports",
11 |   "tax_returns",
12 |   "invoices_and_receipts",
13 |   "employee_handbook",
14 |   "payroll_records",
15 |   "performance_reviews",
16 |   "employee_training_materials",
17 |   "benefits_documentation",
18 |   "termination_letters",
19 |   "patents",
20 |   "trademarks",
21 |   "copyrights",
22 |   "client_contracts",
23 |   "vendor_agreements",
24 |   "compliance_reports",
25 |   "regulatory_filings",
26 |   "advertising_copy",
27 |   "press_releases",
28 |   "branding_guidelines",
29 |   "market_research_reports",
30 |   "campaign_performance_reports",
31 |   "customer_surveys",
32 |   "quality_control_reports",
33 |   "inventory_reports",
34 |   "maintenance_logs",
35 |   "production_schedules",
36 |   "vendor_agreements",
37 |   "supplier_agreements",
38 |   "sales_contracts",
39 |   "sales_reports",
40 |   "client_proposals",
41 |   "financial_records",
42 |   "customer_order_forms",
43 |   "sales_presentations",
44 |   "data_security_plans",
45 |   "system_architecture_diagrams",
46 |   "incident_response_plans",
47 |   "user_manuals",
48 |   "software_licenses",
49 |   "data_backup_logs",
50 |   "project_plans",
51 |   "task_lists",
52 |   "risk_management_plans",
53 |   "project_status_reports",
54 |   "meeting_agendas",
55 |   "lab_notebooks",
56 |   "experiment_results",
57 |   "product_design_documents",
58 |   "prototypes_and_models",
59 |   "testing_reports",
60 |   "newsletters",
61 |   "email_correspondence",
62 |   "support_tickets",
63 |   "faqs_and_knowledge",
64 |   "user_guides",
65 |   "warranty_information",
66 |   "swot_analysis",
67 |   "strategic_objectives",
68 |   "roadmaps",
69 |   "competitive_analysis",
70 |   "safety_data_sheets",
71 |   "compliance_certificates",
72 |   "incident_reports",
73 |   "emergency_response_plans",
74 |   "certification_records",
75 |   "training_schedules",
76 |   "e_learning_materials",
77 |   "competency_assessment_forms",
78 | ]);
```

apps/dashboard/jobs/tasks/inbox/document.ts
```
1 | import { DocumentClient } from "@midday/documents";
2 | import { createClient } from "@midday/supabase/job";
3 | import { schemaTask } from "@trigger.dev/sdk/v3";
4 | import { handleInboxNotifications } from "jobs/utils/inbox-notifications";
5 | import { z } from "zod";
6 |
7 | export const inboxDocument = schemaTask({
8 |   id: "inbox-document",
9 |   schema: z.object({
10 |     inboxId: z.string().uuid(),
11 |   }),
12 |   maxDuration: 300,
13 |   queue: {
14 |     concurrencyLimit: 10,
15 |   },
16 |   run: async ({ inboxId }) => {
17 |     const supabase = createClient();
18 |
19 |     const { data: inboxData } = await supabase
20 |       .from("inbox")
21 |       .select()
22 |       .eq("id", inboxId)
23 |       .single()
24 |       .throwOnError();
25 |
26 |     if (!inboxData || !inboxData.file_path) {
27 |       throw Error("Inbox data not found");
28 |     }
29 |
30 |     const { data } = await supabase.storage
31 |       .from("vault")
32 |       .download(inboxData.file_path.join("/"));
33 |
34 |     // Convert the document data to a Buffer and base64 encode it.
35 |     const buffer = await data?.arrayBuffer();
36 |
37 |     if (!buffer) {
38 |       throw Error("No file data");
39 |     }
40 |
41 |     try {
42 |       const document = new DocumentClient({
43 |         contentType: inboxData.content_type!,
44 |       });
45 |
46 |       const result = await document.getDocument({
47 |         content: Buffer.from(buffer).toString("base64"),
48 |       });
49 |
50 |       const { data: updatedInbox } = await supabase
51 |         .from("inbox")
52 |         .update({
53 |           amount: result.amount,
54 |           currency: result.currency,
55 |           display_name: result.name,
56 |           website: result.website,
57 |           date: result.date && new Date(result.date).toISOString(),
58 |           type: result.type,
59 |           description: result.description,
60 |           status: "pending",
61 |         })
62 |         .eq("id", inboxId)
63 |         .select()
64 |         .single();
65 |
66 |       if (updatedInbox?.amount) {
67 |         // TODO: Send event to match inbox
68 |       }
69 |     } catch {
70 |       // If we end up here we could not parse the document
71 |       // But we want to update the status so we show the record with fallback name (Subject/From name)
72 |       await supabase
73 |         .from("inbox")
74 |         .update({ status: "pending" })
75 |         .eq("id", inboxId);
76 |
77 |       // And send a notification about the new inbox record
78 |       // We send this if we dont find a suggested match
79 |       await handleInboxNotifications({
80 |         inboxId,
81 |         description: inboxData.display_name!,
82 |         teamId: inboxData.team_id!,
83 |       });
84 |     }
85 |   },
86 | });
```

apps/dashboard/jobs/tasks/inbox/slack-upload.ts
```
1 | import {
2 |   createSlackWebClient,
3 |   downloadFile,
4 | } from "@midday/app-store/slack-client";
5 | import { DocumentClient, prepareDocument } from "@midday/documents";
6 | import { createClient } from "@midday/supabase/job";
7 | import { schemaTask } from "@trigger.dev/sdk/v3";
8 | import { format } from "date-fns";
9 | import { z } from "zod";
10 |
11 | export const inboxSlackUpload = schemaTask({
12 |   id: "inbox-slack-upload",
13 |   schema: z.object({
14 |     teamId: z.string(),
15 |     token: z.string(),
16 |     channelId: z.string(),
17 |     threadId: z.string().optional(),
18 |     file: z.object({
19 |       id: z.string(),
20 |       name: z.string(),
21 |       mimetype: z.string(),
22 |       size: z.number(),
23 |       url: z.string(),
24 |     }),
25 |   }),
26 |   maxDuration: 300,
27 |   queue: {
28 |     concurrencyLimit: 10,
29 |   },
30 |   run: async ({
31 |     teamId,
32 |     token,
33 |     channelId,
34 |     threadId,
35 |     file: { id, name, mimetype, size, url },
36 |   }) => {
37 |     const supabase = createClient();
38 |
39 |     const slackApp = createSlackWebClient({
40 |       token,
41 |     });
42 |
43 |     if (threadId) {
44 |       await slackApp.assistant.threads.setStatus({
45 |         channel_id: channelId,
46 |         thread_ts: threadId,
47 |         status: "Is thinking...",
48 |       });
49 |     }
50 |
51 |     const fileData = await downloadFile({
52 |       privateDownloadUrl: url,
53 |       token,
54 |     });
55 |
56 |     if (!fileData) {
57 |       throw Error("No file data");
58 |     }
59 |
60 |     const document = await prepareDocument({
61 |       Content: Buffer.from(fileData).toString("base64"),
62 |       ContentType: mimetype,
63 |       ContentLength: size,
64 |       Name: name,
65 |     });
66 |
67 |     const pathTokens = [teamId, "inbox", document.fileName];
68 |
69 |     // Upload file to vault
70 |     await supabase.storage
71 |       .from("vault")
72 |       .upload(pathTokens.join("/"), new Uint8Array(document.content), {
73 |         contentType: document.mimeType,
74 |         upsert: true,
75 |       });
76 |
77 |     const { data: inboxData } = await supabase
78 |       .from("inbox")
79 |       .insert({
80 |         // NOTE: If we can't parse the name using OCR this will be the fallback name
81 |         display_name: document.name,
82 |         team_id: teamId,
83 |         file_path: pathTokens,
84 |         file_name: document.fileName,
85 |         content_type: document.mimeType,
86 |         reference_id: `${id}_${document.fileName}`,
87 |         size,
88 |       })
89 |       .select("*")
90 |       .single()
91 |       .throwOnError();
92 |
93 |     if (!inboxData) {
94 |       throw Error("Inbox data not found");
95 |     }
96 |
97 |     try {
98 |       const document = new DocumentClient({
99 |         contentType: inboxData.content_type!,
100 |       });
101 |
102 |       const result = await document.getDocument({
103 |         content: Buffer.from(fileData).toString("base64"),
104 |       });
105 |
106 |       const { data: updatedInbox } = await supabase
107 |         .from("inbox")
108 |         .update({
109 |           amount: result.amount,
110 |           currency: result.currency,
111 |           display_name: result.name,
112 |           website: result.website,
113 |           date: result.date ? new Date(result.date).toISOString() : null,
114 |           type: result.type,
115 |           description: result.description,
116 |           status: "pending",
117 |         })
118 |         .eq("id", inboxData.id)
119 |         .select()
120 |         .single();
121 |
122 |       if (updatedInbox?.amount) {
123 |         // Send notification to slack
124 |         try {
125 |           await slackApp.chat.postMessage({
126 |             channel: channelId,
127 |             thread_ts: threadId,
128 |             unfurl_links: false,
129 |             unfurl_media: false,
130 |             blocks: [
131 |               {
132 |                 type: "section",
133 |                 text: {
134 |                   type: "mrkdwn",
135 |                   text: `Here's the information I extracted from your receipt:\n\n• *Vendor:* ${updatedInbox.display_name}\n• *Amount:* ${new Intl.NumberFormat(
136 |                     "en-US",
137 |                     {
138 |                       style: "currency",
139 |                       currency: updatedInbox.currency!,
140 |                     },
141 |                   ).format(
142 |                     updatedInbox.amount,
143 |                   )}\n• *Date:* ${updatedInbox.date ? format(new Date(updatedInbox.date), "MMM d") : ""}\n\nWe'll notify you when we match it to a transaction.`,
144 |                 },
145 |               },
146 |               {
147 |                 type: "actions",
148 |                 elements: [
149 |                   {
150 |                     type: "button",
151 |                     text: {
152 |                       type: "plain_text",
153 |                       text: "Show receipt",
154 |                       emoji: true,
155 |                     },
156 |                     url: `https://app.midday.ai/inbox?id=${encodeURIComponent(updatedInbox.id)}`,
157 |                     action_id: "view_receipt",
158 |                   },
159 |                 ],
160 |               },
161 |             ],
162 |           });
163 |
164 |           if (threadId) {
165 |             await slackApp.assistant.threads.setStatus({
166 |               channel_id: channelId,
167 |               thread_ts: threadId,
168 |               status: "",
169 |             });
170 |           }
171 |         } catch (err) {
172 |           console.error(err);
173 |         }
174 |
175 |         // TODO: Send event to match inbox
176 |       }
177 |     } catch {
178 |       // If we end up here we could not parse the document
[TRUNCATED]
```

apps/dashboard/jobs/tasks/inbox/upload.ts
```
1 | import { DocumentClient } from "@midday/documents";
2 | import { createClient } from "@midday/supabase/job";
3 | import { schemaTask } from "@trigger.dev/sdk/v3";
4 | import { z } from "zod";
5 |
6 | export const inboxUpload = schemaTask({
7 |   id: "inbox-upload",
8 |   schema: z.object({
9 |     teamId: z.string().uuid(),
10 |     mimetype: z.string(),
11 |     size: z.number(),
12 |     file_path: z.array(z.string()),
13 |   }),
14 |   maxDuration: 300,
15 |   queue: {
16 |     concurrencyLimit: 25,
17 |   },
18 |   run: async ({ teamId, mimetype, size, file_path }) => {
19 |     const supabase = createClient();
20 |
21 |     const filename = file_path.at(-1);
22 |
23 |     const { data: inboxData } = await supabase
24 |       .from("inbox")
25 |       .insert({
26 |         // NOTE: If we can't parse the name using OCR this will be the fallback name
27 |         display_name: filename,
28 |         team_id: teamId,
29 |         file_path: file_path,
30 |         file_name: filename,
31 |         content_type: mimetype,
32 |         size,
33 |       })
34 |       .select("*")
35 |       .single()
36 |       .throwOnError();
37 |
38 |     if (!inboxData) {
39 |       throw Error("Inbox data not found");
40 |     }
41 |
42 |     const { data } = await supabase.storage
43 |       .from("vault")
44 |       .download(file_path.join("/"));
45 |
46 |     // Convert the document data to a Buffer and base64 encode it.
47 |     const buffer = await data?.arrayBuffer();
48 |
49 |     if (!buffer) {
50 |       throw Error("No file data");
51 |     }
52 |
53 |     try {
54 |       const document = new DocumentClient({
55 |         contentType: inboxData.content_type!,
56 |       });
57 |
58 |       const result = await document.getDocument({
59 |         content: Buffer.from(buffer).toString("base64"),
60 |       });
61 |
62 |       const { data: updatedInbox } = await supabase
63 |         .from("inbox")
64 |         .update({
65 |           amount: result.amount,
66 |           currency: result.currency,
67 |           display_name: result.name,
68 |           website: result.website,
69 |           date: result.date && new Date(result.date).toISOString(),
70 |           type: result.type,
71 |           description: result.description,
72 |           status: "pending",
73 |         })
74 |         .eq("id", inboxData.id)
75 |         .select()
76 |         .single();
77 |
78 |       // TODO: Send event to match inbox
79 |     } catch {
80 |       // If we end up here we could not parse the document
81 |       // But we want to update the status so we show the record with fallback name
82 |       await supabase
83 |         .from("inbox")
84 |         .update({ status: "pending" })
85 |         .eq("id", inboxData.id);
86 |     }
87 |   },
88 | });
```

apps/dashboard/jobs/tasks/rates/rates-scheduler.ts
```
1 | import { client } from "@midday/engine/client";
2 | import { createClient } from "@midday/supabase/job";
3 | import { logger, schedules } from "@trigger.dev/sdk/v3";
4 | import { processBatch } from "jobs/utils/process-batch";
5 |
6 | export const ratesScheduler = schedules.task({
7 |   id: "rates-scheduler",
8 |   cron: "0 0,12 * * *",
9 |   run: async () => {
10 |     // Only run in production (Set in Trigger.dev)
11 |     if (process.env.TRIGGER_ENVIRONMENT !== "production") return;
12 |
13 |     const supabase = createClient();
14 |
15 |     const ratesResponse = await client.rates.$get();
16 |
17 |     if (!ratesResponse.ok) {
18 |       logger.error("Failed to get rates");
19 |       throw new Error("Failed to get rates");
20 |     }
21 |
22 |     const { data: ratesData } = await ratesResponse.json();
23 |
24 |     const data = ratesData.flatMap((rate) => {
25 |       return Object.entries(rate.rates).map(([target, value]) => ({
26 |         base: rate.source,
27 |         target: target,
28 |         rate: value,
29 |         updated_at: rate.date,
30 |       }));
31 |     });
32 |
33 |     await processBatch(data, 500, async (batch) => {
34 |       await supabase.from("exchange_rates").upsert(batch, {
35 |         onConflict: "base, target",
36 |         ignoreDuplicates: false,
37 |       });
38 |
39 |       return batch;
40 |     });
41 |   },
42 | });
```

apps/dashboard/jobs/tasks/reconnect/connection.ts
```
1 | import { client } from "@midday/engine/client";
2 | import { createClient } from "@midday/supabase/job";
3 | import { logger, schemaTask } from "@trigger.dev/sdk/v3";
4 | import { syncConnection } from "jobs/tasks/bank/sync/connection";
5 | import { z } from "zod";
6 |
7 | export const reconnectConnection = schemaTask({
8 |   id: "reconnect-connection",
9 |   maxDuration: 300,
10 |   retry: {
11 |     maxAttempts: 2,
12 |   },
13 |   schema: z.object({
14 |     teamId: z.string().uuid(),
15 |     connectionId: z.string().uuid(),
16 |     provider: z.string(),
17 |   }),
18 |   run: async ({ teamId, connectionId, provider }) => {
19 |     const supabase = createClient();
20 |
21 |     if (provider === "gocardless") {
22 |       // We need to update the reference of the connection
23 |       const connection = await client.connections[":reference"].$get({
24 |         param: { reference: teamId },
25 |       });
26 |
27 |       const connectionResponse = await connection.json();
28 |       const referenceId = connectionResponse?.data.id;
29 |
30 |       // Update the reference_id of the new connection
31 |       if (referenceId) {
32 |         logger.info("Updating reference_id of the new connection");
33 |
34 |         await supabase
35 |           .from("bank_connections")
36 |           .update({
37 |             reference_id: referenceId,
38 |           })
39 |           .eq("id", connectionId);
40 |       }
41 |
42 |       // The account_ids can be different between the old and new connection
43 |       // So we need to check for account_reference and update
44 |       const accounts = await client.accounts.$get({
45 |         query: {
46 |           id: referenceId,
47 |           provider: "gocardless",
48 |         },
49 |       });
50 |
51 |       const accountsResponse = await accounts.json();
52 |
53 |       await Promise.all(
54 |         accountsResponse.data.map(async (account) => {
55 |           await supabase
56 |             .from("bank_accounts")
57 |             .update({
58 |               account_id: account.id,
59 |             })
60 |             .eq("account_reference", account.resource_id);
61 |         }),
62 |       );
63 |     }
64 |
65 |     await syncConnection.trigger({
66 |       connectionId,
67 |       manualSync: true,
68 |     });
69 |   },
70 | });
```

apps/dashboard/jobs/tasks/team/delete.ts
```
1 | import { client } from "@midday/engine/client";
2 | import { logger, schemaTask } from "@trigger.dev/sdk/v3";
3 | import { z } from "zod";
4 |
5 | export const deleteTeam = schemaTask({
6 |   id: "delete-team",
7 |   schema: z.object({
8 |     teamId: z.string().uuid(),
9 |     connections: z.array(
10 |       z.object({
11 |         provider: z.enum(["teller", "plaid", "gocardless"]).nullable(),
12 |         reference_id: z.string().nullable(),
13 |         access_token: z.string().nullable(),
14 |       }),
15 |     ),
16 |   }),
17 |   maxDuration: 300,
18 |   queue: {
19 |     concurrencyLimit: 10,
20 |   },
21 |   run: async ({ teamId, connections }) => {
22 |     // Unregister sync scheduler (Not implemented yet in Trigger.dev)
23 |     // await schedules.del(teamId);
24 |
25 |     // Delete connections in providers
26 |     const connectionPromises = connections.map(async (connection) => {
27 |       return client.connections.delete.$post({
28 |         json: {
29 |           id: connection.reference_id,
30 |           provider: connection.provider,
31 |           accessToken: connection.access_token,
32 |         },
33 |       });
34 |     });
35 |
36 |     logger.info("Deleting team connections", {
37 |       connections: connections.length,
38 |     });
39 |
40 |     await Promise.all(connectionPromises);
41 |   },
42 | });
```

apps/dashboard/jobs/tasks/transactions/export.ts
```
1 | import { writeToString } from "@fast-csv/format";
2 | import { createClient } from "@midday/supabase/job";
3 | import { metadata, schemaTask } from "@trigger.dev/sdk/v3";
4 | import { BlobReader, BlobWriter, TextReader, ZipWriter } from "@zip.js/zip.js";
5 | import { serializableToBlob } from "jobs/utils/blob";
6 | import { revalidateCache } from "jobs/utils/revalidate-cache";
7 | import { z } from "zod";
8 | import { processExport } from "./process-export";
9 |
10 | // Process transactions in batches of 100
11 | const BATCH_SIZE = 100;
12 |
13 | export const exportTransactions = schemaTask({
14 |   id: "export-transactions",
15 |   schema: z.object({
16 |     teamId: z.string().uuid(),
17 |     locale: z.string(),
18 |     transactionIds: z.array(z.string().uuid()),
19 |   }),
20 |   maxDuration: 300,
21 |   queue: {
22 |     concurrencyLimit: 10,
23 |   },
24 |   machine: {
25 |     preset: "large-1x",
26 |   },
27 |   run: async ({ teamId, locale, transactionIds }) => {
28 |     const supabase = createClient();
29 |
30 |     const filePath = `export-${new Date().toISOString()}`;
31 |     const path = `${teamId}/exports`;
32 |     const fileName = `${filePath}.zip`;
33 |
34 |     metadata.set("progress", 20);
35 |
36 |     // Process transactions in batches of 100 and collect results
37 |     // Update progress for each batch
38 |     const results = [];
39 |
40 |     const totalBatches = Math.ceil(transactionIds.length / BATCH_SIZE);
41 |     const progressPerBatch = 60 / totalBatches;
42 |     let currentProgress = 20;
43 |
44 |     for (let i = 0; i < transactionIds.length; i += BATCH_SIZE) {
45 |       const transactionBatch = transactionIds.slice(i, i + BATCH_SIZE);
46 |
47 |       const batchResult = await processExport.triggerAndWait({
48 |         ids: transactionBatch,
49 |         locale,
50 |       });
51 |
52 |       results.push(batchResult);
53 |
54 |       currentProgress += progressPerBatch;
55 |       metadata.set("progress", Math.round(currentProgress));
56 |     }
57 |
58 |     const rows = results
59 |       .flatMap((r) => (r.ok ? r.output.rows : []))
60 |       //   Date is the first column
61 |       .sort(
62 |         (a, b) =>
63 |           new Date(b[0] as string).getTime() -
64 |           new Date(a[0] as string).getTime(),
65 |       );
66 |
67 |     const attachments = results.flatMap((r) =>
68 |       r.ok ? r.output.attachments : [],
69 |     );
70 |
71 |     const csv = await writeToString(rows, {
72 |       headers: [
73 |         "ID",
74 |         "Date",
75 |         "Description",
76 |         "Additional info",
77 |         "Amount",
78 |         "Currency",
79 |         "Formatted amount",
80 |         "VAT",
81 |         "Category",
82 |         "Category description",
83 |         "Status",
84 |         "Attachments",
85 |         "Balance",
86 |         "Account",
87 |         "Note",
88 |       ],
89 |     });
90 |
91 |     const zipFileWriter = new BlobWriter("application/zip");
92 |     const zipWriter = new ZipWriter(zipFileWriter);
93 |
94 |     zipWriter.add("transactions.csv", new TextReader(csv));
95 |
96 |     metadata.set("progress", 90);
97 |
98 |     // Add attachments to zip
99 |     attachments?.map((attachment) => {
100 |       if (attachment.blob) {
101 |         zipWriter.add(
102 |           attachment.name,
103 |           new BlobReader(serializableToBlob(attachment.blob)),
104 |         );
105 |       }
106 |     });
107 |
108 |     const zip = await zipWriter.close();
109 |
110 |     metadata.set("progress", 95);
111 |
112 |     await supabase.storage
113 |       .from("vault")
114 |       .upload(`${path}/${fileName}`, await zip.arrayBuffer(), {
115 |         upsert: true,
116 |         contentType: "application/zip",
117 |       });
118 |
119 |     revalidateCache({ tag: "vault", id: teamId });
120 |
121 |     metadata.set("progress", 100);
122 |
123 |     return {
124 |       filePath,
125 |       fileName,
126 |       totalItems: rows.length,
127 |     };
128 |   },
129 | });
```

apps/dashboard/jobs/tasks/transactions/import.ts
```
1 | import { mapTransactions } from "@midday/import/mappings";
2 | import { transform } from "@midday/import/transform";
3 | import { validateTransactions } from "@midday/import/validate";
4 | import { createClient } from "@midday/supabase/job";
5 | import { logger, schemaTask } from "@trigger.dev/sdk/v3";
6 | import { processBatch } from "jobs/utils/process-batch";
7 | import { revalidateCache } from "jobs/utils/revalidate-cache";
8 | import Papa from "papaparse";
9 | import { z } from "zod";
10 |
11 | const BATCH_SIZE = 500;
12 |
13 | export const importTransactions = schemaTask({
14 |   id: "import-transactions",
15 |   schema: z.object({
16 |     importType: z.enum(["csv", "image"]),
17 |     inverted: z.boolean(),
18 |     filePath: z.array(z.string()).optional(),
19 |     bankAccountId: z.string(),
20 |     currency: z.string(),
21 |     teamId: z.string(),
22 |     table: z.array(z.record(z.string(), z.string())).optional(),
23 |     mappings: z.object({
24 |       amount: z.string(),
25 |       date: z.string(),
26 |       description: z.string(),
27 |     }),
28 |   }),
29 |   maxDuration: 300,
30 |   queue: {
31 |     concurrencyLimit: 10,
32 |   },
33 |   run: async ({
34 |     teamId,
35 |     filePath,
36 |     importType,
37 |     bankAccountId,
38 |     currency,
39 |     mappings,
40 |     inverted,
41 |     table,
42 |   }) => {
43 |     const supabase = createClient();
44 |
45 |     switch (importType) {
46 |       case "csv": {
47 |         if (!filePath) {
48 |           throw new Error("File path is required");
49 |         }
50 |
51 |         const { data: fileData } = await supabase.storage
52 |           .from("vault")
53 |           .download(filePath.join("/"));
54 |
55 |         const content = await fileData?.text();
56 |
57 |         if (!content) {
58 |           throw new Error("File content is required");
59 |         }
60 |
61 |         await new Promise((resolve, reject) => {
62 |           Papa.parse(content, {
63 |             header: true,
64 |             skipEmptyLines: true,
65 |             worker: false,
66 |             complete: resolve,
67 |             error: reject,
68 |             chunk: async (
69 |               chunk: {
70 |                 data: Record<string, string>[];
71 |                 errors: Array<{ message: string }>;
72 |               },
73 |               parser: Papa.Parser,
74 |             ) => {
75 |               parser.pause();
76 |
77 |               const { data } = chunk;
78 |
79 |               if (!data?.length) {
80 |                 throw new Error("No data in CSV import chunk");
81 |               }
82 |
83 |               const mappedTransactions = mapTransactions(
84 |                 data,
85 |                 mappings,
86 |                 currency,
87 |                 teamId,
88 |                 bankAccountId,
89 |               );
90 |
91 |               const transactions = mappedTransactions.map((transaction) =>
92 |                 transform({ transaction, inverted }),
93 |               );
94 |
95 |               const { validTransactions, invalidTransactions } =
96 |                 validateTransactions(transactions);
97 |
98 |               if (invalidTransactions.length > 0) {
99 |                 logger.error("Invalid transactions", {
100 |                   invalidTransactions,
101 |                 });
102 |               }
103 |
104 |               await processBatch(
105 |                 validTransactions,
106 |                 BATCH_SIZE,
107 |                 async (batch) => {
108 |                   return supabase.from("transactions").upsert(batch, {
109 |                     onConflict: "internal_id",
110 |                     ignoreDuplicates: true,
111 |                   });
112 |                 },
113 |               );
114 |
115 |               parser.resume();
116 |             },
117 |           });
118 |         });
119 |
120 |         break;
121 |       }
122 |       case "image": {
123 |         if (!table) {
124 |           throw new Error("Table is required");
125 |         }
126 |
127 |         const mappedTransactions = mapTransactions(
128 |           table,
129 |           mappings,
130 |           currency,
131 |           teamId,
132 |           bankAccountId,
133 |         );
134 |
135 |         const transactions = mappedTransactions.map((transaction) =>
136 |           transform({ transaction, inverted }),
137 |         );
138 |
139 |         await processBatch(transactions, BATCH_SIZE, async (batch) => {
140 |           return supabase.from("transactions").upsert(batch, {
141 |             onConflict: "internal_id",
142 |             ignoreDuplicates: true,
143 |           });
144 |         });
145 |
146 |         break;
147 |       }
148 |       default: {
149 |         throw new Error("Invalid import type");
150 |       }
151 |     }
152 |
153 |     await revalidateCache({ tag: "transactions", id: teamId });
154 |   },
155 | });
```

apps/dashboard/jobs/tasks/transactions/process-export.ts
```
1 | import { createClient } from "@midday/supabase/job";
2 | import { download } from "@midday/supabase/storage";
3 | import { schemaTask } from "@trigger.dev/sdk/v3";
4 | import { blobToSerializable } from "jobs/utils/blob";
5 | import { processBatch } from "jobs/utils/process-batch";
6 | import { z } from "zod";
7 |
8 | const ATTACHMENT_BATCH_SIZE = 20;
9 |
10 | export const processExport = schemaTask({
11 |   id: "process-export",
12 |   schema: z.object({
13 |     ids: z.array(z.string().uuid()),
14 |     locale: z.string(),
15 |   }),
16 |   maxDuration: 300,
17 |   queue: {
18 |     concurrencyLimit: 5,
19 |   },
20 |   machine: {
21 |     preset: "large-1x",
22 |   },
23 |   run: async ({ ids, locale }) => {
24 |     const supabase = createClient();
25 |
26 |     const { data: transactionsData } = await supabase
27 |       .from("transactions")
28 |       .select(`
29 |         id,
30 |         date,
31 |         name,
32 |         description,
33 |         amount,
34 |         note,
35 |         balance,
36 |         currency,
37 |         vat:calculated_vat,
38 |         attachments:transaction_attachments(*),
39 |         category:transaction_categories(id, name, description),
40 |         bank_account:bank_accounts(id, name)
41 |       `)
42 |       .in("id", ids)
43 |       .throwOnError();
44 |
45 |     const attachments = await processBatch(
46 |       transactionsData ?? [],
47 |       ATTACHMENT_BATCH_SIZE,
48 |       async (batch) => {
49 |         const batchAttachments = await Promise.all(
50 |           batch.flatMap((transaction, idx) => {
51 |             const rowId = idx + 1;
52 |             return (transaction.attachments ?? []).map(
53 |               async (attachment, idx2: number) => {
54 |                 const filename = attachment.name?.split(".").at(0);
55 |                 const extension = attachment.name?.split(".").at(-1);
56 |
57 |                 const name =
58 |                   idx2 > 0
59 |                     ? `${filename}-${rowId}_${idx2}.${extension}`
60 |                     : `${filename}-${rowId}.${extension}`;
61 |
62 |                 const { data } = await download(supabase, {
63 |                   bucket: "vault",
64 |                   path: (attachment.path ?? []).join("/"),
65 |                 });
66 |
67 |                 return {
68 |                   id: transaction.id,
69 |                   name,
70 |                   blob: data ? await blobToSerializable(data) : null,
71 |                 };
72 |               },
73 |             );
74 |           }),
75 |         );
76 |
77 |         return batchAttachments.flat();
78 |       },
79 |     );
80 |
81 |     const rows = transactionsData
82 |       ?.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
83 |       .map((transaction) => [
84 |         transaction.id,
85 |         transaction.date,
86 |         transaction.name,
87 |         transaction.description,
88 |         transaction.amount,
89 |         transaction.currency,
90 |         Intl.NumberFormat(locale, {
91 |           style: "currency",
92 |           currency: transaction.currency,
93 |         }).format(transaction.amount),
94 |         transaction?.vat
95 |           ? Intl.NumberFormat(locale, {
96 |               style: "currency",
97 |               currency: transaction.currency,
98 |             }).format(transaction?.vat)
99 |           : "",
100 |         transaction?.category?.name ?? "",
101 |         transaction?.category?.description ?? "",
102 |         transaction?.attachments?.length > 0 ? "✔️" : "❌",
103 |
104 |         attachments
105 |           .filter((a) => a.id === transaction.id)
106 |           .map((a) => a.name)
107 |           .join(", ") ?? "",
108 |
109 |         transaction?.balance ?? "",
110 |         transaction?.bank_account?.name ?? "",
111 |         transaction?.note ?? "",
112 |       ]);
113 |
114 |     return {
115 |       rows: rows ?? [],
116 |       attachments: attachments ?? [],
117 |     };
118 |   },
119 | });
```

apps/dashboard/jobs/tasks/transactions/update-account-base-currency.ts
```
1 | import { createClient } from "@midday/supabase/job";
2 | import { logger, schemaTask } from "@trigger.dev/sdk/v3";
3 | import {
4 |   getAccountBalance,
5 |   getTransactionAmount,
6 | } from "jobs/utils/base-currency";
7 | import { processBatch } from "jobs/utils/process-batch";
8 | import { z } from "zod";
9 |
10 | const BATCH_LIMIT = 500;
11 |
12 | export const updateAccountBaseCurrency = schemaTask({
13 |   id: "update-account-base-currency",
14 |   schema: z.object({
15 |     accountId: z.string().uuid(),
16 |     currency: z.string(),
17 |     balance: z.number(),
18 |     baseCurrency: z.string(),
19 |   }),
20 |   maxDuration: 300,
21 |   queue: {
22 |     concurrencyLimit: 10,
23 |   },
24 |   run: async ({ accountId, currency, balance, baseCurrency }) => {
25 |     const supabase = createClient();
26 |
27 |     const { data: exchangeRate } = await supabase
28 |       .from("exchange_rates")
29 |       .select("rate")
30 |       .eq("base", currency)
31 |       .eq("target", baseCurrency)
32 |       .single();
33 |
34 |     if (!exchangeRate) {
35 |       logger.info("No exchange rate found", {
36 |         currency,
37 |         baseCurrency,
38 |       });
39 |
40 |       return;
41 |     }
42 |
43 |     // Update account base balance and base currency
44 |     // based on the new currency exchange rate
45 |     await supabase
46 |       .from("bank_accounts")
47 |       .update({
48 |         base_balance: getAccountBalance({
49 |           currency: currency,
50 |           balance,
51 |           baseCurrency,
52 |           rate: exchangeRate.rate,
53 |         }),
54 |         base_currency: baseCurrency,
55 |       })
56 |       .eq("id", accountId);
57 |
58 |     const { data: transactionsData } = await supabase.rpc(
59 |       "get_all_transactions_by_account",
60 |       {
61 |         account_id: accountId,
62 |       },
63 |     );
64 |
65 |     const formattedTransactions = transactionsData?.map(
66 |       // Exclude fts_vector from the transaction object because it's a generated column
67 |       ({ fts_vector, ...transaction }) => ({
68 |         ...transaction,
69 |         base_amount: getTransactionAmount({
70 |           amount: transaction.amount,
71 |           currency: transaction.currency,
72 |           baseCurrency,
73 |           rate: exchangeRate?.rate,
74 |         }),
75 |         base_currency: baseCurrency,
76 |       }),
77 |     );
78 |
79 |     await processBatch(
80 |       formattedTransactions ?? [],
81 |       BATCH_LIMIT,
82 |       async (batch) => {
83 |         await supabase.from("transactions").upsert(batch, {
84 |           onConflict: "internal_id",
85 |           ignoreDuplicates: false,
86 |         });
87 |
88 |         return batch;
89 |       },
90 |     );
91 |   },
92 | });
```

apps/dashboard/jobs/tasks/transactions/update-base-currency.ts
```
1 | import { createClient } from "@midday/supabase/job";
2 | import { schemaTask } from "@trigger.dev/sdk/v3";
3 | import { revalidateCache } from "jobs/utils/revalidate-cache";
4 | import { triggerSequenceAndWait } from "jobs/utils/trigger-sequence";
5 | import { z } from "zod";
6 | import { updateAccountBaseCurrency } from "./update-account-base-currency";
7 |
8 | export const updateBaseCurrency = schemaTask({
9 |   id: "update-base-currency",
10 |   schema: z.object({
11 |     teamId: z.string().uuid(),
12 |     baseCurrency: z.string(),
13 |   }),
14 |   maxDuration: 300,
15 |   queue: {
16 |     concurrencyLimit: 10,
17 |   },
18 |   run: async ({ teamId, baseCurrency }) => {
19 |     const supabase = createClient();
20 |
21 |     // Get all enabled accounts
22 |     const { data: accountsData } = await supabase
23 |       .from("bank_accounts")
24 |       .select("id, currency, balance")
25 |       .eq("team_id", teamId)
26 |       .eq("enabled", true);
27 |
28 |     if (!accountsData) {
29 |       return;
30 |     }
31 |
32 |     const formattedAccounts = accountsData.map((account) => ({
33 |       accountId: account.id,
34 |       currency: account.currency,
35 |       balance: account.balance,
36 |       baseCurrency,
37 |     }));
38 |
39 |     if (formattedAccounts.length > 0) {
40 |       await triggerSequenceAndWait(
41 |         formattedAccounts,
42 |         updateAccountBaseCurrency,
43 |         {
44 |           delayMinutes: 0,
45 |         },
46 |       );
47 |
48 |       await revalidateCache({ tag: "bank", id: teamId });
49 |     }
50 |   },
51 | });
```

apps/dashboard/src/actions/ai/assistant-settings-action.ts
```
1 | "use server";
2 |
3 | import { revalidatePath } from "next/cache";
4 | import { authActionClient } from "../safe-action";
5 | import { assistantSettingsSchema } from "../schema";
6 | import { getAssistantSettings, setAssistantSettings } from "./storage";
7 |
8 | export const assistantSettingsAction = authActionClient
9 |   .schema(assistantSettingsSchema)
10 |   .metadata({
11 |     name: "assistant-settings",
12 |   })
13 |   .action(async ({ parsedInput: params, ctx: { user } }) => {
14 |     const settings = await getAssistantSettings();
15 |
16 |     await setAssistantSettings({
17 |       settings,
18 |       params,
19 |       userId: user?.id,
20 |       teamId: user?.team_id,
21 |     });
22 |
23 |     revalidatePath("/account/assistant");
24 |
25 |     return params;
26 |   });
```

apps/dashboard/src/actions/ai/clear-history-action.ts
```
1 | "use server";
2 |
3 | import { authActionClient } from "../safe-action";
4 | import { clearChats } from "./storage";
5 |
6 | export const clearHistoryAction = authActionClient
7 |   .metadata({
8 |     name: "clear-history",
9 |   })
10 |   .action(async ({ ctx: { user } }) => {
11 |     return clearChats({
12 |       teamId: user?.team_id,
13 |       userId: user?.id,
14 |     });
15 |   });
```

apps/dashboard/src/actions/ai/find-matching-category.ts
```
1 | "use server";
2 |
3 | import { openai } from "@ai-sdk/openai";
4 | import { streamObject } from "ai";
5 | import { createStreamableValue } from "ai/rsc";
6 | import { z } from "zod";
7 |
8 | export async function findMatchingCategory(
9 |   prompt: string,
10 |   categories: string[],
11 | ) {
12 |   const stream = createStreamableValue();
13 |
14 |   (async () => {
15 |     const { partialObjectStream } = await streamObject({
16 |       model: openai("gpt-4o-mini"),
17 |       system: `You are an AI assistant specialized in categorizing financial transactions.
18 |                Your task is to analyze the given transaction description and match it to the most appropriate category from the provided list.
19 |                Only use categories from the list provided. If no category seems to fit, respond with 'Uncategorized'.
20 |                Consider common financial terms, merchant names, and transaction patterns in your analysis.
21 |                Categories: ${categories.join("\n")}
22 |       `,
23 |       schema: z.object({
24 |         category: z
25 |           .string()
26 |           .describe("The category name that matches the prompt"),
27 |       }),
28 |       prompt,
29 |       temperature: 0.5,
30 |     });
31 |
32 |     for await (const partialObject of partialObjectStream) {
33 |       stream.update(partialObject);
34 |     }
35 |
36 |     stream.done();
37 |   })();
38 |
39 |   return { object: stream.value };
40 | }
```

apps/dashboard/src/actions/ai/generate-csv-mapping.ts
```
1 | "use server";
2 |
3 | import { openai } from "@ai-sdk/openai";
4 | import { streamObject } from "ai";
5 | import { createStreamableValue } from "ai/rsc";
6 | import { z } from "zod";
7 |
8 | export async function generateCsvMapping(
9 |   fieldColumns: string[],
10 |   firstRows: Record<string, string>[],
11 | ) {
12 |   const stream = createStreamableValue();
13 |
14 |   (async () => {
15 |     const { partialObjectStream } = await streamObject({
16 |       model: openai("gpt-4o-mini"),
17 |       schema: z.object({
18 |         date: z
19 |           .date()
20 |           .transform((value) => new Date(value))
21 |           .describe(
22 |             "The date of the transaction, return it in ISO-8601 format",
23 |           ),
24 |         description: z.string().describe("The text describing the transaction"),
25 |         amount: z
26 |           .number()
27 |           .describe(
28 |             "The amount involved in the transaction, including the minus sign if present",
29 |           ),
30 |         balance: z
31 |           .number()
32 |           .optional()
33 |           .describe(
34 |             "The balance of the account after the transaction, typically a cumulative value that changes with each transaction. It's usually a larger number compared to individual transaction amounts.",
35 |           ),
36 |       }),
37 |       prompt: `
38 |         The following columns are the headings from a CSV import file for importing a transactions.
39 |         Map these column names to the correct fields in our database (date, description, amount, balance) by providing the matching column name for each field.
40 |         You may also consult the first few rows of data to help you make the mapping, but you are mapping the columns, not the values.
41 |         If you are not sure or there is no matching column, omit the value.
42 |
43 |         Columns:
44 |         ${fieldColumns.join(",")}
45 |
46 |         First few rows of data:
47 |         ${firstRows.map((row) => JSON.stringify(row)).join("\n")}
48 |       `,
49 |       temperature: 0.2,
50 |     });
51 |
52 |     for await (const partialObject of partialObjectStream) {
53 |       stream.update(partialObject);
54 |     }
55 |
56 |     stream.done();
57 |   })();
58 |
59 |   return { object: stream.value };
60 | }
```

apps/dashboard/src/actions/ai/get-vat-rate.ts
```
1 | "use server";
2 |
3 | import { openai } from "@ai-sdk/openai";
4 | import { getCountry } from "@midday/location";
5 | import { generateObject } from "ai";
6 | import { z } from "zod";
7 | import { authActionClient } from "../safe-action";
8 | import { getVatRateSchema } from "../schema";
9 |
10 | export const getVatRateAction = authActionClient
11 |   .schema(getVatRateSchema)
12 |   .metadata({
13 |     name: "get-vat-rate",
14 |   })
15 |   .action(async ({ parsedInput: { name } }) => {
16 |     const country = getCountry();
17 |
18 |     const { object } = await generateObject({
19 |       model: openai("gpt-4o-mini"),
20 |       schema: z.object({
21 |         vat: z.number().min(5).max(100),
22 |       }),
23 |       prompt: `
24 |         You are an expert in VAT rates for the specific country and category \n
25 |         What's the VAT rate for category ${name} in ${country.name}?
26 |       `,
27 |       temperature: 0.8,
28 |     });
29 |
30 |     return {
31 |       vat: object.vat,
32 |       country: country.name,
33 |     };
34 |   });
```

apps/dashboard/src/actions/ai/storage.ts
```
1 | "use server";
2 |
3 | import { client as RedisClient } from "@midday/kv";
4 | import { getSession, getUser } from "@midday/supabase/cached-queries";
5 | import type { Chat, SettingsResponse } from "./types";
6 |
7 | export async function getAssistantSettings(): Promise<SettingsResponse> {
8 |   const user = await getUser();
9 |
10 |   const teamId = user?.data?.team_id;
11 |   const userId = user?.data?.id;
12 |
13 |   const defaultSettings: SettingsResponse = {
14 |     enabled: true,
15 |   };
16 |
17 |   const settings = await RedisClient.get(
18 |     `assistant:${teamId}:user:${userId}:settings`,
19 |   );
20 |
21 |   return {
22 |     ...defaultSettings,
23 |     ...(settings || {}),
24 |   };
25 | }
26 |
27 | type SetAassistant = {
28 |   settings: SettingsResponse;
29 |   userId: string;
30 |   teamId: string;
31 |   params: {
32 |     enabled?: boolean | undefined;
33 |   };
34 | };
35 |
36 | export async function setAssistantSettings({
37 |   settings,
38 |   params,
39 |   userId,
40 |   teamId,
41 | }: SetAassistant) {
42 |   return RedisClient.set(`assistant:${teamId}:user:${userId}:settings`, {
43 |     ...settings,
44 |     ...params,
45 |   });
46 | }
47 |
48 | export async function clearChats({
49 |   teamId,
50 |   userId,
51 | }: { teamId: string; userId: string }) {
52 |   const chats: string[] = await RedisClient.zrange(
53 |     `chat:${teamId}:user:${userId}`,
54 |     0,
55 |     -1,
56 |   );
57 |
58 |   const pipeline = RedisClient.pipeline();
59 |
60 |   for (const chat of chats) {
61 |     pipeline.del(chat);
62 |     pipeline.zrem(`chat:${teamId}:user:${userId}`, chat);
63 |   }
64 |
65 |   await pipeline.exec();
66 | }
67 |
68 | export async function getLatestChat() {
69 |   const settings = await getAssistantSettings();
70 |   if (!settings?.enabled) return null;
71 |
72 |   const user = await getUser();
73 |
74 |   const teamId = user?.data?.team_id;
75 |   const userId = user?.data?.id;
76 |
77 |   try {
78 |     const chat: string[] = await RedisClient.zrange(
79 |       `chat:${teamId}:user:${userId}`,
80 |       0,
81 |       1,
82 |       {
83 |         rev: true,
84 |       },
85 |     );
86 |
87 |     const lastId = chat.at(0);
88 |
89 |     if (lastId) {
90 |       return RedisClient.hgetall(lastId);
91 |     }
92 |   } catch (error) {
93 |     return null;
94 |   }
95 | }
96 |
97 | export async function getChats() {
98 |   const user = await getUser();
99 |
100 |   const teamId = user?.data?.team_id;
101 |   const userId = user?.data?.id;
102 |
103 |   try {
104 |     const pipeline = RedisClient.pipeline();
105 |     const chats: string[] = await RedisClient.zrange(
106 |       `chat:${teamId}:user:${userId}`,
107 |       0,
108 |       -1,
109 |       {
110 |         rev: true,
111 |       },
112 |     );
113 |
114 |     for (const chat of chats) {
115 |       pipeline.hgetall(chat);
116 |     }
117 |
118 |     const results = await pipeline.exec();
119 |
120 |     return results as Chat[];
121 |   } catch (error) {
122 |     return [];
123 |   }
124 | }
125 |
126 | export async function getChat(id: string) {
127 |   const {
128 |     data: { session },
129 |   } = await getSession();
130 |
131 |   const userId = session?.user?.id;
132 |
133 |   const chat = await RedisClient.hgetall<Chat>(`chat:${id}`);
134 |
135 |   if (!chat || (userId && chat.userId !== userId)) {
136 |     return null;
137 |   }
138 |
139 |   return chat;
140 | }
141 |
142 | export async function saveChat(chat: Chat) {
143 |   const pipeline = RedisClient.pipeline();
144 |   pipeline.hmset(`chat:${chat.id}`, chat);
145 |
146 |   const chatKey = `chat:${chat.teamId}:user:${chat.userId}`;
147 |
148 |   pipeline
149 |     .zadd(chatKey, {
150 |       score: Date.now(),
151 |       member: `chat:${chat.id}`,
152 |     })
153 |     // Expire in 30 days
154 |     .expire(chatKey, 2592000);
155 |
156 |   await pipeline.exec();
157 | }
```

apps/dashboard/src/actions/ai/types.ts
```
1 | import type { CoreMessage } from "ai";
2 | import type { ReactNode } from "react";
3 |
4 | export type Message = CoreMessage & {
5 |   id: string;
6 | };
7 |
8 | export interface Chat extends Record<string, unknown> {
9 |   id: string;
10 |   title: string;
11 |   createdAt: Date;
12 |   userId: string;
13 |   teamId: string;
14 |   messages: Message[];
15 | }
16 |
17 | export type SettingsResponse = {
18 |   enabled: boolean;
19 | };
20 |
21 | export type User = {
22 |   id: string;
23 |   team_id: string;
24 |   full_name: string;
25 |   avatar_url: string;
26 | };
27 |
28 | export type AIState = {
29 |   chatId: string;
30 |   user: User;
31 |   messages: Message[];
32 | };
33 |
34 | export type UIState = {
35 |   id: string;
36 |   display: React.ReactNode;
37 | }[];
38 |
39 | export interface ServerMessage {
40 |   role: "user" | "assistant" | "tool";
41 |   content: string;
42 | }
43 |
44 | export interface ClientMessage {
45 |   id: string;
46 |   role: "user" | "assistant";
47 |   display: ReactNode;
48 | }
49 |
50 | type ValueOrUpdater<T> = T | ((prevState: T) => T);
51 |
52 | export type MutableAIState = {
53 |   get: () => AIState;
54 |   update: (newState: ValueOrUpdater<AIState>) => void;
55 |   done: ((newState: AIState) => void) | (() => void);
56 | };
```

apps/dashboard/src/actions/customer/create-customer-tag-action.ts
```
1 | "use server";
2 |
3 | import { LogEvents } from "@midday/events/events";
4 | import { revalidateTag } from "next/cache";
5 | import { authActionClient } from "../safe-action";
6 | import { createCustomerTagSchema } from "./schema";
7 |
8 | export const createCustomerTagAction = authActionClient
9 |   .schema(createCustomerTagSchema)
10 |   .metadata({
11 |     name: "create-customer-tag",
12 |     track: {
13 |       event: LogEvents.CreateCustomerTag.name,
14 |       channel: LogEvents.CreateCustomerTag.channel,
15 |     },
16 |   })
17 |   .action(
18 |     async ({ parsedInput: { tagId, customerId }, ctx: { user, supabase } }) => {
19 |       const { data } = await supabase.from("customer_tags").insert({
20 |         tag_id: tagId,
21 |         customer_id: customerId,
22 |         team_id: user.team_id!,
23 |       });
24 |
25 |       revalidateTag(`customers_${user.team_id}`);
26 |
27 |       return data;
28 |     },
29 |   );
```

apps/dashboard/src/actions/customer/delete-customer-tag-action.ts
```
1 | "use server";
2 |
3 | import { LogEvents } from "@midday/events/events";
4 | import { revalidateTag } from "next/cache";
5 | import { authActionClient } from "../safe-action";
6 | import { deleteCustomerTagSchema } from "./schema";
7 |
8 | export const deleteCustomerTagAction = authActionClient
9 |   .schema(deleteCustomerTagSchema)
10 |   .metadata({
11 |     name: "delete-customer-tag",
12 |     track: {
13 |       event: LogEvents.DeleteCustomerTag.name,
14 |       channel: LogEvents.DeleteCustomerTag.channel,
15 |     },
16 |   })
17 |   .action(
18 |     async ({ parsedInput: { tagId, customerId }, ctx: { user, supabase } }) => {
19 |       const { data } = await supabase
20 |         .from("customer_tags")
21 |         .delete()
22 |         .eq("customer_id", customerId)
23 |         .eq("tag_id", tagId);
24 |
25 |       revalidateTag(`customers_${user.team_id}`);
26 |
27 |       return data;
28 |     },
29 |   );
```

apps/dashboard/src/actions/customer/schema.ts
```
1 | import { z } from "zod";
2 |
3 | export const deleteCustomerTagSchema = z.object({
4 |   tagId: z.string(),
5 |   customerId: z.string(),
6 | });
7 |
8 | export const createCustomerTagSchema = z.object({
9 |   tagId: z.string(),
10 |   customerId: z.string(),
11 | });
```

apps/dashboard/src/actions/inbox/filter.ts
```
1 | "use server";
2 |
3 | import { authActionClient } from "@/actions/safe-action";
4 | import { inboxFilterSchema } from "@/actions/schema";
5 | import { Cookies } from "@/utils/constants";
6 | import { addYears } from "date-fns";
7 | import { cookies } from "next/headers";
8 |
9 | export const changeInboxFilterAction = authActionClient
10 |   .schema(inboxFilterSchema)
11 |   .metadata({
12 |     name: "change-inbox-filter",
13 |   })
14 |   .action(({ parsedInput: value }) => {
15 |     cookies().set({
16 |       name: Cookies.InboxFilter,
17 |       value: value,
18 |       expires: addYears(new Date(), 1),
19 |     });
20 |
21 |     return Promise.resolve(value);
22 |   });
```

apps/dashboard/src/actions/inbox/order.ts
```
1 | "use server";
2 |
3 | import { authActionClient } from "@/actions/safe-action";
4 | import { inboxOrder } from "@/actions/schema";
5 | import { Cookies } from "@/utils/constants";
6 | import { addYears } from "date-fns";
7 | import { revalidatePath } from "next/cache";
8 | import { cookies } from "next/headers";
9 |
10 | export const inboxOrderAction = authActionClient
11 |   .schema(inboxOrder)
12 |   .metadata({
13 |     name: "inbox-order",
14 |   })
15 |   .action(({ parsedInput: value }) => {
16 |     cookies().set({
17 |       name: Cookies.InboxOrder,
18 |       value: value.toString(),
19 |       expires: addYears(new Date(), 1),
20 |     });
21 |
22 |     revalidatePath("/inbox");
23 |
24 |     return Promise.resolve(value);
25 |   });
```

apps/dashboard/src/actions/inbox/update.ts
```
1 | "use server";
2 |
3 | import { authActionClient } from "@/actions/safe-action";
4 | import { updateInboxSchema } from "@/actions/schema";
5 | import { updateInboxById } from "@midday/supabase/mutations";
6 | import { revalidatePath, revalidateTag } from "next/cache";
7 |
8 | export const updateInboxAction = authActionClient
9 |   .schema(updateInboxSchema)
10 |   .metadata({
11 |     name: "update-inbox",
12 |   })
13 |   .action(async ({ parsedInput: params, ctx: { user, supabase } }) => {
14 |     const teamId = user.team_id;
15 |
16 |     await updateInboxById(supabase, {
17 |       ...params,
18 |       teamId,
19 |     });
20 |
21 |     revalidatePath("/inbox");
22 |     revalidateTag(`transactions_${teamId}`);
23 |
24 |     return null;
25 |   });
```

apps/dashboard/src/actions/institutions/create-gocardless-link.ts
```
1 | "use server";
2 |
3 | import { client } from "@midday/engine/client";
4 | import { LogEvents } from "@midday/events/events";
5 | import { redirect } from "next/navigation";
6 | import { authActionClient } from "../safe-action";
7 | import { createGoCardLessLinkSchema } from "../schema";
8 |
9 | export const createGoCardLessLinkAction = authActionClient
10 |   .schema(createGoCardLessLinkSchema)
11 |   .metadata({
12 |     name: "create-gocardless-link",
13 |   })
14 |   .action(
15 |     async ({
16 |       parsedInput: {
17 |         institutionId,
18 |         availableHistory,
19 |         redirectBase,
20 |         step = "account",
21 |       },
22 |       ctx: { analytics, user },
23 |     }) => {
24 |       await client.institutions[":id"].usage.$put({
25 |         param: {
26 |           id: institutionId,
27 |         },
28 |       });
29 |
30 |       const redirectTo = new URL(redirectBase);
31 |
32 |       redirectTo.searchParams.append("step", step);
33 |       redirectTo.searchParams.append("provider", "gocardless");
34 |
35 |       analytics.track({
36 |         event: LogEvents.GoCardLessLinkCreated.name,
37 |         institutionId,
38 |         availableHistory,
39 |         redirectBase,
40 |         step,
41 |       });
42 |
43 |       try {
44 |         const agreementResponse = await client.auth.gocardless.agreement.$post({
45 |           json: {
46 |             institutionId,
47 |             transactionTotalDays: availableHistory,
48 |           },
49 |         });
50 |
51 |         const { data: agreementData } = await agreementResponse.json();
52 |
53 |         const linkResponse = await client.auth.gocardless.link.$post({
54 |           json: {
55 |             agreement: agreementData.id,
56 |             institutionId,
57 |             redirect: redirectTo.toString(),
58 |           },
59 |         });
60 |
61 |         const { data: linkData } = await linkResponse.json();
62 |
63 |         return redirect(linkData.link);
64 |       } catch (error) {
65 |         // Ignore NEXT_REDIRECT error in analytics
66 |         if (error instanceof Error && error.message !== "NEXT_REDIRECT") {
67 |           analytics.track({
68 |             event: LogEvents.GoCardLessLinkFailed.name,
69 |             institutionId,
70 |             availableHistory,
71 |             redirectBase,
72 |           });
73 |
74 |           throw error;
75 |         }
76 |
77 |         throw error;
78 |       }
79 |     },
80 |   );
```

apps/dashboard/src/actions/institutions/create-plaid-link.ts
```
1 | "use server";
2 |
3 | import { client } from "@midday/engine/client";
4 | import { getSession } from "@midday/supabase/cached-queries";
5 |
6 | export const createPlaidLinkTokenAction = async (accessToken?: string) => {
7 |   const {
8 |     data: { session },
9 |   } = await getSession();
10 |
11 |   const plaidResponse = await client.auth.plaid.link.$post({
12 |     json: {
13 |       userId: session?.user?.id,
14 |       accessToken,
15 |     },
16 |   });
17 |
18 |   if (!plaidResponse.ok) {
19 |     throw new Error("Failed to create plaid link token");
20 |   }
21 |
22 |   const { data } = await plaidResponse.json();
23 |
24 |   return data.link_token;
25 | };
```

apps/dashboard/src/actions/institutions/get-accounts.ts
```
1 | "use server";
2 |
3 | import { client } from "@midday/engine/client";
4 |
5 | type GetAccountParams = {
6 |   id?: string;
7 |   accessToken?: string;
8 |   institutionId?: string; // Plaid
9 |   provider: "gocardless" | "teller" | "plaid";
10 | };
11 |
12 | export async function getAccounts({
13 |   id,
14 |   provider,
15 |   accessToken,
16 |   institutionId,
17 | }: GetAccountParams) {
18 |   const accountsResponse = await client.accounts.$get({
19 |     query: {
20 |       id,
21 |       provider,
22 |       accessToken,
23 |       institutionId,
24 |     },
25 |   });
26 |
27 |   if (!accountsResponse.ok) {
28 |     throw new Error("Failed to get accounts");
29 |   }
30 |
31 |   const { data } = await accountsResponse.json();
32 |
33 |   return {
34 |     data: data.sort((a, b) => b.balance.amount - a.balance.amount),
35 |   };
36 | }
```

apps/dashboard/src/actions/institutions/get-institutions.ts
```
1 | "use server";
2 |
3 | import { logger } from "@/utils/logger";
4 | import { client } from "@midday/engine/client";
5 |
6 | type GetAccountParams = {
7 |   countryCode: string;
8 |   query?: string;
9 | };
10 |
11 | export async function getInstitutions({
12 |   countryCode,
13 |   query,
14 | }: GetAccountParams) {
15 |   try {
16 |     const institutionsResponse = await client.institutions.$get({
17 |       query: {
18 |         countryCode,
19 |         q: query,
20 |       },
21 |     });
22 |
23 |     if (!institutionsResponse.ok) {
24 |       throw new Error("Failed to get institutions");
25 |     }
26 |
27 |     return institutionsResponse.json();
28 |   } catch (error) {
29 |     logger(error instanceof Error ? error.message : String(error));
30 |     return [];
31 |   }
32 | }
```

apps/dashboard/src/actions/institutions/reconnect-gocardless-link.tsx
```
1 | "use server";
2 |
3 | import { client } from "@midday/engine/client";
4 | import { nanoid } from "nanoid";
5 | import { redirect } from "next/navigation";
6 | import { z } from "zod";
7 | import { authActionClient } from "../safe-action";
8 |
9 | export const reconnectGoCardLessLinkAction = authActionClient
10 |   .schema(
11 |     z.object({
12 |       id: z.string(),
13 |       institutionId: z.string(),
14 |       availableHistory: z.number(),
15 |       isDesktop: z.boolean(),
16 |       redirectTo: z.string(),
17 |     }),
18 |   )
19 |   .metadata({
20 |     name: "create-gocardless-link",
21 |   })
22 |   .action(
23 |     async ({
24 |       parsedInput: {
25 |         id,
26 |         institutionId,
27 |         availableHistory,
28 |         redirectTo,
29 |         isDesktop,
30 |       },
31 |       ctx: { user },
32 |     }) => {
33 |       const reference = `${user.team_id}:${nanoid()}`;
34 |
35 |       const link = new URL(redirectTo);
36 |
37 |       link.searchParams.append("id", id);
38 |
39 |       if (isDesktop) {
40 |         link.searchParams.append("desktop", "true");
41 |       }
42 |
43 |       const agreementResponse = await client.auth.gocardless.agreement.$post({
44 |         json: {
45 |           institutionId,
46 |           transactionTotalDays: availableHistory,
47 |         },
48 |       });
49 |
50 |       const { data: agreementData } = await agreementResponse.json();
51 |
52 |       const linkResponse = await client.auth.gocardless.link.$post({
53 |         json: {
54 |           agreement: agreementData.id,
55 |           institutionId,
56 |           redirect: link.toString(),
57 |           // In the reconnect flow we need the reference based on the team
58 |           // so we can find the correct requestion id on success and update the current reference
59 |           reference,
60 |         },
61 |       });
62 |
63 |       const { data: linkData } = await linkResponse.json();
64 |
65 |       if (!linkResponse.ok) {
66 |         throw new Error("Failed to create link");
67 |       }
68 |
69 |       return redirect(linkData.link);
70 |     },
71 |   );
```

apps/dashboard/src/actions/institutions/update-institution-usage.ts
```
1 | "use server";
2 |
3 | import { client } from "@midday/engine/client";
4 | import { authActionClient } from "../safe-action";
5 | import { updateInstitutionUsageSchema } from "../schema";
6 |
7 | export const updateInstitutionUsageAction = authActionClient
8 |   .schema(updateInstitutionUsageSchema)
9 |   .metadata({
10 |     name: "update-institution-usage",
11 |   })
12 |   .action(async ({ parsedInput: { institutionId } }) => {
13 |     const usageResponse = await client.institutions[":id"].usage.$put({
14 |       param: {
15 |         id: institutionId,
16 |       },
17 |     });
18 |
19 |     if (!usageResponse.ok) {
20 |       throw new Error("Failed to update institution usage");
21 |     }
22 |
23 |     return usageResponse.json();
24 |   });
```

apps/dashboard/src/actions/invoice/create-invoice-action.ts
```
1 | "use server";
2 |
3 | import { authActionClient } from "@/actions/safe-action";
4 | import { tasks } from "@trigger.dev/sdk/v3";
5 | import { revalidateTag } from "next/cache";
6 | import { createInvoiceSchema } from "./schema";
7 |
8 | export const createInvoiceAction = authActionClient
9 |   .metadata({
10 |     name: "create-invoice",
11 |   })
12 |   .schema(createInvoiceSchema)
13 |   .action(
14 |     async ({ parsedInput: { id, deliveryType }, ctx: { supabase, user } }) => {
15 |       const teamId = user.team_id;
16 |
17 |       const { data: draft } = await supabase
18 |         .from("invoices")
19 |         .select("id, template")
20 |         .eq("id", id)
21 |         .single();
22 |
23 |       if (!draft) {
24 |         throw new Error("Draft not found");
25 |       }
26 |
27 |       // Update the invoice status to unpaid
28 |       const { data: invoice } = await supabase
29 |         .from("invoices")
30 |         .update({ status: "unpaid" })
31 |         .eq("id", id)
32 |         .select("*")
33 |         .single();
34 |
35 |       // Only send the email if the delivery type is create_and_send
36 |       if (deliveryType === "create_and_send") {
37 |         await tasks.trigger("send-invoice-email", {
38 |           invoiceId: invoice?.id,
39 |         });
40 |       }
41 |
42 |       await tasks.trigger("generate-invoice", {
43 |         invoiceId: invoice?.id,
44 |       });
45 |
46 |       revalidateTag(`invoice_summary_${teamId}`);
47 |       revalidateTag(`invoices_${teamId}`);
48 |       revalidateTag(`invoice_number_${teamId}`);
49 |
50 |       return invoice;
51 |     },
52 |   );
```

apps/dashboard/src/actions/invoice/delete-invoice-action.ts
```
1 | "use server";
2 |
3 | import { authActionClient } from "@/actions/safe-action";
4 | import { revalidateTag } from "next/cache";
5 | import { deleteInvoiceSchema } from "./schema";
6 |
7 | export const deleteInvoiceAction = authActionClient
8 |   .metadata({
9 |     name: "delete-invoice",
10 |   })
11 |   .schema(deleteInvoiceSchema)
12 |   .action(async ({ parsedInput: { id }, ctx: { user, supabase } }) => {
13 |     const teamId = user.team_id;
14 |
15 |     const { data } = await supabase
16 |       .from("invoices")
17 |       .delete()
18 |       .eq("id", id)
19 |       .select("*")
20 |       .single();
21 |
22 |     revalidateTag(`invoices_${teamId}`);
23 |     revalidateTag(`invoice_summary_${teamId}`);
24 |     revalidateTag(`invoice_number_${teamId}`);
25 |
26 |     return data;
27 |   });
```

apps/dashboard/src/actions/invoice/draft-invoice-action.ts
```
1 | "use server";
2 |
3 | import { authActionClient } from "@/actions/safe-action";
4 | import { parseInputValue } from "@/components/invoice/utils";
5 | import { generateToken } from "@midday/invoice/token";
6 | import { revalidateTag } from "next/cache";
7 | import { draftInvoiceSchema } from "./schema";
8 |
9 | export const draftInvoiceAction = authActionClient
10 |   .metadata({
11 |     name: "draft-invoice",
12 |   })
13 |   .schema(draftInvoiceSchema)
14 |   .action(
15 |     async ({
16 |       parsedInput: {
17 |         id,
18 |         template,
19 |         customer_details,
20 |         payment_details,
21 |         from_details,
22 |         note_details,
23 |         token: draftToken,
24 |         ...input
25 |       },
26 |       ctx: { user, supabase },
27 |     }) => {
28 |       const teamId = user.team_id;
29 |
30 |       // Only generate token if it's not provided, ie. when the invoice is created
31 |       const token = draftToken ?? (await generateToken(id));
32 |
33 |       const {
34 |         payment_details: _,
35 |         from_details: __,
36 |         ...restTemplate
37 |       } = template;
38 |
39 |       const { data } = await supabase
40 |         .from("invoices")
41 |         .upsert(
42 |           {
43 |             id,
44 |             team_id: teamId,
45 |             currency: template.currency?.toUpperCase(),
46 |             payment_details: parseInputValue(payment_details),
47 |             from_details: parseInputValue(from_details),
48 |             customer_details: parseInputValue(customer_details),
49 |             note_details: parseInputValue(note_details),
50 |             token,
51 |             user_id: user.id,
52 |             template: restTemplate,
53 |             ...input,
54 |           },
55 |           {
56 |             onConflict: "id",
57 |             merge: true,
58 |           },
59 |         )
60 |         .select("*")
61 |         .single();
62 |
63 |       revalidateTag(`invoice_summary_${teamId}`);
64 |       revalidateTag(`invoices_${teamId}`);
65 |       revalidateTag(`invoice_number_${teamId}`);
66 |
67 |       return data;
68 |     },
69 |   );
```

apps/dashboard/src/actions/invoice/schema.ts
```
1 | import { z } from "zod";
2 |
3 | export const deleteInvoiceSchema = z.object({
4 |   id: z.string(),
5 | });
6 |
7 | export const updateInvoiceSchema = z.object({
8 |   id: z.string(),
9 |   status: z.enum(["paid", "canceled", "unpaid"]).optional(),
10 |   paid_at: z.string().nullable().optional(),
11 |   internal_note: z.string().nullable().optional(),
12 | });
13 |
14 | export const updateInvoiceTemplateSchema = z.object({
15 |   customer_label: z.string().optional(),
16 |   title: z.string().optional(),
17 |   from_label: z.string().optional(),
18 |   invoice_no_label: z.string().optional(),
19 |   issue_date_label: z.string().optional(),
20 |   due_date_label: z.string().optional(),
21 |   description_label: z.string().optional(),
22 |   price_label: z.string().optional(),
23 |   quantity_label: z.string().optional(),
24 |   total_label: z.string().optional(),
25 |   total_summary_label: z.string().optional(),
26 |   vat_label: z.string().optional(),
27 |   subtotal_label: z.string().optional(),
28 |   tax_label: z.string().optional(),
29 |   discount_label: z.string().optional(),
30 |   timezone: z.string().optional(),
31 |   payment_label: z.string().optional(),
32 |   note_label: z.string().optional(),
33 |   logo_url: z.string().optional().nullable(),
34 |   currency: z.string().optional(),
35 |   payment_details: z.string().optional().nullable(),
36 |   from_details: z.string().optional().nullable(),
37 |   date_format: z.string().optional(),
38 |   include_vat: z.boolean().optional().optional(),
39 |   include_tax: z.boolean().optional().optional(),
40 |   include_discount: z.boolean().optional(),
41 |   include_decimals: z.boolean().optional(),
42 |   include_units: z.boolean().optional(),
43 |   include_qr: z.boolean().optional(),
44 |   tax_rate: z.number().min(0).max(100).optional(),
45 |   vat_rate: z.number().min(0).max(100).optional(),
46 |   size: z.enum(["a4", "letter"]).optional(),
47 |   delivery_type: z.enum(["create", "create_and_send"]).optional(),
48 |   locale: z.string().optional(),
49 | });
50 |
51 | export const draftLineItemSchema = z.object({
52 |   name: z.string().optional(),
53 |   quantity: z.number().min(0, "Quantity must be at least 0").optional(),
54 |   unit: z.string().optional().nullable(),
55 |   price: z.number().safe().optional(),
56 |   vat: z.number().min(0, "VAT must be at least 0").optional(),
57 |   tax: z.number().min(0, "Tax must be at least 0").optional(),
58 | });
59 |
60 | export const draftInvoiceSchema = z.object({
61 |   id: z.string().uuid(),
62 |   template: updateInvoiceTemplateSchema,
63 |   from_details: z.string().nullable().optional(),
64 |   customer_details: z.string().nullable().optional(),
65 |   customer_id: z.string().uuid().nullable().optional(),
66 |   customer_name: z.string().nullable().optional(),
67 |   payment_details: z.string().nullable().optional(),
68 |   note_details: z.string().nullable().optional(),
69 |   due_date: z.coerce.date(),
70 |   issue_date: z.coerce.date(),
71 |   invoice_number: z.string(),
72 |   logo_url: z.string().optional().nullable(),
73 |   vat: z.number().nullable().optional(),
74 |   tax: z.number().nullable().optional(),
75 |   discount: z.number().nullable().optional(),
76 |   subtotal: z.number().nullable().optional(),
77 |   top_block: z.any().nullable().optional(),
78 |   bottom_block: z.any().nullable().optional(),
79 |   amount: z.number().nullable().optional(),
80 |   line_items: z.array(draftLineItemSchema).optional(),
81 |   token: z.string().optional(),
82 | });
83 |
84 | export const lineItemSchema = z.object({
85 |   name: z.string().min(1, "Name is required"),
86 |   quantity: z.number().min(0, "Quantity must be at least 0"),
87 |   unit: z.string().optional(),
88 |   price: z.number(),
89 |   vat: z.number().min(0, "VAT must be at least 0").optional(),
90 |   tax: z.number().min(0, "Tax must be at least 0").optional(),
91 | });
92 |
93 | export const invoiceTemplateSchema = z.object({
94 |   title: z.string().optional(),
95 |   customer_label: z.string(),
96 |   from_label: z.string(),
97 |   invoice_no_label: z.string(),
98 |   issue_date_label: z.string(),
99 |   due_date_label: z.string(),
100 |   description_label: z.string(),
101 |   price_label: z.string(),
102 |   quantity_label: z.string(),
103 |   total_label: z.string(),
104 |   total_summary_label: z.string().optional(),
105 |   vat_label: z.string().optional(),
106 |   subtotal_label: z.string().optional(),
107 |   tax_label: z.string().optional(),
108 |   discount_label: z.string().optional(),
109 |   payment_label: z.string(),
110 |   note_label: z.string(),
111 |   logo_url: z.string().optional().nullable(),
112 |   currency: z.string(),
113 |   payment_details: z.any().nullable().optional(),
114 |   from_details: z.any().nullable().optional(),
115 |   size: z.enum(["a4", "letter"]),
116 |   include_vat: z.boolean().optional(),
117 |   include_tax: z.boolean().optional(),
118 |   include_discount: z.boolean().optional(),
[TRUNCATED]
```

apps/dashboard/src/actions/invoice/send-reminder-action.ts
```
1 | "use server";
2 |
3 | import { authActionClient } from "@/actions/safe-action";
4 | import { resend } from "@/utils/resend";
5 | import { UTCDate } from "@date-fns/utc";
6 | import { InvoiceReminderEmail } from "@midday/email/emails/invoice-reminder";
7 | import { getAppUrl } from "@midday/utils/envs";
8 | import { render } from "@react-email/render";
9 | import { nanoid } from "nanoid";
10 | import { z } from "zod";
11 |
12 | export const sendReminderAction = authActionClient
13 |   .metadata({
14 |     name: "send-reminder",
15 |   })
16 |   .schema(z.object({ id: z.string().uuid() }))
17 |   .action(async ({ parsedInput: { id }, ctx: { supabase, user } }) => {
18 |     const { email, name } = user.team;
19 |
20 |     const { data: invoice } = await supabase
21 |       .from("invoices")
22 |       .select("id, token, invoice_number, customer:customer_id(name, email)")
23 |       .eq("id", id)
24 |       .single();
25 |
26 |     if (!invoice) {
27 |       throw new Error("Invoice not found");
28 |     }
29 |
30 |     await resend.emails.send({
31 |       from: "Midday <middaybot@midday.ai>",
32 |       to: invoice.customer.email,
33 |       reply_to: email,
34 |       subject: `Reminder: Payment for ${invoice.invoice_number}`,
35 |       headers: {
36 |         "X-Entity-Ref-ID": nanoid(),
37 |       },
38 |       html: await render(
39 |         InvoiceReminderEmail({
40 |           companyName: invoice.customer.name,
41 |           teamName: name,
42 |           invoiceNumber: invoice.invoice_number,
43 |           link: `${getAppUrl()}/i/${invoice.token}`,
44 |         }),
45 |       ),
46 |     });
47 |
48 |     const { data } = await supabase
49 |       .from("invoices")
50 |       .update({ reminder_sent_at: new UTCDate().toISOString() })
51 |       .eq("id", id)
52 |       .select("*")
53 |       .single();
54 |
55 |     return data;
56 |   });
```

apps/dashboard/src/actions/invoice/update-invoice-action.ts
```
1 | "use server";
2 |
3 | import { authActionClient } from "@/actions/safe-action";
4 | import { revalidateTag } from "next/cache";
5 | import { updateInvoiceSchema } from "./schema";
6 |
7 | export const updateInvoiceAction = authActionClient
8 |   .metadata({
9 |     name: "update-invoice",
10 |   })
11 |   .schema(updateInvoiceSchema)
12 |   .action(
13 |     async ({ parsedInput: { id, ...input }, ctx: { user, supabase } }) => {
14 |       const teamId = user.team_id;
15 |
16 |       const { data } = await supabase
17 |         .from("invoices")
18 |         .update(input)
19 |         .eq("id", id)
20 |         .select("*")
21 |         .single();
22 |
23 |       revalidateTag(`invoice_summary_${teamId}`);
24 |       revalidateTag(`invoices_${teamId}`);
25 |       revalidateTag(`invoice_number_${teamId}`);
26 |
27 |       return data;
28 |     },
29 |   );
```

apps/dashboard/src/actions/invoice/update-invoice-template-action.ts
```
1 | "use server";
2 |
3 | import { authActionClient } from "@/actions/safe-action";
4 | import { parseInputValue } from "@/components/invoice/utils";
5 | import { revalidateTag } from "next/cache";
6 | import { updateInvoiceTemplateSchema } from "./schema";
7 |
8 | export const updateInvoiceTemplateAction = authActionClient
9 |   .metadata({
10 |     name: "update-invoice-template",
11 |   })
12 |   .schema(updateInvoiceTemplateSchema)
13 |   .action(
14 |     async ({
15 |       parsedInput: { from_details, payment_details, ...rest },
16 |       ctx: { user, supabase },
17 |     }) => {
18 |       const teamId = user.team_id;
19 |
20 |       const { data } = await supabase
21 |         .from("invoice_templates")
22 |         .upsert(
23 |           {
24 |             team_id: teamId,
25 |             from_details: parseInputValue(from_details),
26 |             payment_details: parseInputValue(payment_details),
27 |             ...rest,
28 |           },
29 |           { onConflict: "team_id" },
30 |         )
31 |         .eq("team_id", teamId)
32 |         .select()
33 |         .single();
34 |
35 |       revalidateTag(`invoice_templates_${teamId}`);
36 |
37 |       return data;
38 |     },
39 |   );
```

apps/dashboard/src/actions/project/create-project-action.ts
```
1 | "use server";
2 |
3 | import { authActionClient } from "@/actions/safe-action";
4 | import { createProjectSchema } from "@/actions/schema";
5 | import { Cookies } from "@/utils/constants";
6 | import { LogEvents } from "@midday/events/events";
7 | import { createProject } from "@midday/supabase/mutations";
8 | import { addYears } from "date-fns";
9 | import { revalidateTag } from "next/cache";
10 | import { cookies } from "next/headers";
11 |
12 | export const createProjectAction = authActionClient
13 |   .schema(createProjectSchema)
14 |   .metadata({
15 |     name: "create-project",
16 |     track: {
17 |       event: LogEvents.ProjectCreated.name,
18 |       channel: LogEvents.ProjectCreated.channel,
19 |     },
20 |   })
21 |   .action(
22 |     async ({ parsedInput: { tags, ...params }, ctx: { user, supabase } }) => {
23 |       const { data } = await createProject(supabase, {
24 |         ...params,
25 |         team_id: user.team_id!,
26 |       });
27 |
28 |       if (!data) {
29 |         throw new Error("Failed to create project");
30 |       }
31 |
32 |       if (tags?.length) {
33 |         await supabase.from("tracker_project_tags").insert(
34 |           tags.map((tag) => ({
35 |             tag_id: tag.id,
36 |             tracker_project_id: data?.id,
37 |             team_id: user.team_id!,
38 |           })),
39 |         );
40 |       }
41 |
42 |       cookies().set({
43 |         name: Cookies.LastProject,
44 |         value: data.id,
45 |         expires: addYears(new Date(), 1),
46 |       });
47 |
48 |       revalidateTag(`tracker_projects_${user.team_id}`);
49 |
50 |       return data;
51 |     },
52 |   );
```

apps/dashboard/src/actions/project/create-project-report.ts
```
1 | "use server";
2 |
3 | import { authActionClient } from "@/actions/safe-action";
4 | import { createProjectReportSchema } from "@/actions/schema";
5 | import { dub } from "@/utils/dub";
6 | import { LogEvents } from "@midday/events/events";
7 |
8 | export const createProjectReport = authActionClient
9 |   .schema(createProjectReportSchema)
10 |   .metadata({
11 |     name: "create-project-report",
12 |     track: {
13 |       event: LogEvents.ProjectReport.name,
14 |       channel: LogEvents.ProjectReport.channel,
15 |     },
16 |   })
17 |   .action(async ({ parsedInput: params, ctx: { user, supabase } }) => {
18 |     const { data } = await supabase
19 |       .from("tracker_reports")
20 |       .insert({
21 |         team_id: user.team_id,
22 |         project_id: params.projectId,
23 |         created_by: user.id,
24 |       })
25 |       .select("*")
26 |       .single();
27 |
28 |     if (!data) {
29 |       return;
30 |     }
31 |
32 |     const link = await dub.links.create({
33 |       url: `${params.baseUrl}/report/project/${data?.id}`,
34 |     });
35 |
36 |     const { data: linkData } = await supabase
37 |       .from("tracker_reports")
38 |       .update({
39 |         link_id: link.id,
40 |         short_link: link.shortLink,
41 |       })
42 |       .eq("id", data.id)
43 |       .select("*")
44 |       .single();
45 |
46 |     return linkData;
47 |   });
```

apps/dashboard/src/actions/project/create-project-tag-action.ts
```
1 | "use server";
2 |
3 | import { LogEvents } from "@midday/events/events";
4 | import { revalidateTag } from "next/cache";
5 | import { authActionClient } from "../safe-action";
6 | import { createProjectTagSchema } from "../schema";
7 |
8 | export const createProjectTagAction = authActionClient
9 |   .schema(createProjectTagSchema)
10 |   .metadata({
11 |     name: "create-project-tag",
12 |     track: {
13 |       event: LogEvents.CreateProjectTag.name,
14 |       channel: LogEvents.CreateProjectTag.channel,
15 |     },
16 |   })
17 |   .action(
18 |     async ({ parsedInput: { tagId, projectId }, ctx: { user, supabase } }) => {
19 |       const { data } = await supabase.from("tracker_project_tags").insert({
20 |         tag_id: tagId,
21 |         tracker_project_id: projectId,
22 |         team_id: user.team_id!,
23 |       });
24 |
25 |       revalidateTag(`tracker_projects_${user.team_id}`);
26 |
27 |       return data;
28 |     },
29 |   );
```

apps/dashboard/src/actions/project/delete-entries-action.ts
```
1 | "use server";
2 |
3 | import { authActionClient } from "@/actions/safe-action";
4 | import { deleteEntriesSchema } from "@/actions/schema";
5 | import { LogEvents } from "@midday/events/events";
6 | import { revalidateTag } from "next/cache";
7 |
8 | export const deleteEntriesAction = authActionClient
9 |   .schema(deleteEntriesSchema)
10 |   .metadata({
11 |     name: "delete-entries",
12 |     track: {
13 |       event: LogEvents.TrackerDeleteEntry.name,
14 |       channel: LogEvents.TrackerDeleteEntry.channel,
15 |     },
16 |   })
17 |   .action(async ({ parsedInput: params, ctx: { user, supabase } }) => {
18 |     await supabase.from("tracker_entries").delete().eq("id", params.id);
19 |
20 |     revalidateTag(`tracker_projects_${user.team_id}`);
21 |     revalidateTag(`tracker_entries_${user.team_id}`);
22 |   });
```

apps/dashboard/src/actions/project/delete-project-action.ts
```
1 | "use server";
2 |
3 | import { authActionClient } from "@/actions/safe-action";
4 | import { deleteProjectSchema } from "@/actions/schema";
5 | import { Cookies } from "@/utils/constants";
6 | import { LogEvents } from "@midday/events/events";
7 | import { revalidateTag } from "next/cache";
8 | import { cookies } from "next/headers";
9 |
10 | export const deleteProjectAction = authActionClient
11 |   .schema(deleteProjectSchema)
12 |   .metadata({
13 |     name: "delete-project",
14 |     track: {
15 |       event: LogEvents.ProjectDeleted.name,
16 |       channel: LogEvents.ProjectDeleted.channel,
17 |     },
18 |   })
19 |   .action(async ({ parsedInput: params, ctx: { user, supabase } }) => {
20 |     await supabase.from("tracker_projects").delete().eq("id", params.id);
21 |
22 |     cookies().delete(Cookies.LastProject);
23 |
24 |     revalidateTag(`tracker_projects_${user.team_id}`);
25 |   });
```

apps/dashboard/src/actions/project/delete-project-tag-action.ts
```
1 | "use server";
2 |
3 | import { LogEvents } from "@midday/events/events";
4 | import { revalidateTag } from "next/cache";
5 | import { authActionClient } from "../safe-action";
6 | import { deleteProjectTagSchema } from "../schema";
7 |
8 | export const deleteProjectTagAction = authActionClient
9 |   .schema(deleteProjectTagSchema)
10 |   .metadata({
11 |     name: "delete-project-tag",
12 |     track: {
13 |       event: LogEvents.DeleteProjectTag.name,
14 |       channel: LogEvents.DeleteProjectTag.channel,
15 |     },
16 |   })
17 |   .action(
18 |     async ({ parsedInput: { tagId, projectId }, ctx: { user, supabase } }) => {
19 |       const { data } = await supabase
20 |         .from("tracker_project_tags")
21 |         .delete()
22 |         .eq("tracker_project_id", projectId)
23 |         .eq("tag_id", tagId);
24 |
25 |       revalidateTag(`tracker_projects_${user.team_id}`);
26 |
27 |       return data;
28 |     },
29 |   );
```

apps/dashboard/src/actions/project/update-entries-action.ts
```
1 | "use server";
2 |
3 | import { authActionClient } from "@/actions/safe-action";
4 | import { updateEntriesSchema } from "@/actions/schema";
5 | import { Cookies } from "@/utils/constants";
6 | import { LogEvents } from "@midday/events/events";
7 | import { addYears } from "date-fns";
8 | import { revalidateTag } from "next/cache";
9 | import { cookies } from "next/headers";
10 |
11 | export const updateEntriesAction = authActionClient
12 |   .schema(updateEntriesSchema)
13 |   .metadata({
14 |     name: "update-entries",
15 |     track: {
16 |       event: LogEvents.TrackerCreateEntry.name,
17 |       channel: LogEvents.TrackerCreateEntry.channel,
18 |     },
19 |   })
20 |   .action(async ({ parsedInput: params, ctx: { user, supabase } }) => {
21 |     const { action, ...payload } = params;
22 |
23 |     if (action === "delete") {
24 |       await supabase.from("tracker_entries").delete().eq("id", params.id);
25 |       revalidateTag(`tracker_projects_${user.team_id}`);
26 |
27 |       return Promise.resolve(params);
28 |     }
29 |
30 |     const { data: projectData } = await supabase
31 |       .from("tracker_projects")
32 |       .select("id, rate, currency")
33 |       .eq("id", params.project_id)
34 |       .single();
35 |
36 |     const { error } = await supabase.from("tracker_entries").upsert({
37 |       ...payload,
38 |       team_id: user.team_id,
39 |       rate: projectData?.rate,
40 |       currency: projectData?.currency,
41 |     });
42 |
43 |     if (error) {
44 |       throw Error("Something went wrong.");
45 |     }
46 |
47 |     if (payload.project_id) {
48 |       cookies().set({
49 |         name: Cookies.LastProject,
50 |         value: payload.project_id,
51 |         expires: addYears(new Date(), 1),
52 |       });
53 |     }
54 |
55 |     revalidateTag(`tracker_projects_${user.team_id}`);
56 |     revalidateTag(`tracker_entries_${user.team_id}`);
57 |
58 |     return Promise.resolve(params);
59 |   });
```

apps/dashboard/src/actions/project/update-project-action.ts
```
1 | "use server";
2 |
3 | import { authActionClient } from "@/actions/safe-action";
4 | import { updateProjectSchema } from "@/actions/schema";
5 | import { LogEvents } from "@midday/events/events";
6 | import { revalidateTag } from "next/cache";
7 |
8 | export const updateProjectAction = authActionClient
9 |   .schema(updateProjectSchema)
10 |   .metadata({
11 |     name: "update-project",
12 |     track: {
13 |       event: LogEvents.ProjectUpdated.name,
14 |       channel: LogEvents.ProjectUpdated.channel,
15 |     },
16 |   })
17 |   .action(async ({ parsedInput: params, ctx: { user, supabase } }) => {
18 |     // We store tags in the form state, it's deleted from the action
19 |     const { id, tags, ...data } = params;
20 |
21 |     await supabase.from("tracker_projects").update(data).eq("id", id);
22 |
23 |     revalidateTag(`tracker_projects_${user.team_id}`);
24 |   });
```

apps/dashboard/src/actions/report/create-report-action.ts
```
1 | "use server";
2 |
3 | import { authActionClient } from "@/actions/safe-action";
4 | import { createReportSchema } from "@/actions/schema";
5 | import { dub } from "@/utils/dub";
6 | import { LogEvents } from "@midday/events/events";
7 |
8 | export const createReportAction = authActionClient
9 |   .schema(createReportSchema)
10 |   .metadata({
11 |     name: "create-report",
12 |     track: {
13 |       event: LogEvents.OverviewReport.name,
14 |       channel: LogEvents.OverviewReport.channel,
15 |     },
16 |   })
17 |   .action(async ({ parsedInput: params, ctx: { user, supabase } }) => {
18 |     const { data } = await supabase
19 |       .from("reports")
20 |       .insert({
21 |         team_id: user.team_id,
22 |         from: params.from,
23 |         to: params.to,
24 |         type: params.type,
25 |         expire_at: params.expiresAt,
26 |         created_by: user.id,
27 |       })
28 |       .select("*")
29 |       .single();
30 |
31 |     if (!data) {
32 |       return null;
33 |     }
34 |
35 |     const link = await dub.links.create({
36 |       url: `${params.baseUrl}/report/${data.id}`,
37 |       expiresAt: params.expiresAt,
38 |     });
39 |
40 |     const { data: linkData } = await supabase
41 |       .from("reports")
42 |       .update({
43 |         link_id: link.id,
44 |         short_link: link.shortLink,
45 |       })
46 |       .eq("id", data.id)
47 |       .select("*")
48 |       .single();
49 |
50 |     return linkData;
51 |   });
```

apps/dashboard/src/actions/transactions/get-transactions-from-layout.ts
```
1 | "use server";
2 |
3 | import { LayoutProcessor } from "@midday/documents";
4 | import { z } from "zod";
5 | import { authActionClient } from "../safe-action";
6 |
7 | export const getTransactionsFromLayout = authActionClient
8 |   .schema(
9 |     z.object({
10 |       filePath: z.array(z.string()),
11 |     }),
12 |   )
13 |   .metadata({
14 |     name: "get-transactions-from-layout",
15 |   })
16 |   .action(async ({ parsedInput: { filePath }, ctx: { supabase } }) => {
17 |     const processor = new LayoutProcessor();
18 |
19 |     const { data } = await supabase.storage
20 |       .from("vault")
21 |       .download(filePath.join("/"));
22 |
23 |     const buffer = await data?.arrayBuffer();
24 |
25 |     if (!buffer) {
26 |       throw Error("No file data");
27 |     }
28 |
29 |     const transactions = await processor.getDocument({
30 |       content: Buffer.from(buffer).toString("base64"),
31 |     });
32 |
33 |     const [headerRow, ...dataRows] = transactions ?? [];
34 |
35 |     // Get the columns from the header row
36 |     const columns = headerRow?.cells.map((cell, index) => {
37 |       const content = cell.content;
38 |       return headerRow.cells.indexOf(cell) === index
39 |         ? content
40 |         : `${content}_${index}`;
41 |     });
42 |
43 |     const results = dataRows.map((row) =>
44 |       Object.fromEntries(
45 |         row.cells.map((cell, index) => [
46 |           columns?.[index] ?? `${cell.content}_${index}`,
47 |           cell.content,
48 |         ]),
49 |       ),
50 |     );
51 |
52 |     return {
53 |       columns,
54 |       results,
55 |     };
56 |   });
```

apps/dashboard/src/actions/transactions/import-transactions.ts
```
1 | "use server";
2 |
3 | import { LogEvents } from "@midday/events/events";
4 | import { formatAmountValue } from "@midday/import";
5 | import { importTransactions } from "jobs/tasks/transactions/import";
6 | import { z } from "zod";
7 | import { authActionClient } from "../safe-action";
8 |
9 | export const importTransactionsAction = authActionClient
10 |   .schema(
11 |     z.object({
12 |       filePath: z.array(z.string()).optional(),
13 |       bankAccountId: z.string(),
14 |       currency: z.string(),
15 |       currentBalance: z.string().optional(),
16 |       inverted: z.boolean(),
17 |       table: z.array(z.record(z.string(), z.string())).optional(),
18 |       importType: z.enum(["csv", "image"]),
19 |       mappings: z.object({
20 |         amount: z.string(),
21 |         date: z.string(),
22 |         description: z.string(),
23 |         balance: z.string().optional(),
24 |       }),
25 |     }),
26 |   )
27 |   .metadata({
28 |     name: "import-transactions",
29 |     track: {
30 |       event: LogEvents.ImportTransactions.name,
31 |       channel: LogEvents.ImportTransactions.channel,
32 |     },
33 |   })
34 |   .action(
35 |     async ({
36 |       parsedInput: {
37 |         filePath,
38 |         bankAccountId,
39 |         currency,
40 |         mappings,
41 |         currentBalance,
42 |         inverted,
43 |         table,
44 |         importType,
45 |       },
46 |       ctx: { user, supabase },
47 |     }) => {
48 |       // Update currency for account
49 |       const balance = currentBalance
50 |         ? formatAmountValue({ amount: currentBalance })
51 |         : null;
52 |
53 |       await supabase
54 |         .from("bank_accounts")
55 |         .update({ currency, balance })
56 |         .eq("id", bankAccountId);
57 |
58 |       const event = await importTransactions.trigger({
59 |         filePath,
60 |         bankAccountId,
61 |         currency,
62 |         mappings,
63 |         teamId: user.team_id!,
64 |         inverted,
65 |         importType,
66 |       });
67 |
68 |       return event;
69 |     },
70 |   );
```

apps/dashboard/src/actions/transactions/manual-sync-transactions-action.ts
```
1 | "use server";
2 |
3 | import { authActionClient } from "@/actions/safe-action";
4 | import { manualSyncTransactionsSchema } from "@/actions/schema";
5 | import { LogEvents } from "@midday/events/events";
6 | import { syncConnection } from "jobs/tasks/bank/sync/connection";
7 |
8 | export const manualSyncTransactionsAction = authActionClient
9 |   .schema(manualSyncTransactionsSchema)
10 |   .metadata({
11 |     name: "manual-sync-transactions",
12 |     track: {
13 |       event: LogEvents.TransactionsManualSync.name,
14 |       channel: LogEvents.TransactionsManualSync.channel,
15 |     },
16 |   })
17 |   .action(async ({ parsedInput: { connectionId } }) => {
18 |     const event = await syncConnection.trigger({
19 |       connectionId,
20 |       manualSync: true,
21 |     });
22 |
23 |     return event;
24 |   });
```

apps/dashboard/src/actions/transactions/reconnect-connection-action.ts
```
1 | "use server";
2 |
3 | import { authActionClient } from "@/actions/safe-action";
4 | import { reconnectConnectionSchema } from "@/actions/schema";
5 | import { LogEvents } from "@midday/events/events";
6 | import { reconnectConnection } from "jobs/tasks/reconnect/connection";
7 |
8 | export const reconnectConnectionAction = authActionClient
9 |   .schema(reconnectConnectionSchema)
10 |   .metadata({
11 |     name: "reconnect-connection",
12 |     track: {
13 |       event: LogEvents.ReconnectConnection.name,
14 |       channel: LogEvents.ReconnectConnection.channel,
15 |     },
16 |   })
17 |   .action(
18 |     async ({ parsedInput: { connectionId, provider }, ctx: { user } }) => {
19 |       const event = await reconnectConnection.trigger({
20 |         teamId: user.team_id!,
21 |         connectionId,
22 |         provider,
23 |       });
24 |
25 |       return event;
26 |     },
27 |   );
```

apps/dashboard/src/actions/transactions/update-currency-action.ts
```
1 | "use server";
2 |
3 | import { LogEvents } from "@midday/events/events";
4 | import { updateTeam } from "@midday/supabase/mutations";
5 | import { updateBaseCurrency } from "jobs/tasks/transactions/update-base-currency";
6 | import { revalidatePath, revalidateTag } from "next/cache";
7 | import { z } from "zod";
8 | import { authActionClient } from "../safe-action";
9 |
10 | export const updateCurrencyAction = authActionClient
11 |   .schema(
12 |     z.object({
13 |       baseCurrency: z.string(),
14 |     }),
15 |   )
16 |   .metadata({
17 |     name: "update-currency",
18 |     track: {
19 |       event: LogEvents.UpdateCurrency.name,
20 |       channel: LogEvents.UpdateCurrency.channel,
21 |     },
22 |   })
23 |   .action(
24 |     async ({ parsedInput: { baseCurrency }, ctx: { user, supabase } }) => {
25 |       if (!user.team_id) {
26 |         throw new Error("No team id");
27 |       }
28 |
29 |       await updateTeam(supabase, {
30 |         id: user.team_id,
31 |         base_currency: baseCurrency,
32 |       });
33 |
34 |       revalidateTag(`team_settings_${user.team_id}`);
35 |       revalidatePath("/settings/accounts");
36 |
37 |       const event = await updateBaseCurrency.trigger({
38 |         teamId: user.team_id,
39 |         baseCurrency,
40 |       });
41 |
42 |       return event;
43 |     },
44 |   );
```

apps/dashboard/src/app/[locale]/layout.tsx
```
1 | import "@/styles/globals.css";
2 | import { cn } from "@midday/ui/cn";
3 | import "@midday/ui/globals.css";
4 | import { Provider as Analytics } from "@midday/events/client";
5 | import { Toaster } from "@midday/ui/toaster";
6 | import { GeistMono } from "geist/font/mono";
7 | import { GeistSans } from "geist/font/sans";
8 | import type { Metadata } from "next";
9 | import type { ReactElement } from "react";
10 | import { Providers } from "./providers";
11 |
12 | export const metadata: Metadata = {
13 |   metadataBase: new URL("https://app.midday.ai"),
14 |   title: "Midday | Run your business smarter",
15 |   description:
16 |     "Automate financial tasks, stay organized, and make informed decisions effortlessly.",
17 |   twitter: {
18 |     title: "Midday | Run your business smarter",
19 |     description:
20 |       "Automate financial tasks, stay organized, and make informed decisions effortlessly.",
21 |     images: [
22 |       {
23 |         url: "https://cdn.midday.ai/opengraph-image.jpg",
24 |         width: 800,
25 |         height: 600,
26 |       },
27 |       {
28 |         url: "https://cdn.midday.ai/opengraph-image.jpg",
29 |         width: 1800,
30 |         height: 1600,
31 |       },
32 |     ],
33 |   },
34 |   openGraph: {
35 |     title: "Midday | Run your business smarter",
36 |     description:
37 |       "Automate financial tasks, stay organized, and make informed decisions effortlessly.",
38 |     url: "https://app.midday.ai",
39 |     siteName: "Midday",
40 |     images: [
41 |       {
42 |         url: "https://cdn.midday.ai/opengraph-image.jpg",
43 |         width: 800,
44 |         height: 600,
45 |       },
46 |       {
47 |         url: "https://cdn.midday.ai/opengraph-image.jpg",
48 |         width: 1800,
49 |         height: 1600,
50 |       },
51 |     ],
52 |     locale: "en_US",
53 |     type: "website",
54 |   },
55 | };
56 |
57 | export const viewport = {
58 |   width: "device-width",
59 |   initialScale: 1,
60 |   maximumScale: 1,
61 |   userScalable: false,
62 |   themeColor: [
63 |     { media: "(prefers-color-scheme: light)" },
64 |     { media: "(prefers-color-scheme: dark)" },
65 |   ],
66 | };
67 |
68 | export const preferredRegion = ["fra1", "sfo1", "iad1"];
69 | export const maxDuration = 60;
70 |
71 | export default function Layout({
72 |   children,
73 |   params: { locale },
74 | }: {
75 |   children: ReactElement;
76 |   params: { locale: string };
77 | }) {
78 |   return (
79 |     <html lang={locale} suppressHydrationWarning>
80 |       <body
81 |         className={cn(
82 |           `${GeistSans.variable} ${GeistMono.variable}`,
83 |           "whitespace-pre-line overscroll-none antialiased",
84 |         )}
85 |       >
86 |         <Providers locale={locale}>{children}</Providers>
87 |         <Toaster />
88 |         <Analytics />
89 |       </body>
90 |     </html>
91 |   );
92 | }
```

apps/dashboard/src/app/[locale]/not-found.tsx
```
1 | import Image from "next/image";
2 | import Link from "next/link";
3 | import appIcon from "public/appicon.png";
4 |
5 | export default function NotFound() {
6 |   return (
7 |     <div className="h-screen flex flex-col items-center justify-center text-center text-sm text-[#606060]">
8 |       <Image
9 |         src={appIcon}
10 |         width={80}
11 |         height={80}
12 |         alt="Midday"
13 |         quality={100}
14 |         className="mb-10"
15 |       />
16 |       <h2 className="text-xl font-semibold mb-2">Not Found</h2>
17 |       <p className="mb-4">Could not find requested resource</p>
18 |       <Link href="/" className="underline">
19 |         Return Home
20 |       </Link>
21 |     </div>
22 |   );
23 | }
```

apps/dashboard/src/app/[locale]/providers.tsx
```
1 | "use client";
2 |
3 | import { ThemeProvider } from "@/components/theme-provider";
4 | import { I18nProviderClient } from "@/locales/client";
5 | import { isDesktopApp } from "@todesktop/client-core/platform/todesktop";
6 | import type { ReactNode } from "react";
7 |
8 | // We need to import it here because this is the first
9 | // client component
10 | if (isDesktopApp()) {
11 |   require("@/desktop/main");
12 | }
13 |
14 | type ProviderProps = {
15 |   locale: string;
16 |   children: ReactNode;
17 | };
18 |
19 | export function Providers({ locale, children }: ProviderProps) {
20 |   return (
21 |     <I18nProviderClient locale={locale}>
22 |       <ThemeProvider
23 |         attribute="class"
24 |         defaultTheme="system"
25 |         enableSystem
26 |         disableTransitionOnChange
27 |       >
28 |         {children}
29 |       </ThemeProvider>
30 |     </I18nProviderClient>
31 |   );
32 | }
```

apps/dashboard/src/components/assistant/assistant-modal.tsx
```
1 | "use client";
2 |
3 | import { useAssistantStore } from "@/store/assistant";
4 | import { Dialog, DialogContent } from "@midday/ui/dialog";
5 | import { useHotkeys } from "react-hotkeys-hook";
6 | import { Assistant } from ".";
7 |
8 | export function AssistantModal() {
9 |   const { isOpen, setOpen } = useAssistantStore();
10 |
11 |   useHotkeys("meta+k", () => setOpen(), {
12 |     enableOnFormTags: true,
13 |   });
14 |
15 |   return (
16 |     <Dialog open={isOpen} onOpenChange={setOpen}>
17 |       <DialogContent
18 |         className="overflow-hidden p-0 max-w-full w-full h-full md:max-w-[740px] md:h-[480px] m-0 select-text"
19 |         hideClose
20 |       >
21 |         <Assistant />
22 |       </DialogContent>
23 |     </Dialog>
24 |   );
25 | }
```

apps/dashboard/src/components/assistant/button-desktop.tsx
```
1 | "use client";
2 |
3 | import { useAssistantStore } from "@/store/assistant";
4 | import { Button } from "@midday/ui/button";
5 | import { Icons } from "@midday/ui/icons";
6 |
7 | export function DesktopAssistantButton() {
8 |   const { setOpen } = useAssistantStore();
9 |
10 |   return (
11 |     <Button
12 |       variant="outline"
13 |       size="icon"
14 |       className="rounded-full w-8 h-8 flex items-center invisible todesktop:visible"
15 |       onClick={() => setOpen()}
16 |     >
17 |       <Icons.Search size={18} />
18 |     </Button>
19 |   );
20 | }
```

apps/dashboard/src/components/assistant/button.tsx
```
1 | "use client";
2 |
3 | import { useAssistantStore } from "@/store/assistant";
4 | import { Button } from "@midday/ui/button";
5 |
6 | export function AssistantButton() {
7 |   const { setOpen } = useAssistantStore();
8 |
9 |   return (
10 |     <Button
11 |       variant="outline"
12 |       className="relative min-w-[250px] w-full justify-start text-sm text-muted-foreground sm:pr-12 md:w-40 lg:w-64 border-0 p-0 hover:bg-transparent font-normal no-drag"
13 |       onClick={() => setOpen()}
14 |     >
15 |       <span className="ml-4 md:ml-0">Ask Midday a question...</span>
16 |       <kbd className="pointer-events-none absolute right-1.5 top-1.5 hidden h-5 select-none items-center gap-1 border bg-accent px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
17 |         <span className="text-xs">⌘</span>K
18 |       </kbd>
19 |     </Button>
20 |   );
21 | }
```

apps/dashboard/src/components/assistant/feedback.tsx
```
1 | import { sendFeebackAction } from "@/actions/send-feedback-action";
2 | import { Button } from "@midday/ui/button";
3 | import { Icons } from "@midday/ui/icons";
4 | import { Textarea } from "@midday/ui/textarea";
5 | import { Loader2 } from "lucide-react";
6 | import { useAction } from "next-safe-action/hooks";
7 | import { useState } from "react";
8 |
9 | type Props = {
10 |   onClose: () => void;
11 | };
12 |
13 | export function AssistantFeedback({ onClose }: Props) {
14 |   const [value, setValue] = useState("");
15 |
16 |   const action = useAction(sendFeebackAction, {
17 |     onSuccess: () => {
18 |       setValue("");
19 |     },
20 |   });
21 |
22 |   return (
23 |     <div className="h-full absolute top-0 left-0 right-0 bottom-0 z-[100] bg-background">
24 |       <div className="p-5 flex items-center space-x-3">
25 |         <button
26 |           type="button"
27 |           className="items-center border bg-accent p-1"
28 |           onClick={onClose}
29 |         >
30 |           <Icons.ArrowBack />
31 |         </button>
32 |         <h2>Send Feedback</h2>
33 |       </div>
34 |       <div className="p-4">
35 |         {action.status === "hasSucceeded" ? (
36 |           <div className="min-h-[100px] flex items-center justify-center flex-col space-y-1 mt-[100px]">
37 |             <p className="font-medium text-sm">Thank you for your feedback!</p>
38 |             <p className="text-sm text-[#4C4C4C]">
39 |               We will be back with you as soon as possible
40 |             </p>
41 |           </div>
42 |         ) : (
43 |           <form className="space-y-4">
44 |             <Textarea
45 |               name="feedback"
46 |               value={value}
47 |               required
48 |               autoFocus
49 |               placeholder="Your feedback..."
50 |               className="min-h-[320px] resize-none"
51 |               onChange={(evt) => setValue(evt.target.value)}
52 |             />
53 |
54 |             <div className="mt-1 flex items-center justify-end">
55 |               <Button
56 |                 type="button"
57 |                 onClick={() => action.execute({ feedback: value })}
58 |                 disabled={value.length === 0 || action.status === "executing"}
59 |               >
60 |                 {action.status === "executing" ? (
61 |                   <Loader2 className="h-4 w-4 animate-spin" />
62 |                 ) : (
63 |                   "Send"
64 |                 )}
65 |               </Button>
66 |             </div>
67 |           </form>
68 |         )}
69 |       </div>
70 |     </div>
71 |   );
72 | }
```

apps/dashboard/src/components/assistant/header.tsx
```
1 | import { useAssistantStore } from "@/store/assistant";
2 | import { Button } from "@midday/ui/button";
3 | import { Icons } from "@midday/ui/icons";
4 | import { Experimental } from "../experimental";
5 |
6 | type Props = {
7 |   isExpanded: boolean;
8 |   toggleSidebar: () => void;
9 | };
10 |
11 | export function Header({ toggleSidebar, isExpanded }: Props) {
12 |   const { setOpen } = useAssistantStore();
13 |
14 |   return (
15 |     <div className="px-4 py-3 flex justify-between items-center border-border border-b-[1px]">
16 |       <div className="flex items-center space-x-3">
17 |         <Button
18 |           variant="outline"
19 |           size="icon"
20 |           className="size-8 z-50 p-0"
21 |           onClick={toggleSidebar}
22 |         >
23 |           {isExpanded ? (
24 |             <Icons.SidebarFilled width={18} />
25 |           ) : (
26 |             <Icons.Sidebar width={18} />
27 |           )}
28 |         </Button>
29 |
30 |         <h2>Assistant</h2>
31 |       </div>
32 |
33 |       <Button
34 |         className="flex md:hidden todesktop:hidden"
35 |         size="icon"
36 |         variant="ghost"
37 |         onClick={() => setOpen()}
38 |       >
39 |         <Icons.Close />
40 |       </Button>
41 |
42 |       <div className="space-x-2 items-center hidden md:flex todesktop:flex">
43 |         <Experimental className="border-border text-[#878787]" />
44 |       </div>
45 |     </div>
46 |   );
47 | }
```

apps/dashboard/src/components/assistant/index.tsx
```
1 | "use client";
2 |
3 | import type { AI } from "@/actions/ai/chat";
4 | import { getUIStateFromAIState } from "@/actions/ai/chat/utils";
5 | import { getChat } from "@/actions/ai/storage";
6 | import { Chat } from "@/components/chat";
7 | import { useAIState, useUIState } from "ai/rsc";
8 | import { nanoid } from "nanoid";
9 | import { useEffect, useState } from "react";
10 | import { useHotkeys } from "react-hotkeys-hook";
11 | import { AssistantFeedback } from "./feedback";
12 | import { Header } from "./header";
13 | import { SidebarList } from "./sidebar-list";
14 |
15 | export function Assistant() {
16 |   const [isExpanded, setExpanded] = useState(false);
17 |   const [showFeedback, setShowFeedback] = useState(false);
18 |   const [chatId, setChatId] = useState();
19 |   const [messages, setMessages] = useUIState<typeof AI>();
20 |   const [aiState, setAIState] = useAIState<typeof AI>();
21 |   const [input, setInput] = useState<string>("");
22 |
23 |   const toggleOpen = () => setExpanded((prev) => !prev);
24 |
25 |   const onNewChat = () => {
26 |     const newChatId = nanoid();
27 |     setInput("");
28 |     setExpanded(false);
29 |     setAIState((prev) => ({ ...prev, messages: [], chatId: newChatId }));
30 |     setMessages([]);
31 |     setChatId(newChatId);
32 |   };
33 |
34 |   const handleOnSelect = (id: string) => {
35 |     setExpanded(false);
36 |     setChatId(id);
37 |   };
38 |
39 |   useHotkeys("meta+j", () => onNewChat(), {
40 |     enableOnFormTags: true,
41 |   });
42 |
43 |   useEffect(() => {
44 |     async function fetchData() {
45 |       const result = await getChat(chatId);
46 |
47 |       if (result) {
48 |         setAIState((prev) => ({ ...prev, messages: result.messages }));
49 |         setMessages(getUIStateFromAIState(result));
50 |       }
51 |     }
52 |
53 |     fetchData();
54 |   }, [chatId]);
55 |
56 |   return (
57 |     <div className="overflow-hidden p-0 h-full w-full todesktop:max-w-[760px] md:max-w-[760px] md:h-[480px] todesktop:h-[480px]">
58 |       {showFeedback && (
59 |         <AssistantFeedback onClose={() => setShowFeedback(false)} />
60 |       )}
61 |
62 |       <SidebarList
63 |         onNewChat={onNewChat}
64 |         isExpanded={isExpanded}
65 |         setExpanded={setExpanded}
66 |         onSelect={handleOnSelect}
67 |         chatId={chatId}
68 |       />
69 |
70 |       <Header toggleSidebar={toggleOpen} isExpanded={isExpanded} />
71 |
72 |       <Chat
73 |         submitMessage={setMessages}
74 |         messages={messages}
75 |         user={aiState.user}
76 |         onNewChat={onNewChat}
77 |         setInput={setInput}
78 |         input={input}
79 |         showFeedback={() => setShowFeedback(true)}
80 |       />
81 |     </div>
82 |   );
83 | }
```

apps/dashboard/src/components/assistant/sidebar-item.tsx
```
1 | import type { Chat } from "@/actions/ai/types";
2 | import { cn } from "@midday/ui/cn";
3 |
4 | interface SidebarItemProps {
5 |   chat: Chat;
6 |   chatId?: string;
7 |   onSelect: (id: string) => void;
8 | }
9 |
10 | export function SidebarItem({ chat, chatId, onSelect }: SidebarItemProps) {
11 |   return (
12 |     <button
13 |       type="button"
14 |       className={cn(
15 |         "text-left transition-colors px-0 py-1 rounded-lg w-full text-[#878787] hover:text-primary",
16 |         chatId === chat.id && "text-primary"
17 |       )}
18 |       onClick={() => onSelect(chat.id)}
19 |     >
20 |       <span className="text-xs line-clamp-1">{chat.title}</span>
21 |     </button>
22 |   );
23 | }
```

apps/dashboard/src/components/assistant/sidebar-items.tsx
```
1 | import type { AI } from "@/actions/ai/chat";
2 | import { getChatsAction } from "@/actions/ai/chat/get-chats-action";
3 | import type { Chat } from "@/actions/ai/types";
4 | import { useAIState } from "ai/rsc";
5 | import { useEffect, useState } from "react";
6 | import { SidebarItem } from "./sidebar-item";
7 |
8 | interface SidebarItemsProps {
9 |   onSelect: (id: string) => void;
10 |   chatId?: string;
11 | }
12 |
13 | const formatRange = (key: string) => {
14 |   switch (key) {
15 |     case "1d":
16 |       return "Today";
17 |     case "2d":
18 |       return "Yesterday";
19 |     case "7d":
20 |       return "Last 7 days";
21 |     case "30d":
22 |       return "Last 30 days";
23 |     default:
24 |       return null;
25 |   }
26 | };
27 |
28 | export function SidebarItems({ onSelect, chatId }: SidebarItemsProps) {
29 |   const [items, setItems] = useState<Chat[]>([]);
30 |   const [isLoading, setLoading] = useState(false);
31 |   const [aiState] = useAIState<typeof AI>();
32 |
33 |   useEffect(() => {
34 |     async function fetchData() {
35 |       setLoading(true);
36 |
37 |       const result = await getChatsAction();
38 |
39 |       if (result) {
40 |         setItems(result);
41 |       }
42 |
43 |       setLoading(false);
44 |     }
45 |
46 |     if (
47 |       (!items.length && !isLoading) ||
48 |       (items.length !== aiState?.messages.length && !isLoading)
49 |     ) {
50 |       fetchData();
51 |     }
52 |   }, [aiState]);
53 |
54 |   return (
55 |     <div className="overflow-auto relative h-screen md:h-[410px] mt-16 scrollbar-hide p-4 pt-0 pb-[50px] flex flex-col space-y-6">
56 |       {!Object.keys(items).length && (
57 |         <div className="flex flex-col justify-center items-center h-full">
58 |           <div className="flex flex-col items-center -mt-12 text-xs space-y-1">
59 |             <span className="text-[#878787]">History</span>
60 |             <span>No results found</span>
61 |           </div>
62 |         </div>
63 |       )}
64 |
65 |       {Object.keys(items).map((key) => {
66 |         const section = items[key];
67 |
68 |         return (
69 |           <div key={key}>
70 |             {section?.length > 0 && (
71 |               <div className="sticky top-0 z-20 w-full bg-background dark:bg-[#131313] pb-1">
72 |                 <span className="font-mono text-xs">{formatRange(key)}</span>
73 |               </div>
74 |             )}
75 |
76 |             <div className="mt-1">
77 |               {section?.map((chat) => {
78 |                 return (
79 |                   <SidebarItem
80 |                     key={chat.id}
81 |                     chat={chat}
82 |                     onSelect={onSelect}
83 |                     chatId={chatId}
84 |                   />
85 |                 );
86 |               })}
87 |             </div>
88 |           </div>
89 |         );
90 |       })}
91 |     </div>
92 |   );
93 | }
```

apps/dashboard/src/components/assistant/sidebar-list.tsx
```
1 | import { cn } from "@midday/ui/cn";
2 | import { useClickAway } from "@uidotdev/usehooks";
3 | import { SidebarItems } from "./sidebar-items";
4 | import { Toolbar } from "./toolbar";
5 |
6 | type Props = {
7 |   isExpanded: boolean;
8 |   chatId?: string;
9 |   setExpanded: (value: boolean) => void;
10 |   onSelect: (id: string) => void;
11 |   onNewChat: () => void;
12 | };
13 |
14 | export function SidebarList({
15 |   isExpanded,
16 |   chatId,
17 |   setExpanded,
18 |   onSelect,
19 |   onNewChat,
20 | }: Props) {
21 |   const ref = useClickAway(() => {
22 |     setExpanded(false);
23 |   });
24 |
25 |   return (
26 |     <div className="relative">
27 |       <div
28 |         ref={ref}
29 |         className={cn(
30 |           "w-[220px] h-screen md:h-[477px] bg-background dark:bg-[#131313] absolute -left-[220px] top-0 bottom-[1px] duration-200 ease-out transition-all border-border border-r-[1px] z-20 invisible",
31 |           isExpanded && "visible translate-x-full"
32 |         )}
33 |       >
34 |         <SidebarItems onSelect={onSelect} chatId={chatId} />
35 |         <Toolbar onNewChat={onNewChat} />
36 |         <div className="absolute z-10 h-[477px] w-[45px] bg-gradient-to-r from-background/30 dark:from-[#131313]/30 to-background right-0 top-0 pointer-events-none" />
37 |       </div>
38 |
39 |       <div
40 |         className={cn(
41 |           "duration-200 ease-out transition-all z-10 fixed left-[1px] right-[1px] top-[1px] bottom-[1px] invisible opacity-0 bg-background",
42 |           isExpanded && "visible opacity-80"
43 |         )}
44 |       />
45 |     </div>
46 |   );
47 | }
```

apps/dashboard/src/components/assistant/toolbar.tsx
```
1 | type Props = {
2 |   onNewChat: () => void;
3 | };
4 |
5 | export function Toolbar({ onNewChat }: Props) {
6 |   return (
7 |     <button onClick={onNewChat} type="button">
8 |       <div className="left-4 right-4 absolute z-20 bottom-4 flex items-center justify-center">
9 |         <div className="dark:bg-[#1A1A1A]/95 bg-[#F6F6F3]/95 h-8 w-full justify-between items-center flex px-2 space-x-4 text-[#878787]">
10 |           <div className="flex items-center space-x-3">
11 |             <kbd className="pointer-events-none h-5 select-none items-center gap-1.5 rounded border bg-accent px-1.5 font-mono text-[11px] font-medium flex bg-[#2C2C2C]">
12 |               <span className="text-[16px]">⌘</span>J
13 |             </kbd>
14 |             <span className="text-xs">New chat</span>
15 |           </div>
16 |         </div>
17 |       </div>
18 |     </button>
19 |   );
20 | }
```

apps/dashboard/src/components/base-currency/base-currency.loading.tsx
```
1 | import { Skeleton } from "@midday/ui/skeleton";
2 |
3 | export function Loading() {
4 |   return <Skeleton className="w-[200px] h-[36px] rounded-none" />;
5 | }
```

apps/dashboard/src/components/base-currency/base-currency.server.tsx
```
1 | import { getTeamSettings } from "@midday/supabase/cached-queries";
2 | import { SelectCurrency } from "./select-currency";
3 |
4 | export async function BaseCurrencyServer() {
5 |   const { data } = await getTeamSettings();
6 |
7 |   return <SelectCurrency defaultValue={data?.base_currency} />;
8 | }
```

apps/dashboard/src/components/base-currency/base-currency.tsx
```
1 | import {
2 |   Card,
3 |   CardContent,
4 |   CardDescription,
5 |   CardHeader,
6 |   CardTitle,
7 | } from "@midday/ui/card";
8 | import { Suspense } from "react";
9 | import { Loading } from "./base-currency.loading";
10 | import { BaseCurrencyServer } from "./base-currency.server";
11 |
12 | export function BaseCurrency() {
13 |   return (
14 |     <Card>
15 |       <CardHeader>
16 |         <CardTitle>Base currency</CardTitle>
17 |         <CardDescription>
18 |           If you have multiple currencies, you can set a base currency for your
19 |           account to view your total balance in your preferred currency.
20 |           Exchange rates are updated every 24 hours.
21 |         </CardDescription>
22 |       </CardHeader>
23 |
24 |       <CardContent>
25 |         <Suspense fallback={<Loading />}>
26 |           <BaseCurrencyServer />
27 |         </Suspense>
28 |       </CardContent>
29 |     </Card>
30 |   );
31 | }
```

apps/dashboard/src/components/base-currency/select-currency.tsx
```
1 | "use client";
2 |
3 | import { updateCurrencyAction } from "@/actions/transactions/update-currency-action";
4 | import { SelectCurrency as SelectCurrencyBase } from "@/components/select-currency";
5 | import { useSyncStatus } from "@/hooks/use-sync-status";
6 | import { uniqueCurrencies } from "@midday/location/currencies";
7 | import { Button } from "@midday/ui/button";
8 | import { useToast } from "@midday/ui/use-toast";
9 | import { useAction } from "next-safe-action/hooks";
10 | import { useEffect, useState } from "react";
11 |
12 | export function SelectCurrency({ defaultValue }: { defaultValue: string }) {
13 |   const { toast } = useToast();
14 |   const [isSyncing, setSyncing] = useState(false);
15 |   const [runId, setRunId] = useState<string | undefined>();
16 |   const [accessToken, setAccessToken] = useState<string | undefined>();
17 |
18 |   const { status, setStatus } = useSyncStatus({ runId, accessToken });
19 |
20 |   const updateCurrency = useAction(updateCurrencyAction, {
21 |     onExecute: () => setSyncing(true),
22 |     onSuccess: ({ data }) => {
23 |       if (data) {
24 |         setRunId(data.id);
25 |         setAccessToken(data.publicAccessToken);
26 |       }
27 |     },
28 |     onError: () => {
29 |       setRunId(undefined);
30 |
31 |       toast({
32 |         duration: 3500,
33 |         variant: "error",
34 |         title: "Something went wrong pleaase try again.",
35 |       });
36 |     },
37 |   });
38 |
39 |   const handleChange = async (baseCurrency: string) => {
40 |     if (baseCurrency !== defaultValue) {
41 |       toast({
42 |         title: "Update base currency",
43 |         description:
44 |           "This will update the base currency for all transactions and account balances.",
45 |         duration: 7000,
46 |         footer: (
47 |           <Button
48 |             onClick={() =>
49 |               updateCurrency.execute({
50 |                 baseCurrency: baseCurrency.toUpperCase(),
51 |               })
52 |             }
53 |           >
54 |             Update
55 |           </Button>
56 |         ),
57 |       });
58 |
59 |       return;
60 |     }
61 |   };
62 |
63 |   useEffect(() => {
64 |     if (status === "COMPLETED") {
65 |       setSyncing(false);
66 |       setStatus(null);
67 |       setRunId(undefined);
68 |       toast({
69 |         duration: 3500,
70 |         variant: "success",
71 |         title: "Transactions and account balances updated.",
72 |       });
73 |     }
74 |   }, [status]);
75 |
76 |   useEffect(() => {
77 |     if (isSyncing) {
78 |       toast({
79 |         title: "Updating...",
80 |         description: "We're updating your base currency, please wait.",
81 |         duration: Number.POSITIVE_INFINITY,
82 |         variant: "spinner",
83 |       });
84 |     }
85 |   }, [isSyncing]);
86 |
87 |   useEffect(() => {
88 |     if (status === "FAILED") {
89 |       setSyncing(false);
90 |       setRunId(undefined);
91 |
92 |       toast({
93 |         duration: 3500,
94 |         variant: "error",
95 |         title: "Something went wrong pleaase try again.",
96 |       });
97 |     }
98 |   }, [status]);
99 |
100 |   return (
101 |     <div className="w-[200px]">
102 |       <SelectCurrencyBase
103 |         onChange={handleChange}
104 |         currencies={uniqueCurrencies}
105 |         value={defaultValue}
106 |       />
107 |     </div>
108 |   );
109 | }
```

apps/dashboard/src/components/charts/area-chart.tsx
```
1 | "use client";
2 |
3 | import { useUserContext } from "@/store/user/hook";
4 | import { formatAmount } from "@/utils/format";
5 | import { format } from "date-fns";
6 | import React from "react";
7 | import {
8 |   Area,
9 |   AreaChart as BaseAreaChart,
10 |   CartesianGrid,
11 |   ResponsiveContainer,
12 |   Tooltip,
13 |   XAxis,
14 |   YAxis,
15 | } from "recharts";
16 |
17 | type ToolTipContentProps = {
18 |   payload: any;
19 | };
20 |
21 | const ToolTipContent = ({ payload }: ToolTipContentProps) => {
22 |   const { value = 0, date, currency } = payload.at(0)?.payload ?? {};
23 |   const { locale } = useUserContext((state) => state.data);
24 |
25 |   return (
26 |     <div className="w-[240px] border shadow-sm bg-background">
27 |       <div className="py-2 px-3">
28 |         <div className="flex items-center justify-between">
29 |           <p className="font-medium text-[13px]">
30 |             {formatAmount({
31 |               maximumFractionDigits: 0,
32 |               minimumFractionDigits: 0,
33 |               currency,
34 |               amount: value,
35 |               locale,
36 |             })}
37 |           </p>
38 |           <p className="text-xs text-[#606060] text-right">
39 |             {date && format(new Date(date), "MMM, y")}
40 |           </p>
41 |         </div>
42 |       </div>
43 |     </div>
44 |   );
45 | };
46 |
47 | type AreaChartProps = {
48 |   data: any;
49 |   height?: number;
50 | };
51 |
52 | export function AreaChart({ data, height = 290 }: AreaChartProps) {
53 |   return (
54 |     <ResponsiveContainer width="100%" height={height}>
55 |       <BaseAreaChart data={data}>
56 |         <defs>
57 |           <pattern
58 |             id="raster"
59 |             patternUnits="userSpaceOnUse"
60 |             width="64"
61 |             height="64"
62 |           >
63 |             <path d="M-106 110L22 -18" stroke="#282828" />
64 |             <path d="M-98 110L30 -18" stroke="#282828" />
65 |             <path d="M-90 110L38 -18" stroke="#282828" />
66 |             <path d="M-82 110L46 -18" stroke="#282828" />
67 |             <path d="M-74 110L54 -18" stroke="#282828" />
68 |             <path d="M-66 110L62 -18" stroke="#282828" />
69 |             <path d="M-58 110L70 -18" stroke="#282828" />
70 |             <path d="M-50 110L78 -18" stroke="#282828" />
71 |             <path d="M-42 110L86 -18" stroke="#282828" />
72 |             <path d="M-34 110L94 -18" stroke="#282828" />
73 |             <path d="M-26 110L102 -18" stroke="#282828" />
74 |             <path d="M-18 110L110 -18" stroke="#282828" />
75 |             <path d="M-10 110L118 -18" stroke="#282828" />
76 |             <path d="M-2 110L126 -18" stroke="#282828" />
77 |             <path d="M6 110L134 -18" stroke="#282828" />
78 |             <path d="M14 110L142 -18" stroke="#282828" />
79 |             <path d="M22 110L150 -18" stroke="#282828" />
80 |           </pattern>
81 |         </defs>
82 |
83 |         <CartesianGrid
84 |           strokeDasharray="3 3"
85 |           vertical={false}
86 |           className="stoke-[#DCDAD2] dark:stroke-[#2C2C2C]"
87 |         />
88 |
89 |         <Tooltip
90 |           content={(content) => <ToolTipContent {...content} />}
91 |           cursor={false}
92 |         />
93 |
94 |         <XAxis
95 |           dataKey="date"
96 |           stroke="#888888"
97 |           fontSize={12}
98 |           tickLine={false}
99 |           axisLine={false}
100 |           tickMargin={15}
101 |           tickFormatter={(value) => {
102 |             return format(new Date(value), "MMM");
103 |           }}
104 |           tick={{
105 |             fill: "#606060",
106 |             fontSize: 12,
107 |             fontFamily: "var(--font-sans)",
108 |           }}
109 |         />
110 |
111 |         <YAxis
112 |           stroke="#888888"
113 |           fontSize={12}
114 |           tickLine={false}
115 |           axisLine={false}
116 |           tickMargin={10}
117 |           tick={{
118 |             fill: "#606060",
119 |             fontSize: 12,
120 |             fontFamily: "var(--font-sans)",
121 |           }}
122 |         />
123 |
124 |         <Tooltip />
125 |
126 |         <Area
127 |           strokeWidth={2.5}
128 |           type="monotone"
129 |           dataKey="value"
130 |           stroke="hsl(var(--primary))"
131 |           fill="url(#raster)"
132 |         />
133 |       </BaseAreaChart>
134 |     </ResponsiveContainer>
135 |   );
136 | }
```

apps/dashboard/src/components/charts/bar-chart.tsx
```
1 | "use client";
2 |
3 | import { useI18n } from "@/locales/client";
4 | import { useUserContext } from "@/store/user/hook";
5 | import { formatAmount } from "@/utils/format";
6 | import { cn } from "@midday/ui/cn";
7 | import { format } from "date-fns";
8 | import {
9 |   Bar,
10 |   BarChart as BaseBarChart,
11 |   CartesianGrid,
12 |   Cell,
13 |   ResponsiveContainer,
14 |   Tooltip,
15 |   XAxis,
16 |   YAxis,
17 | } from "recharts";
18 | import { Status } from "./status";
19 |
20 | const ToolTipContent = ({ payload = {} }) => {
21 |   const t = useI18n();
22 |   const { locale } = useUserContext((state) => state.data);
23 |
24 |   const [current, previous] = payload;
25 |
26 |   return (
27 |     <div className="w-[240px] border shadow-sm bg-background">
28 |       <div className="border-b-[1px] px-4 py-2 flex justify-between items-center">
29 |         <p className="text-sm">
30 |           {t(`chart_type.${current?.payload?.meta?.type}`)}
31 |         </p>
32 |         <div>
33 |           {current?.payload.precentage.value > 0 && (
34 |             <Status
35 |               value={`${current?.payload.precentage.value}%`}
36 |               variant={current?.payload.precentage.status}
37 |             />
38 |           )}
39 |         </div>
40 |       </div>
41 |
42 |       <div className="p-4">
43 |         <div className="flex justify-between mb-2">
44 |           <div className="flex items-center justify-center space-x-2">
45 |             <div className="w-[8px] h-[8px] rounded-full bg-[#121212] dark:bg-[#F5F5F3]" />
46 |             <p className="font-medium text-[13px]">
47 |               {formatAmount({
48 |                 maximumFractionDigits: 0,
49 |                 minimumFractionDigits: 0,
50 |                 currency: current?.payload?.meta?.currency,
51 |                 amount: current?.payload?.current.value || 0,
52 |                 locale,
53 |               })}
54 |             </p>
55 |           </div>
56 |
57 |           <p className="text-xs text-[#606060] text-right">
58 |             {current?.payload?.meta?.period === "weekly"
59 |               ? current?.payload?.current?.date &&
60 |                 `Week ${format(
61 |                   new Date(current.payload.current.date),
62 |                   "ww, y",
63 |                 )}`
64 |               : current?.payload?.current?.date &&
65 |                 format(new Date(current.payload.current.date), "MMM, y")}
66 |           </p>
67 |         </div>
68 |
69 |         <div className="flex justify-between">
70 |           <div className="flex items-center justify-center space-x-2">
71 |             <div className="w-[8px] h-[8px] rounded-full bg-[#C6C6C6] dark:bg-[#606060]" />
72 |             <p className="font-medium text-[13px]">
73 |               {formatAmount({
74 |                 amount: previous?.payload?.previous.value || 0,
75 |                 currency: current?.payload?.meta?.currency,
76 |                 maximumFractionDigits: 0,
77 |                 minimumFractionDigits: 0,
78 |                 locale,
79 |               })}
80 |             </p>
81 |           </div>
82 |
83 |           <p className="text-xs text-[#606060] text-right">
84 |             {previous?.payload?.meta?.period === "weekly"
85 |               ? previous?.payload?.previous?.date &&
86 |                 `Week ${format(
87 |                   new Date(previous.payload.previous.date),
88 |                   "ww, y",
89 |                 )}`
90 |               : previous?.payload?.previous?.date &&
91 |                 format(new Date(previous.payload.previous.date), "MMM, y")}
92 |           </p>
93 |         </div>
94 |       </div>
95 |     </div>
96 |   );
97 | };
98 |
99 | export function BarChart({ data, height = 290 }) {
100 |   const formattedData = data?.result?.map((item) => ({
101 |     ...item,
102 |     meta: data.meta,
103 |     date: format(
104 |       new Date(item.date),
105 |       data.meta.period === "weekly" ? "w" : "MMM",
106 |     ),
107 |   }));
108 |
109 |   return (
110 |     <div className="relative h-full w-full">
111 |       <div className="space-x-4 absolute right-0 -top-10 hidden md:flex">
112 |         <div className="flex space-x-2 items-center">
113 |           <span className="w-2 h-2 rounded-full bg-[#121212] dark:bg-[#F5F5F3]" />
114 |           <span className="text-sm text-[#606060]">Current Period</span>
115 |         </div>
116 |         <div className="flex space-x-2 items-center">
117 |           <span className="w-2 h-2 rounded-full bg-[#C6C6C6] dark:bg-[#606060]" />
118 |           <span className="text-sm text-[#606060]">Last Period</span>
119 |         </div>
120 |       </div>
121 |
122 |       <ResponsiveContainer width="100%" height={height}>
123 |         <BaseBarChart data={formattedData} barGap={15}>
124 |           <XAxis
125 |             dataKey="date"
126 |             stroke="#888888"
127 |             fontSize={12}
128 |             tickLine={false}
129 |             axisLine={false}
130 |             tickMargin={15}
131 |             tick={{
132 |               fill: "#606060",
133 |               fontSize: 12,
134 |               fontFamily: "var(--font-sans)",
135 |             }}
136 |           />
137 |
138 |           <YAxis
139 |             stroke="#888888"
140 |             fontSize={12}
141 |             tickMargin={10}
142 |             tickLine={false}
143 |             axisLine={false}
[TRUNCATED]
```

apps/dashboard/src/components/charts/burn-rate-chart.tsx
```
1 | import { calculateAvgBurnRate } from "@/utils/format";
2 | import { getBurnRate, getRunway } from "@midday/supabase/cached-queries";
3 | import { cn } from "@midday/ui/cn";
4 | import { Icons } from "@midday/ui/icons";
5 | import {
6 |   Tooltip,
7 |   TooltipContent,
8 |   TooltipProvider,
9 |   TooltipTrigger,
10 | } from "@midday/ui/tooltip";
11 | import Link from "next/link";
12 | import { AnimatedNumber } from "../animated-number";
13 | import { AreaChart } from "./area-chart";
14 | import { burnRateExamleData } from "./data";
15 |
16 | type Props = {
17 |   value: unknown;
18 |   defaultValue: unknown;
19 |   disabled?: boolean;
20 |   currency?: string;
21 | };
22 |
23 | export async function BurnRateChart({
24 |   value,
25 |   defaultValue,
26 |   disabled,
27 |   currency,
28 | }: Props) {
29 |   const [{ data: burnRateData, currency: baseCurrency }, { data: runway }] =
30 |     disabled
31 |       ? burnRateExamleData
32 |       : await Promise.all([
33 |           getBurnRate({
34 |             ...defaultValue,
35 |             ...value,
36 |             currency,
37 |           }),
38 |           getRunway({
39 |             ...defaultValue,
40 |             ...value,
41 |             currency,
42 |           }),
43 |         ]);
44 |
45 |   return (
46 |     <div className={cn(disabled && "pointer-events-none select-none")}>
47 |       <div className="space-y-2 mb-14 select-text">
48 |         <h1 className="text-4xl font-mono">
49 |           <AnimatedNumber
50 |             value={calculateAvgBurnRate(burnRateData)}
51 |             currency={baseCurrency}
52 |           />
53 |         </h1>
54 |
55 |         <div className="text-sm text-[#606060] flex items-center space-x-2">
56 |           <span>
57 |             {typeof runway === "number" && runway > 0
58 |               ? `${runway} months runway`
59 |               : "Average burn rate"}
60 |           </span>
61 |           <TooltipProvider delayDuration={100}>
62 |             <Tooltip>
63 |               <TooltipTrigger asChild>
64 |                 <Icons.Info className="h-4 w-4 mt-1" />
65 |               </TooltipTrigger>
66 |               <TooltipContent
67 |                 className="text-xs text-[#878787] max-w-[240px] p-4 space-y-2"
68 |                 side="bottom"
69 |                 sideOffset={10}
70 |               >
71 |                 <h3 className="font-medium text-primary">
72 |                   The Burn Rate is your monthly expenses divided by your current
73 |                   balance, estimating how long your funds will last.
74 |                 </h3>
75 |                 <p>
76 |                   Explanation: This tracks how fast you’re spending. If it’s
77 |                   incorrect, internal transfers may be counted as income. You
78 |                   can adjust this by excluding the transactions from the
79 |                   calculations.
80 |                 </p>
81 |
82 |                 <p>
83 |                   All amounts are converted into your{" "}
84 |                   <Link
85 |                     href="/settings/accounts"
86 |                     className="text-primary underline"
87 |                   >
88 |                     base currency
89 |                   </Link>
90 |                   .
91 |                 </p>
92 |               </TooltipContent>
93 |             </Tooltip>
94 |           </TooltipProvider>
95 |         </div>
96 |       </div>
97 |
98 |       <AreaChart data={burnRateData} />
99 |     </div>
100 |   );
101 | }
```

apps/dashboard/src/components/charts/chart-filters.server.tsx
```
1 | import { getBankAccountsCurrencies } from "@midday/supabase/cached-queries";
2 | import { Suspense } from "react";
3 | import { ChartFilters } from "./chart-filters";
4 |
5 | export async function ChartFiltersServer() {
6 |   const currencies = await getBankAccountsCurrencies();
7 |
8 |   return (
9 |     <Suspense>
10 |       <ChartFilters
11 |         currencies={
12 |           currencies?.data?.map((currency) => {
13 |             return {
14 |               id: currency.currency,
15 |               name: currency.currency,
16 |             };
17 |           }) ?? []
18 |         }
19 |       />
20 |     </Suspense>
21 |   );
22 | }
```

apps/dashboard/src/components/charts/chart-filters.tsx
```
1 | "use client";
2 |
3 | import { Button } from "@midday/ui/button";
4 | import {
5 |   DropdownMenu,
6 |   DropdownMenuContent,
7 |   DropdownMenuPortal,
8 |   DropdownMenuRadioGroup,
9 |   DropdownMenuRadioItem,
10 |   DropdownMenuSub,
11 |   DropdownMenuSubContent,
12 |   DropdownMenuSubTrigger,
13 |   DropdownMenuTrigger,
14 | } from "@midday/ui/dropdown-menu";
15 | import { Icons } from "@midday/ui/icons";
16 | import { parseAsString, useQueryStates } from "nuqs";
17 |
18 | type Props = {
19 |   currencies: {
20 |     id: string;
21 |     name: string;
22 |   }[];
23 | };
24 |
25 | export function ChartFilters({ currencies }: Props) {
26 |   const [{ currency }, setCurrency] = useQueryStates(
27 |     {
28 |       currency: parseAsString,
29 |     },
30 |     {
31 |       shallow: false,
32 |     },
33 |   );
34 |
35 |   const allCurrencies = [
36 |     {
37 |       id: "base",
38 |       name: "Base currency",
39 |     },
40 |     ...currencies,
41 |   ];
42 |
43 |   return (
44 |     <DropdownMenu>
45 |       <DropdownMenuTrigger asChild>
46 |         <Button variant="outline" size="icon">
47 |           <Icons.Filter size={18} />
48 |         </Button>
49 |       </DropdownMenuTrigger>
50 |       <DropdownMenuContent sideOffset={10} align="end" className="w-[200px]">
51 |         <DropdownMenuSub>
52 |           <DropdownMenuSubTrigger>
53 |             <Icons.Currency className="mr-2 h-4 w-4" />
54 |             <span>Currency</span>
55 |           </DropdownMenuSubTrigger>
56 |           <DropdownMenuPortal>
57 |             <DropdownMenuSubContent sideOffset={14} alignOffset={-4}>
58 |               <DropdownMenuRadioGroup
59 |                 value={currency ?? "base"}
60 |                 onValueChange={(value) =>
61 |                   setCurrency({ currency: value === "base" ? null : value })
62 |                 }
63 |               >
64 |                 {allCurrencies.map((currency) => (
65 |                   <DropdownMenuRadioItem key={currency.id} value={currency.id}>
66 |                     {currency.name}
67 |                   </DropdownMenuRadioItem>
68 |                 ))}
69 |               </DropdownMenuRadioGroup>
70 |             </DropdownMenuSubContent>
71 |           </DropdownMenuPortal>
72 |         </DropdownMenuSub>
73 |       </DropdownMenuContent>
74 |     </DropdownMenu>
75 |   );
76 | }
```

apps/dashboard/src/components/charts/chart-more.tsx
```
1 | "use client";
2 |
3 | import { ShareReport } from "@/components/share-report";
4 | import { Button } from "@midday/ui/button";
5 | import { Dialog } from "@midday/ui/dialog";
6 | import {
7 |   DropdownMenu,
8 |   DropdownMenuContent,
9 |   DropdownMenuItem,
10 |   DropdownMenuTrigger,
11 | } from "@midday/ui/dropdown-menu";
12 | import { Icons } from "@midday/ui/icons";
13 | import { useState } from "react";
14 |
15 | type Props = {
16 |   defaultValue: {
17 |     from: string;
18 |     to: string;
19 |     type: "profit" | "revenue";
20 |   };
21 |   type: "profit" | "revenue";
22 | };
23 |
24 | export function ChartMore({ defaultValue, type }: Props) {
25 |   const [isOpen, setOpen] = useState(false);
26 |
27 |   return (
28 |     <Dialog open={isOpen} onOpenChange={setOpen}>
29 |       <DropdownMenu>
30 |         <DropdownMenuTrigger asChild>
31 |           <Button variant="outline" size="icon">
32 |             <Icons.MoreHoriz size={18} />
33 |           </Button>
34 |         </DropdownMenuTrigger>
35 |         <DropdownMenuContent sideOffset={10} align="end">
36 |           <DropdownMenuItem onClick={() => setOpen(true)}>
37 |             Share report
38 |           </DropdownMenuItem>
39 |         </DropdownMenuContent>
40 |       </DropdownMenu>
41 |
42 |       <ShareReport defaultValue={defaultValue} type={type} setOpen={setOpen} />
43 |     </Dialog>
44 |   );
45 | }
```

apps/dashboard/src/components/charts/chart-period.tsx
```
1 | "use client";
2 |
3 | import { changeChartPeriodAction } from "@/actions/change-chart-period-action";
4 | import { Button } from "@midday/ui/button";
5 | import { Calendar } from "@midday/ui/calendar";
6 | import { Icons } from "@midday/ui/icons";
7 | import { Popover, PopoverContent, PopoverTrigger } from "@midday/ui/popover";
8 | import {
9 |   Select,
10 |   SelectContent,
11 |   SelectGroup,
12 |   SelectItem,
13 |   SelectTrigger,
14 |   SelectValue,
15 | } from "@midday/ui/select";
16 | import { formatISO } from "date-fns";
17 | import { startOfMonth, startOfYear, subMonths, subWeeks } from "date-fns";
18 | import { formatDateRange } from "little-date";
19 | import { useAction } from "next-safe-action/hooks";
20 | import { parseAsString, useQueryStates } from "nuqs";
21 |
22 | type Props = {
23 |   defaultValue: {
24 |     to: string;
25 |     from: string;
26 |   };
27 |   disabled?: string;
28 | };
29 |
30 | const periods = [
31 |   {
32 |     value: "4w",
33 |     label: "Last 4 weeks",
34 |     range: {
35 |       from: subWeeks(new Date(), 4),
36 |       to: new Date(),
37 |     },
38 |   },
39 |   {
40 |     value: "3m",
41 |     label: "Last 3 months",
42 |     range: {
43 |       from: subMonths(new Date(), 3),
44 |       to: new Date(),
45 |     },
46 |   },
47 |   {
48 |     value: "6m",
49 |     label: "Last 6 months",
50 |     range: {
51 |       from: subMonths(new Date(), 6),
52 |       to: new Date(),
53 |     },
54 |   },
55 |   {
56 |     value: "12m",
57 |     label: "Last 12 months",
58 |     range: {
59 |       from: subMonths(new Date(), 12),
60 |       to: new Date(),
61 |     },
62 |   },
63 |   {
64 |     value: "mtd",
65 |     label: "Month to date",
66 |     range: {
67 |       from: startOfMonth(new Date()),
68 |       to: new Date(),
69 |     },
70 |   },
71 |   {
72 |     value: "ytd",
73 |     label: "Year to date",
74 |     range: {
75 |       from: startOfYear(new Date()),
76 |       to: new Date(),
77 |     },
78 |   },
79 |   {
80 |     value: "all",
81 |     label: "All time",
82 |     range: {
83 |       // Can't get older data than this
84 |       from: new Date("2020-01-01"),
85 |       to: new Date(),
86 |     },
87 |   },
88 | ];
89 | export function ChartPeriod({ defaultValue, disabled }: Props) {
90 |   const { execute } = useAction(changeChartPeriodAction);
91 |
92 |   const [params, setParams] = useQueryStates(
93 |     {
94 |       from: parseAsString.withDefault(defaultValue.from),
95 |       to: parseAsString.withDefault(defaultValue.to),
96 |       period: parseAsString,
97 |     },
98 |     {
99 |       shallow: false,
100 |     },
101 |   );
102 |
103 |   const handleChangePeriod = (
104 |     range: { from: Date | null; to: Date | null } | undefined,
105 |     period?: string,
106 |   ) => {
107 |     if (!range) return;
108 |
109 |     const newRange = {
110 |       from: range.from
111 |         ? formatISO(range.from, { representation: "date" })
112 |         : params.from,
113 |       to: range.to
114 |         ? formatISO(range.to, { representation: "date" })
115 |         : params.to,
116 |       period,
117 |     };
118 |
119 |     setParams(newRange);
120 |     execute(newRange);
121 |   };
122 |
123 |   return (
124 |     <div className="flex space-x-4">
125 |       <Popover>
126 |         <PopoverTrigger asChild disabled={Boolean(disabled)}>
127 |           <Button
128 |             variant="outline"
129 |             className="justify-start text-left font-medium space-x-2"
130 |           >
131 |             <span className="line-clamp-1 text-ellipsis">
132 |               {formatDateRange(new Date(params.from), new Date(params.to), {
133 |                 includeTime: false,
134 |               })}
135 |             </span>
136 |             <Icons.ChevronDown />
137 |           </Button>
138 |         </PopoverTrigger>
139 |         <PopoverContent
140 |           className="w-screen md:w-[550px] p-0 flex-col flex space-y-4"
141 |           align="end"
142 |           sideOffset={10}
143 |         >
144 |           <div className="p-4 pb-0">
145 |             <Select
146 |               defaultValue={params.period ?? undefined}
147 |               onValueChange={(value) =>
148 |                 handleChangePeriod(
149 |                   periods.find((p) => p.value === value)?.range,
150 |                   value,
151 |                 )
152 |               }
153 |             >
154 |               <SelectTrigger className="w-full">
155 |                 <SelectValue placeholder="Select a period" />
156 |               </SelectTrigger>
157 |               <SelectContent>
158 |                 <SelectGroup>
159 |                   {periods.map((period) => (
160 |                     <SelectItem key={period.value} value={period.value}>
161 |                       {period.label}
162 |                     </SelectItem>
163 |                   ))}
164 |                 </SelectGroup>
165 |               </SelectContent>
166 |             </Select>
167 |           </div>
168 |
169 |           <Calendar
170 |             mode="range"
171 |             numberOfMonths={2}
172 |             selected={{
173 |               from: params.from && new Date(params.from),
174 |               to: params.to && new Date(params.to),
175 |             }}
176 |             defaultMonth={
177 |               new Date(new Date().setMonth(new Date().getMonth() - 1))
178 |             }
179 |             initialFocus
180 |             toDate={new Date()}
181 |             onSelect={(date) => handleChangePeriod(date)}
[TRUNCATED]
```

apps/dashboard/src/components/charts/chart-selectors.tsx
```
1 | import { ChartMore } from "@/components/charts/chart-more";
2 | import { ChartPeriod } from "@/components/charts/chart-period";
3 | import { ChartType } from "@/components/charts/chart-type";
4 | import { Cookies } from "@/utils/constants";
5 | import { cookies } from "next/headers";
6 | import { ChartFiltersServer } from "./chart-filters.server";
7 |
8 | export async function ChartSelectors({ defaultValue }) {
9 |   const chartType = cookies().get(Cookies.ChartType)?.value ?? "profit";
10 |
11 |   return (
12 |     <div className="flex justify-between mt-6 space-x-2">
13 |       <div className="flex space-x-2">
14 |         <ChartType initialValue={chartType} />
15 |       </div>
16 |
17 |       <div className="flex space-x-2">
18 |         <ChartPeriod defaultValue={defaultValue} />
19 |         <ChartFiltersServer />
20 |         <ChartMore defaultValue={defaultValue} type={chartType} />
21 |       </div>
22 |     </div>
23 |   );
24 | }
```

apps/dashboard/src/components/charts/chart-type.tsx
```
1 | "use client";
2 |
3 | import { changeChartTypeAction } from "@/actions/change-chart-type-action";
4 | import { useI18n } from "@/locales/client";
5 | import {
6 |   Select,
7 |   SelectContent,
8 |   SelectGroup,
9 |   SelectItem,
10 |   SelectTrigger,
11 | } from "@midday/ui/select";
12 | import { useOptimisticAction } from "next-safe-action/hooks";
13 |
14 | const options = ["profit", "revenue", "expense", "burn_rate"];
15 |
16 | type Props = {
17 |   initialValue: string;
18 |   disabled?: boolean;
19 | };
20 |
21 | export function ChartType({ initialValue, disabled }: Props) {
22 |   const t = useI18n();
23 |   const { execute, optimisticState } = useOptimisticAction(
24 |     changeChartTypeAction,
25 |     {
26 |       currentState: initialValue,
27 |       updateFn: (_, newState) => newState,
28 |     },
29 |   );
30 |
31 |   return (
32 |     <Select defaultValue={optimisticState} onValueChange={execute}>
33 |       <SelectTrigger
34 |         className="flex-1 space-x-1 font-medium"
35 |         disabled={disabled}
36 |       >
37 |         <span>{t(`chart_type.${optimisticState}`)}</span>
38 |       </SelectTrigger>
39 |       <SelectContent>
40 |         <SelectGroup>
41 |           {options.map((option) => {
42 |             return (
43 |               <SelectItem key={option} value={option}>
44 |                 {t(`chart_type.${option}`)}
45 |               </SelectItem>
46 |             );
47 |           })}
48 |         </SelectGroup>
49 |       </SelectContent>
50 |     </Select>
51 |   );
52 | }
```

apps/dashboard/src/components/charts/charts.tsx
```
1 | import { BurnRateChart } from "./burn-rate-chart";
2 | import { ExpenseChart } from "./expense-chart";
3 | import { ProfitRevenueChart } from "./profit-revenue-chart";
4 |
5 | export function Charts(props) {
6 |   switch (props.type) {
7 |     case "revenue":
8 |     case "profit":
9 |       return <ProfitRevenueChart {...props} />;
10 |     case "burn_rate":
11 |       return <BurnRateChart {...props} />;
12 |     case "expense":
13 |       return <ExpenseChart {...props} />;
14 |     default:
15 |       return null;
16 |   }
17 | }
```

apps/dashboard/src/components/charts/data.ts
```
1 | import { getColorFromName } from "@/utils/categories";
2 |
3 | export const chartExampleData = {
4 |   summary: {
5 |     currency: "USD",
6 |     currentTotal: 800000,
7 |     prevTotal: 300000,
8 |   },
9 |   meta: {
10 |     type: "profit",
11 |     period: "monthly",
12 |     currency: "USD",
13 |   },
14 |   result: [
15 |     {
16 |       date: "Sun Jan 01 2023",
17 |       previous: {
18 |         date: "2022-1-1",
19 |         currency: "USD",
20 |         value: 10000,
21 |       },
22 |       current: {
23 |         date: "2023-1-1",
24 |         currency: "USD",
25 |         value: 20300,
26 |       },
27 |       precentage: {
28 |         currency: "USD",
29 |         value: 110,
30 |         status: "positive",
31 |       },
32 |     },
33 |     {
34 |       date: "Wed Feb 01 2023",
35 |       previous: {
36 |         date: "2022-2-1",
37 |         currency: "USD",
38 |         value: 8000,
39 |       },
40 |       current: {
41 |         date: "2023-2-1",
42 |         currency: "USD",
43 |         value: 14000,
44 |       },
45 |       precentage: {
46 |         currency: "USD",
47 |         value: 1000,
48 |         status: "positive",
49 |       },
50 |     },
51 |     {
52 |       date: "Wed Mar 01 2023",
53 |       previous: {
54 |         date: "2022-3-1",
55 |         currency: "USD",
56 |         value: 15000,
57 |       },
58 |       current: {
59 |         date: "2023-3-1",
60 |         currency: "USD",
61 |         value: 18000,
62 |       },
63 |       precentage: {
64 |         currency: "USD",
65 |         value: 1000,
66 |         status: "positive",
67 |       },
68 |     },
69 |     {
70 |       date: "Sat Apr 01 2023",
71 |       previous: {
72 |         date: "2022-4-1",
73 |         currency: "USD",
74 |         value: 7000,
75 |         status: "positive",
76 |       },
77 |       current: {
78 |         date: "2023-4-1",
79 |         currency: "USD",
80 |         value: 10000,
81 |         status: "positive",
82 |       },
83 |       precentage: {
84 |         currency: "USD",
85 |         value: 1000,
86 |         status: "positive",
87 |       },
88 |     },
89 |     {
90 |       date: "Mon May 01 2023",
91 |       previous: {
92 |         date: "2022-5-1",
93 |         currency: "USD",
94 |         value: 10000,
95 |         status: "positive",
96 |       },
97 |       current: {
98 |         date: "2023-5-1",
99 |         currency: "USD",
100 |         value: 12000,
101 |         status: "positive",
102 |       },
103 |       precentage: {
104 |         currency: "USD",
105 |         value: 1000,
106 |         status: "positive",
107 |       },
108 |     },
109 |     {
110 |       date: "Thu Jun 01 2023",
111 |       previous: {
112 |         date: "2022-6-1",
113 |         value: 300,
114 |         status: "negative",
115 |       },
116 |       current: {
117 |         date: "2023-6-1",
118 |         currency: "USD",
119 |         value: 2800,
120 |         status: "positive",
121 |       },
122 |       precentage: {
123 |         currency: "USD",
124 |         value: 1000,
125 |         status: "positive",
126 |       },
127 |     },
128 |     {
129 |       date: "Sat Jul 01 2023",
130 |       previous: {
131 |         date: "2022-7-1",
132 |         currency: "USD",
133 |         value: 1000,
134 |         status: "positive",
135 |       },
136 |       current: {
137 |         date: "2023-7-1",
138 |         currency: "USD",
139 |         value: 1000,
140 |         status: "positive",
141 |       },
142 |       precentage: {
143 |         currency: "USD",
144 |         value: 1000,
145 |         status: "positive",
146 |       },
147 |     },
148 |     {
149 |       date: "Tue Aug 01 2023",
150 |       previous: {
151 |         date: "2022-8-1",
152 |         currency: "USD",
153 |         value: 1000,
154 |         status: "positive",
155 |       },
156 |       current: {
157 |         date: "2023-8-1",
158 |         currency: "USD",
159 |         value: 1000,
160 |         status: "positive",
161 |       },
162 |       precentage: {
163 |         currency: "USD",
164 |         value: 43,
165 |         status: "positive",
166 |       },
167 |     },
168 |     {
169 |       date: "Fri Sep 01 2023",
170 |       previous: {
171 |         date: "2022-9-1",
172 |         currency: "USD",
173 |         value: 1000,
174 |         status: "positive",
175 |       },
176 |       current: {
177 |         currency: "USD",
178 |         date: "2023-9-1",
179 |         value: -3000,
180 |         status: "negative",
181 |       },
182 |       precentage: {
183 |         currency: "USD",
184 |         value: 53,
185 |         status: "positive",
186 |       },
187 |     },
188 |     {
189 |       date: "Sun Oct 01 2023",
190 |       previous: {
191 |         date: "2022-10-1",
192 |         currency: "USD",
193 |         value: 10000,
194 |         status: "positive",
195 |       },
196 |       current: {
197 |         currency: "USD",
198 |         date: "2023-10-1",
199 |         value: 20000,
200 |         status: "negative",
201 |       },
202 |       precentage: {
203 |         currency: "USD",
204 |         value: 0,
205 |         status: "positive",
206 |       },
207 |     },
208 |     {
209 |       date: "Wed Nov 01 2023",
210 |       previous: {
211 |         date: "2022-11-1",
212 |         currency: "USD",
213 |         value: 10000,
214 |         status: "positive",
215 |       },
216 |       current: {
217 |         date: "2023-11-1",
218 |         currency: "USD",
219 |         value: 20000,
220 |         status: "negative",
221 |       },
222 |       precentage: {
[TRUNCATED]
```

apps/dashboard/src/components/charts/empty-state.tsx
```
1 | import { AddAccountButton } from "@/components/add-account-button";
2 |
3 | export function EmptyState() {
4 |   return (
5 |     <div className="absolute w-full h-full top-0 left-0 flex items-center justify-center z-20">
6 |       <div className="text-center max-w-md mx-auto flex flex-col items-center justify-center">
7 |         <h2 className="text-xl font-medium mb-2">Connect bank account</h2>
8 |         <p className="text-sm text-[#878787] mb-6">
9 |           Connect your bank account to unlock powerful financial insights. Track
10 |           your spending, analyze trends, and make informed decisions.
11 |         </p>
12 |
13 |         <AddAccountButton />
14 |       </div>
15 |     </div>
16 |   );
17 | }
```

apps/dashboard/src/components/charts/expense-chart.tsx
```
1 | import { getExpenses } from "@midday/supabase/cached-queries";
2 | import { cn } from "@midday/ui/cn";
3 | import { Icons } from "@midday/ui/icons";
4 | import {
5 |   Tooltip,
6 |   TooltipContent,
7 |   TooltipProvider,
8 |   TooltipTrigger,
9 | } from "@midday/ui/tooltip";
10 | import Link from "next/link";
11 | import { AnimatedNumber } from "../animated-number";
12 | import { expenseChartExampleData } from "./data";
13 | import { StackedBarChart } from "./stacked-bar-chart";
14 |
15 | type Props = {
16 |   value: any;
17 |   defaultValue: any;
18 |   disabled?: boolean;
19 |   currency?: string;
20 | };
21 |
22 | export async function ExpenseChart({
23 |   value,
24 |   defaultValue,
25 |   disabled,
26 |   currency,
27 | }: Props) {
28 |   const data = disabled
29 |     ? expenseChartExampleData
30 |     : await getExpenses({ ...defaultValue, ...value, currency });
31 |
32 |   return (
33 |     <div className={cn(disabled && "pointer-events-none select-none")}>
34 |       <div className="space-y-2 mb-14 inline-block select-text">
35 |         <h1 className="text-4xl font-mono">
36 |           <AnimatedNumber
37 |             value={data?.summary?.averageExpense ?? 0}
38 |             currency={data?.summary?.currency ?? "USD"}
39 |           />
40 |         </h1>
41 |
42 |         <div className="text-sm text-[#606060] flex items-center space-x-2">
43 |           <p className="text-sm text-[#606060]">Average expenses</p>
44 |           <TooltipProvider delayDuration={100}>
45 |             <Tooltip>
46 |               <TooltipTrigger asChild>
47 |                 <Icons.Info className="h-4 w-4 mt-1" />
48 |               </TooltipTrigger>
49 |               <TooltipContent
50 |                 className="text-xs text-[#878787] max-w-[240px] p-4"
51 |                 side="bottom"
52 |                 sideOffset={10}
53 |               >
54 |                 <div className="space-y-2">
55 |                   <h3 className="font-medium text-primary">
56 |                     Expenses Overview
57 |                   </h3>
58 |                   <p>
59 |                     Expenses include all outgoing transactions, including
60 |                     recurring ones. The chart shows total expenses and recurring
61 |                     costs, helping you identify spending patterns and fixed
62 |                     costs.
63 |                   </p>
64 |                   <p>
65 |                     All amounts are converted into your{" "}
66 |                     <Link
67 |                       href="/settings/accounts"
68 |                       className="text-primary underline"
69 |                     >
70 |                       base currency
71 |                     </Link>
72 |                     .
73 |                   </p>
74 |                 </div>
75 |               </TooltipContent>
76 |             </Tooltip>
77 |           </TooltipProvider>
78 |         </div>
79 |       </div>
80 |       <StackedBarChart data={data} disabled={disabled} />
81 |     </div>
82 |   );
83 | }
```

apps/dashboard/src/components/charts/profit-revenue-chart.tsx
```
1 | import { getMetrics } from "@midday/supabase/cached-queries";
2 | import { cn } from "@midday/ui/cn";
3 | import { Icons } from "@midday/ui/icons";
4 | import {
5 |   Tooltip,
6 |   TooltipContent,
7 |   TooltipProvider,
8 |   TooltipTrigger,
9 | } from "@midday/ui/tooltip";
10 | import Link from "next/link";
11 | import { AnimatedNumber } from "../animated-number";
12 | import { FormatAmount } from "../format-amount";
13 | import { BarChart } from "./bar-chart";
14 | import { chartExampleData } from "./data";
15 |
16 | type Props = {
17 |   value: any;
18 |   defaultValue: any;
19 |   type: string;
20 |   disabled?: boolean;
21 |   currency?: string;
22 | };
23 |
24 | export async function ProfitRevenueChart({
25 |   value,
26 |   defaultValue,
27 |   type,
28 |   disabled,
29 |   currency,
30 | }: Props) {
31 |   const data = disabled
32 |     ? chartExampleData
33 |     : await getMetrics({ ...defaultValue, ...value, type, currency });
34 |
35 |   return (
36 |     <div className={cn(disabled && "pointer-events-none select-none")}>
37 |       <div className="space-y-2 mb-14 inline-block select-text">
38 |         <h1 className="text-4xl font-mono">
39 |           <AnimatedNumber
40 |             value={data?.summary?.currentTotal ?? 0}
41 |             currency={data?.summary?.currency ?? "USD"}
42 |           />
43 |         </h1>
44 |
45 |         <div className="text-sm text-[#606060] flex items-center space-x-2">
46 |           <p className="text-sm text-[#606060]">
47 |             vs{" "}
48 |             <FormatAmount
49 |               maximumFractionDigits={0}
50 |               minimumFractionDigits={0}
51 |               amount={data?.summary?.prevTotal ?? 0}
52 |               currency={data?.meta?.currency ?? "USD"}
53 |             />{" "}
54 |             last period
55 |           </p>
56 |           <TooltipProvider delayDuration={100}>
57 |             <Tooltip>
58 |               <TooltipTrigger asChild>
59 |                 <Icons.Info className="h-4 w-4 mt-1" />
60 |               </TooltipTrigger>
61 |               <TooltipContent
62 |                 className="text-xs text-[#878787] max-w-[240px] p-4"
63 |                 side="bottom"
64 |                 sideOffset={10}
65 |               >
66 |                 {type === "profit" ? (
67 |                   <div className="space-y-2">
68 |                     <h3 className="font-medium text-primary">
69 |                       Profit is calculated as your income minus expenses.
70 |                     </h3>
71 |                     <p>
72 |                       Explanation: This shows how much you’re making after
73 |                       costs. If the profit seems off, it may be due to internal
74 |                       transfers labeled as income. You can adjust this by
75 |                       excluding the transactions from the calculations.
76 |                     </p>
77 |
78 |                     <p>
79 |                       All amounts are converted into your{" "}
80 |                       <Link
81 |                         href="/settings/accounts"
82 |                         className="text-primary underline"
83 |                       >
84 |                         base currency
85 |                       </Link>
86 |                       .
87 |                     </p>
88 |                   </div>
89 |                 ) : (
90 |                   <div className="space-y-2">
91 |                     <h3 className="font-medium text-primary">
92 |                       Revenue represents your total income from all sources.
93 |                     </h3>
94 |                     <p>
95 |                       Explanation: This is your gross income before expenses. If
96 |                       the revenue appears too high, internal transfers may have
97 |                       been marked as income. You can fix this by excluding the
98 |                       transactions from the calculations.
99 |                     </p>
100 |
101 |                     <p>
102 |                       All amounts are converted into your{" "}
103 |                       <Link
104 |                         href="/settings/accounts"
105 |                         className="text-primary underline"
106 |                       >
107 |                         base currency
108 |                       </Link>
109 |                       .
110 |                     </p>
111 |                   </div>
112 |                 )}
113 |               </TooltipContent>
114 |             </Tooltip>
115 |           </TooltipProvider>
116 |         </div>
117 |       </div>
118 |       <BarChart data={data} disabled={disabled} />
119 |     </div>
120 |   );
121 | }
```

apps/dashboard/src/components/charts/spending-category-item.tsx
```
1 | "use client";
2 |
3 | import { useUserContext } from "@/store/user/hook";
4 | import { formatAmount } from "@/utils/format";
5 | import { CategoryColor } from "../category";
6 |
7 | type Props = {
8 |   name: string;
9 |   color: string;
10 |   amount: number;
11 |   currency: string;
12 |   percentage: number;
13 | };
14 |
15 | export function SpendingCategoryItem({
16 |   name,
17 |   color,
18 |   amount,
19 |   currency,
20 |   percentage,
21 | }: Props) {
22 |   const { locale } = useUserContext((state) => state.data);
23 |
24 |   return (
25 |     <div className="px-3 py-1 flex justify-between items-center space-x-12">
26 |       <div className="text-sm font-medium flex items-center space-x-2">
27 |         <CategoryColor name={name} color={color} />
28 |         <p>
29 |           {amount &&
30 |             formatAmount({
31 |               amount: amount,
32 |               currency,
33 |               locale,
34 |               maximumFractionDigits: 0,
35 |               minimumFractionDigits: 0,
36 |             })}
37 |         </p>
38 |       </div>
39 |       <p className="text-sm text-[#606060] truncate">{percentage}%</p>
40 |     </div>
41 |   );
42 | }
```

apps/dashboard/src/components/charts/spending-category-list.tsx
```
1 | "use client";
2 |
3 | import {
4 |   HoverCard,
5 |   HoverCardContent,
6 |   HoverCardTrigger,
7 | } from "@midday/ui/hover-card";
8 | import { Progress } from "@midday/ui/progress";
9 | import { formatISO } from "date-fns";
10 | import Link from "next/link";
11 | import { Category } from "../category";
12 | import { SpendingCategoryItem } from "./spending-category-item";
13 |
14 | type Props = {
15 |   categories: any;
16 |   period: any;
17 |   disabled: boolean;
18 | };
19 |
20 | export function SpendingCategoryList({ categories, period, disabled }: Props) {
21 |   return (
22 |     <ul className="mt-8 space-y-4 overflow-auto scrollbar-hide aspect-square pb-14">
23 |       {categories.map(({ slug, name, color, percentage, amount, currency }) => {
24 |         return (
25 |           <li key={slug}>
26 |             <HoverCard openDelay={10} closeDelay={10}>
27 |               <HoverCardTrigger asChild>
28 |                 <Link
29 |                   className="flex items-center"
30 |                   href={`/transactions?categories=${slug}&start=${formatISO(period?.from, { representation: "date" })}&end=${formatISO(period?.to, { representation: "date" })}`}
31 |                 >
32 |                   <Category
33 |                     key={slug}
34 |                     name={name}
35 |                     color={color}
36 |                     className="text-sm text-primary space-x-3 w-[90%]"
37 |                   />
38 |
39 |                   <Progress
40 |                     className="w-full rounded-none h-[6px]"
41 |                     value={percentage}
42 |                   />
43 |                 </Link>
44 |               </HoverCardTrigger>
45 |
46 |               {!disabled && (
47 |                 <HoverCardContent className="border shadow-sm bg-background py-1 px-0">
48 |                   <SpendingCategoryItem
49 |                     color={color}
50 |                     name={name}
51 |                     amount={amount}
52 |                     currency={currency}
53 |                     percentage={percentage}
54 |                   />
55 |                 </HoverCardContent>
56 |               )}
57 |             </HoverCard>
58 |           </li>
59 |         );
60 |       })}
61 |     </ul>
62 |   );
63 | }
```

apps/dashboard/src/components/charts/spending-list.tsx
```
1 | import { getSpending } from "@midday/supabase/cached-queries";
2 | import { Skeleton } from "@midday/ui/skeleton";
3 | import { spendingExampleData } from "./data";
4 | import { SpendingCategoryList } from "./spending-category-list";
5 |
6 | export function SpendingListSkeleton() {
7 |   return (
8 |     <div className="mt-8 space-y-4">
9 |       {[...Array(16)].map((_, index) => (
10 |         <div
11 |           key={index.toString()}
12 |           className="flex justify-between px-3 items-center"
13 |         >
14 |           <div className="w-[70%] flex space-x-4 pr-8 items-center">
15 |             <Skeleton className="rounded-[2px] size-[12px]" />
16 |             <Skeleton className="h-[6px] w-full rounded-none" />
17 |           </div>
18 |           <div className="w-full ml-auto">
19 |             <Skeleton className="w-full align-start h-[6px] rounded-none" />
20 |           </div>
21 |         </div>
22 |       ))}
23 |     </div>
24 |   );
25 | }
26 |
27 | type Props = {
28 |   initialPeriod: any;
29 |   disabled: boolean;
30 |   currency?: string;
31 | };
32 |
33 | export async function SpendingList({
34 |   initialPeriod,
35 |   disabled,
36 |   currency,
37 | }: Props) {
38 |   const spending = disabled
39 |     ? spendingExampleData
40 |     : await getSpending({ ...initialPeriod, currency });
41 |
42 |   if (!spending?.data?.length) {
43 |     return (
44 |       <div className="flex items-center justify-center aspect-square">
45 |         <p className="text-sm text-[#606060]">
46 |           No transactions have been categorized in this period.
47 |         </p>
48 |       </div>
49 |     );
50 |   }
51 |
52 |   return (
53 |     <SpendingCategoryList
54 |       categories={spending?.data}
55 |       period={initialPeriod}
56 |       disabled={disabled}
57 |     />
58 |   );
59 | }
```

apps/dashboard/src/components/charts/spending-period.tsx
```
1 | "use client";
2 |
3 | import { changeSpendingPeriodAction } from "@/actions/change-spending-period-action";
4 | import { useI18n } from "@/locales/client";
5 | import {
6 |   DropdownMenu,
7 |   DropdownMenuCheckboxItem,
8 |   DropdownMenuContent,
9 |   DropdownMenuTrigger,
10 | } from "@midday/ui/dropdown-menu";
11 | import { Icons } from "@midday/ui/icons";
12 | import {
13 |   endOfMonth,
14 |   startOfMonth,
15 |   startOfYear,
16 |   subDays,
17 |   subMonths,
18 |   subYears,
19 | } from "date-fns";
20 | import { useOptimisticAction } from "next-safe-action/hooks";
21 | import Link from "next/link";
22 |
23 | const options = [
24 |   {
25 |     id: "last_30d",
26 |     from: subDays(new Date(), 30).toISOString(),
27 |     to: new Date().toISOString(),
28 |   },
29 |   {
30 |     id: "this_month",
31 |     from: startOfMonth(new Date()).toISOString(),
32 |     to: new Date().toISOString(),
33 |   },
34 |   {
35 |     id: "last_month",
36 |     from: subMonths(startOfMonth(new Date()), 1).toISOString(),
37 |     to: subMonths(endOfMonth(new Date()), 1).toISOString(),
38 |   },
39 |   {
40 |     id: "this_year",
41 |     from: startOfYear(new Date()).toISOString(),
42 |     to: new Date().toISOString(),
43 |   },
44 |   {
45 |     id: "last_year",
46 |     from: subYears(startOfMonth(new Date()), 1).toISOString(),
47 |     to: subYears(endOfMonth(new Date()), 1).toISOString(),
48 |   },
49 | ];
50 |
51 | type Props = {
52 |   initialPeriod: { id: string; from: string; to: string };
53 | };
54 |
55 | export function SpendingPeriod({ initialPeriod }: Props) {
56 |   const t = useI18n();
57 |   const { execute, optimisticState } = useOptimisticAction(
58 |     changeSpendingPeriodAction,
59 |     {
60 |       currentState: initialPeriod,
61 |       updateFn: (_, newState) => newState,
62 |     },
63 |   );
64 |
65 |   return (
66 |     <div className="flex justify-between">
67 |       <div>
68 |         <Link
69 |           href={`/transactions?start=${optimisticState.from}&end=${optimisticState.to}&amount=lte,0`}
70 |           prefetch
71 |         >
72 |           <h2 className="text-lg">Spending</h2>
73 |         </Link>
74 |       </div>
75 |
76 |       <DropdownMenu>
77 |         <DropdownMenuTrigger>
78 |           <div className="flex items-center space-x-2">
79 |             <span>{t(`spending_period.${optimisticState.id}`)}</span>
80 |             <Icons.ChevronDown />
81 |           </div>
82 |         </DropdownMenuTrigger>
83 |         <DropdownMenuContent className="w-[180px]">
84 |           {options.map((option) => (
85 |             <DropdownMenuCheckboxItem
86 |               key={option.id}
87 |               onCheckedChange={() => execute(option)}
88 |               checked={option.id === optimisticState?.id}
89 |             >
90 |               {t(`spending_period.${option.id}`)}
91 |             </DropdownMenuCheckboxItem>
92 |           ))}
93 |         </DropdownMenuContent>
94 |       </DropdownMenu>
95 |     </div>
96 |   );
97 | }
```

apps/dashboard/src/components/charts/spending.tsx
```
1 | import { ErrorBoundary } from "next/dist/client/components/error-boundary";
2 | import { Suspense } from "react";
3 | import { ErrorFallback } from "../error-fallback";
4 | import { SpendingList, SpendingListSkeleton } from "./spending-list";
5 | import { SpendingPeriod } from "./spending-period";
6 |
7 | export async function Spending({
8 |   disabled,
9 |   initialPeriod,
10 |   currency,
11 | }: {
12 |   disabled: boolean;
13 |   initialPeriod: any;
14 |   currency?: string;
15 | }) {
16 |   return (
17 |     <div className="border aspect-square relative overflow-hidden">
18 |       <div className="p-4 md:p-8 flex-col">
19 |         <SpendingPeriod initialPeriod={initialPeriod} />
20 |
21 |         <ErrorBoundary errorComponent={ErrorFallback}>
22 |           <Suspense fallback={<SpendingListSkeleton />} key={initialPeriod}>
23 |             <SpendingList
24 |               initialPeriod={initialPeriod}
25 |               disabled={disabled}
26 |               currency={currency}
27 |             />
28 |           </Suspense>
29 |         </ErrorBoundary>
30 |       </div>
31 |     </div>
32 |   );
33 | }
```

apps/dashboard/src/components/charts/stacked-bar-chart.tsx
```
1 | "use client";
2 |
3 | import { useI18n } from "@/locales/client";
4 | import { useUserContext } from "@/store/user/hook";
5 | import { formatAmount } from "@/utils/format";
6 | import { Icons } from "@midday/ui/icons";
7 | import { format } from "date-fns";
8 | import {
9 |   Bar,
10 |   CartesianGrid,
11 |   ComposedChart,
12 |   Line,
13 |   ResponsiveContainer,
14 |   Tooltip,
15 |   XAxis,
16 |   YAxis,
17 | } from "recharts";
18 |
19 | const ToolTipContent = ({ payload = [] }) => {
20 |   const t = useI18n();
21 |   const { locale } = useUserContext((state) => state.data);
22 |
23 |   const current = payload[0]?.payload;
24 |
25 |   if (!current) return null;
26 |
27 |   return (
28 |     <div className="w-[240px] border shadow-sm bg-background">
29 |       <div className="border-b-[1px] px-4 py-2 flex justify-between items-center">
30 |         <p className="text-sm">{t(`chart_type.${current.meta.type}`)}</p>
31 |       </div>
32 |
33 |       <div className="p-4">
34 |         <div className="flex justify-between mb-2">
35 |           <div className="flex items-center justify-center space-x-2">
36 |             <div className="w-[8px] h-[8px] rounded-full bg-[#C6C6C6] dark:bg-[#606060]" />
37 |             <p className="font-medium text-[13px]">
38 |               {formatAmount({
39 |                 maximumFractionDigits: 0,
40 |                 minimumFractionDigits: 0,
41 |                 currency: current.currency,
42 |                 amount: current.total,
43 |                 locale,
44 |               })}
45 |             </p>
46 |           </div>
47 |
48 |           <p className="text-xs text-[#606060] text-right">Total</p>
49 |         </div>
50 |
51 |         <div className="flex justify-between">
52 |           <div className="flex items-center justify-center space-x-2">
53 |             <Icons.DotRaster />
54 |             <p className="font-medium text-[13px]">
55 |               {formatAmount({
56 |                 amount: current.recurring,
57 |                 currency: current.currency,
58 |                 maximumFractionDigits: 0,
59 |                 minimumFractionDigits: 0,
60 |                 locale,
61 |               })}
62 |             </p>
63 |           </div>
64 |
65 |           <p className="text-xs text-[#606060] text-right">Recurring</p>
66 |         </div>
67 |       </div>
68 |     </div>
69 |   );
70 | };
71 |
72 | export function StackedBarChart({ data, height = 290 }) {
73 |   const formattedData = data.result.map((item) => ({
74 |     ...item,
75 |     value: item.value,
76 |     recurring: item.recurring,
77 |     total: item.total,
78 |     meta: data.meta,
79 |     date: format(new Date(item.date), "MMM"),
80 |   }));
81 |
82 |   return (
83 |     <div className="relative h-full w-full">
84 |       <div className="space-x-4 absolute right-0 -top-10 hidden md:flex">
85 |         <div className="flex space-x-2 items-center">
86 |           <span className="w-2 h-2 rounded-full bg-[#C6C6C6] dark:bg-[#606060]" />
87 |           <span className="text-sm text-[#606060]">Total expenses</span>
88 |         </div>
89 |         <div className="flex space-x-2 items-center">
90 |           <Icons.DotRaster />
91 |           <span className="text-sm text-[#606060]">Recurring</span>
92 |         </div>
93 |       </div>
94 |
95 |       <ResponsiveContainer width="100%" height={height}>
96 |         <ComposedChart data={formattedData} barGap={15}>
97 |           <defs>
98 |             <pattern
99 |               id="raster"
100 |               patternUnits="userSpaceOnUse"
101 |               width="64"
102 |               height="64"
103 |             >
104 |               <rect
105 |                 width="64"
106 |                 height="64"
107 |                 className="dark:fill-[#323232] fill-[#C6C6C6]"
108 |               />
109 |               <path
110 |                 d="M-106 110L22 -18"
111 |                 className="stroke-[#323232] dark:stroke-white"
112 |               />
113 |               <path
114 |                 d="M-98 110L30 -18"
115 |                 className="stroke-[#323232] dark:stroke-white"
116 |               />
117 |               <path
118 |                 d="M-90 110L38 -18"
119 |                 className="stroke-[#323232] dark:stroke-white"
120 |               />
121 |               <path
122 |                 d="M-82 110L46 -18"
123 |                 className="stroke-[#323232] dark:stroke-white"
124 |               />
125 |               <path
126 |                 d="M-74 110L54 -18"
127 |                 className="stroke-[#323232] dark:stroke-white"
128 |               />
129 |               <path
130 |                 d="M-66 110L62 -18"
131 |                 className="stroke-[#323232] dark:stroke-white"
132 |               />
133 |               <path
134 |                 d="M-58 110L70 -18"
135 |                 className="stroke-[#323232] dark:stroke-white"
136 |               />
137 |               <path
138 |                 d="M-50 110L78 -18"
139 |                 className="stroke-[#323232] dark:stroke-white"
140 |               />
141 |               <path
142 |                 d="M-42 110L86 -18"
143 |                 className="stroke-[#323232] dark:stroke-white"
144 |               />
145 |               <path
146 |                 d="M-34 110L94 -18"
147 |                 className="stroke-[#323232] dark:stroke-white"
148 |               />
[TRUNCATED]
```

apps/dashboard/src/components/charts/status.tsx
```
1 | "use client";
2 |
3 | import { cn } from "@midday/ui/cn";
4 | import { Icons } from "@midday/ui/icons";
5 |
6 | type Props = {
7 |   value: string;
8 |   variant?: "positive" | "negative";
9 | };
10 |
11 | export function Status({ value, variant }: Props) {
12 |   return (
13 |     <div
14 |       className={cn(
15 |         "flex space-x-1 text-[#FF3638] items-center",
16 |         variant === "positive" && "text-[#00C969]"
17 |       )}
18 |     >
19 |       {variant === "positive" ? (
20 |         <Icons.TrendingUp size={14} />
21 |       ) : (
22 |         <Icons.TrendingDown size={14} />
23 |       )}
24 |
25 |       <p className="text-[12px] font-medium">{value}</p>
26 |     </div>
27 |   );
28 | }
```

apps/dashboard/src/components/charts/transaction-list-item.tsx
```
1 | "use client";
2 |
3 | import type { UpdateTransactionValues } from "@/actions/schema";
4 | import { updateTransactionAction } from "@/actions/update-transaction-action";
5 | import { TransactionSheet } from "@/components/sheets/transaction-sheet";
6 | import { cn } from "@midday/ui/cn";
7 | import { useAction } from "next-safe-action/hooks";
8 | import { useState } from "react";
9 | import { FormatAmount } from "../format-amount";
10 | import { TransactionStatus } from "../transaction-status";
11 |
12 | type Props = {
13 |   transaction: any;
14 |   disabled?: boolean;
15 | };
16 |
17 | export function TransactionListItem({ transaction, disabled }: Props) {
18 |   const [isOpen, setOpen] = useState(false);
19 |   const updateTransaction = useAction(updateTransactionAction);
20 |
21 |   const handleUpdateTransaction = (values: UpdateTransactionValues) => {
22 |     updateTransaction.execute(values);
23 |   };
24 |
25 |   const fullfilled =
26 |     transaction?.status === "completed" || transaction?.attachments?.length > 0;
27 |
28 |   return (
29 |     <>
30 |       <div onClick={() => setOpen(true)} className="w-full">
31 |         <div className="flex items-center py-3">
32 |           <div className="w-[50%] flex space-x-2">
33 |             <span
34 |               className={cn(
35 |                 "text-sm line-clamp-1",
36 |                 disabled && "skeleton-box animate-none",
37 |                 transaction?.category?.slug === "income" && "text-[#00C969]",
38 |               )}
39 |             >
40 |               {transaction.name}
41 |             </span>
42 |           </div>
43 |           <div className="w-[35%]">
44 |             <span
45 |               className={cn(
46 |                 "text-sm line-clamp-1",
47 |                 disabled && "skeleton-box animate-none",
48 |                 transaction?.category?.slug === "income" && "text-[#00C969]",
49 |               )}
50 |             >
51 |               <FormatAmount
52 |                 amount={transaction.amount}
53 |                 currency={transaction.currency}
54 |               />
55 |             </span>
56 |           </div>
57 |
58 |           <div className="ml-auto">
59 |             <TransactionStatus fullfilled={fullfilled} />
60 |           </div>
61 |         </div>
62 |       </div>
63 |
64 |       <TransactionSheet
65 |         isOpen={isOpen}
66 |         setOpen={setOpen}
67 |         data={transaction}
68 |         updateTransaction={handleUpdateTransaction}
69 |       />
70 |     </>
71 |   );
72 | }
```

apps/dashboard/src/components/charts/transactions-item-list.tsx
```
1 | import { TransactionListItem } from "@/components/charts/transaction-list-item";
2 |
3 | export function TransactionsItemList({ transactions, disabled }) {
4 |   return (
5 |     <ul className="bullet-none divide-y cursor-pointer overflow-auto scrollbar-hide aspect-square pb-24">
6 |       {transactions?.map((transaction) => {
7 |         return (
8 |           <li key={transaction.id}>
9 |             <TransactionListItem
10 |               transaction={transaction}
11 |               disabled={disabled}
12 |             />
13 |           </li>
14 |         );
15 |       })}
16 |     </ul>
17 |   );
18 | }
```

apps/dashboard/src/components/charts/transactions-list.tsx
```
1 | import { getTransactions } from "@midday/supabase/cached-queries";
2 | import { Skeleton } from "@midday/ui/skeleton";
3 | import { transactionExampleData } from "./data";
4 | import { TransactionsItemList } from "./transactions-item-list";
5 |
6 | export function TransactionsListHeader() {
7 |   return (
8 |     <div className="flex py-3 border-b-[1px]">
9 |       <span className="font-medium text-sm w-[50%]">Description</span>
10 |       <span className="font-medium text-sm w-[35%]">Amount</span>
11 |       <span className="font-medium text-sm ml-auto">Status</span>
12 |     </div>
13 |   );
14 | }
15 |
16 | export function TransactionsListSkeleton() {
17 |   return (
18 |     <div className="divide-y">
19 |       {[...Array(6)].map((_, index) => (
20 |         <div
21 |           key={index.toString()}
22 |           className="flex justify-between px-3 items-center h-[49px]"
23 |         >
24 |           <div className="w-[60%]">
25 |             <Skeleton className="h-3 w-[50%]" />
26 |           </div>
27 |           <div className="w-[40%] ml-auto">
28 |             <Skeleton className="w-[60%] h-3 align-start" />
29 |           </div>
30 |         </div>
31 |       ))}
32 |     </div>
33 |   );
34 | }
35 |
36 | type Props = {
37 |   type: string;
38 |   disabled: boolean;
39 | };
40 |
41 | export async function TransactionsList({ type, disabled }: Props) {
42 |   const transactions = disabled
43 |     ? transactionExampleData
44 |     : await getTransactions({
45 |         to: 15,
46 |         from: 0,
47 |         filter: {
48 |           type,
49 |         },
50 |       });
51 |
52 |   if (!transactions?.data?.length) {
53 |     return (
54 |       <div className="flex items-center justify-center aspect-square">
55 |         <p className="text-sm text-[#606060] -mt-12">No transactions found</p>
56 |       </div>
57 |     );
58 |   }
59 |
60 |   return (
61 |     <TransactionsItemList
62 |       transactions={transactions?.data}
63 |       disabled={disabled}
64 |     />
65 |   );
66 | }
```

apps/dashboard/src/components/charts/transactions-period.tsx
```
1 | "use client";
2 |
3 | import { changeTransactionsPeriodAction } from "@/actions/change-transactions-period-action";
4 | import { useI18n } from "@/locales/client";
5 | import {
6 |   DropdownMenu,
7 |   DropdownMenuCheckboxItem,
8 |   DropdownMenuContent,
9 |   DropdownMenuTrigger,
10 | } from "@midday/ui/dropdown-menu";
11 | import { Icons } from "@midday/ui/icons";
12 | import { useOptimisticAction } from "next-safe-action/hooks";
13 | import Link from "next/link";
14 |
15 | const options = ["all", "income", "expense"] as const;
16 | type TransactionType = (typeof options)[number];
17 |
18 | type Props = {
19 |   type: "all" | "income" | "expense";
20 |   disabled: boolean;
21 | };
22 |
23 | export function TransactionsPeriod({ type, disabled }: Props) {
24 |   const t = useI18n();
25 |   const { execute, optimisticState } = useOptimisticAction(
26 |     changeTransactionsPeriodAction,
27 |     {
28 |       currentState: type,
29 |       updateFn: (_, newState) => newState,
30 |     },
31 |   );
32 |
33 |   return (
34 |     <div className="flex justify-between">
35 |       <div>
36 |         <Link href="/transactions" prefetch>
37 |           <h2 className="text-lg">Transactions</h2>
38 |         </Link>
39 |       </div>
40 |
41 |       <DropdownMenu>
42 |         <DropdownMenuTrigger disabled={disabled}>
43 |           <div className="flex items-center space-x-2">
44 |             <span>{t(`transactions_period.${optimisticState}`)}</span>
45 |             <Icons.ChevronDown />
46 |           </div>
47 |         </DropdownMenuTrigger>
48 |         <DropdownMenuContent className="w-[130px]">
49 |           {options.map((option) => (
50 |             <DropdownMenuCheckboxItem
51 |               key={option}
52 |               onCheckedChange={() => execute(option as TransactionType)}
53 |               checked={option === optimisticState}
54 |             >
55 |               {t(`transactions_period.${option}`)}
56 |             </DropdownMenuCheckboxItem>
57 |           ))}
58 |         </DropdownMenuContent>
59 |       </DropdownMenu>
60 |     </div>
61 |   );
62 | }
```

apps/dashboard/src/components/charts/transactions.tsx
```
1 | import { ErrorBoundary } from "next/dist/client/components/error-boundary";
2 | import { cookies } from "next/headers";
3 | import { Suspense } from "react";
4 | import { ErrorFallback } from "../error-fallback";
5 | import {
6 |   TransactionsList,
7 |   TransactionsListHeader,
8 |   TransactionsListSkeleton,
9 | } from "./transactions-list";
10 | import { TransactionsPeriod } from "./transactions-period";
11 |
12 | export async function Transactions({ disabled }) {
13 |   const type = cookies().get("transactions-period")?.value ?? "all";
14 |
15 |   return (
16 |     <div className="border aspect-square overflow-hidden relative p-4 md:p-8">
17 |       <TransactionsPeriod type={type} disabled={disabled} />
18 |
19 |       <div className="mt-4">
20 |         <TransactionsListHeader />
21 |         <ErrorBoundary errorComponent={ErrorFallback}>
22 |           <Suspense key={type} fallback={<TransactionsListSkeleton />}>
23 |             <TransactionsList type={type} disabled={disabled} />
24 |           </Suspense>
25 |         </ErrorBoundary>
26 |       </div>
27 |     </div>
28 |   );
29 | }
```

apps/dashboard/src/components/chat/chat-avatar.tsx
```
1 | "use client";
2 |
3 | import type { AI } from "@/actions/ai/chat";
4 | import { Avatar, AvatarImageNext } from "@midday/ui/avatar";
5 | import { useAIState } from "ai/rsc";
6 |
7 | type Props = {
8 |   role: "assistant" | "user";
9 | };
10 | export function ChatAvatar({ role }: Props) {
11 |   const [aiState] = useAIState<typeof AI>();
12 |
13 |   switch (role) {
14 |     case "user": {
15 |       return (
16 |         <Avatar className="size-6">
17 |           <AvatarImageNext
18 |             src={aiState?.user?.avatar_url || ""}
19 |             alt={aiState?.user?.full_name ?? ""}
20 |             width={24}
21 |             height={24}
22 |           />
23 |         </Avatar>
24 |       );
25 |     }
26 |
27 |     default:
28 |       return (
29 |         <svg
30 |           xmlns="http://www.w3.org/2000/svg"
31 |           width={24}
32 |           height={24}
33 |           fill="none"
34 |         >
35 |           <path
36 |             fill="currentColor"
37 |             fillRule="evenodd"
38 |             d="M11.479 0a11.945 11.945 0 0 0-5.026 1.344l5.026 8.705V0Zm0 13.952-5.026 8.704A11.946 11.946 0 0 0 11.48 24V13.952ZM12.523 24V13.946l5.028 8.708A11.943 11.943 0 0 1 12.523 24Zm0-13.946V0c1.808.078 3.513.555 5.028 1.346l-5.028 8.708Zm-10.654 8.4 8.706-5.026-5.026 8.706a12.075 12.075 0 0 1-3.68-3.68ZM22.134 5.55l-8.706 5.026 5.027-8.706a12.075 12.075 0 0 1 3.679 3.68ZM1.868 5.547a12.075 12.075 0 0 1 3.68-3.68l5.028 8.708-8.708-5.028Zm-.523.904A11.945 11.945 0 0 0 0 11.479h10.054l-8.71-5.028Zm0 11.1A11.945 11.945 0 0 1 0 12.524h10.053L1.346 17.55Zm12.606-6.072H24a11.946 11.946 0 0 0-1.345-5.026l-8.705 5.026Zm8.705 6.07-8.704-5.025H24a11.945 11.945 0 0 1-1.344 5.025Zm-9.226-4.12 5.024 8.702a12.075 12.075 0 0 0 3.678-3.678l-8.702-5.025Z"
39 |             clipRule="evenodd"
40 |           />
41 |         </svg>
42 |       );
43 |   }
44 | }
```

apps/dashboard/src/components/chat/chat-empty.tsx
```
1 | import { Icons } from "@midday/ui/icons";
2 |
3 | type Props = {
4 |   firstName: string;
5 | };
6 |
7 | export function ChatEmpty({ firstName }: Props) {
8 |   return (
9 |     <div className="w-full mt-[200px] todesktop:mt-24 md:mt-24 flex flex-col items-center justify-center text-center">
10 |       <Icons.LogoSmall />
11 |       <span className="font-medium text-xl mt-6">
12 |         Hi {firstName}, how can I help <br />
13 |         you today?
14 |       </span>
15 |     </div>
16 |   );
17 | }
```

apps/dashboard/src/components/chat/chat-examples.tsx
```
1 | "use client";
2 |
3 | import { shuffle } from "@midday/utils";
4 | import { motion } from "framer-motion";
5 | import { useMemo, useRef } from "react";
6 | import { useDraggable } from "react-use-draggable-scroll";
7 | import { chatExamples } from "./examples";
8 |
9 | const listVariant = {
10 |   hidden: { y: 45, opacity: 0 },
11 |   show: {
12 |     y: 0,
13 |     opacity: 1,
14 |     transition: {
15 |       duration: 0.3,
16 |       staggerChildren: 0.08,
17 |     },
18 |   },
19 | };
20 |
21 | const itemVariant = {
22 |   hidden: { y: 45, opacity: 0 },
23 |   show: { y: 0, opacity: 1 },
24 | };
25 |
26 | export function ChatExamples({ onSubmit }) {
27 |   const items = useMemo(() => shuffle(chatExamples), []);
28 |   const ref = useRef();
29 |   const { events } = useDraggable(ref);
30 |
31 |   const totalLength = chatExamples.reduce((accumulator, currentString) => {
32 |     return accumulator + currentString.length * 8.2 + 20;
33 |   }, 0);
34 |
35 |   return (
36 |     <div
37 |       className="absolute z-10 bottom-[100px] left-0 right-0 overflow-scroll scrollbar-hide cursor-grabbing hidden md:block"
38 |       {...events}
39 |       ref={ref}
40 |     >
41 |       <motion.ul
42 |         variants={listVariant}
43 |         initial="hidden"
44 |         animate="show"
45 |         className="flex space-x-4 ml-4 items-center"
46 |         style={{ width: `${totalLength}px` }}
47 |       >
48 |         {items.map((example) => (
49 |           <button key={example} type="button" onClick={() => onSubmit(example)}>
50 |             <motion.li
51 |               variants={itemVariant}
52 |               className="font-mono text-[#878787] bg-[#F2F1EF] text-xs dark:bg-[#1D1D1D] px-3 py-2 rounded-full cursor-default"
53 |             >
54 |               {example}
55 |             </motion.li>
56 |           </button>
57 |         ))}
58 |       </motion.ul>
59 |     </div>
60 |   );
61 | }
```

apps/dashboard/src/components/chat/chat-footer.tsx
```
1 | import { useAssistantStore } from "@/store/assistant";
2 | import { Icons } from "@midday/ui/icons";
3 | import { Popover, PopoverContent, PopoverTrigger } from "@midday/ui/popover";
4 | import { app, platform } from "@todesktop/client-core";
5 | import { isDesktopApp } from "@todesktop/client-core/platform/todesktop";
6 | import { useRouter } from "next/navigation";
7 |
8 | type Props = {
9 |   onSubmit: () => void;
10 |   showFeedback: () => void;
11 | };
12 |
13 | export function ChatFooter({ onSubmit, showFeedback }: Props) {
14 |   const router = useRouter();
15 |   const { setOpen } = useAssistantStore();
16 |
17 |   const handleOpenUrl = (url: string) => {
18 |     if (isDesktopApp()) {
19 |       return platform.os.openURL(url);
20 |     }
21 |
22 |     router.push(url);
23 |   };
24 |
25 |   return (
26 |     <div className="hidden todesktop:flex md:flex px-3 h-[40px] w-full border-t-[1px] items-center bg-background backdrop-filter dark:border-[#2C2C2C] backdrop-blur-lg dark:bg-[#151515]/[99]">
27 |       <Popover>
28 |         <PopoverTrigger>
29 |           <div className="scale-50 opacity-50 -ml-2">
30 |             <Icons.LogoSmall />
31 |           </div>
32 |         </PopoverTrigger>
33 |
34 |         <PopoverContent
35 |           className="bg-background backdrop-filter dark:border-[#2C2C2C] backdrop-blur-lg dark:bg-[#1A1A1A]/95 p-2 rounded-lg -ml-2 w-auto"
36 |           side="top"
37 |           align="start"
38 |           sideOffset={10}
39 |         >
40 |           <ul className="flex flex-col space-y-2">
41 |             <li>
42 |               <button
43 |                 type="button"
44 |                 className="flex space-x-2 items-center text-xs hover:bg-[#F2F1EF] dark:hover:bg-[#2b2b2b] rounded-md transition-colors w-full p-1"
45 |                 onClick={() => handleOpenUrl("https://x.com/middayai")}
46 |               >
47 |                 <Icons.X className="w-[16px] h-[16px]" />
48 |                 <span>Follow us</span>
49 |               </button>
50 |             </li>
51 |             <li>
52 |               <button
53 |                 type="button"
54 |                 className="flex space-x-2 items-center text-xs hover:bg-[#F2F1EF] dark:hover:bg-[#2b2b2b] rounded-md transition-colors w-full p-1"
55 |                 onClick={() => handleOpenUrl("https://go.midday.ai/anPiuRx")}
56 |               >
57 |                 <Icons.Discord className="w-[16px] h-[16px]" />
58 |                 <span>Join Our Community</span>
59 |               </button>
60 |             </li>
61 |
62 |             <li>
63 |               <button
64 |                 type="button"
65 |                 className="flex space-x-2 items-center text-xs hover:bg-[#F2F1EF] dark:hover:bg-[#2b2b2b] rounded-md transition-colors w-full p-1"
66 |                 onClick={showFeedback}
67 |               >
68 |                 <Icons.ChatBubble className="w-[16px] h-[16px]" />
69 |                 <span>Send feedback</span>
70 |               </button>
71 |             </li>
72 |
73 |             <li>
74 |               <button
75 |                 type="button"
76 |                 className="flex space-x-2 items-center text-xs hover:bg-[#F2F1EF] dark:hover:bg-[#2b2b2b] rounded-md transition-colors w-full p-1"
77 |                 onClick={() => handleOpenUrl("https://git.new/midday")}
78 |               >
79 |                 <Icons.GithubOutline className="w-[16px] h-[16px]" />
80 |                 <span>Github</span>
81 |               </button>
82 |             </li>
83 |
84 |             <li>
85 |               <button
86 |                 type="button"
87 |                 className="flex space-x-2 items-center text-xs hover:bg-[#F2F1EF] dark:hover:bg-[#2b2b2b] rounded-md transition-colors w-full p-1"
88 |                 onClick={() => {
89 |                   router.push("/account/assistant");
90 |                   setOpen();
91 |                 }}
92 |               >
93 |                 <Icons.Settings className="w-[16px] h-[16px]" />
94 |                 <span>Settings</span>
95 |               </button>
96 |             </li>
97 |
98 |             <li className="hidden todesktop:block">
99 |               <button
100 |                 type="button"
101 |                 className="flex space-x-2 items-center text-xs hover:bg-[#F2F1EF] dark:hover:bg-[#2b2b2b] rounded-md transition-colors w-full p-1 text-destructive"
102 |                 onClick={() => app.quit()}
103 |               >
104 |                 <Icons.ExitToApp className="w-[16px] h-[16px]" />
105 |                 <span>Quit Midday</span>
106 |               </button>
107 |             </li>
108 |           </ul>
109 |         </PopoverContent>
110 |       </Popover>
111 |
112 |       <div className="ml-auto flex space-x-4">
113 |         <button
114 |           className="flex space-x-2 items-center text-xs"
115 |           type="button"
116 |           onClick={onSubmit}
117 |         >
118 |           <span>Submit</span>
119 |           <kbd className="pointer-events-none h-5 select-none items-center gap-1 border bg-accent px-1.5 font-mono text-[10px] font-medium">
120 |             <span>↵</span>
121 |           </kbd>
122 |         </button>
123 |       </div>
124 |     </div>
125 |   );
126 | }
```

apps/dashboard/src/components/chat/chat-list.tsx
```
1 | "use client";
2 |
3 | import type { ClientMessage } from "@/actions/ai/types";
4 | import { cn } from "@midday/ui/cn";
5 |
6 | type Props = {
7 |   messages: ClientMessage[];
8 |   className?: string;
9 | };
10 |
11 | export function ChatList({ messages, className }: Props) {
12 |   if (!messages.length) {
13 |     return null;
14 |   }
15 |
16 |   return (
17 |     <div className={cn("flex flex-col select-text", className)}>
18 |       {messages
19 |         .filter((tool) => tool.display !== undefined)
20 |         .map((message, index) => (
21 |           <div key={message.id}>
22 |             {message.display}
23 |             {index < messages.length - 1 && <div className="my-6" />}
24 |           </div>
25 |         ))}
26 |     </div>
27 |   );
28 | }
```

apps/dashboard/src/components/chat/examples.ts
```
1 | export const chatExamples = [
2 |   `What's my burn rate`,
3 |   `What's my runway`,
4 |   "Show transactions without receipts",
5 |   "What is my spending on Software",
6 |   "Find a receipt or invoice",
7 |   "Find a transaction",
8 |   `What's my profit for last year`,
9 |   `What's my revenue`,
10 |   "Create a report",
11 |   "Forecast profit",
12 |   "Forecast revenue",
13 |   "Find a document",
14 |   "Recurring transactions",
15 |   "Top expenses this month",
16 | ];
```

apps/dashboard/src/components/chat/index.tsx
```
1 | "use client";
2 |
3 | import type { ClientMessage } from "@/actions/ai/types";
4 | import { useEnterSubmit } from "@/hooks/use-enter-submit";
5 | import { useScrollAnchor } from "@/hooks/use-scroll-anchor";
6 | import { useAssistantStore } from "@/store/assistant";
7 | import { ScrollArea } from "@midday/ui/scroll-area";
8 | import { Textarea } from "@midday/ui/textarea";
9 | import { useActions } from "ai/rsc";
10 | import { nanoid } from "nanoid";
11 | import { useEffect, useRef } from "react";
12 | import { ChatEmpty } from "./chat-empty";
13 | import { ChatExamples } from "./chat-examples";
14 | import { ChatFooter } from "./chat-footer";
15 | import { ChatList } from "./chat-list";
16 | import { UserMessage } from "./messages";
17 |
18 | export function Chat({
19 |   messages,
20 |   submitMessage,
21 |   user,
22 |   onNewChat,
23 |   input,
24 |   setInput,
25 |   showFeedback,
26 | }) {
27 |   const { submitUserMessage } = useActions();
28 |   const { formRef, onKeyDown } = useEnterSubmit();
29 |   const ref = useRef(false);
30 |   const inputRef = useRef<HTMLTextAreaElement>(null);
31 |
32 |   const { message } = useAssistantStore();
33 |
34 |   const onSubmit = async (input: string) => {
35 |     const value = input.trim();
36 |
37 |     if (value.length === 0) {
38 |       return null;
39 |     }
40 |
41 |     setInput("");
42 |     scrollToBottom();
43 |
44 |     submitMessage((message: ClientMessage[]) => [
45 |       ...message,
46 |       {
47 |         id: nanoid(),
48 |         role: "user",
49 |         display: <UserMessage>{value}</UserMessage>,
50 |       },
51 |     ]);
52 |
53 |     const responseMessage = await submitUserMessage(value);
54 |
55 |     submitMessage((messages: ClientMessage[]) => [
56 |       ...messages,
57 |       responseMessage,
58 |     ]);
59 |   };
60 |
61 |   useEffect(() => {
62 |     if (!ref.current && message) {
63 |       onNewChat();
64 |       onSubmit(message);
65 |       ref.current = true;
66 |     }
67 |   }, []);
68 |
69 |   useEffect(() => {
70 |     requestAnimationFrame(() => {
71 |       inputRef?.current.focus();
72 |     });
73 |   }, [messages]);
74 |
75 |   const { messagesRef, scrollRef, visibilityRef, scrollToBottom } =
76 |     useScrollAnchor();
77 |
78 |   const showExamples = messages.length === 0 && !input;
79 |
80 |   return (
81 |     <div className="relative">
82 |       <ScrollArea className="todesktop:h-[335px] md:h-[335px]" ref={scrollRef}>
83 |         <div ref={messagesRef}>
84 |           {messages.length ? (
85 |             <ChatList messages={messages} className="p-4 pb-8" />
86 |           ) : (
87 |             <ChatEmpty firstName={user?.full_name.split(" ").at(0)} />
88 |           )}
89 |
90 |           <div className="w-full h-px" ref={visibilityRef} />
91 |         </div>
92 |       </ScrollArea>
93 |
94 |       <div className="fixed bottom-[1px] left-[1px] right-[1px] todesktop:h-[88px] md:h-[88px] bg-background border-border border-t-[1px]">
95 |         {showExamples && <ChatExamples onSubmit={onSubmit} />}
96 |
97 |         <form
98 |           ref={formRef}
99 |           onSubmit={(evt) => {
100 |             evt.preventDefault();
101 |             onSubmit(input);
102 |           }}
103 |         >
104 |           <Textarea
105 |             ref={inputRef}
106 |             tabIndex={0}
107 |             rows={1}
108 |             spellCheck={false}
109 |             autoComplete="off"
110 |             autoCorrect="off"
111 |             value={input}
112 |             className="h-12 min-h-12 pt-3 resize-none border-none"
113 |             placeholder="Ask Midday a question..."
114 |             onKeyDown={onKeyDown}
115 |             onChange={(evt) => {
116 |               setInput(evt.target.value);
117 |             }}
118 |           />
119 |         </form>
120 |
121 |         <ChatFooter
122 |           onSubmit={() => onSubmit(input)}
123 |           showFeedback={showFeedback}
124 |         />
125 |       </div>
126 |     </div>
127 |   );
128 | }
```

apps/dashboard/src/components/chat/messages.tsx
```
1 | "use client";
2 |
3 | import { useStreamableText } from "@/hooks/use-streamable-text";
4 | import { cn } from "@midday/ui/cn";
5 | import type { StreamableValue } from "ai/rsc";
6 | import { ErrorBoundary } from "next/dist/client/components/error-boundary";
7 | import { ErrorFallback } from "../error-fallback";
8 | import { MemoizedReactMarkdown } from "../markdown";
9 | import { ChatAvatar } from "./chat-avatar";
10 | import { spinner } from "./spinner";
11 |
12 | export function UserMessage({ children }: { children: React.ReactNode }) {
13 |   return (
14 |     <div className="group relative flex items-start">
15 |       <div className="flex size-[25px] shrink-0 select-none items-center justify-center">
16 |         <ChatAvatar role="user" />
17 |       </div>
18 |
19 |       <div className="ml-4 flex-1 space-y-2 overflow-hidden pl-2 text-xs font-mono leading-relaxed">
20 |         {children}
21 |       </div>
22 |     </div>
23 |   );
24 | }
25 |
26 | export function SpinnerMessage() {
27 |   return (
28 |     <div className="group relative flex items-start">
29 |       <div className="flex size-[25px] shrink-0 select-none items-center justify-center">
30 |         <ChatAvatar role="assistant" />
31 |       </div>
32 |
33 |       <div className="ml-4 flex-1 space-y-2 overflow-hidden pl-2">
34 |         {spinner}
35 |       </div>
36 |     </div>
37 |   );
38 | }
39 |
40 | export function BotMessage({
41 |   content,
42 | }: {
43 |   content: string | StreamableValue<string>;
44 | }) {
45 |   const text = useStreamableText(content);
46 |
47 |   return (
48 |     <ErrorBoundary errorComponent={ErrorFallback}>
49 |       <div className="group relative flex items-start">
50 |         <div className="flex size-[25px] shrink-0 select-none items-center justify-center">
51 |           <ChatAvatar role="assistant" />
52 |         </div>
53 |
54 |         <div className="ml-4 flex-1 overflow-hidden pl-2 text-xs font-mono">
55 |           <MemoizedReactMarkdown
56 |             className="prose break-words dark:prose-invert leading-relaxed prose-pre:p-0 mb-2 last:mb-0 text-xs font-mono"
57 |             components={{
58 |               p({ children }) {
59 |                 return children;
60 |               },
61 |               ol({ children }) {
62 |                 return <ol>{children}</ol>;
63 |               },
64 |               ul({ children }) {
65 |                 return <ul>{children}</ul>;
66 |               },
67 |             }}
68 |           >
69 |             {text}
70 |           </MemoizedReactMarkdown>
71 |         </div>
72 |       </div>
73 |     </ErrorBoundary>
74 |   );
75 | }
76 |
77 | export function BotCard({
78 |   children,
79 |   showAvatar = true,
80 |   className,
81 | }: {
82 |   children?: React.ReactNode;
83 |   showAvatar?: boolean;
84 |   className?: string;
85 | }) {
86 |   return (
87 |     <ErrorBoundary errorComponent={ErrorFallback}>
88 |       <div className="group relative flex items-start">
89 |         <div className="flex size-[25px] shrink-0 select-none items-center justify-center">
90 |           {showAvatar && <ChatAvatar role="assistant" />}
91 |         </div>
92 |
93 |         <div
94 |           className={cn(
95 |             "ml-4 flex-1 space-y-2 overflow-hidden pl-2 text-xs font-mono leading-relaxed",
96 |             className,
97 |           )}
98 |         >
99 |           {children}
100 |         </div>
101 |       </div>
102 |     </ErrorBoundary>
103 |   );
104 | }
```

apps/dashboard/src/components/chat/spinner.tsx
```
1 | "use client";
2 |
3 | export const spinner = (
4 |   <svg
5 |     fill="none"
6 |     stroke="currentColor"
7 |     strokeWidth="1.5"
8 |     viewBox="0 0 24 24"
9 |     strokeLinecap="round"
10 |     strokeLinejoin="round"
11 |     xmlns="http://www.w3.org/2000/svg"
12 |     className="size-5 animate-spin stroke-zinc-400"
13 |   >
14 |     <path d="M12 3v3m6.366-.366-2.12 2.12M21 12h-3m.366 6.366-2.12-2.12M12 21v-3m-6.366.366 2.12-2.12M3 12h3m-.366-6.366 2.12 2.12" />
15 |   </svg>
16 | );
```

apps/dashboard/src/components/forms/create-team-form.tsx
```
1 | "use client";
2 |
3 | import { createTeamAction } from "@/actions/create-team-action";
4 | import { createTeamSchema } from "@/actions/schema";
5 | import { zodResolver } from "@hookform/resolvers/zod";
6 | import { Button } from "@midday/ui/button";
7 | import {
8 |   Form,
9 |   FormControl,
10 |   FormField,
11 |   FormItem,
12 |   FormMessage,
13 | } from "@midday/ui/form";
14 | import { Input } from "@midday/ui/input";
15 | import { Loader2 } from "lucide-react";
16 | import { useAction } from "next-safe-action/hooks";
17 | import { useForm } from "react-hook-form";
18 | import type { z } from "zod";
19 |
20 | export function CreateTeamForm() {
21 |   const createTeam = useAction(createTeamAction);
22 |
23 |   const form = useForm<z.infer<typeof createTeamSchema>>({
24 |     resolver: zodResolver(createTeamSchema),
25 |     defaultValues: {
26 |       name: "",
27 |     },
28 |   });
29 |
30 |   function onSubmit(values: z.infer<typeof createTeamSchema>) {
31 |     createTeam.execute({ name: values.name, redirectTo: "/teams/invite" });
32 |   }
33 |
34 |   return (
35 |     <Form {...form}>
36 |       <form onSubmit={form.handleSubmit(onSubmit)}>
37 |         <FormField
38 |           control={form.control}
39 |           name="name"
40 |           render={({ field }) => (
41 |             <FormItem>
42 |               <FormControl>
43 |                 <Input
44 |                   autoFocus
45 |                   className="mt-3"
46 |                   placeholder="Ex: Acme Marketing or Acme Co"
47 |                   autoComplete="off"
48 |                   autoCapitalize="none"
49 |                   autoCorrect="off"
50 |                   spellCheck="false"
51 |                   {...field}
52 |                 />
53 |               </FormControl>
54 |
55 |               <FormMessage />
56 |             </FormItem>
57 |           )}
58 |         />
59 |
60 |         <Button
61 |           className="mt-6 w-full"
62 |           type="submit"
63 |           disabled={createTeam.status === "executing"}
64 |         >
65 |           {createTeam.status === "executing" ? (
66 |             <Loader2 className="h-4 w-4 animate-spin" />
67 |           ) : (
68 |             "Next"
69 |           )}
70 |         </Button>
71 |       </form>
72 |     </Form>
73 |   );
74 | }
```

apps/dashboard/src/components/forms/create-transaction-form.tsx
```
1 | import { findMatchingCategory } from "@/actions/ai/find-matching-category";
2 | import { createTransactionAction } from "@/actions/create-transaction-action";
3 | import { createTransactionSchema } from "@/actions/schema";
4 | import { AssignUser } from "@/components/assign-user";
5 | import { Attachments } from "@/components/attachments";
6 | import { SelectAccount } from "@/components/select-account";
7 | import { SelectCategory } from "@/components/select-category";
8 | import { SelectCurrency } from "@/components/select-currency";
9 | import { zodResolver } from "@hookform/resolvers/zod";
10 | import { uniqueCurrencies } from "@midday/location/currencies";
11 | import {
12 |   Accordion,
13 |   AccordionContent,
14 |   AccordionItem,
15 |   AccordionTrigger,
16 | } from "@midday/ui/accordion";
17 | import { Button } from "@midday/ui/button";
18 | import { Calendar } from "@midday/ui/calendar";
19 | import { CurrencyInput } from "@midday/ui/currency-input";
20 | import {
21 |   Form,
22 |   FormControl,
23 |   FormField,
24 |   FormItem,
25 |   FormLabel,
26 |   FormMessage,
27 | } from "@midday/ui/form";
28 | import { Input } from "@midday/ui/input";
29 | import { Popover, PopoverContent, PopoverTrigger } from "@midday/ui/popover";
30 | import { Select } from "@midday/ui/select";
31 | import { SubmitButton } from "@midday/ui/submit-button";
32 | import { Textarea } from "@midday/ui/textarea";
33 | import { useToast } from "@midday/ui/use-toast";
34 | import { readStreamableValue } from "ai/rsc";
35 | import { format } from "date-fns";
36 | import { useAction } from "next-safe-action/hooks";
37 | import { useLayoutEffect, useState } from "react";
38 | import { useForm } from "react-hook-form";
39 | import type { z } from "zod";
40 |
41 | export function CreateTransactionForm({
42 |   categories,
43 |   userId,
44 |   accountId,
45 |   currency,
46 |   onCreate,
47 | }: {
48 |   currency: string;
49 |   categories: any;
50 |   userId: string;
51 |   accountId: string;
52 |   onCreate: () => void;
53 | }) {
54 |   const { toast } = useToast();
55 |   const [isOpen, setIsOpen] = useState(false);
56 |
57 |   const createTransaction = useAction(createTransactionAction, {
58 |     onSuccess: () => {
59 |       onCreate();
60 |
61 |       toast({
62 |         title: "Transaction created",
63 |         description: "Transaction created successfully",
64 |         variant: "success",
65 |       });
66 |     },
67 |   });
68 |
69 |   const form = useForm<z.infer<typeof createTransactionSchema>>({
70 |     resolver: zodResolver(createTransactionSchema),
71 |     defaultValues: {
72 |       name: undefined,
73 |       category_slug: undefined,
74 |       date: new Date().toISOString(),
75 |       bank_account_id: accountId,
76 |       assigned_id: userId,
77 |       note: undefined,
78 |       currency,
79 |       attachments: undefined,
80 |     },
81 |   });
82 |
83 |   const category = form.watch("category_slug");
84 |   const attachments = form.watch("attachments");
85 |
86 |   const handleOnBlur = async (e: React.FocusEvent<HTMLInputElement>) => {
87 |     const prompt = e.target.value;
88 |
89 |     if (!category && prompt.length > 5) {
90 |       const { object } = await findMatchingCategory(
91 |         prompt,
92 |         categories?.map((category) => category.name),
93 |       );
94 |
95 |       let finalObject = {};
96 |
97 |       for await (const partialObject of readStreamableValue(object)) {
98 |         if (partialObject) {
99 |           finalObject = {
100 |             category: categories?.find(
101 |               (category) => category.name === partialObject?.category,
102 |             ),
103 |           };
104 |         }
105 |       }
106 |
107 |       if (finalObject?.category?.slug) {
108 |         form.setValue("category_slug", finalObject.category.slug, {
109 |           shouldValidate: true,
110 |         });
111 |       }
112 |     }
113 |   };
114 |
115 |   useLayoutEffect(() => {
116 |     // This is a workaround to ensure that the form is rendered before we try to set the focus
117 |     setTimeout(() => {
118 |       form.setFocus("name");
119 |     }, 10);
120 |   }, [form.setFocus]);
121 |
122 |   return (
123 |     <Form {...form}>
124 |       <form
125 |         onSubmit={form.handleSubmit(createTransaction.execute)}
126 |         className="space-y-8"
127 |       >
128 |         <FormField
129 |           control={form.control}
130 |           name="name"
131 |           render={({ field }) => (
132 |             <FormItem>
133 |               <FormLabel>Description</FormLabel>
134 |               <FormControl>
135 |                 <Input
136 |                   {...field}
137 |                   onBlur={handleOnBlur}
138 |                   autoComplete="off"
139 |                   autoCapitalize="none"
140 |                   autoCorrect="off"
141 |                   spellCheck="false"
142 |                 />
143 |               </FormControl>
144 |
145 |               <FormMessage />
146 |             </FormItem>
147 |           )}
148 |         />
149 |
150 |         <div className="flex space-x-4 mt-4">
151 |           <FormField
152 |             control={form.control}
153 |             name="amount"
154 |             render={({ field }) => (
155 |               <FormItem className="w-full">
156 |                 <FormLabel>Amount</FormLabel>
157 |                 <FormControl>
158 |                   <CurrencyInput
159 |                     value={field.value}
160 |                     onValueChange={(values) => {
161 |                       field.onChange(values.floatValue);
162 |
163 |                       if (values.floatValue && values.floatValue > 0) {
164 |                         form.setValue("category_slug", "income");
165 |                       }
166 |
167 |                       if (
168 |                         category === "income" &&
169 |                         values.floatValue !== undefined &&
170 |                         values.floatValue < 0
171 |                       ) {
172 |                         form.setValue("category_slug", undefined);
173 |                       }
[TRUNCATED]
```

apps/dashboard/src/components/forms/customer-form.tsx
```
1 | "use client";
2 |
3 | import { createCustomerAction } from "@/actions/create-customer-action";
4 | import { createCustomerTagAction } from "@/actions/customer/create-customer-tag-action";
5 | import { deleteCustomerTagAction } from "@/actions/customer/delete-customer-tag-action";
6 | import { useCustomerParams } from "@/hooks/use-customer-params";
7 | import { useInvoiceParams } from "@/hooks/use-invoice-params";
8 | import { zodResolver } from "@hookform/resolvers/zod";
9 | import {
10 |   Accordion,
11 |   AccordionContent,
12 |   AccordionItem,
13 |   AccordionTrigger,
14 | } from "@midday/ui/accordion";
15 | import { Button } from "@midday/ui/button";
16 | import {
17 |   Form,
18 |   FormControl,
19 |   FormDescription,
20 |   FormField,
21 |   FormItem,
22 |   FormLabel,
23 |   FormMessage,
24 | } from "@midday/ui/form";
25 | import { Input } from "@midday/ui/input";
26 | import { Label } from "@midday/ui/label";
27 | import { SubmitButton } from "@midday/ui/submit-button";
28 | import { Textarea } from "@midday/ui/textarea";
29 | import { useAction } from "next-safe-action/hooks";
30 | import { useEffect, useState } from "react";
31 | import { useForm } from "react-hook-form";
32 | import { z } from "zod";
33 | import { CountrySelector } from "../country-selector";
34 | import type { Customer } from "../invoice/customer-details";
35 | import {
36 |   type AddressDetails,
37 |   SearchAddressInput,
38 | } from "../search-address-input";
39 | import { SelectTags } from "../select-tags";
40 | import { VatNumberInput } from "../vat-number-input";
41 |
42 | const formSchema = z.object({
43 |   id: z.string().uuid().optional(),
44 |   name: z.string().min(1, {
45 |     message: "Name must be at least 1 characters.",
46 |   }),
47 |   email: z.string().email({
48 |     message: "Email is not valid.",
49 |   }),
50 |   phone: z.string().nullable().optional(),
51 |   website: z
52 |     .string()
53 |     .nullable()
54 |     .optional()
55 |     .transform((url) => url?.replace(/^https?:\/\//, "")),
56 |   contact: z.string().nullable().optional(),
57 |   address_line_1: z.string().nullable().optional(),
58 |   address_line_2: z.string().nullable().optional(),
59 |   city: z.string().nullable().optional(),
60 |   state: z.string().nullable().optional(),
61 |   country: z.string().nullable().optional(),
62 |   country_code: z.string().nullable().optional(),
63 |   zip: z.string().nullable().optional(),
64 |   vat_number: z.string().nullable().optional(),
65 |   note: z.string().nullable().optional(),
66 |   tags: z
67 |     .array(
68 |       z.object({
69 |         id: z.string().uuid(),
70 |         value: z.string(),
71 |       }),
72 |     )
73 |     .optional()
74 |     .nullable(),
75 | });
76 |
77 | const excludedDomains = [
78 |   "gmail.com",
79 |   "yahoo.com",
80 |   "hotmail.com",
81 |   "outlook.com",
82 |   "google.com",
83 |   "aol.com",
84 |   "msn.com",
85 |   "icloud.com",
86 |   "me.com",
87 |   "mac.com",
88 |   "live.com",
89 |   "hotmail.co.uk",
90 |   "hotmail.com.au",
91 |   "hotmail.com.br",
92 | ];
93 |
94 | type Props = {
95 |   data?: Customer;
96 | };
97 |
98 | export function CustomerForm({ data }: Props) {
99 |   const [sections, setSections] = useState<string[]>(["general"]);
100 |   const { setParams: setCustomerParams, name } = useCustomerParams();
101 |   const { setParams: setInvoiceParams } = useInvoiceParams();
102 |
103 |   const deleteCustomerTag = useAction(deleteCustomerTagAction);
104 |   const createCustomerTag = useAction(createCustomerTagAction);
105 |
106 |   const isEdit = !!data;
107 |
108 |   const createCustomer = useAction(createCustomerAction, {
109 |     onSuccess: ({ data }) => {
110 |       if (data) {
111 |         setInvoiceParams({ selectedCustomerId: data.id });
112 |         setCustomerParams(null);
113 |       }
114 |     },
115 |   });
116 |
117 |   const form = useForm<z.infer<typeof formSchema>>({
118 |     resolver: zodResolver(formSchema),
119 |     defaultValues: {
120 |       id: undefined,
121 |       name: name ?? undefined,
122 |       email: undefined,
123 |       website: undefined,
124 |       address_line_1: undefined,
125 |       address_line_2: undefined,
126 |       city: undefined,
127 |       state: undefined,
128 |       country: undefined,
129 |       zip: undefined,
130 |       vat_number: undefined,
131 |       note: undefined,
132 |       phone: undefined,
133 |       contact: undefined,
134 |       tags: undefined,
135 |     },
136 |   });
137 |
138 |   useEffect(() => {
139 |     if (data) {
140 |       setSections(["general", "details"]);
141 |       form.reset({
142 |         ...data,
143 |         tags:
144 |           data.tags?.map((tag) => ({
145 |             id: tag.tag?.id ?? "",
146 |             value: tag.tag?.name ?? "",
147 |             label: tag.tag?.name ?? "",
148 |           })) ?? undefined,
149 |       });
150 |     }
151 |   }, [data]);
152 |
153 |   const onSelectAddress = (address: AddressDetails) => {
154 |     form.setValue("address_line_1", address.address_line_1);
155 |     form.setValue("city", address.city);
156 |     form.setValue("state", address.state);
157 |     form.setValue("country", address.country);
158 |     form.setValue("country_code", address.country_code);
159 |     form.setValue("zip", address.zip);
160 |   };
161 |
162 |   const handleEmailBlur = (e: React.FocusEvent<HTMLInputElement>) => {
163 |     const email = e.target.value.trim();
[TRUNCATED]
```

apps/dashboard/src/components/forms/invite-form.tsx
```
1 | "use client";
2 |
3 | import { inviteTeamMembersAction } from "@/actions/invite-team-members-action";
4 | import {
5 |   type InviteTeamMembersFormValues,
6 |   inviteTeamMembersSchema,
7 | } from "@/actions/schema";
8 | import { zodResolver } from "@hookform/resolvers/zod";
9 | import { Button } from "@midday/ui/button";
10 | import { Form, FormControl, FormField, FormItem } from "@midday/ui/form";
11 | import { Input } from "@midday/ui/input";
12 | import {
13 |   Select,
14 |   SelectContent,
15 |   SelectItem,
16 |   SelectTrigger,
17 |   SelectValue,
18 | } from "@midday/ui/select";
19 | import { useToast } from "@midday/ui/use-toast";
20 | import { Loader2 } from "lucide-react";
21 | import { useAction } from "next-safe-action/hooks";
22 | import Link from "next/link";
23 | import { useFieldArray, useForm } from "react-hook-form";
24 |
25 | export function InviteForm() {
26 |   const { toast } = useToast();
27 |
28 |   const inviteMembers = useAction(inviteTeamMembersAction, {
29 |     onError: () => {
30 |       toast({
31 |         duration: 3500,
32 |         variant: "error",
33 |         title: "Something went wrong please try again.",
34 |       });
35 |     },
36 |   });
37 |
38 |   const form = useForm<InviteTeamMembersFormValues>({
39 |     resolver: zodResolver(inviteTeamMembersSchema),
40 |     defaultValues: {
41 |       invites: [
42 |         {
43 |           email: "",
44 |           role: "member",
45 |         },
46 |       ],
47 |     },
48 |   });
49 |
50 |   const onSubmit = form.handleSubmit((data) => {
51 |     inviteMembers.execute({
52 |       // Remove invites without email (last appended invite validation)
53 |       invites: data.invites.filter((invite) => invite.email !== undefined),
54 |       redirectTo: "/",
55 |     });
56 |   });
57 |
58 |   const { fields, append } = useFieldArray({
59 |     name: "invites",
60 |     control: form.control,
61 |   });
62 |
63 |   return (
64 |     <Form {...form}>
65 |       <form onSubmit={form.handleSubmit(onSubmit)}>
66 |         {fields.map((field, index) => (
67 |           <div
68 |             className="flex items-center justify-between mt-3 space-x-4"
69 |             key={index.toString()}
70 |           >
71 |             <FormField
72 |               control={form.control}
73 |               key={field.id}
74 |               name={`invites.${index}.email`}
75 |               render={({ field }) => (
76 |                 <FormItem className="flex-1">
77 |                   <FormControl>
78 |                     <Input
79 |                       placeholder="jane@example.com"
80 |                       type="email"
81 |                       autoComplete="off"
82 |                       autoCapitalize="none"
83 |                       autoCorrect="off"
84 |                       spellCheck="false"
85 |                       {...field}
86 |                     />
87 |                   </FormControl>
88 |                 </FormItem>
89 |               )}
90 |             />
91 |
92 |             <FormField
93 |               control={form.control}
94 |               name={`invites.${index}.role`}
95 |               render={({ field }) => (
96 |                 <FormItem>
97 |                   <Select
98 |                     onValueChange={field.onChange}
99 |                     defaultValue={field.value}
100 |                   >
101 |                     <FormControl>
102 |                       <SelectTrigger className="min-w-[120px]">
103 |                         <SelectValue placeholder="Select role" />
104 |                       </SelectTrigger>
105 |                     </FormControl>
106 |                     <SelectContent>
107 |                       <SelectItem value="owner">Owner</SelectItem>
108 |                       <SelectItem value="member">Member</SelectItem>
109 |                     </SelectContent>
110 |                   </Select>
111 |                 </FormItem>
112 |               )}
113 |             />
114 |           </div>
115 |         ))}
116 |
117 |         <Button
118 |           variant="outline"
119 |           type="button"
120 |           className="mt-4 border-none bg-[#F2F1EF] text-[11px] dark:bg-[#1D1D1D]"
121 |           onClick={() => append({ email: undefined, role: "member" })}
122 |         >
123 |           Add more
124 |         </Button>
125 |
126 |         <div className="border-t-[1px] pt-4 mt-8 items-center justify-between">
127 |           <div>
128 |             {Object.values(form.formState.errors).length > 0 && (
129 |               <span className="text-sm text-destructive">
130 |                 Please complete the fields above.
131 |               </span>
132 |             )}
133 |           </div>
134 |
135 |           <div className="flex items-center justify-between">
136 |             <Link href="/">
137 |               <Button
138 |                 variant="ghost"
139 |                 className="p-0 hover:bg-transparent font-normal"
140 |               >
141 |                 Skip this step
142 |               </Button>
143 |             </Link>
144 |
145 |             <Button
146 |               type="submit"
147 |               disabled={inviteMembers.status === "executing"}
148 |             >
149 |               {inviteMembers.status === "executing" ? (
150 |                 <Loader2 className="h-4 w-4 animate-spin" />
151 |               ) : (
152 |                 "Send invites"
153 |               )}
154 |             </Button>
155 |           </div>
156 |         </div>
157 |       </form>
158 |     </Form>
159 |   );
160 | }
```

apps/dashboard/src/components/forms/tracker-project-form.tsx
```
1 | "use client";
2 |
3 | import { createProjectTagAction } from "@/actions/project/create-project-tag-action";
4 | import { deleteProjectTagAction } from "@/actions/project/delete-project-tag-action";
5 | import type { Customer } from "@/components/invoice/customer-details";
6 | import { uniqueCurrencies } from "@midday/location/currencies";
7 | import { Button } from "@midday/ui/button";
8 | import { Collapsible, CollapsibleContent } from "@midday/ui/collapsible";
9 | import { CurrencyInput } from "@midday/ui/currency-input";
10 | import {
11 |   Form,
12 |   FormControl,
13 |   FormDescription,
14 |   FormField,
15 |   FormItem,
16 |   FormLabel,
17 |   FormMessage,
18 | } from "@midday/ui/form";
19 | import { Input } from "@midday/ui/input";
20 | import { Label } from "@midday/ui/label";
21 | import {
22 |   Select,
23 |   SelectContent,
24 |   SelectItem,
25 |   SelectTrigger,
26 |   SelectValue,
27 | } from "@midday/ui/select";
28 | import { Switch } from "@midday/ui/switch";
29 | import { Textarea } from "@midday/ui/textarea";
30 | import { Loader2 } from "lucide-react";
31 | import { useAction } from "next-safe-action/hooks";
32 | import { useEffect, useState } from "react";
33 | import { SearchCustomer } from "../search-customer";
34 | import { SelectTags } from "../select-tags";
35 |
36 | type Props = {
37 |   onSubmit: (data: any) => void;
38 |   isSaving: boolean;
39 |   form: any;
40 |   customers: Customer[];
41 | };
42 |
43 | export function TrackerProjectForm({
44 |   onSubmit,
45 |   isSaving,
46 |   form,
47 |   customers,
48 | }: Props) {
49 |   const [isOpen, setIsOpen] = useState(false);
50 |
51 |   const deleteProjectTag = useAction(deleteProjectTagAction);
52 |   const createProjectTag = useAction(createProjectTagAction);
53 |
54 |   const isEdit = form.getValues("id") !== undefined;
55 |
56 |   useEffect(() => {
57 |     setIsOpen(Boolean(form.getValues("billable")));
58 |   }, [form.getValues()]);
59 |
60 |   return (
61 |     <Form {...form}>
62 |       <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
63 |         <FormField
64 |           control={form.control}
65 |           name="name"
66 |           render={({ field }) => (
67 |             <FormItem>
68 |               <FormLabel>Name</FormLabel>
69 |               <FormControl>
70 |                 <Input
71 |                   {...field}
72 |                   autoComplete="off"
73 |                   autoCapitalize="none"
74 |                   autoCorrect="off"
75 |                   spellCheck="false"
76 |                 />
77 |               </FormControl>
78 |               <FormDescription>
79 |                 This is the project display name.
80 |               </FormDescription>
81 |               <FormMessage />
82 |             </FormItem>
83 |           )}
84 |         />
85 |
86 |         <FormField
87 |           control={form.control}
88 |           name="customer_id"
89 |           render={({ field }) => (
90 |             <FormItem>
91 |               <FormLabel>Customer</FormLabel>
92 |               <FormControl>
93 |                 <SearchCustomer
94 |                   data={customers}
95 |                   onSelect={(id) => field.onChange(id)}
96 |                   selectedId={field.value}
97 |                 />
98 |               </FormControl>
99 |               <FormDescription>
100 |                 Link a customer to enable direct invoicing.
101 |               </FormDescription>
102 |               <FormMessage />
103 |             </FormItem>
104 |           )}
105 |         />
106 |
107 |         <div className="mt-6">
108 |           <Label htmlFor="tags" className="mb-2 block">
109 |             Expense Tags
110 |           </Label>
111 |
112 |           <SelectTags
113 |             tags={form.getValues("tags")}
114 |             onRemove={(tag) => {
115 |               deleteProjectTag.execute({
116 |                 tagId: tag.id,
117 |                 projectId: form.getValues("id"),
118 |               });
119 |             }}
120 |             // Only for create projects
121 |             onCreate={(tag) => {
122 |               if (!isEdit) {
123 |                 form.setValue(
124 |                   "tags",
125 |                   [
126 |                     ...(form.getValues("tags") ?? []),
127 |                     { id: tag.id, value: tag.name },
128 |                   ],
129 |                   {
130 |                     shouldDirty: true,
131 |                     shouldValidate: true,
132 |                   },
133 |                 );
134 |               }
135 |             }}
136 |             // Only for edit projects
137 |             onSelect={(tag) => {
138 |               if (isEdit) {
139 |                 createProjectTag.execute({
140 |                   tagId: tag.id,
141 |                   projectId: form.getValues("id"),
142 |                 });
143 |               }
144 |             }}
145 |           />
146 |
147 |           <FormDescription className="mt-2">
148 |             Tags help categorize and track project expenses.
149 |           </FormDescription>
150 |         </div>
151 |
152 |         <FormField
153 |           control={form.control}
154 |           name="description"
155 |           render={({ field }) => (
156 |             <FormItem>
157 |               <FormLabel>Description</FormLabel>
158 |               <FormControl>
159 |                 <Textarea className="resize-none" {...field} />
160 |               </FormControl>
161 |               <FormDescription>
162 |                 Add a short description about the project.
163 |               </FormDescription>
164 |               <FormMessage />
165 |             </FormItem>
166 |           )}
167 |         />
168 |
169 |         <div className="flex space-x-4 mt-4">
170 |           <FormField
171 |             control={form.control}
172 |             name="estimate"
173 |             render={({ field }) => (
174 |               <FormItem>
175 |                 <FormLabel>Time Estimate</FormLabel>
176 |                 <FormControl>
177 |                   <Input
178 |                     placeholder="0"
179 |                     {...field}
180 |                     type="number"
181 |                     min={0}
182 |                     onChange={(evt) => field.onChange(+evt.target.value)}
183 |                     autoComplete="off"
184 |                     autoCapitalize="none"
[TRUNCATED]
```

apps/dashboard/src/components/forms/tracker-record-form.tsx
```
1 | import { useTrackerParams } from "@/hooks/use-tracker-params";
2 | import { NEW_EVENT_ID } from "@/utils/tracker";
3 | import { zodResolver } from "@hookform/resolvers/zod";
4 | import { Form, FormControl, FormField, FormItem } from "@midday/ui/form";
5 | import { Input } from "@midday/ui/input";
6 | import { SubmitButton } from "@midday/ui/submit-button";
7 | import { TimeRangeInput } from "@midday/ui/time-range-input";
8 | import { differenceInSeconds, parse } from "date-fns";
9 | import { useEffect } from "react";
10 | import { useForm } from "react-hook-form";
11 | import { z } from "zod";
12 | import { AssignUser } from "../assign-user";
13 | import { TrackerSelectProject } from "../tracker-select-project";
14 |
15 | const formSchema = z.object({
16 |   id: z.string().optional(),
17 |   duration: z.number().min(1),
18 |   project_id: z.string(),
19 |   assigned_id: z.string().optional(),
20 |   description: z.string().optional(),
21 |   start: z.string(),
22 |   end: z.string(),
23 | });
24 |
25 | type Props = {
26 |   eventId?: string;
27 |   userId: string;
28 |   teamId: string;
29 |   onCreate: (values: z.infer<typeof formSchema>) => void;
30 |   projectId?: string | null;
31 |   start?: string;
32 |   end?: string;
33 |   onSelectProject: (selected: { id: string; name: string }) => void;
34 |   description?: string;
35 |   isSaving: boolean;
36 | };
37 |
38 | export function TrackerRecordForm({
39 |   eventId,
40 |   userId,
41 |   teamId,
42 |   onCreate,
43 |   projectId,
44 |   start,
45 |   end,
46 |   onSelectProject,
47 |   description,
48 |   isSaving,
49 | }: Props) {
50 |   const { projectId: selectedProjectId } = useTrackerParams();
51 |
52 |   const isUpdate = eventId && eventId !== NEW_EVENT_ID;
53 |
54 |   const form = useForm<z.infer<typeof formSchema>>({
55 |     resolver: zodResolver(formSchema),
56 |     defaultValues: {
57 |       id: eventId,
58 |       assigned_id: userId,
59 |       project_id: selectedProjectId ?? undefined,
60 |       start,
61 |       end,
62 |       description: description ?? undefined,
63 |     },
64 |   });
65 |
66 |   useEffect(() => {
67 |     if (eventId && eventId !== NEW_EVENT_ID) {
68 |       form.setValue("id", eventId, { shouldValidate: true });
69 |     }
70 |
71 |     if (eventId === NEW_EVENT_ID) {
72 |       form.setValue("id", undefined);
73 |     }
74 |
75 |     if (start) {
76 |       form.setValue("start", start);
77 |     }
78 |     if (end) {
79 |       form.setValue("end", end);
80 |     }
81 |
82 |     if (projectId) {
83 |       form.setValue("project_id", projectId, { shouldValidate: true });
84 |     }
85 |
86 |     if (description) {
87 |       form.setValue("description", description);
88 |     }
89 |
90 |     if (start && end) {
91 |       const startDate = parse(start, "HH:mm", new Date());
92 |       const endDate = parse(end, "HH:mm", new Date());
93 |
94 |       const durationInSeconds = differenceInSeconds(endDate, startDate);
95 |
96 |       if (durationInSeconds) {
97 |         form.setValue("duration", durationInSeconds, { shouldValidate: true });
98 |       }
99 |     }
100 |   }, [start, end, projectId, description, eventId]);
101 |
102 |   return (
103 |     <Form {...form}>
104 |       <form
105 |         onSubmit={form.handleSubmit(onCreate)}
106 |         className="mb-12 mt-6 space-y-4"
107 |       >
108 |         <TimeRangeInput
109 |           value={{ start: form.watch("start"), end: form.watch("end") }}
110 |           onChange={(value) => {
111 |             form.setValue("start", value.start);
112 |             form.setValue("end", value.end);
113 |           }}
114 |         />
115 |
116 |         <FormField
117 |           control={form.control}
118 |           name="project_id"
119 |           render={({ field }) => (
120 |             <FormItem className="w-full">
121 |               <FormControl>
122 |                 <TrackerSelectProject
123 |                   onCreate={(project) => {
124 |                     if (project) {
125 |                       field.onChange(project.id);
126 |                       onSelectProject(project);
127 |                     }
128 |                   }}
129 |                   teamId={teamId}
130 |                   selectedId={field.value}
131 |                   onSelect={(selected) => {
132 |                     if (selected) {
133 |                       field.onChange(selected.id);
134 |                       onSelectProject(selected);
135 |                     }
136 |                   }}
137 |                 />
138 |               </FormControl>
139 |             </FormItem>
140 |           )}
141 |         />
142 |
143 |         <FormField
144 |           control={form.control}
145 |           name="assigned_id"
146 |           render={({ field }) => (
147 |             <FormItem className="w-full">
148 |               <FormControl>
149 |                 <AssignUser
150 |                   selectedId={form.watch("assigned_id")}
151 |                   onSelect={(assignedId: string) => {
152 |                     if (assignedId) {
153 |                       field.onChange(assignedId);
154 |                     }
155 |                   }}
156 |                 />
157 |               </FormControl>
158 |             </FormItem>
159 |           )}
160 |         />
161 |
162 |         <FormField
163 |           control={form.control}
164 |           name="description"
165 |           render={({ field }) => (
166 |             <FormItem>
167 |               <FormControl>
168 |                 <Input placeholder="Description" {...field} />
169 |               </FormControl>
170 |             </FormItem>
171 |           )}
172 |         />
173 |
174 |         <div className="flex mt-6 justify-between">
175 |           <SubmitButton
176 |             className="w-full"
177 |             disabled={isSaving || !form.formState.isValid}
178 |             isSubmitting={isSaving}
[TRUNCATED]
```

apps/dashboard/src/components/forms/update-record-form.tsx
```
1 | import { secondsToHoursAndMinutes } from "@/utils/format";
2 | import { Avatar, AvatarFallback, AvatarImageNext } from "@midday/ui/avatar";
3 | import { Button } from "@midday/ui/button";
4 | import { Skeleton } from "@midday/ui/skeleton";
5 |
6 | export function RecordSkeleton() {
7 |   return (
8 |     <div className="mb-4">
9 |       <div className="flex items-center">
10 |         <div className="flex space-x-2 items-center">
11 |           <Skeleton className="h-8 w-8 rounded-full" />
12 |           <div className="text-sm flex flex-col space-y-1">
13 |             <Skeleton className="h-3 w-[160px]" />
14 |             <Skeleton className="h-3 w-8" />
15 |           </div>
16 |         </div>
17 |         <span className="ml-auto">
18 |           <Skeleton className="h-3 w-8" />
19 |         </span>
20 |       </div>
21 |     </div>
22 |   );
23 | }
24 |
25 | export function UpdateRecordForm({
26 |   id,
27 |   assigned,
28 |   duration,
29 |   onDelete,
30 |   description,
31 | }) {
32 |   return (
33 |     <div className="mb-4 group">
34 |       <div className="flex items-center">
35 |         <div className="flex space-x-2 items-center">
36 |           <Avatar className="h-8 w-8">
37 |             <AvatarImageNext
38 |               src={assigned.avatar_url}
39 |               alt={assigned?.full_name ?? ""}
40 |               width={32}
41 |               height={32}
42 |             />
43 |             <AvatarFallback>
44 |               <span className="text-xs">
45 |                 {assigned?.full_name?.charAt(0)?.toUpperCase()}
46 |               </span>
47 |             </AvatarFallback>
48 |           </Avatar>
49 |           <div className="text-sm flex flex-col">
50 |             <span>{assigned.full_name}</span>
51 |             <span className="text-muted-foreground">{description}</span>
52 |           </div>
53 |         </div>
54 |         <span className="ml-auto group-hover:hidden">
55 |           {secondsToHoursAndMinutes(duration)}
56 |         </span>
57 |         <Button
58 |           variant="outline"
59 |           className="ml-auto hidden group-hover:block text-xs h-7 p-0 px-2"
60 |           onClick={() => onDelete(id)}
61 |         >
62 |           Remove
63 |         </Button>
64 |       </div>
65 |     </div>
66 |   );
67 | }
```

apps/dashboard/src/components/invoice/amount-input.tsx
```
1 | import { cn } from "@midday/ui/cn";
2 | import { CurrencyInput } from "@midday/ui/currency-input";
3 | import { useState } from "react";
4 | import { useController, useFormContext } from "react-hook-form";
5 | import type { NumericFormatProps } from "react-number-format";
6 |
7 | export function AmountInput({
8 |   className,
9 |   name,
10 |   ...props
11 | }: Omit<NumericFormatProps, "value" | "onChange"> & {
12 |   name: string;
13 | }) {
14 |   const [isFocused, setIsFocused] = useState(false);
15 |   const { control } = useFormContext();
16 |   const {
17 |     field: { value, onChange, onBlur },
18 |   } = useController({
19 |     name,
20 |     control,
21 |   });
22 |
23 |   const isPlaceholder = !value && !isFocused;
24 |
25 |   return (
26 |     <div className="relative font-mono">
27 |       <CurrencyInput
28 |         autoComplete="off"
29 |         value={value}
30 |         onValueChange={(values) => {
31 |           onChange(values.floatValue, { shouldValidate: true });
32 |         }}
33 |         onFocus={() => setIsFocused(true)}
34 |         onBlur={() => {
35 |           setIsFocused(false);
36 |           onBlur();
37 |         }}
38 |         {...props}
39 |         className={cn(
40 |           className,
41 |           isPlaceholder && "opacity-0",
42 |           "p-0 border-0 h-6 text-xs !bg-transparent border-b border-transparent focus:border-border",
43 |         )}
44 |         thousandSeparator={true}
45 |       />
46 |
47 |       {isPlaceholder && (
48 |         <div className="absolute inset-0 pointer-events-none">
49 |           <div className="h-full w-full bg-[repeating-linear-gradient(-60deg,#DBDBDB,#DBDBDB_1px,transparent_1px,transparent_5px)] dark:bg-[repeating-linear-gradient(-60deg,#2C2C2C,#2C2C2C_1px,transparent_1px,transparent_5px)]" />
50 |         </div>
51 |       )}
52 |     </div>
53 |   );
54 | }
```

apps/dashboard/src/components/invoice/customer-details.tsx
```
1 | "use client";
2 |
3 | import { updateInvoiceTemplateAction } from "@/actions/invoice/update-invoice-template-action";
4 | import { Editor } from "@/components/invoice/editor";
5 | import { useInvoiceParams } from "@/hooks/use-invoice-params";
6 | import type { JSONContent } from "@tiptap/react";
7 | import { useAction } from "next-safe-action/hooks";
8 | import { useEffect } from "react";
9 | import { Controller, useFormContext } from "react-hook-form";
10 | import { SelectCustomer } from "../select-customer";
11 | import { LabelInput } from "./label-input";
12 | import { transformCustomerToContent } from "./utils";
13 |
14 | export interface Customer {
15 |   id: string;
16 |   name: string;
17 |   email: string;
18 |   phone?: string;
19 |   address_line_1?: string;
20 |   address_line_2?: string;
21 |   token: string;
22 |   city?: string;
23 |   state?: string;
24 |   zip?: string;
25 |   country?: string;
26 |   vat?: string;
27 |   contact?: string;
28 |   website?: string;
29 |   tags?: { tag: { id: string; name: string } }[];
30 | }
31 |
32 | interface CustomerDetailsProps {
33 |   customers: Customer[];
34 | }
35 |
36 | export function CustomerDetails({ customers }: CustomerDetailsProps) {
37 |   const { control, setValue, watch } = useFormContext();
38 |   const { setParams, selectedCustomerId } = useInvoiceParams();
39 |   const updateInvoiceTemplate = useAction(updateInvoiceTemplateAction);
40 |
41 |   const content = watch("customer_details");
42 |   const id = watch("id");
43 |
44 |   const handleLabelSave = (value: string) => {
45 |     updateInvoiceTemplate.execute({ customer_label: value });
46 |   };
47 |
48 |   const handleOnChange = (content?: JSONContent | null) => {
49 |     // Reset the selected customer id when the content is changed
50 |     setParams({ selectedCustomerId: null });
51 |
52 |     setValue("customer_details", content, {
53 |       shouldValidate: true,
54 |       shouldDirty: true,
55 |     });
56 |
57 |     if (!content) {
58 |       setValue("customer_name", null, { shouldValidate: true });
59 |       setValue("customer_id", null, { shouldValidate: true });
60 |     }
61 |   };
62 |
63 |   useEffect(() => {
64 |     const customer = customers.find((c) => c.id === selectedCustomerId);
65 |
66 |     if (customer) {
67 |       const customerContent = transformCustomerToContent(customer);
68 |
69 |       // Remove the selected customer id from the url so we don't introduce a race condition
70 |       setParams({ selectedCustomerId: null });
71 |
72 |       setValue("customer_name", customer.name, { shouldValidate: true });
73 |       setValue("customer_id", customer.id, { shouldValidate: true });
74 |       setValue("customer_details", customerContent, {
75 |         shouldValidate: true,
76 |         shouldDirty: true,
77 |       });
78 |     }
79 |   }, [selectedCustomerId, customers]);
80 |
81 |   return (
82 |     <div>
83 |       <LabelInput
84 |         name="template.customer_label"
85 |         className="mb-2 block"
86 |         onSave={handleLabelSave}
87 |       />
88 |       {content ? (
89 |         <Controller
90 |           name="customer_details"
91 |           control={control}
92 |           render={({ field }) => (
93 |             <Editor
94 |               // NOTE: This is a workaround to get the new content to render
95 |               key={id}
96 |               initialContent={field.value}
97 |               onChange={handleOnChange}
98 |               className="min-h-[90px]"
99 |             />
100 |           )}
101 |         />
102 |       ) : (
103 |         <SelectCustomer data={customers} />
104 |       )}
105 |     </div>
106 |   );
107 | }
```

apps/dashboard/src/components/invoice/description.tsx
```
1 | "use client";
2 |
3 | import { isValidJSON } from "@midday/invoice/content";
4 | import { cn } from "@midday/ui/cn";
5 | import type { JSONContent } from "@tiptap/react";
6 | import { useFormContext } from "react-hook-form";
7 | import { Editor } from "./editor";
8 |
9 | export function Description({
10 |   className,
11 |   name,
12 |   ...props
13 | }: React.ComponentProps<typeof Editor> & { name: string }) {
14 |   const { watch, setValue } = useFormContext();
15 |   const fieldValue = watch(name);
16 |
17 |   const handleOnChange = (content?: JSONContent | null) => {
18 |     const value = content ? JSON.stringify(content) : null;
19 |
20 |     setValue(name, value, {
21 |       shouldValidate: true,
22 |       shouldDirty: true,
23 |     });
24 |   };
25 |
26 |   return (
27 |     <div className="relative">
28 |       <Editor
29 |         key={name}
30 |         initialContent={
31 |           isValidJSON(fieldValue) ? JSON.parse(fieldValue) : fieldValue
32 |         }
33 |         onChange={handleOnChange}
34 |         className={cn(
35 |           "border-0 p-0 min-h-6 border-b border-transparent focus:border-border font-mono text-xs pt-1",
36 |           "transition-colors duration-200",
37 |           className,
38 |         )}
39 |         {...props}
40 |       />
41 |     </div>
42 |   );
43 | }
```

apps/dashboard/src/components/invoice/due-date.tsx
```
1 | import type { InvoiceFormValues } from "@/actions/invoice/schema";
2 | import { updateInvoiceTemplateAction } from "@/actions/invoice/update-invoice-template-action";
3 | import { TZDate } from "@date-fns/tz";
4 | import { Calendar } from "@midday/ui/calendar";
5 | import { Popover, PopoverContent, PopoverTrigger } from "@midday/ui/popover";
6 | import { format } from "date-fns";
7 | import { useAction } from "next-safe-action/hooks";
8 | import { useState } from "react";
9 | import { useFormContext } from "react-hook-form";
10 | import { LabelInput } from "./label-input";
11 |
12 | export function DueDate() {
13 |   const { setValue, watch } = useFormContext<InvoiceFormValues>();
14 |   const dueDate = watch("due_date");
15 |   const dateFormat = watch("template.date_format");
16 |
17 |   const [isOpen, setIsOpen] = useState(false);
18 |
19 |   const updateInvoiceTemplate = useAction(updateInvoiceTemplateAction);
20 |
21 |   const handleSelect = (date: Date | undefined) => {
22 |     if (date) {
23 |       setValue("due_date", date, { shouldValidate: true, shouldDirty: true });
24 |       setIsOpen(false);
25 |     }
26 |   };
27 |
28 |   return (
29 |     <div className="flex space-x-1 items-center">
30 |       <div className="flex items-center">
31 |         <LabelInput
32 |           name="template.due_date_label"
33 |           onSave={(value) => {
34 |             updateInvoiceTemplate.execute({
35 |               due_date_label: value,
36 |             });
37 |           }}
38 |         />
39 |         <span className="text-[11px] text-[#878787] font-mono">:</span>
40 |       </div>
41 |       <Popover open={isOpen} onOpenChange={setIsOpen} modal>
42 |         <PopoverTrigger className="text-primary text-[11px] font-mono whitespace-nowrap flex">
43 |           {dueDate && format(dueDate, dateFormat)}
44 |         </PopoverTrigger>
45 |         <PopoverContent className="w-auto p-0">
46 |           <Calendar
47 |             mode="single"
48 |             selected={dueDate ? new TZDate(dueDate, "UTC") : undefined}
49 |             onSelect={handleSelect}
50 |             initialFocus
51 |           />
52 |         </PopoverContent>
53 |       </P