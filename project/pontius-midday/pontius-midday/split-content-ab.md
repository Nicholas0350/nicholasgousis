|             </div>
39 |           </div>
40 |         </div>
41 |       ))}
42 |     </div>
43 |   );
44 | }
```

apps/dashboard/src/components/inbox-list.tsx
```
1 | import { Button } from "@midday/ui/button";
2 | import { Icons } from "@midday/ui/icons";
3 | import { ScrollArea } from "@midday/ui/scroll-area";
4 | import { AnimatePresence, motion } from "framer-motion";
5 | import { InboxItem } from "./inbox-item";
6 |
7 | type InboxListProps = {
8 |   items: {
9 |     id: string;
10 |     status: "done" | "processing" | "new";
11 |     display_name: string;
12 |     created_at: string;
13 |     file_name?: string;
14 |     date?: string;
15 |     currency?: string;
16 |     amount?: number;
17 |   }[];
18 |   hasQuery?: boolean;
19 |   onClear?: () => void;
20 | };
21 |
22 | export function InboxList({ items, hasQuery, onClear }: InboxListProps) {
23 |   if (hasQuery && !items?.length) {
24 |     return (
25 |       <div className="h-screen -mt-[140px] w-full flex items-center justify-center flex-col">
26 |         <div className="flex flex-col items-center">
27 |           <Icons.Transactions2 className="mb-4" />
28 |           <div className="text-center mb-6 space-y-2">
29 |             <h2 className="font-medium text-lg">No results</h2>
30 |             <p className="text-[#606060] text-sm">Try another search term</p>
31 |           </div>
32 |
33 |           <Button variant="outline" onClick={onClear}>
34 |             Clear search
35 |           </Button>
36 |         </div>
37 |       </div>
38 |     );
39 |   }
40 |
41 |   if (!items?.length) {
42 |     return (
43 |       <div className="h-screen -mt-[140px] w-full flex items-center justify-center flex-col">
44 |         <Icons.InboxEmpty size={32} />
45 |         <span className="font-medium mb-2 mt-4">Inbox empty</span>
46 |         <span className="text-sm text-[#878787]">
47 |           You can relax, nothing in here.
48 |         </span>
49 |       </div>
50 |     );
51 |   }
52 |
53 |   // Only run when first item has status=new or deleted
54 |   const initialAnimation = items?.at(0)?.status === "new" && {
55 |     opacity: 0,
56 |     height: 0,
57 |   };
58 |
59 |   const exitAnimation = !hasQuery && {
60 |     opacity: 0,
61 |     height: 0,
62 |   };
63 |
64 |   return (
65 |     <ScrollArea className="h-screen" hideScrollbar>
66 |       <div className="flex flex-col gap-4 pb-[250px]">
67 |         <AnimatePresence initial={false}>
68 |           {items?.map((item) => {
69 |             return (
70 |               <motion.div
71 |                 key={item.id}
72 |                 initial={initialAnimation}
73 |                 animate={{ opacity: 1, height: "auto" }}
74 |                 exit={exitAnimation}
75 |                 transition={{
76 |                   opacity: { duration: 0.2 },
77 |                   height: { type: "spring", bounce: 0.3, duration: 0.5 },
78 |                 }}
79 |                 className="w-full"
80 |               >
81 |                 <InboxItem key={item.id} item={item} />
82 |               </motion.div>
83 |             );
84 |           })}
85 |         </AnimatePresence>
86 |       </div>
87 |     </ScrollArea>
88 |   );
89 | }
```

apps/dashboard/src/components/inbox-ordering.tsx
```
1 | "use client";
2 |
3 | import { inboxOrderAction } from "@/actions/inbox/order";
4 | import { Button } from "@midday/ui/button";
5 | import {
6 |   DropdownMenu,
7 |   DropdownMenuCheckboxItem,
8 |   DropdownMenuContent,
9 |   DropdownMenuTrigger,
10 | } from "@midday/ui/dropdown-menu";
11 | import { Icons } from "@midday/ui/icons";
12 | import { useOptimisticAction } from "next-safe-action/hooks";
13 |
14 | type Props = {
15 |   ascending: boolean;
16 | };
17 |
18 | export function InboxOrdering({ ascending }: Props) {
19 |   const { execute: inboxOrder, optimisticState } = useOptimisticAction(
20 |     inboxOrderAction,
21 |     {
22 |       currentState: ascending,
23 |       updateFn: (_, state) => !state,
24 |     },
25 |   );
26 |
27 |   return (
28 |     <DropdownMenu>
29 |       <DropdownMenuTrigger asChild>
30 |         <Button variant="outline" size="icon">
31 |           <Icons.Sort size={16} />
32 |         </Button>
33 |       </DropdownMenuTrigger>
34 |       <DropdownMenuContent>
35 |         <DropdownMenuCheckboxItem
36 |           checked={!optimisticState}
37 |           onCheckedChange={() => inboxOrder(false)}
38 |         >
39 |           Most recent
40 |         </DropdownMenuCheckboxItem>
41 |
42 |         <DropdownMenuCheckboxItem
43 |           checked={optimisticState}
44 |           onCheckedChange={() => inboxOrder(true)}
45 |         >
46 |           Oldest first
47 |         </DropdownMenuCheckboxItem>
48 |       </DropdownMenuContent>
49 |     </DropdownMenu>
50 |   );
51 | }
```

apps/dashboard/src/components/inbox-search.tsx
```
1 | import { Icons } from "@midday/ui/icons";
2 | import { Input } from "@midday/ui/input";
3 | import { useHotkeys } from "react-hotkeys-hook";
4 |
5 | type Props = {
6 |   value: string;
7 |   onChange: (value: string | null) => void;
8 |   onClear?: () => void;
9 |   onArrowDown?: () => void;
10 | };
11 |
12 | export function InboxSearch({ value, onChange, onClear, onArrowDown }: Props) {
13 |   useHotkeys("esc", () => onClear?.(), {
14 |     enableOnFormTags: true,
15 |     enabled: Boolean(value),
16 |   });
17 |
18 |   return (
19 |     <div className="relative w-full">
20 |       <Icons.Search className="w-[18px] h-[18px] absolute left-2 top-[10px] pointer-events-none" />
21 |       <Input
22 |         placeholder="Search inbox"
23 |         onKeyDown={(evt) => {
24 |           if (evt.key === "ArrowDown") {
25 |             // @ts-ignore
26 |             evt.target?.blur();
27 |             evt.preventDefault();
28 |             onArrowDown?.();
29 |           }
30 |         }}
31 |         className="pl-8"
32 |         value={value}
33 |         onChange={(evt) => {
34 |           const value = evt.target.value;
35 |           onChange(value.length ? value : null);
36 |         }}
37 |       />
38 |
39 |       {value && (
40 |         <Icons.Close
41 |           className="w-[18px] h-[18px] top-[9px] absolute right-2"
42 |           onClick={() => onClear?.()}
43 |         />
44 |       )}
45 |     </div>
46 |   );
47 | }
```

apps/dashboard/src/components/inbox-settings.tsx
```
1 | import { type UpdateTeamFormValues, updateTeamSchema } from "@/actions/schema";
2 | import { updateTeamAction } from "@/actions/update-team-action";
3 | import { zodResolver } from "@hookform/resolvers/zod";
4 | import { getInboxEmail } from "@midday/inbox";
5 | import { Button } from "@midday/ui/button";
6 | import { Collapsible, CollapsibleContent } from "@midday/ui/collapsible";
7 | import {
8 |   Form,
9 |   FormControl,
10 |   FormDescription,
11 |   FormField,
12 |   FormItem,
13 |   FormLabel,
14 |   FormMessage,
15 | } from "@midday/ui/form";
16 | import { Input } from "@midday/ui/input";
17 | import { Label } from "@midday/ui/label";
18 | import { Switch } from "@midday/ui/switch";
19 | import { Loader2 } from "lucide-react";
20 | import { useAction } from "next-safe-action/hooks";
21 | import { useForm } from "react-hook-form";
22 | import { CopyInput } from "./copy-input";
23 |
24 | type Props = {
25 |   forwardEmail: string;
26 |   inboxId: string;
27 |   inboxForwarding: boolean;
28 |   onSuccess: () => void;
29 | };
30 |
31 | export function InboxSettings({
32 |   forwardEmail,
33 |   inboxForwarding,
34 |   inboxId,
35 |   onSuccess,
36 | }: Props) {
37 |   const action = useAction(updateTeamAction, {
38 |     onSuccess,
39 |   });
40 |
41 |   const form = useForm<UpdateTeamFormValues>({
42 |     resolver: zodResolver(updateTeamSchema),
43 |     defaultValues: {
44 |       inbox_email: forwardEmail,
45 |       inbox_forwarding: inboxForwarding,
46 |     },
47 |   });
48 |
49 |   const onSubmit = form.handleSubmit((data) => {
50 |     action.execute(data);
51 |   });
52 |
53 |   return (
54 |     <div className="flex flex-col space-y-4">
55 |       <div className="flex flex-col space-y-3">
56 |         <Label>Inbox email</Label>
57 |         <CopyInput value={getInboxEmail(inboxId)} />
58 |       </div>
59 |
60 |       <Form {...form}>
61 |         <form onSubmit={onSubmit} className="flex flex-col">
62 |           <Collapsible open={form.watch("inbox_forwarding")}>
63 |             <FormField
64 |               control={form.control}
65 |               name="inbox_forwarding"
66 |               render={({ field }) => (
67 |                 <FormItem className="flex justify-between items-center w-full mb-4">
68 |                   <FormLabel>Forward email</FormLabel>
69 |                   <FormControl>
70 |                     <Switch
71 |                       checked={field.value}
72 |                       onCheckedChange={field.onChange}
73 |                     />
74 |                   </FormControl>
75 |                 </FormItem>
76 |               )}
77 |             />
78 |
79 |             <CollapsibleContent>
80 |               <FormField
81 |                 control={form.control}
82 |                 name="inbox_email"
83 |                 render={({ field }) => (
84 |                   <FormItem>
85 |                     <FormControl>
86 |                       <Input
87 |                         {...field}
88 |                         value={field.value ?? ""}
89 |                         onChange={(evt) =>
90 |                           field.onChange(
91 |                             evt.target.value.length > 0
92 |                               ? evt.target.value
93 |                               : null
94 |                           )
95 |                         }
96 |                         className="w-full"
97 |                         autoComplete="off"
98 |                         autoCapitalize="none"
99 |                         autoCorrect="off"
100 |                         spellCheck="false"
101 |                         type="email"
102 |                         placeholder="hello@example.com"
103 |                       />
104 |                     </FormControl>
105 |                     <FormDescription>
106 |                       We will send a copy of the email to this address.
107 |                     </FormDescription>
108 |                     <FormMessage />
109 |                   </FormItem>
110 |                 )}
111 |               />
112 |             </CollapsibleContent>
113 |           </Collapsible>
114 |
115 |           <div className="w-full mt-8">
116 |             <Button
117 |               type="submit"
118 |               disabled={action.status === "executing"}
119 |               className="w-full"
120 |             >
121 |               {action.status === "executing" ? (
122 |                 <Loader2 className="h-4 w-4 animate-spin" />
123 |               ) : (
124 |                 "Save"
125 |               )}
126 |             </Button>
127 |           </div>
128 |         </form>
129 |       </Form>
130 |     </div>
131 |   );
132 | }
```

apps/dashboard/src/components/inbox-skeleton.tsx
```
1 | "use client";
2 |
3 | import { InboxHeader } from "./inbox-header";
4 | import { InboxStructure } from "./inbox-structure";
5 |
6 | type Props = {
7 |   forwardEmail?: string;
8 |   inboxId?: string;
9 |   ascending: boolean;
10 | };
11 |
12 | export function InboxViewSkeleton({ forwardEmail, inboxId, ascending }: Props) {
13 |   return (
14 |     <InboxStructure
15 |       isLoading
16 |       headerComponent={
17 |         <InboxHeader
18 |           inboxForwarding
19 |           ascending={ascending}
20 |           forwardEmail={forwardEmail ?? ""}
21 |           inboxId={inboxId ?? ""}
22 |         />
23 |       }
24 |     />
25 |   );
26 | }
```

apps/dashboard/src/components/inbox-status.tsx
```
1 | "use client";
2 |
3 | import { Icons } from "@midday/ui/icons";
4 | import {
5 |   Tooltip,
6 |   TooltipContent,
7 |   TooltipProvider,
8 |   TooltipTrigger,
9 | } from "@midday/ui/tooltip";
10 |
11 | export function InboxStatus({ item }) {
12 |   if (item.status === "processing" || item.status === "new") {
13 |     return (
14 |       <div className="flex space-x-1 items-center py-1 px-2 h-[26px]">
15 |         <span className="text-xs">Processing</span>
16 |       </div>
17 |     );
18 |   }
19 |
20 |   if (item?.transaction_id) {
21 |     return (
22 |       <div className="flex space-x-1 items-center py-1 px-2 h-[26px]">
23 |         <Icons.Check />
24 |         <span className="text-xs">Done</span>
25 |       </div>
26 |     );
27 |   }
28 |
29 |   if (item.pending || item.status === "pending") {
30 |     return (
31 |       <TooltipProvider delayDuration={0}>
32 |         <Tooltip>
33 |           <TooltipTrigger asChild>
34 |             <div className="p-1 text-[#878787] bg-[#F2F1EF] text-[11px] dark:bg-[#1D1D1D] px-3 py-1 rounded-full cursor-default font-mono inline-block">
35 |               <span>Pending</span>
36 |             </div>
37 |           </TooltipTrigger>
38 |           <TooltipContent sideOffset={20} className="text-xs">
39 |             <p>
40 |               We will try to match against incoming <br />
41 |               transactions for up to 45 days
42 |             </p>
43 |           </TooltipContent>
44 |         </Tooltip>
45 |       </TooltipProvider>
46 |     );
47 |   }
48 |
49 |   return (
50 |     <TooltipProvider delayDuration={0}>
51 |       <Tooltip>
52 |         <TooltipTrigger asChild>
53 |           <div className="flex space-x-1 items-center">
54 |             <Icons.Error />
55 |             <span>Needs review</span>
56 |           </div>
57 |         </TooltipTrigger>
58 |         <TooltipContent sideOffset={20} className="text-xs">
59 |           <p>
60 |             We could not find a matching transaction
61 |             <br />
62 |             please select the transaction manually
63 |           </p>
64 |         </TooltipContent>
65 |       </Tooltip>
66 |     </TooltipProvider>
67 |   );
68 | }
```

apps/dashboard/src/components/inbox-structure.tsx
```
1 | import { Tabs } from "@midday/ui/tabs";
2 | import { TooltipProvider } from "@midday/ui/tooltip";
3 | import { useQueryState } from "nuqs";
4 | import { InboxDetailsSkeleton } from "./inbox-details-skeleton";
5 | import { InboxListSkeleton } from "./inbox-list-skeleton";
6 |
7 | type Props = {
8 |   isLoading?: boolean;
9 |   headerComponent: React.ReactNode;
10 |   leftComponent?: React.ReactNode;
11 |   rightComponent?: React.ReactNode;
12 |   onChangeTab?: (tab: "done" | "todo") => void;
13 | };
14 |
15 | export function InboxStructure({
16 |   headerComponent,
17 |   leftComponent,
18 |   rightComponent,
19 |   onChangeTab,
20 |   isLoading,
21 | }: Props) {
22 |   const [tab, setTab] = useQueryState("tab", {
23 |     defaultValue: "todo",
24 |   });
25 |
26 |   return (
27 |     <TooltipProvider delayDuration={0}>
28 |       <div className="flex flex-row space-x-8 mt-4">
29 |         <div className="w-full h-[calc(100vh-120px)] relative overflow-hidden">
30 |           <Tabs
31 |             value={tab}
32 |             onValueChange={(value) => {
33 |               setTab(value);
34 |               onChangeTab?.(value);
35 |             }}
36 |           >
37 |             {headerComponent}
38 |             {isLoading ? (
39 |               <InboxListSkeleton numberOfItems={12} />
40 |             ) : (
41 |               leftComponent
42 |             )}
43 |           </Tabs>
44 |         </div>
45 |         {isLoading ? <InboxDetailsSkeleton /> : rightComponent}
46 |       </div>
47 |     </TooltipProvider>
48 |   );
49 | }
```

apps/dashboard/src/components/inbox-upload-zone.tsx
```
1 | "use client";
2 |
3 | import { inboxUploadAction } from "@/actions/inbox-upload-action";
4 | import { resumableUpload } from "@/utils/upload";
5 | import { createClient } from "@midday/supabase/client";
6 | import { cn } from "@midday/ui/cn";
7 | import { useToast } from "@midday/ui/use-toast";
8 | import { useAction } from "next-safe-action/hooks";
9 | import { type ReactNode, useEffect, useRef, useState } from "react";
10 | import { useDropzone } from "react-dropzone";
11 |
12 | type Props = {
13 |   teamId: string;
14 |   children: ReactNode;
15 | };
16 |
17 | export function UploadZone({ children, teamId }: Props) {
18 |   const supabase = createClient();
19 |   const [progress, setProgress] = useState(0);
20 |   const [showProgress, setShowProgress] = useState(false);
21 |   const [toastId, setToastId] = useState(null);
22 |   const uploadProgress = useRef([]);
23 |   const { toast, dismiss, update } = useToast();
24 |
25 |   const inboxUpload = useAction(inboxUploadAction);
26 |
27 |   useEffect(() => {
28 |     if (!toastId && showProgress) {
29 |       const { id } = toast({
30 |         title: `Uploading ${uploadProgress.current.length} files`,
31 |         progress,
32 |         variant: "progress",
33 |         description: "Please do not close browser until completed",
34 |         duration: Number.POSITIVE_INFINITY,
35 |       });
36 |
37 |       setToastId(id);
38 |     } else {
39 |       update(toastId, {
40 |         progress,
41 |         title: `Uploading ${uploadProgress.current.length} files`,
42 |       });
43 |     }
44 |   }, [showProgress, progress, toastId]);
45 |
46 |   const onDrop = async (files) => {
47 |     // NOTE: If onDropRejected
48 |     if (!files.length) {
49 |       return;
50 |     }
51 |
52 |     // Set default progress
53 |     uploadProgress.current = files.map(() => 0);
54 |
55 |     setShowProgress(true);
56 |
57 |     // Add uploaded folder so we can filter background job on this
58 |     const path = [teamId, "inbox"];
59 |
60 |     try {
61 |       const results = await Promise.all(
62 |         files.map(async (file, idx) =>
63 |           resumableUpload(supabase, {
64 |             bucket: "vault",
65 |             path,
66 |             file,
67 |             onProgress: (bytesUploaded, bytesTotal) => {
68 |               uploadProgress.current[idx] = (bytesUploaded / bytesTotal) * 100;
69 |
70 |               const _progress = uploadProgress.current.reduce(
71 |                 (acc, currentValue) => {
72 |                   return acc + currentValue;
73 |                 },
74 |                 0,
75 |               );
76 |
77 |               setProgress(Math.round(_progress / files.length));
78 |             },
79 |           }),
80 |         ),
81 |       );
82 |
83 |       // Trigger the upload jobs
84 |       inboxUpload.execute(
85 |         results.map((result) => ({
86 |           file_path: [...path, result.filename],
87 |           mimetype: result.file.type,
88 |           size: result.file.size,
89 |         })),
90 |       );
91 |
92 |       // Reset once done
93 |       uploadProgress.current = [];
94 |
95 |       setProgress(0);
96 |       toast({
97 |         title: "Upload successful.",
98 |         variant: "success",
99 |         duration: 2000,
100 |       });
101 |
102 |       setShowProgress(false);
103 |       setToastId(null);
104 |       dismiss(toastId);
105 |     } catch {
106 |       toast({
107 |         duration: 2500,
108 |         variant: "error",
109 |         title: "Something went wrong please try again.",
110 |       });
111 |     }
112 |   };
113 |
114 |   const { getRootProps, getInputProps, isDragActive } = useDropzone({
115 |     onDrop,
116 |     onDropRejected: ([reject]) => {
117 |       if (reject?.errors.find(({ code }) => code === "file-too-large")) {
118 |         toast({
119 |           duration: 2500,
120 |           variant: "error",
121 |           title: "File size to large.",
122 |         });
123 |       }
124 |
125 |       if (reject?.errors.find(({ code }) => code === "file-invalid-type")) {
126 |         toast({
127 |           duration: 2500,
128 |           variant: "error",
129 |           title: "File type not supported.",
130 |         });
131 |       }
132 |     },
133 |     maxSize: 3000000, // 3MB
134 |     maxFiles: 10,
135 |     accept: {
136 |       "image/png": [".png"],
137 |       "image/jpeg": [".jpg", ".jpeg"],
138 |       "application/pdf": [".pdf"],
139 |     },
140 |   });
141 |
142 |   return (
143 |     <div
144 |       {...getRootProps({ onClick: (evt) => evt.stopPropagation() })}
145 |       className="relative h-full"
146 |     >
147 |       <div className="absolute top-0 bottom-0 right-0 left-0 z-[51] pointer-events-none">
148 |         <div
149 |           className={cn(
150 |             "bg-background dark:bg-[#1A1A1A] h-full flex items-center justify-center text-center invisible",
151 |             isDragActive && "visible",
152 |           )}
153 |         >
154 |           <input {...getInputProps()} id="upload-files" />
155 |           <p className="text-xs">
156 |             Drop your receipts here. <br />
157 |             Maximum of 10 files at a time.
158 |           </p>
159 |         </div>
160 |       </div>
161 |
162 |       {children}
163 |     </div>
164 |   );
165 | }
```

apps/dashboard/src/components/inbox-view-skeleton.tsx
```
1 | "use client";
2 |
3 | import { InboxHeader } from "./inbox-header";
4 | import { InboxStructure } from "./inbox-structure";
5 |
6 | export function InboxViewSkeleton() {
7 |   return (
8 |     <InboxStructure
9 |       isLoading
10 |       headerComponent={
11 |         <InboxHeader forwardEmail="" inboxId="" ascending inboxForwarding />
12 |       }
13 |     />
14 |   );
15 | }
```

apps/dashboard/src/components/inbox-view.tsx
```
1 | "use client";
2 |
3 | import { updateInboxAction } from "@/actions/inbox/update";
4 | import { searchAction } from "@/actions/search-action";
5 | import { InboxDetails } from "@/components/inbox-details";
6 | import { InboxList } from "@/components/inbox-list";
7 | import { createClient } from "@midday/supabase/client";
8 | import { TabsContent } from "@midday/ui/tabs";
9 | import { ToastAction } from "@midday/ui/toast";
10 | import { useToast } from "@midday/ui/use-toast";
11 | import { useDebounce } from "@uidotdev/usehooks";
12 | import { useOptimisticAction } from "next-safe-action/hooks";
13 | import { useAction } from "next-safe-action/hooks";
14 | import { parseAsString, parseAsStringEnum, useQueryStates } from "nuqs";
15 | import { useEffect, useState } from "react";
16 | import { InboxEmpty } from "./inbox-empty";
17 | import { InboxHeader } from "./inbox-header";
18 | import { InboxStructure } from "./inbox-structure";
19 |
20 | type Props = {
21 |   items: any[];
22 |   forwardEmail: string;
23 |   inboxForwarding: boolean;
24 |   inboxId: string;
25 |   teamId: string;
26 |   ascending: boolean;
27 |   query?: string;
28 |   currencies: string[];
29 |   locale: string;
30 | };
31 |
32 | export const TAB_ITEMS = ["todo", "done"];
33 |
34 | const todoFilter = (item) =>
35 |   !item.transaction_id &&
36 |   item.status !== "deleted" &&
37 |   item.status !== "archived";
38 |
39 | const doneFilter = (item) =>
40 |   item.transaction_id &&
41 |   item.status !== "deleted" &&
42 |   item.status !== "archived";
43 |
44 | export function InboxView({
45 |   items: initialItems,
46 |   forwardEmail,
47 |   inboxForwarding,
48 |   teamId,
49 |   inboxId,
50 |   ascending,
51 |   query,
52 |   currencies,
53 |   locale,
54 | }: Props) {
55 |   const supabase = createClient();
56 |   const { toast } = useToast();
57 |   const [isLoading, setLoading] = useState(Boolean(query));
58 |   const [items, setItems] = useState(initialItems);
59 |
60 |   const [params, setParams] = useQueryStates({
61 |     inboxId: parseAsString.withDefault(
62 |       items.filter(todoFilter)?.at(0)?.id ?? null,
63 |     ),
64 |     q: parseAsString.withDefault(""),
65 |     tab: parseAsStringEnum(TAB_ITEMS).withDefault("todo"),
66 |   });
67 |
68 |   const debouncedSearchTerm = useDebounce(params.q, 300);
69 |
70 |   const search = useAction(searchAction, {
71 |     onSuccess: ({ data }) => {
72 |       setLoading(false);
73 |
74 |       if (data?.length) {
75 |         setParams({ id: data?.at(0)?.id || null });
76 |       }
77 |     },
78 |     onError: () => setLoading(false),
79 |   });
80 |
81 |   useEffect(() => {
82 |     setItems(initialItems);
83 |   }, [ascending]);
84 |
85 |   useEffect(() => {
86 |     const channel = supabase
87 |       .channel("realtime_inbox")
88 |       .on(
89 |         "postgres_changes",
90 |         {
91 |           event: "*",
92 |           schema: "public",
93 |           table: "inbox",
94 |           filter: `team_id=eq.${teamId}`,
95 |         },
96 |         (payload) => {
97 |           switch (payload.eventType) {
98 |             case "INSERT":
99 |               {
100 |                 setItems((prev) => [payload.new, ...prev]);
101 |
102 |                 if (params.inboxId) {
103 |                   setTimeout(() => {
104 |                     setParams({ inboxId: payload.new.id });
105 |                   }, 100);
106 |                 }
107 |               }
108 |               break;
109 |             case "UPDATE":
110 |               {
111 |                 if (payload.new.transaction_id) {
112 |                   toast({
113 |                     title: "Sucessfully matched transaction",
114 |                     description:
115 |                       "We've found a transaction for this attachment.",
116 |                     variant: "success",
117 |                   });
118 |                 }
119 |
120 |                 setItems((prev) => {
121 |                   return prev.map((item) => {
122 |                     if (item.id === payload.new.id) {
123 |                       return { ...item, ...payload.new };
124 |                     }
125 |
126 |                     return item;
127 |                   });
128 |                 });
129 |               }
130 |               break;
131 |             default:
132 |               break;
133 |           }
134 |         },
135 |       )
136 |       .subscribe();
137 |
138 |     return () => {
139 |       supabase.removeChannel(channel);
140 |     };
141 |   }, [teamId]);
142 |
143 |   useEffect(() => {
144 |     if (params.q) {
145 |       setLoading(true);
146 |     }
147 |   }, [params.q]);
148 |
149 |   useEffect(() => {
150 |     if (debouncedSearchTerm) {
151 |       search.execute({
152 |         query: debouncedSearchTerm,
153 |         type: "inbox",
154 |         limit: 100,
155 |       });
156 |     }
157 |   }, [debouncedSearchTerm]);
158 |
159 |   const data = params.q ? search.result?.data || [] : items;
160 |
161 |   const { execute: updateInbox, optimisticState } = useOptimisticAction(
162 |     updateInboxAction,
163 |     {
164 |       currentState: data,
165 |       updateFn: (state, payload) => {
166 |         if (payload.status === "deleted") {
167 |           return state.filter((item) => item.id !== payload.id);
168 |         }
169 |
170 |         return items.map((item) => {
171 |           if (item.id === payload.id) {
172 |             return {
173 |               ...item,
174 |               ...payload,
175 |             };
176 |           }
177 |
178 |           return item;
179 |         });
180 |       },
181 |     },
182 |   );
183 |
184 |   const getCurrentItems = (tab: (typeof TAB_ITEMS)[0]) => {
185 |     if (params.q) {
186 |       return optimisticState;
187 |     }
188 |
[TRUNCATED]
```

apps/dashboard/src/components/inbox.tsx
```
1 | import { getUser } from "@midday/supabase/cached-queries";
2 | import { getInboxQuery } from "@midday/supabase/queries";
3 | import { createClient } from "@midday/supabase/server";
4 | import { UploadZone } from "./inbox-upload-zone";
5 | import { InboxView } from "./inbox-view";
6 |
7 | type Props = {
8 |   ascending: boolean;
9 |   query?: string;
10 |   currencies: string[];
11 | };
12 |
13 | export async function Inbox({ ascending, query, currencies }: Props) {
14 |   const supabase = createClient();
15 |   const user = await getUser();
16 |
17 |   const teamId = user?.data?.team_id as string;
18 |
19 |   const inbox = await getInboxQuery(supabase, {
20 |     to: 10000,
21 |     teamId,
22 |     ascending,
23 |   });
24 |
25 |   return (
26 |     <UploadZone teamId={teamId}>
27 |       <InboxView
28 |         items={inbox?.data}
29 |         teamId={teamId}
30 |         inboxId={user?.data?.team?.inbox_id}
31 |         forwardEmail={user?.data?.team?.inbox_email}
32 |         inboxForwarding={user?.data?.team?.inbox_forwarding}
33 |         ascending={ascending}
34 |         query={query}
35 |         currencies={currencies}
36 |       />
37 |     </UploadZone>
38 |   );
39 | }
```

apps/dashboard/src/components/input-color.tsx
```
1 | import { getColorFromName, getRandomColor } from "@/utils/categories";
2 | import { Input } from "@midday/ui/input";
3 | import { useState } from "react";
4 | import { ColorPicker } from "./color-picker";
5 |
6 | type Props = {
7 |   placeholder: string;
8 |   defaultValue?: string;
9 |   defaultColor?: string;
10 |   autoFocus?: booleam;
11 |   onChange: (values: { name: string; color: string }) => void;
12 | };
13 |
14 | export function InputColor({
15 |   placeholder,
16 |   defaultValue,
17 |   onChange,
18 |   defaultColor,
19 |   autoFocus,
20 | }: Props) {
21 |   const [color, setColor] = useState(defaultColor ?? getRandomColor());
22 |   const [value, setValue] = useState(defaultValue);
23 |
24 |   return (
25 |     <div className="relative">
26 |       <ColorPicker
27 |         value={color}
28 |         onSelect={(newColor) => {
29 |           setColor(newColor);
30 |           onChange({
31 |             color: newColor,
32 |             name: value,
33 |           });
34 |         }}
35 |       />
36 |       <Input
37 |         placeholder={placeholder}
38 |         autoComplete="off"
39 |         autoCapitalize="none"
40 |         autoFocus={autoFocus}
41 |         autoCorrect="off"
42 |         spellCheck="false"
43 |         className="pl-7"
44 |         value={value}
45 |         onChange={(evt) => {
46 |           const newName = evt.target.value;
47 |           const newColor = getColorFromName(newName);
48 |
49 |           setColor(newColor);
50 |           setValue(newName);
51 |
52 |           onChange({
53 |             color: newColor,
54 |             name: newName,
55 |           });
56 |         }}
57 |       />
58 |     </div>
59 |   );
60 | }
```

apps/dashboard/src/components/institution-info.tsx
```
1 | import {
2 |   Tooltip,
3 |   TooltipContent,
4 |   TooltipProvider,
5 |   TooltipTrigger,
6 | } from "@midday/ui/tooltip";
7 | import type { ReactNode } from "react";
8 |
9 | type Props = {
10 |   provider: string;
11 |   children: ReactNode;
12 | };
13 |
14 | export function InstitutionInfo({ provider, children }: Props) {
15 |   const getDescription = () => {
16 |     switch (provider) {
17 |       case "gocardless":
18 |         return "With GoCardLess we can connect to more than 2,500 banks in 31 countries across the UK and Europe.";
19 |       case "plaid":
20 |         return `With Plaid we can connect to 12,000+ financial institutions across the US, Canada, UK, and Europe are covered by Plaid's network`;
21 |       case "teller":
22 |         return "With Teller we can connect instantly to more than 5,000 financial institutions in the US.";
23 |       default:
24 |         break;
25 |     }
26 |   };
27 |
28 |   return (
29 |     <TooltipProvider delayDuration={100}>
30 |       <Tooltip>
31 |         <TooltipTrigger asChild>{children}</TooltipTrigger>
32 |         <TooltipContent className="w-[300px] text-xs" side="right">
33 |           {getDescription()}
34 |         </TooltipContent>
35 |       </Tooltip>
36 |     </TooltipProvider>
37 |   );
38 | }
```

apps/dashboard/src/components/invoice-actions.tsx
```
1 | import { deleteInvoiceAction } from "@/actions/invoice/delete-invoice-action";
2 | import { sendReminderAction } from "@/actions/invoice/send-reminder-action";
3 | import { updateInvoiceAction } from "@/actions/invoice/update-invoice-action";
4 | import { useInvoiceParams } from "@/hooks/use-invoice-params";
5 | import { UTCDate } from "@date-fns/utc";
6 | import {
7 |   AlertDialog,
8 |   AlertDialogAction,
9 |   AlertDialogCancel,
10 |   AlertDialogContent,
11 |   AlertDialogDescription,
12 |   AlertDialogFooter,
13 |   AlertDialogHeader,
14 |   AlertDialogTitle,
15 |   AlertDialogTrigger,
16 | } from "@midday/ui/alert-dialog";
17 | import { Button } from "@midday/ui/button";
18 | import {
19 |   DropdownMenu,
20 |   DropdownMenuContent,
21 |   DropdownMenuItem,
22 |   DropdownMenuTrigger,
23 | } from "@midday/ui/dropdown-menu";
24 | import { Icons } from "@midday/ui/icons";
25 | import { useAction } from "next-safe-action/hooks";
26 |
27 | type Props = {
28 |   status: string;
29 |   id: string;
30 | };
31 |
32 | export function InvoiceActions({ status, id }: Props) {
33 |   const { setParams } = useInvoiceParams();
34 |   const updateInvoice = useAction(updateInvoiceAction);
35 |   const deleteInvoice = useAction(deleteInvoiceAction);
36 |   const sendReminder = useAction(sendReminderAction);
37 |
38 |   const handleDeleteInvoice = () => {
39 |     deleteInvoice.execute({ id });
40 |     setParams(null);
41 |   };
42 |
43 |   switch (status) {
44 |     case "canceled":
45 |     case "paid":
46 |       return (
47 |         <div className="absolute right-4 mt-7">
48 |           <DropdownMenu>
49 |             <DropdownMenuTrigger asChild>
50 |               <Button
51 |                 size="sm"
52 |                 variant="secondary"
53 |                 className="hover:bg-secondary"
54 |               >
55 |                 <Icons.MoreHoriz className="size-4" />
56 |               </Button>
57 |             </DropdownMenuTrigger>
58 |             <DropdownMenuContent sideOffset={10} align="end">
59 |               <DropdownMenuItem
60 |                 onClick={() =>
61 |                   updateInvoice.execute({
62 |                     id,
63 |                     status: "unpaid",
64 |                     paid_at: null,
65 |                   })
66 |                 }
67 |               >
68 |                 Mark as unpaid
69 |               </DropdownMenuItem>
70 |               <DropdownMenuItem
71 |                 className="text-destructive"
72 |                 onClick={handleDeleteInvoice}
73 |               >
74 |                 Delete
75 |               </DropdownMenuItem>
76 |             </DropdownMenuContent>
77 |           </DropdownMenu>
78 |         </div>
79 |       );
80 |
81 |     case "overdue":
82 |     case "unpaid":
83 |       return (
84 |         <div className="flex space-x-2 mt-8">
85 |           <AlertDialog>
86 |             <AlertDialogTrigger asChild>
87 |               <Button
88 |                 size="sm"
89 |                 variant="secondary"
90 |                 className="flex items-center space-x-2 hover:bg-secondary w-full"
91 |               >
92 |                 <Icons.Notifications className="size-3.5" />
93 |                 <span>Remind</span>
94 |               </Button>
95 |             </AlertDialogTrigger>
96 |             <AlertDialogContent>
97 |               <AlertDialogHeader>
98 |                 <AlertDialogTitle>Send Reminder</AlertDialogTitle>
99 |                 <AlertDialogDescription>
100 |                   Are you sure you want to send a reminder for this invoice?
101 |                 </AlertDialogDescription>
102 |               </AlertDialogHeader>
103 |               <AlertDialogFooter>
104 |                 <AlertDialogCancel>Cancel</AlertDialogCancel>
105 |                 <AlertDialogAction
106 |                   onClick={() => sendReminder.execute({ id })}
107 |                   disabled={sendReminder.isPending}
108 |                 >
109 |                   Send Reminder
110 |                 </AlertDialogAction>
111 |               </AlertDialogFooter>
112 |             </AlertDialogContent>
113 |           </AlertDialog>
114 |
115 |           <Button
116 |             size="sm"
117 |             variant="secondary"
118 |             className="flex items-center space-x-2 hover:bg-secondary w-full"
119 |             onClick={() => setParams({ invoiceId: id, type: "edit" })}
120 |           >
121 |             <Icons.Edit className="size-3.5" />
122 |             <span>Edit</span>
123 |           </Button>
124 |
125 |           <DropdownMenu>
126 |             <DropdownMenuTrigger asChild>
127 |               <Button
128 |                 size="sm"
129 |                 variant="secondary"
130 |                 className="hover:bg-secondary"
131 |               >
132 |                 <Icons.MoreHoriz className="size-4" />
133 |               </Button>
134 |             </DropdownMenuTrigger>
135 |             <DropdownMenuContent sideOffset={10} align="end">
136 |               <DropdownMenuItem
137 |                 onClick={() =>
138 |                   updateInvoice.execute({
139 |                     id,
140 |                     status: "paid",
141 |                     paid_at: new UTCDate().toISOString(),
142 |                   })
143 |                 }
144 |               >
145 |                 Mark as paid
146 |               </DropdownMenuItem>
147 |               <DropdownMenuItem
148 |                 className="text-destructive"
149 |                 onClick={handleDeleteInvoice}
150 |               >
151 |                 Delete
152 |               </DropdownMenuItem>
153 |               <DropdownMenuItem
154 |                 className="text-destructive"
155 |                 onClick={() =>
156 |                   updateInvoice.execute({ id, status: "canceled" })
157 |                 }
158 |               >
159 |                 Cancel
160 |               </DropdownMenuItem>
161 |             </DropdownMenuContent>
162 |           </DropdownMenu>
163 |         </div>
164 |       );
165 |     case "draft":
166 |       return (
167 |         <div className="flex space-x-2 mt-8">
168 |           <Button
169 |             size="sm"
170 |             variant="secondary"
171 |             className="flex items-center space-x-2 hover:bg-secondary w-full"
172 |             onClick={() => setParams({ invoiceId: id, type: "edit" })}
173 |           >
174 |             <Icons.Edit className="size-3.5" />
175 |             <span>Edit</span>
176 |           </Button>
177 |
178 |           <DropdownMenu>
179 |             <DropdownMenuTrigger asChild>
180 |               <Button
181 |                 size="sm"
[TRUNCATED]
```

apps/dashboard/src/components/invoice-comments.tsx
```
1 | "use client";
2 |
3 | import { Avatar, AvatarFallback, AvatarImageNext } from "@midday/ui/avatar";
4 | import { cn } from "@midday/ui/cn";
5 | import { Icons } from "@midday/ui/icons";
6 | import { Textarea } from "@midday/ui/textarea";
7 |
8 | const comments = [
9 |   {
10 |     id: "1",
11 |     content:
12 |       "Hi, I've sent the invoice for last month's services. Please let me know if everything looks good.",
13 |     avatarUrl:
14 |       "https://lh3.googleusercontent.com/a/ACg8ocLjCbXytBlvKPhIpNLGvaGkhdbtfumGo4tKpn72QUVT0hu4AVKB=s96-c",
15 |     name: "John Doe",
16 |     createdAt: new Date(),
17 |     owner: "user",
18 |   },
19 |   {
20 |     id: "2",
21 |     content:
22 |       "Thanks for sending the invoice. I noticed a discrepancy in the total amount. Could you verify the charges for the additional services?",
23 |     avatarUrl: null,
24 |     name: "Acme Inc",
25 |     createdAt: new Date(),
26 |     owner: "customer",
27 |   },
28 |   {
29 |     id: "3",
30 |     content:
31 |       "Sure! The additional charge is for the extra support hours we provided on the 10th and 11th. Let me know if you need further details.",
32 |     avatarUrl:
33 |       "https://lh3.googleusercontent.com/a/ACg8ocLjCbXytBlvKPhIpNLGvaGkhdbtfumGo4tKpn72QUVT0hu4AVKB=s96-c",
34 |     name: "John Doe",
35 |     createdAt: new Date(),
36 |     owner: "user",
37 |   },
38 |   {
39 |     id: "4",
40 |     content:
41 |       "Got it! That makes sense now. Everything looks good—I'll process the payment by Friday.",
42 |     avatarUrl: null,
43 |     name: "Acme Inc",
44 |     createdAt: new Date(),
45 |     owner: "customer",
46 |   },
47 |   {
48 |     id: "5",
49 |     content: "Great, thanks for confirming!",
50 |     avatarUrl:
51 |       "https://lh3.googleusercontent.com/a/ACg8ocLjCbXytBlvKPhIpNLGvaGkhdbtfumGo4tKpn72QUVT0hu4AVKB=s96-c",
52 |     name: "John Doe",
53 |     createdAt: new Date(),
54 |     owner: "user",
55 |   },
56 | ];
57 |
58 | export function InvoiceComments() {
59 |   return (
60 |     <div>
61 |       <div className="flex flex-col space-y-8 mt-6">
62 |         {comments.map((comment) => (
63 |           <div
64 |             key={comment.id}
65 |             className={cn("flex", {
66 |               "justify-end": comment.owner === "user",
67 |               "justify-start": comment.owner === "customer",
68 |             })}
69 |           >
70 |             {comment.owner === "customer" && (
71 |               <Avatar className="size-6 mr-2 mt-auto object-contain border border-border">
72 |                 <AvatarImageNext
73 |                   src={comment.avatarUrl}
74 |                   alt={comment.name ?? ""}
75 |                   width={24}
76 |                   height={24}
77 |                 />
78 |                 <AvatarFallback className="text-[10px] font-medium">
79 |                   {comment.name[0]}
80 |                 </AvatarFallback>
81 |               </Avatar>
82 |             )}
83 |             <div
84 |               className={cn("max-w-[70%] py-3 px-6", {
85 |                 "rounded-tl-full rounded-tr-full rounded-bl-full ring-1 ring-inset ring-border text-primary":
86 |                   comment.owner === "user",
87 |                 "bg-secondary rounded-tr-full rounded-tl-full rounded-br-full text-[#878787]":
88 |                   comment.owner === "customer",
89 |               })}
90 |             >
91 |               <p className="text-xs">{comment.content}</p>
92 |             </div>
93 |
94 |             {comment.owner === "user" && (
95 |               <Avatar className="size-6 ml-2 mt-auto object-contain border border-border">
96 |                 <AvatarImageNext
97 |                   src={comment.avatarUrl}
98 |                   alt={comment.name ?? ""}
99 |                   width={24}
100 |                   height={24}
101 |                 />
102 |                 <AvatarFallback className="text-[10px] font-medium">
103 |                   {comment.name[0]}
104 |                 </AvatarFallback>
105 |               </Avatar>
106 |             )}
107 |           </div>
108 |         ))}
109 |       </div>
110 |
111 |       <div className="absolute bottom-0 left-0 w-full">
112 |         <Textarea
113 |           placeholder="Add a comment"
114 |           className="resize-none border-0 border-t border-border pt-3 h-12 min-h-12"
115 |           autoFocus
116 |         />
117 |
118 |         <div className="hidden todesktop:flex md:flex px-3 h-[40px] w-full border-t-[1px] items-center bg-background backdrop-filter dark:border-[#2C2C2C] backdrop-blur-lg dark:bg-[#151515]/[99]">
119 |           <div className="scale-50 opacity-50 -ml-2">
120 |             <Icons.LogoSmall />
121 |           </div>
122 |
123 |           <div className="ml-auto flex space-x-4">
124 |             <button
125 |               className="flex space-x-2 items-center text-sm"
126 |               type="button"
127 |             >
128 |               <kbd className="pointer-events-none size-6 select-none border bg-accent px-1.5 font-mono font-medium">
129 |                 <span>↵</span>
130 |               </kbd>
131 |             </button>
132 |           </div>
133 |         </div>
134 |       </div>
135 |     </div>
136 |   );
137 | }
```

apps/dashboard/src/components/invoice-details.tsx
```
1 | import { createClient } from "@midday/supabase/client";
2 | import { getInvoiceQuery } from "@midday/supabase/queries";
3 | import {
4 |   Accordion,
5 |   AccordionContent,
6 |   AccordionItem,
7 |   AccordionTrigger,
8 | } from "@midday/ui/accordion";
9 | import { Avatar, AvatarFallback, AvatarImageNext } from "@midday/ui/avatar";
10 | import { Button } from "@midday/ui/button";
11 | import { cn } from "@midday/ui/cn";
12 | import { Icons } from "@midday/ui/icons";
13 | import { Skeleton } from "@midday/ui/skeleton";
14 | import { format } from "date-fns";
15 | import { useEffect, useState } from "react";
16 | import { CopyInput } from "./copy-input";
17 | import { FormatAmount } from "./format-amount";
18 | import { InvoiceActions } from "./invoice-actions";
19 | import { InvoiceNote } from "./invoice-note";
20 | import { InvoiceStatus } from "./invoice-status";
21 | import { OpenURL } from "./open-url";
22 | import type { Invoice } from "./tables/invoices/columns";
23 |
24 | type Props = {
25 |   id: string;
26 |   data?: Invoice;
27 | };
28 |
29 | export function InvoiceDetails({ id, data: initialData }: Props) {
30 |   const supabase = createClient();
31 |   const [data, setData] = useState<Invoice | null>(initialData ?? null);
32 |   const [loading, setLoading] = useState(false);
33 |
34 |   useEffect(() => {
35 |     async function fetchData() {
36 |       try {
37 |         const { data: invoice } = await getInvoiceQuery(supabase, id);
38 |
39 |         setData(invoice);
40 |         setLoading(false);
41 |       } catch {
42 |         setLoading(false);
43 |       }
44 |     }
45 |
46 |     if (!data && id) {
47 |       fetchData();
48 |     }
49 |   }, [data, id]);
50 |
51 |   useEffect(() => {
52 |     setData(initialData);
53 |   }, [initialData]);
54 |
55 |   if (loading) {
56 |     return (
57 |       <div className="space-y-6">
58 |         <div className="flex justify-between items-center">
59 |           <div className="flex space-x-2 mt-1 items-center">
60 |             <Skeleton className="size-5 rounded-full" />
61 |             <Skeleton className="h-4 w-32" />
62 |           </div>
63 |           <Skeleton className="h-6 w-20" />
64 |         </div>
65 |
66 |         <div className="flex justify-between items-center mt-6 mb-3 relative">
67 |           <div className="flex flex-col w-full space-y-1">
68 |             <Skeleton className="h-10 w-40" />
69 |             <Skeleton className="h-3 w-24" />
70 |           </div>
71 |         </div>
72 |
73 |         <Skeleton className="h-10 w-full" />
74 |
75 |         <div className="mt-8 flex flex-col space-y-1">
76 |           <Skeleton className="h-6 w-48" />
77 |           <Skeleton className="h-4 w-36" />
78 |         </div>
79 |
80 |         <div className="mt-6 flex flex-col space-y-4 border-t border-border pt-6">
81 |           {[...Array(4)].map((_, index) => (
82 |             <div
83 |               key={index.toString()}
84 |               className="flex justify-between items-center"
85 |             >
86 |               <Skeleton className="h-4 w-24" />
87 |               <Skeleton className="h-4 w-32" />
88 |             </div>
89 |           ))}
90 |         </div>
91 |
92 |         <div className="mt-6 flex flex-col space-y-2 border-t border-border pt-6">
93 |           <Skeleton className="h-4 w-24" />
94 |           <div className="flex w-full gap-2">
95 |             <Skeleton className="h-10 flex-1" />
96 |             <Skeleton className="h-10 w-10" />
97 |           </div>
98 |         </div>
99 |
100 |         <div className="mt-6">
101 |           <Skeleton className="h-10 w-full" />
102 |         </div>
103 |       </div>
104 |     );
105 |   }
106 |
107 |   if (!data) {
108 |     return null;
109 |   }
110 |
111 |   const {
112 |     customer,
113 |     amount,
114 |     currency,
115 |     status,
116 |     vat,
117 |     tax,
118 |     paid_at,
119 |     due_date,
120 |     issue_date,
121 |     invoice_number,
122 |     template,
123 |     token,
124 |     internal_note,
125 |     updated_at,
126 |   } = data;
127 |
128 |   return (
129 |     <div>
130 |       <div className="flex justify-between items-center">
131 |         <div className="flex space-x-2 mt-1 items-center">
132 |           <Avatar className="size-5">
133 |             {customer?.website && (
134 |               <AvatarImageNext
135 |                 src={`https://img.logo.dev/${customer?.website}?token=pk_X-1ZO13GSgeOoUrIuJ6GMQ&size=60`}
136 |                 alt={`${customer?.name} logo`}
137 |                 width={20}
138 |                 height={20}
139 |                 quality={100}
140 |               />
141 |             )}
142 |             <AvatarFallback className="text-[9px] font-medium">
143 |               {customer?.name?.[0]}
144 |             </AvatarFallback>
145 |           </Avatar>
146 |
147 |           <span className="text-sm line-clamp-1">{customer?.name}</span>
148 |         </div>
149 |         <InvoiceStatus status={status} />
[TRUNCATED]
```

apps/dashboard/src/components/invoice-header.tsx
```
1 | import { InvoiceSearchFilter } from "@/components/invoice-search-filter";
2 | import { getCustomers } from "@midday/supabase/cached-queries";
3 | import { OpenInvoiceSheet } from "./open-invoice-sheet";
4 |
5 | export async function InvoiceHeader() {
6 |   const customers = await getCustomers();
7 |
8 |   return (
9 |     <div className="flex items-center justify-between">
10 |       <InvoiceSearchFilter customers={customers?.data ?? []} />
11 |
12 |       <div className="hidden sm:block">
13 |         <OpenInvoiceSheet />
14 |       </div>
15 |     </div>
16 |   );
17 | }
```

apps/dashboard/src/components/invoice-note.tsx
```
1 | import { updateInvoiceAction } from "@/actions/invoice/update-invoice-action";
2 | import { Textarea } from "@midday/ui/textarea";
3 | import { useAction } from "next-safe-action/hooks";
4 | import { useState } from "react";
5 |
6 | type Props = {
7 |   id: string;
8 |   defaultValue?: string | null;
9 | };
10 |
11 | export function InvoiceNote({ id, defaultValue }: Props) {
12 |   const [value, setValue] = useState(defaultValue);
13 |   const updateInvoice = useAction(updateInvoiceAction);
14 |
15 |   return (
16 |     <Textarea
17 |       defaultValue={defaultValue ?? ""}
18 |       id="note"
19 |       placeholder="Note"
20 |       className="min-h-[100px] resize-none"
21 |       onBlur={() => {
22 |         if (value !== defaultValue) {
23 |           updateInvoice.execute({
24 |             id,
25 |             internal_note: value && value.length > 0 ? value : null,
26 |           });
27 |         }
28 |       }}
29 |       onChange={(evt) => setValue(evt.target.value)}
30 |     />
31 |   );
32 | }
```

apps/dashboard/src/components/invoice-payment-score.tsx
```
1 | import { getI18n } from "@/locales/server";
2 | import { getPaymentStatus } from "@midday/supabase/cached-queries";
3 | import { Card, CardContent, CardHeader, CardTitle } from "@midday/ui/card";
4 | import { Skeleton } from "@midday/ui/skeleton";
5 | import { PaymentScoreVisualizer } from "./payment-score-visualizer";
6 |
7 | export function InvoicePaymentScoreSkeleton() {
8 |   return (
9 |     <Card>
10 |       <CardHeader className="pb-2 flex flex-row justify-between">
11 |         <CardTitle>
12 |           <Skeleton className="h-8 w-32" />
13 |         </CardTitle>
14 |       </CardHeader>
15 |
16 |       <CardContent>
17 |         <div className="flex flex-col gap-2">
18 |           <Skeleton className="h-5 w-24" />
19 |           <Skeleton className="h-4 w-full" />
20 |         </div>
21 |       </CardContent>
22 |     </Card>
23 |   );
24 | }
25 |
26 | export async function InvoicePaymentScore() {
27 |   const t = await getI18n();
28 |   const {
29 |     data: { payment_status, score },
30 |   } = await getPaymentStatus();
31 |
32 |   return (
33 |     <Card>
34 |       <CardHeader className="pb-2 flex flex-col xl:flex-row justify-between">
35 |         <CardTitle className="font-mono font-medium text-2xl">
36 |           {t(`payment_status.${payment_status}`)}
37 |         </CardTitle>
38 |
39 |         <PaymentScoreVisualizer score={score} paymentStatus={payment_status} />
40 |       </CardHeader>
41 |
42 |       <CardContent className="sm:hidden xl:flex">
43 |         <div className="flex flex-col gap-2">
44 |           <div>Payment score</div>
45 |           <div className="text-sm text-muted-foreground">
46 |             {t(`payment_status_description.${payment_status}`)}
47 |           </div>
48 |         </div>
49 |       </CardContent>
50 |     </Card>
51 |   );
52 | }
```

apps/dashboard/src/components/invoice-search-filter.tsx
```
1 | "use client";
2 |
3 | import { generateInvoiceFilters } from "@/actions/ai/filters/generate-invoice-filters";
4 | import { useInvoiceParams } from "@/hooks/use-invoice-params";
5 | import { useI18n } from "@/locales/client";
6 | import { Calendar } from "@midday/ui/calendar";
7 | import { cn } from "@midday/ui/cn";
8 | import {
9 |   DropdownMenu,
10 |   DropdownMenuCheckboxItem,
11 |   DropdownMenuContent,
12 |   DropdownMenuGroup,
13 |   DropdownMenuItem,
14 |   DropdownMenuPortal,
15 |   DropdownMenuSub,
16 |   DropdownMenuSubContent,
17 |   DropdownMenuSubTrigger,
18 |   DropdownMenuTrigger,
19 | } from "@midday/ui/dropdown-menu";
20 | import { Icons } from "@midday/ui/icons";
21 | import { Input } from "@midday/ui/input";
22 | import { readStreamableValue } from "ai/rsc";
23 | import { formatISO } from "date-fns";
24 | import { useRef, useState } from "react";
25 | import { useHotkeys } from "react-hotkeys-hook";
26 | import { FilterList } from "./filter-list";
27 |
28 | const allowedStatuses = ["draft", "overdue", "paid", "unpaid", "canceled"];
29 |
30 | type Props = {
31 |   customers?: {
32 |     id: string | null;
33 |     name: string | null;
34 |   }[];
35 | };
36 |
37 | export function InvoiceSearchFilter({ customers: customersData }: Props) {
38 |   const [prompt, setPrompt] = useState("");
39 |   const inputRef = useRef<HTMLInputElement>(null);
40 |   const [streaming, setStreaming] = useState(false);
41 |   const [isOpen, setIsOpen] = useState(false);
42 |   const { setParams, statuses, start, end, q, customers } = useInvoiceParams({
43 |     shallow: false,
44 |   });
45 |
46 |   const t = useI18n();
47 |
48 |   const statusFilters = allowedStatuses.map((status) => ({
49 |     id: status,
50 |     name: t(`invoice_status.${status}`),
51 |   }));
52 |
53 |   useHotkeys(
54 |     "esc",
55 |     () => {
56 |       setPrompt("");
57 |       setParams(null);
58 |       setIsOpen(false);
59 |     },
60 |     {
61 |       enableOnFormTags: true,
62 |       enabled: Boolean(prompt),
63 |     },
64 |   );
65 |
66 |   useHotkeys("meta+s", (evt) => {
67 |     evt.preventDefault();
68 |     inputRef.current?.focus();
69 |   });
70 |
71 |   useHotkeys("meta+f", (evt) => {
72 |     evt.preventDefault();
73 |     setIsOpen((prev) => !prev);
74 |   });
75 |
76 |   const handleSearch = (evt: React.ChangeEvent<HTMLInputElement>) => {
77 |     const value = evt.target.value;
78 |
79 |     if (value) {
80 |       setPrompt(value);
81 |     } else {
82 |       setParams(null);
83 |       setPrompt("");
84 |     }
85 |   };
86 |
87 |   const handleSubmit = async () => {
88 |     setStreaming(true);
89 |
90 |     const { object } = await generateInvoiceFilters(
91 |       prompt,
92 |       `Invoice payment statuses: ${statusFilters.map((filter) => filter.name).join(", ")}
93 |        Customers: ${customersData?.map((customer) => customer.name).join(", ")}
94 |       `,
95 |     );
96 |
97 |     let finalObject = {};
98 |
99 |     for await (const partialObject of readStreamableValue(object)) {
100 |       if (partialObject) {
101 |         finalObject = {
102 |           ...finalObject,
103 |           statuses: Array.isArray(partialObject?.statuses)
104 |             ? partialObject?.statuses
105 |             : partialObject?.statuses
106 |               ? [partialObject.statuses]
107 |               : null,
108 |           customers:
109 |             partialObject?.customers?.map(
110 |               (name: string) =>
111 |                 customersData?.find((customer) => customer.name === name)?.id,
112 |             ) ?? null,
113 |           q: partialObject?.name ?? null,
114 |           start: partialObject?.start ?? null,
115 |           end: partialObject?.end ?? null,
116 |         };
117 |       }
118 |     }
119 |
120 |     setParams({
121 |       q: null,
122 |       ...finalObject,
123 |     });
124 |
125 |     setStreaming(false);
126 |   };
127 |
128 |   const filters = {
129 |     q,
130 |     end,
131 |     start,
132 |     statuses,
133 |     customers,
134 |   };
135 |
136 |   const hasValidFilters = Object.values(filters).some(
137 |     (value) => value !== null,
138 |   );
139 |
140 |   return (
141 |     <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
142 |       <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0 items-start sm:items-center w-full">
143 |         <form
144 |           className="relative w-full sm:w-auto"
145 |           onSubmit={(e) => {
146 |             e.preventDefault();
147 |             handleSubmit();
148 |           }}
149 |         >
150 |           <Icons.Search className="absolute pointer-events-none left-3 top-[11px]" />
151 |           <Input
152 |             ref={inputRef}
153 |             placeholder="Search or filter"
154 |             className="pl-9 w-full sm:w-[350px] pr-8"
155 |             value={prompt}
156 |             onChange={handleSearch}
157 |             autoComplete="off"
158 |             autoCapitalize="none"
159 |             autoCorrect="off"
160 |             spellCheck="false"
161 |           />
162 |
163 |           <DropdownMenuTrigger asChild>
164 |             <button
165 |               onClick={() => setIsOpen((prev) => !prev)}
166 |               type="button"
167 |               className={cn(
168 |                 "absolute z-10 right-3 top-[10px] opacity-50 transition-opacity duration-300 hover:opacity-100",
169 |                 hasValidFilters && "opacity-100",
170 |                 isOpen && "opacity-100",
171 |               )}
172 |             >
173 |               <Icons.Filter />
174 |             </button>
175 |           </DropdownMenuTrigger>
[TRUNCATED]
```

apps/dashboard/src/components/invoice-status.tsx
```
1 | "use client";
2 |
3 | import { useI18n } from "@/locales/client";
4 | import { cn } from "@midday/ui/cn";
5 | import { Skeleton } from "@midday/ui/skeleton";
6 |
7 | export function InvoiceStatus({
8 |   status,
9 |   isLoading,
10 |   className,
11 | }: {
12 |   status: "draft" | "overdue" | "paid" | "unpaid" | "canceled";
13 |   isLoading?: boolean;
14 |   className?: string;
15 | }) {
16 |   const t = useI18n();
17 |
18 |   if (isLoading) {
19 |     return <Skeleton className="w-24 h-6 rounded-full" />;
20 |   }
21 |
22 |   return (
23 |     <div
24 |       className={cn(
25 |         "px-2 py-0.5 rounded-full cursor-default font-mono inline-flex max-w-full text-[11px]",
26 |         (status === "draft" || status === "canceled") &&
27 |           "text-[#878787] bg-[#F2F1EF] text-[10px] dark:text-[#878787] dark:bg-[#1D1D1D]",
28 |         status === "overdue" &&
29 |           "bg-[#FFD02B]/10 text-[#FFD02B] dark:bg-[#FFD02B]/10 dark:text-[#FFD02B]",
30 |         status === "paid" &&
31 |           "text-[#00C969] bg-[#DDF1E4] dark:text-[#00C969] dark:bg-[#00C969]/10",
32 |         status === "unpaid" &&
33 |           "text-[#1D1D1D] bg-[#878787]/10 dark:text-[#F5F5F3] dark:bg-[#F5F5F3]/10",
34 |         className,
35 |       )}
36 |     >
37 |       <span className="line-clamp-1 truncate inline-block">
38 |         {t(`invoice_status.${status}`)}
39 |       </span>
40 |     </div>
41 |   );
42 | }
```

apps/dashboard/src/components/invoice-successful.tsx
```
1 | import { formatEditorContent } from "@midday/invoice/format-to-html";
2 | import { Button } from "@midday/ui/button";
3 | import { Icons } from "@midday/ui/icons";
4 | import { format } from "date-fns";
5 | import { motion } from "framer-motion";
6 | import { CopyInput } from "./copy-input";
7 | import { FormatAmount } from "./format-amount";
8 | import type { Invoice } from "./tables/invoices/columns";
9 |
10 | type Props = {
11 |   invoice: Invoice;
12 | };
13 |
14 | function CustomerDetails({ content }: { content: JSON }) {
15 |   return (
16 |     <div className="font-mono text-[#878787]">
17 |       {formatEditorContent(content)}
18 |     </div>
19 |   );
20 | }
21 |
22 | export function InvoiceSuccessful({ invoice }: Props) {
23 |   return (
24 |     <div className="bg-[#F2F2F2] dark:bg-background p-6 relative">
25 |       <motion.div
26 |         initial={{ opacity: 0 }}
27 |         animate={{ opacity: 1 }}
28 |         transition={{ duration: 0.3 }}
29 |         className="flex items-center justify-between mb-6"
30 |       >
31 |         <div className="flex space-x-1 items-center">
32 |           <div className="flex items-center">
33 |             <span className="text-[11px] text-[#878787] font-mono">
34 |               {invoice.template.invoice_no_label}
35 |             </span>
36 |             <span className="text-[11px] text-[#878787] font-mono">:</span>
37 |           </div>
38 |
39 |           <span className="font-mono text-[11px]">
40 |             {invoice.invoice_number}
41 |           </span>
42 |         </div>
43 |
44 |         <div className="flex space-x-1 items-center">
45 |           <div className="flex items-center">
46 |             <span className="text-[11px] text-[#878787] font-mono">
47 |               {invoice.template.due_date_label}
48 |             </span>
49 |             <span className="text-[11px] text-[#878787] font-mono">:</span>
50 |           </div>
51 |
52 |           <span className="font-mono text-[11px]">
53 |             {format(new Date(invoice.due_date), invoice.template.date_format)}
54 |           </span>
55 |         </div>
56 |       </motion.div>
57 |
58 |       <motion.div
59 |         initial={{ opacity: 0 }}
60 |         animate={{ opacity: 1 }}
61 |         transition={{ delay: 0.2, duration: 0.3 }}
62 |       >
63 |         <span className="text-[11px] font-mono">
64 |           {invoice.template.customer_label}
65 |         </span>
66 |         <CustomerDetails content={invoice.customer_details} />
67 |       </motion.div>
68 |
69 |       <motion.div
70 |         initial={{ opacity: 0 }}
71 |         animate={{ opacity: 1 }}
72 |         transition={{ delay: 0.4, duration: 0.3 }}
73 |         className="flex items-center justify-between mt-10 border-b border-border border-dashed pb-4"
74 |       >
75 |         <span className="text-[11px] text-[#878787] font-mono">
76 |           {invoice.template.total_summary_label}
77 |         </span>
78 |
79 |         <span className="font-mono text-xl">
80 |           <FormatAmount amount={invoice.amount} currency={invoice.currency} />
81 |         </span>
82 |       </motion.div>
83 |
84 |       <motion.div
85 |         initial={{ opacity: 0 }}
86 |         animate={{ opacity: 1 }}
87 |         transition={{ delay: 0.4, duration: 0.3 }}
88 |         className="flex flex-col space-y-6 mt-10 mb-6"
89 |       >
90 |         <h2>Details</h2>
91 |
92 |         {invoice.sent_to && (
93 |           <div className="flex flex-col space-y-1">
94 |             <span className="text-[11px] text-[#878787] font-mono">
95 |               Invoice sent to
96 |             </span>
97 |             <span className="text-sm">{invoice.sent_to}</span>
98 |           </div>
99 |         )}
100 |
101 |         <div>
102 |           <span className="text-[11px] text-[#878787] font-mono">
103 |             Share link
104 |           </span>
105 |           <div className="flex w-full gap-2 mt-1">
106 |             <div className="flex-1 min-w-0">
107 |               <CopyInput
108 |                 value={`${window.location.origin}/i/${invoice.token}`}
109 |               />
110 |             </div>
111 |
112 |             <a
113 |               href={`/api/download/invoice?id=${invoice.id}&size=${invoice.template.size}`}
114 |               download
115 |             >
116 |               <Button
117 |                 variant="secondary"
118 |                 className="size-[40px] hover:bg-secondary shrink-0"
119 |               >
120 |                 <div>
121 |                   <Icons.Download className="size-4" />
122 |                 </div>
123 |               </Button>
124 |             </a>
125 |           </div>
126 |         </div>
127 |       </motion.div>
128 |
129 |       <motion.div
130 |         initial={{ opacity: 0 }}
131 |         animate={{ opacity: 1 }}
132 |         transition={{ delay: 0.4, duration: 0.3 }}
133 |         className="flex flex-wrap gap-3 absolute -bottom-[15px] left-0 right-0 w-full justify-center"
134 |       >
135 |         {Array.from({ length: 10 }).map((_, index) => (
136 |           <div
137 |             key={index.toString()}
[TRUNCATED]
```

apps/dashboard/src/components/invoice-summary.tsx
```
1 | "use client";
2 |
3 | import { useI18n } from "@/locales/client";
4 | import { Card, CardContent, CardHeader, CardTitle } from "@midday/ui/card";
5 | import { cn } from "@midday/ui/cn";
6 | import { Skeleton } from "@midday/ui/skeleton";
7 | import { useState } from "react";
8 | import { AnimatedNumber } from "./animated-number";
9 |
10 | type Props = {
11 |   data: any[];
12 |   totalInvoiceCount: number;
13 |   defaultCurrency: string;
14 |   title: string;
15 |   locale: string;
16 | };
17 |
18 | export function InvoiceSummarySkeleton() {
19 |   return (
20 |     <Card>
21 |       <CardHeader className="pb-2">
22 |         <CardTitle>
23 |           <Skeleton className="h-8 w-32" />
24 |         </CardTitle>
25 |       </CardHeader>
26 |
27 |       <CardContent>
28 |         <div className="flex flex-col gap-2">
29 |           <Skeleton className="h-5 w-16" />
30 |           <Skeleton className="h-4 w-24" />
31 |         </div>
32 |       </CardContent>
33 |     </Card>
34 |   );
35 | }
36 |
37 | export function InvoiceSummary({
38 |   data,
39 |   totalInvoiceCount,
40 |   defaultCurrency,
41 |   title,
42 | }: Props) {
43 |   const t = useI18n();
44 |   const [activeIndex, setActiveIndex] = useState(0);
45 |
46 |   const dataWithDefaultCurrency = data.length
47 |     ? data
48 |     : [{ currency: defaultCurrency, total_amount: 0 }];
49 |
50 |   const item = dataWithDefaultCurrency[activeIndex];
51 |
52 |   return (
53 |     <Card>
54 |       <CardHeader className="pb-2 relative">
55 |         <CardTitle className="font-mono font-medium text-2xl">
56 |           <AnimatedNumber
57 |             key={item.currency}
58 |             value={item.total_amount}
59 |             currency={item.currency}
60 |             maximumFractionDigits={0}
61 |             minimumFractionDigits={0}
62 |           />
63 |
64 |           {dataWithDefaultCurrency.length > 1 && (
65 |             <div className="flex space-x-2 top-[63px] absolute">
66 |               {dataWithDefaultCurrency.map((item, idx) => (
67 |                 <button
68 |                   type="button"
69 |                   key={item.currency}
70 |                   onMouseEnter={() => setActiveIndex(idx)}
71 |                   onClick={() => setActiveIndex(idx)}
72 |                   className={cn(
73 |                     "w-[10px] h-[3px] bg-[#1D1D1D] dark:bg-[#D9D9D9] opacity-30 transition-all",
74 |                     idx === activeIndex && "opacity-100",
75 |                   )}
76 |                 />
77 |               ))}
78 |             </div>
79 |           )}
80 |         </CardTitle>
81 |       </CardHeader>
82 |
83 |       <CardContent>
84 |         <div className="flex flex-col gap-2">
85 |           <div>{title}</div>
86 |           <div className="text-sm text-muted-foreground">
87 |             {t("invoice_count", {
88 |               count: totalInvoiceCount ?? 0,
89 |             })}
90 |           </div>
91 |         </div>
92 |       </CardContent>
93 |     </Card>
94 |   );
95 | }
```

apps/dashboard/src/components/invoice-toolbar.tsx
```
1 | "use client";
2 |
3 | import { useInvoiceParams } from "@/hooks/use-invoice-params";
4 | import { Button } from "@midday/ui/button";
5 | import {
6 |   Tooltip,
7 |   TooltipContent,
8 |   TooltipProvider,
9 |   TooltipTrigger,
10 | } from "@midday/ui/tooltip";
11 | import { motion } from "framer-motion";
12 | import {
13 |   MdChatBubbleOutline,
14 |   MdContentCopy,
15 |   MdOutlineFileDownload,
16 | } from "react-icons/md";
17 | import { InvoiceViewers } from "./invoice-viewers";
18 |
19 | export type Customer = {
20 |   name: string;
21 |   website?: string;
22 | };
23 |
24 | type Props = {
25 |   id: string;
26 |   size: "letter" | "a4";
27 |   customer: Customer;
28 |   viewedAt?: string;
29 | };
30 |
31 | export default function InvoiceToolbar({
32 |   id,
33 |   size,
34 |   customer,
35 |   viewedAt,
36 | }: Props) {
37 |   const { setParams } = useInvoiceParams();
38 |
39 |   const handleCopyLink = () => {
40 |     const url = window.location.href;
41 |     navigator.clipboard.writeText(url);
42 |   };
43 |
44 |   return (
45 |     <motion.div
46 |       className="fixed inset-x-0 -bottom-1 flex justify-center"
47 |       initial={{ opacity: 0, filter: "blur(8px)", y: 0 }}
48 |       animate={{ opacity: 1, filter: "blur(0px)", y: -24 }}
49 |       transition={{ type: "spring", stiffness: 300, damping: 25 }}
50 |     >
51 |       <div className="backdrop-filter backdrop-blur-lg dark:bg-[#1A1A1A]/80 bg-[#F6F6F3]/80 rounded-full pl-2 pr-4 py-3 h-10 flex items-center justify-center border-[0.5px] border-border">
52 |         <TooltipProvider delayDuration={0}>
53 |           <Tooltip>
54 |             <TooltipTrigger asChild>
55 |               <a href={`/api/download/invoice?id=${id}&size=${size}`} download>
56 |                 <Button
57 |                   variant="ghost"
58 |                   size="icon"
59 |                   className="rounded-full size-8"
60 |                 >
61 |                   <MdOutlineFileDownload className="size-[18px]" />
62 |                 </Button>
63 |               </a>
64 |             </TooltipTrigger>
65 |             <TooltipContent
66 |               sideOffset={15}
67 |               className="text-[10px] px-2 py-1 rounded-sm font-medium"
68 |             >
69 |               <p>Download</p>
70 |             </TooltipContent>
71 |           </Tooltip>
72 |         </TooltipProvider>
73 |
74 |         <TooltipProvider delayDuration={0}>
75 |           <Tooltip>
76 |             <TooltipTrigger asChild>
77 |               <Button
78 |                 variant="ghost"
79 |                 size="icon"
80 |                 className="rounded-full size-8"
81 |                 onClick={handleCopyLink}
82 |               >
83 |                 <MdContentCopy />
84 |               </Button>
85 |             </TooltipTrigger>
86 |             <TooltipContent
87 |               sideOffset={15}
88 |               className="text-[10px] px-2 py-1 rounded-sm font-medium"
89 |             >
90 |               <p>Copy link</p>
91 |             </TooltipContent>
92 |           </Tooltip>
93 |         </TooltipProvider>
94 |
95 |         {/* <TooltipProvider delayDuration={0}>
96 |           <Tooltip>
97 |             <TooltipTrigger asChild>
98 |               <Button
99 |                 variant="ghost"
100 |                 size="icon"
101 |                 className="rounded-full size-8 relative"
102 |                 onClick={() => setParams({ type: "comments", invoiceId: id })}
103 |               >
104 |                 <div className="rounded-full size-1 absolute bg-[#FFD02B] right-[3px] top-[3px] ring-2 ring-background">
105 |                   <div className="absolute inset-0 rounded-full bg-[#FFD02B] animate-[ping_1s_ease-in-out_5]" />
106 |                   <div className="absolute inset-0 rounded-full bg-[#FFD02B] animate-[pulse_1s_ease-in-out_5] opacity-75" />
107 |                   <div className="absolute inset-0 rounded-full bg-[#FFD02B] animate-[pulse_1s_ease-in-out_5] opacity-50" />
108 |                 </div>
109 |                 <MdChatBubbleOutline />
110 |               </Button>
111 |             </TooltipTrigger>
112 |             <TooltipContent
113 |               sideOffset={15}
114 |               className="text-[10px] px-2 py-1 rounded-sm font-medium"
115 |             >
116 |               <p>Comment</p>
117 |             </TooltipContent>
118 |           </Tooltip>
119 |         </TooltipProvider> */}
120 |
121 |         <InvoiceViewers customer={customer} viewedAt={viewedAt} />
122 |       </div>
123 |     </motion.div>
124 |   );
125 | }
```

apps/dashboard/src/components/invoice-viewers.tsx
```
1 | "use client";
2 |
3 | import { formatRelativeTime } from "@/utils/format";
4 | import { createClient } from "@midday/supabase/client";
5 | import { AnimatedSizeContainer } from "@midday/ui/animated-size-container";
6 | import {
7 |   Avatar,
8 |   AvatarFallback,
9 |   AvatarImage,
10 |   AvatarImageNext,
11 | } from "@midday/ui/avatar";
12 | import { Separator } from "@midday/ui/separator";
13 | import {
14 |   Tooltip,
15 |   TooltipContent,
16 |   TooltipProvider,
17 |   TooltipTrigger,
18 | } from "@midday/ui/tooltip";
19 | import { motion } from "framer-motion";
20 | import { useEffect, useState } from "react";
21 | import type { Customer } from "./invoice-toolbar";
22 |
23 | interface User {
24 |   id: string;
25 |   avatar_url: string | null;
26 |   full_name: string | null;
27 | }
28 |
29 | type Props = {
30 |   customer: Customer;
31 |   viewedAt: string;
32 | };
33 |
34 | export function InvoiceViewers({ customer, viewedAt }: Props) {
35 |   const [currentUser, setCurrentUser] = useState<User | null>(null);
36 |   const supabase = createClient();
37 |
38 |   useEffect(() => {
39 |     async function fetchCurrentUser() {
40 |       const {
41 |         data: { user },
42 |       } = await supabase.auth.getUser();
43 |       if (user) {
44 |         setCurrentUser({
45 |           id: user.id,
46 |           avatar_url: user.user_metadata.avatar_url,
47 |           full_name: user.user_metadata.full_name,
48 |         });
49 |       }
50 |     }
51 |
52 |     fetchCurrentUser();
53 |   }, []);
54 |
55 |   if (!currentUser) {
56 |     return null;
57 |   }
58 |
59 |   return (
60 |     <AnimatedSizeContainer width>
61 |       <motion.div
62 |         className="flex items-center"
63 |         initial={{ width: 0, opacity: 0 }}
64 |         animate={{ width: "auto", opacity: 1 }}
65 |         transition={{ duration: 0.3, ease: "easeInOut", delay: 0.5 }}
66 |       >
67 |         <Separator orientation="vertical" className="mr-3 ml-2 h-4" />
68 |
69 |         {currentUser && (
70 |           <div className="mr-2">
71 |             <TooltipProvider delayDuration={0}>
72 |               <Tooltip>
73 |                 <TooltipTrigger asChild>
74 |                   <Avatar className="size-5 object-contain border border-border">
75 |                     <AvatarImageNext
76 |                       src={currentUser.avatar_url}
77 |                       alt={currentUser.full_name ?? ""}
78 |                       width={20}
79 |                       height={20}
80 |                     />
81 |                     <AvatarFallback className="text-[9px] font-medium">
82 |                       {currentUser.full_name?.[0]}
83 |                     </AvatarFallback>
84 |                   </Avatar>
85 |                 </TooltipTrigger>
86 |                 <TooltipContent
87 |                   sideOffset={20}
88 |                   className="text-[10px] px-2 py-1 rounded-sm font-medium"
89 |                 >
90 |                   <p>just now</p>
91 |                 </TooltipContent>
92 |               </Tooltip>
93 |             </TooltipProvider>
94 |           </div>
95 |         )}
96 |
97 |         {customer?.name && (
98 |           <TooltipProvider delayDuration={0}>
99 |             <Tooltip>
100 |               <TooltipTrigger asChild>
101 |                 <Avatar className="size-5 object-contain border border-border">
102 |                   {customer?.website && (
103 |                     <AvatarImageNext
104 |                       src={`https://img.logo.dev/${customer.website}?token=pk_X-1ZO13GSgeOoUrIuJ6GMQ&size=60`}
105 |                       alt={`${customer.name} logo`}
106 |                       width={20}
107 |                       height={20}
108 |                       quality={100}
109 |                     />
110 |                   )}
111 |                   <AvatarFallback className="text-[9px] font-medium">
112 |                     {customer.name?.[0]}
113 |                   </AvatarFallback>
114 |                 </Avatar>
115 |               </TooltipTrigger>
116 |
117 |               <TooltipContent
118 |                 sideOffset={20}
119 |                 className="text-[10px] px-2 py-1 rounded-sm font-medium"
120 |               >
121 |                 {viewedAt
122 |                   ? formatRelativeTime(new Date(viewedAt))
123 |                   : "Not viewed"}
124 |               </TooltipContent>
125 |             </Tooltip>
126 |           </TooltipProvider>
127 |         )}
128 |       </motion.div>
129 |     </AnimatedSizeContainer>
130 |   );
131 | }
```

apps/dashboard/src/components/invoices-open.tsx
```
1 | import { getInvoiceSummary } from "@midday/supabase/cached-queries";
2 | import Link from "next/link";
3 | import { InvoiceSummary } from "./invoice-summary";
4 |
5 | type Props = {
6 |   defaultCurrency: string;
7 | };
8 |
9 | export async function InvoicesOpen({ defaultCurrency }: Props) {
10 |   const { data } = await getInvoiceSummary();
11 |   const totalInvoiceCount = data?.reduce(
12 |     (acc, curr) => acc + (curr.invoice_count ?? 0),
13 |     0,
14 |   );
15 |
16 |   return (
17 |     <Link
18 |       href="/invoices?statuses=draft,overdue,unpaid"
19 |       className="hidden sm:block"
20 |     >
21 |       <InvoiceSummary
22 |         data={data}
23 |         totalInvoiceCount={totalInvoiceCount}
24 |         defaultCurrency={defaultCurrency}
25 |         title="Open"
26 |       />
27 |     </Link>
28 |   );
29 | }
```

apps/dashboard/src/components/invoices-overdue.tsx
```
1 | import { getInvoiceSummary } from "@midday/supabase/cached-queries";
2 | import Link from "next/link";
3 | import { InvoiceSummary } from "./invoice-summary";
4 |
5 | type Props = {
6 |   defaultCurrency: string;
7 | };
8 |
9 | export async function InvoicesOverdue({ defaultCurrency }: Props) {
10 |   const { data } = await getInvoiceSummary({ status: "overdue" });
11 |
12 |   const totalInvoiceCount = data?.at(0)?.invoice_count;
13 |
14 |   return (
15 |     <Link href="/invoices?statuses=overdue" className="hidden sm:block">
16 |       <InvoiceSummary
17 |         data={data}
18 |         totalInvoiceCount={totalInvoiceCount}
19 |         defaultCurrency={defaultCurrency}
20 |         title="Overdue"
21 |       />
22 |     </Link>
23 |   );
24 | }
```

apps/dashboard/src/components/invoices-paid.tsx
```
1 | import { getInvoiceSummary } from "@midday/supabase/cached-queries";
2 | import Link from "next/link";
3 | import { InvoiceSummary } from "./invoice-summary";
4 |
5 | type Props = {
6 |   defaultCurrency: string;
7 | };
8 |
9 | export async function InvoicesPaid({ defaultCurrency }: Props) {
10 |   const { data } = await getInvoiceSummary({ status: "paid" });
11 |
12 |   const totalInvoiceCount = data?.at(0)?.invoice_count;
13 |
14 |   return (
15 |     <Link href="/invoices?statuses=paid" className="hidden sm:block">
16 |       <InvoiceSummary
17 |         data={data}
18 |         totalInvoiceCount={totalInvoiceCount}
19 |         defaultCurrency={defaultCurrency}
20 |         title="Paid"
21 |       />
22 |     </Link>
23 |   );
24 | }
```

apps/dashboard/src/components/loading-transactions-event.tsx
```
1 | import { useInitialConnectionStatus } from "@/hooks/use-initial-connection-status";
2 | import { Button } from "@midday/ui/button";
3 | import { cn } from "@midday/ui/cn";
4 | import { useTheme } from "next-themes";
5 | import dynamic from "next/dynamic";
6 | import { useEffect, useState } from "react";
7 |
8 | const Lottie = dynamic(() => import("lottie-react"), {
9 |   ssr: false,
10 | });
11 |
12 | type Props = {
13 |   accessToken?: string;
14 |   runId?: string;
15 |   setRunId: (runId?: string) => void;
16 |   onClose: () => void;
17 |   setActiveTab: (value: "support" | "loading" | "select-accounts") => void;
18 | };
19 |
20 | export function LoadingTransactionsEvent({
21 |   accessToken,
22 |   runId,
23 |   setRunId,
24 |   onClose,
25 |   setActiveTab,
26 | }: Props) {
27 |   const [step, setStep] = useState(1);
28 |   const { resolvedTheme } = useTheme();
29 |
30 |   const { status } = useInitialConnectionStatus({
31 |     runId,
32 |     accessToken,
33 |   });
34 |
35 |   useEffect(() => {
36 |     if (status === "SYNCING") {
37 |       setStep(2);
38 |     }
39 |
40 |     if (status === "COMPLETED") {
41 |       setStep(3);
42 |
43 |       setTimeout(() => {
44 |         setRunId(undefined);
45 |         setStep(4);
46 |       }, 1000);
47 |     }
48 |   }, [status]);
49 |
50 |   return (
51 |     <div className="w-full">
52 |       <Lottie
53 |         className="mb-6"
54 |         animationData={
55 |           resolvedTheme === "dark"
56 |             ? require("public/assets/setup-animation.json")
57 |             : require("public/assets/setup-animation-dark.json")
58 |         }
59 |         loop={true}
60 |         style={{ width: 50, height: 50 }}
61 |         rendererSettings={{
62 |           preserveAspectRatio: "xMidYMid slice",
63 |         }}
64 |       />
65 |       <h2 className="text-lg font-semibold leading-none tracking-tight mb-2">
66 |         Setting up account
67 |       </h2>
68 |
69 |       <p className="text-sm text-[#878787] mb-8">
70 |         Depending on the bank it can take up to 1 hour to fetch all
71 |         transactions, feel free to close this window and we will notify you when
72 |         it is done.
73 |       </p>
74 |
75 |       <ul className="text-md text-[#878787] space-y-4 transition-all">
76 |         <li
77 |           className={cn(
78 |             "opacity-50 dark:opacity-20",
79 |             step > 0 && "!opacity-100",
80 |           )}
81 |         >
82 |           Connecting bank
83 |           {step === 1 && <span className="loading-ellipsis" />}
84 |         </li>
85 |         <li
86 |           className={cn(
87 |             "opacity-50 dark:opacity-20",
88 |             step > 1 && "!opacity-100",
89 |           )}
90 |         >
91 |           Getting transactions
92 |           {step === 2 && <span className="loading-ellipsis" />}
93 |         </li>
94 |         <li
95 |           className={cn(
96 |             "opacity-50 dark:opacity-20",
97 |             step > 2 && "!opacity-100",
98 |           )}
99 |         >
100 |           Completed
101 |           {step === 3 && <span className="loading-ellipsis" />}
102 |         </li>
103 |       </ul>
104 |
105 |       <div className="w-full mt-12">
106 |         <Button className="w-full" onClick={onClose}>
107 |           Close
108 |         </Button>
109 |
110 |         <div className="flex justify-center mt-4">
111 |           <button
112 |             type="button"
113 |             className="text-xs text-[#878787]"
114 |             onClick={() => setActiveTab("support")}
115 |           >
116 |             Need support
117 |           </button>
118 |         </div>
119 |       </div>
120 |     </div>
121 |   );
122 | }
```

apps/dashboard/src/components/locale-settings.tsx
```
1 | "use client";
2 |
3 | import { updateUserAction } from "@/actions/update-user-action";
4 | import { useI18n } from "@/locales/client";
5 | import { countries } from "@midday/location/countries-intl";
6 | import {
7 |   Card,
8 |   CardContent,
9 |   CardDescription,
10 |   CardHeader,
11 |   CardTitle,
12 | } from "@midday/ui/card";
13 | import { ComboboxDropdown } from "@midday/ui/combobox-dropdown";
14 | import { useOptimisticAction } from "next-safe-action/hooks";
15 |
16 | type Props = {
17 |   locale: string;
18 | };
19 |
20 | export function LocaleSettings({ locale }: Props) {
21 |   const t = useI18n();
22 |
23 |   const { execute, optimisticState } = useOptimisticAction(updateUserAction, {
24 |     currentState: { locale },
25 |     updateFn: (state, newLocale) => {
26 |       return {
27 |         locale: newLocale.locale ?? state.locale,
28 |       };
29 |     },
30 |   });
31 |
32 |   const localeItems = Object.values(countries).map((c, index) => ({
33 |     id: index.toString(),
34 |     label: `${c.name} (${c.default_locale})`,
35 |     value: c.default_locale,
36 |   }));
37 |
38 |   return (
39 |     <Card className="flex justify-between items-center">
40 |       <CardHeader>
41 |         <CardTitle>{t("locale.title")}</CardTitle>
42 |         <CardDescription>{t("locale.description")}</CardDescription>
43 |       </CardHeader>
44 |
45 |       <CardContent>
46 |         <div className="w-[250px]">
47 |           <ComboboxDropdown
48 |             placeholder={t("locale.placeholder")}
49 |             selectedItem={localeItems.find(
50 |               (item) => item.value === optimisticState.locale,
51 |             )}
52 |             searchPlaceholder={t("locale.searchPlaceholder")}
53 |             items={localeItems}
54 |             className="text-xs py-1"
55 |             onSelect={(item) => {
56 |               execute({ locale: item.value });
57 |             }}
58 |           />
59 |         </div>
60 |       </CardContent>
61 |     </Card>
62 |   );
63 | }
```

apps/dashboard/src/components/main-menu.tsx
```
1 | "use client";
2 |
3 | import { updateMenuAction } from "@/actions/update-menu-action";
4 | import { useMenuStore } from "@/store/menu";
5 | import { Button } from "@midday/ui/button";
6 | import { cn } from "@midday/ui/cn";
7 | import { Icons } from "@midday/ui/icons";
8 | import {
9 |   Tooltip,
10 |   TooltipContent,
11 |   TooltipProvider,
12 |   TooltipTrigger,
13 | } from "@midday/ui/tooltip";
14 | import { useClickAway } from "@uidotdev/usehooks";
15 | import { Reorder, motion, useMotionValue } from "framer-motion";
16 | import { useAction } from "next-safe-action/hooks";
17 | import Link from "next/link";
18 | import { usePathname } from "next/navigation";
19 | import { useState } from "react";
20 | import { useLongPress } from "use-long-press";
21 |
22 | const icons = {
23 |   "/": () => <Icons.Overview size={22} />,
24 |   "/transactions": () => <Icons.Transactions size={22} />,
25 |   "/invoices": () => <Icons.Invoice size={22} />,
26 |   "/tracker": () => <Icons.Tracker size={22} />,
27 |   "/customers": () => <Icons.Customers size={22} />,
28 |   "/vault": () => <Icons.Vault size={22} />,
29 |   "/settings": () => <Icons.Settings size={22} />,
30 |   "/apps": () => <Icons.Apps size={22} />,
31 |   "/inbox": () => <Icons.Inbox2 size={22} />,
32 | };
33 |
34 | const defaultItems = [
35 |   {
36 |     path: "/",
37 |     name: "Overview",
38 |   },
39 |   {
40 |     path: "/inbox",
41 |     name: "Inbox",
42 |   },
43 |   {
44 |     path: "/transactions",
45 |     name: "Transactions",
46 |   },
47 |   {
48 |     path: "/invoices",
49 |     name: "Invoices",
50 |   },
51 |   {
52 |     path: "/tracker",
53 |     name: "Tracker",
54 |   },
55 |   {
56 |     path: "/customers",
57 |     name: "Customers",
58 |   },
59 |   {
60 |     path: "/vault",
61 |     name: "Vault",
62 |   },
63 |   {
64 |     path: "/apps",
65 |     name: "Apps",
66 |   },
67 |   {
68 |     path: "/settings",
69 |     name: "Settings",
70 |   },
71 | ];
72 |
73 | interface ItemProps {
74 |   item: { path: string; name: string };
75 |   isActive: boolean;
76 |   isCustomizing: boolean;
77 |   onRemove: (path: string) => void;
78 |   disableRemove: boolean;
79 |   onDragEnd: () => void;
80 |   onSelect?: () => void;
81 | }
82 |
83 | const Item = ({
84 |   item,
85 |   isActive,
86 |   isCustomizing,
87 |   onRemove,
88 |   disableRemove,
89 |   onDragEnd,
90 |   onSelect,
91 | }: ItemProps) => {
92 |   const y = useMotionValue(0);
93 |   const Icon = icons[item.path];
94 |
95 |   return (
96 |     <TooltipProvider delayDuration={70}>
97 |       <Link
98 |         prefetch
99 |         href={item.path}
100 |         onClick={(evt) => {
101 |           if (isCustomizing) {
102 |             evt.preventDefault();
103 |           }
104 |
105 |           onSelect?.();
106 |         }}
107 |         onMouseDown={(evt) => {
108 |           if (isCustomizing) {
109 |             evt.preventDefault();
110 |           }
111 |         }}
112 |       >
113 |         <Tooltip>
114 |           <TooltipTrigger className="w-full">
115 |             <Reorder.Item
116 |               onDragEnd={onDragEnd}
117 |               key={item.path}
118 |               value={item}
119 |               id={item.path}
120 |               style={{ y }}
121 |               layoutRoot
122 |               className={cn(
123 |                 "relative border border-transparent md:w-[45px] h-[45px] flex items-center md:justify-center",
124 |                 "hover:bg-accent hover:border-[#DCDAD2] hover:dark:border-[#2C2C2C]",
125 |                 isActive &&
126 |                   "bg-[#F2F1EF] dark:bg-secondary border-[#DCDAD2] dark:border-[#2C2C2C]",
127 |                 isCustomizing &&
128 |                   "bg-background border-[#DCDAD2] dark:border-[#2C2C2C]",
129 |               )}
130 |             >
131 |               <motion.div
132 |                 className="relative"
133 |                 initial={{ opacity: 1 }}
134 |                 animate={{ opacity: 1 }}
135 |                 exit={{ opacity: 0 }}
136 |               >
137 |                 {!disableRemove && isCustomizing && (
138 |                   <Button
139 |                     onClick={() => onRemove(item.path)}
140 |                     variant="ghost"
141 |                     size="icon"
142 |                     className="absolute -left-4 -top-4 w-4 h-4 p-0 rounded-full bg-border hover:bg-border hover:scale-150 z-10 transition-all"
143 |                   >
144 |                     <Icons.Remove className="w-3 h-3" />
145 |                   </Button>
146 |                 )}
147 |
148 |                 <div
149 |                   className={cn(
150 |                     "flex space-x-3 p-0 items-center pl-2 md:pl-0",
151 |                     isCustomizing &&
152 |                       "animate-[jiggle_0.3s_ease-in-out_infinite] transform-gpu pointer-events-none",
153 |                   )}
154 |                 >
155 |                   <Icon />
156 |                   <span className="flex md:hidden">{item.name}</span>
157 |                 </div>
158 |               </motion.div>
159 |             </Reorder.Item>
160 |           </TooltipTrigger>
161 |           <TooltipContent
162 |             side="left"
163 |             className="px-3 py-1.5 text-xs hidden md:flex"
164 |             sideOffset={10}
165 |           >
166 |             {item.name}
167 |           </TooltipContent>
168 |         </Tooltip>
169 |       </Link>
170 |     </TooltipProvider>
171 |   );
172 | };
173 |
174 | const listVariant = {
175 |   hidden: { opacity: 0 },
[TRUNCATED]
```

apps/dashboard/src/components/manual-accounts.tsx
```
1 | import { BankAccount } from "./bank-account";
2 |
3 | export function ManualAccounts({ data }) {
4 |   return (
5 |     <div className="px-6 pb-6 space-y-6 divide-y">
6 |       {data.map((account) => (
7 |         <BankAccount
8 |           key={account.id}
9 |           id={account.id}
10 |           name={account.name}
11 |           manual={account.manual}
12 |           currency={account.currency}
13 |           type={account.type}
14 |           enabled
15 |           balance={account.balance}
16 |         />
17 |       ))}
18 |     </div>
19 |   );
20 | }
```

apps/dashboard/src/components/markdown.tsx
```
1 | import { type FC, memo } from "react";
2 | import ReactMarkdown, { type Options } from "react-markdown";
3 |
4 | export const MemoizedReactMarkdown: FC<Options> = memo(
5 |   ReactMarkdown,
6 |   (prevProps, nextProps) =>
7 |     prevProps.children === nextProps.children &&
8 |     prevProps.className === nextProps.className
9 | );
```

apps/dashboard/src/components/mfa-list.tsx
```
1 | import { getI18n } from "@/locales/server";
2 | import { createClient } from "@midday/supabase/server";
3 | import { Skeleton } from "@midday/ui/skeleton";
4 | import { format } from "date-fns";
5 | import { RemoveMFAButton } from "./remove-mfa-button";
6 |
7 | export function MFAListSkeleton() {
8 |   return (
9 |     <div className="flex justify-between items-center h-[36px]">
10 |       <Skeleton className="h-4 w-[200px]" />
11 |     </div>
12 |   );
13 | }
14 |
15 | export async function MFAList() {
16 |   const supabase = createClient();
17 |
18 |   const { data } = await supabase.auth.mfa.listFactors();
19 |   const t = await getI18n();
20 |
21 |   return data?.all
22 |     ?.sort((a) => (a.status === "verified" ? -1 : 1))
23 |     .map((factor) => {
24 |       return (
25 |         <div
26 |           key={factor.id}
27 |           className="flex justify-between items-center space-y-4"
28 |         >
29 |           <div>
30 |             <p className="text-sm">
31 |               Added on {format(new Date(factor.created_at), "pppp")}
32 |             </p>
33 |
34 |             <p className="text-xs text-[#606060] mt-0.5">
35 |               {t(`mfa_status.${factor.status}`)}
36 |             </p>
37 |           </div>
38 |
39 |           <RemoveMFAButton factorId={factor.id} />
40 |         </div>
41 |       );
42 |     });
43 | }
```

apps/dashboard/src/components/mfa-settings-list.tsx
```
1 | import { Button } from "@midday/ui/button";
2 | import {
3 |   Card,
4 |   CardContent,
5 |   CardDescription,
6 |   CardFooter,
7 |   CardHeader,
8 |   CardTitle,
9 | } from "@midday/ui/card";
10 | import Link from "next/link";
11 | import { UnenrollMFA } from "./unenroll-mfa";
12 |
13 | export function MfaSettingsList() {
14 |   return (
15 |     <Card>
16 |       <CardHeader>
17 |         <CardTitle>Multi-factor authentication</CardTitle>
18 |         <CardDescription>
19 |           Add an additional layer of security to your account by requiring more
20 |           than just a password to sign in.
21 |         </CardDescription>
22 |       </CardHeader>
23 |
24 |       <CardContent>
25 |         <UnenrollMFA />
26 |       </CardContent>
27 |
28 |       <CardFooter className="flex justify-between">
29 |         <div />
30 |         <Link href="?add=device">
31 |           <Button>Add new device</Button>
32 |         </Link>
33 |       </CardFooter>
34 |     </Card>
35 |   );
36 | }
```

apps/dashboard/src/components/mobile-menu.tsx
```
1 | "use client";
2 |
3 | import { Button } from "@midday/ui/button";
4 | import { Icons } from "@midday/ui/icons";
5 | import { Sheet, SheetContent, SheetTrigger } from "@midday/ui/sheet";
6 | import { useState } from "react";
7 | import { MainMenu } from "./main-menu";
8 |
9 | export function MobileMenu() {
10 |   const [isOpen, setOpen] = useState(false);
11 |
12 |   return (
13 |     <Sheet open={isOpen} onOpenChange={setOpen}>
14 |       <div>
15 |         <Button
16 |           variant="outline"
17 |           size="icon"
18 |           onClick={() => setOpen(true)}
19 |           className="rounded-full w-8 h-8 items-center relative flex md:hidden"
20 |         >
21 |           <Icons.Menu size={16} />
22 |         </Button>
23 |       </div>
24 |       <SheetContent side="left" className="border-none rounded-none -ml-2">
25 |         <div className="ml-2 mb-8">
26 |           <Icons.Logo />
27 |         </div>
28 |
29 |         <MainMenu onSelect={() => setOpen(false)} />
30 |       </SheetContent>
31 |     </Sheet>
32 |   );
33 | }
```

apps/dashboard/src/components/note.tsx
```
1 | import type { UpdateTransactionValues } from "@/actions/schema";
2 | import { Textarea } from "@midday/ui/textarea";
3 | import { useState } from "react";
4 |
5 | type Props = {
6 |   id: string;
7 |   defaultValue: string;
8 |   updateTransaction: (values: UpdateTransactionValues) => void;
9 | };
10 |
11 | export function Note({ id, defaultValue, updateTransaction }: Props) {
12 |   const [value, setValue] = useState(defaultValue);
13 |
14 |   return (
15 |     <Textarea
16 |       defaultValue={defaultValue}
17 |       required
18 |       autoFocus
19 |       placeholder="Note"
20 |       className="min-h-[100px] resize-none"
21 |       onBlur={() => {
22 |         if (value !== defaultValue) {
23 |           updateTransaction({
24 |             id,
25 |             note: value?.length > 0 ? value : null,
26 |           });
27 |         }
28 |       }}
29 |       onChange={(evt) => setValue(evt.target.value)}
30 |     />
31 |   );
32 | }
```

apps/dashboard/src/components/notification-center.tsx
```
1 | "use client";
2 |
3 | import { useNotifications } from "@/hooks/use-notifications";
4 | import { Button } from "@midday/ui/button";
5 | import { Icons } from "@midday/ui/icons";
6 | import { Popover, PopoverContent, PopoverTrigger } from "@midday/ui/popover";
7 | import { ScrollArea } from "@midday/ui/scroll-area";
8 | import { Tabs, TabsContent, TabsList, TabsTrigger } from "@midday/ui/tabs";
9 | import { formatDistanceToNow } from "date-fns";
10 | import Link from "next/link";
11 | import { useEffect, useState } from "react";
12 |
13 | function EmptyState({ description }) {
14 |   return (
15 |     <div className="h-[460px] flex items-center justify-center flex-col space-y-4">
16 |       <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center">
17 |         <Icons.Inbox size={18} />
18 |       </div>
19 |       <p className="text-[#606060] text-sm">{description}</p>
20 |     </div>
21 |   );
22 | }
23 |
24 | function NotificationItem({
25 |   id,
26 |   setOpen,
27 |   description,
28 |   createdAt,
29 |   recordId,
30 |   from,
31 |   to,
32 |   markMessageAsRead,
33 |   type,
34 | }) {
35 |   switch (type) {
36 |     case "transactions":
37 |       return (
38 |         <div className="flex items-between justify-between space-x-4 px-3 py-3 hover:bg-secondary">
39 |           <Link
40 |             className="flex items-between justify-between space-x-4"
41 |             onClick={() => setOpen(false)}
42 |             href={`/transactions?start=${from}&end=${to}`}
43 |           >
44 |             <div>
45 |               <div className="h-9 w-9 flex items-center justify-center space-y-0 border rounded-full">
46 |                 <Icons.Transactions />
47 |               </div>
48 |             </div>
49 |             <div>
50 |               <p className="text-sm">{description}</p>
51 |               <span className="text-xs text-[#606060]">
52 |                 {formatDistanceToNow(new Date(createdAt))} ago
53 |               </span>
54 |             </div>
55 |           </Link>
56 |           {markMessageAsRead && (
57 |             <div>
58 |               <Button
59 |                 size="icon"
60 |                 variant="secondary"
61 |                 className="rounded-full bg-transparent hover:bg-[#1A1A1A]"
62 |                 onClick={() => markMessageAsRead(id)}
63 |               >
64 |                 <Icons.Inventory2 />
65 |               </Button>
66 |             </div>
67 |           )}
68 |         </div>
69 |       );
70 |
71 |     case "inbox":
72 |       return (
73 |         <div className="flex items-between justify-between space-x-4 px-3 py-3 hover:bg-secondary">
74 |           <Link
75 |             className="flex items-between justify-between space-x-4 "
76 |             onClick={() => setOpen(false)}
77 |             href={`/inbox?id=${recordId}`}
78 |           >
79 |             <div>
80 |               <div className="h-9 w-9 flex items-center justify-center space-y-0 border rounded-full">
81 |                 <Icons.Email />
82 |               </div>
83 |             </div>
84 |             <div>
85 |               <p className="text-sm">{description}</p>
86 |               <span className="text-xs text-[#606060]">
87 |                 {formatDistanceToNow(new Date(createdAt))} ago
88 |               </span>
89 |             </div>
90 |           </Link>
91 |           {markMessageAsRead && (
92 |             <div>
93 |               <Button
94 |                 size="icon"
95 |                 variant="secondary"
96 |                 className="rounded-full bg-transparent hover:bg-[#1A1A1A]"
97 |                 onClick={() => markMessageAsRead(id)}
98 |               >
99 |                 <Icons.Inventory2 />
100 |               </Button>
101 |             </div>
102 |           )}
103 |         </div>
104 |       );
105 |
106 |     case "match":
107 |       return (
108 |         <div className="flex items-between justify-between space-x-4 px-3 py-3 hover:bg-secondary">
109 |           <Link
110 |             className="flex items-between justify-between space-x-4 "
111 |             onClick={() => setOpen(false)}
112 |             href={`/transactions?id=${recordId}`}
113 |           >
114 |             <div>
115 |               <div className="h-9 w-9 flex items-center justify-center space-y-0 border rounded-full">
116 |                 <Icons.Match />
117 |               </div>
118 |             </div>
119 |             <div>
120 |               <p className="text-sm">{description}</p>
121 |               <span className="text-xs text-[#606060]">
122 |                 {formatDistanceToNow(new Date(createdAt))} ago
123 |               </span>
124 |             </div>
125 |           </Link>
126 |           {markMessageAsRead && (
127 |             <div>
128 |               <Button
129 |                 size="icon"
130 |                 variant="secondary"
131 |                 className="rounded-full bg-transparent hover:bg-[#1A1A1A]"
132 |                 onClick={() => markMessageAsRead(id)}
133 |               >
134 |                 <Icons.Inventory2 />
135 |               </Button>
136 |             </div>
137 |           )}
138 |         </div>
139 |       );
140 |
141 |     case "invoice":
142 |       return (
143 |         <div className="flex items-between justify-between space-x-4 px-3 py-3 hover:bg-secondary">
144 |           <Link
145 |             className="flex items-between justify-between space-x-4 "
[TRUNCATED]
```

apps/dashboard/src/components/notification-setting.tsx
```
1 | "use client";
2 |
3 | import { updateSubscriberPreferenceAction } from "@/actions/update-subscriber-preference-action";
4 | import { useI18n } from "@/locales/client";
5 | import { Label } from "@midday/ui/label";
6 | import { Switch } from "@midday/ui/switch";
7 | import { useOptimisticAction } from "next-safe-action/hooks";
8 |
9 | type Props = {
10 |   id: string;
11 |   name: string;
12 |   enabled: boolean;
13 |   subscriberId: string;
14 |   teamId: string;
15 |   type: string;
16 | };
17 |
18 | export function NotificationSetting({
19 |   id,
20 |   name,
21 |   enabled,
22 |   subscriberId,
23 |   teamId,
24 |   type,
25 | }: Props) {
26 |   const t = useI18n();
27 |   const { execute, optimisticState } = useOptimisticAction(
28 |     updateSubscriberPreferenceAction,
29 |     {
30 |       currentState: { enabled },
31 |       updateFn: (state) => {
32 |         return {
33 |           ...state,
34 |           enabled: !state.enabled,
35 |         };
36 |       },
37 |     },
38 |   );
39 |
40 |   const onChange = () => {
41 |     execute({
42 |       templateId: id,
43 |       type,
44 |       revalidatePath: "/settings/notifications",
45 |       subscriberId,
46 |       teamId,
47 |       enabled: !enabled,
48 |     });
49 |   };
50 |
51 |   return (
52 |     <div className="flex flex-row items-center justify-between border-b-[1px] pb-4 mb-4">
53 |       <div className="space-y-0.5">
54 |         <Label htmlFor={id}>{name}</Label>
55 |         <p className="text-sm text-[#606060]">
56 |           {/* Replace all spaces with a dot to match the translation key */}
57 |           {t(`notifications.${name.toLowerCase().replaceAll(" ", ".")}`)}
58 |         </p>
59 |       </div>
60 |       <Switch
61 |         id={id}
62 |         checked={optimisticState.enabled}
63 |         onCheckedChange={onChange}
64 |       />
65 |     </div>
66 |   );
67 | }
```

apps/dashboard/src/components/notification-settings.tsx
```
1 | import { getSubscriberPreferences } from "@midday/notification";
2 | import { getUser } from "@midday/supabase/cached-queries";
3 | import { Skeleton } from "@midday/ui/skeleton";
4 | import { NotificationSetting } from "./notification-setting";
5 |
6 | export function NotificationSettingsSkeleton() {
7 |   return [...Array(2)].map((_, index) => (
8 |     <Skeleton key={index.toString()} className="h-4 w-[25%] mb-3" />
9 |   ));
10 | }
11 |
12 | export async function NotificationSettings() {
13 |   const { data: userData } = await getUser();
14 |   const { data: subscriberPreferences } = await getSubscriberPreferences({
15 |     subscriberId: userData.id,
16 |     teamId: userData.team_id,
17 |   });
18 |
19 |   const inAppSettings = subscriberPreferences
20 |     ?.filter((setting) =>
21 |       Object.keys(setting.preference.channels).includes("in_app"),
22 |     )
23 |     .map((setting) => {
24 |       return (
25 |         <NotificationSetting
26 |           key={setting.template._id}
27 |           id={setting.template._id}
28 |           name={setting.template.name}
29 |           enabled={setting.preference.channels?.in_app}
30 |           subscriberId={userData.id}
31 |           teamId={userData.team_id}
32 |           type="in_app"
33 |         />
34 |       );
35 |     });
36 |
37 |   const emailSettings = subscriberPreferences
38 |     ?.filter((setting) =>
39 |       Object.keys(setting.preference.channels).includes("email"),
40 |     )
41 |     .map((setting) => {
42 |       return (
43 |         <NotificationSetting
44 |           key={setting.template._id}
45 |           id={setting.template._id}
46 |           name={setting.template.name}
47 |           enabled={setting.preference.channels?.email}
48 |           subscriberId={userData.id}
49 |           teamId={userData.team_id}
50 |           type="email"
51 |         />
52 |       );
53 |     });
54 |
55 |   return (
56 |     <div className="flex space-y-4 flex-col">
57 |       <div>
58 |         <h2 className="mb-2">In-App Notifications</h2>
59 |         {inAppSettings}
60 |       </div>
61 |
62 |       <div>
63 |         <h2 className="mb-2">Email Notifications</h2>
64 |         {emailSettings}
65 |       </div>
66 |     </div>
67 |   );
68 | }
```

apps/dashboard/src/components/notifications-settings-list.tsx
```
1 | import {
2 |   Card,
3 |   CardContent,
4 |   CardDescription,
5 |   CardHeader,
6 |   CardTitle,
7 | } from "@midday/ui/card";
8 | import { ErrorBoundary } from "next/dist/client/components/error-boundary";
9 | import { Suspense } from "react";
10 | import { ErrorFallback } from "./error-fallback";
11 | import {
12 |   NotificationSettings,
13 |   NotificationSettingsSkeleton,
14 | } from "./notification-settings";
15 |
16 | export async function NotificationsSettingsList() {
17 |   return (
18 |     <Card>
19 |       <CardHeader>
20 |         <CardTitle>Notifications</CardTitle>
21 |         <CardDescription>
22 |           Manage your personal notification settings for this team.
23 |         </CardDescription>
24 |       </CardHeader>
25 |
26 |       <CardContent>
27 |         <ErrorBoundary errorComponent={ErrorFallback}>
28 |           <Suspense fallback={<NotificationSettingsSkeleton />}>
29 |             <NotificationSettings />
30 |           </Suspense>
31 |         </ErrorBoundary>
32 |       </CardContent>
33 |     </Card>
34 |   );
35 | }
```

apps/dashboard/src/components/open-customer-sheet.tsx
```
1 | "use client";
2 |
3 | import { useCustomerParams } from "@/hooks/use-customer-params";
4 | import { useInvoiceParams } from "@/hooks/use-invoice-params";
5 | import { Button } from "@midday/ui/button";
6 | import { Icons } from "@midday/ui/icons";
7 |
8 | export function OpenCustomerSheet() {
9 |   const { setParams } = useCustomerParams();
10 |
11 |   return (
12 |     <div>
13 |       <Button
14 |         variant="outline"
15 |         size="icon"
16 |         onClick={() => setParams({ createCustomer: true })}
17 |       >
18 |         <Icons.Add />
19 |       </Button>
20 |     </div>
21 |   );
22 | }
```

apps/dashboard/src/components/open-invoice-sheet.tsx
```
1 | "use client";
2 |
3 | import { useInvoiceParams } from "@/hooks/use-invoice-params";
4 | import { Button } from "@midday/ui/button";
5 | import { Icons } from "@midday/ui/icons";
6 |
7 | export function OpenInvoiceSheet() {
8 |   const { setParams } = useInvoiceParams();
9 |
10 |   return (
11 |     <div>
12 |       <Button
13 |         variant="outline"
14 |         size="icon"
15 |         onClick={() => setParams({ type: "create" })}
16 |       >
17 |         <Icons.Add />
18 |       </Button>
19 |     </div>
20 |   );
21 | }
```

apps/dashboard/src/components/open-tracker-sheet.tsx
```
1 | "use client";
2 |
3 | import { useTrackerParams } from "@/hooks/use-tracker-params";
4 | import { Button } from "@midday/ui/button";
5 | import { Icons } from "@midday/ui/icons";
6 |
7 | export function OpenTrackerSheet() {
8 |   const { setParams } = useTrackerParams();
9 |
10 |   return (
11 |     <div>
12 |       <Button
13 |         variant="outline"
14 |         size="icon"
15 |         onClick={() => setParams({ create: true })}
16 |       >
17 |         <Icons.Add />
18 |       </Button>
19 |     </div>
20 |   );
21 | }
```

apps/dashboard/src/components/open-url.tsx
```
1 | "use client";
2 |
3 | import { cn } from "@midday/ui/cn";
4 | import { platform } from "@todesktop/client-core";
5 | import { isDesktopApp } from "@todesktop/client-core/platform/todesktop";
6 |
7 | export function OpenURL({
8 |   href,
9 |   children,
10 |   className,
11 | }: { href: string; children: React.ReactNode; className?: string }) {
12 |   const handleOnClick = () => {
13 |     if (isDesktopApp()) {
14 |       platform.os.openURL(href);
15 |     } else {
16 |       window.open(href, "_blank");
17 |     }
18 |   };
19 |
20 |   return (
21 |     <span onClick={handleOnClick} className={cn("cursor-pointer", className)}>
22 |       {children}
23 |     </span>
24 |   );
25 | }
```

apps/dashboard/src/components/otp-sign-in.tsx
```
1 | "use client";
2 |
3 | import { verifyOtpAction } from "@/actions/verify-otp-action";
4 | import { zodResolver } from "@hookform/resolvers/zod";
5 | import { createClient } from "@midday/supabase/client";
6 | import { Button } from "@midday/ui/button";
7 | import { cn } from "@midday/ui/cn";
8 | import { Form, FormControl, FormField, FormItem } from "@midday/ui/form";
9 | import { Input } from "@midday/ui/input";
10 | import { InputOTP, InputOTPGroup, InputOTPSlot } from "@midday/ui/input-otp";
11 | import { Loader2 } from "lucide-react";
12 | import { useAction } from "next-safe-action/hooks";
13 | import { useState } from "react";
14 | import { useForm } from "react-hook-form";
15 | import { z } from "zod";
16 |
17 | const formSchema = z.object({
18 |   email: z.string().email(),
19 | });
20 |
21 | type Props = {
22 |   className?: string;
23 | };
24 |
25 | export function OTPSignIn({ className }: Props) {
26 |   const verifyOtp = useAction(verifyOtpAction);
27 |   const [isLoading, setLoading] = useState(false);
28 |   const [isSent, setSent] = useState(false);
29 |   const [email, setEmail] = useState<string>();
30 |   const supabase = createClient();
31 |
32 |   const form = useForm<z.infer<typeof formSchema>>({
33 |     resolver: zodResolver(formSchema),
34 |     defaultValues: {
35 |       email: "",
36 |     },
37 |   });
38 |
39 |   async function onSubmit({ email }: z.infer<typeof formSchema>) {
40 |     setLoading(true);
41 |
42 |     setEmail(email);
43 |
44 |     await supabase.auth.signInWithOtp({ email });
45 |
46 |     setSent(true);
47 |     setLoading(false);
48 |   }
49 |
50 |   async function onComplete(token: string) {
51 |     if (!email) return;
52 |
53 |     verifyOtp.execute({
54 |       token,
55 |       email,
56 |     });
57 |   }
58 |
59 |   if (isSent) {
60 |     return (
61 |       <div className={cn("flex flex-col space-y-4 items-center", className)}>
62 |         <InputOTP
63 |           maxLength={6}
64 |           autoFocus
65 |           onComplete={onComplete}
66 |           disabled={verifyOtp.status === "executing"}
67 |           render={({ slots }) => (
68 |             <InputOTPGroup>
69 |               {slots.map((slot, index) => (
70 |                 <InputOTPSlot
71 |                   key={index.toString()}
72 |                   {...slot}
73 |                   className="w-[62px] h-[62px]"
74 |                 />
75 |               ))}
76 |             </InputOTPGroup>
77 |           )}
78 |         />
79 |
80 |         <div className="flex space-x-2">
81 |           <span className="text-sm text-[#878787]">
82 |             Didn't receive the email?
83 |           </span>
84 |           <button
85 |             onClick={() => setSent(false)}
86 |             type="button"
87 |             className="text-sm text-primary underline font-medium"
88 |           >
89 |             Resend code
90 |           </button>
91 |         </div>
92 |       </div>
93 |     );
94 |   }
95 |
96 |   return (
97 |     <Form {...form}>
98 |       <form onSubmit={form.handleSubmit(onSubmit)}>
99 |         <div className={cn("flex flex-col space-y-4", className)}>
100 |           <FormField
101 |             control={form.control}
102 |             name="email"
103 |             render={({ field }) => (
104 |               <FormItem>
105 |                 <FormControl>
106 |                   <Input
107 |                     placeholder="Enter email address"
108 |                     {...field}
109 |                     autoCapitalize="false"
110 |                     autoCorrect="false"
111 |                     spellCheck="false"
112 |                   />
113 |                 </FormControl>
114 |               </FormItem>
115 |             )}
116 |           />
117 |
118 |           <Button
119 |             type="submit"
120 |             className="active:scale-[0.98] bg-primary px-6 py-4 text-secondary font-medium flex space-x-2 h-[40px] w-full"
121 |           >
122 |             {isLoading ? (
123 |               <Loader2 className="h-4 w-4 animate-spin" />
124 |             ) : (
125 |               <span>Continue</span>
126 |             )}
127 |           </Button>
128 |         </div>
129 |       </form>
130 |     </Form>
131 |   );
132 | }
```

apps/dashboard/src/components/payment-score-visualizer.tsx
```
1 | "use client";
2 |
3 | import { motion } from "framer-motion";
4 |
5 | interface PaymentScoreVisualizerProps {
6 |   score: number;
7 |   paymentStatus: "good" | "average" | "bad" | "none";
8 | }
9 |
10 | export function PaymentScoreVisualizer({
11 |   score,
12 |   paymentStatus,
13 | }: PaymentScoreVisualizerProps) {
14 |   return (
15 |     <div className="flex items-end gap-[6px]">
16 |       {[...Array(10)].map((_, index) => {
17 |         let color: string;
18 |
19 |         switch (paymentStatus) {
20 |           case "good":
21 |             color = "bg-green-500";
22 |             break;
23 |           case "average":
24 |             color = "bg-primary";
25 |             break;
26 |           case "bad":
27 |             color = "bg-red-500";
28 |             break;
29 |           default:
30 |             color = "bg-primary";
31 |         }
32 |         return (
33 |           <div className="relative" key={index.toString()}>
34 |             <motion.div
35 |               className={`w-1 ${color} relative z-10`}
36 |               initial={{
37 |                 scaleY: 0,
38 |                 height: index >= 8 ? "31px" : "27px",
39 |                 y: index >= 8 ? -4 : 0,
40 |               }}
41 |               animate={{
42 |                 scaleY: 1,
43 |                 height: "27px",
44 |                 y: 0,
45 |                 opacity: index < score ? 1 : 0.3,
46 |               }}
47 |               transition={{
48 |                 duration: 0.15,
49 |                 delay: index * 0.02,
50 |                 scaleY: { duration: 0.15, delay: index * 0.02 },
51 |                 height: { duration: 0.1, delay: 0.15 + index * 0.02 },
52 |                 y: { duration: 0.1, delay: 0.15 + index * 0.02 },
53 |                 opacity: { duration: 0.1, delay: 0.15 + index * 0.02 },
54 |               }}
55 |               style={{ originY: 1 }}
56 |             />
57 |           </div>
58 |         );
59 |       })}
60 |     </div>
61 |   );
62 | }
```

apps/dashboard/src/components/project-members.tsx
```
1 | import { Avatar, AvatarFallback, AvatarImageNext } from "@midday/ui/avatar";
2 |
3 | interface Member {
4 |   id: string;
5 |   avatar_url?: string;
6 |   full_name?: string;
7 | }
8 |
9 | interface ProjectMembersProps {
10 |   members: Member[];
11 | }
12 |
13 | export function ProjectMembers({ members }: ProjectMembersProps) {
14 |   return (
15 |     <div className="flex space-x-2">
16 |       {members?.map((member) => (
17 |         <div key={member.id} className="relative">
18 |           <Avatar className="rounded-full w-5 h-5">
19 |             <AvatarImageNext
20 |               src={member?.avatar_url}
21 |               alt={member?.full_name ?? ""}
22 |               width={20}
23 |               height={20}
24 |             />
25 |             <AvatarFallback>
26 |               <span className="text-xs">
27 |                 {member?.full_name?.charAt(0)?.toUpperCase()}
28 |               </span>
29 |             </AvatarFallback>
30 |           </Avatar>
31 |         </div>
32 |       ))}
33 |     </div>
34 |   );
35 | }
```

apps/dashboard/src/components/reconnect-provider.tsx
```
1 | import { createPlaidLinkTokenAction } from "@/actions/institutions/create-plaid-link";
2 | import { reconnectGoCardLessLinkAction } from "@/actions/institutions/reconnect-gocardless-link";
3 | import { Button } from "@midday/ui/button";
4 | import { Icons } from "@midday/ui/icons";
5 | import {
6 |   Tooltip,
7 |   TooltipContent,
8 |   TooltipProvider,
9 |   TooltipTrigger,
10 | } from "@midday/ui/tooltip";
11 | import { useToast } from "@midday/ui/use-toast";
12 | import { isDesktopApp } from "@todesktop/client-core/platform/todesktop";
13 | import { useScript } from "@uidotdev/usehooks";
14 | import { Loader2 } from "lucide-react";
15 | import { useAction } from "next-safe-action/hooks";
16 | import { useTheme } from "next-themes";
17 | import { useEffect, useState } from "react";
18 | import { usePlaidLink } from "react-plaid-link";
19 |
20 | type Props = {
21 |   id: string;
22 |   provider: string;
23 |   enrollmentId: string | null;
24 |   institutionId: string;
25 |   accessToken: string | null;
26 |   onManualSync: () => void;
27 |   variant?: "button" | "icon";
28 | };
29 |
30 | export function ReconnectProvider({
31 |   id,
32 |   provider,
33 |   enrollmentId,
34 |   institutionId,
35 |   accessToken,
36 |   onManualSync,
37 |   variant,
38 | }: Props) {
39 |   const { toast } = useToast();
40 |   const { theme } = useTheme();
41 |   const [plaidToken, setPlaidToken] = useState<string | undefined>();
42 |   const [isLoading, setIsLoading] = useState(false);
43 |
44 |   const reconnectGoCardLessLink = useAction(reconnectGoCardLessLinkAction, {
45 |     onExecute: () => {
46 |       setIsLoading(true);
47 |     },
48 |     onError: () => {
49 |       setIsLoading(false);
50 |
51 |       toast({
52 |         duration: 2500,
53 |         variant: "error",
54 |         title: "Something went wrong please try again.",
55 |       });
56 |     },
57 |     onSuccess: () => {
58 |       setIsLoading(false);
59 |     },
60 |   });
61 |
62 |   useScript("https://cdn.teller.io/connect/connect.js", {
63 |     removeOnUnmount: false,
64 |   });
65 |
66 |   const { open: openPlaid } = usePlaidLink({
67 |     token: plaidToken,
68 |     publicKey: "",
69 |     env: process.env.NEXT_PUBLIC_PLAID_ENVIRONMENT!,
70 |     clientName: "Midday",
71 |     product: ["transactions"],
72 |     onSuccess: () => {
73 |       setPlaidToken(undefined);
74 |       onManualSync();
75 |     },
76 |     onExit: () => {
77 |       setPlaidToken(undefined);
78 |     },
79 |   });
80 |
81 |   const openTeller = () => {
82 |     const teller = window.TellerConnect.setup({
83 |       applicationId: process.env.NEXT_PUBLIC_TELLER_APPLICATION_ID!,
84 |       environment: process.env.NEXT_PUBLIC_TELLER_ENVIRONMENT,
85 |       enrollmentId,
86 |       appearance: theme,
87 |       onSuccess: () => {
88 |         onManualSync();
89 |       },
90 |       onFailure: () => {},
91 |     });
92 |
93 |     if (teller) {
94 |       teller.open();
95 |     }
96 |   };
97 |
98 |   useEffect(() => {
99 |     if (plaidToken) {
100 |       openPlaid();
101 |     }
102 |   }, [plaidToken, openPlaid]);
103 |
104 |   const handleOnClick = async () => {
105 |     switch (provider) {
106 |       case "plaid": {
107 |         const token = await createPlaidLinkTokenAction(
108 |           accessToken ?? undefined,
109 |         );
110 |
111 |         if (token) {
112 |           setPlaidToken(token);
113 |         }
114 |
115 |         return;
116 |       }
117 |       case "gocardless": {
118 |         return reconnectGoCardLessLink.execute({
119 |           id,
120 |           institutionId,
121 |           availableHistory: 60,
122 |           redirectTo: `${window.location.origin}/api/gocardless/reconnect`,
123 |           isDesktop: isDesktopApp(),
124 |         });
125 |       }
126 |       case "teller":
127 |         return openTeller();
128 |       default:
129 |         return;
130 |     }
131 |   };
132 |
133 |   if (variant === "button") {
134 |     return (
135 |       <Button variant="outline" onClick={handleOnClick} disabled={isLoading}>
136 |         {isLoading ? (
137 |           <Loader2 className="size-3.5 animate-spin" />
138 |         ) : (
139 |           "Reconnect"
140 |         )}
141 |       </Button>
142 |     );
143 |   }
144 |
145 |   return (
146 |     <TooltipProvider delayDuration={70}>
147 |       <Tooltip>
148 |         <TooltipTrigger asChild>
149 |           <Button
150 |             variant="outline"
151 |             size="icon"
152 |             className="rounded-full w-7 h-7 flex items-center"
153 |             onClick={handleOnClick}
154 |             disabled={isLoading}
155 |           >
156 |             {isLoading ? (
157 |               <Loader2 className="size-3.5 animate-spin" />
158 |             ) : (
159 |               <Icons.Reconnect size={16} />
160 |             )}
161 |           </Button>
162 |         </TooltipTrigger>
163 |
164 |         <TooltipContent className="px-3 py-1.5 text-xs" sideOffset={10}>
165 |           Reconnect
166 |         </TooltipContent>
167 |       </Tooltip>
168 |     </TooltipProvider>
169 |   );
170 | }
```

apps/dashboard/src/components/remove-mfa-button.tsx
```
1 | "use client";
2 |
3 | import { unenrollMfaAction } from "@/actions/unenroll-mfa-action";
4 | import { Button } from "@midday/ui/button";
5 | import { useToast } from "@midday/ui/use-toast";
6 | import { useAction } from "next-safe-action/hooks";
7 |
8 | type Props = {
9 |   factorId: string;
10 | };
11 |
12 | export function RemoveMFAButton({ factorId }: Props) {
13 |   const { toast } = useToast();
14 |
15 |   const unenroll = useAction(unenrollMfaAction, {
16 |     onError: () => {
17 |       toast({
18 |         duration: 3500,
19 |         variant: "error",
20 |         title: "Something went wrong please try again.",
21 |       });
22 |     },
23 |   });
24 |
25 |   return (
26 |     <Button variant="outline" onClick={() => unenroll.execute({ factorId })}>
27 |       Remove
28 |     </Button>
29 |   );
30 | }
```

apps/dashboard/src/components/search-address-input.tsx
```
1 | "use client";
2 |
3 | import { cn } from "@midday/ui/cn";
4 | import {
5 |   CommandEmpty,
6 |   CommandGroup,
7 |   CommandInput,
8 |   CommandItem,
9 |   CommandList,
10 |   Command as CommandPrimitive,
11 | } from "@midday/ui/command";
12 | import { useJsApiLoader } from "@react-google-maps/api";
13 | import { useClickAway } from "@uidotdev/usehooks";
14 | import { Check } from "lucide-react";
15 | import { useCallback, useEffect, useRef, useState } from "react";
16 | import usePlacesAutoComplete, { getDetails } from "use-places-autocomplete";
17 |
18 | type Libraries = Parameters<typeof useJsApiLoader>[0]["libraries"];
19 | const libraries: Libraries = ["places"];
20 |
21 | type Props = {
22 |   id?: string;
23 |   defaultValue?: string;
24 |   onSelect: (addressDetails: AddressDetails) => void;
25 |   placeholder?: string;
26 |   disabled?: boolean;
27 |   emptyMessage?: string;
28 | };
29 |
30 | export type AddressDetails = {
31 |   address_line_1: string;
32 |   city: string;
33 |   state: string;
34 |   zip: string;
35 |   country: string;
36 |   country_code: string;
37 | };
38 |
39 | type Option = {
40 |   value: string;
41 |   label: string;
42 | };
43 |
44 | const getAddressDetailsByAddressId = async (
45 |   addressId: string,
46 | ): Promise<AddressDetails> => {
47 |   const details = (await getDetails({
48 |     placeId: addressId,
49 |     fields: ["address_component"],
50 |   })) as google.maps.places.PlaceResult;
51 |
52 |   const comps = details.address_components;
53 |
54 |   const streetNumber =
55 |     comps?.find((c) => c.types.includes("street_number"))?.long_name ?? "";
56 |   const streetAddress =
57 |     comps?.find((c) => c.types.includes("route"))?.long_name ?? "";
58 |   const city =
59 |     comps?.find((c) => c.types.includes("postal_town"))?.long_name ||
60 |     comps?.find((c) => c.types.includes("locality"))?.long_name ||
61 |     comps?.find((c) => c.types.includes("sublocality_level_1"))?.long_name ||
62 |     "";
63 |   const state =
64 |     comps?.find((c) => c.types.includes("administrative_area_level_1"))
65 |       ?.short_name || "";
66 |   const zip =
67 |     comps?.find((c) => c.types.includes("postal_code"))?.long_name || "";
68 |   const country =
69 |     comps?.find((c) => c.types.includes("country"))?.long_name || "";
70 |   const countryCode =
71 |     comps?.find((c) => c.types.includes("country"))?.short_name || "";
72 |
73 |   return {
74 |     address_line_1: `${streetNumber} ${streetAddress}`.trim(),
75 |     city,
76 |     state,
77 |     zip,
78 |     country,
79 |     country_code: countryCode,
80 |   };
81 | };
82 |
83 | export function SearchAddressInput({
84 |   onSelect,
85 |   placeholder,
86 |   defaultValue,
87 |   disabled = false,
88 |   emptyMessage = "No results found.",
89 | }: Props) {
90 |   const inputRef = useRef<HTMLInputElement>(null);
91 |
92 |   const [isOpen, setOpen] = useState(false);
93 |   const [selected, setSelected] = useState<Option | null>(null);
94 |   const [inputValue, setInputValue] = useState<string>(defaultValue || "");
95 |
96 |   const { isLoaded } = useJsApiLoader({
97 |     googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_API_KEY as string,
98 |     libraries,
99 |   });
100 |
101 |   const {
102 |     ready,
103 |     suggestions: { status, data },
104 |     setValue,
105 |   } = usePlacesAutoComplete({
106 |     initOnMount: isLoaded,
107 |     debounce: 300,
108 |     requestOptions: {
109 |       language: "en",
110 |     },
111 |   });
112 |
113 |   useEffect(() => {
114 |     if (defaultValue) {
115 |       setValue(defaultValue, false);
116 |       setInputValue(defaultValue);
117 |     }
118 |   }, [defaultValue, setValue]);
119 |
120 |   const options: Option[] = data.map((item) => ({
121 |     value: item.place_id,
122 |     label: item.description,
123 |   }));
124 |
125 |   const handleKeyDown = useCallback(
126 |     (event: React.KeyboardEvent<HTMLDivElement>) => {
127 |       const input = inputRef.current;
128 |
129 |       if (!input) {
130 |         return;
131 |       }
132 |
133 |       if (!isOpen) {
134 |         setOpen(true);
135 |       }
136 |
137 |       if (event.key === "Enter" && input.value !== "") {
138 |         const optionToSelect = options.find(
139 |           (option) => option.label === input.value,
140 |         );
141 |         if (optionToSelect) {
142 |           setSelected(optionToSelect);
143 |           handleSelect(optionToSelect);
144 |         }
145 |       }
146 |
147 |       if (event.key === "Escape") {
148 |         input.blur();
149 |       }
150 |     },
151 |     [isOpen, options],
152 |   );
153 |
154 |   const handleBlur = useCallback(() => {
155 |     setInputValue(selected?.label || "");
156 |   }, [selected]);
157 |
158 |   const handleSelectOption = useCallback(
159 |     (selectedOption: Option) => {
160 |       setInputValue(selectedOption.label);
161 |       setSelected(selectedOption);
162 |       handleSelect(selectedOption);
163 |       setOpen(false);
164 |
165 |       setTimeout(() => {
166 |         inputRef?.current?.blur();
167 |       }, 0);
168 |     },
169 |     [onSelect],
170 |   );
171 |
172 |   const handleSelect = async (address: Option) => {
173 |     setValue(address.label, false);
[TRUNCATED]
```

apps/dashboard/src/components/search-customer.tsx
```
1 | "use client";
2 |
3 | import type { Customer } from "@/components/invoice/customer-details";
4 | import { useCustomerParams } from "@/hooks/use-customer-params";
5 | import { useInvoiceParams } from "@/hooks/use-invoice-params";
6 | import { ComboboxDropdown } from "@midday/ui/combobox-dropdown";
7 | import { useEffect } from "react";
8 |
9 | type Props = {
10 |   data: Customer[];
11 |   onSelect: (id: string) => void;
12 |   selectedId?: string;
13 | };
14 |
15 | export function SearchCustomer({ data, onSelect, selectedId }: Props) {
16 |   const { setParams: setCustomerParams } = useCustomerParams();
17 |   const { selectedCustomerId } = useInvoiceParams();
18 |
19 |   const formattedData = data?.map((customer) => ({
20 |     id: customer.id,
21 |     label: customer.name,
22 |   }));
23 |
24 |   const selectedItem = selectedId
25 |     ? formattedData.find((item) => item.id === selectedId)
26 |     : undefined;
27 |
28 |   useEffect(() => {
29 |     if (selectedCustomerId) {
30 |       onSelect(selectedCustomerId);
31 |     }
32 |   }, [selectedCustomerId]);
33 |
34 |   return (
35 |     <ComboboxDropdown
36 |       placeholder="Select customer"
37 |       searchPlaceholder="Search customer"
38 |       className="text-xs"
39 |       items={formattedData}
40 |       onSelect={({ id }) => onSelect(id)}
41 |       selectedItem={selectedItem}
42 |       onCreate={(value) => {
43 |         setCustomerParams({ createCustomer: true, name: value });
44 |       }}
45 |       renderListItem={(item) => {
46 |         return (
47 |           <div className="flex items-center justify-between w-full group">
48 |             <span>{item.item.label}</span>
49 |             <button
50 |               type="button"
51 |               onClick={() => setCustomerParams({ customerId: item.item.id })}
52 |               className="text-xs opacity-0 group-hover:opacity-50 hover:opacity-100"
53 |             >
54 |               Edit
55 |             </button>
56 |           </div>
57 |         );
58 |       }}
59 |       renderOnCreate={(value) => {
60 |         return (
61 |           <div className="flex items-center space-x-2">
62 |             <button
63 |               type="button"
64 |               onClick={() =>
65 |                 setCustomerParams({ createCustomer: true, name: value })
66 |               }
67 |             >{`Create "${value}"`}</button>
68 |           </div>
69 |         );
70 |       }}
71 |     />
72 |   );
73 | }
```

apps/dashboard/src/components/search-field.tsx
```
1 | "use client";
2 |
3 | import { Icons } from "@midday/ui/icons";
4 | import { Input } from "@midday/ui/input";
5 | import { useQueryState } from "nuqs";
6 | import { useHotkeys } from "react-hotkeys-hook";
7 |
8 | type Props = {
9 |   placeholder: string;
10 |   shallow?: boolean;
11 | };
12 |
13 | export function SearchField({ placeholder, shallow = false }: Props) {
14 |   const [search, setSearch] = useQueryState("q", {
15 |     shallow,
16 |   });
17 |
18 |   useHotkeys("esc", () => setSearch(null), {
19 |     enableOnFormTags: true,
20 |   });
21 |
22 |   const handleSearch = (evt: React.ChangeEvent<HTMLInputElement>) => {
23 |     const value = evt.target.value;
24 |
25 |     if (value) {
26 |       setSearch(value);
27 |     } else {
28 |       setSearch(null);
29 |     }
30 |   };
31 |
32 |   return (
33 |     <div className="w-full md:max-w-[380px] relative">
34 |       <Icons.Search className="absolute pointer-events-none left-3 top-[11px]" />
35 |       <Input
36 |         placeholder={placeholder}
37 |         className="pl-9 w-full"
38 |         value={search ?? ""}
39 |         onChange={handleSearch}
40 |         autoComplete="off"
41 |         autoCapitalize="none"
42 |         autoCorrect="off"
43 |         spellCheck="false"
44 |       />
45 |     </div>
46 |   );
47 | }
```

apps/dashboard/src/components/secondary-menu.tsx
```
1 | "use client";
2 |
3 | import { cn } from "@midday/ui/cn";
4 | import Link from "next/link";
5 | import { usePathname } from "next/navigation";
6 |
7 | export function SecondaryMenu({ items }) {
8 |   const pathname = usePathname();
9 |
10 |   return (
11 |     <nav className="py-4">
12 |       <ul className="flex space-x-6 text-sm overflow-auto scrollbar-hide">
13 |         {items.map((item) => (
14 |           <Link
15 |             prefetch
16 |             key={item.path}
17 |             href={item.path}
18 |             className={cn(
19 |               "text-[#606060]",
20 |               pathname === item.path &&
21 |                 "text-primary font-medium underline underline-offset-8"
22 |             )}
23 |           >
24 |             <span>{item.label}</span>
25 |           </Link>
26 |         ))}
27 |       </ul>
28 |     </nav>
29 |   );
30 | }
```

apps/dashboard/src/components/select-account.tsx
```
1 | import { createBankAccountAction } from "@/actions/create-bank-account-action";
2 | import { useUserContext } from "@/store/user/hook";
3 | import { formatAccountName } from "@/utils/format";
4 | import { createClient } from "@midday/supabase/client";
5 | import { getTeamBankAccountsQuery } from "@midday/supabase/queries";
6 | import { ComboboxDropdown } from "@midday/ui/combobox-dropdown";
7 | import { useAction } from "next-safe-action/hooks";
8 | import { useEffect, useState } from "react";
9 | import { TransactionBankAccount } from "./transaction-bank-account";
10 |
11 | type Props = {
12 |   placeholder: string;
13 |   className?: string;
14 |   value?: string;
15 |   onChange: (value: {
16 |     id: string;
17 |     label: string;
18 |     logo?: string;
19 |     currency?: string;
20 |     type?: string;
21 |   }) => void;
22 | };
23 |
24 | export function SelectAccount({ placeholder, onChange, value }: Props) {
25 |   const [data, setData] = useState([]);
26 |   const supabase = createClient();
27 |
28 |   const { team_id: teamId } = useUserContext((state) => state.data);
29 |
30 |   const createBankAccount = useAction(createBankAccountAction, {
31 |     onSuccess: async ({ data: result }) => {
32 |       if (result) {
33 |         onChange(result);
34 |         setData((prev) => [{ id: result.id, label: result.name }, ...prev]);
35 |       }
36 |     },
37 |   });
38 |
39 |   useEffect(() => {
40 |     async function fetchData() {
41 |       const repsonse = await getTeamBankAccountsQuery(supabase, {
42 |         teamId,
43 |       });
44 |
45 |       setData(
46 |         repsonse.data?.map((account) => ({
47 |           id: account.id,
48 |           label: account.name,
49 |           logo: account?.logo_url,
50 |           currency: account.currency,
51 |           type: account.type,
52 |         })),
53 |       );
54 |     }
55 |
56 |     if (!data.length) {
57 |       fetchData();
58 |     }
59 |   }, []);
60 |
61 |   const selectedValue = data.find((d) => d?.id === value);
62 |
63 |   return (
64 |     <ComboboxDropdown
65 |       disabled={createBankAccount.status === "executing"}
66 |       placeholder={placeholder}
67 |       searchPlaceholder="Select or create account"
68 |       items={data}
69 |       selectedItem={selectedValue}
70 |       onSelect={(item) => {
71 |         onChange(item);
72 |       }}
73 |       onCreate={(name) => createBankAccount.execute({ name })}
74 |       renderSelectedItem={(selectedItem) => {
75 |         return (
76 |           <TransactionBankAccount
77 |             name={formatAccountName({
78 |               name: selectedItem.label,
79 |               currency: selectedItem.currency,
80 |             })}
81 |             logoUrl={selectedItem.logo}
82 |           />
83 |         );
84 |       }}
85 |       renderOnCreate={(value) => {
86 |         return (
87 |           <div className="flex items-center space-x-2">
88 |             <span>{`Create "${value}"`}</span>
89 |           </div>
90 |         );
91 |       }}
92 |       renderListItem={({ item }) => {
93 |         return (
94 |           <TransactionBankAccount
95 |             name={formatAccountName({
96 |               name: item.label,
97 |               currency: item.currency,
98 |             })}
99 |             logoUrl={item.logo}
100 |           />
101 |         );
102 |       }}
103 |     />
104 |   );
105 | }
```

apps/dashboard/src/components/select-attachment.tsx
```
1 | import { searchAction } from "@/actions/search-action";
2 | import { Combobox } from "@midday/ui/combobox";
3 | import {
4 |   HoverCard,
5 |   HoverCardContent,
6 |   HoverCardTrigger,
7 | } from "@midday/ui/hover-card";
8 | import { isSupportedFilePreview } from "@midday/utils";
9 | import { useDebounce } from "@uidotdev/usehooks";
10 | import { format } from "date-fns";
11 | import { useAction } from "next-safe-action/hooks";
12 | import { useEffect, useState } from "react";
13 | import { FilePreview } from "./file-preview";
14 | import { FormatAmount } from "./format-amount";
15 |
16 | type Props = {
17 |   placeholder: string;
18 |   onSelect: (file: any) => void;
19 | };
20 |
21 | export function SelectAttachment({ placeholder, onSelect }: Props) {
22 |   const [items, setItems] = useState([]);
23 |   const [isLoading, setLoading] = useState(false);
24 |   const [query, setQuery] = useState("");
25 |
26 |   const debouncedSearchTerm = useDebounce(query, 300);
27 |
28 |   const search = useAction(searchAction, {
29 |     onSuccess: ({ data }) => {
30 |       setItems(data);
31 |       setLoading(false);
32 |     },
33 |     onError: () => setLoading(false),
34 |   });
35 |
36 |   useEffect(() => {
37 |     if (debouncedSearchTerm) {
38 |       search.execute({ query: debouncedSearchTerm, type: "inbox" });
39 |     } else {
40 |       setLoading(false);
41 |     }
42 |   }, [debouncedSearchTerm]);
43 |
44 |   const options = items?.map((item) => ({
45 |     id: item.id,
46 |     name: item.display_name,
47 |     data: item,
48 |     component: () => {
49 |       const filePreviewSupported = isSupportedFilePreview(item.content_type);
50 |
51 |       return (
52 |         <HoverCard openDelay={200}>
53 |           <HoverCardTrigger className="w-full">
54 |             <div className="dark:text-white flex w-full">
55 |               <div className="w-[50%] line-clamp-1 text-ellipsis overflow-hidden pr-8">
56 |                 {item.display_name}
57 |               </div>
58 |               <div className="w-[70px]">
59 |                 {item.date ? format(new Date(item.date), "d MMM") : "-"}
60 |               </div>
61 |               <div className="flex-1 text-right">
62 |                 {item.amount && item.currency && (
63 |                   <FormatAmount amount={item.amount} currency={item.currency} />
64 |                 )}
65 |               </div>
66 |             </div>
67 |           </HoverCardTrigger>
68 |
69 |           {filePreviewSupported && (
70 |             <HoverCardContent
71 |               className="w-[273px] h-[358px] p-0 overflow-hidden"
72 |               side="left"
73 |               sideOffset={55}
74 |             >
75 |               <FilePreview
76 |                 src={`/api/proxy?filePath=vault/${item?.file_path?.join("/")}`}
77 |                 name={item.name}
78 |                 type={item.content_type}
79 |                 width={280}
80 |                 height={365}
81 |                 disableFullscreen
82 |               />
83 |             </HoverCardContent>
84 |           )}
85 |         </HoverCard>
86 |       );
87 |     },
88 |   }));
89 |
90 |   return (
91 |     <Combobox
92 |       className="border border-border p-2 pl-10"
93 |       placeholder={placeholder}
94 |       onValueChange={(query) => {
95 |         setLoading(true);
96 |         setQuery(query);
97 |       }}
98 |       onSelect={onSelect}
99 |       options={isLoading ? [] : options}
100 |       isLoading={isLoading}
101 |       classNameList="mt-2"
102 |     />
103 |   );
104 | }
```

apps/dashboard/src/components/select-category.tsx
```
1 | import { createCategoriesAction } from "@/actions/create-categories-action";
2 | import { useUserContext } from "@/store/user/hook";
3 | import { getColorFromName } from "@/utils/categories";
4 | import { createClient } from "@midday/supabase/client";
5 | import { getCategoriesQuery } from "@midday/supabase/queries";
6 | import { ComboboxDropdown } from "@midday/ui/combobox-dropdown";
7 | import { Spinner } from "@midday/ui/spinner";
8 | import { useAction } from "next-safe-action/hooks";
9 | import { useEffect, useState } from "react";
10 | import { CategoryColor } from "./category";
11 |
12 | type Selected = {
13 |   id: string;
14 |   name: string;
15 |   color: string;
16 |   slug: string;
17 | };
18 |
19 | type Props = {
20 |   selected?: Selected;
21 |   onChange: (selected: Selected) => void;
22 |   headless?: boolean;
23 |   hideLoading?: boolean;
24 |   uncategorized?: boolean;
25 | };
26 |
27 | function transformCategory(category) {
28 |   return {
29 |     id: category.id,
30 |     label: category.name,
31 |     color: category.color,
32 |     slug: category.slug,
33 |   };
34 | }
35 |
36 | export function SelectCategory({
37 |   selected,
38 |   onChange,
39 |   headless,
40 |   hideLoading,
41 |   uncategorized,
42 | }: Props) {
43 |   const [data, setData] = useState([]);
44 |   const [isLoading, setIsLoading] = useState(true);
45 |   const supabase = createClient();
46 |
47 |   const { team_id: teamId } = useUserContext((state) => state.data);
48 |
49 |   useEffect(() => {
50 |     async function fetchData() {
51 |       const response = await getCategoriesQuery(supabase, {
52 |         teamId,
53 |         limit: 1000,
54 |       });
55 |
56 |       if (response.data) {
57 |         setData([
58 |           ...response.data.map(transformCategory),
59 |           ...(uncategorized
60 |             ? [
61 |                 {
62 |                   id: "uncategorized",
63 |                   label: "Uncategorized",
64 |                   color: "#606060",
65 |                   slug: "uncategorized",
66 |                 },
67 |               ]
68 |             : []),
69 |         ]);
70 |       }
71 |
72 |       setIsLoading(false);
73 |     }
74 |
75 |     if (!data.length) {
76 |       fetchData();
77 |     }
78 |   }, [data]);
79 |
80 |   const createCategories = useAction(createCategoriesAction, {
81 |     onSuccess: ({ data }) => {
82 |       const category = data?.at(0);
83 |
84 |       if (category) {
85 |         setData((prev) => [transformCategory(category), ...prev]);
86 |         onChange(category);
87 |       }
88 |     },
89 |   });
90 |
91 |   const selectedValue = selected ? transformCategory(selected) : undefined;
92 |
93 |   if (!selected && isLoading && !hideLoading) {
94 |     return (
95 |       <div className="w-full h-full flex items-center justify-center">
96 |         <Spinner />
97 |       </div>
98 |     );
99 |   }
100 |
101 |   return (
102 |     <ComboboxDropdown
103 |       headless={headless}
104 |       disabled={createCategories.status === "executing"}
105 |       placeholder="Select category"
106 |       searchPlaceholder="Search category"
107 |       items={data}
108 |       selectedItem={selectedValue}
109 |       onSelect={(item) => {
110 |         onChange({
111 |           id: item.id,
112 |           name: item.label,
113 |           color: item.color,
114 |           slug: item.slug,
115 |         });
116 |       }}
117 |       {...(!headless && {
118 |         onCreate: (value) => {
119 |           createCategories.execute({
120 |             categories: [
121 |               {
122 |                 name: value,
123 |                 color: getColorFromName(value),
124 |               },
125 |             ],
126 |           });
127 |         },
128 |       })}
129 |       renderSelectedItem={(selectedItem) => (
130 |         <div className="flex items-center space-x-2">
131 |           <CategoryColor color={selectedItem.color} />
132 |           <span className="text-left truncate max-w-[90%]">
133 |             {selectedItem.label}
134 |           </span>
135 |         </div>
136 |       )}
137 |       renderOnCreate={(value) => {
138 |         if (!headless) {
139 |           return (
140 |             <div className="flex items-center space-x-2">
141 |               <CategoryColor color={getColorFromName(value)} />
142 |               <span>{`Create "${value}"`}</span>
143 |             </div>
144 |           );
145 |         }
146 |       }}
147 |       renderListItem={({ item }) => {
148 |         return (
149 |           <div className="flex items-center space-x-2">
150 |             <CategoryColor color={item.color} />
151 |             <span className="line-clamp-1">{item.label}</span>
152 |           </div>
153 |         );
154 |       }}
155 |     />
156 |   );
157 | }
```

apps/dashboard/src/components/select-currency.tsx
```
1 | import { ComboboxDropdown } from "@midday/ui/combobox-dropdown";
2 |
3 | type Props = {
4 |   value?: string;
5 |   headless?: boolean;
6 |   className?: string;
7 |   currencies: string[];
8 |   onChange: (value: string) => void;
9 | };
10 |
11 | export function SelectCurrency({
12 |   currencies,
13 |   value,
14 |   onChange,
15 |   headless,
16 |   className,
17 | }: Props) {
18 |   const data = currencies.map((currency) => ({
19 |     id: currency.toLowerCase(),
20 |     value: currency.toUpperCase(),
21 |     label: currency,
22 |   }));
23 |
24 |   return (
25 |     <ComboboxDropdown
26 |       headless={headless}
27 |       placeholder="Select currency"
28 |       selectedItem={data.find((item) => item.id === value?.toLowerCase())}
29 |       searchPlaceholder="Search currencies"
30 |       items={data}
31 |       className={className}
32 |       onSelect={(item) => {
33 |         onChange(item.value);
34 |       }}
35 |     />
36 |   );
37 | }
```

apps/dashboard/src/components/select-customer.tsx
```
1 | "use client";
2 |
3 | import { useCustomerParams } from "@/hooks/use-customer-params";
4 | import { useInvoiceParams } from "@/hooks/use-invoice-params";
5 | import { Button } from "@midday/ui/button";
6 | import {
7 |   Command,
8 |   CommandEmpty,
9 |   CommandGroup,
10 |   CommandInput,
11 |   CommandItem,
12 |   CommandList,
13 | } from "@midday/ui/command";
14 | import { Popover, PopoverContent, PopoverTrigger } from "@midday/ui/popover";
15 | import React from "react";
16 |
17 | type Props = {
18 |   data: {
19 |     id: string;
20 |     name: string;
21 |   }[];
22 | };
23 |
24 | export function SelectCustomer({ data }: Props) {
25 |   const { setParams: setCustomerParams } = useCustomerParams();
26 |   const { setParams: setInvoiceParams } = useInvoiceParams();
27 |   const [open, setOpen] = React.useState(false);
28 |   const [value, setValue] = React.useState("");
29 |
30 |   const formatData = data.map((item) => ({
31 |     value: item.name,
32 |     label: item.name,
33 |     id: item.id,
34 |   }));
35 |
36 |   const handleSelect = (id: string) => {
37 |     if (id === "create-customer") {
38 |       setCustomerParams({ createCustomer: true, name: value });
39 |     } else {
40 |       setInvoiceParams({ selectedCustomerId: id });
41 |     }
42 |
43 |     setOpen(false);
44 |   };
45 |
46 |   if (!data.length) {
47 |     return (
48 |       <Button
49 |         type="button"
50 |         variant="ghost"
51 |         onClick={() => setCustomerParams({ createCustomer: true })}
52 |         className="font-mono text-[#434343] p-0 text-[11px] h-auto hover:bg-transparent"
53 |       >
54 |         Select customer
55 |       </Button>
56 |     );
57 |   }
58 |
59 |   return (
60 |     <Popover open={open} onOpenChange={setOpen} modal>
61 |       <PopoverTrigger asChild>
62 |         <Button
63 |           type="button"
64 |           variant="ghost"
65 |           aria-expanded={open}
66 |           className="font-mono text-[#434343] p-0 text-[11px] h-auto hover:bg-transparent"
67 |         >
68 |           Select customer
69 |         </Button>
70 |       </PopoverTrigger>
71 |
72 |       <PopoverContent
73 |         className="w-[200px] p-0"
74 |         side="bottom"
75 |         sideOffset={10}
76 |         align="start"
77 |       >
78 |         <Command>
79 |           <CommandInput
80 |             value={value}
81 |             onValueChange={setValue}
82 |             placeholder="Search customer..."
83 |             className="p-2 text-xs"
84 |           />
85 |           <CommandList className="max-h-[180px] overflow-auto">
86 |             <CommandEmpty className="text-xs border-t-[1px] border-border p-2">
87 |               <button
88 |                 type="button"
89 |                 onClick={() =>
90 |                   setCustomerParams({ createCustomer: true, name: value })
91 |                 }
92 |               >
93 |                 Create customer
94 |               </button>
95 |             </CommandEmpty>
96 |             <CommandGroup>
97 |               {formatData.map((item) => (
98 |                 <CommandItem
99 |                   key={item.value}
100 |                   value={item.value}
101 |                   onSelect={() => handleSelect(item.id)}
102 |                   className="group text-xs"
103 |                 >
104 |                   {item.label}
105 |                   <button
106 |                     type="button"
107 |                     onClick={(e) => {
108 |                       e.stopPropagation();
109 |                       setCustomerParams({ customerId: item.id });
110 |                     }}
111 |                     className="ml-auto text-xs opacity-0 group-hover:opacity-50 hover:opacity-100"
112 |                   >
113 |                     Edit
114 |                   </button>
115 |                 </CommandItem>
116 |               ))}
117 |               <CommandItem
118 |                 value="create-customer"
119 |                 onSelect={handleSelect}
120 |                 className="text-xs border-t-[1px] border-border pt-2 mt-2"
121 |               >
122 |                 Create customer
123 |               </CommandItem>
124 |             </CommandGroup>
125 |           </CommandList>
126 |         </Command>
127 |       </PopoverContent>
128 |     </Popover>
129 |   );
130 | }
```

apps/dashboard/src/components/select-tag.tsx
```
1 | import { useI18n } from "@/locales/client";
2 | import { ComboboxDropdown } from "@midday/ui/combobox-dropdown";
3 | import { TAGS } from "./tables/vault/contants";
4 |
5 | export function SelectTag({
6 |   headless,
7 |   onChange,
8 |   selectedId,
9 | }: {
10 |   headless?: boolean;
11 |   onChange: (selected: { id: string; label: string; slug: string }) => void;
12 |   selectedId?: string;
13 | }) {
14 |   const t = useI18n();
15 |
16 |   const data = TAGS.map((tag) => ({
17 |     id: tag,
18 |     label: t(`tags.${tag}`),
19 |     slug: tag,
20 |   }));
21 |
22 |   return (
23 |     <ComboboxDropdown
24 |       headless={headless}
25 |       placeholder="Select tags"
26 |       selectedItem={data.find((tag) => tag.id === selectedId)}
27 |       searchPlaceholder="Search tags"
28 |       items={data}
29 |       onSelect={(item) => {
30 |         onChange(item);
31 |       }}
32 |     />
33 |   );
34 | }
```

apps/dashboard/src/components/select-tags.tsx
```
1 | import { createTagAction } from "@/actions/create-tag-action";
2 | import { deleteTagAction } from "@/actions/delete-tag-action";
3 | import { updateTagAction } from "@/actions/update-tag-action";
4 | import { useUserContext } from "@/store/user/hook";
5 | import { createClient } from "@midday/supabase/client";
6 | import { getTagsQuery } from "@midday/supabase/queries";
7 | import {
8 |   Dialog,
9 |   DialogContent,
10 |   DialogDescription,
11 |   DialogFooter,
12 |   DialogHeader,
13 |   DialogTitle,
14 | } from "@midday/ui/dialog";
15 | import { Input } from "@midday/ui/input";
16 | import { Label } from "@midday/ui/label";
17 | import MultipleSelector, { type Option } from "@midday/ui/multiple-selector";
18 | import { SubmitButton } from "@midday/ui/submit-button";
19 | import { useAction } from "next-safe-action/hooks";
20 | import React, { useEffect, useState } from "react";
21 |
22 | type Props = {
23 |   tags?: Option[];
24 |   onSelect?: (tag: Option) => void;
25 |   onRemove?: (tag: Option & { id: string }) => void;
26 |   onChange?: (tags: Option[]) => void;
27 |   onCreate?: (tag: Option) => void;
28 | };
29 |
30 | export function SelectTags({
31 |   tags,
32 |   onSelect,
33 |   onRemove,
34 |   onChange,
35 |   onCreate,
36 | }: Props) {
37 |   const supabase = createClient();
38 |   const [isOpen, setIsOpen] = useState(false);
39 |   const [data, setData] = useState<Option[]>(tags ?? []);
40 |   const [selected, setSelected] = useState<Option[]>(tags ?? []);
41 |   const [editingTag, setEditingTag] = useState<Option | null>(null);
42 |
43 |   const { team_id: teamId } = useUserContext((state) => state.data);
44 |
45 |   const deleteTag = useAction(deleteTagAction, {
46 |     onSuccess: () => {
47 |       setIsOpen(false);
48 |       setEditingTag(null);
49 |     },
50 |   });
51 |
52 |   const createTag = useAction(createTagAction, {
53 |     onSuccess: ({ data }) => {
54 |       if (data) {
55 |         const newTag: Option = {
56 |           label: data.name,
57 |           value: data.name,
58 |           id: data.id,
59 |         };
60 |         onSelect?.(newTag);
61 |         onCreate?.(newTag);
62 |       }
63 |     },
64 |   });
65 |
66 |   const updateTag = useAction(updateTagAction, {
67 |     onSuccess: () => {
68 |       setIsOpen(false);
69 |       setEditingTag(null);
70 |     },
71 |   });
72 |
73 |   useEffect(() => {
74 |     async function fetchData() {
75 |       const { data } = await getTagsQuery(supabase, teamId);
76 |
77 |       if (data?.length) {
78 |         setData(
79 |           data.map((tag) => ({
80 |             label: tag.name,
81 |             value: tag.name,
82 |             id: tag.id,
83 |           })),
84 |         );
85 |       }
86 |     }
87 |
88 |     fetchData();
89 |   }, [teamId]);
90 |
91 |   const handleDelete = () => {
92 |     deleteTag.execute({ id: editingTag?.id });
93 |     setSelected(selected.filter((tag) => tag.id !== editingTag?.id));
94 |     setData(data.filter((tag) => tag.id !== editingTag?.id));
95 |   };
96 |
97 |   const handleUpdate = () => {
98 |     updateTag.execute({ id: editingTag?.id, name: editingTag?.value });
99 |
100 |     setData(
101 |       data.map((tag) =>
102 |         tag.id === editingTag?.id
103 |           ? { ...tag, label: editingTag.value, value: editingTag.value }
104 |           : tag,
105 |       ),
106 |     );
107 |   };
108 |
109 |   return (
110 |     <Dialog open={isOpen} onOpenChange={setIsOpen}>
111 |       <div className="w-full">
112 |         <MultipleSelector
113 |           options={data}
114 |           value={selected}
115 |           placeholder="Select tags"
116 |           creatable
117 |           emptyIndicator={<p className="text-sm">No results found.</p>}
118 |           renderOption={(option) => (
119 |             <div className="flex items-center justify-between w-full group">
120 |               <span>{option.label}</span>
121 |
122 |               <button
123 |                 type="button"
124 |                 className="text-xs group-hover:opacity-50 opacity-0"
125 |                 onClick={(event) => {
126 |                   event.stopPropagation();
127 |                   setEditingTag(option);
128 |                   setIsOpen(true);
129 |                 }}
130 |               >
131 |                 Edit
132 |               </button>
133 |             </div>
134 |           )}
135 |           onCreate={(option) => {
136 |             createTag.execute({ name: option.value });
137 |           }}
138 |           onChange={(options) => {
139 |             setSelected(options);
140 |             onChange?.(options);
141 |
142 |             const newTag = options.find(
143 |               (tag) => !selected.find((opt) => opt.value === tag.value),
144 |             );
145 |
146 |             if (newTag) {
147 |               onSelect?.(newTag);
148 |               return;
149 |             }
150 |
151 |             if (options.length < selected.length) {
152 |               const removedTag = selected.find(
153 |                 (tag) => !options.find((opt) => opt.value === tag.value),
154 |               ) as Option & { id: string };
155 |
156 |               if (removedTag) {
157 |                 onRemove?.(removedTag);
158 |                 setSelected(options);
159 |               }
160 |             }
161 |           }}
162 |         />
163 |       </div>
164 |
165 |       <DialogContent className="max-w-[455px]">
166 |         <div className="p-4">
167 |           <DialogHeader>
168 |             <DialogTitle>Edit Tag</DialogTitle>
169 |             <DialogDescription>
[TRUNCATED]
```

apps/dashboard/src/components/select-transaction.tsx
```
1 | import { createClient } from "@midday/supabase/client";
2 | import { getTransactionsQuery } from "@midday/supabase/queries";
3 | import { Combobox } from "@midday/ui/combobox";
4 | import { format } from "date-fns";
5 | import { useState } from "react";
6 | import { FormatAmount } from "./format-amount";
7 |
8 | type Item = {
9 |   id: string;
10 |   name: string;
11 |   amount: number;
12 |   currency: string;
13 |   date: string;
14 | };
15 |
16 | type Props = {
17 |   placeholder: string;
18 |   onSelect: (item: { id: string; transaction_id?: string | null }) => void;
19 |   inboxId: string;
20 |   teamId: string;
21 |   selectedTransaction?: Item;
22 | };
23 |
24 | export function SelectTransaction({
25 |   placeholder,
26 |   onSelect,
27 |   inboxId,
28 |   teamId,
29 |   selectedTransaction,
30 | }: Props) {
31 |   const supabase = createClient();
32 |   const [items, setItems] = useState<Item[]>([]);
33 |   const [isLoading, setLoading] = useState(false);
34 |
35 |   const handleChange = async (value: string) => {
36 |     if (value.length > 0) {
37 |       setLoading(true);
38 |
39 |       try {
40 |         const { data } = await getTransactionsQuery(supabase, {
41 |           teamId,
42 |           to: 25,
43 |           from: 0,
44 |           searchQuery: value,
45 |         });
46 |
47 |         setLoading(false);
48 |
49 |         if (data) {
50 |           setItems(data);
51 |         }
52 |       } catch {
53 |         setLoading(false);
54 |       }
55 |     }
56 |   };
57 |
58 |   const options = items.map((item) => ({
59 |     id: item.id,
60 |     name: item.name,
61 |     component: () => (
62 |       <div className="dark:text-white flex w-full">
63 |         <div className="w-[50%] line-clamp-1 text-ellipsis overflow-hidden pr-8">
64 |           {item.name}
65 |         </div>
66 |         <div className="w-[70px]">{format(new Date(item.date), "d MMM")}</div>
67 |         <div className="flex-1 text-right">
68 |           <FormatAmount amount={item.amount} currency={item.currency} />
69 |         </div>
70 |       </div>
71 |     ),
72 |   }));
73 |
74 |   const selectedValue = selectedTransaction
75 |     ? {
76 |         id: selectedTransaction.id,
77 |         name: selectedTransaction.name,
78 |       }
79 |     : undefined;
80 |
81 |   return (
82 |     <Combobox
83 |       placeholder={placeholder}
84 |       className="w-full border-0 bg-transparent px-12"
85 |       classNameList="bottom-[60px]"
86 |       onValueChange={handleChange}
87 |       onSelect={(option) =>
88 |         onSelect({
89 |           id: inboxId,
90 |           transaction_id: option?.id,
91 |         })
92 |       }
93 |       onRemove={() => {
94 |         onSelect({
95 |           id: inboxId,
96 |           transaction_id: null,
97 |         });
98 |       }}
99 |       value={selectedValue}
100 |       options={options}
101 |       isLoading={isLoading}
102 |     />
103 |   );
104 | }
```

apps/dashboard/src/components/select-user.tsx
```
1 | "use client";
2 |
3 | import { useUserContext } from "@/store/user/hook";
4 | import { createClient } from "@midday/supabase/client";
5 | import { getTeamMembersQuery } from "@midday/supabase/queries";
6 | import { Spinner } from "@midday/ui/spinner";
7 | import { useEffect, useState } from "react";
8 | import { AssignedUser } from "./assigned-user";
9 |
10 | type User = {
11 |   id: string;
12 |   avatar_url?: string | null;
13 |   full_name: string | null;
14 | };
15 |
16 | type Props = {
17 |   selectedId?: string;
18 |   onSelect: (selected: User) => void;
19 | };
20 |
21 | export function SelectUser({ selectedId, onSelect }: Props) {
22 |   const [value, setValue] = useState<string>();
23 |   const [isLoading, setIsLoading] = useState<boolean>(true);
24 |   const supabase = createClient();
25 |   const [users, setUsers] = useState<User[]>([]);
26 |
27 |   const { team_id: teamId } = useUserContext((state) => state.data);
28 |
29 |   useEffect(() => {
30 |     setValue(selectedId);
31 |   }, [selectedId]);
32 |
33 |   useEffect(() => {
34 |     async function getUsers() {
35 |       const { data: membersData } = await getTeamMembersQuery(supabase, teamId);
36 |
37 |       setUsers(membersData?.map(({ user }) => user));
38 |       setIsLoading(false);
39 |     }
40 |
41 |     setIsLoading(true);
42 |     getUsers();
43 |   }, [supabase]);
44 |
45 |   if (!selectedId && isLoading) {
46 |     return (
47 |       <div className="w-full h-full flex items-center justify-center">
48 |         <Spinner />
49 |       </div>
50 |     );
51 |   }
52 |
53 |   return users.map((user) => {
54 |     return (
55 |       <button
56 |         type="button"
57 |         key={user.id}
58 |         className="flex items-center text-sm cursor-default"
59 |         onClick={() => onSelect(user)}
60 |       >
61 |         <AssignedUser avatarUrl={user.avatar_url} fullName={user.full_name} />
62 |       </button>
63 |     );
64 |   });
65 | }
```

apps/dashboard/src/components/setup-form.tsx
```
1 | "use client";
2 |
3 | import { updateUserSchema } from "@/actions/schema";
4 | import { updateUserAction } from "@/actions/update-user-action";
5 | import { zodResolver } from "@hookform/resolvers/zod";
6 | import { Button } from "@midday/ui/button";
7 | import {
8 |   Form,
9 |   FormControl,
10 |   FormDescription,
11 |   FormField,
12 |   FormItem,
13 |   FormLabel,
14 |   FormMessage,
15 | } from "@midday/ui/form";
16 | import { Input } from "@midday/ui/input";
17 | import { useToast } from "@midday/ui/use-toast";
18 | import { Loader2 } from "lucide-react";
19 | import { useAction } from "next-safe-action/hooks";
20 | import { useRouter } from "next/navigation";
21 | import { useRef } from "react";
22 | import { useForm } from "react-hook-form";
23 | import type { z } from "zod";
24 | import { AvatarUpload } from "./avatar-upload";
25 |
26 | type Props = {
27 |   userId: string;
28 |   avatarUrl?: string;
29 |   fullName?: string;
30 | };
31 |
32 | export function SetupForm({ userId, avatarUrl, fullName }: Props) {
33 |   const { toast } = useToast();
34 |   const router = useRouter();
35 |   const uploadRef = useRef<HTMLInputElement>(null);
36 |
37 |   const updateUser = useAction(updateUserAction, {
38 |     onError: () => {
39 |       toast({
40 |         duration: 3500,
41 |         variant: "error",
42 |         title: "Something went wrong please try again.",
43 |       });
44 |     },
45 |     onSuccess: () => {
46 |       router.replace("/");
47 |     },
48 |   });
49 |
50 |   const form = useForm<z.infer<typeof updateUserSchema>>({
51 |     resolver: zodResolver(updateUserSchema),
52 |     defaultValues: {
53 |       full_name: fullName ?? "",
54 |     },
55 |   });
56 |
57 |   const isSubmitting =
58 |     updateUser.status !== "idle" && updateUser.status !== "hasErrored";
59 |
60 |   return (
61 |     <Form {...form}>
62 |       <form
63 |         onSubmit={form.handleSubmit(updateUser.execute)}
64 |         className="space-y-8"
65 |       >
66 |         <div className="flex justify-between items-end gap-4">
67 |           <AvatarUpload
68 |             userId={userId}
69 |             avatarUrl={avatarUrl}
70 |             fullName={fullName}
71 |             size={80}
72 |             ref={uploadRef}
73 |           />
74 |           <Button
75 |             variant="outline"
76 |             type="button"
77 |             onClick={() => uploadRef.current?.click()}
78 |           >
79 |             Upload
80 |           </Button>
81 |         </div>
82 |
83 |         <FormField
84 |           control={form.control}
85 |           name="full_name"
86 |           render={({ field }) => (
87 |             <FormItem>
88 |               <FormLabel>Full name</FormLabel>
89 |               <FormControl>
90 |                 <Input placeholder="John Doe" {...field} />
91 |               </FormControl>
92 |               <FormDescription>
93 |                 This is your first and last name.
94 |               </FormDescription>
95 |               <FormMessage />
96 |             </FormItem>
97 |           )}
98 |         />
99 |
100 |         <Button type="submit" className="w-full" disabled={isSubmitting}>
101 |           {isSubmitting ? (
102 |             <Loader2 className="h-4 w-4 animate-spin" />
103 |           ) : (
104 |             <span>Save</span>
105 |           )}
106 |         </Button>
107 |       </form>
108 |     </Form>
109 |   );
110 | }
```

apps/dashboard/src/components/setup-mfa.tsx
```
1 | "use client";
2 |
3 | import { EnrollMFA } from "@/components/enroll-mfa";
4 | import { Button } from "@midday/ui/button";
5 | import { Icons } from "@midday/ui/icons";
6 | import Link from "next/link";
7 | import { useState } from "react";
8 |
9 | function MfaStart({ setEnroll }) {
10 |   return (
11 |     <>
12 |       <div className="flex w-full flex-col relative">
13 |         <div className="pb-4 bg-gradient-to-r from-primary dark:via-primary dark:to-[#848484] to-[#000] inline-block text-transparent bg-clip-text">
14 |           <h1 className="font-medium pb-1 text-3xl">
15 |             Multi-factor <br />
16 |             authentication
17 |           </h1>
18 |         </div>
19 |
20 |         <p className="font-medium pb-1 text-2xl text-[#606060]">
21 |           Add an additional layer of security to your account.
22 |         </p>
23 |
24 |         <div className="pointer-events-auto mt-6 flex flex-col mb-4">
25 |           <Button className="w-full" onClick={() => setEnroll(true)}>
26 |             Generate QR
27 |           </Button>
28 |         </div>
29 |       </div>
30 |
31 |       <div className="flex border-t-[1px] pt-4 mt-4 justify-center mb-6">
32 |         <Link href="/" className="text-medium text-sm" prefetch>
33 |           Skip
34 |         </Link>
35 |       </div>
36 |
37 |       <p className="text-xs text-[#878787]">
38 |         Generate one-time passwords via authenticator apps like 1Password,
39 |         Authy, etc. as a second factor to verify your identity during sign-in.
40 |       </p>
41 |     </>
42 |   );
43 | }
44 |
45 | export function SetupMfa() {
46 |   const [enroll, setEnroll] = useState(false);
47 |
48 |   let content = <MfaStart setEnroll={setEnroll} />;
49 |
50 |   if (enroll) {
51 |     content = <EnrollMFA />;
52 |   }
53 |
54 |   return (
55 |     <div>
56 |       <div className="absolute left-5 top-4 md:left-10 md:top-10">
57 |         <Link href="https://midday.ai">
58 |           <Icons.Logo />
59 |         </Link>
60 |       </div>
61 |
62 |       <div className="flex min-h-screen justify-center items-center overflow-hidden p-6 md:p-0">
63 |         <div className="relative z-20 m-auto flex w-full max-w-[380px] flex-col">
64 |           {content}
65 |         </div>
66 |       </div>
67 |     </div>
68 |   );
69 | }
```

apps/dashboard/src/components/share-report.tsx
```
1 | "use client";
2 |
3 | import { createReportAction } from "@/actions/report/create-report-action";
4 | import { zodResolver } from "@hookform/resolvers/zod";
5 | import { Button } from "@midday/ui/button";
6 | import { Calendar } from "@midday/ui/calendar";
7 | import {
8 |   DialogContent,
9 |   DialogDescription,
10 |   DialogFooter,
11 |   DialogHeader,
12 |   DialogTitle,
13 | } from "@midday/ui/dialog";
14 | import {
15 |   Form,
16 |   FormControl,
17 |   FormDescription,
18 |   FormField,
19 |   FormItem,
20 |   FormMessage,
21 | } from "@midday/ui/form";
22 | import { Popover, PopoverContent, PopoverTrigger } from "@midday/ui/popover";
23 | import { useToast } from "@midday/ui/use-toast";
24 | import { format } from "date-fns";
25 | import { Loader2 } from "lucide-react";
26 | import { CalendarIcon } from "lucide-react";
27 | import { useAction } from "next-safe-action/hooks";
28 | import Link from "next/link";
29 | import { useSearchParams } from "next/navigation";
30 | import { useForm } from "react-hook-form";
31 | import { z } from "zod";
32 | import { CopyInput } from "./copy-input";
33 |
34 | const formSchema = z.object({
35 |   expireAt: z.date().optional(),
36 | });
37 |
38 | type Props = {
39 |   defaultValue: {
40 |     from: string;
41 |     to: string;
42 |   };
43 |   type: "profit" | "revenue";
44 |   setOpen: (open: boolean) => void;
45 | };
46 |
47 | export function ShareReport({ defaultValue, type, setOpen }: Props) {
48 |   const { toast, dismiss } = useToast();
49 |
50 |   const searchParams = useSearchParams();
51 |   const from = searchParams?.get("from") ?? defaultValue.from;
52 |   const to = searchParams?.get("to") ?? defaultValue.to;
53 |
54 |   const form = useForm<z.infer<typeof formSchema>>({
55 |     resolver: zodResolver(formSchema),
56 |   });
57 |
58 |   function onSubmit(data: z.infer<typeof formSchema>) {
59 |     createReport.execute({
60 |       baseUrl: window.location.origin,
61 |       from,
62 |       to,
63 |       type,
64 |       expiresAt: data.expireAt && new Date(data.expireAt).toISOString(),
65 |     });
66 |   }
67 |
68 |   const createReport = useAction(createReportAction, {
69 |     onError: () => {
70 |       toast({
71 |         duration: 2500,
72 |         variant: "error",
73 |         title: "Something went wrong please try again.",
74 |       });
75 |     },
76 |     onSuccess: ({ data }) => {
77 |       setOpen(false);
78 |
79 |       const { id } = toast({
80 |         title: "Report published",
81 |         description: "Your report is ready to share.",
82 |         variant: "success",
83 |         footer: (
84 |           <div className="mt-4 space-x-2 flex w-full">
85 |             <CopyInput
86 |               value={data.short_link}
87 |               className="border-[#2C2C2C] w-full"
88 |             />
89 |
90 |             <Link href={data.short_link} onClick={() => dismiss(id)}>
91 |               <Button>View</Button>
92 |             </Link>
93 |           </div>
94 |         ),
95 |       });
96 |     },
97 |   });
98 |
99 |   return (
100 |     <DialogContent className="sm:max-w-[425px]">
101 |       <Form {...form}>
102 |         <form onSubmit={form.handleSubmit(onSubmit)} className="p-4 space-y-8">
103 |           <DialogHeader>
104 |             <DialogTitle>Share report</DialogTitle>
105 |             <DialogDescription>
106 |               Share a report from the period.
107 |             </DialogDescription>
108 |           </DialogHeader>
109 |
110 |           <FormField
111 |             control={form.control}
112 |             name="expireAt"
113 |             render={({ field }) => (
114 |               <FormItem className="flex flex-col">
115 |                 <Popover>
116 |                   <PopoverTrigger asChild>
117 |                     <FormControl>
118 |                       <Button variant="outline">
119 |                         {field.value ? (
120 |                           format(field.value, "PPP")
121 |                         ) : (
122 |                           <span>Expire at</span>
123 |                         )}
124 |                         <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
125 |                       </Button>
126 |                     </FormControl>
127 |                   </PopoverTrigger>
128 |                   <PopoverContent className="w-auto p-0" align="start">
129 |                     <Calendar
130 |                       mode="single"
131 |                       selected={field.value}
132 |                       onSelect={field.onChange}
133 |                       initialFocus
134 |                       disabled={(date) => date < new Date()}
135 |                     />
136 |                   </PopoverContent>
137 |                 </Popover>
138 |                 <FormDescription>
139 |                   A date when the report link will expire.
140 |                 </FormDescription>
141 |                 <FormMessage />
142 |               </FormItem>
143 |             )}
144 |           />
145 |
146 |           <DialogFooter>
147 |             <Button
148 |               type="submit"
149 |               disabled={createReport.status === "executing"}
150 |               className="w-full"
151 |             >
152 |               {createReport.status === "executing" ? (
153 |                 <Loader2 className="h-4 w-4 animate-spin" />
154 |               ) : (
155 |                 "Publish"
156 |               )}
157 |             </Button>
158 |           </DialogFooter>
159 |         </form>
160 |       </Form>
161 |     </DialogContent>
162 |   );
163 | }
```

apps/dashboard/src/components/sidebar.tsx
```
1 | import { Cookies } from "@/utils/constants";
2 | import { Icons } from "@midday/ui/icons";
3 | import { cookies } from "next/headers";
4 | import Link from "next/link";
5 | import { Suspense } from "react";
6 | import { MainMenu } from "./main-menu";
7 | import { TeamMenu } from "./team-menu";
8 |
9 | export function Sidebar() {
10 |   const initialItems = cookies().has(Cookies.MenuConfig)
11 |     ? JSON.parse(cookies().get(Cookies.MenuConfig)?.value)
12 |     : null;
13 |
14 |   return (
15 |     <aside className="h-screen flex-shrink-0 flex-col justify-between fixed top-0 ml-4 pb-4 items-center hidden md:flex">
16 |       <div className="flex flex-col items-center justify-center">
17 |         <div className="mt-6 todesktop:mt-[35px]">
18 |           <Link href="/">
19 |             <Icons.LogoSmall />
20 |           </Link>
21 |         </div>
22 |         <MainMenu initialItems={initialItems} />
23 |       </div>
24 |
25 |       <Suspense>
26 |         <TeamMenu />
27 |       </Suspense>
28 |     </aside>
29 |   );
30 | }
```

apps/dashboard/src/components/sign-out-button.tsx
```
1 | "use client";
2 |
3 | import { createClient } from "@midday/supabase/client";
4 | import { Button } from "@midday/ui/button";
5 |
6 | export function SignOutButton() {
7 |   const supabase = createClient();
8 |
9 |   return (
10 |     <Button
11 |       variant="outline"
12 |       className="w-full"
13 |       onClick={() => supabase.auth.signOut()}
14 |     >
15 |       Sign out
16 |     </Button>
17 |   );
18 | }
```

apps/dashboard/src/components/sign-out.tsx
```
1 | "use client";
2 |
3 | import { signOutAction } from "@/actions/sign-out-action";
4 | import { DropdownMenuItem } from "@midday/ui/dropdown-menu";
5 | import { useState } from "react";
6 |
7 | export function SignOut() {
8 |   const [isLoading, setLoading] = useState(false);
9 |
10 |   const handleSignOut = async () => {
11 |     setLoading(true);
12 |     signOutAction();
13 |   };
14 |
15 |   return (
16 |     <DropdownMenuItem onClick={handleSignOut}>
17 |       {isLoading ? "Loading..." : "Sign out"}
18 |     </DropdownMenuItem>
19 |   );
20 | }
```

apps/dashboard/src/components/slack-sign-in.tsx
```
1 | "use client";
2 |
3 | import { createClient } from "@midday/supabase/client";
4 | import { Button } from "@midday/ui/button";
5 | import { Icons } from "@midday/ui/icons";
6 | import { isDesktopApp } from "@todesktop/client-core/platform/todesktop";
7 | import { Loader2 } from "lucide-react";
8 | import { useState } from "react";
9 |
10 | export function SlackSignIn() {
11 |   const [isLoading, setLoading] = useState(false);
12 |   const supabase = createClient();
13 |
14 |   const handleSignIn = async () => {
15 |     setLoading(true);
16 |
17 |     if (isDesktopApp()) {
18 |       const redirectTo = new URL("/api/auth/callback", window.location.origin);
19 |
20 |       redirectTo.searchParams.append("provider", "slack");
21 |       redirectTo.searchParams.append("client", "desktop");
22 |
23 |       await supabase.auth.signInWithOAuth({
24 |         provider: "slack",
25 |         options: {
26 |           redirectTo: redirectTo.toString(),
27 |           queryParams: {
28 |             client: "desktop",
29 |           },
30 |         },
31 |       });
32 |     } else {
33 |       await supabase.auth.signInWithOAuth({
34 |         provider: "slack",
35 |         options: {
36 |           redirectTo: `${window.location.origin}/api/auth/callback?provider=slack`,
37 |         },
38 |       });
39 |     }
40 |   };
41 |
42 |   return (
43 |     <Button
44 |       onClick={handleSignIn}
45 |       className="active:scale-[0.98] bg-primary px-6 py-4 text-secondary font-medium flex space-x-2 h-[40px] w-full"
46 |     >
47 |       {isLoading ? (
48 |         <Loader2 className="h-4 w-4 animate-spin" />
49 |       ) : (
50 |         <>
51 |           <Icons.Slack />
52 |           <span>Continue with Slack</span>
53 |         </>
54 |       )}
55 |     </Button>
56 |   );
57 | }
```

apps/dashboard/src/components/support-form.tsx
```
1 | "use client";
2 |
3 | import { sendSupportSchema } from "@/actions/schema";
4 | import { sendSupportAction } from "@/actions/send-support-action";
5 | import { zodResolver } from "@hookform/resolvers/zod";
6 | import { Button } from "@midday/ui/button";
7 | import {
8 |   Form,
9 |   FormControl,
10 |   FormField,
11 |   FormItem,
12 |   FormLabel,
13 |   FormMessage,
14 | } from "@midday/ui/form";
15 | import { Input } from "@midday/ui/input";
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
32 |   const form = useForm<z.infer<typeof sendSupportSchema>>({
33 |     resolver: zodResolver(sendSupportSchema),
34 |     defaultValues: {
35 |       subject: undefined,
36 |       type: undefined,
37 |       priority: undefined,
38 |       message: undefined,
39 |     },
40 |   });
41 |
42 |   const sendSupport = useAction(sendSupportAction, {
43 |     onSuccess: () => {
44 |       toast({
45 |         duration: 2500,
46 |         title: "Support ticket sent.",
47 |         variant: "success",
48 |       });
49 |
50 |       form.reset();
51 |     },
52 |     onError: () => {
53 |       toast({
54 |         duration: 3500,
55 |         variant: "error",
56 |         title: "Something went wrong please try again.",
57 |       });
58 |     },
59 |   });
60 |
61 |   return (
62 |     <Form {...form}>
63 |       <form
64 |         onSubmit={form.handleSubmit(sendSupport.execute)}
65 |         className="space-y-8"
66 |       >
67 |         <FormField
68 |           control={form.control}
69 |           name="subject"
70 |           render={({ field }) => (
71 |             <FormItem>
72 |               <FormLabel>Subject</FormLabel>
73 |               <FormControl>
74 |                 <Input
75 |                   placeholder="Summary of the problem you have"
76 |                   {...field}
77 |                 />
78 |               </FormControl>
79 |               <FormMessage />
80 |             </FormItem>
81 |           )}
82 |         />
83 |
84 |         <div className="flex space-x-4">
85 |           <FormField
86 |             control={form.control}
87 |             name="type"
88 |             render={({ field }) => (
89 |               <FormItem className="w-full">
90 |                 <FormLabel>Product</FormLabel>
91 |                 <Select
92 |                   onValueChange={field.onChange}
93 |                   defaultValue={field.value}
94 |                 >
95 |                   <FormControl>
96 |                     <SelectTrigger>
97 |                       <SelectValue placeholder="Select Product" />
98 |                     </SelectTrigger>
99 |                   </FormControl>
100 |                   <SelectContent>
101 |                     <SelectItem value="Transactions">Transactions</SelectItem>
102 |                     <SelectItem value="Vault">Vault</SelectItem>
103 |                     <SelectItem value="Inbox">Inbox</SelectItem>
104 |                     <SelectItem value="Invoicing">Invoicing</SelectItem>
105 |                     <SelectItem value="Tracker">Tracker</SelectItem>
106 |                     <SelectItem value="AI">AI</SelectItem>
107 |                     <SelectItem value="General">General</SelectItem>
108 |                   </SelectContent>
109 |                 </Select>
110 |                 <FormMessage />
111 |               </FormItem>
112 |             )}
113 |           />
114 |           <FormField
115 |             control={form.control}
116 |             name="priority"
117 |             render={({ field }) => (
118 |               <FormItem className="w-full">
119 |                 <FormLabel>Severity</FormLabel>
120 |                 <Select
121 |                   onValueChange={field.onChange}
122 |                   defaultValue={field.value}
123 |                 >
124 |                   <FormControl>
125 |                     <SelectTrigger>
126 |                       <SelectValue placeholder="Select severity" />
127 |                     </SelectTrigger>
128 |                   </FormControl>
129 |                   <SelectContent>
130 |                     <SelectItem value="low">Low</SelectItem>
131 |                     <SelectItem value="normal">Normal</SelectItem>
132 |                     <SelectItem value="high">High</SelectItem>
133 |                     <SelectItem value="urgent">Urgent</SelectItem>
134 |                   </SelectContent>
135 |                 </Select>
136 |                 <FormMessage />
137 |               </FormItem>
138 |             )}
139 |           />
140 |         </div>
141 |
142 |         <FormField
143 |           control={form.control}
144 |           name="message"
145 |           render={({ field }) => (
146 |             <FormItem>
147 |               <FormLabel>Message</FormLabel>
148 |               <FormControl>
149 |                 <Textarea
150 |                   placeholder="Describe the issue you're facing, along with any relevant information. Please be as detailed and specific as possible."
151 |                   className="resize-none min-h-[150px]"
152 |                   {...field}
153 |                 />
154 |               </FormControl>
155 |
156 |               <FormMessage />
157 |             </FormItem>
158 |           )}
159 |         />
160 |
161 |         <Button
162 |           type="submit"
163 |           disabled={
164 |             sendSupport.status === "executing" || !form.formState.isValid
165 |           }
166 |         >
167 |           {sendSupport.status === "executing" ? (
168 |             <Loader2 className="h-4 w-4 animate-spin" />
169 |           ) : (
170 |             "Submit"
171 |           )}
172 |         </Button>
173 |       </form>
174 |     </Form>
175 |   );
176 | }
```

apps/dashboard/src/components/sync-transactions.tsx
```
1 | import { Button } from "@midday/ui/button";
2 | import { Icons } from "@midday/ui/icons";
3 | import {
4 |   Tooltip,
5 |   TooltipContent,
6 |   TooltipProvider,
7 |   TooltipTrigger,
8 | } from "@midday/ui/tooltip";
9 |
10 | type Props = {
11 |   disabled: boolean;
12 |   onClick: () => void;
13 | };
14 |
15 | export function SyncTransactions({ onClick, disabled }: Props) {
16 |   return (
17 |     <TooltipProvider delayDuration={70}>
18 |       <Tooltip>
19 |         <TooltipTrigger asChild>
20 |           <Button
21 |             variant="outline"
22 |             size="icon"
23 |             className="rounded-full w-7 h-7 flex items-center"
24 |             disabled={disabled}
25 |             onClick={onClick}
26 |           >
27 |             <Icons.Refresh size={16} />
28 |           </Button>
29 |         </TooltipTrigger>
30 |
31 |         <TooltipContent className="px-3 py-1.5 text-xs" sideOffset={10}>
32 |           Synchronize
33 |         </TooltipContent>
34 |       </Tooltip>
35 |     </TooltipProvider>
36 |   );
37 | }
```

apps/dashboard/src/components/system-banner.tsx
```
1 | export function SystemBanner() {
2 |   return (
3 |     <div className="p-1 fixed left-0 right-0 top-0 bg-[#FFD02B] z-50 text-center flex items-center justify-center text-black text-sm font-medium">
4 |       <span>
5 |         We are currently investigating a technical issue, follow{" "}
6 |         <a href="https://status.midday.ai" className="underline">
7 |           status.midday.ai
8 |         </a>{" "}
9 |         for updates.
10 |       </span>
11 |     </div>
12 |   );
13 | }
```

apps/dashboard/src/components/team-avatar.tsx
```
1 | "use client";
2 |
3 | import { updateTeamAction } from "@/actions/update-team-action";
4 | import { useUpload } from "@/hooks/use-upload";
5 | import { Avatar, AvatarFallback, AvatarImage } from "@midday/ui/avatar";
6 | import {
7 |   Card,
8 |   CardDescription,
9 |   CardFooter,
10 |   CardHeader,
11 |   CardTitle,
12 | } from "@midday/ui/card";
13 | import { stripSpecialCharacters } from "@midday/utils";
14 | import { Loader2 } from "lucide-react";
15 | import { useAction } from "next-safe-action/hooks";
16 | import { useRef } from "react";
17 |
18 | export function TeamAvatar({ teamId, logoUrl, name }) {
19 |   const action = useAction(updateTeamAction);
20 |   const inputRef = useRef<HTMLInputElement>(null);
21 |   const { isLoading, uploadFile } = useUpload();
22 |
23 |   const handleUpload = async (evt: React.ChangeEvent<HTMLInputElement>) => {
24 |     const { files } = evt.target;
25 |     const selectedFile = files as FileList;
26 |
27 |     const filename = stripSpecialCharacters(selectedFile[0]?.name);
28 |
29 |     const { url } = await uploadFile({
30 |       bucket: "avatars",
31 |       path: [teamId, filename],
32 |       file: selectedFile[0] as File,
33 |     });
34 |
35 |     if (url) {
36 |       action.execute({ logo_url: url, revalidatePath: "/settings" });
37 |     }
38 |   };
39 |
40 |   return (
41 |     <Card>
42 |       <div className="flex justify-between items-center pr-6">
43 |         <CardHeader>
44 |           <CardTitle>Team Avatar</CardTitle>
45 |           <CardDescription>
46 |             This is your team's avatar. Click on the avatar to upload a custom
47 |             one from your files.
48 |           </CardDescription>
49 |         </CardHeader>
50 |
51 |         <Avatar
52 |           className="rounded-full w-16 h-16 flex items-center justify-center bg-accent cursor-pointer"
53 |           onClick={() => inputRef?.current?.click()}
54 |         >
55 |           {isLoading ? (
56 |             <Loader2 className="h-4 w-4 animate-spin" />
57 |           ) : (
58 |             <>
59 |               <AvatarImage
60 |                 src={logoUrl}
61 |                 alt={name}
62 |                 width={64}
63 |                 height={64}
64 |                 quality={100}
65 |               />
66 |               <AvatarFallback>
67 |                 <span className="text-md">{name?.charAt(0)}</span>
68 |               </AvatarFallback>
69 |             </>
70 |           )}
71 |
72 |           <input
73 |             ref={inputRef}
74 |             type="file"
75 |             style={{ display: "none" }}
76 |             multiple={false}
77 |             onChange={handleUpload}
78 |           />
79 |         </Avatar>
80 |       </div>
81 |       <CardFooter>An avatar is optional but strongly recommended.</CardFooter>
82 |     </Card>
83 |   );
84 | }
```

apps/dashboard/src/components/team-dropdown.tsx
```
1 | "use client";
2 |
3 | import { changeTeamAction } from "@/actions/change-team-action";
4 | import { CreateTeamModal } from "@/components/modals/create-team-modal";
5 | import { Avatar, AvatarFallback, AvatarImageNext } from "@midday/ui/avatar";
6 | import { Button } from "@midday/ui/button";
7 | import { Dialog } from "@midday/ui/dialog";
8 | import { Icons } from "@midday/ui/icons";
9 | import { useClickAway } from "@uidotdev/usehooks";
10 | import { motion } from "framer-motion";
11 | import { useAction } from "next-safe-action/hooks";
12 | import { useState } from "react";
13 |
14 | type Team = {
15 |   team: {
16 |     id: string;
17 |     name: string;
18 |     logo_url: string;
19 |   };
20 | };
21 |
22 | type Props = {
23 |   selectedTeamId: string;
24 |   teams: Team[];
25 | };
26 |
27 | export function TeamDropdown({ selectedTeamId: initialId, teams }: Props) {
28 |   const [selectedId, setSelectedId] = useState(initialId);
29 |   const [isActive, setActive] = useState(false);
30 |   const [isOpen, onOpenChange] = useState(false);
31 |   const changeTeam = useAction(changeTeamAction);
32 |
33 |   const sortedTeams = teams.sort((a, b) => {
34 |     if (a.team.id === selectedId) return -1;
35 |     if (b.team.id === selectedId) return 1;
36 |
37 |     return a.team.id.localeCompare(b.team.id);
38 |   });
39 |
40 |   const ref = useClickAway(() => {
41 |     setActive(false);
42 |   });
43 |
44 |   const toggleActive = () => setActive((prev) => !prev);
45 |
46 |   return (
47 |     <Dialog open={isOpen} onOpenChange={onOpenChange}>
48 |       <motion.div ref={ref} layout className="w-[32px] h-[32px] relative">
49 |         {[...sortedTeams, { team: { id: "add" } }].map(({ team }, index) => (
50 |           <motion.div
51 |             key={team.id}
52 |             className="w-[32px] h-[32px] left-0 overflow-hidden absolute"
53 |             style={{ zIndex: -index }}
54 |             initial={{
55 |               scale: `${100 - index * 16}%`,
56 |               y: index * 5,
57 |             }}
58 |             {...(isActive && {
59 |               animate: {
60 |                 y: -(32 + 10) * index,
61 |                 scale: "100%",
62 |               },
63 |             })}
64 |           >
65 |             {team.id === "add" ? (
66 |               <>
67 |                 <Button
68 |                   className="w-[32px] h-[32px]"
69 |                   size="icon"
70 |                   variant="outline"
71 |                   onClick={() => {
72 |                     onOpenChange(true);
73 |                     setActive(false);
74 |                   }}
75 |                 >
76 |                   <Icons.Add />
77 |                 </Button>
78 |
79 |                 <CreateTeamModal onOpenChange={onOpenChange} />
80 |               </>
81 |             ) : (
82 |               <Avatar
83 |                 className="w-[32px] h-[32px] rounded-none border border-[#DCDAD2] dark:border-[#2C2C2C] cursor-pointer"
84 |                 onClick={() => {
85 |                   if (index === 0) {
86 |                     toggleActive();
87 |                   } else {
88 |                     setSelectedId(team.id);
89 |                     setActive(false);
90 |                     changeTeam.execute({ teamId: team.id, redirectTo: "/" });
91 |                   }
92 |                 }}
93 |               >
94 |                 <AvatarImageNext
95 |                   src={team?.logo_url}
96 |                   alt={team?.name ?? ""}
97 |                   width={20}
98 |                   height={20}
99 |                   quality={100}
100 |                 />
101 |                 <AvatarFallback className="rounded-none w-[32px] h-[32px]">
102 |                   <span className="text-xs">
103 |                     {team?.name?.charAt(0)?.toUpperCase()}
104 |                     {team?.name?.charAt(1)?.toUpperCase()}
105 |                   </span>
106 |                 </AvatarFallback>
107 |               </Avatar>
108 |             )}
109 |           </motion.div>
110 |         ))}
111 |       </motion.div>
112 |     </Dialog>
113 |   );
114 | }
```

apps/dashboard/src/components/team-members.tsx
```
1 | import { PendingInvitesTable } from "@/components/tables/pending-invites";
2 | import { Tabs, TabsContent, TabsList, TabsTrigger } from "@midday/ui/tabs";
3 | import { Suspense } from "react";
4 | import { MembersTable } from "./tables/members";
5 | import { PendingInvitesSkeleton } from "./tables/pending-invites/table";
6 |
7 | export function TeamMembers() {
8 |   return (
9 |     <Tabs defaultValue="members">
10 |       <TabsList className="bg-transparent border-b-[1px] w-full justify-start rounded-none mb-1 p-0 h-auto pb-4">
11 |         <TabsTrigger value="members" className="p-0 m-0 mr-4">
12 |           Team Members
13 |         </TabsTrigger>
14 |         <TabsTrigger value="pending" className="p-0 m-0">
15 |           Pending Invitations
16 |         </TabsTrigger>
17 |       </TabsList>
18 |
19 |       <TabsContent value="members">
20 |         <Suspense fallback={<PendingInvitesSkeleton />}>
21 |           <MembersTable />
22 |         </Suspense>
23 |       </TabsContent>
24 |
25 |       <TabsContent value="pending">
26 |         <Suspense fallback={<PendingInvitesSkeleton />}>
27 |           <PendingInvitesTable />
28 |         </Suspense>
29 |       </TabsContent>
30 |     </Tabs>
31 |   );
32 | }
```

apps/dashboard/src/components/team-menu.tsx
```
1 | import { TeamDropdown } from "@/components/team-dropdown";
2 | import { getTeams, getUser } from "@midday/supabase/cached-queries";
3 |
4 | export async function TeamMenu() {
5 |   const user = await getUser();
6 |   const teams = await getTeams();
7 |
8 |   return (
9 |     <TeamDropdown
10 |       selectedTeamId={user?.data?.team?.id}
11 |       teams={teams?.data}
12 |       key={user?.data?.team?.id}
13 |     />
14 |   );
15 | }
```

apps/dashboard/src/components/team-name.tsx
```
1 | "use client";
2 |
3 | import { UpdateTeamFormValues, updateTeamSchema } from "@/actions/schema";
4 | import { updateTeamAction } from "@/actions/update-team-action";
5 | import { zodResolver } from "@hookform/resolvers/zod";
6 | import { Button } from "@midday/ui/button";
7 | import {
8 |   Card,
9 |   CardContent,
10 |   CardDescription,
11 |   CardFooter,
12 |   CardHeader,
13 |   CardTitle,
14 | } from "@midday/ui/card";
15 | import {
16 |   Form,
17 |   FormControl,
18 |   FormField,
19 |   FormItem,
20 |   FormMessage,
21 | } from "@midday/ui/form";
22 | import { Input } from "@midday/ui/input";
23 | import { Loader2 } from "lucide-react";
24 | import { useAction } from "next-safe-action/hooks";
25 | import { useForm } from "react-hook-form";
26 |
27 | export function TeamName({ name }) {
28 |   const action = useAction(updateTeamAction);
29 |   const form = useForm<UpdateTeamFormValues>({
30 |     resolver: zodResolver(updateTeamSchema),
31 |     defaultValues: {
32 |       name,
33 |       revalidatePath: "/settings",
34 |     },
35 |   });
36 |
37 |   const onSubmit = form.handleSubmit((data) => {
38 |     action.execute(data);
39 |   });
40 |
41 |   return (
42 |     <Form {...form}>
43 |       <form onSubmit={onSubmit}>
44 |         <Card>
45 |           <CardHeader>
46 |             <CardTitle>Team Name</CardTitle>
47 |             <CardDescription>
48 |               This is your team's visible name within Midday. For example, the
49 |               name of your company or department.
50 |             </CardDescription>
51 |           </CardHeader>
52 |
53 |           <CardContent>
54 |             <FormField
55 |               control={form.control}
56 |               name="name"
57 |               render={({ field }) => (
58 |                 <FormItem>
59 |                   <FormControl>
60 |                     <Input
61 |                       {...field}
62 |                       className="max-w-[300px]"
63 |                       autoComplete="off"
64 |                       autoCapitalize="none"
65 |                       autoCorrect="off"
66 |                       spellCheck="false"
67 |                       maxLength="32"
68 |                     />
69 |                   </FormControl>
70 |                   <FormMessage />
71 |                 </FormItem>
72 |               )}
73 |             />
74 |           </CardContent>
75 |
76 |           <CardFooter className="flex justify-between">
77 |             <div>Please use 32 characters at maximum.</div>
78 |             <Button type="submit" disabled={action.status === "executing"}>
79 |               {action.status === "executing" ? (
80 |                 <Loader2 className="h-4 w-4 animate-spin" />
81 |               ) : (
82 |                 "Save"
83 |               )}
84 |             </Button>
85 |           </CardFooter>
86 |         </Card>
87 |       </form>
88 |     </Form>
89 |   );
90 | }
```

apps/dashboard/src/components/teller-connect.tsx
```
1 | import { useConnectParams } from "@/hooks/use-connect-params";
2 | import { track } from "@midday/events/client";
3 | import { LogEvents } from "@midday/events/events";
4 | import { useTheme } from "next-themes";
5 | import { useEffect, useState } from "react";
6 | import { BankConnectButton } from "./bank-connect-button";
7 |
8 | type Props = {
9 |   id: string;
10 |   onSelect: (id: string) => void;
11 | };
12 |
13 | export function TellerConnect({ id, onSelect }: Props) {
14 |   const [institution, setInstitution] = useState<string | undefined>();
15 |   const { setParams } = useConnectParams();
16 |   const { theme } = useTheme();
17 |
18 |   useEffect(() => {
19 |     if (institution) {
20 |       const teller = window.TellerConnect.setup({
21 |         applicationId: process.env.NEXT_PUBLIC_TELLER_APPLICATION_ID!,
22 |         environment: process.env.NEXT_PUBLIC_TELLER_ENVIRONMENT,
23 |         institution,
24 |         appearance: theme,
25 |         onSuccess: (authorization) => {
26 |           setParams({
27 |             step: "account",
28 |             provider: "teller",
29 |             token: authorization.accessToken,
30 |             enrollment_id: authorization.enrollment.id,
31 |           });
32 |
33 |           track({
34 |             event: LogEvents.ConnectBankAuthorized.name,
35 |             channel: LogEvents.ConnectBankAuthorized.channel,
36 |             provider: "teller",
37 |           });
38 |         },
39 |         onExit: () => {
40 |           setParams({ step: "connect" });
41 |           track({
42 |             event: LogEvents.ConnectBankCanceled.name,
43 |             channel: LogEvents.ConnectBankCanceled.channel,
44 |             provider: "teller",
45 |           });
46 |
47 |           setParams({ step: "connect" });
48 |         },
49 |         onFailure: () => {
50 |           setParams({ step: "connect" });
51 |         },
52 |       });
53 |
54 |       // NOTE: Because we are configure Teller with institution we need to
55 |       // Regenerate the SDK, and that gives us a white background, let's wait until it's fully loaded
56 |       setTimeout(() => {
57 |         teller.open();
58 |       }, 1000);
59 |     }
60 |   }, [institution]);
61 |
62 |   return (
63 |     <BankConnectButton
64 |       onClick={() => {
65 |         onSelect(id);
66 |         setInstitution(id);
67 |       }}
68 |     />
69 |   );
70 | }
```

apps/dashboard/src/components/theme-provider.tsx
```
1 | "use client";
2 |
3 | import { ThemeProvider as NextThemesProvider } from "next-themes";
4 | import * as React from "react";
5 | type ThemeProviderProps = Parameters<typeof NextThemesProvider>[0];
6 |
7 | export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
8 |   return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
9 | }
```

apps/dashboard/src/components/theme-switch.tsx
```
1 | "use client";
2 |
3 | import { Monitor, Moon, Sun } from "lucide-react";
4 | import { useTheme } from "next-themes";
5 |
6 | import {
7 |   Select,
8 |   SelectContent,
9 |   SelectGroup,
10 |   SelectItem,
11 |   SelectTrigger,
12 |   SelectValue,
13 | } from "@midday/ui/select";
14 |
15 | type Theme = "dark" | "system" | "light";
16 |
17 | type Props = {
18 |   currentTheme?: Theme;
19 | };
20 |
21 | const ThemeIcon = ({ currentTheme }: Props) => {
22 |   switch (currentTheme) {
23 |     case "dark":
24 |       return <Moon size={12} />;
25 |     case "system":
26 |       return <Monitor size={12} />;
27 |     default:
28 |       return <Sun size={12} />;
29 |   }
30 | };
31 |
32 | export const ThemeSwitch = () => {
33 |   const { theme, setTheme, themes } = useTheme();
34 |
35 |   return (
36 |     <div className="flex items-center relative">
37 |       <Select
38 |         defaultValue={theme}
39 |         onValueChange={(value: Theme) => setTheme(value)}
40 |       >
41 |         <SelectTrigger className="w-full pl-6 pr-3 py-1.5 bg-transparent outline-none capitalize h-[32px] text-xs">
42 |           <SelectValue placeholder="Select theme" />
43 |         </SelectTrigger>
44 |         <SelectContent>
45 |           <SelectGroup>
46 |             {themes.map((theme) => (
47 |               <SelectItem key={theme} value={theme} className="capitalize">
48 |                 {theme}
49 |               </SelectItem>
50 |             ))}
51 |           </SelectGroup>
52 |         </SelectContent>
53 |       </Select>
54 |
55 |       <div className="absolute left-2 pointer-events-none">
56 |         <ThemeIcon currentTheme={theme as Theme} />
57 |       </div>
58 |     </div>
59 |   );
60 | };
```

apps/dashboard/src/components/time-format-settings.tsx
```
1 | "use client";
2 |
3 | import { updateUserAction } from "@/actions/update-user-action";
4 | import {
5 |   Card,
6 |   CardContent,
7 |   CardDescription,
8 |   CardHeader,
9 |   CardTitle,
10 | } from "@midday/ui/card";
11 | import {
12 |   Select,
13 |   SelectContent,
14 |   SelectItem,
15 |   SelectTrigger,
16 |   SelectValue,
17 | } from "@midday/ui/select";
18 | import { useAction } from "next-safe-action/hooks";
19 |
20 | type Props = {
21 |   timeFormat: string;
22 | };
23 |
24 | export function TimeFormatSettings({ timeFormat }: Props) {
25 |   const action = useAction(updateUserAction);
26 |
27 |   return (
28 |     <Card className="flex justify-between items-center">
29 |       <CardHeader>
30 |         <CardTitle>Time Display Format</CardTitle>
31 |         <CardDescription>
32 |           Choose between 12-hour or 24-hour clock format for displaying time.
33 |         </CardDescription>
34 |       </CardHeader>
35 |
36 |       <CardContent>
37 |         <Select
38 |           defaultValue={timeFormat.toString()}
39 |           onValueChange={(value) => {
40 |             action.execute({ time_format: +value });
41 |           }}
42 |         >
43 |           <SelectTrigger className="w-[180px]">
44 |             <SelectValue placeholder="Time format" />
45 |           </SelectTrigger>
46 |           <SelectContent>
47 |             <SelectItem value="12">12 hours (AM/PM)</SelectItem>
48 |             <SelectItem value="24">24 hours</SelectItem>
49 |           </SelectContent>
50 |         </Select>
51 |       </CardContent>
52 |     </Card>
53 |   );
54 | }
```

apps/dashboard/src/components/tracker-calendar.tsx
```
1 | "use client";
2 |
3 | import { useTrackerParams } from "@/hooks/use-tracker-params";
4 | import { useUserContext } from "@/store/user/hook";
5 | import { formatAmount, secondsToHoursAndMinutes } from "@/utils/format";
6 | import { TZDate } from "@date-fns/tz";
7 | import { cn } from "@midday/ui/cn";
8 | import { Icons } from "@midday/ui/icons";
9 | import {
10 |   Tooltip,
11 |   TooltipContent,
12 |   TooltipProvider,
13 |   TooltipTrigger,
14 | } from "@midday/ui/tooltip";
15 | import NumberFlow from "@number-flow/react";
16 | import { useClickAway } from "@uidotdev/usehooks";
17 | import {
18 |   addMonths,
19 |   eachDayOfInterval,
20 |   endOfMonth,
21 |   endOfWeek,
22 |   format,
23 |   formatISO,
24 |   isToday,
25 |   startOfMonth,
26 |   startOfWeek,
27 |   subMonths,
28 | } from "date-fns";
29 | import { useCallback, useState } from "react";
30 | import { useHotkeys } from "react-hotkeys-hook";
31 | import { TrackerEvents } from "./tracker-events";
32 | import { TrackerMonthSelect } from "./tracker-month-select";
33 |
34 | type Props = {
35 |   weekStartsOnMonday?: boolean;
36 |   timeFormat: number;
37 | };
38 |
39 | export function TrackerCalendar({
40 |   weekStartsOnMonday = false,
41 |   timeFormat,
42 |   data,
43 |   meta,
44 | }: Props) {
45 |   const {
46 |     date: currentDate,
47 |     range,
48 |     setParams,
49 |     selectedDate,
50 |   } = useTrackerParams();
51 |   const [localRange, setLocalRange] = useState<[string, string | null]>([
52 |     "",
53 |     null,
54 |   ]);
55 |   const [isDragging, setIsDragging] = useState(false);
56 |
57 |   const { calendarDays, firstWeek } = useCalendarDates(
58 |     new TZDate(currentDate, "UTC"),
59 |     weekStartsOnMonday,
60 |   );
61 |
62 |   useHotkeys(
63 |     "arrowLeft",
64 |     () => handleMonthChange(-1, new TZDate(currentDate, "UTC"), setParams),
65 |     {
66 |       enabled: !selectedDate,
67 |     },
68 |   );
69 |
70 |   useHotkeys(
71 |     "arrowRight",
72 |     () => handleMonthChange(1, new TZDate(currentDate, "UTC"), setParams),
73 |     {
74 |       enabled: !selectedDate,
75 |     },
76 |   );
77 |
78 |   const ref = useClickAway<HTMLDivElement>(() => {
79 |     if (range?.length === 1) setParams({ range: null });
80 |   });
81 |
82 |   const handleMouseDown = (date: TZDate) => {
83 |     setIsDragging(true);
84 |     setLocalRange([formatISO(date, { representation: "date" }), null]);
85 |   };
86 |
87 |   const handleMouseEnter = (date: TZDate) => {
88 |     if (isDragging) {
89 |       setLocalRange((prev) => [
90 |         prev[0],
91 |         formatISO(date, { representation: "date" }),
92 |       ]);
93 |     }
94 |   };
95 |
96 |   const handleMouseUp = () => {
97 |     setIsDragging(false);
98 |     if (localRange[0] && localRange[1]) {
99 |       let start = new TZDate(localRange[0], "UTC");
100 |       let end = new TZDate(localRange[1], "UTC");
101 |       if (start > end) [start, end] = [end, start];
102 |
103 |       setParams({ range: [localRange[0], localRange[1]] });
104 |     } else if (localRange[0]) {
105 |       setParams({ selectedDate: localRange[0] });
106 |     }
107 |     setLocalRange(["", null]);
108 |   };
109 |
110 |   return (
111 |     <div ref={ref}>
112 |       <div className="mt-8">
113 |         <CalendarHeader
114 |           meta={meta}
115 |           data={data}
116 |           timeFormat={timeFormat}
117 |           weekStartsOnMonday={weekStartsOnMonday}
118 |         />
119 |         <CalendarGrid
120 |           firstWeek={firstWeek}
121 |           calendarDays={calendarDays}
122 |           currentDate={new TZDate(currentDate, "UTC")}
123 |           selectedDate={selectedDate}
124 |           data={data}
125 |           range={range}
126 |           localRange={localRange}
127 |           isDragging={isDragging}
128 |           weekStartsOnMonday={weekStartsOnMonday}
129 |           handleMouseDown={handleMouseDown}
130 |           handleMouseEnter={handleMouseEnter}
131 |           handleMouseUp={handleMouseUp}
132 |         />
133 |       </div>
134 |     </div>
135 |   );
136 | }
137 |
138 | function useCalendarDates(currentDate: TZDate, weekStartsOnMonday: boolean) {
139 |   const monthStart = startOfMonth(currentDate);
140 |   const monthEnd = endOfMonth(currentDate);
141 |   const calendarStart = startOfWeek(monthStart, {
142 |     weekStartsOn: weekStartsOnMonday ? 1 : 0,
143 |   });
144 |   const calendarEnd = endOfWeek(monthEnd, {
145 |     weekStartsOn: weekStartsOnMonday ? 1 : 0,
146 |   });
147 |   const calendarDays = eachDayOfInterval({
148 |     start: calendarStart,
149 |     end: calendarEnd,
150 |   }).map((date) => new TZDate(date, "UTC"));
151 |   const firstWeek = eachDayOfInterval({
152 |     start: calendarStart,
153 |     end: endOfWeek(calendarStart, { weekStartsOn: weekStartsOnMonday ? 1 : 0 }),
154 |   }).map((date) => new TZDate(date, "UTC"));
155 |
156 |   return {
157 |     monthStart,
158 |     monthEnd,
159 |     calendarStart,
160 |     calendarEnd,
161 |     calendarDays,
162 |     firstWeek,
163 |   };
164 | }
165 |
166 | function handleMonthChange(
167 |   direction: number,
168 |   currentDate: TZDate,
169 |   setParams: (params: any) => void,
170 | ) {
171 |   const newDate =
172 |     direction > 0 ? addMonths(currentDate, 1) : subMonths(currentDate, 1);
173 |   setParams({
174 |     date: formatISO(newDate, { representation: "date" }),
175 |   });
176 | }
177 |
178 | type CalendarHeaderProps = {
179 |   meta: { totalDuration?: number };
180 |   data: Record<string, TrackerEvent[]>;
181 | };
182 |
183 | function CalendarHeader({ meta, data }: CalendarHeaderProps) {
184 |   const { locale } = useUserContext((state) => state.data);
185 |
[TRUNCATED]
```

apps/dashboard/src/components/tracker-day-select.tsx
```
1 | import { useTrackerParams } from "@/hooks/use-tracker-params";
2 | import { formatDateRange } from "@/utils/format";
3 | import { getTrackerDates } from "@/utils/tracker";
4 | import { TZDate } from "@date-fns/tz";
5 | import { Button } from "@midday/ui/button";
6 | import { cn } from "@midday/ui/cn";
7 | import { Icons } from "@midday/ui/icons";
8 | import { addDays, formatISO, subDays } from "date-fns";
9 | import { useHotkeys } from "react-hotkeys-hook";
10 |
11 | type Props = {
12 |   className?: string;
13 | };
14 |
15 | export function TrackerDaySelect({ className }: Props) {
16 |   const { setParams, range, selectedDate } = useTrackerParams();
17 |   const currentDate = getTrackerDates(range, selectedDate);
18 |
19 |   const selectPrevDay = () => {
20 |     if (currentDate[0]) {
21 |       const prevDay = new TZDate(subDays(currentDate[0], 1), "UTC");
22 |       setParams({
23 |         selectedDate: formatISO(prevDay, { representation: "date" }),
24 |         range: null,
25 |       });
26 |     }
27 |   };
28 |
29 |   const selectNextDay = () => {
30 |     if (currentDate[0]) {
31 |       const nextDay = new TZDate(addDays(currentDate[0], 1), "UTC");
32 |       setParams({
33 |         selectedDate: formatISO(nextDay, { representation: "date" }),
34 |         range: null,
35 |       });
36 |     }
37 |   };
38 |
39 |   useHotkeys("arrowLeft", selectPrevDay);
40 |   useHotkeys("arrowRight", selectNextDay);
41 |
42 |   return (
43 |     <div className={cn("flex items-center border h-9", className)}>
44 |       <Button
45 |         variant="ghost"
46 |         size="icon"
47 |         className="p-0 w-6 h-6 hover:bg-transparent mr-4 ml-2"
48 |         onClick={selectPrevDay}
49 |       >
50 |         <Icons.ChevronLeft className="w-6 h-6" />
51 |       </Button>
52 |       <span className="w-full text-center">
53 |         {formatDateRange(
54 |           range
55 |             ? [
56 |                 new TZDate(currentDate[0].getTime(), "UTC"),
57 |                 new TZDate(
58 |                   currentDate[1]?.getTime() ?? currentDate[0].getTime(),
59 |                   "UTC",
60 |                 ),
61 |               ]
62 |             : [new TZDate(currentDate[0].getTime(), "UTC")],
63 |         )}
64 |       </span>
65 |       <Button
66 |         variant="ghost"
67 |         size="icon"
68 |         className="p-0 w-6 h-6 hover:bg-transparent ml-4 mr-2"
69 |         onClick={selectNextDay}
70 |       >
71 |         <Icons.ChevronRight className="w-6 h-6" />
72 |       </Button>
73 |     </div>
74 |   );
75 | }
```

apps/dashboard/src/components/tracker-entries-list.tsx
```
1 | import { secondsToHoursAndMinutes } from "@/utils/format";
2 | import { format } from "date-fns";
3 | import { CreateRecordForm } from "./forms/create-record-form";
4 | import { RecordSkeleton, UpdateRecordForm } from "./forms/update-record-form";
5 |
6 | export function TrackerEntriesList({
7 |   data,
8 |   date,
9 |   user,
10 |   isLoading,
11 |   onCreate,
12 |   onDelete,
13 |   projectId,
14 | }) {
15 |   const currentDate = date ? new Date(date) : new Date();
16 |   const totalDuration = data?.reduce(
17 |     (duration, item) => item.duration + duration,
18 |     0
19 |   );
20 |
21 |   return (
22 |     <div>
23 |       <div className="flex justify-between border-b-[1px] mt-12 mb-4 pb-2">
24 |         <span>{format(currentDate, "LLL d")}</span>
25 |         <span>{secondsToHoursAndMinutes(totalDuration)}</span>
26 |       </div>
27 |
28 |       {isLoading && <RecordSkeleton />}
29 |
30 |       {data?.map((record) => (
31 |         <UpdateRecordForm
32 |           id={record.id}
33 |           key={record.id}
34 |           assigned={record.assigned}
35 |           description={record.description}
36 |           duration={record.duration}
37 |           onDelete={onDelete}
38 |         />
39 |       ))}
40 |
41 |       <CreateRecordForm
42 |         userId={user.id}
43 |         onCreate={onCreate}
44 |         projectId={projectId}
45 |       />
46 |     </div>
47 |   );
48 | }
```

apps/dashboard/src/components/tracker-events.tsx
```
1 | "use client";
2 |
3 | import { secondsToHoursAndMinutes } from "@/utils/format";
4 | import { cn } from "@midday/ui/cn";
5 |
6 | export function TrackerEvents({
7 |   data,
8 |   isToday,
9 | }: { data: TrackerEvent[]; isToday: boolean }) {
10 |   return (
11 |     <div className="flex flex-col space-y-2 font-sans w-full">
12 |       {data && data.length > 0 && (
13 |         <div
14 |           className={cn(
15 |             "text-xs bg-[#F0F0F0] dark:bg-[#1D1D1D] text-[#606060] dark:text-[#878787] p-1 w-full text-left line-clamp-1 min-h-[23px]",
16 |             isToday && "!bg-background",
17 |           )}
18 |           key={data[0].id}
19 |         >
20 |           {data[0].project.name} ({secondsToHoursAndMinutes(data[0].duration)})
21 |         </div>
22 |       )}
23 |       {data && data.length > 1 && (
24 |         <div className="text-xs text-primary p-1 w-full text-left">
25 |           +{data.length - 1} more
26 |         </div>
27 |       )}
28 |     </div>
29 |   );
30 | }
```

apps/dashboard/src/components/tracker-export-csv.tsx
```
1 | import { secondsToHoursAndMinutes } from "@/utils/format";
2 | import { UTCDate } from "@date-fns/utc";
3 | import { createClient } from "@midday/supabase/client";
4 | import { Button } from "@midday/ui/button";
5 | import { Calendar } from "@midday/ui/calendar";
6 | import {
7 |   DropdownMenuGroup,
8 |   DropdownMenuPortal,
9 |   DropdownMenuSub,
10 |   DropdownMenuSubContent,
11 |   DropdownMenuSubTrigger,
12 | } from "@midday/ui/dropdown-menu";
13 | import {
14 |   Select,
15 |   SelectContent,
16 |   SelectItem,
17 |   SelectTrigger,
18 |   SelectValue,
19 | } from "@midday/ui/select";
20 | import { endOfMonth, format, startOfMonth, subMonths } from "date-fns";
21 | import Papa from "papaparse";
22 | import React, { useState } from "react";
23 | import type { DateRange } from "react-day-picker";
24 |
25 | type Props = {
26 |   name: string;
27 |   projectId: string;
28 |   teamId: string;
29 |   userId: string;
30 | };
31 |
32 | export function TrackerExportCSV({ name, teamId, projectId, userId }: Props) {
33 |   const [includeTeam, setIncludeTeam] = useState(false);
34 |   const [date, setDate] = useState<DateRange | undefined>({
35 |     from: startOfMonth(new Date()),
36 |     to: endOfMonth(new Date()),
37 |   });
38 |
39 |   const supabase = createClient();
40 |
41 |   async function downloadCSV() {
42 |     const query = supabase
43 |       .from("tracker_entries")
44 |       .select(
45 |         "date, description, duration, assigned:assigned_id(id, full_name), project:project_id(id, name)",
46 |       )
47 |       .eq("team_id", teamId)
48 |       .gte("date", date?.from?.toISOString())
49 |       .lte("date", date?.to?.toISOString())
50 |       .eq("project_id", projectId)
51 |       .order("date");
52 |
53 |     if (!includeTeam) {
54 |       query.eq("assigned_id", userId);
55 |     }
56 |
57 |     const { data } = await query;
58 |
59 |     const formattedData = data?.map((item) => {
60 |       const formattedItem: Record<string, string | null> = {
61 |         Date: format(new Date(item.date), "P"),
62 |         Description: item.description,
63 |         Time: secondsToHoursAndMinutes(item.duration ?? 0),
64 |       };
65 |
66 |       if (includeTeam) {
67 |         formattedItem.Assigned = item.assigned?.full_name ?? null;
68 |       }
69 |
70 |       const { Date: date, Assigned, Description, Time } = formattedItem;
71 |
72 |       return includeTeam
73 |         ? { Date: date, Assigned, Description, Time }
74 |         : { Date: date, Description, Time };
75 |     });
76 |
77 |     const totalTimeInSeconds =
78 |       data?.reduce((sum, item) => sum + (item?.duration ?? 0), 0) ?? 0;
79 |
80 |     const dataWithFooter = [
81 |       ...(formattedData ?? []),
82 |       {
83 |         Date: "Total Time",
84 |         Assigned: null,
85 |         Description: null,
86 |         Time: secondsToHoursAndMinutes(totalTimeInSeconds),
87 |       },
88 |     ];
89 |
90 |     const csv = Papa.unparse(dataWithFooter);
91 |     const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
92 |     const link = document.createElement("a");
93 |     const url = URL.createObjectURL(blob);
94 |     link.href = url;
95 |
96 |     link.setAttribute("download", `${name}.csv`);
97 |
98 |     document.body.appendChild(link);
99 |     link.click();
100 |
101 |     document.body.removeChild(link);
102 |   }
103 |
104 |   return (
105 |     <DropdownMenuGroup>
106 |       <DropdownMenuSub>
107 |         <DropdownMenuSubTrigger>Export</DropdownMenuSubTrigger>
108 |         <DropdownMenuPortal>
109 |           <DropdownMenuSubContent>
110 |             <div className="pt-2 px-4">
111 |               <Select
112 |                 defaultValue="this-month"
113 |                 onValueChange={(value) => {
114 |                   const now = new UTCDate();
115 |                   if (value === "this-month") {
116 |                     const firstDayThisMonth = startOfMonth(now);
117 |                     const lastDayThisMonth = endOfMonth(now);
118 |                     setDate({
119 |                       from: firstDayThisMonth,
120 |                       to: lastDayThisMonth,
121 |                     });
122 |                   } else if (value === "last-month") {
123 |                     const firstDayLastMonth = startOfMonth(subMonths(now, 1));
124 |                     const lastDayLastMonth = endOfMonth(subMonths(now, 1));
125 |                     setDate({
126 |                       from: firstDayLastMonth,
127 |                       to: lastDayLastMonth,
128 |                     });
129 |                   }
130 |                 }}
131 |               >
132 |                 <SelectTrigger>
133 |                   <SelectValue placeholder="Select period" />
134 |                 </SelectTrigger>
135 |                 <SelectContent>
136 |                   <SelectItem value="this-month">This month</SelectItem>
137 |                   <SelectItem value="last-month">Last month</SelectItem>
138 |                 </SelectContent>
139 |               </Select>
140 |             </div>
141 |
142 |             <Calendar
143 |               mode="range"
144 |               selected={date}
145 |               onSelect={setDate}
146 |               disabled={(date) => date > new Date()}
147 |               defaultMonth={date?.from}
148 |             />
149 |
150 |             <div className="p-4 space-y-4">
151 |               <Button onClick={downloadCSV} className="w-full" disabled={!date}>
152 |                 Export
153 |               </Button>
154 |             </div>
155 |           </DropdownMenuSubContent>
156 |         </DropdownMenuPortal>
157 |       </DropdownMenuSub>
158 |     </DropdownMenuGroup>
159 |   );
160 | }
```

apps/dashboard/src/components/tracker-month-select.tsx
```
1 | import { useTrackerParams } from "@/hooks/use-tracker-params";
2 | import { TZDate } from "@date-fns/tz";
3 | import { Button } from "@midday/ui/button";
4 | import { cn } from "@midday/ui/cn";
5 | import { Icons } from "@midday/ui/icons";
6 | import { addMonths, format, formatISO, startOfMonth } from "date-fns";
7 |
8 | type Props = {
9 |   className?: string;
10 |   dateFormat?: string;
11 | };
12 |
13 | export function TrackerMonthSelect({ className, dateFormat = "MMM" }: Props) {
14 |   const { date, setParams } = useTrackerParams();
15 |   const currentDate = date
16 |     ? new TZDate(date, "UTC")
17 |     : new TZDate(new Date(), "UTC");
18 |
19 |   const selectPrevMonth = () => {
20 |     setParams(
21 |       {
22 |         date: formatISO(startOfMonth(addMonths(currentDate, -1)), {
23 |           representation: "date",
24 |         }),
25 |       },
26 |       { shallow: false },
27 |     );
28 |   };
29 |
30 |   const selectNextMonth = () => {
31 |     setParams(
32 |       {
33 |         date: formatISO(startOfMonth(addMonths(currentDate, 1)), {
34 |           representation: "date",
35 |         }),
36 |       },
37 |       { shallow: false },
38 |     );
39 |   };
40 |
41 |   return (
42 |     <div className={cn("flex items-center border h-9", className)}>
43 |       <Button
44 |         variant="ghost"
45 |         size="icon"
46 |         className="p-0 w-6 h-6 hover:bg-transparent mr-4 ml-2"
47 |         onClick={selectPrevMonth}
48 |       >
49 |         <Icons.ChevronLeft className="w-6 h-6" />
50 |       </Button>
51 |       <span className="w-full text-center">
52 |         {format(currentDate, dateFormat)}
53 |       </span>
54 |       <Button
55 |         variant="ghost"
56 |         size="icon"
57 |         className="p-0 w-6 h-6 hover:bg-transparent ml-4 mr-2"
58 |         onClick={selectNextMonth}
59 |       >
60 |         <Icons.ChevronRight className="w-6 h-6" />
61 |       </Button>
62 |     </div>
63 |   );
64 | }
```

apps/dashboard/src/components/tracker-pagination.tsx
```
1 | "use client";
2 |
3 | import { Button } from "@midday/ui/button";
4 | import { Icons } from "@midday/ui/icons";
5 | import {
6 |   addMonths,
7 |   format,
8 |   formatISO,
9 |   startOfMonth,
10 |   subMonths,
11 | } from "date-fns";
12 |
13 | export function TrackerPagination({ numberOfMonths, onChange, startDate }) {
14 |   const selectPrevPeriod = () => {
15 |     onChange(
16 |       formatISO(startOfMonth(subMonths(startDate, numberOfMonths)), {
17 |         representation: "date",
18 |       })
19 |     );
20 |   };
21 |
22 |   const selectNextPeriod = () => {
23 |     onChange(
24 |       formatISO(startOfMonth(addMonths(startDate, numberOfMonths)), {
25 |         representation: "date",
26 |       })
27 |     );
28 |   };
29 |
30 |   return (
31 |     <div className="flex items-center border h-9">
32 |       <Button
33 |         variant="ghost"
34 |         size="icon"
35 |         className="p-0 w-6 h-6 hover:bg-transparent mr-4 ml-2"
36 |         onClick={selectPrevPeriod}
37 |       >
38 |         <Icons.ChevronLeft className="w-6 h-6" />
39 |       </Button>
40 |       <span className="w-full text-center">
41 |         {format(subMonths(startDate, numberOfMonths), "MMM")} -{" "}
42 |         {format(startDate, "MMM")}
43 |       </span>
44 |       <Button
45 |         variant="ghost"
46 |         size="icon"
47 |         className="p-0 w-6 h-6 hover:bg-transparent ml-4 mr-2"
48 |         onClick={selectNextPeriod}
49 |       >
50 |         <Icons.ChevronRight className="w-6 h-6" />
51 |       </Button>
52 |     </div>
53 |   );
54 | }
```

apps/dashboard/src/components/tracker-schedule.tsx
```
1 | "use client";
2 |
3 | import { createTrackerEntriesAction } from "@/actions/create-tracker-entries-action";
4 | import { deleteTrackerEntryAction } from "@/actions/delete-tracker-entry";
5 | import { useTrackerParams } from "@/hooks/use-tracker-params";
6 | import { secondsToHoursAndMinutes } from "@/utils/format";
7 | import {
8 |   NEW_EVENT_ID,
9 |   createNewEvent,
10 |   formatHour,
11 |   getDates,
12 |   getSlotFromDate,
13 |   getTimeFromDate,
14 |   transformTrackerData,
15 |   updateEventTime,
16 | } from "@/utils/tracker";
17 | import { createClient } from "@midday/supabase/client";
18 | import { getTrackerRecordsByDateQuery } from "@midday/supabase/queries";
19 | import { cn } from "@midday/ui/cn";
20 | import {
21 |   ContextMenu,
22 |   ContextMenuContent,
23 |   ContextMenuItem,
24 |   ContextMenuShortcut,
25 |   ContextMenuTrigger,
26 | } from "@midday/ui/context-menu";
27 | import { ScrollArea } from "@midday/ui/scroll-area";
28 | import {
29 |   addMinutes,
30 |   addSeconds,
31 |   differenceInSeconds,
32 |   endOfDay,
33 |   format,
34 |   parseISO,
35 |   setHours,
36 |   setMinutes,
37 |   startOfDay,
38 | } from "date-fns";
39 | import { useAction } from "next-safe-action/hooks";
40 | import React, { useEffect, useRef, useState } from "react";
41 | import { useHotkeys } from "react-hotkeys-hook";
42 | import { TrackerRecordForm } from "./forms/tracker-record-form";
43 | import { TrackerDaySelect } from "./tracker-day-select";
44 |
45 | interface TrackerRecord {
46 |   id: string;
47 |   start: Date;
48 |   end: Date;
49 |   project: {
50 |     id: string;
51 |     name: string;
52 |   };
53 |   description?: string;
54 | }
55 |
56 | const ROW_HEIGHT = 36;
57 | const SLOT_HEIGHT = 9;
58 |
59 | type Props = {
60 |   teamId: string;
61 |   userId: string;
62 |   timeFormat: number;
63 |   projectId?: string;
64 | };
65 |
66 | export function TrackerSchedule({
67 |   teamId,
68 |   userId,
69 |   timeFormat,
70 |   projectId,
71 | }: Props) {
72 |   const supabase = createClient();
73 |
74 |   const scrollRef = useRef<HTMLDivElement>(null);
75 |   const { selectedDate, range } = useTrackerParams();
76 |   const [selectedEvent, setSelectedEvent] = useState<TrackerRecord | null>(
77 |     null,
78 |   );
79 |   const hours = Array.from({ length: 24 }, (_, i) => i);
80 |   const [data, setData] = useState<TrackerRecord[]>([]);
81 |   const [isDragging, setIsDragging] = useState(false);
82 |   const [dragStartSlot, setDragStartSlot] = useState<number | null>(null);
83 |   const [totalDuration, setTotalDuration] = useState(0);
84 |   const [resizingEvent, setResizingEvent] = useState<TrackerRecord | null>(
85 |     null,
86 |   );
87 |   const [resizeStartY, setResizeStartY] = useState(0);
88 |   const [resizeType, setResizeType] = useState<"top" | "bottom" | null>(null);
89 |   const [movingEvent, setMovingEvent] = useState<TrackerRecord | null>(null);
90 |   const [moveStartY, setMoveStartY] = useState(0);
91 |   const [isContextMenuOpen, setIsContextMenuOpen] = useState(false);
92 |   const [selectedProjectId, setSelectedProjectId] = useState<string | null>(
93 |     projectId ?? null,
94 |   );
95 |
96 |   const createTrackerEntries = useAction(createTrackerEntriesAction, {
97 |     onSuccess: (result) => {
98 |       if (!result.data) return;
99 |
100 |       setData((prevData) => {
101 |         const processedData = result?.data.map((event) =>
102 |           transformTrackerData(event, selectedDate),
103 |         );
104 |         return [
105 |           ...prevData.filter((event) => event.id !== NEW_EVENT_ID),
106 |           ...processedData,
107 |         ];
108 |       });
109 |
110 |       setTotalDuration((prevTotalDuration) => {
111 |         const newEventsDuration = result.data.reduce((total, event) => {
112 |           const start = event.start
113 |             ? new Date(event.start)
114 |             : new Date(`${event.date || selectedDate}T09:00:00`);
115 |           const end = event.stop
116 |             ? new Date(event.stop)
117 |             : addSeconds(start, event.duration || 0);
118 |           return total + differenceInSeconds(end, start);
119 |         }, 0);
120 |
121 |         return prevTotalDuration + newEventsDuration;
122 |       });
123 |
124 |       const lastEvent = result.data.at(-1);
125 |       setSelectedEvent(
126 |         lastEvent ? transformTrackerData(lastEvent, selectedDate) : null,
127 |       );
128 |     },
129 |   });
130 |
131 |   const deleteTrackerEntry = useAction(deleteTrackerEntryAction);
132 |
133 |   const sortedRange = range?.sort((a, b) => a.localeCompare(b));
134 |
135 |   useEffect(() => {
136 |     const fetchData = async () => {
137 |       const trackerData = await getTrackerRecordsByDateQuery(supabase, {
138 |         teamId,
139 |         userId,
140 |         date: selectedDate,
141 |       });
142 |
143 |       if (trackerData?.data) {
144 |         const processedData = trackerData.data.map((event: any) =>
145 |           transformTrackerData(event, selectedDate),
146 |         );
147 |
148 |         setData(processedData);
149 |         setTotalDuration(trackerData.meta?.totalDuration || 0);
150 |       } else {
151 |         setData([]);
152 |         setTotalDuration(0);
153 |       }
154 |     };
155 |
156 |     if (selectedDate) {
157 |       fetchData();
158 |     }
159 |   }, [selectedDate, teamId]);
160 |
161 |   useEffect(() => {
162 |     if (scrollRef.current) {
163 |       const currentHour = new Date().getHours();
164 |       if (currentHour >= 12) {
165 |         scrollRef.current.scrollTo({
166 |           top: scrollRef.current.scrollHeight,
167 |         });
168 |       } else {
169 |         scrollRef.current.scrollTo({
[TRUNCATED]
```

apps/dashboard/src/components/tracker-search-filter.tsx
```
1 | "use client";
2 |
3 | import { generateTrackerFilters } from "@/actions/ai/filters/generate-tracker-filters";
4 | import { Calendar } from "@midday/ui/calendar";
5 | import { cn } from "@midday/ui/cn";
6 | import {
7 |   DropdownMenu,
8 |   DropdownMenuCheckboxItem,
9 |   DropdownMenuContent,
10 |   DropdownMenuGroup,
11 |   DropdownMenuItem,
12 |   DropdownMenuPortal,
13 |   DropdownMenuSub,
14 |   DropdownMenuSubContent,
15 |   DropdownMenuSubTrigger,
16 |   DropdownMenuTrigger,
17 | } from "@midday/ui/dropdown-menu";
18 | import { Icons } from "@midday/ui/icons";
19 | import { Input } from "@midday/ui/input";
20 | import { readStreamableValue } from "ai/rsc";
21 | import { formatISO } from "date-fns";
22 | import {
23 |   parseAsArrayOf,
24 |   parseAsString,
25 |   parseAsStringLiteral,
26 |   useQueryStates,
27 | } from "nuqs";
28 | import { useRef, useState } from "react";
29 | import { useHotkeys } from "react-hotkeys-hook";
30 | import { FilterList } from "./filter-list";
31 |
32 | type Props = {
33 |   members?: {
34 |     id: string;
35 |     name: string;
36 |   }[];
37 |   customers?: {
38 |     id: string | null;
39 |     name: string | null;
40 |   }[];
41 | };
42 |
43 | const defaultSearch = {
44 |   q: null,
45 |   start: null,
46 |   end: null,
47 |   assignees: null,
48 |   statuses: null,
49 | };
50 |
51 | const statusFilters = [
52 |   { id: "in_progress", name: "In Progress" },
53 |   { id: "completed", name: "Completed" },
54 | ];
55 |
56 | export function TrackerSearchFilter({
57 |   members,
58 |   customers: customersData,
59 | }: Props) {
60 |   const [prompt, setPrompt] = useState("");
61 |   const inputRef = useRef<HTMLInputElement>(null);
62 |   const [streaming, setStreaming] = useState(false);
63 |   const [isOpen, setIsOpen] = useState(false);
64 |
65 |   const [filters, setFilters] = useQueryStates(
66 |     {
67 |       q: parseAsString,
68 |       start: parseAsString,
69 |       end: parseAsString,
70 |       statuses: parseAsArrayOf(
71 |         parseAsStringLiteral(["in_progress", "completed"]),
72 |       ),
73 |       customers: parseAsArrayOf(parseAsString),
74 |     },
75 |     {
76 |       shallow: false,
77 |     },
78 |   );
79 |
80 |   useHotkeys(
81 |     "esc",
82 |     () => {
83 |       setPrompt("");
84 |       setFilters(defaultSearch);
85 |       setIsOpen(false);
86 |     },
87 |     {
88 |       enableOnFormTags: true,
89 |     },
90 |   );
91 |
92 |   useHotkeys("meta+s", (evt) => {
93 |     evt.preventDefault();
94 |     inputRef.current?.focus();
95 |   });
96 |
97 |   useHotkeys("meta+f", (evt) => {
98 |     evt.preventDefault();
99 |     setIsOpen((prev) => !prev);
100 |   });
101 |
102 |   const handleSearch = (evt: React.ChangeEvent<HTMLInputElement>) => {
103 |     const value = evt.target.value;
104 |
105 |     if (value) {
106 |       setPrompt(value);
107 |     } else {
108 |       setFilters(defaultSearch);
109 |       setPrompt("");
110 |     }
111 |   };
112 |
113 |   const handleSubmit = async () => {
114 |     // If the user is typing a query with multiple words, we want to stream the results
115 |     if (prompt.split(" ").length > 1) {
116 |       setStreaming(true);
117 |
118 |       const { object } = await generateTrackerFilters(
119 |         prompt,
120 |         `Customers: ${customersData?.map((customer) => customer.name).join(", ")}`,
121 |       );
122 |
123 |       let finalObject = {};
124 |
125 |       for await (const partialObject of readStreamableValue(object)) {
126 |         if (partialObject) {
127 |           finalObject = {
128 |             ...finalObject,
129 |             ...partialObject,
130 |             statuses: partialObject?.status ? [partialObject.status] : null,
131 |             start: partialObject?.start ?? null,
132 |             end: partialObject?.end ?? null,
133 |             q: partialObject?.name ?? null,
134 |             customers:
135 |               partialObject?.customers?.map(
136 |                 (name: string) =>
137 |                   customersData?.find((customer) => customer.name === name)?.id,
138 |               ) ?? null,
139 |           };
140 |         }
141 |       }
142 |
143 |       setFilters({
144 |         q: null,
145 |         ...finalObject,
146 |       });
147 |
148 |       setStreaming(false);
149 |     } else {
150 |       setFilters({ q: prompt.length > 0 ? prompt : null });
151 |     }
152 |   };
153 |
154 |   const hasValidFilters =
155 |     Object.entries(filters).filter(
156 |       ([key, value]) => value !== null && key !== "q",
157 |     ).length > 0;
158 |
159 |   return (
160 |     <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
161 |       <div className="flex space-x-4 items-center">
162 |         <FilterList
163 |           filters={filters}
164 |           loading={streaming}
165 |           onRemove={setFilters}
166 |           members={members}
167 |           customers={customersData}
168 |           statusFilters={statusFilters}
169 |         />
170 |
171 |         <form
172 |           className="relative"
173 |           onSubmit={(e) => {
174 |             e.preventDefault();
175 |             handleSubmit();
176 |           }}
177 |         >
178 |           <Icons.Search className="absolute pointer-events-none left-3 top-[11px]" />
179 |           <Input
180 |             ref={inputRef}
181 |             placeholder="Search or type filter"
182 |             className="pl-9 w-full md:w-[350px] pr-8"
183 |             value={prompt}
184 |             onChange={handleSearch}
185 |             autoComplete="off"
186 |             autoCapitalize="none"
187 |             autoCorrect="off"
188 |             spellCheck="false"
189 |           />
190 |
[TRUNCATED]
```

apps/dashboard/src/components/tracker-select-project.tsx
```
1 | "use client";
2 |
3 | import { createProjectAction } from "@/actions/project/create-project-action";
4 | import { createClient } from "@midday/supabase/client";
5 | import { getTrackerProjectsQuery } from "@midday/supabase/queries";
6 | import { Combobox } from "@midday/ui/combobox";
7 | import { useToast } from "@midday/ui/use-toast";
8 | import { useAction } from "next-safe-action/hooks";
9 | import { useEffect, useState } from "react";
10 |
11 | type Props = {
12 |   teamId: string;
13 |   selectedId?: string;
14 |   onSelect: (selected: Option) => void;
15 |   onCreate: (project: { id: string; name: string }) => void;
16 | };
17 |
18 | type Option = {
19 |   id: string;
20 |   name: string;
21 | };
22 |
23 | export function TrackerSelectProject({
24 |   teamId,
25 |   selectedId,
26 |   onSelect,
27 |   onCreate,
28 | }: Props) {
29 |   const { toast } = useToast();
30 |   const supabase = createClient();
31 |   const [data, setData] = useState([]);
32 |   const [isLoading, setLoading] = useState(false);
33 |   const [value, setValue] = useState<Option | undefined>();
34 |
35 |   useEffect(() => {
36 |     const foundProject = data?.find((project) => project?.id === selectedId);
37 |
38 |     if (foundProject) {
39 |       setValue({ id: foundProject.id, name: foundProject.name });
40 |     }
41 |   }, [selectedId]);
42 |
43 |   const handleSelect = (selected: Option) => {
44 |     setValue(selected);
45 |     onSelect(selected);
46 |   };
47 |
48 |   const createProject = useAction(createProjectAction, {
49 |     onSuccess: ({ data: project }) => {
50 |       onCreate?.(project);
51 |       handleSelect(project);
52 |     },
53 |     onError: () => {
54 |       toast({
55 |         duration: 3500,
56 |         variant: "error",
57 |         title: "Something went wrong please try again.",
58 |       });
59 |     },
60 |   });
61 |
62 |   const fetchProjects = async () => {
63 |     setLoading(true);
64 |
65 |     const { data: projectsData } = await getTrackerProjectsQuery(supabase, {
66 |       teamId,
67 |       sort: ["status", "asc"],
68 |     });
69 |
70 |     setLoading(false);
71 |     setData(projectsData);
72 |
73 |     const foundProject = projectsData.find(
74 |       (project) => project?.id === selectedId,
75 |     );
76 |
77 |     if (foundProject) {
78 |       setValue({
79 |         id: foundProject.id,
80 |         name: foundProject.customer?.name
81 |           ? `${foundProject.name} · ${foundProject.customer.name}`
82 |           : foundProject.name,
83 |       });
84 |     }
85 |   };
86 |
87 |   useEffect(() => {
88 |     fetchProjects();
89 |   }, []);
90 |
91 |   return (
92 |     <Combobox
93 |       key={value?.id}
94 |       placeholder="Search or create project"
95 |       classNameList="-top-[4px] border-t-0 rounded-none rounded-b-md"
96 |       className="w-full bg-transparent px-12 border py-3"
97 |       onSelect={handleSelect}
98 |       options={data}
99 |       value={value}
100 |       isLoading={isLoading}
101 |       onCreate={(name) => createProject.execute({ name })}
102 |     />
103 |   );
104 | }
```

apps/dashboard/src/components/tracker-status.tsx
```
1 | "use client";
2 |
3 | import { useI18n } from "@/locales/client";
4 | import { cn } from "@midday/ui/cn";
5 |
6 | export function TrackerStatus({ status }) {
7 |   const t = useI18n();
8 |
9 |   return (
10 |     <div className="flex items-center space-x-4">
11 |       <div
12 |         className={cn(
13 |           "w-[6px] h-[6px] rounded-full bg-[#FFD02B]",
14 |           status === "completed" && "bg-primary"
15 |         )}
16 |       />
17 |       <span>{t(`tracker_status.${status}`)}</span>
18 |     </div>
19 |   );
20 | }
```

apps/dashboard/src/components/transaction-bank-account.tsx
```
1 | import { BankLogo } from "@/components/bank-logo";
2 | import { cn } from "@midday/ui/cn";
3 |
4 | type Props = {
5 |   logoUrl?: string;
6 |   name?: string;
7 |   size?: number;
8 |   className?: string;
9 | };
10 |
11 | export function TransactionBankAccount({
12 |   logoUrl,
13 |   name,
14 |   size = 20,
15 |   className,
16 | }: Props) {
17 |   return (
18 |     <div className="flex space-x-2 mt-1 items-center">
19 |       {logoUrl && (
20 |         <div className="rounded-full overflow-hidden">
21 |           <BankLogo size={size} src={logoUrl} alt={name ?? ""} />
22 |         </div>
23 |       )}
24 |       <span className={cn("text-sm line-clamp-1", className)}>{name}</span>
25 |     </div>
26 |   );
27 | }
```

apps/dashboard/src/components/transaction-details.tsx
```
1 | import { createAttachmentsAction } from "@/actions/create-attachments-action";
2 | import { createTransactionTagAction } from "@/actions/create-transaction-tag-action";
3 | import { deleteTransactionTagAction } from "@/actions/delete-transaction-tag-action";
4 | import type { UpdateTransactionValues } from "@/actions/schema";
5 | import { updateSimilarTransactionsCategoryAction } from "@/actions/update-similar-transactions-action";
6 | import { updateSimilarTransactionsRecurringAction } from "@/actions/update-similar-transactions-recurring";
7 | import { useUserContext } from "@/store/user/hook";
8 | import { createClient } from "@midday/supabase/client";
9 | import { getTransactionQuery } from "@midday/supabase/queries";
10 | import { getSimilarTransactions } from "@midday/supabase/queries";
11 | import {
12 |   Accordion,
13 |   AccordionContent,
14 |   AccordionItem,
15 |   AccordionTrigger,
16 | } from "@midday/ui/accordion";
17 | import { cn } from "@midday/ui/cn";
18 | import { Label } from "@midday/ui/label";
19 | import {
20 |   Select,
21 |   SelectContent,
22 |   SelectGroup,
23 |   SelectItem,
24 |   SelectTrigger,
25 |   SelectValue,
26 | } from "@midday/ui/select";
27 | import { Skeleton } from "@midday/ui/skeleton";
28 | import { Switch } from "@midday/ui/switch";
29 | import { ToastAction } from "@midday/ui/toast";
30 | import { useToast } from "@midday/ui/use-toast";
31 | import { format } from "date-fns";
32 | import { useAction } from "next-safe-action/hooks";
33 | import { useQueryState } from "nuqs";
34 | import { useEffect, useState } from "react";
35 | import { useHotkeys } from "react-hotkeys-hook";
36 | import { AssignUser } from "./assign-user";
37 | import { Attachments } from "./attachments";
38 | import { FormatAmount } from "./format-amount";
39 | import { Note } from "./note";
40 | import { SelectCategory } from "./select-category";
41 | import { SelectTags } from "./select-tags";
42 | import { TransactionBankAccount } from "./transaction-bank-account";
43 |
44 | type Props = {
45 |   data: any;
46 |   ids?: string[];
47 |   updateTransaction: (
48 |     values: UpdateTransactionValues,
49 |     optimisticData: any,
50 |   ) => void;
51 | };
52 |
53 | export function TransactionDetails({
54 |   data: initialData,
55 |   ids,
56 |   updateTransaction,
57 | }: Props) {
58 |   const [data, setData] = useState(initialData);
59 |   const [transactionId, setTransactionId] = useQueryState("id");
60 |   const { toast } = useToast();
61 |   const supabase = createClient();
62 |   const [isLoading, setLoading] = useState(true);
63 |   const updateSimilarTransactionsCategory = useAction(
64 |     updateSimilarTransactionsCategoryAction,
65 |   );
66 |   const updateSimilarTransactionsRecurring = useAction(
67 |     updateSimilarTransactionsRecurringAction,
68 |   );
69 |   const createAttachments = useAction(createAttachmentsAction);
70 |   const createTransactionTag = useAction(createTransactionTagAction);
71 |   const deleteTransactionTag = useAction(deleteTransactionTagAction);
72 |
73 |   const { team_id: teamId } = useUserContext((state) => state.data);
74 |
75 |   useHotkeys("esc", () => setTransactionId(null));
76 |
77 |   const enabled = Boolean(ids?.length);
78 |
79 |   useHotkeys(
80 |     "ArrowUp, ArrowDown",
81 |     ({ key }) => {
82 |       if (key === "ArrowUp") {
83 |         const currentIndex = ids?.indexOf(data?.id) ?? 0;
84 |         const prevId = ids[currentIndex - 1];
85 |
86 |         if (prevId) {
87 |           setTransactionId(prevId);
88 |         }
89 |       }
90 |
91 |       if (key === "ArrowDown") {
92 |         const currentIndex = ids?.indexOf(data?.id) ?? 0;
93 |         const nextId = ids[currentIndex + 1];
94 |
95 |         if (nextId) {
96 |           setTransactionId(nextId);
97 |         }
98 |       }
99 |     },
100 |     { enabled },
101 |   );
102 |
103 |   useEffect(() => {
104 |     if (initialData) {
105 |       setData(initialData);
106 |       setLoading(false);
107 |     }
108 |   }, [initialData]);
109 |
110 |   useEffect(() => {
111 |     async function fetchData() {
112 |       try {
113 |         const transaction = await getTransactionQuery(supabase, data?.id);
114 |         setData(transaction);
115 |         setLoading(false);
116 |       } catch {
117 |         setLoading(false);
118 |       }
119 |     }
120 |
121 |     if (!data) {
122 |       fetchData();
123 |     }
124 |   }, [data]);
125 |
126 |   const handleOnChangeCategory = async (category: {
127 |     id: string;
128 |     name: string;
129 |     slug: string;
130 |     color: string;
131 |   }) => {
132 |     updateTransaction(
133 |       { id: data?.id, category_slug: category.slug },
134 |       { category },
135 |     );
136 |
137 |     const transactions = await getSimilarTransactions(supabase, {
138 |       name: data?.name,
139 |       teamId: teamId,
140 |     });
141 |
142 |     if (transactions?.data && transactions.data.length > 1) {
143 |       toast({
144 |         duration: 6000,
145 |         variant: "ai",
146 |         title: "Midday AI",
147 |         description: `Do you want to mark ${transactions?.data?.length} similar transactions from ${data?.name} as ${category.name} too?`,
148 |         footer: (
149 |           <div className="flex space-x-2 mt-4">
150 |             <ToastAction altText="Cancel" className="pl-5 pr-5">
151 |               Cancel
152 |             </ToastAction>
153 |             <ToastAction
154 |               altText="Yes"
155 |               onClick={() => {
156 |                 updateSimilarTransactionsCategory.execute({ id: data?.id });
157 |               }}
158 |               className="pl-5 pr-5 bg-primary text-primary-foreground hover:bg-primary/90"
159 |             >
160 |               Yes
161 |             </ToastAction>
162 |           </div>
163 |         ),
164 |       });
165 |     }
166 |   };
[TRUNCATED]
```

apps/dashboard/src/components/transaction-method.tsx
```
1 | "use client";
2 |
3 | import { useI18n } from "@/locales/client";
4 |
5 | export function TransactionMethod({ method }) {
6 |   const t = useI18n();
7 |
8 |   return t(`transaction_methods.${method}`);
9 | }
```

apps/dashboard/src/components/transaction-status.tsx
```
1 | import { Icons } from "@midday/ui/icons";
2 | import {
3 |   Tooltip,
4 |   TooltipContent,
5 |   TooltipProvider,
6 |   TooltipTrigger,
7 | } from "@midday/ui/tooltip";
8 |
9 | type Props = {
10 |   fullfilled: boolean;
11 | };
12 |
13 | export function TransactionStatus({ fullfilled }: Props) {
14 |   if (fullfilled) {
15 |     return (
16 |       <div className="flex justify-end">
17 |         <Icons.Check />
18 |       </div>
19 |     );
20 |   }
21 |
22 |   return (
23 |     <div className="flex justify-end">
24 |       <TooltipProvider delayDuration={50}>
25 |         <Tooltip>
26 |           <TooltipTrigger>
27 |             <Icons.AlertCircle />
28 |           </TooltipTrigger>
29 |           <TooltipContent
30 |             className="px-3 py-1.5 text-xs"
31 |             side="left"
32 |             sideOffset={10}
33 |           >
34 |             Missing receipt
35 |           </TooltipContent>
36 |         </Tooltip>
37 |       </TooltipProvider>
38 |     </div>
39 |   );
40 | }
```

apps/dashboard/src/components/transactions-actions.tsx
```
1 | "use client";
2 |
3 | import { deleteTransactionsAction } from "@/actions/delete-transactions-action";
4 | import { AddTransactions } from "@/components/add-transactions";
5 | import { BulkActions } from "@/components/bulk-actions";
6 | import { ColumnVisibility } from "@/components/column-visibility";
7 | import { useTransactionsStore } from "@/store/transactions";
8 | import {
9 |   AlertDialog,
10 |   AlertDialogAction,
11 |   AlertDialogCancel,
12 |   AlertDialogContent,
13 |   AlertDialogDescription,
14 |   AlertDialogFooter,
15 |   AlertDialogHeader,
16 |   AlertDialogTitle,
17 |   AlertDialogTrigger,
18 | } from "@midday/ui/alert-dialog";
19 | import { Button } from "@midday/ui/button";
20 | import { Icons } from "@midday/ui/icons";
21 | import { useToast } from "@midday/ui/use-toast";
22 | import { Loader2 } from "lucide-react";
23 | import { useAction } from "next-safe-action/hooks";
24 |
25 | type Props = {
26 |   isEmpty: boolean;
27 |   tags: { id: string; name: string }[];
28 | };
29 |
30 | export function TransactionsActions({ isEmpty, tags }: Props) {
31 |   const { toast } = useToast();
32 |   const { setRowSelection, canDelete, rowSelection } = useTransactionsStore();
33 |
34 |   const transactionIds = Object.keys(rowSelection);
35 |
36 |   const deleteTransactions = useAction(deleteTransactionsAction, {
37 |     onSuccess: () => {
38 |       setRowSelection({});
39 |     },
40 |     onError: () => {
41 |       toast({
42 |         duration: 3500,
43 |         variant: "error",
44 |         title: "Something went wrong please try again.",
45 |       });
46 |     },
47 |   });
48 |
49 |   if (transactionIds?.length) {
50 |     return (
51 |       <AlertDialog>
52 |         <div className="ml-auto">
53 |           <div className="flex items-center">
54 |             <span className="text-sm text-[#606060] w-full">Bulk edit</span>
55 |             <div className="h-8 w-[1px] bg-border ml-4 mr-4" />
56 |
57 |             <div className="flex space-x-2">
58 |               <BulkActions ids={transactionIds} tags={tags} />
59 |
60 |               <div>
61 |                 {canDelete && (
62 |                   <AlertDialogTrigger asChild>
63 |                     <Button
64 |                       size="icon"
65 |                       variant="destructive"
66 |                       className="bg-transparent border border-destructive hover:bg-transparent"
67 |                     >
68 |                       <Icons.Delete className="text-destructive" size={18} />
69 |                     </Button>
70 |                   </AlertDialogTrigger>
71 |                 )}
72 |               </div>
73 |             </div>
74 |           </div>
75 |         </div>
76 |
77 |         <AlertDialogContent>
78 |           <AlertDialogHeader>
79 |             <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
80 |             <AlertDialogDescription>
81 |               This action cannot be undone. This will permanently delete your
82 |               transactions.
83 |             </AlertDialogDescription>
84 |           </AlertDialogHeader>
85 |           <AlertDialogFooter>
86 |             <AlertDialogCancel>Cancel</AlertDialogCancel>
87 |             <AlertDialogAction
88 |               onClick={() => {
89 |                 deleteTransactions.execute({ ids: transactionIds });
90 |               }}
91 |             >
92 |               {deleteTransactions.status === "executing" ? (
93 |                 <Loader2 className="h-4 w-4 animate-spin" />
94 |               ) : (
95 |                 "Confirm"
96 |               )}
97 |             </AlertDialogAction>
98 |           </AlertDialogFooter>
99 |         </AlertDialogContent>
100 |       </AlertDialog>
101 |     );
102 |   }
103 |
104 |   return (
105 |     <div className="space-x-2 hidden md:flex">
106 |       <ColumnVisibility disabled={isEmpty} />
107 |       <AddTransactions />
108 |     </div>
109 |   );
110 | }
```

apps/dashboard/src/components/transactions-search-filter.tsx
```
1 | "use client";
2 |
3 | import { generateTransactionsFilters } from "@/actions/ai/filters/generate-transactions-filters";
4 | import { formatAccountName } from "@/utils/format";
5 | import { Calendar } from "@midday/ui/calendar";
6 | import { cn } from "@midday/ui/cn";
7 | import {
8 |   DropdownMenu,
9 |   DropdownMenuCheckboxItem,
10 |   DropdownMenuContent,
11 |   DropdownMenuGroup,
12 |   DropdownMenuPortal,
13 |   DropdownMenuSub,
14 |   DropdownMenuSubContent,
15 |   DropdownMenuSubTrigger,
16 |   DropdownMenuTrigger,
17 | } from "@midday/ui/dropdown-menu";
18 | import { Icons } from "@midday/ui/icons";
19 | import { Input } from "@midday/ui/input";
20 | import { readStreamableValue } from "ai/rsc";
21 | import { formatISO } from "date-fns";
22 | import {
23 |   parseAsArrayOf,
24 |   parseAsInteger,
25 |   parseAsString,
26 |   parseAsStringLiteral,
27 |   useQueryStates,
28 | } from "nuqs";
29 | import { useRef, useState } from "react";
30 | import { useHotkeys } from "react-hotkeys-hook";
31 | import { AmountRange } from "./amount-range";
32 | import { FilterList } from "./filter-list";
33 | import { SelectCategory } from "./select-category";
34 |
35 | type Props = {
36 |   placeholder: string;
37 |   categories?: {
38 |     id: string;
39 |     slug: string;
40 |     name: string;
41 |   }[];
42 |   accounts?: {
43 |     id: string;
44 |     name: string;
45 |     currency: string;
46 |   }[];
47 |   members?: {
48 |     id: string;
49 |     name: string;
50 |   }[];
51 |   tags?: {
52 |     id: string;
53 |     name: string;
54 |   }[];
55 | };
56 |
57 | const defaultSearch = {
58 |   q: null,
59 |   attachments: null,
60 |   start: null,
61 |   end: null,
62 |   categories: null,
63 |   accounts: null,
64 |   assignees: null,
65 |   statuses: null,
66 |   recurring: null,
67 | };
68 |
69 | const statusFilters = [
70 |   { id: "completed", name: "Completed" },
71 |   { id: "uncompleted", name: "Uncompleted" },
72 |   { id: "archived", name: "Archived" },
73 |   { id: "excluded", name: "Excluded" },
74 | ];
75 |
76 | const attachmentsFilters = [
77 |   { id: "include", name: "Has attachments" },
78 |   { id: "exclude", name: "No attachments" },
79 | ];
80 |
81 | const recurringFilters = [
82 |   { id: "all", name: "All recurring" },
83 |   { id: "weekly", name: "Weekly recurring" },
84 |   { id: "monthly", name: "Monthly recurring" },
85 |   { id: "annually", name: "Annually recurring" },
86 | ];
87 |
88 | const PLACEHOLDERS = [
89 |   "Software and taxes last month",
90 |   "Income last year",
91 |   "Software last Q4",
92 |   "From Google without receipt",
93 |   "Search or filter",
94 |   "Without receipts this month",
95 | ];
96 |
97 | const placeholder =
98 |   PLACEHOLDERS[Math.floor(Math.random() * PLACEHOLDERS.length)];
99 |
100 | export function TransactionsSearchFilter({
101 |   categories,
102 |   accounts,
103 |   members,
104 |   tags,
105 | }: Props) {
106 |   const [prompt, setPrompt] = useState("");
107 |   const inputRef = useRef<HTMLInputElement>(null);
108 |   const [streaming, setStreaming] = useState(false);
109 |   const [isOpen, setIsOpen] = useState(false);
110 |
111 |   const [filters, setFilters] = useQueryStates(
112 |     {
113 |       q: parseAsString,
114 |       attachments: parseAsStringLiteral(["exclude", "include"] as const),
115 |       start: parseAsString,
116 |       end: parseAsString,
117 |       categories: parseAsArrayOf(parseAsString),
118 |       tags: parseAsArrayOf(parseAsString),
119 |       accounts: parseAsArrayOf(parseAsString),
120 |       assignees: parseAsArrayOf(parseAsString),
121 |       amount_range: parseAsArrayOf(parseAsInteger),
122 |       recurring: parseAsArrayOf(
123 |         parseAsStringLiteral(["all", "weekly", "monthly", "annually"] as const),
124 |       ),
125 |       statuses: parseAsArrayOf(
126 |         parseAsStringLiteral([
127 |           "completed",
128 |           "uncompleted",
129 |           "archived",
130 |           "excluded",
131 |         ] as const),
132 |       ),
133 |     },
134 |     {
135 |       shallow: false,
136 |       history: "push",
137 |     },
138 |   );
139 |
140 |   useHotkeys(
141 |     "esc",
142 |     () => {
143 |       setPrompt("");
144 |       setFilters(defaultSearch);
145 |       setIsOpen(false);
146 |     },
147 |     {
148 |       enableOnFormTags: true,
149 |       enabled: Boolean(prompt),
150 |     },
151 |   );
152 |
153 |   useHotkeys("meta+s", (evt) => {
154 |     evt.preventDefault();
155 |     inputRef.current?.focus();
156 |   });
157 |
158 |   useHotkeys("meta+f", (evt) => {
159 |     evt.preventDefault();
160 |     setIsOpen((prev) => !prev);
161 |   });
162 |
163 |   const handleSearch = (evt: React.ChangeEvent<HTMLInputElement>) => {
164 |     const value = evt.target.value;
165 |
166 |     if (value) {
167 |       setPrompt(value);
168 |     } else {
169 |       setFilters(defaultSearch);
170 |       setPrompt("");
171 |     }
172 |   };
173 |
174 |   const handleSubmit = async () => {
175 |     // If the user is typing a query with multiple words, we want to stream the results
176 |     if (prompt.split(" ").length > 1) {
177 |       setStreaming(true);
178 |
179 |       const { object } = await generateTransactionsFilters(
180 |         prompt,
181 |         `
182 |           Categories: ${categories?.map((category) => category.name).join(", ")}
183 |           Tags: ${tags?.map((tag) => tag.name).join(", ")}
184 |         `,
185 |       );
186 |
187 |       let finalObject = {};
188 |
189 |       for await (const partialObject of readStreamableValue(object)) {
[TRUNCATED]
```

apps/dashboard/src/components/unenroll-mfa.tsx
```
1 | import { Suspense } from "react";
2 | import { MFAList, MFAListSkeleton } from "./mfa-list";
3 |
4 | export function UnenrollMFA() {
5 |   return (
6 |     <Suspense fallback={<MFAListSkeleton />}>
7 |       <MFAList />
8 |     </Suspense>
9 |   );
10 | }
```

apps/dashboard/src/components/user-avatar.tsx
```
1 | "use client";
2 |
3 | import {
4 |   Card,
5 |   CardDescription,
6 |   CardFooter,
7 |   CardHeader,
8 |   CardTitle,
9 | } from "@midday/ui/card";
10 | import { AvatarUpload } from "./avatar-upload";
11 |
12 | type Props = {
13 |   userId: string;
14 |   avatarUrl: string;
15 |   fullName: string;
16 | };
17 |
18 | export function UserAvatar({ userId, avatarUrl, fullName }: Props) {
19 |   return (
20 |     <Card>
21 |       <div className="flex justify-between items-center pr-6">
22 |         <CardHeader>
23 |           <CardTitle>Avatar</CardTitle>
24 |           <CardDescription>
25 |             This is your avatar. Click on the avatar to upload a custom one from
26 |             your files.
27 |           </CardDescription>
28 |         </CardHeader>
29 |
30 |         <AvatarUpload
31 |           userId={userId}
32 |           avatarUrl={avatarUrl}
33 |           fullName={fullName}
34 |         />
35 |       </div>
36 |       <CardFooter>An avatar is optional but strongly recommended.</CardFooter>
37 |     </Card>
38 |   );
39 | }
```

apps/dashboard/src/components/user-menu.tsx
```
1 | import { getUser } from "@midday/supabase/cached-queries";
2 | import { Avatar, AvatarFallback, AvatarImageNext } from "@midday/ui/avatar";
3 | import {
4 |   DropdownMenu,
5 |   DropdownMenuContent,
6 |   DropdownMenuGroup,
7 |   DropdownMenuItem,
8 |   DropdownMenuLabel,
9 |   DropdownMenuSeparator,
10 |   DropdownMenuShortcut,
11 |   DropdownMenuTrigger,
12 | } from "@midday/ui/dropdown-menu";
13 | import Link from "next/link";
14 | import { SignOut } from "./sign-out";
15 | import { ThemeSwitch } from "./theme-switch";
16 |
17 | export async function UserMenu({ onlySignOut }) {
18 |   const { data: userData } = await getUser();
19 |
20 |   return (
21 |     <DropdownMenu>
22 |       <DropdownMenuTrigger asChild>
23 |         <Avatar className="rounded-full w-8 h-8 cursor-pointer">
24 |           {userData?.avatar_url && (
25 |             <AvatarImageNext
26 |               src={userData?.avatar_url}
27 |               alt={userData?.full_name}
28 |               width={32}
29 |               height={32}
30 |               quality={100}
31 |             />
32 |           )}
33 |           <AvatarFallback>
34 |             <span className="text-xs">
35 |               {userData?.full_name?.charAt(0)?.toUpperCase()}
36 |             </span>
37 |           </AvatarFallback>
38 |         </Avatar>
39 |       </DropdownMenuTrigger>
40 |       <DropdownMenuContent className="w-[240px]" sideOffset={10} align="end">
41 |         {!onlySignOut && (
42 |           <>
43 |             <DropdownMenuLabel>
44 |               <div className="flex justify-between items-center">
45 |                 <div className="flex flex-col">
46 |                   <span className="truncate line-clamp-1 max-w-[155px] block">
47 |                     {userData?.full_name}
48 |                   </span>
49 |                   <span className="truncate text-xs text-[#606060] font-normal">
50 |                     {userData.email}
51 |                   </span>
52 |                 </div>
53 |                 <div className="border py-0.5 px-3 rounded-full text-[11px] font-normal">
54 |                   Beta
55 |                 </div>
56 |               </div>
57 |             </DropdownMenuLabel>
58 |
59 |             <DropdownMenuSeparator />
60 |
61 |             <DropdownMenuGroup>
62 |               <Link prefetch href="/account">
63 |                 <DropdownMenuItem>
64 |                   Account
65 |                   <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
66 |                 </DropdownMenuItem>
67 |               </Link>
68 |
69 |               <Link prefetch href="/account/support">
70 |                 <DropdownMenuItem>Support</DropdownMenuItem>
71 |               </Link>
72 |
73 |               <Link prefetch href="/account/teams">
74 |                 <DropdownMenuItem>
75 |                   Teams
76 |                   <DropdownMenuShortcut>⌘E</DropdownMenuShortcut>
77 |                 </DropdownMenuItem>
78 |               </Link>
79 |             </DropdownMenuGroup>
80 |
81 |             <DropdownMenuSeparator />
82 |             <div className="flex flex-row justify-between items-center p-2">
83 |               <p className="text-sm">Theme</p>
84 |               <ThemeSwitch />
85 |             </div>
86 |             <DropdownMenuSeparator />
87 |           </>
88 |         )}
89 |
90 |         <SignOut />
91 |       </DropdownMenuContent>
92 |     </DropdownMenu>
93 |   );
94 | }
```

apps/dashboard/src/components/vat-assistant.tsx
```
1 | import { getVatRateAction } from "@/actions/ai/get-vat-rate";
2 | import { Experimental } from "@/components/experimental";
3 | import { Button } from "@midday/ui/button";
4 | import { cn } from "@midday/ui/cn";
5 | import { Icons } from "@midday/ui/icons";
6 | import {
7 |   Tooltip,
8 |   TooltipContent,
9 |   TooltipProvider,
10 |   TooltipTrigger,
11 | } from "@midday/ui/tooltip";
12 | import { useAction } from "next-safe-action/hooks";
13 | import { useEffect, useState } from "react";
14 |
15 | type Props = {
16 |   name?: string;
17 |   value?: string | null;
18 |   onSelect: (value: number) => void;
19 |   isFocused: boolean;
20 | };
21 |
22 | export function VatAssistant({ name, onSelect, isFocused, value }: Props) {
23 |   const [result, setResult] = useState<
24 |     { vat: number; country: string } | undefined
25 |   >();
26 |   const [isLoading, setLoading] = useState(false);
27 |
28 |   const getVatRate = useAction(getVatRateAction, {
29 |     onSuccess: ({ data }) => {
30 |       setLoading(false);
31 |
32 |       if (data) {
33 |         setResult(data);
34 |       }
35 |     },
36 |     onError: () => {
37 |       setLoading(false);
38 |     },
39 |   });
40 |
41 |   const handleOnSelect = () => {
42 |     if (result?.vat) {
43 |       onSelect(result.vat);
44 |     }
45 |   };
46 |
47 |   useEffect(() => {
48 |     if (isFocused && name && name.length > 2 && !value) {
49 |       setLoading(true);
50 |       getVatRate.execute({ name });
51 |     }
52 |   }, [isFocused, name]);
53 |
54 |   return (
55 |     <TooltipProvider delayDuration={0}>
56 |       <Tooltip>
57 |         <TooltipTrigger asChild>
58 |           <div className="absolute right-2 top-3">
59 |             <Icons.AIOutline
60 |               className={cn(
61 |                 "pointer-events-none opacity-50 transition-colors",
62 |                 result?.vat && "opacity-100",
63 |                 isLoading && "animate-pulse opacity-100",
64 |               )}
65 |             />
66 |           </div>
67 |         </TooltipTrigger>
68 |         {result?.vat && (
69 |           <TooltipContent
70 |             sideOffset={20}
71 |             className="flex flex-col max-w-[310px] space-y-2"
72 |           >
73 |             <div className="flex space-x-2 items-center">
74 |               <span>VAT Assistant</span>
75 |               <Experimental className="px-2 py-0 border-border" />
76 |             </div>
77 |             <span className="text-xs text-[#878787]">
78 |               {`The VAT rate for ${name} in ${result.country} is generally ${result.vat}%. Please remember to confirm this with your local Tax office.`}
79 |             </span>
80 |
81 |             <div className="flex justify-end mt-3 pt-3">
82 |               <Button
83 |                 size="sm"
84 |                 className="h-auto py-1"
85 |                 onClick={handleOnSelect}
86 |               >
87 |                 Apply
88 |               </Button>
89 |             </div>
90 |           </TooltipContent>
91 |         )}
92 |       </Tooltip>
93 |     </TooltipProvider>
94 |   );
95 | }
```

apps/dashboard/src/components/vat-input.tsx
```
1 | import { Input } from "@midday/ui/input";
2 | import { type ChangeEventHandler, useState } from "react";
3 | import { VatAssistant } from "./vat-assistant";
4 |
5 | type Props = {
6 |   name: string;
7 |   onChange: (value: ChangeEventHandler<HTMLInputElement>) => void;
8 |   onSelect: (vat: number) => void;
9 |   value?: string | null;
10 | };
11 |
12 | export function VatInput({
13 |   name,
14 |   onChange,
15 |   onSelect,
16 |   value: defaultValue,
17 | }: Props) {
18 |   const [isFocused, setFocused] = useState(false);
19 |   const [value, setValue] = useState(defaultValue);
20 |
21 |   const handleOnSelect = (vat: number) => {
22 |     setValue(vat.toString());
23 |     onSelect(vat);
24 |   };
25 |
26 |   return (
27 |     <div className="relative">
28 |       <Input
29 |         key={value}
30 |         onChange={onChange}
31 |         autoFocus={false}
32 |         placeholder="VAT"
33 |         className="remove-arrow"
34 |         type="number"
35 |         min={0}
36 |         max={100}
37 |         step={0.1}
38 |         onFocus={() => setFocused(true)}
39 |         onBlur={() => setFocused(false)}
40 |         defaultValue={value ?? ""}
41 |       />
42 |
43 |       <VatAssistant
44 |         name={name}
45 |         value={value}
46 |         onSelect={handleOnSelect}
47 |         isFocused={isFocused}
48 |       />
49 |     </div>
50 |   );
51 | }
```

apps/dashboard/src/components/vat-number-input.tsx
```
1 | "use client";
2 |
3 | import { validateVatNumberAction } from "@/actions/validate-vat-number-action";
4 | import { Icons } from "@midday/ui/icons";
5 | import { Input } from "@midday/ui/input";
6 | import {
7 |   Tooltip,
8 |   TooltipContent,
9 |   TooltipProvider,
10 |   TooltipTrigger,
11 | } from "@midday/ui/tooltip";
12 | import { useDebounce } from "@uidotdev/usehooks";
13 | import { Loader2 } from "lucide-react";
14 | import { useAction } from "next-safe-action/hooks";
15 | import { useEffect, useState } from "react";
16 |
17 | type Props = {
18 |   value: string;
19 |   onChange: (value: string) => void;
20 |   countryCode?: string;
21 | };
22 |
23 | export function VatNumberInput({
24 |   value,
25 |   onChange,
26 |   countryCode,
27 |   ...props
28 | }: Props) {
29 |   const [vatNumber, setVatNumber] = useState(value || "");
30 |   const [companyName, setCompanyName] = useState("");
31 |   const [isValid, setIsValid] = useState<boolean | undefined>(undefined);
32 |
33 |   const validateVatNumber = useAction(validateVatNumberAction, {
34 |     onSuccess: ({ data }) => {
35 |       if (data) {
36 |         setIsValid(data.format_valid);
37 |         setCompanyName(data?.registration_info?.name || "");
38 |       }
39 |     },
40 |   });
41 |
42 |   const debouncedVatNumber = useDebounce(vatNumber, 300);
43 |
44 |   useEffect(() => {
45 |     if (
46 |       debouncedVatNumber.length > 7 &&
47 |       countryCode &&
48 |       value !== debouncedVatNumber
49 |     ) {
50 |       validateVatNumber.execute({
51 |         vat_number: debouncedVatNumber,
52 |         country_code: countryCode,
53 |       });
54 |     }
55 |   }, [debouncedVatNumber, countryCode]);
56 |
57 |   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
58 |     const newValue = e.target.value;
59 |
60 |     setVatNumber(newValue);
61 |     onChange?.(newValue);
62 |     setIsValid(undefined);
63 |   };
64 |
65 |   return (
66 |     <div className="relative">
67 |       <Input
68 |         placeholder="Enter VAT number"
69 |         value={vatNumber}
70 |         onChange={handleChange}
71 |         disabled={!countryCode}
72 |         autoComplete="off"
73 |         {...props}
74 |       />
75 |
76 |       {validateVatNumber.isExecuting && (
77 |         <Loader2 className="size-4 animate-spin absolute right-2 top-2.5" />
78 |       )}
79 |
80 |       {isValid === true && (
81 |         <TooltipProvider delayDuration={0}>
82 |           <Tooltip>
83 |             <TooltipTrigger asChild className=" absolute right-2 top-2.5">
84 |               <button type="button">
85 |                 <Icons.Check className="size-4 text-green-500" />
86 |               </button>
87 |             </TooltipTrigger>
88 |             {companyName && (
89 |               <TooltipContent
90 |                 className="px-3 py-1 text-xs text-[#878787]"
91 |                 side="left"
92 |                 sideOffset={5}
93 |               >
94 |                 <p className="capitalize">{companyName.toLowerCase()}</p>
95 |               </TooltipContent>
96 |             )}
97 |           </Tooltip>
98 |         </TooltipProvider>
99 |       )}
100 |
101 |       {!validateVatNumber.isExecuting && isValid === false && (
102 |         <TooltipProvider delayDuration={0}>
103 |           <Tooltip>
104 |             <TooltipTrigger asChild className=" absolute right-2 top-2.5">
105 |               <button type="button">
106 |                 <Icons.AlertCircle className="size-4 text-yellow-500" />
107 |               </button>
108 |             </TooltipTrigger>
109 |             <TooltipContent
110 |               className="px-3 py-1 text-xs text-[#878787]"
111 |               side="left"
112 |               sideOffset={5}
113 |             >
114 |               Invalid VAT number
115 |             </TooltipContent>
116 |           </Tooltip>
117 |         </TooltipProvider>
118 |       )}
119 |     </div>
120 |   );
121 | }
```

apps/dashboard/src/components/vault-activity.loading.tsx
```
1 | import { Skeleton } from "@midday/ui/skeleton";
2 |
3 | export function Loading() {
4 |   return (
5 |     <div className="my-6">
6 |       <span className="text-sm font-medium">Recent activity</span>
7 |       <div className="flex space-x-20 mt-6 overflow-auto w-full md:w-[calc(100vw-130px)] scrollbar-hide h-[130px]">
8 |         {...Array.from({ length: 25 }).map((_, i) => (
9 |           <div className="w-[80px]" key={i.toString()}>
10 |             <div className="text-center flex flex-col items-center ml-1">
11 |               <Skeleton className="w-[65px] h-[77px] mb-[14px]" />
12 |
13 |               <Skeleton className="w-[50px] h-[15px] mb-[8px]" />
14 |               <Skeleton className="w-[20px] h-[15px]" />
15 |             </div>
16 |           </div>
17 |         ))}
18 |       </div>
19 |     </div>
20 |   );
21 | }
```

apps/dashboard/src/components/vault-activity.tsx
```
1 | import { getUser } from "@midday/supabase/cached-queries";
2 | import { getVaultActivityQuery } from "@midday/supabase/queries";
3 | import { createClient } from "@midday/supabase/server";
4 | import { Icons } from "@midday/ui/icons";
5 | import Link from "next/link";
6 | import { VaultPreview } from "./vault-preview";
7 |
8 | // TODO: Translate
9 | const defaultFolders = [
10 |   { id: "inbox", name: "Inbox" },
11 |   { id: "exports", name: "Exports" },
12 |   { id: "imports", name: "Imports" },
13 |   { id: "transactions", name: "Transactions" },
14 |   { id: "invoices", name: "Invoices" },
15 | ];
16 |
17 | export async function VaultActivity() {
18 |   const supabase = createClient();
19 |   const { data: userData } = await getUser();
20 |
21 |   const { data: storageData } = await getVaultActivityQuery(
22 |     supabase,
23 |     userData?.team_id,
24 |   );
25 |
26 |   const files = storageData
27 |     ?.filter((file) => file.path_tokens.pop() !== ".emptyFolderPlaceholder")
28 |     .map((file) => {
29 |       const filename = file.name.split("/").at(-1);
30 |
31 |       return {
32 |         id: file.id,
33 |         name: file.name,
34 |         path: [...file.path_tokens, filename],
35 |         size: file.metadata?.size ?? 0,
36 |         mimetype: file.metadata?.mimetype,
37 |         createdAt: file.created_at,
38 |       };
39 |     });
40 |
41 |   return (
42 |     <div className="my-6">
43 |       <span className="text-sm font-medium">Recent activity</span>
44 |
45 |       <div className="flex space-x-20 mt-6 overflow-auto w-full md:w-[calc(100vw-130px)] scrollbar-hide h-[130px]">
46 |         {files?.map((file) => {
47 |           return (
48 |             <div className="w-[80px]" key={file.id}>
49 |               <VaultPreview file={file} />
50 |             </div>
51 |           );
52 |         })}
53 |
54 |         {defaultFolders.map((folder) => {
55 |           return (
56 |             <div className="w-[80px]" key={folder.id}>
57 |               <Link href={`/vault/${folder.id}`} prefetch>
58 |                 <div className="text-center flex flex-col items-center">
59 |                   <Icons.Folder
60 |                     size={65}
61 |                     className="text-[#878787] dark:text-[#2C2C2C] mb-0"
62 |                   />
63 |                   <span className="text-sm truncate w-[70px]">
64 |                     {folder.name}
65 |                   </span>
66 |                 </div>
67 |               </Link>
68 |             </div>
69 |           );
70 |         })}
71 |       </div>
72 |     </div>
73 |   );
74 | }
```

apps/dashboard/src/components/vault-preview.tsx
```
1 | "use client";
2 |
3 | import { FilePreview } from "@/components/file-preview";
4 | import { formatSize } from "@/utils/format";
5 | import {
6 |   HoverCard,
7 |   HoverCardContent,
8 |   HoverCardTrigger,
9 | } from "@midday/ui/hover-card";
10 | import { type FileType, isSupportedFilePreview } from "@midday/utils";
11 | import { FileIcon } from "./file-icon";
12 |
13 | type Props = {
14 |   preview?: boolean;
15 |   height?: number;
16 |   width?: number;
17 |   file: {
18 |     id: string;
19 |     path: string[];
20 |     mimetype: FileType;
21 |     size?: number;
22 |   };
23 | };
24 |
25 | export function VaultPreview({
26 |   file,
27 |   preview = true,
28 |   width = 45,
29 |   height = 57,
30 | }: Props) {
31 |   const filename = file.path?.at(-1);
32 |   const [, ...rest] = file.path;
33 |   // Without team_id
34 |   const downloadPath = rest.join("/");
35 |
36 |   if (isSupportedFilePreview(file.mimetype)) {
37 |     return (
38 |       <HoverCard openDelay={200}>
39 |         <HoverCardTrigger
40 |           className="text-center flex flex-col items-center"
41 |           key={file.id}
42 |         >
43 |           <div
44 |             className="bg-[#F2F1EF] dark:bg-secondary flex items-center justify-center p-2 overflow-hidden mb-2"
45 |             style={{ width: width + 20, height: height + 20 }}
46 |           >
47 |             <FilePreview
48 |               src={`/api/proxy?filePath=vault/${file?.path?.join("/")}`}
49 |               name={filename ?? ""}
50 |               type={file.mimetype}
51 |               preview
52 |               width={width}
53 |               height={height}
54 |             />
55 |           </div>
56 |
57 |           <span className="text-sm truncate w-[70px]">{filename}</span>
58 |           {file.size && (
59 |             <span className="text-sm mt-1 text-[#878787]">
60 |               {formatSize(file.size)}
61 |             </span>
62 |           )}
63 |         </HoverCardTrigger>
64 |         {preview && (
65 |           <HoverCardContent
66 |             className="w-[273px] h-[358px] p-0 overflow-hidden"
67 |             sideOffset={-40}
68 |           >
69 |             <FilePreview
70 |               src={`/api/proxy?filePath=vault/${file?.path?.join("/")}`}
71 |               downloadUrl={`/api/download/file?path=${downloadPath}&filename=${filename}`}
72 |               name={filename ?? ""}
73 |               type={file.mimetype}
74 |               width={280}
75 |               height={365}
76 |             />
77 |           </HoverCardContent>
78 |         )}
79 |       </HoverCard>
80 |     );
81 |   }
82 |
83 |   return (
84 |     <div className="text-center flex flex-col items-center" key={file.id}>
85 |       <FileIcon
86 |         isFolder={false}
87 |         mimetype={file.mimetype}
88 |         name={filename ?? ""}
89 |         size={65}
90 |         className="dark:text-[#2C2C2C] mb-0"
91 |       />
92 |       <span className="text-sm truncate w-[70px]">{filename}</span>
93 |       <span className="text-sm mt-1 text-[#878787]">
94 |         {file.size && formatSize(file.size)}
95 |       </span>
96 |     </div>
97 |   );
98 | }
```

apps/dashboard/src/components/vault-search-filter.tsx
```
1 | "use client";
2 |
3 | import { generateVaultFilters } from "@/actions/ai/filters/generate-vault-filters";
4 | import { useI18n } from "@/locales/client";
5 | import { Calendar } from "@midday/ui/calendar";
6 | import { cn } from "@midday/ui/cn";
7 | import {
8 |   DropdownMenu,
9 |   DropdownMenuCheckboxItem,
10 |   DropdownMenuContent,
11 |   DropdownMenuGroup,
12 |   DropdownMenuPortal,
13 |   DropdownMenuSub,
14 |   DropdownMenuSubContent,
15 |   DropdownMenuSubTrigger,
16 |   DropdownMenuTrigger,
17 | } from "@midday/ui/dropdown-menu";
18 | import { Icons } from "@midday/ui/icons";
19 | import { Input } from "@midday/ui/input";
20 | import { readStreamableValue } from "ai/rsc";
21 | import { formatISO } from "date-fns";
22 | import { parseAsArrayOf, parseAsString, useQueryStates } from "nuqs";
23 | import { useRef, useState } from "react";
24 | import { useHotkeys } from "react-hotkeys-hook";
25 | import { FilterList } from "./filter-list";
26 | import { SelectTag } from "./select-tag";
27 | import { TAGS } from "./tables/vault/contants";
28 |
29 | const defaultSearch = {
30 |   q: null,
31 |   start: null,
32 |   end: null,
33 |   owners: null,
34 |   tags: null,
35 | };
36 |
37 | export function VaultSearchFilter({ members }: { members: any[] }) {
38 |   const [prompt, setPrompt] = useState("");
39 |   const inputRef = useRef<HTMLInputElement>(null);
40 |   const [streaming, setStreaming] = useState(false);
41 |   const [isOpen, setIsOpen] = useState(false);
42 |
43 |   const t = useI18n();
44 |
45 |   const [filters, setFilters] = useQueryStates(
46 |     {
47 |       q: parseAsString,
48 |       start: parseAsString,
49 |       end: parseAsString,
50 |       owners: parseAsArrayOf(parseAsString),
51 |       tags: parseAsArrayOf(parseAsString),
52 |     },
53 |     {
54 |       shallow: false,
55 |     },
56 |   );
57 |
58 |   const tags = TAGS.map((tag) => ({
59 |     id: tag,
60 |     name: t(`tags.${tag}`),
61 |     slug: tag,
62 |   }));
63 |
64 |   useHotkeys(
65 |     "esc",
66 |     () => {
67 |       setPrompt("");
68 |       setFilters(defaultSearch);
69 |       setIsOpen(false);
70 |     },
71 |     {
72 |       enableOnFormTags: true,
73 |       enabled: Boolean(prompt),
74 |     },
75 |   );
76 |
77 |   useHotkeys("meta+s", (evt) => {
78 |     evt.preventDefault();
79 |     inputRef.current?.focus();
80 |   });
81 |
82 |   useHotkeys("meta+f", (evt) => {
83 |     evt.preventDefault();
84 |     setIsOpen((prev) => !prev);
85 |   });
86 |
87 |   const handleSearch = (evt: React.ChangeEvent<HTMLInputElement>) => {
88 |     const value = evt.target.value;
89 |
90 |     if (value) {
91 |       setPrompt(value);
92 |     } else {
93 |       setFilters(defaultSearch);
94 |       setPrompt("");
95 |     }
96 |   };
97 |
98 |   const handleSubmit = async () => {
99 |     setStreaming(true);
100 |
101 |     const { object } = await generateVaultFilters(
102 |       prompt,
103 |       `
104 |         Users: ${members.map((member) => member.name).join(", ")},
105 |         Tags: ${tags.map((tag) => tag.name).join(", ")},
106 |         `,
107 |     );
108 |
109 |     let finalObject = {};
110 |
111 |     for await (const partialObject of readStreamableValue(object)) {
112 |       if (partialObject) {
113 |         finalObject = {
114 |           ...finalObject,
115 |           ...partialObject,
116 |           owners:
117 |             partialObject?.owners?.map(
118 |               (name: string) =>
119 |                 members?.find((member) => member.name === name)?.id,
120 |             ) ?? null,
121 |           tags:
122 |             partialObject?.tags?.map(
123 |               (name: string) => tags?.find((tag) => tag.name === name)?.id,
124 |             ) ?? null,
125 |           q: partialObject?.name ?? null,
126 |         };
127 |       }
128 |     }
129 |
130 |     setFilters({
131 |       q: null,
132 |       ...finalObject,
133 |     });
134 |
135 |     setStreaming(false);
136 |   };
137 |
138 |   const hasValidFilters =
139 |     Object.entries(filters).filter(
140 |       ([key, value]) => value !== null && key !== "q",
141 |     ).length > 0;
142 |
143 |   return (
144 |     <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
145 |       <div className="flex space-x-4 items-center">
146 |         <FilterList
147 |           filters={filters}
148 |           loading={streaming}
149 |           onRemove={setFilters}
150 |           members={members}
151 |           tags={tags}
152 |         />
153 |
154 |         <form
155 |           className="relative"
156 |           onSubmit={(e) => {
157 |             e.preventDefault();
158 |             handleSubmit();
159 |           }}
160 |         >
161 |           <Icons.Search className="absolute pointer-events-none left-3 top-[11px]" />
162 |           <Input
163 |             ref={inputRef}
164 |             placeholder="Search for..."
165 |             className="pl-9 w-full md:w-[350px] pr-8"
166 |             value={prompt}
167 |             onChange={handleSearch}
168 |             autoComplete="off"
169 |             autoCapitalize="none"
170 |             autoCorrect="off"
171 |             spellCheck="false"
172 |           />
173 |
174 |           <DropdownMenuTrigger asChild>
175 |             <button
176 |               onClick={() => setIsOpen((prev) => !prev)}
177 |               type="button"
178 |               className={cn(
179 |                 "absolute z-10 right-3 top-[10px] opacity-50 transition-opacity duration-300 hover:opacity-100",
180 |                 hasValidFilters && "opacity-100",
181 |                 isOpen && "opacity-100",
182 |               )}
[TRUNCATED]
```

apps/dashboard/src/components/vault-settings.tsx
```
1 | import { type UpdateTeamFormValues, updateTeamSchema } from "@/actions/schema";
2 | import { updateTeamAction } from "@/actions/update-team-action";
3 | import { zodResolver } from "@hookform/resolvers/zod";
4 | import {
5 |   Form,
6 |   FormControl,
7 |   FormDescription,
8 |   FormField,
9 |   FormItem,
10 |   FormLabel,
11 | } from "@midday/ui/form";
12 | import { SubmitButton } from "@midday/ui/submit-button";
13 | import { Switch } from "@midday/ui/switch";
14 | import { useAction } from "next-safe-action/hooks";
15 | import { useForm } from "react-hook-form";
16 |
17 | type Props = {
18 |   documentClassification: boolean;
19 |   onSuccess: () => void;
20 | };
21 |
22 | export function VaultSettings({ documentClassification, onSuccess }: Props) {
23 |   const action = useAction(updateTeamAction, {
24 |     onSuccess,
25 |   });
26 |
27 |   const form = useForm<UpdateTeamFormValues>({
28 |     resolver: zodResolver(updateTeamSchema),
29 |     defaultValues: {
30 |       document_classification: documentClassification,
31 |     },
32 |   });
33 |
34 |   const onSubmit = form.handleSubmit((data) => {
35 |     action.execute({ ...data, revalidatePath: "/vault" });
36 |   });
37 |
38 |   return (
39 |     <div className="flex flex-col space-y-4">
40 |       <Form {...form}>
41 |         <form onSubmit={onSubmit} className="flex flex-col">
42 |           <FormField
43 |             control={form.control}
44 |             name="document_classification"
45 |             render={({ field }) => (
46 |               <FormItem>
47 |                 <div className="flex justify-between items-center w-full">
48 |                   <FormLabel>Document classification</FormLabel>
49 |                   <FormControl>
50 |                     <Switch
51 |                       checked={field.value}
52 |                       onCheckedChange={field.onChange}
53 |                     />
54 |                   </FormControl>
55 |                 </div>
56 |                 <FormDescription>
57 |                   We use AI to classify your documents, enabling this will
58 |                   automatically classify your documents into categories such as
59 |                   contracts, invoices, etc.
60 |                 </FormDescription>
61 |               </FormItem>
62 |             )}
63 |           />
64 |
65 |           <SubmitButton
66 |             isSubmitting={action.status === "executing"}
67 |             className="w-full mt-8"
68 |           >
69 |             Save
70 |           </SubmitButton>
71 |         </form>
72 |       </Form>
73 |     </div>
74 |   );
75 | }
```

apps/dashboard/src/components/verify-mfa.tsx
```
1 | import { createClient } from "@midday/supabase/client";
2 | import { InputOTP, InputOTPGroup, InputOTPSlot } from "@midday/ui/input-otp";
3 | import { useRouter } from "next/navigation";
4 | import { useState } from "react";
5 |
6 | export function VerifyMfa() {
7 |   const [isValidating, setValidating] = useState(false);
8 |   const [error, setError] = useState(false);
9 |   const supabase = createClient();
10 |   const router = useRouter();
11 |
12 |   const onComplete = async (code: string) => {
13 |     setError(false);
14 |
15 |     if (!isValidating) {
16 |       setValidating(true);
17 |
18 |       const factors = await supabase.auth.mfa.listFactors();
19 |
20 |       if (factors.error) {
21 |         setValidating(false);
22 |         setError(true);
23 |       }
24 |
25 |       if (!factors.data) {
26 |         setValidating(false);
27 |         setError(true);
28 |         return;
29 |       }
30 |
31 |       const totpFactor = factors.data.totp[0];
32 |
33 |       if (!totpFactor) {
34 |         setValidating(false);
35 |         setError(true);
36 |         return;
37 |       }
38 |
39 |       const factorId = totpFactor.id;
40 |
41 |       const challenge = await supabase.auth.mfa.challenge({ factorId });
42 |
43 |       if (challenge.error) {
44 |         setValidating(false);
45 |         setError(true);
46 |         return;
47 |       }
48 |
49 |       const challengeId = challenge.data.id;
50 |
51 |       const verify = await supabase.auth.mfa.verify({
52 |         factorId,
53 |         challengeId,
54 |         code,
55 |       });
56 |
57 |       if (verify.error) {
58 |         setValidating(false);
59 |         setError(true);
60 |         return;
61 |       }
62 |
63 |       router.replace("/");
64 |     }
65 |   };
66 |
67 |   return (
68 |     <>
69 |       <div className="pb-4 bg-gradient-to-r from-primary dark:via-primary dark:to-[#848484] to-[#000] inline-block text-transparent bg-clip-text">
70 |         <h1 className="font-medium pb-1 text-3xl">Verify your identity.</h1>
71 |       </div>
72 |
73 |       <div className="mb-8">
74 |         <p className="font-medium pb-1 text-2xl text-[#606060]">
75 |           Please enter the code from your authenticator app.
76 |         </p>
77 |       </div>
78 |
79 |       <div className="flex w-full mb-6">
80 |         <InputOTP
81 |           onComplete={onComplete}
82 |           maxLength={6}
83 |           autoFocus
84 |           className={error ? "invalid" : undefined}
85 |           disabled={isValidating}
86 |           render={({ slots }) => (
87 |             <InputOTPGroup>
88 |               {slots.map((slot, index) => (
89 |                 <InputOTPSlot key={index.toString()} {...slot} />
90 |               ))}
91 |             </InputOTPGroup>
92 |           )}
93 |         />
94 |       </div>
95 |
96 |       <p className="text-xs text-[#878787]">
97 |         Open your authenticator apps like 1Password, Authy, etc. to verify your
98 |         identity.
99 |       </p>
100 |     </>
101 |   );
102 | }
```

apps/dashboard/src/components/week-settings.tsx
```
1 | "use client";
2 |
3 | import { updateUserAction } from "@/actions/update-user-action";
4 | import {
5 |   Card,
6 |   CardContent,
7 |   CardDescription,
8 |   CardHeader,
9 |   CardTitle,
10 | } from "@midday/ui/card";
11 | import { Switch } from "@midday/ui/switch";
12 | import { useAction } from "next-safe-action/hooks";
13 |
14 | type Props = {
15 |   weekStartsOnMonday: boolean;
16 | };
17 |
18 | export function WeekSettings({ weekStartsOnMonday }: Props) {
19 |   const action = useAction(updateUserAction);
20 |
21 |   return (
22 |     <Card className="flex justify-between items-center">
23 |       <CardHeader>
24 |         <CardTitle>Start Week on Monday</CardTitle>
25 |         <CardDescription>
26 |           Set the first day of the week in calendar views.
27 |         </CardDescription>
28 |       </CardHeader>
29 |
30 |       <CardContent>
31 |         <Switch
32 |           checked={weekStartsOnMonday}
33 |           disabled={action.status === "executing"}
34 |           onCheckedChange={(week_starts_on_monday: boolean) => {
35 |             action.execute({ week_starts_on_monday });
36 |           }}
37 |         />
38 |       </CardContent>
39 |     </Card>
40 |   );
41 | }
```

apps/dashboard/src/components/widgets-navigation.tsx
```
1 | "use client";
2 |
3 | import { useCarousel } from "@midday/ui/carousel";
4 | import { parseAsString, useQueryStates } from "nuqs";
5 | import { useHotkeys } from "react-hotkeys-hook";
6 |
7 | export function WidgetsNavigation() {
8 |   const { scrollPrev, scrollNext } = useCarousel();
9 |   const [params] = useQueryStates({
10 |     selectedDate: parseAsString,
11 |   });
12 |
13 |   const disabled = params.selectedDate;
14 |
15 |   useHotkeys("left", scrollPrev, {
16 |     enabled: !disabled,
17 |   });
18 |
19 |   useHotkeys("right", scrollNext, {
20 |     enabled: !disabled,
21 |   });
22 |
23 |   return null;
24 | }
```

apps/dashboard/src/components/widgets.tsx
```
1 | import {
2 |   Carousel,
3 |   CarouselContent,
4 |   CarouselItem,
5 |   CarouselNext,
6 |   CarouselPrevious,
7 | } from "@midday/ui/carousel";
8 | import * as React from "react";
9 | import { Spending } from "./charts/spending";
10 | import { Transactions } from "./charts/transactions";
11 | import { WidgetsNavigation } from "./widgets-navigation";
12 | import { AccountBalance } from "./widgets/account-balance";
13 | import { Inbox } from "./widgets/inbox";
14 | import { Insights } from "./widgets/insights";
15 | import { Invoice } from "./widgets/invoice";
16 | import { Tracker } from "./widgets/tracker";
17 | import { Vault } from "./widgets/vault";
18 |
19 | type Props = {
20 |   disabled: boolean;
21 |   initialPeriod: Date | string;
22 |   searchParams: { [key: string]: string | string[] | undefined };
23 | };
24 |
25 | export function Widgets({ disabled, initialPeriod, searchParams }: Props) {
26 |   const items = [
27 |     <Insights key="insights" />,
28 |     <Spending
29 |       disabled={disabled}
30 |       initialPeriod={initialPeriod}
31 |       key="spending"
32 |       currency={searchParams?.currency}
33 |     />,
34 |     <Tracker key="tracker" date={searchParams?.date} hideDaysIndicators />,
35 |     <Transactions key="transactions" disabled={disabled} />,
36 |     <Invoice key="invoice" />,
37 |     <Inbox key="inbox" disabled={disabled} />,
38 |     <AccountBalance key="account-balance" />,
39 |     <Vault key="vault" />,
40 |   ];
41 |
42 |   return (
43 |     <Carousel
44 |       className="flex flex-col"
45 |       opts={{
46 |         align: "start",
47 |         watchDrag: false,
48 |       }}
49 |     >
50 |       <WidgetsNavigation />
51 |       <div className="ml-auto hidden md:flex">
52 |         <CarouselPrevious className="static p-0 border-none hover:bg-transparent" />
53 |         <CarouselNext className="static p-0 border-none hover:bg-transparent" />
54 |       </div>
55 |
56 |       <CarouselContent className="-ml-[20px] 2xl:-ml-[40px] flex-col md:flex-row space-y-6 md:space-y-0">
57 |         {items.map((item, idx) => {
58 |           return (
59 |             <CarouselItem
60 |               className="lg:basis-1/2 xl:basis-1/3 3xl:basis-1/4 pl-[20px] 2xl:pl-[40px]"
61 |               key={idx.toString()}
62 |             >
63 |               {item}
64 |             </CarouselItem>
65 |           );
66 |         })}
67 |       </CarouselContent>
68 |     </Carousel>
69 |   );
70 | }
```

apps/dashboard/src/desktop/main.ts
```
1 | import { createClient } from "@midday/supabase/client";
2 | import {
3 |   globalShortcut,
4 |   nativeWindow,
5 |   object,
6 |   platform,
7 | } from "@todesktop/client-core";
8 |
9 | const windows = {
10 |   command: "XEVrd9yvoaSgNhFr6GqYX",
11 | };
12 |
13 | async function main() {
14 |   // Menu items
15 |   await object.on("open-x", () => {
16 |     platform.os.openURL("https://x.com/middayai");
17 |   });
18 |
19 |   await object.on("open-discord", () => {
20 |     platform.os.openURL("https://discord.gg/ZmqcvWKH");
21 |   });
22 |
23 |   await object.on("open-github", () => {
24 |     platform.os.openURL("https://github.com/midday-ai/midday");
25 |   });
26 |
27 |   // Command menu
28 |   await object.on("open-command-menu", async () => {
29 |     const winRef = await object.retrieve({ id: windows.command });
30 |     await nativeWindow.show({ ref: winRef });
31 |   });
32 |
33 |   // Auth state for command menu
34 |   nativeWindow.on("focus", async () => {
35 |     const winRef = await object.retrieve({ id: windows.command });
36 |     const isCommandWindow = await nativeWindow.isVisible({ ref: winRef });
37 |
38 |     if (isCommandWindow) {
39 |       globalShortcut.register("Escape", async () => {
40 |         await nativeWindow.hide({ ref: winRef });
41 |       });
42 |     } else {
43 |       globalShortcut.unregister("Escape");
44 |     }
45 |
46 |     if (winRef?.id === windows.command && isCommandWindow) {
47 |       if (window.location.pathname !== "/desktop/command") {
48 |         // TODO: Fix redirect from middleware if command
49 |         window.location.pathname = "/desktop/command";
50 |       } else {
51 |         const supabase = createClient();
52 |
53 |         const {
54 |           data: { session },
55 |         } = await supabase.auth.getSession();
56 |
57 |         if (!session) {
58 |           window.location.pathname = "/";
59 |         }
60 |       }
61 |     }
62 |   });
63 | }
64 |
65 | main();
```

apps/dashboard/src/hooks/use-connect-params.ts
```
1 | import { parseAsString, parseAsStringLiteral, useQueryStates } from "nuqs";
2 |
3 | export function useConnectParams(initialCountryCode?: string) {
4 |   const [params, setParams] = useQueryStates({
5 |     step: parseAsStringLiteral(["connect", "account"]),
6 |     countryCode: parseAsString.withDefault(initialCountryCode ?? ""),
7 |     provider: parseAsStringLiteral(["teller", "plaid", "gocardless"]),
8 |     token: parseAsString,
9 |     enrollment_id: parseAsString,
10 |     institution_id: parseAsString,
11 |     q: parseAsString.withDefault("").withOptions({ clearOnDefault: true }),
12 |     error: parseAsString,
13 |     ref: parseAsString,
14 |     details: parseAsString,
15 |   });
16 |
17 |   return {
18 |     ...params,
19 |     setParams,
20 |   };
21 | }
```

apps/dashboard/src/hooks/use-customer-params.ts
```
1 | import {
2 |   parseAsArrayOf,
3 |   parseAsBoolean,
4 |   parseAsString,
5 |   useQueryStates,
6 | } from "nuqs";
7 |
8 | export function useCustomerParams(options?: { shallow: boolean }) {
9 |   const [params, setParams] = useQueryStates(
10 |     {
11 |       customerId: parseAsString,
12 |       createCustomer: parseAsBoolean,
13 |       sort: parseAsArrayOf(parseAsString),
14 |       name: parseAsString,
15 |       q: parseAsString,
16 |     },
17 |     options,
18 |   );
19 |
20 |   return {
21 |     ...params,
22 |     setParams,
23 |   };
24 | }
```

apps/dashboard/src/hooks/use-enter-submit.tsx
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

apps/dashboard/src/hooks/use-export-status.ts
```
1 | import { useRealtimeRun } from "@trigger.dev/react-hooks";
2 | import { useEffect, useState } from "react";
3 |
4 | type UseExportStatusProps = {
5 |   runId?: string;
6 |   accessToken?: string;
7 | };
8 |
9 | export function useExportStatus({
10 |   runId: initialRunId,
11 |   accessToken: initialAccessToken,
12 | }: UseExportStatusProps = {}) {
13 |   const [accessToken, setAccessToken] = useState<string | undefined>(
14 |     initialAccessToken,
15 |   );
16 |   const [runId, setRunId] = useState<string | undefined>(initialRunId);
17 |   const [status, setStatus] = useState<
18 |     "FAILED" | "IN_PROGRESS" | "COMPLETED" | null
19 |   >(null);
20 |
21 |   const [_, setProgress] = useState<number>(0);
22 |
23 |   const [result, setResult] = useState<any>(null);
24 |
25 |   const { run, error } = useRealtimeRun(runId, {
26 |     enabled: !!runId && !!accessToken,
27 |     accessToken,
28 |   });
29 |
30 |   useEffect(() => {
31 |     if (initialRunId && initialAccessToken) {
32 |       setAccessToken(initialAccessToken);
33 |       setRunId(initialRunId);
34 |       setStatus("IN_PROGRESS");
35 |     }
36 |   }, [initialRunId, initialAccessToken]);
37 |
38 |   useEffect(() => {
39 |     if (error || run?.status === "FAILED") {
40 |       setStatus("FAILED");
41 |       setProgress(0);
42 |     }
43 |
44 |     if (run?.status === "COMPLETED") {
45 |       setStatus("COMPLETED");
46 |       setProgress(100);
47 |     }
48 |   }, [error, run]);
49 |
50 |   useEffect(() => {
51 |     if (run?.output) {
52 |       setResult(run.output);
53 |     }
54 |   }, [run]);
55 |
56 |   return {
57 |     status,
58 |     setStatus,
59 |     progress: run?.metadata?.progress ?? 0,
60 |     result,
61 |   };
62 | }
```

apps/dashboard/src/hooks/use-initial-connection-status.ts
```
1 | import { useRealtimeRun } from "@trigger.dev/react-hooks";
2 | import { useEffect, useState } from "react";
3 |
4 | type UseInitialConnectionStatusProps = {
5 |   runId?: string;
6 |   accessToken?: string;
7 | };
8 |
9 | export function useInitialConnectionStatus({
10 |   runId: initialRunId,
11 |   accessToken: initialAccessToken,
12 | }: UseInitialConnectionStatusProps) {
13 |   const [accessToken, setAccessToken] = useState<string | undefined>(
14 |     initialAccessToken,
15 |   );
16 |   const [runId, setRunId] = useState<string | undefined>(initialRunId);
17 |   const [status, setStatus] = useState<
18 |     "FAILED" | "SYNCING" | "COMPLETED" | null
19 |   >(null);
20 |
21 |   const { run, error } = useRealtimeRun(runId, {
22 |     enabled: !!runId && !!accessToken,
23 |     accessToken,
24 |   });
25 |
26 |   useEffect(() => {
27 |     if (initialRunId && initialAccessToken) {
28 |       setAccessToken(initialAccessToken);
29 |       setRunId(initialRunId);
30 |       setStatus("SYNCING");
31 |     }
32 |   }, [initialRunId, initialAccessToken]);
33 |
34 |   useEffect(() => {
35 |     if (error || run?.status === "FAILED") {
36 |       setStatus("FAILED");
37 |     }
38 |
39 |     if (run?.status === "COMPLETED") {
40 |       setStatus("COMPLETED");
41 |     }
42 |   }, [error, run]);
43 |
44 |   return {
45 |     status,
46 |     setStatus,
47 |   };
48 | }
```

apps/dashboard/src/hooks/use-invoice-params.ts
```
1 | import {
2 |   parseAsArrayOf,
3 |   parseAsJson,
4 |   parseAsString,
5 |   parseAsStringEnum,
6 |   useQueryStates,
7 | } from "nuqs";
8 |
9 | import { z } from "zod";
10 |
11 | const lineItemSchema = z.object({
12 |   name: z.string(),
13 |   price: z.number(),
14 |   quantity: z.number(),
15 | });
16 |
17 | export function useInvoiceParams(options?: { shallow: boolean }) {
18 |   const [params, setParams] = useQueryStates(
19 |     {
20 |       invoiceId: parseAsString,
21 |       sort: parseAsArrayOf(parseAsString),
22 |       q: parseAsString,
23 |       statuses: parseAsArrayOf(parseAsString),
24 |       customers: parseAsArrayOf(parseAsString),
25 |       start: parseAsString,
26 |       end: parseAsString,
27 |       selectedCustomerId: parseAsString,
28 |       type: parseAsStringEnum(["edit", "create", "details", "comments"]),
29 |       lineItems: parseAsJson<z.infer<typeof lineItemSchema>>(),
30 |       currency: parseAsString,
31 |     },
32 |     options,
33 |   );
34 |
35 |   return {
36 |     ...params,
37 |     setParams,
38 |   };
39 | }
```

apps/dashboard/src/hooks/use-notifications.ts
```
1 | import { createClient } from "@midday/supabase/client";
2 | import { getUserQuery } from "@midday/supabase/queries";
3 | import { HeadlessService } from "@novu/headless";
4 | import { useCallback, useEffect, useRef, useState } from "react";
5 |
6 | export function useNotifications() {
7 |   const supabase = createClient();
8 |   const [isLoading, setLoading] = useState(true);
9 |   const [notifications, setNotifications] = useState([]);
10 |   const [subscriberId, setSubscriberId] = useState();
11 |   const headlessServiceRef = useRef<HeadlessService>();
12 |
13 |   const markAllMessagesAsRead = () => {
14 |     const headlessService = headlessServiceRef.current;
15 |
16 |     if (headlessService) {
17 |       setNotifications((prevNotifications) =>
18 |         prevNotifications.map((notification) => {
19 |           return {
20 |             ...notification,
21 |             read: true,
22 |           };
23 |         }),
24 |       );
25 |
26 |       headlessService.markAllMessagesAsRead({
27 |         listener: () => {},
28 |         onError: () => {},
29 |       });
30 |     }
31 |   };
32 |
33 |   const markMessageAsRead = (messageId: string) => {
34 |     const headlessService = headlessServiceRef.current;
35 |
36 |     if (headlessService) {
37 |       setNotifications((prevNotifications) =>
38 |         prevNotifications.map((notification) => {
39 |           if (notification.id === messageId) {
40 |             return {
41 |               ...notification,
42 |               read: true,
43 |             };
44 |           }
45 |
46 |           return notification;
47 |         }),
48 |       );
49 |
50 |       headlessService.markNotificationsAsRead({
51 |         messageId: [messageId],
52 |         listener: (result) => {},
53 |         onError: (error) => {},
54 |       });
55 |     }
56 |   };
57 |
58 |   const fetchNotifications = useCallback(() => {
59 |     const headlessService = headlessServiceRef.current;
60 |
61 |     if (headlessService) {
62 |       headlessService.fetchNotifications({
63 |         listener: ({}) => {},
64 |         onSuccess: (response) => {
65 |           setLoading(false);
66 |           setNotifications(response.data);
67 |         },
68 |       });
69 |     }
70 |   }, []);
71 |
72 |   const markAllMessagesAsSeen = () => {
73 |     const headlessService = headlessServiceRef.current;
74 |
75 |     if (headlessService) {
76 |       setNotifications((prevNotifications) =>
77 |         prevNotifications.map((notification) => ({
78 |           ...notification,
79 |           seen: true,
80 |         })),
81 |       );
82 |       headlessService.markAllMessagesAsSeen({
83 |         listener: () => {},
84 |         onError: () => {},
85 |       });
86 |     }
87 |   };
88 |
89 |   useEffect(() => {
90 |     async function fetchUser() {
91 |       const {
92 |         data: { session },
93 |       } = await supabase.auth.getSession();
94 |
95 |       const { data: userData } = await getUserQuery(
96 |         supabase,
97 |         session?.user?.id,
98 |       );
99 |
100 |       if (userData) {
101 |         setSubscriberId(`${userData.team_id}_${userData.id}`);
102 |       }
103 |     }
104 |
105 |     fetchUser();
106 |   }, [supabase]);
107 |
108 |   useEffect(() => {
109 |     const headlessService = headlessServiceRef.current;
110 |
111 |     if (headlessService) {
112 |       headlessService.listenNotificationReceive({
113 |         listener: () => {
114 |           fetchNotifications();
115 |         },
116 |       });
117 |     }
118 |   }, [headlessServiceRef.current]);
119 |
120 |   useEffect(() => {
121 |     if (subscriberId && !headlessServiceRef.current) {
122 |       const headlessService = new HeadlessService({
123 |         applicationIdentifier:
124 |           process.env.NEXT_PUBLIC_NOVU_APPLICATION_IDENTIFIER!,
125 |         subscriberId,
126 |       });
127 |
128 |       headlessService.initializeSession({
129 |         listener: () => {},
130 |         onSuccess: () => {
131 |           headlessServiceRef.current = headlessService;
132 |           fetchNotifications();
133 |         },
134 |         onError: () => {},
135 |       });
136 |     }
137 |   }, [fetchNotifications, subscriberId]);
138 |
139 |   return {
140 |     isLoading,
141 |     markAllMessagesAsRead,
142 |     markMessageAsRead,
143 |     markAllMessagesAsSeen,
144 |     hasUnseenNotifications: notifications.some(
145 |       (notification) => !notification.seen,
146 |     ),
147 |     notifications,
148 |   };
149 | }
```

apps/dashboard/src/hooks/use-scroll-anchor.ts
```
1 | import { useCallback, useEffect, useRef, useState } from "react";
2 |
3 | export const useScrollAnchor = () => {
4 |   const messagesRef = useRef<HTMLDivElement>(null);
5 |   const scrollRef = useRef<HTMLDivElement>(null);
6 |   const visibilityRef = useRef<HTMLDivElement>(null);
7 |
8 |   const [isAtBottom, setIsAtBottom] = useState(true);
9 |   const [isVisible, setIsVisible] = useState(false);
10 |
11 |   const scrollToBottom = useCallback(() => {
12 |     if (messagesRef.current) {
13 |       messagesRef.current.scrollIntoView({
14 |         block: "end",
15 |         behavior: "smooth",
16 |       });
17 |     }
18 |   }, []);
19 |
20 |   useEffect(() => {
21 |     if (messagesRef.current) {
22 |       if (isAtBottom && !isVisible) {
23 |         messagesRef.current.scrollIntoView({
24 |           block: "end",
25 |         });
26 |       }
27 |     }
28 |   }, [isAtBottom, isVisible]);
29 |
30 |   useEffect(() => {
31 |     const { current } = scrollRef;
32 |
33 |     if (current) {
34 |       const handleScroll = (event: Event) => {
35 |         const target = event.target as HTMLDivElement;
36 |         const offset = 25;
37 |         const isAtBottom =
38 |           target.scrollTop + target.clientHeight >=
39 |           target.scrollHeight - offset;
40 |
41 |         setIsAtBottom(isAtBottom);
42 |       };
43 |
44 |       current.addEventListener("scroll", handleScroll, {
45 |         passive: true,
46 |       });
47 |
48 |       return () => {
49 |         current.removeEventListener("scroll", handleScroll);
50 |       };
51 |     }
52 |   }, []);
53 |
54 |   useEffect(() => {
55 |     if (visibilityRef.current) {
56 |       const observer = new IntersectionObserver((entries) => {
57 |         entries.forEach((entry) => {
58 |           if (entry.isIntersecting) {
59 |             setIsVisible(true);
60 |           } else {
61 |             setIsVisible(false);
62 |           }
63 |         });
64 |       });
65 |
66 |       observer.observe(visibilityRef.current);
67 |
68 |       return () => {
69 |         observer.disconnect();
70 |       };
71 |     }
72 |   });
73 |
74 |   return {
75 |     messagesRef,
76 |     scrollRef,
77 |     visibilityRef,
78 |     scrollToBottom,
79 |     isAtBottom,
80 |     isVisible,
81 |   };
82 | };
```

apps/dashboard/src/hooks/use-slider-with-input.ts
```
1 | import { useCallback, useState } from "react";
2 |
3 | type UseSliderWithInputProps = {
4 |   minValue?: number;
5 |   maxValue?: number;
6 |   initialValue?: number[];
7 |   defaultValue?: number[];
8 | };
9 |
10 | export function useSliderWithInput({
11 |   minValue = 0,
12 |   maxValue = 100,
13 |   initialValue = [minValue],
14 |   defaultValue = [minValue],
15 | }: UseSliderWithInputProps) {
16 |   const [sliderValue, setSliderValue] = useState(initialValue);
17 |   const [inputValues, setInputValues] = useState(
18 |     initialValue.map((v) => v.toString()),
19 |   );
20 |
21 |   const setValues = useCallback((values: number[]) => {
22 |     setSliderValue(values);
23 |     setInputValues(values.map((v) => v.toString()));
24 |   }, []);
25 |
26 |   const validateAndUpdateValue = useCallback(
27 |     (rawValue: string, index: number) => {
28 |       if (rawValue === "" || rawValue === "-") {
29 |         const newInputValues = [...inputValues];
30 |         newInputValues[index] = "0";
31 |         setInputValues(newInputValues);
32 |
33 |         const newSliderValues = [...sliderValue];
34 |         newSliderValues[index] = 0;
35 |         setSliderValue(newSliderValues);
36 |         return;
37 |       }
38 |
39 |       const numValue = Number.parseFloat(rawValue);
40 |
41 |       if (Number.isNaN(numValue)) {
42 |         const newInputValues = [...inputValues];
43 |         newInputValues[index] = sliderValue[index].toString();
44 |         setInputValues(newInputValues);
45 |         return;
46 |       }
47 |
48 |       let clampedValue = Math.min(maxValue, Math.max(minValue, numValue));
49 |
50 |       if (sliderValue.length > 1) {
51 |         if (index === 0) {
52 |           clampedValue = Math.min(clampedValue, sliderValue[1]);
53 |         } else {
54 |           clampedValue = Math.max(clampedValue, sliderValue[0]);
55 |         }
56 |       }
57 |
58 |       const newSliderValues = [...sliderValue];
59 |       newSliderValues[index] = clampedValue;
60 |       setSliderValue(newSliderValues);
61 |
62 |       const newInputValues = [...inputValues];
63 |       newInputValues[index] = clampedValue.toString();
64 |       setInputValues(newInputValues);
65 |     },
66 |     [sliderValue, inputValues, minValue, maxValue],
67 |   );
68 |
69 |   const handleInputChange = useCallback(
70 |     (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
71 |       const newValue = e.target.value;
72 |       if (newValue === "" || /^-?\d*\.?\d*$/.test(newValue)) {
73 |         const newInputValues = [...inputValues];
74 |         newInputValues[index] = newValue;
75 |         setInputValues(newInputValues);
76 |       }
77 |     },
78 |     [inputValues],
79 |   );
80 |
81 |   const handleSliderChange = useCallback((newValue: number[]) => {
82 |     setSliderValue(newValue);
83 |     setInputValues(newValue.map((v) => v.toString()));
84 |   }, []);
85 |
86 |   const resetToDefault = useCallback(() => {
87 |     setSliderValue(defaultValue);
88 |     setInputValues(defaultValue.map((v) => v.toString()));
89 |   }, [defaultValue]);
90 |
91 |   return {
92 |     sliderValue,
93 |     inputValues,
94 |     validateAndUpdateValue,
95 |     handleInputChange,
96 |     handleSliderChange,
97 |     resetToDefault,
98 |     setValues,
99 |   };
100 | }
```

apps/dashboard/src/hooks/use-streamable-text.tsx
```
1 | import { type StreamableValue, readStreamableValue } from "ai/rsc";
2 | import { useEffect, useState } from "react";
3 |
4 | export const useStreamableText = (
5 |   content: string | StreamableValue<string>
6 | ) => {
7 |   const [rawContent, setRawContent] = useState(
8 |     typeof content === "string" ? content : ""
9 |   );
10 |
11 |   useEffect(() => {
12 |     (async () => {
13 |       if (typeof content === "object") {
14 |         let value = "";
15 |         for await (const delta of readStreamableValue(content)) {
16 |           if (typeof delta === "string") {
17 |             setRawContent((value = value + delta));
18 |           }
19 |         }
20 |       }
21 |     })();
22 |   }, [content]);
23 |
24 |   return rawContent;
25 | };
```

apps/dashboard/src/hooks/use-sync-status.ts
```
1 | import { useRealtimeRun } from "@trigger.dev/react-hooks";
2 | import { useEffect, useState } from "react";
3 |
4 | type UseSyncStatusProps = {
5 |   runId?: string;
6 |   accessToken?: string;
7 | };
8 |
9 | export function useSyncStatus({
10 |   runId: initialRunId,
11 |   accessToken: initialAccessToken,
12 | }: UseSyncStatusProps) {
13 |   const [accessToken, setAccessToken] = useState<string | undefined>(
14 |     initialAccessToken,
15 |   );
16 |   const [runId, setRunId] = useState<string | undefined>(initialRunId);
17 |   const [status, setStatus] = useState<
18 |     "FAILED" | "SYNCING" | "COMPLETED" | null
19 |   >(null);
20 |   const { run, error } = useRealtimeRun(runId, {
21 |     enabled: !!runId && !!accessToken,
22 |     accessToken,
23 |   });
24 |
25 |   useEffect(() => {
26 |     if (initialRunId && initialAccessToken) {
27 |       setAccessToken(initialAccessToken);
28 |       setRunId(initialRunId);
29 |       setStatus("SYNCING");
30 |     }
31 |   }, [initialRunId, initialAccessToken]);
32 |
33 |   useEffect(() => {
34 |     if (error || run?.status === "FAILED") {
35 |       setStatus("FAILED");
36 |     }
37 |
38 |     if (run?.status === "COMPLETED") {
39 |       setStatus("COMPLETED");
40 |     }
41 |   }, [error, run]);
42 |
43 |   return {
44 |     status,
45 |     setStatus,
46 |   };
47 | }
```

apps/dashboard/src/hooks/use-tracker-params.ts
```
1 | import { formatISO } from "date-fns";
2 | import {
3 |   parseAsArrayOf,
4 |   parseAsBoolean,
5 |   parseAsString,
6 |   parseAsStringLiteral,
7 |   useQueryStates,
8 | } from "nuqs";
9 |
10 | export function useTrackerParams(initialDate?: string) {
11 |   const [params, setParams] = useQueryStates({
12 |     date: parseAsString.withDefault(
13 |       initialDate ?? formatISO(new Date(), { representation: "date" }),
14 |     ),
15 |     create: parseAsBoolean,
16 |     projectId: parseAsString,
17 |     update: parseAsBoolean,
18 |     selectedDate: parseAsString,
19 |     range: parseAsArrayOf(parseAsString),
20 |     statuses: parseAsArrayOf(
21 |       parseAsStringLiteral(["completed", "in_progress"]),
22 |     ),
23 |     start: parseAsString,
24 |     end: parseAsString,
25 |   });
26 |
27 |   return {
28 |     ...params,
29 |     setParams,
30 |   };
31 | }
```

apps/dashboard/src/hooks/use-upload.ts
```
1 | import { createClient } from "@midday/supabase/client";
2 | import { upload } from "@midday/supabase/storage";
3 | import type { SupabaseClient } from "@supabase/supabase-js";
4 | import { useState } from "react";
5 |
6 | interface UploadParams {
7 |   file: File;
8 |   path: string[];
9 |   bucket: string;
10 | }
11 |
12 | interface UploadResult {
13 |   url: string;
14 |   path: string[];
15 | }
16 |
17 | export function useUpload() {
18 |   const supabase: SupabaseClient = createClient();
19 |   const [isLoading, setLoading] = useState<boolean>(false);
20 |
21 |   const uploadFile = async ({
22 |     file,
23 |     path,
24 |     bucket,
25 |   }: UploadParams): Promise<UploadResult> => {
26 |     setLoading(true);
27 |
28 |     try {
29 |       const url = await upload(supabase, {
30 |         path,
31 |         file,
32 |         bucket,
33 |       });
34 |
35 |       return {
36 |         url,
37 |         path,
38 |       };
39 |     } finally {
40 |       setLoading(false);
41 |     }
42 |   };
43 |
44 |   return {
45 |     uploadFile,
46 |     isLoading,
47 |   };
48 | }
```

apps/dashboard/src/locales/client.ts
```
1 | "use client";
2 |
3 | import { createI18nClient } from "next-international/client";
4 |
5 | // NOTE: Also update middleware.ts to support locale
6 | export const languages = ["en"];
7 |
8 | export const {
9 |   useScopedI18n,
10 |   I18nProviderClient,
11 |   useCurrentLocale,
12 |   useChangeLocale,
13 |   useI18n,
14 | } = createI18nClient({
15 |   en: () => import("./en"),
16 |   // sv: () => import("./sv"),
17 | });
```

apps/dashboard/src/locales/en.ts
```
1 | export default {
2 |   transaction_methods: {
3 |     card_purchase: "Card Purchase",
4 |     payment: "Payment",
5 |     card_atm: "Card ATM",
6 |     transfer: "Transfer",
7 |     other: "Other",
8 |     ach: "Ach",
9 |     deposit: "Deposit",
10 |     wire: "Wire",
11 |     fee: "Fee",
12 |     interest: "Interest",
13 |   },
14 |   language: {
15 |     title: "Languages",
16 |     description: "Change the language used in the user interface.",
17 |     placeholder: "Select language",
18 |   },
19 |   locale: {
20 |     title: "Locale",
21 |     searchPlaceholder: "Search locale",
22 |     description:
23 |       "Sets the region and language preferences for currency, dates, and other locale-specific formats.",
24 |     placeholder: "Select locale",
25 |   },
26 |   languages: {
27 |     en: "English",
28 |     sv: "Swedish",
29 |   },
30 |   timezone: {
31 |     title: "Time Zone",
32 |     searchPlaceholder: "Search timezone",
33 |     description:
34 |       "Defines the default time zone used for displaying times in the app.",
35 |     placeholder: "Select timezone",
36 |   },
37 |   spending_period: {
38 |     last_30d: "Last 30 days",
39 |     this_month: "This month",
40 |     last_month: "Last month",
41 |     this_year: "This year",
42 |     last_year: "Last year",
43 |   },
44 |   transactions_period: {
45 |     all: "All",
46 |     income: "Income",
47 |     expense: "Expense",
48 |   },
49 |   transaction_frequency: {
50 |     weekly: "Weekly recurring",
51 |     monthly: "Monthly recurring",
52 |     annually: "Annually recurring",
53 |   },
54 |   inbox_filter: {
55 |     all: "All",
56 |     todo: "Todo",
57 |     done: "Done",
58 |   },
59 |   chart_type: {
60 |     profit: "Profit",
61 |     revenue: "Revenue",
62 |     expense: "Expenses",
63 |     burn_rate: "Burn rate",
64 |   },
65 |   folders: {
66 |     all: "All",
67 |     exports: "Exports",
68 |     inbox: "Inbox",
69 |     imports: "Imports",
70 |     transactions: "Transactions",
71 |     invoices: "Invoices",
72 |   },
73 |   mfa_status: {
74 |     verified: "Verified",
75 |     unverified: "Unverified",
76 |   },
77 |   roles: {
78 |     owner: "Owner",
79 |     member: "Member",
80 |   },
81 |   tracker_status: {
82 |     in_progress: "In progress",
83 |     completed: "Completed",
84 |   },
85 |   notifications: {
86 |     inbox: "Receive notifications about new items in your inbox.",
87 |     match: "Receive notifications about matches.",
88 |     transaction: "Receive notifications about a new transaction.",
89 |     transactions: "Receive notifications about new transactions.",
90 |     "invoice.paid": "Receive notifications about paid invoices.",
91 |     "invoice.overdue": "Receive notifications about overdue invoices.",
92 |     "inbox.match": "Receive notifications about new matches in your inbox.",
93 |   },
94 |   widgets: {
95 |     insights: "Assistant",
96 |     inbox: "Inbox",
97 |     spending: "Spending",
98 |     transactions: "Transactions",
99 |     tracker: "Tracker",
100 |   },
101 |   bottom_bar: {
102 |     "transactions#one": "1 Transaction",
103 |     "transactions#other": "{count} Transactions",
104 |     multi_currency: "Multi currency",
105 |     description: "Includes transactions from all pages of results",
106 |   },
107 |   account_type: {
108 |     depository: "Depository",
109 |     credit: "Credit",
110 |     other_asset: "Other Asset",
111 |     loan: "Loan",
112 |     other_liability: "Other Liability",
113 |   },
114 |   tags: {
115 |     bylaws: "Bylaws",
116 |     shareholder_agreements: "Shareholder Agreements",
117 |     board_meeting: "Board Meeting",
118 |     corporate_policies: "Corporate Policies",
119 |     annual_reports: "Annual Reports",
120 |     budget_reports: "Budget Reports",
121 |     audit_reports: "Audit Reports",
122 |     tax_returns: "Tax Returns",
123 |     invoices_and_receipts: "Invoices & Receipts",
124 |     employee_handbook: "Employee Handbook",
125 |     payroll_records: "Payroll Records",
126 |     performance_reviews: "Performance Reviews",
127 |     employee_training_materials: "Employee Training Materials",
128 |     benefits_documentation: "Benefits Documentation",
129 |     termination_letters: "Termination Letters",
130 |     patents: "Patents",
131 |     trademarks: "Trademarks",
132 |     copyrights: "Copyrights",
133 |     client_contracts: "Client Contracts",
134 |     financial_records: "Financial Records",
135 |     compliance_reports: "Compliance Reports",
136 |     regulatory_filings: "Regulatory Filings",
137 |     advertising_copy: "Advertising Copy",
138 |     press_releases: "Press Releases",
139 |     branding_guidelines: "Branding Guidelines",
140 |     market_research_reports: "Market Research Reports",
141 |     campaign_performance_reports: "Campaign Performance Reports",
142 |     customer_surveys: "Customer Surveys",
143 |     quality_control_reports: "Quality Control Reports",
144 |     inventory_reports: "Inventory Reports",
145 |     maintenance_logs: "Maintenance Logs",
146 |     production_schedules: "Production Schedules",
147 |     vendor_agreements: "Vendor Agreements",
148 |     supplier_agreements: "Supplier Agreements",
149 |     sales_contracts: "Sales Contracts",
150 |     sales_reports: "Sales Reports",
151 |     client_proposals: "Client Proposals",
152 |     customer_order_forms: "Customer Order Forms",
153 |     sales_presentations: "Sales Presentations",
154 |     data_security_plans: "Data Security Plans",
155 |     system_architecture_diagrams: "System Architecture Diagrams",
156 |     incident_response_plans: "Incident Response Plans",
157 |     user_manuals: "User Manuals",
158 |     software_licenses: "Software Licenses",
159 |     data_backup_logs: "Data Backup Logs",
160 |     project_plans: "Project Plans",
161 |     task_lists: "Task Lists",
162 |     risk_management_plans: "Risk Management Plans",
[TRUNCATED]
```

apps/dashboard/src/locales/server.ts
```
1 | import { createI18nServer } from "next-international/server";
2 |
3 | export const { getI18n, getScopedI18n, getStaticParams } = createI18nServer({
4 |   en: () => import("./en"),
5 |   // sv: () => import("./sv"),
6 | });
```

apps/dashboard/src/locales/sv.ts
```
1 | export default {
2 |   transaction_methods: {
3 |     card_purchase: "Kortbetalning",
4 |     payment: "Betalning",
5 |     card_atm: "Kort bankomat",
6 |     transfer: "Överföring",
7 |     other: "Annan",
8 |     ach: "Ach",
9 |     deposit: "Deposition",
10 |     wire: "Wire",
11 |     fee: "Avgift",
12 |     interest: "Ränta",
13 |   },
14 |   language: {
15 |     title: "Språk",
16 |     description: "Ändra språket som används i användargränssnittet.",
17 |     placeholder: "Välj språk",
18 |   },
19 |   languages: {
20 |     en: "Engelska",
21 |     sv: "Svenska",
22 |   },
23 |   timezone: {
24 |     title: "Tidzon",
25 |     description: "Aktuell tidzoninställning.",
26 |     placeholder: "Välj tidzon",
27 |   },
28 |   inbox_filter: {
29 |     all: "Alla",
30 |     todo: "Att göra",
31 |     done: "Slutförda",
32 |   },
33 |   spending_period: {
34 |     last_30d: "Senaste 30 dagarna",
35 |     this_month: "Den här månaden",
36 |     last_month: "Förra månaden",
37 |     this_year: "Det här året",
38 |     last_year: "Förra året",
39 |   },
40 |   transactions_period: {
41 |     all: "All",
42 |     income: "Inkomst",
43 |     outcome: "Utgifter",
44 |   },
45 |   chart_type: {
46 |     profit: "Vinst",
47 |     revenue: "Omsättning",
48 |     burn_rate: "Brännhastighet",
49 |   },
50 |   folders: {
51 |     all: "Alla",
52 |     exports: "Exporteringar",
53 |     inbox: "Inkorg",
54 |     imports: "Importer",
55 |     transactions: "Transaktioner",
56 |     invoices: "Fakturor",
57 |   },
58 |   mfa_status: {
59 |     verified: "Verifierad",
60 |     unverified: "Overifierad",
61 |   },
62 |   roles: {
63 |     owner: "Ägare",
64 |     member: "Medlem",
65 |   },
66 |   tracker_status: {
67 |     in_progress: "Pågående",
68 |     completed: "Färdig",
69 |   },
70 |   account_balance: {
71 |     total_balance: "Total saldo",
72 |   },
73 | } as const;
```

apps/dashboard/src/store/assistant.ts
```
1 | import { create } from "zustand";
2 |
3 | interface AssistantState {
4 |   isOpen: boolean;
5 |   message?: string;
6 |   setOpen: (message?: string) => void;
7 | }
8 |
9 | export const useAssistantStore = create<AssistantState>()((set) => ({
10 |   isOpen: false,
11 |   message: undefined,
12 |   setOpen: (message) => set((state) => ({ isOpen: !state.isOpen, message })),
13 | }));
```

apps/dashboard/src/store/export.ts
```
1 | import { create } from "zustand";
2 |
3 | interface ExportState {
4 |   exportData?: {
5 |     runId?: string;
6 |     accessToken?: string;
7 |   };
8 |   setExportData: (exportData?: {
9 |     runId?: string;
10 |     accessToken?: string;
11 |   }) => void;
12 | }
13 |
14 | export const useExportStore = create<ExportState>()((set) => ({
15 |   exportData: undefined,
16 |   setExportData: (exportData) => set({ exportData }),
17 | }));
```

apps/dashboard/src/store/menu.ts
```
1 | import { create } from "zustand";
2 |
3 | interface MenuState {
4 |   isCustomizing: boolean;
5 |   setCustomizing: (isCustomizing: boolean) => void;
6 |   toggleCustomizing: () => void;
7 | }
8 |
9 | export const useMenuStore = create<MenuState>()((set) => ({
10 |   isCustomizing: false,
11 |   setCustomizing: (isCustomizing) => set({ isCustomizing }),
12 |   toggleCustomizing: () =>
13 |     set((state) => ({ isCustomizing: !state.isCustomizing })),
14 | }));
```

apps/dashboard/src/store/transactions.ts
```
1 | import type { RowSelectionState, Updater } from "@tanstack/react-table";
2 | import { create } from "zustand";
3 |
4 | interface TransactionsState {
5 |   canDelete?: boolean;
6 |   columns: string[];
7 |   setColumns: (columns?: string[]) => void;
8 |   setCanDelete: (canDelete?: boolean) => void;
9 |   setRowSelection: (updater: Updater<RowSelectionState>) => void;
10 |   rowSelection: Record<string, boolean>;
11 | }
12 |
13 | export const useTransactionsStore = create<TransactionsState>()((set) => ({
14 |   columns: [],
15 |   canDelete: false,
16 |   rowSelection: {},
17 |   setCanDelete: (canDelete) => set({ canDelete }),
18 |   setColumns: (columns) => set({ columns }),
19 |   setRowSelection: (updater: Updater<RowSelectionState>) =>
20 |     set((state) => {
21 |       return {
22 |         rowSelection:
23 |           typeof updater === "function" ? updater(state.rowSelection) : updater,
24 |       };
25 |     }),
26 | }));
```

apps/dashboard/src/styles/globals.css
```
1 | html,
2 | body {
3 |   height: 100%;
4 | }
5 |
6 | *:focus {
7 |   outline: none;
8 | }
9 |
10 | .skeleton-box {
11 |   background-color: hsl(var(--border));
12 |   color: hsl(var(--border)) !important;
13 |   user-select: none !important;
14 |   cursor: default !important;
15 |   animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
16 |   border-color: transparent !important;
17 | }
18 |
19 | .skeleton-circle {
20 |   background-color: hsl(var(--border));
21 |   border-radius: 1000px !important;
22 |   color: hsl(var(--border)) !important;
23 |   user-select: none !important;
24 |   cursor: default !important;
25 |   animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
26 |   border-color: transparent !important;
27 | }
28 |
29 | .skeleton-circle > *,
30 | .skeleton-box > *,
31 | .skeleton-line > * {
32 |   opacity: 0 !important;
33 | }
34 |
35 | .pin-field-container {
36 |   display: grid;
37 |   grid-auto-columns: max-content;
38 |   grid-auto-flow: column;
39 |   justify-content: center;
40 |   margin: 4rem 0;
41 | }
42 |
43 | .pin-field {
44 |   border: 1px solid hsl(var(--border));
45 |   background-color: hsl(var(--accent));
46 |   border-right: none;
47 |   font-size: 2rem;
48 |   height: 4rem;
49 |   outline: none;
50 |   text-align: center;
51 |   transition-duration: 250ms;
52 |   transition-property: color, border, box-shadow, transform;
53 |   width: 4rem;
54 | }
55 |
56 | .pin-field:last-of-type {
57 |   border-radius: 0 0.5rem 0.5rem 0;
58 |   border-right: 1px solid hsl(var(--border));
59 | }
60 |
61 | .pin-field:focus {
62 |   box-shadow: "0 0 0.25rem rgba(white, 0.5)";
63 |   opacity: 0.9;
64 |   outline: none;
65 | }
66 |
67 | .invalid {
68 |   animation: shake 0.2s ease-in-out 0s 2;
69 | }
70 |
71 | .pin-field:first-of-type {
72 |   border-radius: 0.5rem 0 0 0.5rem;
73 | }
74 |
75 | .pin-field[disabled] {
76 |   cursor: not-allowed;
77 |   opacity: 0.5;
78 | }
79 |
80 | @keyframes shake {
81 |   0% {
82 |     transform: translateX(0rem);
83 |   }
84 |   25% {
85 |     transform: translateX(0.5rem);
86 |   }
87 |   75% {
88 |     transform: translateX(-0.5rem);
89 |   }
90 |   100% {
91 |     transform: translateX(0rem);
92 |   }
93 | }
94 |
95 | /* Desktop App */
96 | html.todesktop {
97 |   user-select: none;
98 |   -webkit-user-select: none;
99 | }
100 |
101 | html.todesktop,
102 | html.todesktop div {
103 |   cursor: default !important;
104 | }
105 |
106 | html.todesktop,
107 | html.todesktop.div {
108 |   cursor: default !important;
109 | }
110 |
111 | html.todesktop a {
112 |   cursor: pointer !important;
113 | }
114 |
115 | .update-available {
116 |   background: #68a7ff;
117 |   width: 12px;
118 |   height: 12px;
119 |   border-radius: 50%;
120 |   position: relative;
121 | }
122 |
123 | .update-available svg {
124 |   position: absolute;
125 |   width: 12px;
126 |   height: 12px;
127 |   top: 0;
128 |   left: 0;
129 | }
130 |
131 | .update-available svg path.svg-update {
132 |   opacity: 1;
133 |   transform: scale(1);
134 | }
135 |
136 | .update-available svg circle.svg-progress {
137 |   stroke-dashoffset: 16px;
138 |   stroke-dasharray: 16px;
139 |   transform: rotate(270deg);
140 |   transform-origin: center;
141 | }
142 |
143 | .update-available.progress svg path.svg-update,
144 | .update-available.update-downloaded svg path.svg-update {
145 |   opacity: 0;
146 |   transform: scale(0.5);
147 | }
148 |
149 | .update-available.progress svg circle.svg-progress {
150 |   stroke-dashoffset: 0px;
151 |   transform: rotate(270deg);
152 |   transition: all 4s linear;
153 | }
154 |
155 | .update-available svg path.svg-refresh {
156 |   opacity: 0;
157 |   transform: scale(0.2) rotate(-135deg);
158 |   transition: all .3s ease;
159 |   transform-origin: center;
160 | }
161 |
162 | .update-available.update-downloaded svg path.svg-refresh {
163 |   opacity: 1;
164 |   transform: scale(1) rotate(0);
165 | }
166 |
167 | @keyframes anim-update {
168 |   0% {
169 |     transform: scale(0);
170 |     opacity: 1;
171 |   }
172 |   100% {
173 |     transform: scale(4);
174 |     opacity: 0;
175 |   }
176 | }
177 |
178 | /* Desktop Command menu */
179 | html.light.todesktop-panel {
180 |   background-color: rgba(255, 255, 255, 0.5);
181 | }
182 |
183 | html.dark.todesktop-panel {
184 |   background-color: rgba(000, 000, 000, 0.3);
185 | }
186 |
187 | html.todesktop-panel body {
[TRUNCATED]
```

apps/dashboard/src/utils/categories.ts
```
1 | export const colors = [
2 |   "#FF6900", // Orange
3 |   "#FCB900", // Yellow
4 |   "#00D084", // Emerald
5 |   "#8ED1FC", // Sky Blue
6 |   "#0693E3", // Blue
7 |   "#ABB8C3", // Gray
8 |   "#EB144C", // Red
9 |   "#F78DA7", // Pink
10 |   "#9900EF", // Purple
11 |   "#0079BF", // Dark Blue
12 |   "#B6BBBF", // Light Gray
13 |   "#FF5A5F", // Coral
14 |   "#F7C59F", // Peach
15 |   "#8492A6", // Slate
16 |   "#4D5055", // Charcoal
17 |   "#AF5A50", // Terracotta
18 |   "#F9D6E7", // Pale Pink
19 |   "#B5EAEA", // Pale Cyan
20 |   "#B388EB", // Lavender
21 |   "#B04632", // Rust
22 |   "#FF78CB", // Pink
23 |   "#4E5A65", // Gray
24 |   "#01FF70", // Lime
25 |   "#85144b", // Pink
26 |   "#F012BE", // Purple
27 |   "#7FDBFF", // Sky Blue
28 |   "#3D9970", // Olive
29 |   "#AAAAAA", // Silver
30 |   "#111111", // Black
31 |   "#0074D9", // Blue
32 |   "#39CCCC", // Teal
33 |   "#001f3f", // Navy
34 |   "#FF9F1C", // Orange
35 |   "#5E6A71", // Ash
36 |   "#75D701", // Neon Green
37 |   "#B6C8A9", // Lichen
38 |   "#00A9FE", // Electric Blue
39 |   "#EAE8E1", // Bone
40 |   "#CD346C", // Raspberry
41 |   "#FF6FA4", // Pink Sherbet
42 |   "#D667FB", // Purple Mountain Majesty
43 |   "#0080FF", // Azure
44 |   "#656D78", // Dim Gray
45 |   "#F8842C", // Tangerine
46 |   "#FF8CFF", // Carnation Pink
47 |   "#647F6A", // Feldgrau
48 |   "#5E574E", // Field Drab
49 |   "#EF5466", // KU Crimson
50 |   "#B0E0E6", // Powder Blue
51 |   "#EB5E7C", // Rose Pink
52 |   "#8A2BE2", // Blue Violet
53 |   "#6B7C85", // Slate Gray
54 |   "#8C92AC", // Lavender Blue
55 |   "#6C587A", // Eminence
56 |   "#52A1FF", // Azureish White
57 |   "#32CD32", // Lime Green
58 |   "#E04F9F", // Orchid Pink
59 |   "#915C83", // Lilac Bush
60 |   "#4C6B88", // Air Force Blue
61 |   "#587376", // Cadet Blue
62 |   "#C46210", // Buff
63 |   "#65B0D0", // Columbia Blue
64 |   "#2F4F4F", // Dark Slate Gray
65 |   "#528B8B", // Dark Cyan
66 |   "#8B4513", // Saddle Brown
67 |   "#4682B4", // Steel Blue
68 |   "#CD853F", // Peru
69 |   "#FFA07A", // Light Salmon
70 |   "#CD5C5C", // Indian Red
71 |   "#483D8B", // Dark Slate Blue
72 |   "#696969", // Dim Gray
73 | ];
74 |
75 | export function customHash(value: string) {
76 |   let hash = 0;
77 |
78 |   for (let i = 0; i < value.length; i++) {
79 |     hash = (hash << 5) + value.charCodeAt(i);
80 |     hash = hash & hash;
81 |   }
82 |
83 |   return Math.abs(hash);
84 | }
85 |
86 | export function getColor(value: string, arrayLength: number) {
87 |   const hashValue = customHash(value);
88 |   const index = hashValue % arrayLength;
89 |   return index;
90 | }
91 |
92 | export function getColorFromName(value: string) {
93 |   const index = getColor(value, colors.length);
94 |
95 |   return colors[index];
96 | }
97 |
98 | export function getRandomColor() {
99 |   const randomIndex = Math.floor(Math.random() * colors.length);
100 |   return colors[randomIndex];
101 | }
```

apps/dashboard/src/utils/connection-status.ts
```
1 | import { differenceInDays } from "date-fns";
2 |
3 | const DISPLAY_DAYS = 30;
4 | const WARNING_DAYS = 14;
5 | const ERROR_DAYS = 7;
6 |
7 | type Connection = {
8 |   expires_at?: string | null;
9 | };
10 |
11 | export function getConnectionsStatus(connections: Connection[] | null) {
12 |   const warning = connections?.some(
13 |     (connection) =>
14 |       connection.expires_at &&
15 |       differenceInDays(new Date(connection.expires_at), new Date()) <=
16 |         WARNING_DAYS,
17 |   );
18 |
19 |   const error = connections?.some(
20 |     (connection) =>
21 |       connection.expires_at &&
22 |       differenceInDays(new Date(connection.expires_at), new Date()) <=
23 |         ERROR_DAYS,
24 |   );
25 |
26 |   const expired = connections?.some(
27 |     (connection) =>
28 |       connection.expires_at &&
29 |       differenceInDays(new Date(connection.expires_at), new Date()) <= 0,
30 |   );
31 |
32 |   const show = connections?.some(
33 |     (connection) =>
34 |       connection.expires_at &&
35 |       differenceInDays(new Date(connection.expires_at), new Date()) <=
36 |         DISPLAY_DAYS,
37 |   );
38 |
39 |   return {
40 |     warning,
41 |     expired,
42 |     error,
43 |     show,
44 |   };
45 | }
46 |
47 | export function connectionStatus(connection: Connection) {
48 |   const warning =
49 |     connection.expires_at &&
50 |     differenceInDays(new Date(connection.expires_at), new Date()) <=
51 |       WARNING_DAYS;
52 |
53 |   const error =
54 |     connection.expires_at &&
55 |     differenceInDays(new Date(connection.expires_at), new Date()) <= ERROR_DAYS;
56 |
57 |   const expired =
58 |     connection.expires_at &&
59 |     differenceInDays(new Date(connection.expires_at), new Date()) <= 0;
60 |
61 |   const show =
62 |     connection.expires_at &&
63 |     differenceInDays(new Date(connection.expires_at), new Date()) <=
64 |       DISPLAY_DAYS;
65 |
66 |   return {
67 |     warning,
68 |     error,
69 |     expired,
70 |     show,
71 |   };
72 | }
```

apps/dashboard/src/utils/constants.ts
```
1 | export const Cookies = {
2 |   PreferredSignInProvider: "preferred-signin-provider",
3 |   SpendingPeriod: "spending-period",
4 |   ChartType: "chart-type",
5 |   TransactionsPeriod: "transactions-period",
6 |   TransactionsColumns: "transactions-columns",
7 |   MfaSetupVisited: "mfa-setup-visited",
8 |   MenuConfig: "menu-config-v2",
9 |   InboxFilter: "inbox-filter-v2",
10 |   TrackingConsent: "tracking-consent",
11 |   InboxOrder: "inbox-order",
12 |   HideConnectFlow: "hide-connect-flow",
13 |   LastProject: "last-project",
14 | };
```

apps/dashboard/src/utils/currency.test.ts
```
1 | import { describe, expect, test } from "bun:test";
2 | import { getMostFrequentCurrency } from "./currency";
3 |
4 | describe("Get most frequent currency", () => {
5 |   const accounts = [
6 |     { currency: "USD" },
7 |     { currency: "USD" },
8 |     { currency: "EUR" },
9 |   ];
10 |
11 |   test("should return the most frequent currency", () => {
12 |     expect(getMostFrequentCurrency(accounts)).toBe("USD");
13 |   });
14 |
15 |   test("should return the first currency if all are equally frequent", () => {
16 |     expect(getMostFrequentCurrency(accounts)).toBe("USD");
17 |   });
18 |
19 |   test("should return the null if there are no accounts", () => {
20 |     const accounts: { currency: string }[] = [];
21 |     expect(getMostFrequentCurrency(accounts)).toBe(null);
22 |   });
23 | });
```

apps/dashboard/src/utils/currency.ts
```
1 | export function getMostFrequentCurrency(
2 |   accounts: { currency: string }[],
3 | ): string | null {
4 |   if (accounts.length === 0) {
5 |     return null;
6 |   }
7 |
8 |   const currencyFrequency = accounts.reduce((acc, account) => {
9 |     acc.set(account.currency, (acc.get(account.currency) || 0) + 1);
10 |     return acc;
11 |   }, new Map<string, number>());
12 |
13 |   if (currencyFrequency.size === 1) {
14 |     return currencyFrequency.keys().next().value;
15 |   }
16 |
17 |   const mostFrequent = [...currencyFrequency.entries()].reduce((a, b) =>
18 |     a[1] > b[1] ? a : b[1] === a[1] ? (a[0] < b[0] ? a : b) : b,
19 |   );
20 |
21 |   return mostFrequent[0];
22 | }
```

apps/dashboard/src/utils/dub.ts
```
1 | import { Dub } from "dub";
2 |
3 | export const dub = new Dub();
```

apps/dashboard/src/utils/format.ts
```
1 | import type { TZDate } from "@date-fns/tz";
2 | import {
3 |   differenceInDays,
4 |   differenceInMonths,
5 |   format,
6 |   isSameYear,
7 |   startOfDay,
8 | } from "date-fns";
9 |
10 | export function formatSize(bytes: number): string {
11 |   const units = ["byte", "kilobyte", "megabyte", "gigabyte", "terabyte"];
12 |
13 |   const unitIndex = Math.max(
14 |     0,
15 |     Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1),
16 |   );
17 |
18 |   return Intl.NumberFormat("en-US", {
19 |     style: "unit",
20 |     unit: units[unitIndex],
21 |   }).format(+Math.round(bytes / 1024 ** unitIndex));
22 | }
23 |
24 | type FormatAmountParams = {
25 |   currency: string;
26 |   amount: number;
27 |   locale?: string;
28 |   maximumFractionDigits?: number;
29 |   minimumFractionDigits?: number;
30 | };
31 |
32 | export function formatAmount({
33 |   currency,
34 |   amount,
35 |   locale = "en-US",
36 |   minimumFractionDigits,
37 |   maximumFractionDigits,
38 | }: FormatAmountParams) {
39 |   if (!currency) {
40 |     return;
41 |   }
42 |
43 |   return Intl.NumberFormat(locale, {
44 |     style: "currency",
45 |     currency,
46 |     minimumFractionDigits,
47 |     maximumFractionDigits,
48 |   }).format(amount);
49 | }
50 |
51 | export function secondsToHoursAndMinutes(seconds: number) {
52 |   const hours = Math.floor(seconds / 3600);
53 |   const minutes = Math.floor((seconds % 3600) / 60);
54 |
55 |   if (hours && minutes) {
56 |     return `${hours}:${minutes.toString().padStart(2, "0")}h`;
57 |   }
58 |
59 |   if (hours) {
60 |     return `${hours}h`;
61 |   }
62 |
63 |   if (minutes) {
64 |     return `${minutes}m`;
65 |   }
66 |
67 |   return "0h";
68 | }
69 |
70 | type BurnRateData = {
71 |   value: number;
72 |   date: string;
73 | };
74 |
75 | export function calculateAvgBurnRate(data: BurnRateData[] | null) {
76 |   if (!data) {
77 |     return 0;
78 |   }
79 |
80 |   return data?.reduce((acc, curr) => acc + curr.value, 0) / data?.length;
81 | }
82 |
83 | export function formatDate(date: string, dateFormat?: string) {
84 |   if (isSameYear(new Date(), new Date(date))) {
85 |     return format(new Date(date), "MMM d");
86 |   }
87 |
88 |   return format(new Date(date), dateFormat ?? "P");
89 | }
90 |
91 | export function getInitials(value: string) {
92 |   const formatted = value.toUpperCase().replace(/[\s.-]/g, "");
93 |
94 |   if (formatted.split(" ").length > 1) {
95 |     return `${formatted.charAt(0)}${formatted.charAt(1)}`;
96 |   }
97 |
98 |   if (value.length > 1) {
99 |     return formatted.charAt(0) + formatted.charAt(1);
100 |   }
101 |
102 |   return formatted.charAt(0);
103 | }
104 |
105 | export function formatAccountName({
106 |   name,
107 |   currency,
108 | }: { name?: string; currency?: string }) {
109 |   if (currency) {
110 |     return `${name} (${currency})`;
111 |   }
112 |
113 |   return name;
114 | }
115 |
116 | export function formatDateRange(dates: TZDate[]): string {
117 |   if (!dates.length) return "";
118 |
119 |   const formatFullDate = (date: TZDate) => format(date, "MMM d");
120 |   const formatDay = (date: TZDate) => format(date, "d");
121 |
122 |   if (dates.length === 1 || dates[0].getTime() === dates[1]?.getTime()) {
123 |     return formatFullDate(dates[0]);
124 |   }
125 |
126 |   const startDate = dates[0];
127 |   const endDate = dates[1];
128 |
129 |   if (!startDate || !endDate) return "";
130 |
131 |   if (startDate.getMonth() === endDate.getMonth()) {
132 |     // Same month
133 |     return `${format(startDate, "MMM")} ${formatDay(startDate)} - ${formatDay(endDate)}`;
134 |   }
135 |   // Different months
136 |   return `${formatFullDate(startDate)} - ${formatFullDate(endDate)}`;
137 | }
138 |
139 | export function getDueDateStatus(dueDate: string): string {
140 |   const now = new Date();
141 |   const due = new Date(dueDate);
142 |
143 |   // Set both dates to the start of their respective days
144 |   const nowDay = startOfDay(now);
145 |   const dueDay = startOfDay(due);
146 |
147 |   const diffDays = differenceInDays(dueDay, nowDay);
148 |   const diffMonths = differenceInMonths(dueDay, nowDay);
149 |
150 |   if (diffDays === 0) return "Today";
151 |   if (diffDays === 1) return "Tomorrow";
152 |   if (diffDays === -1) return "Yesterday";
153 |
154 |   if (diffDays > 0) {
155 |     if (diffMonths < 1) return `in ${diffDays} days`;
156 |     return `in ${diffMonths} month${diffMonths === 1 ? "" : "s"}`;
157 |   }
158 |
159 |   if (diffMonths < 1)
160 |     return `${Math.abs(diffDays)} day${Math.abs(diffDays) === 1 ? "" : "s"} ago`;
161 |   return `${diffMonths} month${diffMonths === 1 ? "" : "s"} ago`;
162 | }
163 |
164 | export function formatRelativeTime(date: Date): string {
165 |   const now = new Date();
[TRUNCATED]
```

apps/dashboard/src/utils/logger.ts
```
1 | export const logger = (message: string, params?: unknown) => {
2 |   console.log(message, params);
3 | };
```

apps/dashboard/src/utils/process.ts
```
1 | export async function processPromisesBatch(items: any, limit: number, fn) {
2 |   const batches = [];
3 |   let result: any = [];
4 |
5 |   // Split the items into batches
6 |   for (let i = 0; i < items?.length; i += limit) {
7 |     batches.push(items.slice(i, i + limit));
8 |   }
9 |
10 |   // Process batches serially
11 |   for (const batch of batches) {
12 |     const processedBatch = await fn(batch);
13 |     result = result.concat(processedBatch);
14 |   }
15 |
16 |   return result;
17 | }
```

apps/dashboard/src/utils/resend.ts
```
1 | import { Resend } from "resend";
2 |
3 | export const resend = new Resend(process.env.RESEND_API_KEY!);
```

apps/dashboard/src/utils/teller.ts
```
1 | import crypto from "node:crypto";
2 |
3 | // https://teller.io/docs/api/webhooks#verifying-messages
4 | export const validateTellerSignature = (params: {
5 |   signatureHeader: string | null;
6 |   text: string;
7 | }): boolean => {
8 |   if (!params.signatureHeader) {
9 |     return false;
10 |   }
11 |
12 |   const { timestamp, signatures } = parseTellerSignatureHeader(
13 |     params.signatureHeader,
14 |   );
15 |
16 |   const threeMinutesAgo = Math.floor(Date.now() / 1000) - 3 * 60;
17 |
18 |   if (Number.parseInt(timestamp) < threeMinutesAgo) {
19 |     return false;
20 |   }
21 |
22 |   // Ensure the text is used as a raw string
23 |   const signedMessage = `${timestamp}.${params.text}`;
24 |   const calculatedSignature = crypto
25 |     .createHmac("sha256", process.env.TELLER_SIGNING_SECRET!)
26 |     .update(signedMessage)
27 |     .digest("hex");
28 |
29 |   // Compare calculated signature with provided signatures
30 |   return signatures.includes(calculatedSignature);
31 | };
32 |
33 | export const parseTellerSignatureHeader = (
34 |   header: string,
35 | ): { timestamp: string; signatures: string[] } => {
36 |   const parts = header.split(",");
37 |   const timestampPart = parts.find((p) => p.startsWith("t="));
38 |   const signatureParts = parts.filter((p) => p.startsWith("v1="));
39 |
40 |   if (!timestampPart) {
41 |     throw new Error("No timestamp in Teller-Signature header");
42 |   }
43 |
44 |   const timestamp = timestampPart.split("=")[1];
45 |   const signatures = signatureParts
46 |     .map((p) => p.split("=")[1])
47 |     .filter((sig): sig is string => sig !== undefined);
48 |
49 |   if (!timestamp || signatures.some((sig) => !sig)) {
50 |     throw new Error("Invalid Teller-Signature header format");
51 |   }
52 |
53 |   return { timestamp, signatures };
54 | };
```

apps/dashboard/src/utils/tracker.ts
```
1 | import {
2 |   addMinutes,
3 |   addSeconds,
4 |   eachDayOfInterval,
5 |   format,
6 |   parseISO,
7 |   setHours,
8 |   setMinutes,
9 | } from "date-fns";
10 |
11 | export const NEW_EVENT_ID = "new-event";
12 |
13 | export function sortDates(dates: string[]) {
14 |   return dates.sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
15 | }
16 |
17 | export function getTrackerDates(
18 |   range: string[] | null,
19 |   selectedDate: string | null,
20 | ): Date[] {
21 |   if (range) {
22 |     return sortDates(range).map((dateString) => new Date(dateString));
23 |   }
24 |
25 |   if (selectedDate) {
26 |     return [new Date(selectedDate)];
27 |   }
28 |
29 |   return [new Date()];
30 | }
31 |
32 | export const formatHour = (hour: number, timeFormat: number) => {
33 |   const date = new Date();
34 |   date.setHours(hour, 0, 0, 0);
35 |   return format(date, timeFormat === 12 ? "hh:mm a" : "HH:mm");
36 | };
37 |
38 | export const getTimeFromDate = (date: Date) => {
39 |   return format(date, "HH:mm");
40 | };
41 |
42 | export const getSlotFromDate = (date: Date) => {
43 |   return date.getHours() * 4 + Math.floor(date.getMinutes() / 15);
44 | };
45 |
46 | export const createNewEvent = (
47 |   slot: number,
48 |   selectedProjectId: string | null,
49 | ): TrackerRecord => {
50 |   const startDate = setMinutes(
51 |     setHours(new Date(), Math.floor(slot / 4)),
52 |     (slot % 4) * 15,
53 |   );
54 |   const endDate = addMinutes(startDate, 15);
55 |   return {
56 |     id: NEW_EVENT_ID,
57 |     start: startDate,
58 |     end: endDate,
59 |     project: { id: selectedProjectId ?? "", name: "" },
60 |   };
61 | };
62 |
63 | export const updateEventTime = (
64 |   event: TrackerRecord,
65 |   start: Date,
66 |   end: Date,
67 | ): TrackerRecord => {
68 |   return { ...event, start, end };
69 | };
70 |
71 | export const getDates = (
72 |   selectedDate: string | null,
73 |   sortedRange: string[] | null,
74 | ): string[] => {
75 |   if (selectedDate) return [selectedDate];
76 |   if (sortedRange && sortedRange.length === 2) {
77 |     const [start, end] = sortedRange;
78 |     if (start && end) {
79 |       return eachDayOfInterval({
80 |         start: parseISO(start),
81 |         end: parseISO(end),
82 |       }).map((date) => format(date, "yyyy-MM-dd"));
83 |     }
84 |   }
85 |   return [];
86 | };
87 |
88 | export const transformTrackerData = (
89 |   event: any,
90 |   selectedDate: string | null,
91 | ): TrackerRecord => {
92 |   const start = event.start
93 |     ? parseISO(event.start)
94 |     : parseISO(`${event.date || selectedDate}T09:00:00`);
95 |   const end = event.end
96 |     ? parseISO(event.end)
97 |     : addSeconds(start, event.duration || 0);
98 |
99 |   return {
100 |     ...event,
101 |     id: event.id,
102 |     start,
103 |     end,
104 |     project: {
105 |       id: event.project_id,
106 |       name: event.project?.name || "",
107 |       customer: event.project?.customer,
108 |     },
109 |     description: event.description,
110 |   };
111 | };
```

apps/dashboard/src/utils/upload.ts
```
1 | import { stripSpecialCharacters } from "@midday/utils";
2 | import type { SupabaseClient } from "@supabase/supabase-js";
3 | import * as tus from "tus-js-client";
4 |
5 | type ResumableUploadParmas = {
6 |   file: File;
7 |   path: string[];
8 |   bucket: string;
9 |   onProgress?: (bytesUploaded: number, bytesTotal: number) => void;
10 | };
11 |
12 | export async function resumableUpload(
13 |   client: SupabaseClient,
14 |   { file, path, bucket, onProgress }: ResumableUploadParmas,
15 | ) {
16 |   const {
17 |     data: { session },
18 |   } = await client.auth.getSession();
19 |
20 |   const filename = stripSpecialCharacters(file.name);
21 |
22 |   const fullPath = decodeURIComponent([...path, filename].join("/"));
23 |
24 |   return new Promise((resolve, reject) => {
25 |     const upload = new tus.Upload(file, {
26 |       endpoint: `https://${process.env.NEXT_PUBLIC_SUPABASE_ID}.supabase.co/storage/v1/upload/resumable`,
27 |       retryDelays: [0, 3000, 5000, 10000],
28 |       headers: {
29 |         authorization: `Bearer ${session?.access_token}`,
30 |         // optionally set upsert to true to overwrite existing files
31 |         "x-upsert": "true",
32 |       },
33 |       uploadDataDuringCreation: true,
34 |       // Important if you want to allow re-uploading the same file https://github.com/tus/tus-js-client/blob/main/docs/api.md#removefingerprintonsuccess
35 |       removeFingerprintOnSuccess: true,
36 |       metadata: {
37 |         bucketName: bucket,
38 |         objectName: fullPath,
39 |         contentType: file.type,
40 |         cacheControl: "3600",
41 |       },
42 |       // NOTE: it must be set to 6MB (for now) do not change it
43 |       chunkSize: 6 * 1024 * 1024,
44 |       onError: (error) => {
45 |         reject(error);
46 |       },
47 |       onProgress,
48 |       onSuccess: () => {
49 |         resolve({
50 |           ...upload,
51 |           filename,
52 |         });
53 |       },
54 |     });
55 |
56 |     // Check if there are any previous uploads to continue.
57 |     return upload.findPreviousUploads().then((previousUploads) => {
58 |       // Found previous uploads so we select the first one.
59 |       if (previousUploads.length) {
60 |         upload.resumeFromPreviousUpload(previousUploads[0]);
61 |       }
62 |
63 |       upload.start();
64 |     });
65 |   });
66 | }
```

apps/docs/api-reference/engine/introduction.mdx
```
1 | ---
2 | title: "Introduction"
3 | "og:title": "Midday Engine API Reference - Introduction"
4 | description: "Fundamental concepts of Midday Engine API."
5 | icon: webhook
6 | ---
7 |
8 | <Frame>
9 |   <img src="/images/engine.png" alt="Midday Engine" width="800" height="420" />
10 | </Frame>
11 |
12 | <Info>
13 |   Midday Engine is currently in beta. If you have any questions or feedback,
14 |   please reach out to us at
15 |   [support@midday.ai](mailto:support@midday.ai?subject=Engine%20API%20API)
16 | </Info>
17 |
18 | ## Base URL
19 |
20 | Midday Engine API is built on REST principles and is served over HTTPS. To ensure data privacy, unencrypted HTTP is not supported.
21 |
22 | The Base URL for all API endpoints is:
23 |
24 | ```bash Terminal
25 | https://engine-api.midday.ai
26 | ```
27 |
28 | ## Authentication
29 |
30 | Authentication to Midday Engine API is performed via the Authorization header with a Bearer token. To authenticate, you need to include the Authorization header with the word `Bearer` followed by your token in your API requests like so:
31 |
32 | ```bash Terminal
33 | Authorization: Bearer <Your-Token>
34 | ```
```

apps/engine/src/client/index.ts
```
1 | import { hc } from "hono/client";
2 | import type { AppType } from "..";
3 |
4 | export const client = hc<AppType>(
5 |   `${process.env.NEXT_PUBLIC_ENGINE_API_URL}/`,
6 |   {
7 |     headers: {
8 |       Authorization: `Bearer ${process.env.MIDDAY_ENGINE_API_KEY}`,
9 |     },
10 |   },
11 | );
```

apps/engine/src/common/bindings.ts
```
1 | export type Bindings = {
2 |   KV: KVNamespace;
3 |   ENRICH_KV: KVNamespace;
4 |   STORAGE: R2Bucket;
5 |   TELLER_CERT: Fetcher;
6 |   AI: Ai;
7 |   API_SECRET_KEY: string;
8 |   GOCARDLESS_SECRET_ID: string;
9 |   GOCARDLESS_SECRET_KEY: string;
10 |   PLAID_CLIENT_ID: string;
11 |   PLAID_ENVIRONMENT: string;
12 |   PLAID_SECRET: string;
13 |   TYPESENSE_API_KEY: string;
14 |   TYPESENSE_ENDPOINT_AU: string;
15 |   TYPESENSE_ENDPOINT_EU: string;
16 |   TYPESENSE_ENDPOINT_US: string;
17 |   TYPESENSE_ENDPOINT: string;
18 |   UPSTASH_REDIS_REST_TOKEN: string;
19 |   UPSTASH_REDIS_REST_URL: string;
20 | };
```

apps/engine/src/common/schema.ts
```
1 | import { z } from "@hono/zod-openapi";
2 |
3 | export const ErrorSchema = z.object({
4 |   code: z.string().openapi({
5 |     example: "disconnected",
6 |   }),
7 |   message: z.string().openapi({
8 |     example:
9 |       "The login details of this item have changed (credentials, MFA, or required user action) and a user login is required to update this information.",
10 |   }),
11 |   requestId: z.string().openapi({
12 |     example: "123e4567-e89b-12d3-a456-426655440000",
13 |   }),
14 | });
15 |
16 | export const GeneralErrorSchema = z.object({
17 |   code: z.string().openapi({
18 |     example: "internal_server_error",
19 |   }),
20 |   message: z.string().openapi({
21 |     example: "Internal server error",
22 |   }),
23 |   requestId: z.string().openapi({
24 |     example: "123e4567-e89b-12d3-a456-426655440000",
25 |   }),
26 | });
27 |
28 | export const Providers = z.enum(["teller", "plaid", "gocardless"]);
29 |
30 | export const HeadersSchema = z.object({
31 |   authorization: z.string().openapi({
32 |     example: "Bearer SECRET",
33 |   }),
34 | });
```

apps/engine/src/providers/index.ts
```
1 | import { logger } from "@/utils/logger";
2 | import { GoCardLessProvider } from "./gocardless/gocardless-provider";
3 | import { PlaidProvider } from "./plaid/plaid-provider";
4 | import { TellerProvider } from "./teller/teller-provider";
5 | import type {
6 |   DeleteAccountsRequest,
7 |   DeleteConnectionRequest,
8 |   GetAccountBalanceRequest,
9 |   GetAccountsRequest,
10 |   GetConnectionStatusRequest,
11 |   GetHealthCheckResponse,
12 |   GetInstitutionsRequest,
13 |   GetTransactionsRequest,
14 |   ProviderParams,
15 | } from "./types";
16 |
17 | export class Provider {
18 |   #name?: string;
19 |
20 |   #provider: PlaidProvider | TellerProvider | GoCardLessProvider | null = null;
21 |
22 |   constructor(params?: ProviderParams) {
23 |     this.#name = params?.provider;
24 |
25 |     switch (params?.provider) {
26 |       case "gocardless":
27 |         this.#provider = new GoCardLessProvider(params);
28 |         break;
29 |       case "teller":
30 |         this.#provider = new TellerProvider(params);
31 |         break;
32 |       case "plaid":
33 |         this.#provider = new PlaidProvider(params);
34 |         break;
35 |       default:
36 |     }
37 |   }
38 |
39 |   async getHealthCheck(
40 |     params: Omit<ProviderParams, "provider">,
41 |   ): Promise<GetHealthCheckResponse> {
42 |     const teller = new TellerProvider(params);
43 |     const plaid = new PlaidProvider(params);
44 |     const gocardless = new GoCardLessProvider(params);
45 |
46 |     try {
47 |       const [isPlaidHealthy, isGocardlessHealthy, isTellerHealthy] =
48 |         await Promise.all([
49 |           plaid.getHealthCheck(),
50 |           gocardless.getHealthCheck(),
51 |           teller.getHealthCheck(),
52 |         ]);
53 |
54 |       return {
55 |         plaid: {
56 |           healthy: isPlaidHealthy,
57 |         },
58 |         gocardless: {
59 |           healthy: isGocardlessHealthy,
60 |         },
61 |         teller: {
62 |           healthy: isTellerHealthy,
63 |         },
64 |       };
65 |     } catch {
66 |       throw Error("Something went wrong");
67 |     }
68 |   }
69 |
70 |   async getTransactions(params: GetTransactionsRequest) {
71 |     logger(
72 |       "getTransactions:",
73 |       `provider: ${this.#name} id: ${params.accountId}`,
74 |     );
75 |
76 |     const data = await this.#provider?.getTransactions(params);
77 |
78 |     if (data) {
79 |       return data;
80 |     }
81 |
82 |     return [];
83 |   }
84 |
85 |   async getAccounts(params: GetAccountsRequest) {
86 |     logger("getAccounts:", `provider: ${this.#name}`);
87 |
88 |     const data = await this.#provider?.getAccounts(params);
89 |
90 |     if (data) {
91 |       return data;
92 |     }
93 |
94 |     return [];
95 |   }
96 |
97 |   async getAccountBalance(params: GetAccountBalanceRequest) {
98 |     logger(
99 |       "getAccountBalance:",
100 |       `provider: ${this.#name} id: ${params.accountId}`,
101 |     );
102 |
103 |     const data = await this.#provider?.getAccountBalance(params);
104 |
105 |     if (data) {
106 |       return data;
107 |     }
108 |
109 |     return null;
110 |   }
111 |
112 |   async getInstitutions(params: GetInstitutionsRequest) {
113 |     logger("getInstitutions:", `provider: ${this.#name}`);
114 |
115 |     const data = await this.#provider?.getInstitutions(params);
116 |
117 |     if (data) {
118 |       return data;
119 |     }
120 |
121 |     return [];
122 |   }
123 |
124 |   async deleteAccounts(params: DeleteAccountsRequest) {
125 |     logger("delete:", `provider: ${this.#name}`);
126 |
127 |     return this.#provider?.deleteAccounts(params);
128 |   }
129 |
130 |   async getConnectionStatus(params: GetConnectionStatusRequest) {
131 |     logger("getConnectionStatus:", `provider: ${this.#name}`);
132 |
133 |     const data = await this.#provider?.getConnectionStatus(params);
134 |
135 |     if (data) {
136 |       return data;
137 |     }
138 |
139 |     return { status: "connected" };
140 |   }
141 |
142 |   async deleteConnection(params: DeleteConnectionRequest) {
143 |     logger("deleteConnection:", `provider: ${this.#name}`);
144 |
145 |     return this.#provider?.deleteConnection(params);
146 |   }
147 | }
```

apps/engine/src/providers/interface.ts
```
1 | import type {
2 |   DeleteAccountsRequest,
3 |   DeleteConnectionRequest,
4 |   GetAccountBalanceRequest,
5 |   GetAccountBalanceResponse,
6 |   GetAccountsRequest,
7 |   GetAccountsResponse,
8 |   GetConnectionStatusRequest,
9 |   GetConnectionStatusResponse,
10 |   GetInstitutionsRequest,
11 |   GetInstitutionsResponse,
12 |   GetTransactionsRequest,
13 |   GetTransactionsResponse,
14 | } from "./types";
15 |
16 | export interface Provider {
17 |   getTransactions: (
18 |     params: GetTransactionsRequest,
19 |   ) => Promise<GetTransactionsResponse>;
20 |   getAccounts: (params: GetAccountsRequest) => Promise<GetAccountsResponse>;
21 |   getAccountBalance: (
22 |     params: GetAccountBalanceRequest,
23 |   ) => Promise<GetAccountBalanceResponse>;
24 |   getInstitutions: (
25 |     params: GetInstitutionsRequest,
26 |   ) => Promise<GetInstitutionsResponse>;
27 |   getHealthCheck: () => Promise<boolean>;
28 |   deleteAccounts: (params: DeleteAccountsRequest) => void;
29 |   getConnectionStatus: (
30 |     params: GetConnectionStatusRequest,
31 |   ) => Promise<GetConnectionStatusResponse>;
32 |   deleteConnection: (params: DeleteConnectionRequest) => void;
33 | }
```

apps/engine/src/providers/types.ts
```
1 | import type { AccountType } from "@/utils/account";
2 |
3 | export type Providers = "teller" | "plaid" | "gocardless";
4 |
5 | export type ProviderParams = {
6 |   provider: Providers;
7 |   kv: KVNamespace;
8 |   fetcher?: Fetcher | null; // Teller
9 |   envs: {
10 |     GOCARDLESS_SECRET_KEY: string;
11 |     GOCARDLESS_SECRET_ID: string;
12 |     PLAID_CLIENT_ID: string;
13 |     PLAID_SECRET: string;
14 |     PLAID_ENVIRONMENT: string;
15 |   };
16 | };
17 |
18 | export type Transaction = {
19 |   id: string;
20 |   amount: number;
21 |   currency: string;
22 |   date: string;
23 |   status: "posted" | "pending";
24 |   balance: number | null;
25 |   category: string | null;
26 |   method: string;
27 |   name: string;
28 |   description: string | null;
29 |   currency_rate: number | null;
30 |   currency_source: string | null;
31 | };
32 |
33 | export type Institution = {
34 |   id: string;
35 |   name: string;
36 |   logo: string | null;
37 |   provider: Providers;
38 | };
39 |
40 | export type Account = {
41 |   id: string;
42 |   name: string;
43 |   currency: string;
44 |   type: AccountType;
45 |   institution: Institution;
46 |   balance: Balance;
47 |   enrollment_id: string | null; // Teller
48 |   resource_id: string | null; // GoCardLess
49 | };
50 |
51 | export type ConnectionStatus = {
52 |   status: "connected" | "disconnected";
53 | };
54 |
55 | export type Balance = {
56 |   amount: number;
57 |   currency: string;
58 | };
59 |
60 | export type GetTransactionsRequest = {
61 |   accountId: string;
62 |   latest?: boolean;
63 |   accessToken?: string; // Teller & Plaid
64 |   accountType: AccountType;
65 | };
66 |
67 | export type GetAccountsRequest = {
68 |   id?: string; // GoCardLess
69 |   accessToken?: string; // Teller & Plaid
70 |   institutionId?: string; // Plaid
71 | };
72 |
73 | export type GetAccountBalanceRequest = {
74 |   accountId: string;
75 |   accessToken?: string; // Teller & Plaid
76 | };
77 |
78 | export type GetAccountBalanceResponse = {
79 |   currency: string;
80 |   amount: number;
81 | };
82 |
83 | export type DeleteAccountsRequest = {
84 |   accountId?: string; // GoCardLess
85 |   accessToken?: string; // Teller & Plaid
86 | };
87 |
88 | export type GetConnectionStatusRequest = {
89 |   id?: string;
90 |   accessToken?: string; // Teller & Plaid
91 | };
92 |
93 | export type GetTransactionsResponse = Transaction[];
94 |
95 | export type GetAccountsResponse = Account[];
96 |
97 | export type GetInstitutionsResponse = {
98 |   id: string;
99 |   name: string;
100 |   logo: string | null;
101 |   provider: Providers;
102 | }[];
103 |
104 | export type GetInstitutionsRequest = {
105 |   countryCode?: string;
106 | };
107 |
108 | export type HealthCheckResponse = {
109 |   healthy: boolean;
110 | };
111 |
112 | export type GetHealthCheckResponse = {
113 |   teller: HealthCheckResponse;
114 |   gocardless: HealthCheckResponse;
115 |   plaid: HealthCheckResponse;
116 | };
117 |
118 | export type GetConnectionStatusResponse = ConnectionStatus;
119 |
120 | export type DeleteConnectionRequest = {
121 |   id: string; // GoCardLess
122 |   accessToken?: string; // Teller & Plaid
123 | };
```

apps/engine/src/utils/account.test.ts
```
1 | import { describe, expect, it } from "bun:test";
2 | import { type AccountType, getType } from "./account";
3 |
4 | describe("getType function", () => {
5 |   it("should return 'depository' for 'depository' input", () => {
6 |     expect(getType("depository")).toBe("depository");
7 |   });
8 |
9 |   it("should return 'credit' for 'credit' input", () => {
10 |     expect(getType("credit")).toBe("credit");
11 |   });
12 |
13 |   it("should return 'other_asset' for any other input", () => {
14 |     expect(getType("loan")).toBe("other_asset");
15 |     expect(getType("investment")).toBe("other_asset");
16 |     expect(getType("unknown")).toBe("other_asset");
17 |   });
18 |
19 |   it("should return AccountType", () => {
20 |     const result: AccountType = getType("depository");
21 |     expect(result).toBe("depository");
22 |   });
23 | });
```

apps/engine/src/utils/account.ts
```
1 | export type AccountType =
2 |   | "depository"
3 |   | "credit"
4 |   | "other_asset"
5 |   | "loan"
6 |   | "other_liability";
7 |
8 | export function getType(type: string): AccountType {
9 |   switch (type) {
10 |     case "depository":
11 |       return "depository";
12 |     case "credit":
13 |       return "credit";
14 |     default:
15 |       return "other_asset";
16 |   }
17 | }
```

apps/engine/src/utils/countries.ts
```
1 | export const GOCARDLESS_COUNTRIES = [
2 |   "AT",
3 |   "BE",
4 |   "BG",
5 |   "HR",
6 |   "CY",
7 |   "CZ",
8 |   "DK",
9 |   "EE",
10 |   "FI",
11 |   "FR",
12 |   "DE",
13 |   "GR",
14 |   "HU",
15 |   "IS",
16 |   "IE",
17 |   "IT",
18 |   "LV",
19 |   "LI",
20 |   "LT",
21 |   "LU",
22 |   "MT",
23 |   "NL",
24 |   "NO",
25 |   "PL",
26 |   "PT",
27 |   "RO",
28 |   "SK",
29 |   "SI",
30 |   "ES",
31 |   "SE",
32 |   "GB",
33 | ];
34 |
35 | export const PLAID_COUNTRIES = ["US", "CA"];
36 |
37 | export const TELLER_COUNTRIES = ["US"];
38 |
39 | const combinedCountries = [
40 |   ...new Set([
41 |     ...GOCARDLESS_COUNTRIES,
42 |     ...PLAID_COUNTRIES,
43 |     ...TELLER_COUNTRIES,
44 |   ]),
45 | ] as const;
46 |
47 | export const ALL_COUNTRIES: readonly string[] = combinedCountries;
```

apps/engine/src/utils/enrich.ts
```
1 | import type { Bindings } from "@/common/bindings";
2 | import { type EnrichBody, OutputSchema } from "@/routes/enrich/schema";
3 | import {
4 |   type LanguageModelV1,
5 |   type Experimental_LanguageModelV1Middleware as LanguageModelV1Middleware,
6 |   generateObject,
7 |   experimental_wrapLanguageModel as wrapLanguageModel,
8 | } from "ai";
9 | import type { Context } from "hono";
10 | import { createWorkersAI } from "workers-ai-provider";
11 | import { prompt } from "./prompt";
12 |
13 | function generateCacheKey(description: string): string {
14 |   return description.toLowerCase().replace(/\s+/g, "_");
15 | }
16 |
17 | export function createCacheMiddleware(
18 |   c: Context<{ Bindings: Bindings }>,
19 |   description: string,
20 | ): LanguageModelV1Middleware {
21 |   return {
22 |     wrapGenerate: async ({ doGenerate }) => {
23 |       const cacheKey = generateCacheKey(description);
24 |
25 |       const cached = (await c.env.ENRICH_KV.get(cacheKey, {
26 |         type: "json",
27 |       })) as Awaited<ReturnType<LanguageModelV1["doGenerate"]>> | null;
28 |
29 |       if (cached !== null) {
30 |         return {
31 |           ...cached,
32 |           response: {
33 |             ...cached.response,
34 |             timestamp: cached?.response?.timestamp
35 |               ? new Date(cached?.response?.timestamp)
36 |               : undefined,
37 |           },
38 |         };
39 |       }
40 |
41 |       const result = await doGenerate();
42 |
43 |       await c.env.ENRICH_KV.put(cacheKey, JSON.stringify(result));
44 |
45 |       return {
46 |         ...result,
47 |         response: {
48 |           ...result.response,
49 |           source: "model",
50 |         },
51 |       };
52 |     },
53 |   };
54 | }
55 |
56 | export async function enrichTransactionWithLLM(
57 |   c: Context<{ Bindings: Bindings }>,
58 |   data: EnrichBody["data"][number],
59 | ) {
60 |   const model = createWorkersAI({ binding: c.env.AI });
61 |
62 |   const wrappedLanguageModel = wrapLanguageModel({
63 |     // @ts-ignore (Not available in the SDK)
64 |     model: model("@cf/meta/llama-3.3-70b-instruct-fp8-fast"),
65 |     middleware: createCacheMiddleware(c, data.description),
66 |   });
67 |
68 |   const result = await generateObject({
69 |     mode: "json",
70 |     model: wrappedLanguageModel,
71 |     temperature: 0,
72 |     maxTokens: 2048,
73 |     prompt: `
74 |             ${prompt}
75 |
76 |             Transaction:
77 |             ${JSON.stringify(data)}
78 |         `,
79 |     schema: OutputSchema,
80 |   });
81 |
82 |   return result.object;
83 | }
```

apps/engine/src/utils/error.ts
```
1 | import { logger } from "./logger";
2 |
3 | export class ProviderError extends Error {
4 |   code: string;
5 |
6 |   constructor({ message, code }: { message: string; code: string }) {
7 |     super(message);
8 |     this.code = this.setCode(code);
9 |   }
10 |
11 |   setCode(code: string) {
12 |     // Teller
13 |     if (this.message === "The requested account is closed") {
14 |       return "disconnected";
15 |     }
16 |
17 |     // GoCardLess
18 |     if (this.message.startsWith("EUA was valid for")) {
19 |       return "disconnected";
20 |     }
21 |
22 |     switch (code) {
23 |       // Teller
24 |       case "enrollment.disconnected":
25 |       case "enrollment.disconnected.user_action.mfa_required":
26 |       case "enrollment.disconnected.account_locked":
27 |       case "enrollment.disconnected.credentials_invalid":
28 |       case "enrollment.disconnected.enrollment_inactive":
29 |       case "enrollment.disconnected.user_action.contact_information_required":
30 |       case "enrollment.disconnected.user_action.insufficient_permissions":
31 |       case "enrollment.disconnected.user_action.captcha_required":
32 |       case "enrollment.disconnected.user_action.web_login_required":
33 |
34 |       // Plaid
35 |       case "ITEM_LOGIN_REQUIRED":
36 |       case "ITEM_LOCKED":
37 |       case "ITEM_CONCURRENTLY_DELETED":
38 |       case "ACCESS_NOT_GRANTED":
39 |
40 |       // GoCardLess
41 |       case "AccessExpiredError":
42 |       case "AccountInactiveError":
43 |       case "Account suspended":
44 |         logger("disconnected", this.message);
45 |
46 |         return "disconnected";
47 |       default:
48 |         logger("unknown", this.message);
49 |
50 |         return "unknown";
51 |     }
52 |   }
53 | }
54 |
55 | export function createErrorResponse(error: unknown, requestId: string) {
56 |   console.error(error);
57 |
58 |   if (error instanceof ProviderError) {
59 |     return {
60 |       requestId,
61 |       message: error.message,
62 |       code: error.code,
63 |     };
64 |   }
65 |
66 |   return {
67 |     requestId,
68 |     message: String(error),
69 |     code: "unknown",
70 |   };
71 | }
```

apps/engine/src/utils/logger.ts
```
1 | export const logger = (message: string, ...rest: string[]) => {
2 |   console.log(message, ...rest);
3 | };
```

apps/engine/src/utils/logo.ts
```
1 | export function getLogoURL(id: string, ext?: string) {
2 |   return `https://cdn-engine.midday.ai/${id}.${ext || "jpg"}`;
3 | }
4 |
5 | export function getFileExtension(url: string) {
6 |   return url.split(".").pop();
7 | }
```

apps/engine/src/utils/paginate.ts
```
1 | export async function paginate<TData>({
2 |   fetchData,
3 |   pageSize,
4 |   delay,
5 | }: {
6 |   fetchData: (offset: number, count: number) => Promise<TData[]>;
7 |   pageSize: number;
8 |   delay?: { onDelay: (message: string) => void; milliseconds: number };
9 | }): Promise<TData[]> {
10 |   const result: TData[] = [];
11 |   let offset = 0;
12 |   let data: TData[] = [];
13 |
14 |   do {
15 |     data = await fetchData(offset, pageSize);
16 |
17 |     result.push(...data);
18 |
19 |     offset += pageSize;
20 |
21 |     if (delay && data.length >= pageSize) {
22 |       delay.onDelay(`Waiting ${delay.milliseconds / 1000} seconds`);
23 |       await new Promise((resolve) => setTimeout(resolve, delay.milliseconds));
24 |     }
25 |   } while (data.length >= pageSize);
26 |
27 |   return result;
28 | }
```

apps/engine/src/utils/prompt.ts
```
1 | export const prompt = `
2 | You are a financial transaction categorization specialist. Your task is to analyze transaction descriptions and assign them to the most appropriate category from the following list. Consider the context, merchant type, transaction patterns, and the transaction currency to understand the country context when making your decision.
3 | Categories:
4 | - travel: For transportation, accommodation, and travel-related expenses
5 | - office_supplies: For stationery, printing materials, and general office consumables
6 | - meals: For food, dining, and restaurant expenses
7 | - software: For digital tools, subscriptions, and software licenses
8 | - rent: For property rental and lease payments
9 | - equipment: For hardware, machinery, and durable business assets
10 | - internet_and_telephone: For connectivity and communication services
11 | - facilities_expenses: For utilities, maintenance, and building-related costs
12 | - activity: For events, entertainment, and business activities
13 | - taxes: For government levies and tax payments
14 | - fees: For service charges, professional fees, and administrative costs
15 |
16 | Analyze the following transaction and categorize it appropriately. Use the currency to help identify the country context - for example, SEK indicates Sweden, USD indicates United States, etc.
17 | Always return the JSON object, no other text or comments.
18 | `;
```

apps/engine/src/utils/rates.ts
```
1 | import { uniqueCurrencies } from "@midday/location/currencies";
2 |
3 | const ENDPOINT =
4 |   "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1";
5 |
6 | async function getCurrency(currency: string) {
7 |   const response = await fetch(`${ENDPOINT}/currencies/${currency}.json`);
8 |
9 |   return response.json();
10 | }
11 |
12 | function transformKeysToUppercase(obj: Record<string, number>) {
13 |   const entries = Object.entries(obj);
14 |
15 |   // Transform each entry's key to uppercase
16 |   const upperCaseEntries = entries
17 |     .map(([key, value]) => {
18 |       return [key.toUpperCase(), value];
19 |     })
20 |     .filter(([key]) => uniqueCurrencies.includes(key as string));
21 |
22 |   // Convert the transformed entries back into an object
23 |   const transformedObject = Object.fromEntries(upperCaseEntries);
24 |
25 |   return transformedObject;
26 | }
27 |
28 | export async function getRates() {
29 |   const rates = await Promise.allSettled(
30 |     uniqueCurrencies.map((currency) => getCurrency(currency.toLowerCase())),
31 |   );
32 |
33 |   return rates
34 |     .filter(
35 |       (rate): rate is PromiseFulfilledResult<Record<string, unknown>> =>
36 |         rate.status === "fulfilled",
37 |     )
38 |     .map((rate) => rate.value)
39 |     .map((value) => {
40 |       const date = Object.values(value).at(0);
41 |       const currency = Object.keys(value).at(1);
42 |
43 |       if (!currency) {
44 |         return null;
45 |       }
46 |
47 |       const currencyData = value[currency];
48 |       if (typeof currencyData !== "object" || currencyData === null) {
49 |         return null;
50 |       }
51 |
52 |       return {
53 |         source: currency.toUpperCase(),
54 |         date,
55 |         rates: transformKeysToUppercase(currencyData as Record<string, number>),
56 |       };
57 |     })
58 |     .filter((item) => item !== null);
59 | }
```

apps/engine/src/utils/retry.ts
```
1 | export async function withRetry<TResult>(
2 |   fn: (attempt: number) => TResult | Promise<TResult>,
3 |   {
4 |     maxRetries = 1,
5 |     onError,
6 |     delay,
7 |   }: {
8 |     maxRetries?: number;
9 |     onError?(error: unknown, attempt: number): boolean | undefined;
10 |     delay?: number;
11 |   } = {},
12 | ) {
13 |   let retries = 0;
14 |   let lastError: unknown;
15 |
16 |   while (retries <= maxRetries) {
17 |     if (delay && retries > 0) {
18 |       await new Promise((resolve) => setTimeout(resolve, delay));
19 |     }
20 |
21 |     try {
22 |       const res = await fn(retries);
23 |       return res;
24 |     } catch (err) {
25 |       lastError = err;
26 |
27 |       if (onError) {
28 |         const shouldRetry = onError(err, retries);
29 |         if (!shouldRetry) {
30 |           break;
31 |         }
32 |       }
33 |
34 |       retries++;
35 |     }
36 |   }
37 |
38 |   throw lastError;
39 | }
```

apps/engine/src/utils/search.ts
```
1 | import type { Bindings } from "@/common/bindings";
2 | import Typesense from "typesense";
3 |
4 | export function SearchClient(envs: Bindings) {
5 |   return new Typesense.Client({
6 |     nearestNode: {
7 |       host: envs.TYPESENSE_ENDPOINT!,
8 |       port: 443,
9 |       protocol: "https",
10 |     },
11 |     nodes: [
12 |       { host: envs.TYPESENSE_ENDPOINT_US!, port: 443, protocol: "https" },
13 |       { host: envs.TYPESENSE_ENDPOINT_EU!, port: 443, protocol: "https" },
14 |       { host: envs.TYPESENSE_ENDPOINT_AU!, port: 443, protocol: "https" },
15 |     ],
16 |     apiKey: envs.TYPESENSE_API_KEY,
17 |     connectionTimeoutSeconds: 2,
18 |   });
19 | }
20 |
21 | export async function getHealthCheck(envs: Bindings) {
22 |   const typesense = SearchClient(envs);
23 |   const searchResponse = await typesense.health.retrieve();
24 |
25 |   return {
26 |     healthy:
27 |       typeof searchResponse === "string" && JSON.parse(searchResponse).ok,
28 |   };
29 | }
```

apps/website/public/.well-known/security.txt
```
1 | Contact: security@midday.ai
2 | Preferred-Languages: en
3 | Canonical: https://midday.ai/.well-known/security.txt
4 | Policy: https://github.com/midday-ai/midday/blob/main/SECURITY.md
```

apps/website/src/actions/feature-request-action.ts
```
1 | "use server";
2 |
3 | import { PlainClient } from "@team-plain/typescript-sdk";
4 | import { actionClient } from "./safe-action";
5 | import { featureRequestSchema } from "./schema";
6 |
7 | const client = new PlainClient({
8 |   apiKey: process.env.PLAIN_API_KEY!,
9 | });
10 |
11 | export const featureRequestAction = actionClient
12 |   .schema(featureRequestSchema)
13 |   .action(async ({ parsedInput: data }) => {
14 |     const response = await client.createThread({
15 |       title: data.title,
16 |       customerIdentifier: {
17 |         emailAddress: data.email,
18 |       },
19 |       //   Feature request
20 |       labelTypeIds: ["lt_01HV93E5SDCFVH8T9AGKKC99EM"],
21 |       components: [
22 |         {
23 |           componentText: {
24 |             text: data.description,
25 |           },
26 |         },
27 |         {
28 |           componentText: {
29 |             text: data.category,
30 |           },
31 |         },
32 |       ],
33 |     });
34 |
35 |     return response;
36 |   });
```

apps/website/src/actions/fetch-status.ts
```
1 | "use server";
2 |
3 | import { getStatus } from "@openstatus/react";
4 |
5 | export async function fetchStatus() {
6 |   const res = await getStatus("midday");
7 |
8 |   const { status } = res;
9 |
10 |   return status;
11 | }
```

apps/website/src/actions/safe-action.ts
```
1 | import {
2 |   DEFAULT_SERVER_ERROR_MESSAGE,
3 |   createSafeActionClient,
4 | } from "next-safe-action";
5 |
6 | export const actionClient = createSafeActionClient({
7 |   handleReturnedServerError(e) {
8 |     if (e instanceof Error) {
9 |       return e.message;
10 |     }
11 |
12 |     return DEFAULT_SERVER_ERROR_MESSAGE;
13 |   },
14 | });
```

apps/website/src/actions/schema.ts
```
1 | import { z } from "zod";
2 |
3 | export const featureRequestSchema = z.object({
4 |   email: z.string().email(),
5 |   title: z.string().min(2, {
6 |     message: "Title must be at least 2 characters.",
7 |   }),
8 |   description: z.string().min(2, {
9 |     message: "Description must be at least 2 characters.",
10 |   }),
11 |   category: z.string(),
12 | });
13 |
14 | export const sendSupportSchema = z.object({
15 |   email: z.string().email(),
16 |   fullName: z.string(),
17 |   subject: z.string(),
18 |   priority: z.string(),
19 |   type: z.string(),
20 |   message: z.string(),
21 | });
```

apps/website/src/actions/send-support-action.ts
```
1 | "use server";
2 |
3 | import { PlainClient } from "@team-plain/typescript-sdk";
4 | import { actionClient } from "./safe-action";
5 | import { sendSupportSchema } from "./schema";
6 |
7 | const client = new PlainClient({
8 |   apiKey: process.env.PLAIN_API_KEY!,
9 | });
10 |
11 | const mapToPriorityNumber = (priority: string) => {
12 |   switch (priority) {
13 |     case "low":
14 |       return 0;
15 |     case "normal":
16 |       return 1;
17 |     case "high":
18 |       return 2;
19 |     case "urgent":
20 |       return 3;
21 |     default:
22 |       return 1;
23 |   }
24 | };
25 |
26 | export const sendSupportAction = actionClient
27 |   .schema(sendSupportSchema)
28 |   .action(async ({ parsedInput: data }) => {
29 |     const customer = await client.upsertCustomer({
30 |       identifier: {
31 |         emailAddress: data.email,
32 |       },
33 |       onCreate: {
34 |         fullName: data.fullName,
35 |         email: {
36 |           email: data.email,
37 |           isVerified: true,
38 |         },
39 |       },
40 |       onUpdate: {},
41 |     });
42 |
43 |     const response = await client.createThread({
44 |       title: data.subject,
45 |       description: data.message,
46 |       priority: mapToPriorityNumber(data.priority),
47 |       customerIdentifier: {
48 |         customerId: customer.data?.customer.id,
49 |       },
50 |       // Support
51 |       labelTypeIds: ["lt_01HV93FQT6NSC1EN2HHA6BG9WK"],
52 |       components: [
53 |         {
54 |           componentText: {
55 |             text: data.message,
56 |           },
57 |         },
58 |       ],
59 |     });
60 |
61 |     return response;
62 |   });
```

apps/website/src/actions/subscribe-action.ts
```
1 | "use server";
2 |
3 | import { resend } from "@/utils/resend";
4 |
5 | export async function subscribeAction(formData: FormData) {
6 |   const email = formData.get("email") as string;
7 |
8 |   return resend.contacts.create({
9 |     email,
10 |     audienceId: process.env.RESEND_AUDIENCE_ID!,
11 |   });
12 | }
```

apps/website/src/actions/vote-action.ts
```
1 | "use server";
2 |
3 | import { client } from "@midday/kv";
4 | import { revalidatePath } from "next/cache";
5 | import { headers } from "next/headers";
6 | import { z } from "zod";
7 | import { actionClient } from "./safe-action";
8 |
9 | export const voteAction = actionClient
10 |   .schema(
11 |     z.object({
12 |       id: z.string(),
13 |     }),
14 |   )
15 |   .action(async ({ parsedInput: { id } }) => {
16 |     const clientIP = (await headers()).get("x-forwarded-for");
17 |
18 |     const hasVoted = await client.sadd(`apps:${id}:ip:${clientIP}`, true);
19 |
20 |     if (!hasVoted) {
21 |       throw new Error("You have already voted");
22 |     }
23 |
24 |     await client.incr(`apps:${id}`);
25 |
26 |     revalidatePath("/feature-request");
27 |   });
```

apps/website/src/app/layout.tsx
```
1 | import { DevMessage } from "@/components/dev-message";
2 | import { Footer } from "@/components/footer";
3 | import { FooterCTA } from "@/components/footer-cta";
4 | import { Header } from "@/components/header";
5 | import "@/styles/globals.css";
6 | import { cn } from "@midday/ui/cn";
7 | import "@midday/ui/globals.css";
8 | import { ThemeProvider } from "@/components/theme-provider";
9 | import { Provider as Analytics } from "@midday/events/client";
10 | import { GeistMono } from "geist/font/mono";
11 | import { GeistSans } from "geist/font/sans";
12 | import type { Metadata } from "next";
13 | import type { ReactElement } from "react";
14 | import { baseUrl } from "./sitemap";
15 |
16 | export const preferredRegion = ["fra1", "sfo1", "iad1"];
17 |
18 | export const metadata: Metadata = {
19 |   metadataBase: new URL(baseUrl),
20 |   title: {
21 |     default: "Midday | Run your business smarter",
22 |     template: "%s | Midday",
23 |   },
24 |   description:
25 |     "Midday provides you with greater insight into your business and automates the boring tasks, allowing you to focus on what you love to do instead.",
26 |   openGraph: {
27 |     title: "Midday | Run your business smarter",
28 |     description:
29 |       "Midday provides you with greater insight into your business and automates the boring tasks, allowing you to focus on what you love to do instead.",
30 |     url: baseUrl,
31 |     siteName:
32 |       "Midday provides you with greater insight into your business and automates the boring tasks, allowing you to focus on what you love to do instead.",
33 |     locale: "en_US",
34 |     type: "website",
35 |     images: [
36 |       {
37 |         url: "https://cdn.midday.ai/opengraph-image.jpg",
38 |         width: 800,
39 |         height: 600,
40 |       },
41 |       {
42 |         url: "https://cdn.midday.ai/opengraph-image.jpg",
43 |         width: 1800,
44 |         height: 1600,
45 |       },
46 |     ],
47 |   },
48 |   twitter: {
49 |     title: "Midday | Run your business smarter",
50 |     description:
51 |       "Midday provides you with greater insight into your business and automates the boring tasks, allowing you to focus on what you love to do instead.",
52 |     images: [
53 |       {
54 |         url: "https://cdn.midday.ai/opengraph-image.jpg",
55 |         width: 800,
56 |         height: 600,
57 |       },
58 |       {
59 |         url: "https://cdn.midday.ai/opengraph-image.jpg",
60 |         width: 1800,
61 |         height: 1600,
62 |       },
63 |     ],
64 |   },
65 |   robots: {
66 |     index: true,
67 |     follow: true,
68 |     googleBot: {
69 |       index: true,
70 |       follow: true,
71 |       "max-video-preview": -1,
72 |       "max-image-preview": "large",
73 |       "max-snippet": -1,
74 |     },
75 |   },
76 | };
77 |
78 | export const viewport = {
79 |   themeColor: [
80 |     { media: "(prefers-color-scheme: light)" },
81 |     { media: "(prefers-color-scheme: dark)" },
82 |   ],
83 | };
84 |
85 | export default function Layout({ children }: { children: ReactElement }) {
86 |   return (
87 |     <html lang="en" suppressHydrationWarning>
88 |       <body
89 |         className={cn(
90 |           `${GeistSans.variable} ${GeistMono.variable}`,
91 |           "bg-[#fbfbfb] dark:bg-[#0C0C0C] overflow-x-hidden antialiased",
92 |         )}
93 |       >
94 |         <ThemeProvider
95 |           attribute="class"
96 |           defaultTheme="system"
97 |           enableSystem
98 |           disableTransitionOnChange
99 |         >
100 |           <Header />
101 |           <main className="container mx-auto px-4 overflow-hidden md:overflow-visible">
102 |             {children}
103 |           </main>
104 |           <FooterCTA />
105 |           <Footer />
106 |           <Analytics />
107 |           <DevMessage />
108 |         </ThemeProvider>
109 |       </body>
110 |     </html>
111 |   );
112 | }
```

apps/website/src/app/not-found.tsx
```
1 | import { NotFoundTerminal } from "@/components/not-found-terminal";
2 |
3 | export default function NotFound() {
4 |   return (
5 |     <div className="fixed bg-[#0C0C0C] top-0 right-0 bottom-0 left-0 z-30">
6 |       <h1 className="font-mono md:text-[300px] text-[140px] font-medium text-center mt-20">
7 |         404
8 |       </h1>
9 |
10 |       <NotFoundTerminal />
11 |     </div>
12 |   );
13 | }
```

apps/website/src/app/page.tsx
```
1 | import { StartPage } from "@/components/startpage";
2 |
3 | export const revalidate = 1800;
4 |
5 | export default function Page() {
6 |   return <StartPage />;
7 | }
```

apps/website/src/app/robots.ts
```
1 | import { baseUrl } from "./sitemap";
2 |
3 | export default function robots() {
4 |   return {
5 |     rules: [
6 |       {
7 |         userAgent: "*",
8 |       },
9 |     ],
10 |     sitemap: `${baseUrl}/sitemap.xml`,
11 |     host: `${baseUrl}`,
12 |   };
13 | }
```

apps/website/src/app/sitemap.ts
```
1 | import { getBlogPosts } from "@/lib/blog";
2 | import type { MetadataRoute } from "next";
3 |
4 | export const baseUrl = "https://midday.ai";
5 |
6 | export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
7 |   const blogs = getBlogPosts().map((post) => ({
8 |     url: `${baseUrl}/blog/${post.slug}`,
9 |     lastModified: post.metadata.publishedAt,
10 |   }));
11 |
12 |   const routes = ["", "/updates"].map((route) => ({
13 |     url: `${baseUrl}${route}`,
14 |     lastModified: new Date().toISOString().split("T")[0],
15 |   }));
16 |
17 |   return [...routes, ...blogs];
18 | }
```

apps/website/src/components/3d-card.tsx
```
1 | // Thank you: https://ui.aceternity.com/components/3d-card-effect
2 |
3 | "use client";
4 |
5 | import { cn } from "@midday/ui/cn";
6 |
7 | import React, {
8 |   createContext,
9 |   useState,
10 |   useContext,
11 |   useRef,
12 |   useEffect,
13 | } from "react";
14 |
15 | const MouseEnterContext = createContext<
16 |   [boolean, React.Dispatch<React.SetStateAction<boolean>>] | undefined
17 | >(undefined);
18 |
19 | export const CardContainer = ({
20 |   children,
21 |   className,
22 |   containerClassName,
23 | }: {
24 |   children?: React.ReactNode;
25 |   className?: string;
26 |   containerClassName?: string;
27 | }) => {
28 |   const containerRef = useRef<HTMLDivElement>(null);
29 |   const [isMouseEntered, setIsMouseEntered] = useState(false);
30 |
31 |   const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
32 |     if (!containerRef.current) return;
33 |     const { left, top, width, height } =
34 |       containerRef.current.getBoundingClientRect();
35 |     const x = (e.clientX - left - width / 2) / 25;
36 |     const y = (e.clientY - top - height / 2) / 25;
37 |     containerRef.current.style.transform = `rotateY(${x}deg) rotateX(${y}deg)`;
38 |   };
39 |
40 |   const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
41 |     setIsMouseEntered(true);
42 |     if (!containerRef.current) return;
43 |   };
44 |
45 |   const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
46 |     if (!containerRef.current) return;
47 |     setIsMouseEntered(false);
48 |     containerRef.current.style.transform = `rotateY(0deg) rotateX(0deg)`;
49 |   };
50 |   return (
51 |     <MouseEnterContext.Provider value={[isMouseEntered, setIsMouseEntered]}>
52 |       <div
53 |         className={cn(
54 |           "py-20 flex items-center justify-center",
55 |           containerClassName
56 |         )}
57 |         style={{
58 |           perspective: "1000px",
59 |         }}
60 |       >
61 |         <div
62 |           ref={containerRef}
63 |           onMouseEnter={handleMouseEnter}
64 |           onMouseMove={handleMouseMove}
65 |           onMouseLeave={handleMouseLeave}
66 |           className={cn(
67 |             "flex items-center justify-center relative transition-all duration-200 ease-linear",
68 |             className
69 |           )}
70 |           style={{
71 |             transformStyle: "preserve-3d",
72 |           }}
73 |         >
74 |           {children}
75 |         </div>
76 |       </div>
77 |     </MouseEnterContext.Provider>
78 |   );
79 | };
80 |
81 | export const CardBody = ({
82 |   children,
83 |   className,
84 | }: {
85 |   children: React.ReactNode;
86 |   className?: string;
87 | }) => {
88 |   return (
89 |     <div
90 |       className={cn(
91 |         "h-96 w-96 [transform-style:preserve-3d]  [&>*]:[transform-style:preserve-3d]",
92 |         className
93 |       )}
94 |     >
95 |       {children}
96 |     </div>
97 |   );
98 | };
99 |
100 | export const CardItem = ({
101 |   as: Tag = "div",
102 |   children,
103 |   className,
104 |   translateX = 0,
105 |   translateY = 0,
106 |   translateZ = 0,
107 |   rotateX = 0,
108 |   rotateY = 0,
109 |   rotateZ = 0,
110 |   ...rest
111 | }: {
112 |   as?: React.ElementType;
113 |   children: React.ReactNode;
114 |   className?: string;
115 |   translateX?: number | string;
116 |   translateY?: number | string;
117 |   translateZ?: number | string;
118 |   rotateX?: number | string;
119 |   rotateY?: number | string;
120 |   rotateZ?: number | string;
121 |   [key: string]: any;
122 | }) => {
123 |   const ref = useRef<HTMLDivElement>(null);
124 |   const [isMouseEntered] = useMouseEnter();
125 |
126 |   useEffect(() => {
127 |     handleAnimations();
128 |   }, [isMouseEntered]);
129 |
130 |   const handleAnimations = () => {
131 |     if (!ref.current) return;
132 |     if (isMouseEntered) {
133 |       ref.current.style.transform = `translateX(${translateX}px) translateY(${translateY}px) translateZ(${translateZ}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) rotateZ(${rotateZ}deg)`;
134 |     } else {
135 |       ref.current.style.transform = `translateX(0px) translateY(0px) translateZ(0px) rotateX(0deg) rotateY(0deg) rotateZ(0deg)`;
136 |     }
137 |   };
138 |
139 |   return (
140 |     <Tag
141 |       ref={ref}
142 |       className={cn("w-fit transition duration-200 ease-linear", className)}
143 |       {...rest}
144 |     >
145 |       {children}
146 |     </Tag>
147 |   );
148 | };
149 |
150 | // Create a hook to use the context
151 | export const useMouseEnter = () => {
152 |   const context = useContext(MouseEnterContext);
153 |   if (context === undefined) {
154 |     throw new Error("useMouseEnter must be used within a MouseEnterProvider");
155 |   }
156 |   return context;
157 | };
```

apps/website/src/components/app-details.tsx
```
1 | import { Vote } from "@/components/vote";
2 | import { Skeleton } from "@midday/ui/skeleton";
3 | import { Suspense } from "react";
4 |
5 | export function AppDetails({ id, name, description, logo, active }) {
6 |   return (
7 |     <section
8 |       key={id}
9 |       className="flex md:space-x-12 md:flex-row md:items-center mt-10 pt-10 first:pt-0 flex-col"
10 |     >
11 |       <div className="md:w-[300px] w-full md:h-[200px] h-[230px] flex items-center justify-center bg-gradient-to-b dark:from-[#1A1A1A] dark:to-[#171717] from-[#F5F5F5] to-[#EFEFEF]">
12 |         {logo}
13 |       </div>
14 |       <div className="md:flex-1 my-6 md:my-0">
15 |         <div className="flex md:items-center mb-4 space-x-2">
16 |           <h2 className="font-medium">{name}</h2>
17 |           {active && (
18 |             <button
19 |               disabled
20 |               type="button"
21 |               className="relative rounded-lg overflow-hidden p-[1px]"
22 |               style={{
23 |                 background:
24 |                   "linear-gradient(-45deg, rgba(235,248,255,.18) 0%, #848f9c 50%, rgba(235,248,255,.18) 100%)",
25 |               }}
26 |             >
27 |               <span className="flex items-center gap-4 py-1 px-2 rounded-[7px] bg-background text-xs h-full font-normal">
28 |                 Under development
29 |               </span>
30 |             </button>
31 |           )}
32 |         </div>
33 |         <p className="text-sm text-[#606060]">{description}</p>
34 |       </div>
35 |
36 |       <Suspense fallback={<Skeleton className="p-6 flex-col w-14 h-16 " />}>
37 |         <Vote id={id} />
38 |       </Suspense>
39 |     </section>
40 |   );
41 | }
```

apps/website/src/components/article-in-view.tsx
```
1 | "use client";
2 |
3 | import { usePathname } from "next/navigation";
4 | import { useEffect } from "react";
5 | import { useInView } from "react-intersection-observer";
6 |
7 | type Props = {
8 |   firstPost: boolean;
9 |   slug: string;
10 | };
11 |
12 | export function ArticleInView({ slug, firstPost }: Props) {
13 |   const { ref, inView } = useInView();
14 |
15 |   const pathname = usePathname();
16 |   const fullSlug = `/updates/${slug}`;
17 |
18 |   useEffect(() => {
19 |     if (inView && pathname !== fullSlug) {
20 |       window.history.pushState({ urlPath: fullSlug }, "", fullSlug);
21 |     }
22 |   }, [inView, fullSlug, firstPost]);
23 |
24 |   return <div ref={ref} />;
25 | }
```

apps/website/src/components/article.tsx
```
1 | import { ArticleInView } from "@/components/article-in-view";
2 | import { CustomMDX } from "@/components/mdx";
3 | import { PostStatus } from "@/components/post-status";
4 | import Image from "next/image";
5 | import Link from "next/link";
6 |
7 | type Props = {
8 |   firstPost: boolean;
9 |   data: {
10 |     slug: string;
11 |     metadata: {
12 |       tag: string;
13 |       title: string;
14 |       image?: string;
15 |     };
16 |     content: string;
17 |   };
18 | };
19 |
20 | export function Article({ data, firstPost }: Props) {
21 |   return (
22 |     <article key={data.slug} className="pt-28 mb-20 -mt-28" id={data.slug}>
23 |       <ArticleInView slug={data.slug} firstPost={firstPost} />
24 |
25 |       <PostStatus status={data.metadata.tag} />
26 |       <Link className="mb-6 block" href={`/updates/${data.slug}`}>
27 |         <h2 className="font-medium text-2xl mb-6">{data.metadata.title}</h2>
28 |       </Link>
29 |
30 |       <div className="updates">
31 |         {data.metadata.image && (
32 |           <Image
33 |             src={data.metadata.image}
34 |             alt={data.metadata.title}
35 |             width={680}
36 |             height={442}
37 |             className="mb-12"
38 |           />
39 |         )}
40 |
41 |         <CustomMDX source={data.content} />
42 |       </div>
43 |     </article>
44 |   );
45 | }
```

apps/website/src/components/brand-canvas.tsx
```
1 | "use client";
2 |
3 | import { Button } from "@midday/ui/button";
4 | import {
5 |   Select,
6 |   SelectContent,
7 |   SelectGroup,
8 |   SelectItem,
9 |   SelectTrigger,
10 |   SelectValue,
11 | } from "@midday/ui/select";
12 | import Image from "next/image";
13 | import { useRef, useState } from "react";
14 | import { useDraggable } from "react-use-draggable-scroll";
15 |
16 | const assets = [
17 |   <Image
18 |     key="1"
19 |     src={require("public/branding/1.png")}
20 |     width={600}
21 |     alt="keyboard"
22 |   />,
23 |   <Image
24 |     key="2"
25 |     src={require("public/branding/2.png")}
26 |     width={600}
27 |     alt="founders"
28 |   />,
29 |   <Image
30 |     key="3"
31 |     src={require("public/branding/3.png")}
32 |     width={600}
33 |     alt="screens"
34 |   />,
35 |   <Image
36 |     key="1"
37 |     src={require("public/branding/11.png")}
38 |     width={600}
39 |     alt="screens"
40 |   />,
41 |   <Image
42 |     key="4"
43 |     src={require("public/branding/4.png")}
44 |     width={600}
45 |     alt="screens"
46 |   />,
47 |   <Image
48 |     key="5"
49 |     src={require("public/branding/5.png")}
50 |     width={600}
51 |     alt="screens"
52 |   />,
53 |   <Image
54 |     key="7"
55 |     src={require("public/branding/7.png")}
56 |     width={600}
57 |     alt="screens"
58 |   />,
59 |   <Image
60 |     key="8"
61 |     src={require("public/branding/8.png")}
62 |     width={600}
63 |     alt="screens"
64 |   />,
65 |   <Image
66 |     key="9"
67 |     src={require("public/branding/9.png")}
68 |     width={600}
69 |     alt="screens"
70 |   />,
71 |   <Image
72 |     key="10"
73 |     src={require("public/branding/10.png")}
74 |     width={600}
75 |     alt="screens"
76 |   />,
77 |   <Image
78 |     key="1"
79 |     src={require("public/branding/1.png")}
80 |     width={600}
81 |     alt="keyboard"
82 |   />,
83 |   <Image
84 |     key="2"
85 |     src={require("public/branding/2.png")}
86 |     width={600}
87 |     alt="founders"
88 |   />,
89 |   <Image
90 |     key="3"
91 |     src={require("public/branding/3.png")}
92 |     width={600}
93 |     alt="screens"
94 |   />,
95 | ];
96 |
97 | const repeated = [...assets, ...assets, ...assets, ...assets, ...assets];
98 |
99 | export function BrandCanvas() {
100 |   const [value, setValue] = useState("https://cdn.midday.ai/all.zip");
101 |   const ref = useRef(undefined);
102 |   const { events } = useDraggable(ref);
103 |
104 |   return (
105 |     <div className="sm:h-screen sm:w-screen overflow-hidden">
106 |       <div
107 |         className="fixed bg-background z-10 top-0 left-0 right-0 overflow-scroll scrollbar-hide cursor-grabbing"
108 |         {...events}
109 |         ref={ref}
110 |       >
111 |         <div className="w-[4900px] flex h-screen">
112 |           <div className="grid grid-cols-8 gap-4 items-center">
113 |             {repeated.map((asset, index) => (
114 |               <div className="h-auto max-w-full" key={index.toString()}>
115 |                 {asset}
116 |               </div>
117 |             ))}
118 |           </div>
119 |         </div>
120 |       </div>
121 |
122 |       <div className="fixed bottom-10 z-20 w-full flex justify-center items-center -ml-[80px]">
123 |         <div className="h-[48px] w-[200px] rounded-full border border-border backdrop-filter backdrop-blur-xl dark:bg-[#121212] bg-white bg-opacity-70 text-center flex items-center p-1 pl-2 justify-between space-x-4">
124 |           <Select onValueChange={setValue} value={value}>
125 |             <SelectTrigger className="w-[180px] border-0 space-x-2">
126 |               <SelectValue placeholder="All" className="border-0" />
127 |             </SelectTrigger>
128 |             <SelectContent>
129 |               <SelectGroup>
130 |                 <SelectItem value="https://cdn.midday.ai/all.zip">
131 |                   All
132 |                 </SelectItem>
133 |                 <SelectItem value="https://cdn.midday.ai/videos.zip">
134 |                   Videos
135 |                 </SelectItem>
136 |                 <SelectItem value="https://cdn.midday.ai/founders.zip">
137 |                   Founders
138 |                 </SelectItem>
139 |                 <SelectItem value="https://cdn.midday.ai/screens.zip">
140 |                   Screens
141 |                 </SelectItem>
142 |               </SelectGroup>
143 |             </SelectContent>
144 |           </Select>
145 |
146 |           <Button className="rounded-full">
147 |             <a href={value} download title="Download">
148 |               Download
149 |             </a>
150 |           </Button>
151 |         </div>
152 |       </div>
153 |     </div>
154 |   );
155 | }
```

apps/website/src/components/card-stack.tsx
```
1 | "use client";
2 |
3 | import { useMediaQuery } from "@midday/ui/hooks";
4 | import {
5 |   Tooltip,
6 |   TooltipContent,
7 |   TooltipProvider,
8 |   TooltipTrigger,
9 | } from "@midday/ui/tooltip";
10 | import { motion } from "framer-motion";
11 | import { useEffect, useState } from "react";
12 |
13 | let interval: any;
14 |
15 | type Card = {
16 |   id: number;
17 |   content: React.ReactNode;
18 |   name: string;
19 | };
20 |
21 | export const CardStack = ({
22 |   items,
23 |   offset,
24 |   scaleFactor,
25 | }: {
26 |   items: Card[];
27 |   offset?: number;
28 |   scaleFactor?: number;
29 | }) => {
30 |   const isDesktop = useMediaQuery("(min-width: 768px)");
31 |   const CARD_OFFSET = isDesktop ? 10 : 5;
32 |   const SCALE_FACTOR = scaleFactor || 0.06;
33 |   const [cards, setCards] = useState<Card[]>([items.at(0)]);
34 |
35 |   useEffect(() => {
36 |     startFlipping();
37 |     setCards(items);
38 |
39 |     return () => clearInterval(interval);
40 |   }, []);
41 |
42 |   const startFlipping = () => {
43 |     interval = setInterval(() => {
44 |       setCards((prevCards: Card[]) => {
45 |         const newArray = [...prevCards]; // create a copy of the array
46 |         newArray.unshift(newArray.pop()!); // move the last element to the front
47 |         return newArray;
48 |       });
49 |     }, 5000);
50 |   };
51 |
52 |   const onChangeCardByIndex = (index) => {
53 |     const item = cards.at(index);
54 |     setCards([item, ...cards.slice(0, index), ...cards.slice(index + 1)]);
55 |   };
56 |
57 |   const onChangeCard = (item) => {
58 |     const index = cards.findIndex((card) => card.id === item.id);
59 |     setCards([item, ...cards.slice(0, index), ...cards.slice(index + 1)]);
60 |   };
61 |
62 |   // TODO: Get screen width
63 |   return (
64 |     <div
65 |       className="relative h-[220px] md:h-[670px] w-[331px] md:w-[1031px] z-10"
66 |       onMouseEnter={() => clearInterval(interval)}
67 |     >
68 |       {cards.map((card, index) => {
69 |         return (
70 |           <motion.div
71 |             key={card.id}
72 |             className="absolute h-[220px] md:h-[670px] w-[331px] md:w-[1031px] flex flex-col justify-between"
73 |             style={{
74 |               transformOrigin: "top center",
75 |               display: index > 2 ? "none" : "block",
76 |             }}
77 |             whileHover={{
78 |               top: index > 0 && index > 0 && index * -CARD_OFFSET - 30,
79 |               transition: { duration: 0.3 },
80 |             }}
81 |             animate={{
82 |               top: index * -CARD_OFFSET,
83 |               scale: 1 - index * SCALE_FACTOR, // decrease scale for cards that are behind
84 |               zIndex: cards.length - index, //  decrease z-index for the cards that are behind
85 |             }}
86 |             onMouseEnter={() => clearInterval(interval)}
87 |           >
88 |             <TooltipProvider delayDuration={0}>
89 |               <Tooltip>
90 |                 <TooltipTrigger asChild>
91 |                   <button
92 |                     type="button"
93 |                     className="w-[35px] h-[20px] z-20 absolute top-[75px] left-[8px]"
94 |                     onClick={() => onChangeCard(cards.find((c) => c.id === 1))}
95 |                   >
96 |                     <span className="sr-only">Overview</span>
97 |                   </button>
98 |                 </TooltipTrigger>
99 |                 <TooltipContent
100 |                   side="right"
101 |                   className="py-1 px-3 rounded-sm"
102 |                   sideOffset={8}
103 |                 >
104 |                   <p className="text-xs">Overview</p>
105 |                 </TooltipContent>
106 |               </Tooltip>
107 |
108 |               <Tooltip>
109 |                 <TooltipTrigger asChild>
110 |                   <button
111 |                     type="button"
112 |                     className="w-[35px] h-[20px] z-20 absolute top-[105px] left-[8px]"
113 |                     onClick={() => onChangeCard(cards.find((c) => c.id === 5))}
114 |                   >
115 |                     <span className="sr-only">Transactions</span>
116 |                   </button>
117 |                 </TooltipTrigger>
118 |                 <TooltipContent
119 |                   side="right"
120 |                   className="py-1 px-3 rounded-sm"
121 |                   sideOffset={8}
122 |                 >
123 |                   <p className="text-xs">Transactions</p>
124 |                 </TooltipContent>
125 |               </Tooltip>
126 |
127 |               <Tooltip>
128 |                 <TooltipTrigger asChild>
129 |                   <button
130 |                     type="button"
131 |                     className="w-[35px] h-[20px] z-20 absolute top-[135px] left-[8px]"
132 |                     onClick={() => onChangeCard(cards.find((c) => c.id === 3))}
133 |                   >
134 |                     <span className="sr-only">Inbox</span>
135 |                   </button>
136 |                 </TooltipTrigger>
137 |                 <TooltipContent
138 |                   side="right"
139 |                   className="py-1 px-3 rounded-sm"
140 |                   sideOffset={8}
141 |                 >
142 |                   <p className="text-xs">Inbox</p>
143 |                 </TooltipContent>
144 |               </Tooltip>
145 |
146 |               <Tooltip>
147 |                 <TooltipTrigger asChild>
148 |                   <button
149 |                     type="button"
150 |                     className="w-[35px] h-[20px] z-20 absolute top-[170px] left-[8px]"
151 |                     onClick={() => onChangeCard(cards.find((c) => c.id === 2))}
152 |                   >
[TRUNCATED]
```

apps/website/src/components/copy-input.tsx
```
1 | "use client";
2 |
3 | import { cn } from "@midday/ui/cn";
4 | import { Icons } from "@midday/ui/icons";
5 | import { motion } from "framer-motion";
6 | import { useState } from "react";
7 |
8 | type Props = {
9 |   value: string;
10 |   className?: string;
11 | };
12 |
13 | export function CopyInput({ value, className }: Props) {
14 |   const [isCopied, setCopied] = useState(false);
15 |
16 |   const handleClipboard = async () => {
17 |     try {
18 |       setCopied(true);
19 |
20 |       await navigator.clipboard.writeText(value);
21 |
22 |       setTimeout(() => {
23 |         setCopied(false);
24 |       }, 2000);
25 |     } catch {}
26 |   };
27 |
28 |   return (
29 |     <div
30 |       className={cn(
31 |         "flex items-center relative w-full border border-border py-2 px-4",
32 |         className,
33 |       )}
34 |     >
35 |       <div className="pr-7 text-[#878787] text-sm">{value}</div>
36 |       <button type="button" onClick={handleClipboard} className="block">
37 |         <motion.div
38 |           className="absolute right-4 top-2.5"
39 |           initial={{ opacity: 1, scale: 1 }}
40 |           animate={{ opacity: isCopied ? 0 : 1, scale: isCopied ? 0 : 1 }}
41 |         >
42 |           <Icons.Copy />
43 |         </motion.div>
44 |
45 |         <motion.div
46 |           className="absolute right-4 top-2.5"
47 |           initial={{ opacity: 0, scale: 0 }}
48 |           animate={{ opacity: isCopied ? 1 : 0, scale: isCopied ? 1 : 0 }}
49 |         >
50 |           <Icons.Check />
51 |         </motion.div>
52 |       </button>
53 |     </div>
54 |   );
55 | }
```

apps/website/src/components/cta-button.tsx
```
1 | import { Button } from "@midday/ui/button";
2 | import { Icons } from "@midday/ui/icons";
3 | import Link from "next/link";
4 |
5 | export function CtaButton({ children }: { children: React.ReactNode }) {
6 |   return (
7 |     <Link href="https://app.midday.ai">
8 |       <Button
9 |         className="mt-12 h-11 space-x-2 items-center py-2"
10 |         variant="outline"
11 |       >
12 |         <span>{children}</span>
13 |         <Icons.ArrowOutward />
14 |       </Button>
15 |     </Link>
16 |   );
17 | }
```

apps/website/src/components/cta-link.tsx
```
1 | "use client";
2 |
3 | import { cn } from "@midday/ui/cn";
4 | import { Icons } from "@midday/ui/icons";
5 | import Link from "next/link";
6 |
7 | export function CtaLink({
8 |   text,
9 |   className,
10 | }: {
11 |   text: string;
12 |   className?: string;
13 | }) {
14 |   return (
15 |     <Link
16 |       href="https://app.midday.ai"
17 |       className={cn(
18 |         "font-medium text-sm flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 hidden xl:flex",
19 |         className,
20 |       )}
21 |     >
22 |       <span>{text}</span>
23 |       <Icons.ArrowOutward />
24 |     </Link>
25 |   );
26 | }
```

apps/website/src/components/dev-message.tsx
```
1 | "use client";
2 |
3 | import { useEffect, useRef } from "react";
4 |
5 | export function DevMessage() {
6 |   const ref = useRef(undefined);
7 |
8 |   useEffect(() => {
9 |     if (!ref.current) {
10 |       console.log(`
11 |       -------------------------------------------------
12 |         ███╗   ███╗██╗██████╗ ██████╗  █████╗ ██╗   ██╗
13 |       ████╗ ████║██║██╔══██╗██╔══██╗██╔══██╗╚██╗ ██╔╝
14 |       ██╔████╔██║██║██║  ██║██║  ██║███████║ ╚████╔╝
15 |       ██║╚██╔╝██║██║██║  ██║██║  ██║██╔══██║  ╚██╔╝
16 |       ██║ ╚═╝ ██║██║██████╔╝██████╔╝██║  ██║   ██║
17 |       ╚═╝     ╚═╝╚═╝╚═════╝ ╚═════╝ ╚═╝  ╚═╝   ╚═╝
18 |       -------------------------------------------------
19 |     We are open source: https://git.new/midday
20 |     Join the community: https://go.midday.ai/anPiuRx
21 |
22 |     `);
23 |       ref.current = true;
24 |     }
25 |   }, []);
26 |
27 |   return null;
28 | }
```

apps/website/src/components/dynamic-image.tsx
```
1 | "use client";
2 |
3 | import { cn } from "@midday/ui/cn";
4 | import type { ImageProps } from "next/image";
5 | import Image from "next/image";
6 |
7 | interface DynamicImageProps extends Omit<ImageProps, "src" | "className"> {
8 |   lightSrc: ImageProps["src"];
9 |   darkSrc: ImageProps["src"];
10 |   className?: string;
11 | }
12 |
13 | export function DynamicImage({
14 |   lightSrc,
15 |   darkSrc,
16 |   alt,
17 |   className,
18 |   ...props
19 | }: DynamicImageProps) {
20 |   return (
21 |     <>
22 |       <Image
23 |         src={lightSrc}
24 |         alt={alt}
25 |         className={cn("dark:hidden", className)}
26 |         {...props}
27 |       />
28 |       <Image
29 |         src={darkSrc}
30 |         alt={alt}
31 |         className={cn("hidden dark:block", className)}
32 |         {...props}
33 |       />
34 |     </>
35 |   );
36 | }
```

apps/website/src/components/error-fallback.tsx
```
1 | "use client";
2 |
3 | export function ErrorFallback() {
4 |   return null;
5 | }
```

apps/website/src/components/export-toast.tsx
```
1 | "use client";
2 |
3 | import { Progress } from "@midday/ui/progress";
4 | import { Loader2 } from "lucide-react";
5 | import { useEffect, useState } from "react";
6 | import { useInView } from "react-intersection-observer";
7 |
8 | export function ExportToast() {
9 |   const [progress, setProgress] = useState(0);
10 |   const { ref, inView } = useInView({
11 |     triggerOnce: true,
12 |   });
13 |
14 |   useEffect(() => {
15 |     if (!inView) return;
16 |
17 |     const timer = setInterval(() => {
18 |       setProgress((oldProgress) => {
19 |         if (oldProgress === 100) {
20 |           clearInterval(timer);
21 |           return 100;
22 |         }
23 |         return Math.min(oldProgress + 25, 100);
24 |       });
25 |     }, 300);
26 |
27 |     return () => {
28 |       clearInterval(timer);
29 |     };
30 |   }, [inView]);
31 |
32 |   return (
33 |     <div
34 |       ref={ref}
35 |       className="w-full darK:bg-[#121212] flex flex-col border border-border p-4 space-y-3"
36 |     >
37 |       <div className="flex items-center space-x-2">
38 |         <Loader2 className="animate-spin size-5" />
39 |         <span className="text-sm font-medium">Exporting transactions</span>
40 |       </div>
41 |
42 |       <Progress value={progress} className="w-full h-0.5" />
43 |
44 |       <span className="text-xs text-[#878787]">
45 |         Please do not close browser until completed
46 |       </span>
47 |     </div>
48 |   );
49 | }
```

apps/website/src/components/feature-request-modal.tsx
```
1 | "use client";
2 |
3 | import { featureRequestAction } from "@/actions/feature-request-action";
4 | import { featureRequestSchema } from "@/actions/schema";
5 | import { zodResolver } from "@hookform/resolvers/zod";
6 | import { Button } from "@midday/ui/button";
7 | import {
8 |   DialogContent,
9 |   DialogFooter,
10 |   DialogHeader,
11 |   DialogTitle,
12 |   DialogTrigger,
13 | } from "@midday/ui/dialog";
14 | import {
15 |   Form,
16 |   FormControl,
17 |   FormField,
18 |   FormItem,
19 |   FormLabel,
20 |   FormMessage,
21 | } from "@midday/ui/form";
22 | import { Input } from "@midday/ui/input";
23 | import {
24 |   Select,
25 |   SelectContent,
26 |   SelectItem,
27 |   SelectTrigger,
28 |   SelectValue,
29 | } from "@midday/ui/select";
30 | import { Textarea } from "@midday/ui/textarea";
31 | import { Loader2 } from "lucide-react";
32 | import { useAction } from "next-safe-action/hooks";
33 | import { useState } from "react";
34 | import { useForm } from "react-hook-form";
35 | import type { z } from "zod";
36 |
37 | const categories = ["Feature", "Integration", "API"];
38 |
39 | export function FeatureRequestModal() {
40 |   const [isSubmitted, setSubmitted] = useState(false);
41 |
42 |   const featureRequest = useAction(featureRequestAction, {
43 |     onSuccess: () => {
44 |       setSubmitted(true);
45 |     },
46 |   });
47 |
48 |   const form = useForm<z.infer<typeof featureRequestSchema>>({
49 |     resolver: zodResolver(featureRequestSchema),
50 |     defaultValues: {
51 |       email: "",
52 |       title: "",
53 |       description: "",
54 |       category: "",
55 |     },
56 |   });
57 |
58 |   return (
59 |     <DialogContent className="sm:max-w-[500px]">
60 |       <div className="p-4">
61 |         {isSubmitted ? (
62 |           <div className="text-center p-8 pb-12">
63 |             <h2 className="font-semibold text-lg mb-4">Thank you</h2>
64 |
65 |             <p className="text-sm">
66 |               We'll inform you when your feature request is <br />
67 |               ready for voting.
68 |             </p>
69 |           </div>
70 |         ) : (
71 |           <Form {...form}>
72 |             <DialogHeader>
73 |               <DialogTitle>Request</DialogTitle>
74 |             </DialogHeader>
75 |
76 |             <form
77 |               onSubmit={form.handleSubmit(featureRequest.execute)}
78 |               className="space-y-4 mt-4"
79 |             >
80 |               <FormField
81 |                 control={form.control}
82 |                 name="email"
83 |                 render={({ field }) => (
84 |                   <FormItem className="w-full">
85 |                     <FormLabel>Email</FormLabel>
86 |                     <FormControl>
87 |                       <Input placeholder="Email" {...field} type="email" />
88 |                     </FormControl>
89 |
90 |                     <FormMessage />
91 |                   </FormItem>
92 |                 )}
93 |               />
94 |
95 |               <div className="flex space-x-4">
96 |                 <FormField
97 |                   control={form.control}
98 |                   name="title"
99 |                   render={({ field }) => (
100 |                     <FormItem className="w-full">
101 |                       <FormLabel>Title</FormLabel>
102 |                       <FormControl>
103 |                         <Input placeholder="Title" {...field} />
104 |                       </FormControl>
105 |
106 |                       <FormMessage />
107 |                     </FormItem>
108 |                   )}
109 |                 />
110 |
111 |                 <FormField
112 |                   control={form.control}
113 |                   name="category"
114 |                   render={({ field }) => (
115 |                     <FormItem className="w-full">
116 |                       <FormLabel>Category</FormLabel>
117 |                       <Select
118 |                         onValueChange={field.onChange}
119 |                         defaultValue={field.value}
120 |                       >
121 |                         <FormControl>
122 |                           <SelectTrigger>
123 |                             <SelectValue placeholder="Category" />
124 |                           </SelectTrigger>
125 |                         </FormControl>
126 |                         <SelectContent>
127 |                           {categories.map((category) => {
128 |                             return (
129 |                               <SelectItem value={category} key={category}>
130 |                                 {category}
131 |                               </SelectItem>
132 |                             );
133 |                           })}
134 |                         </SelectContent>
135 |                       </Select>
136 |
137 |                       <FormMessage />
138 |                     </FormItem>
139 |                   )}
140 |                 />
141 |               </div>
142 |
143 |               <FormField
144 |                 control={form.control}
145 |                 name="description"
146 |                 render={({ field }) => (
147 |                   <FormItem>
148 |                     <FormLabel>Description</FormLabel>
149 |                     <FormControl>
150 |                       <Textarea
151 |                         placeholder="Description"
152 |                         className="resize-none"
153 |                         {...field}
154 |                       />
155 |                     </FormControl>
156 |
157 |                     <FormMessage />
158 |                   </FormItem>
159 |                 )}
160 |               />
161 |
162 |               <DialogFooter className="md:flex md:space-x-4 pt-4">
163 |                 <DialogTrigger asChild>
164 |                   <Button
165 |                     type="button"
166 |                     variant="outline"
167 |                     className="mt-2 md:mt-0"
168 |                   >
169 |                     Cancel
170 |                   </Button>
171 |                 </DialogTrigger>
172 |                 <Button
173 |                   type="submit"
174 |                   disabled={featureRequest.status === "executing"}
175 |                 >
176 |                   {featureRequest.status === "executing" ? (
177 |                     <Loader2 className="h-4 w-4 animate-spin" />
178 |                   ) : (
179 |                     "Submit"
180 |                   )}
181 |                 </Button>
182 |               </DialogFooter>
183 |             </form>
184 |           </Form>
185 |         )}
186 |       </div>
187 |     </DialogContent>
188 |   );
189 | }
```

apps/website/src/components/following-pointer.tsx
```
1 | "use client";
2 |
3 | // Thank you: https://ui.aceternity.com/components/following-pointer
4 |
5 | import React, { useEffect, useState } from "react";
6 |
7 | import { cn } from "@midday/ui/cn";
8 | import { AnimatePresence, motion, useMotionValue } from "framer-motion";
9 |
10 | export const FollowerPointerCard = ({
11 |   children,
12 |   className,
13 |   title,
14 | }: {
15 |   children: React.ReactNode;
16 |   className?: string;
17 |   title?: string | React.ReactNode;
18 | }) => {
19 |   const x = useMotionValue(0);
20 |   const y = useMotionValue(0);
21 |   const ref = React.useRef<HTMLDivElement>(null);
22 |   const [rect, setRect] = useState<DOMRect | null>(null);
23 |   const [isInside, setIsInside] = useState<boolean>(false); // Add this line
24 |
25 |   useEffect(() => {
26 |     if (ref.current) {
27 |       setRect(ref.current.getBoundingClientRect());
28 |     }
29 |   }, []);
30 |
31 |   const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
32 |     if (rect) {
33 |       const scrollX = window.scrollX;
34 |       const scrollY = window.scrollY;
35 |       x.set(e.clientX - rect.left + scrollX);
36 |       y.set(e.clientY - rect.top + scrollY);
37 |     }
38 |   };
39 |
40 |   const handleMouseLeave = () => {
41 |     setIsInside(false);
42 |   };
43 |
44 |   const handleMouseEnter = () => {
45 |     setIsInside(true);
46 |   };
47 |
48 |   return (
49 |     <div
50 |       onMouseLeave={handleMouseLeave}
51 |       onMouseEnter={handleMouseEnter}
52 |       onMouseMove={handleMouseMove}
53 |       style={{
54 |         cursor: "none",
55 |       }}
56 |       ref={ref}
57 |       className={cn("relative", className)}
58 |     >
59 |       <AnimatePresence mode="wait">
60 |         <FollowPointer x={x} y={y} title={title} />
61 |       </AnimatePresence>
62 |       {children}
63 |     </div>
64 |   );
65 | };
66 |
67 | export const FollowPointer = ({
68 |   x,
69 |   y,
70 |   title,
71 | }: {
72 |   x: any;
73 |   y: any;
74 |   title?: string | React.ReactNode;
75 | }) => {
76 |   return (
77 |     <motion.div
78 |       className="h-4 w-4 rounded-full absolute z-50"
79 |       style={{
80 |         top: y,
81 |         left: x,
82 |         pointerEvents: "none",
83 |       }}
84 |       initial={{
85 |         scale: 1,
86 |         opacity: 1,
87 |       }}
88 |       animate={{
89 |         scale: 1,
90 |         opacity: 1,
91 |       }}
92 |       exit={{
93 |         scale: 0,
94 |         opacity: 0,
95 |       }}
96 |     >
97 |       <svg
98 |         stroke="currentColor"
99 |         fill="currentColor"
100 |         strokeWidth="1"
101 |         viewBox="0 0 16 16"
102 |         className="h-6 w-6 text-sky-500 transform -rotate-[70deg] -translate-x-[12px] -translate-y-[10px] stroke-sky-600"
103 |         height="1em"
104 |         width="1em"
105 |         xmlns="http://www.w3.org/2000/svg"
106 |       >
107 |         <path d="M14.082 2.182a.5.5 0 0 1 .103.557L8.528 15.467a.5.5 0 0 1-.917-.007L5.57 10.694.803 8.652a.5.5 0 0 1-.006-.916l12.728-5.657a.5.5 0 0 1 .556.103z" />
108 |       </svg>
109 |       <motion.div
110 |         style={{
111 |           backgroundColor: "black",
112 |         }}
113 |         initial={{
114 |           scale: 0.5,
115 |           opacity: 0,
116 |         }}
117 |         animate={{
118 |           scale: 1,
119 |           opacity: 1,
120 |         }}
121 |         exit={{
122 |           scale: 0.5,
123 |           opacity: 0,
124 |         }}
125 |         className={
126 |           "px-2 py-2 bg-neutral-200 text-white whitespace-nowrap min-w-max text-xs rounded-full"
127 |         }
128 |       >
129 |         {title}
130 |       </motion.div>
131 |     </motion.div>
132 |   );
133 | };
```

apps/website/src/components/footer-cta.tsx
```
1 | "use client";
2 |
3 | import { Button } from "@midday/ui/button";
4 | import Link from "next/link";
5 | import { usePathname } from "next/navigation";
6 |
7 | export function FooterCTA() {
8 |   const pathname = usePathname();
9 |
10 |   if (pathname.includes("pitch")) {
11 |     return null;
12 |   }
13 |
14 |   return (
15 |     <div className="border border-border md:container text-center px-10 py-14 mx-4 md:mx-auto md:px-24 md:py-20 mb-32 mt-24 flex items-center flex-col bg-[#F2F1EF] dark:bg-[#121212]">
16 |       <span className="text-6xl	md:text-8xl font-medium text-primary dark:text-white">
17 |         Stress free by midday.
18 |       </span>
19 |       <p className="text-[#878787] mt-6">
20 |         Invoicing, Time tracking, File reconciliation, Storage, Financial
21 |         Overview & your own <br /> Assistant.
22 |       </p>
23 |
24 |       <div className="mt-10 md:mb-8">
25 |         <div className="flex items-center space-x-4">
26 |           <Link
27 |             href="https://cal.com/pontus-midday/15min"
28 |             target="_blank"
29 |             rel="noopener noreferrer"
30 |           >
31 |             <Button
32 |               variant="outline"
33 |               className="border border-primary h-12 px-6 dark:border-white border-black text-primary hidden md:block"
34 |             >
35 |               Talk to founders
36 |             </Button>
37 |           </Link>
38 |
39 |           <a href="https://app.midday.ai">
40 |             <Button className="h-12 px-5 bg-black text-white dark:bg-white dark:text-black hover:bg-black/80 dark:hover:bg-white/80">
41 |               Try it for free
42 |             </Button>
43 |           </a>
44 |         </div>
45 |       </div>
46 |     </div>
47 |   );
48 | }
```

apps/website/src/components/footer.tsx
```
1 | import { LogoLarge } from "@/components/logo-large";
2 | import { SubscribeInput } from "@/components/subscribe-input";
3 | import Link from "next/link";
4 | import { GithubStars } from "./github-stars";
5 | import { SocialLinks } from "./social-links";
6 | import { StatusWidget } from "./status-widget";
7 |
8 | export function Footer() {
9 |   return (
10 |     <footer className="border-t-[1px] border-border px-4 md:px-6 pt-10 md:pt-16 bg-[#fff] dark:bg-[#0C0C0C] overflow-hidden md:max-h-[820px]">
11 |       <div className="container">
12 |         <div className="flex justify-between items-center border-border border-b-[1px] pb-10 md:pb-16 mb-12">
13 |           <Link href="/" className="scale-50 -ml-[52px] md:ml-0 md:scale-100">
14 |             <LogoLarge />
15 |             <span className="sr-only">Midday</span>
16 |           </Link>
17 |
18 |           <span className="font-normal md:text-2xl text-right">
19 |             Run your business smarter.
20 |           </span>
21 |         </div>
22 |
23 |         <div className="flex flex-col md:flex-row w-full">
24 |           <div className="flex flex-col space-y-8 md:space-y-0 md:flex-row md:w-6/12 justify-between leading-8">
25 |             <div>
26 |               <span className="font-medium">Features</span>
27 |               <ul>
28 |                 <li className="transition-colors text-[#878787]">
29 |                   <Link href="/overview">Overview</Link>
30 |                 </li>
31 |                 <li className="transition-colors text-[#878787]">
32 |                   <Link href="/inbox">Inbox</Link>
33 |                 </li>
34 |                 <li className="transition-colors text-[#878787]">
35 |                   <Link href="/vault">Vault</Link>
36 |                 </li>
37 |                 <li className="transition-colors text-[#878787]">
38 |                   <Link href="/tracker">Tracker</Link>
39 |                 </li>
40 |                 <li className="transition-colors text-[#878787]">
41 |                   <Link href="/invoice">Invoice</Link>
42 |                 </li>
43 |                 <li className="transition-colors text-[#878787]">
44 |                   <Link href="/pricing">Pricing</Link>
45 |                 </li>
46 |                 <li className="transition-colors text-[#878787]">
47 |                   <Link href="/engine">Engine</Link>
48 |                 </li>
49 |                 <li className="transition-colors text-[#878787]">
50 |                   <Link href="/download">Download</Link>
51 |                 </li>
52 |               </ul>
53 |             </div>
54 |
55 |             <div>
56 |               <span>Resources</span>
57 |               <ul>
58 |                 <li className="transition-colors text-[#878787]">
59 |                   <Link href="https://git.new/midday">Github</Link>
60 |                 </li>
61 |                 <li className="transition-colors text-[#878787]">
62 |                   <Link href="/support">Support</Link>
63 |                 </li>
64 |                 <li className="transition-colors text-[#878787]">
65 |                   <Link href="/policy">Privacy policy</Link>
66 |                 </li>
67 |                 <li className="transition-colors text-[#878787]">
68 |                   <Link href="/terms">Terms and Conditions</Link>
69 |                 </li>
70 |                 <li className="transition-colors text-[#878787]">
71 |                   <Link href="/branding">Branding</Link>
72 |                 </li>
73 |                 <li className="transition-colors text-[#878787]">
74 |                   <Link href="/feature-request">Feature Request</Link>
75 |                 </li>
76 |               </ul>
77 |             </div>
78 |
79 |             <div>
80 |               <span>Company</span>
81 |               <ul>
82 |                 <li className="transition-colors text-[#878787]">
83 |                   <Link href="/story">Story</Link>
84 |                 </li>
85 |                 <li className="transition-colors text-[#878787]">
86 |                   <Link href="/updates">Updates</Link>
87 |                 </li>
88 |                 <li className="transition-colors text-[#878787]">
89 |                   <Link href="/open-startup">Open startup</Link>
90 |                 </li>
91 |                 <li className="transition-colors text-[#878787]">
92 |                   <Link href="/oss-friends">OSS friends</Link>
93 |                 </li>
94 |               </ul>
95 |             </div>
96 |           </div>
97 |
98 |           <div className="md:w-6/12 flex mt-8 md:mt-0 md:justify-end">
99 |             <div className="flex md:items-end flex-col">
100 |               <div className="flex items-start md:items-center flex-col md:flex-row space-y-6 md:space-y-0 mb-8">
101 |                 <GithubStars />
102 |                 <SocialLinks />
103 |               </div>
104 |
105 |               <div className="mb-8">
106 |                 <SubscribeInput />
107 |               </div>
108 |               <div className="md:mr-0 mt-auto mr-auto">
109 |                 <StatusWidget />
110 |               </div>
111 |             </div>
112 |           </div>
113 |         </div>
114 |       </div>
115 |
116 |       <h5 className="dark:text-[#161616] text-[#F4F4F3] text-[500px] leading-none text-center pointer-events-none">
117 |         midday
118 |       </h5>
119 |     </footer>
120 |   );
121 | }
```

apps/website/src/components/github-stars.tsx
```
1 | import { fetchGithubStars } from "@/lib/fetch-github-stars";
2 |
3 | export async function GithubStars() {
4 |   const data = await fetchGithubStars();
5 |
6 |   return (
7 |     <a
8 |       href="https://git.new/midday"
9 |       className="border border-border flex justify-center h-8 leading-[30px] text-[#878787] mr-6 md:mr-0"
10 |       target="_blank"
11 |       rel="noreferrer"
12 |     >
13 |       <div className="dark:bg-[#1D1D1D] pl-2 pr-3 text-[14px] flex items-center space-x-2 border-r-[1px] border-border">
14 |         <svg
15 |           xmlns="http://www.w3.org/2000/svg"
16 |           width={18}
17 |           height={15}
18 |           fill="none"
19 |         >
20 |           <path
21 |             className="fill-[#878787]"
22 |             d="M6.375 11.683 9 10.186l2.625 1.517-.688-2.837 2.313-1.891-3.042-.257L9 4.038l-1.208 2.66-3.042.257 2.313 1.91-.688 2.818Zm-2.52 3.29 1.353-5.536L.667 5.714l6-.493L9 0l2.333 5.221 6 .493-4.541 3.723 1.354 5.537L9 12.037l-5.146 2.935Z"
23 |           />
24 |         </svg>
25 |         <span className="font-medium">Star</span>
26 |       </div>
27 |       <div className="px-4 text-[14px]">
28 |         {data &&
29 |           Intl.NumberFormat("en", {
30 |             notation: "compact",
31 |             minimumFractionDigits: 0,
32 |             maximumFractionDigits: 1,
33 |           }).format(data.stargazers_count ?? 0)}
34 |       </div>
35 |     </a>
36 |   );
37 | }
```

apps/website/src/components/header.tsx
```
1 | "use client";
2 |
3 | import {
4 |   Accordion,
5 |   AccordionContent,
6 |   AccordionItem,
7 |   AccordionTrigger,
8 | } from "@midday/ui/accordion";
9 | import { cn } from "@midday/ui/cn";
10 | import {
11 |   ContextMenu,
12 |   ContextMenuContent,
13 |   ContextMenuItem,
14 |   ContextMenuTrigger,
15 | } from "@midday/ui/context-menu";
16 | import { Icons } from "@midday/ui/icons";
17 | import { motion } from "framer-motion";
18 | import Link from "next/link";
19 | import { usePathname } from "next/navigation";
20 | import menuAssistantLight from "public/menu-assistant-light.jpg";
21 | import menuAssistantDark from "public/menu-assistant.jpg";
22 | import menuEngineLight from "public/menu-engine-light.png";
23 | import menuEngineDark from "public/menu-engine.png";
24 | import { useEffect, useState } from "react";
25 | import { FaDiscord, FaGithub } from "react-icons/fa";
26 | import {
27 |   MdOutlineDashboardCustomize,
28 |   MdOutlineDescription,
29 |   MdOutlineIntegrationInstructions,
30 |   MdOutlineMemory,
31 | } from "react-icons/md";
32 | import { DynamicImage } from "./dynamic-image";
33 | import { LogoIcon } from "./logo-icon";
34 |
35 | const listVariant = {
36 |   show: {
37 |     opacity: 1,
38 |     transition: {
39 |       staggerChildren: 0.03,
40 |     },
41 |   },
42 |   hidden: {
43 |     opacity: 0,
44 |   },
45 | };
46 |
47 | const itemVariant = {
48 |   hidden: { opacity: 0 },
49 |   show: { opacity: 1 },
50 | };
51 |
52 | export function Header() {
53 |   const pathname = usePathname();
54 |   const [isOpen, setOpen] = useState(false);
55 |   const [showBlur, setShowBlur] = useState(false);
56 |   const [hidden, setHidden] = useState(false);
57 |   const lastPath = `/${pathname.split("/").pop()}`;
58 |
59 |   useEffect(() => {
60 |     const setPixelRatio = () => {
61 |       const pixelRatio = window.devicePixelRatio || 1;
62 |       document.documentElement.style.setProperty(
63 |         "--pixel-ratio",
64 |         `${1 / pixelRatio}`,
65 |       );
66 |     };
67 |
68 |     setPixelRatio();
69 |     window.addEventListener("resize", setPixelRatio);
70 |
71 |     return () => window.removeEventListener("resize", setPixelRatio);
72 |   }, []);
73 |
74 |   const handleToggleMenu = () => {
75 |     setOpen((prev) => {
76 |       document.body.style.overflow = prev ? "" : "hidden";
77 |       return !prev;
78 |     });
79 |   };
80 |
81 |   const handleOnClick = () => {
82 |     setShowBlur(false);
83 |     setHidden(true);
84 |
85 |     setTimeout(() => {
86 |       setHidden(false);
87 |     }, 100);
88 |   };
89 |
90 |   const links = [
91 |     {
92 |       title: "Features",
93 |       cover: (
94 |         <Link href="/#assistant" onClick={handleOnClick}>
95 |           <DynamicImage
96 |             alt="Assistant"
97 |             darkSrc={menuAssistantDark}
98 |             lightSrc={menuAssistantLight}
99 |           />
100 |         </Link>
101 |       ),
102 |       children: [
103 |         {
104 |           path: "/overview",
105 |           title: "Overview",
106 |           icon: <Icons.Overview size={20} />,
107 |         },
108 |         {
109 |           path: "/inbox",
110 |           title: "Inbox",
111 |           icon: <Icons.Inbox2 size={20} />,
112 |         },
113 |         {
114 |           path: "/vault",
115 |           title: "Vault",
116 |           icon: <Icons.Files size={20} />,
117 |         },
118 |         {
119 |           path: "/tracker",
120 |           title: "Tracker",
121 |           icon: <Icons.Tracker size={20} />,
122 |         },
123 |         {
124 |           path: "/invoice",
125 |           title: "Invoice",
126 |           icon: <Icons.Invoice size={20} />,
127 |         },
128 |       ],
129 |     },
130 |     {
131 |       title: "Pricing",
132 |       path: "/pricing",
133 |     },
134 |     {
135 |       title: "Updates",
136 |       path: "/updates",
137 |     },
138 |     {
139 |       title: "Story",
140 |       path: "/story",
141 |     },
142 |     {
143 |       title: "Download",
144 |       path: "/download",
145 |     },
146 |     {
147 |       title: "Developers",
148 |       cover: (
149 |         <Link href="/engine" onClick={handleOnClick}>
150 |           <DynamicImage
151 |             alt="Engine"
152 |             darkSrc={menuEngineDark}
153 |             lightSrc={menuEngineLight}
154 |           />
155 |         </Link>
156 |       ),
157 |       children: [
158 |         {
159 |           path: "https://git.new/midday",
160 |           title: "Open Source",
161 |           icon: <FaGithub size={19} />,
162 |         },
163 |         {
164 |           path: "https://docs.midday.ai",
165 |           title: "Documentation",
166 |           icon: <MdOutlineDescription size={20} />,
167 |         },
168 |         {
169 |           path: "/engine",
170 |           title: "Engine",
171 |           icon: <MdOutlineMemory size={20} />,
172 |         },
173 |         {
174 |           title: "Join the community",
175 |           path: "https://go.midday.ai/anPiuRx",
176 |           icon: <FaDiscord size={19} />,
177 |         },
178 |         {
179 |           title: "Apps & Integrations",
180 |           path: "https://docs.midday.ai/integrations",
181 |           icon: <MdOutlineIntegrationInstructions size={20} />,
182 |         },
183 |         {
184 |           path: "/components",
185 |           title: "Components",
186 |           icon: <MdOutlineDashboardCustomize size={20} />,
187 |         },
188 |       ],
189 |     },
190 |   ];
191 |
192 |   if (pathname.includes("pitch")) {
193 |     return null;
194 |   }
195 |
196 |   return (
[TRUNCATED]
```

apps/website/src/components/hero-image.tsx
```
1 | "use client";
2 |
3 | import { motion } from "framer-motion";
4 | import heroImageLight from "public/hero-light.png";
5 | import heroImageDark from "public/hero.png";
6 | import { useState } from "react";
7 | import { DynamicImage } from "./dynamic-image";
8 |
9 | export function HeroImage() {
10 |   const [isLoaded, setIsLoaded] = useState(false);
11 |
12 |   return (
13 |     <div className="scale-100 sm:scale-100 md:scale-[0.9] lg:scale-[0.7] xl:scale-100 mt-10 md:mt-0 lg:absolute -right-[420px] -top-[100px] 2xl:scale-[1.35] 2xl:-top-[20px] z-10">
14 |       <motion.div
15 |         initial={{ opacity: 0, y: 20 }}
16 |         animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
17 |         transition={{ duration: 0.3, ease: "easeOut" }}
18 |       >
19 |         <div className="[transform:perspective(4101px)_rotateX(51deg)_rotateY(-13deg)_rotateZ(40deg)]">
20 |           <DynamicImage
21 |             lightSrc={heroImageLight}
22 |             darkSrc={heroImageDark}
23 |             alt="Dashboard interface showing financial data and charts"
24 |             width={1141}
25 |             height={641}
26 |             quality={80}
27 |             priority
28 |             onLoad={() => setIsLoaded(true)}
29 |             className="border border-border dark:[box-shadow:0px_80px_60px_0px_rgba(0,0,0,0.35),0px_35px_28px_0px_rgba(0,0,0,0.25),0px_18px_15px_0px_rgba(0,0,0,0.20),0px_10px_8px_0px_rgba(0,0,0,0.17),0px_5px_4px_0px_rgba(0,0,0,0.14),0px_2px_2px_0px_rgba(0,0,0,0.10)] [box-shadow:0px_82px_105px_0px_#E3E2DF7A,0px_29.93px_38.33px_0px_#E3E2DF54,0px_14.53px_18.61px_0px_#E3E2DF44,0px_7.12px_9.12px_0px_#E3E2DF36,0px_2.82px_3.61px_0px_#E3E2DF26]"
30 |           />
31 |         </div>
32 |       </motion.div>
33 |     </div>
34 |   );
35 | }
```

apps/website/src/components/hero.tsx
```
1 | import { Button } from "@midday/ui/button";
2 | import Link from "next/link";
3 | import { HeroImage } from "./hero-image";
4 | import { Metrics } from "./metrics";
5 | import { WordAnimation } from "./word-animation";
6 |
7 | export function Hero() {
8 |   return (
9 |     <section className="mt-[60px] lg:mt-[180px] min-h-[530px] relative lg:h-[calc(100vh-300px)]">
10 |       <div className="flex flex-col">
11 |         <Link href="/updates/october-product-updates">
12 |           <Button
13 |             variant="outline"
14 |             className="rounded-full border-border flex space-x-2 items-center"
15 |           >
16 |             <span className="font-mono text-xs">October Product Updates</span>
17 |             <svg
18 |               xmlns="http://www.w3.org/2000/svg"
19 |               width={12}
20 |               height={12}
21 |               fill="none"
22 |             >
23 |               <path
24 |                 fill="currentColor"
25 |                 d="M8.783 6.667H.667V5.333h8.116L5.05 1.6 6 .667 11.333 6 6 11.333l-.95-.933 3.733-3.733Z"
26 |               />
27 |             </svg>
28 |           </Button>
29 |         </Link>
30 |
31 |         <h2 className="mt-6 md:mt-10 max-w-[580px] text-[#878787] leading-tight text-[24px] md:text-[36px] font-medium">
32 |           Invoicing, Time tracking, File reconciliation, Storage, Financial
33 |           Overview & your own Assistant made for <WordAnimation />
34 |         </h2>
35 |
36 |         <div className="mt-8 md:mt-10">
37 |           <div className="flex items-center space-x-4">
38 |             <Link
39 |               href="https://cal.com/pontus-midday/15min"
40 |               target="_blank"
41 |               rel="noopener noreferrer"
42 |             >
43 |               <Button
44 |                 variant="outline"
45 |                 className="border-transparent h-11 px-6 dark:bg-[#1D1D1D] bg-[#F2F1EF]"
46 |               >
47 |                 Talk to founders
48 |               </Button>
49 |             </Link>
50 |
51 |             <a href="https://app.midday.ai">
52 |               <Button className="h-11 px-5">Try it for free</Button>
53 |             </a>
54 |           </div>
55 |         </div>
56 |
57 |         <p className="text-xs text-[#707070] mt-4 font-mono">
58 |           Claim $49/mo deal, free during beta.
59 |         </p>
60 |       </div>
61 |
62 |       <HeroImage />
63 |       <Metrics />
64 |     </section>
65 |   );
66 | }
```

apps/website/src/components/infinite-moving-cards.tsx
```
1 | // Thank you: https://ui.aceternity.com/components/infinite-moving-cards
2 |
3 | "use client";
4 |
5 | import { cn } from "@midday/ui/cn";
6 | import Image from "next/image";
7 | import React, { useEffect, useState } from "react";
8 |
9 | export const InfiniteMovingCards = ({
10 |   items,
11 |   direction = "left",
12 |   speed = "fast",
13 |   pauseOnHover = true,
14 |   className,
15 | }: {
16 |   items: {
17 |     quote: string;
18 |     name: string;
19 |     title: string;
20 |   }[];
21 |   direction?: "left" | "right";
22 |   speed?: "fast" | "normal" | "slow";
23 |   pauseOnHover?: boolean;
24 |   className?: string;
25 | }) => {
26 |   const containerRef = React.useRef<HTMLDivElement>(null);
27 |   const scrollerRef = React.useRef<HTMLUListElement>(null);
28 |
29 |   useEffect(() => {
30 |     addAnimation();
31 |   }, []);
32 |   const [start, setStart] = useState(false);
33 |   function addAnimation() {
34 |     if (containerRef.current && scrollerRef.current) {
35 |       const scrollerContent = Array.from(scrollerRef.current.children);
36 |
37 |       scrollerContent.forEach((item) => {
38 |         const duplicatedItem = item.cloneNode(true);
39 |         if (scrollerRef.current) {
40 |           scrollerRef.current.appendChild(duplicatedItem);
41 |         }
42 |       });
43 |
44 |       getDirection();
45 |       getSpeed();
46 |       setStart(true);
47 |     }
48 |   }
49 |   const getDirection = () => {
50 |     if (containerRef.current) {
51 |       if (direction === "left") {
52 |         containerRef.current.style.setProperty(
53 |           "--animation-direction",
54 |           "forwards",
55 |         );
56 |       } else {
57 |         containerRef.current.style.setProperty(
58 |           "--animation-direction",
59 |           "reverse",
60 |         );
61 |       }
62 |     }
63 |   };
64 |   const getSpeed = () => {
65 |     if (containerRef.current) {
66 |       if (speed === "fast") {
67 |         containerRef.current.style.setProperty("--animation-duration", "20s");
68 |       } else if (speed === "normal") {
69 |         containerRef.current.style.setProperty("--animation-duration", "40s");
70 |       } else {
71 |         containerRef.current.style.setProperty("--animation-duration", "80s");
72 |       }
73 |     }
74 |   };
75 |
76 |   return (
77 |     <div
78 |       ref={containerRef}
79 |       className={cn(
80 |         "scroller relative z-20 overflow-hidden -ml-4 md:-ml-[1200px] w-screen md:w-[calc(100vw+1400px)]",
81 |         className,
82 |       )}
83 |     >
84 |       <ul
85 |         ref={scrollerRef}
86 |         className={cn(
87 |           "flex min-w-full shrink-0 gap-8 py-4 w-max flex-nowrap items-start",
88 |           start && "animate-scroll",
89 |           pauseOnHover && "hover:[animation-play-state:paused]",
90 |         )}
91 |       >
92 |         {items.map((item, idx) => (
93 |           <li
94 |             className="w-[310px] max-w-full relative flex-shrink-0 border border-border dark:bg-[#121212] px-8 py-6 md:w-[310px]"
95 |             key={item.name}
96 |           >
97 |             <blockquote>
98 |               <div
99 |                 aria-hidden="true"
100 |                 className="user-select-none -z-1 pointer-events-none absolute -left-0.5 -top-0.5 h-[calc(100%_+_4px)] w-[calc(100%_+_4px)]"
101 |               />
102 |
103 |               <div className="flex space-x-2 items-center mb-6">
104 |                 <Image
105 |                   src={item.avatarUrl}
106 |                   width={48}
107 |                   height={48}
108 |                   alt="Tweet"
109 |                   className="rounded-full overflow-hidden"
110 |                 />
111 |                 <div className="flex flex-col">
112 |                   <div className="flex items-center space-x-2">
113 |                     <span className="truncate max-w-36">{item.name}</span>
114 |                     {item.verified && (
115 |                       <svg
116 |                         width={2500}
117 |                         height={2500}
118 |                         className="h-4 w-4"
119 |                         viewBox="0 0 512 512"
120 |                       >
121 |                         <path
122 |                           fill="#1da1f2"
[TRUNCATED]
```

apps/website/src/components/keyboard.tsx
```
1 | "use client";
2 |
3 | import { Assistant } from "@/components/assistant";
4 | import { motion } from "framer-motion";
5 | import keyboardLight from "public/keyboard-light.png";
6 | import keyboardDark from "public/keyboard.png";
7 | import { DynamicImage } from "./dynamic-image";
8 |
9 | export function Keyboard() {
10 |   return (
11 |     <div className="relative mb-[100px] text-left">
12 |       <motion.div
13 |         className="absolute -right-[175px] -top-[130px] md:-top-[90px] lg:-top-9 xl:-top-4 md:-right-[200px] z-20 bg-gradient-to-l md:from-[#fbfbfb] dark:bg-gradient-to-l dark:md:from-[#0C0C0C]"
14 |         initial={{ opacity: 0, scale: 0.85 }}
15 |         animate={{ opacity: 1, scale: 1 }}
16 |         transition={{ delay: 0.2 }}
17 |       >
18 |         <div className="scale-[0.40] md:scale-[0.55] lg:scale-[0.7] xl:scale-[0.84] shadow-2xl">
19 |           <Assistant />
20 |         </div>
21 |       </motion.div>
22 |
23 |       <div className="h-full w-[500px] duration-200 ease-out transition-all absolute left-[1px] right-[1px] top-[1px] z-[15] bottom-[1px] bg-background/80" />
24 |
25 |       <DynamicImage
26 |         darkSrc={keyboardDark}
27 |         lightSrc={keyboardLight}
28 |         alt="Download Midday"
29 |         width={1092}
30 |         height={448}
31 |         className="z-10 relative"
32 |         quality={90}
33 |         priority
34 |       />
35 |     </div>
36 |   );
37 | }
```

apps/website/src/components/logo-icon.tsx
```
1 | export function LogoIcon() {
2 |   return (
3 |     <>
4 |       <svg
5 |         xmlns="http://www.w3.org/2000/svg"
6 |         width={102}
7 |         height={30}
8 |         fill="none"
9 |         className="md:hidden"
10 |       >
11 |         <path
12 |           fill="currentColor"
13 |           fillRule="evenodd"
14 |           d="M14.347 0a14.931 14.931 0 0 0-6.282 1.68l6.282 10.88V0Zm0 17.443L8.067 28.32a14.933 14.933 0 0 0 6.28 1.68V17.443ZM15.652 30V17.432l6.285 10.887A14.932 14.932 0 0 1 15.652 30Zm0-17.43V0c2.26.097 4.392.693 6.287 1.682l-6.287 10.889ZM2.336 23.068l10.884-6.284-6.284 10.884a15.093 15.093 0 0 1-4.6-4.6Zm25.33-16.132-10.88 6.282 6.282-10.88a15.094 15.094 0 0 1 4.598 4.598ZM2.335 6.934a15.094 15.094 0 0 1 4.6-4.6l6.284 10.884L2.335 6.934Zm-.654 1.13A14.931 14.931 0 0 0 0 14.35h12.568L1.681 8.064Zm0 13.873a14.932 14.932 0 0 1-1.68-6.282h12.562L1.682 21.938Zm15.754-7.587H30a14.93 14.93 0 0 0-1.68-6.285L17.435 14.35Zm10.884 7.586-10.878-6.28H30a14.932 14.932 0 0 1-1.68 6.28Zm-11.533-5.151 6.281 10.88a15.092 15.092 0 0 0 4.598-4.599l-10.88-6.281Z"
15 |           clipRule="evenodd"
16 |         />
17 |         <path
18 |           fill="currentColor"
19 |           d="M92.34 11.912h1.637l2.995 8.223 2.884-8.223h1.619l-4 11.107c-.372 1.06-1.08 1.544-2.196 1.544h-1.172v-1.358h1.024c.502 0 .8-.186.986-.707l.353-.912h-.52l-3.61-9.674ZM82.744 14.814c.39-1.916 1.916-3.126 4.018-3.126 2.549 0 3.963 1.489 3.963 4.13v3.964c0 .446.186.632.614.632h.39v1.358h-.65c-1.005 0-1.88-.335-1.861-1.544-.428.93-1.544 1.767-3.107 1.767-1.954 0-3.535-1.041-3.535-2.79 0-2.028 1.544-2.55 3.702-2.977l2.921-.558c-.018-1.712-.818-2.53-2.437-2.53-1.265 0-2.102.65-2.4 1.804l-1.618-.13Zm1.432 4.39c0 .8.689 1.452 2.14 1.433 1.637 0 2.92-1.153 2.92-3.442v-.167l-2.362.41c-1.47.26-2.698.371-2.698 1.767ZM80.129 8.563v13.21h-1.377l-.056-1.452c-.558 1.042-1.618 1.675-3.144 1.675-2.847 0-4.168-2.419-4.168-5.154s1.321-5.153 4.168-5.153c1.451 0 2.493.558 3.051 1.562V8.563h1.526Zm-7.145 8.28c0 1.915.819 3.701 2.884 3.701 2.028 0 2.865-1.823 2.865-3.702 0-1.953-.837-3.758-2.865-3.758-2.065 0-2.884 1.786-2.884 3.758ZM68.936 8.563v13.21H67.56l-.056-1.452c-.558 1.042-1.619 1.675-3.144 1.675-2.847 0-4.168-2.419-4.168-5.154s1.321-5.153 4.168-5.153c1.45 0 2.493.558 3.05 1.562V8.563h1.526Zm-7.144 8.28c0 1.915.819 3.701 2.884 3.701 2.028 0 2.865-1.823 2.865-3.702 0-1.953-.837-3.758-2.865-3.758-2.065 0-2.884 1.786-2.884 3.758ZM56.212 11.912h1.525v9.86h-1.525v-9.86Zm-.037-1.544V8.6h1.6v1.768h-1.6ZM40.224 11.912h1.395l.056 1.674c.446-1.21 1.47-1.898 2.846-1.898 1.414 0 2.438.763 2.865 2.084.428-1.34 1.47-2.084 3.014-2.084 1.973 0 3.126 1.377 3.126 3.74v6.344H52v-5.897c0-1.805-.707-2.828-1.916-2.828-1.544 0-2.437 1.041-2.437 2.846v5.88H46.12v-5.899c0-1.767-.725-2.827-1.916-2.827-1.526 0-2.456 1.079-2.456 2.827v5.898h-1.525v-9.86Z"
20 |         />
21 |       </svg>
22 |
23 |       <svg
24 |         xmlns="http://www.w3.org/2000/svg"
25 |         width={30}
26 |         height={30}
27 |         fill="none"
28 |         className="hidden md:block"
29 |       >
30 |         <path
31 |           fill="currentColor"
[TRUNCATED]
```

apps/website/src/components/logo-large.tsx
```
1 | export function LogoLarge() {
2 |   return (
3 |     <svg xmlns="http://www.w3.org/2000/svg" width={215} height={60} fill="none">
4 |       <path
5 |         fill="currentColor"
6 |         fillRule="evenodd"
7 |         d="M33.228 3.495A26.094 26.094 0 0 0 22.25 6.431l10.978 19.015V3.496Zm0 30.48L22.252 52.987a26.092 26.092 0 0 0 10.976 2.935V33.975Zm2.282 21.947V33.96l10.983 19.024a26.094 26.094 0 0 1-10.983 2.938Zm0-30.462V3.495a26.093 26.093 0 0 1 10.984 2.94L35.51 25.46ZM12.237 43.808l19.02-10.98-10.98 19.017a26.377 26.377 0 0 1-8.04-8.037Zm44.268-28.192L37.49 26.593 48.469 7.577a26.377 26.377 0 0 1 8.036 8.039Zm-44.27-.003a26.377 26.377 0 0 1 8.04-8.04l10.982 19.022-19.022-10.982Zm-1.142 1.975a26.094 26.094 0 0 0-2.938 10.984H30.12L11.093 17.588Zm.001 24.245a26.094 26.094 0 0 1-2.938-10.979H30.11l-19.017 10.98Zm27.532-13.26h21.957a26.095 26.095 0 0 0-2.936-10.983L38.626 28.572Zm19.02 13.258L38.632 30.854h21.95a26.09 26.09 0 0 1-2.938 10.977ZM37.49 32.828 48.467 51.84a26.379 26.379 0 0 0 8.036-8.036L37.49 32.83Z"
8 |         clipRule="evenodd"
9 |       />
10 |       <path
11 |         fill="currentColor"
12 |         d="M183.658 21.274h3.281l6.002 16.478 5.779-16.478h3.243l-8.015 22.257c-.746 2.125-2.162 3.094-4.399 3.094H187.2v-2.721h2.05c1.007 0 1.604-.373 1.976-1.417l.709-1.827h-1.044l-7.233-19.386Zm-19.229 5.816c.782-3.84 3.84-6.264 8.052-6.264 5.108 0 7.941 2.983 7.941 8.277v7.94c0 .895.373 1.268 1.231 1.268h.783v2.722h-1.305c-2.014 0-3.766-.671-3.728-3.095-.858 1.864-3.095 3.542-6.227 3.542-3.914 0-7.083-2.088-7.083-5.592 0-4.064 3.094-5.108 7.419-5.965l5.853-1.119c-.037-3.43-1.64-5.07-4.884-5.07-2.535 0-4.212 1.305-4.809 3.616l-3.243-.26Zm2.87 8.798c0 1.603 1.38 2.908 4.288 2.87 3.28 0 5.853-2.31 5.853-6.897v-.335l-4.735.82c-2.945.522-5.406.746-5.406 3.542Zm-8.111-21.325v26.47h-2.759l-.112-2.908c-1.118 2.088-3.243 3.355-6.3 3.355-5.704 0-8.351-4.846-8.351-10.327 0-5.48 2.647-10.327 8.351-10.327 2.908 0 4.996 1.119 6.114 3.132v-9.395h3.057Zm-14.316 16.59c0 3.84 1.64 7.42 5.779 7.42 4.063 0 5.741-3.654 5.741-7.42 0-3.914-1.678-7.53-5.741-7.53-4.139 0-5.779 3.578-5.779 7.53Zm-8.111-16.59v26.47h-2.759l-.112-2.908c-1.118 2.088-3.243 3.355-6.3 3.355-5.704 0-8.351-4.846-8.351-10.327 0-5.48 2.647-10.327 8.351-10.327 2.908 0 4.995 1.119 6.114 3.132v-9.395h3.057Zm-14.316 16.59c0 3.84 1.64 7.42 5.778 7.42 4.064 0 5.742-3.654 5.742-7.42 0-3.914-1.678-7.53-5.742-7.53-4.138 0-5.778 3.578-5.778 7.53Zm-11.183-9.879h3.057v19.759h-3.057v-19.76Zm-.074-3.095v-3.541h3.206v3.541h-3.206Zm-31.965 3.095h2.796l.112 3.355c.895-2.423 2.945-3.803 5.704-3.803 2.834 0 4.884 1.529 5.742 4.176.857-2.685 2.945-4.176 6.04-4.176 3.951 0 6.263 2.759 6.263 7.494v12.713h-3.057V29.214c0-3.616-1.417-5.666-3.84-5.666-3.095 0-4.884 2.088-4.884 5.704v11.78H91.04V29.216c0-3.542-1.453-5.667-3.84-5.667-3.056 0-4.92 2.162-4.92 5.667v11.818h-3.058v-19.76Z"
13 |       />
14 |     </svg>
15 |   );
16 | }
```

apps/website/src/components/mdx.tsx
```
1 | import { MDXRemote } from "next-mdx-remote/rsc";
2 | import Image from "next/image";
3 | import Link from "next/link";
4 | import React from "react";
5 | import { highlight } from "sugar-high";
6 |
7 | interface TableProps {
8 |   data: {
9 |     headers: string[];
10 |     rows: string[][];
11 |   };
12 | }
13 |
14 | function Table({ data }: TableProps) {
15 |   const headers = data.headers.map((header, index) => (
16 |     <th key={header}>{header}</th>
17 |   ));
18 |
19 |   const rows = data.rows.map((row, rowIndex) => (
20 |     <tr key={row.join("-")}>
21 |       {row.map((cell, cellIndex) => (
22 |         <td key={`${cell}-${cellIndex}`}>{cell}</td>
23 |       ))}
24 |     </tr>
25 |   ));
26 |
27 |   return (
28 |     <table>
29 |       <thead>
30 |         <tr>{headers}</tr>
31 |       </thead>
32 |       <tbody>{rows}</tbody>
33 |     </table>
34 |   );
35 | }
36 |
37 | interface CustomLinkProps
38 |   extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
39 |   href: string;
40 | }
41 |
42 | function CustomLink({ href, ...props }: CustomLinkProps) {
43 |   if (href.startsWith("/")) {
44 |     return (
45 |       <Link href={href} {...props}>
46 |         {props.children}
47 |       </Link>
48 |     );
49 |   }
50 |
51 |   if (href.startsWith("#")) {
52 |     return <a href={href} {...props} />;
53 |   }
54 |
55 |   return <a href={href} target="_blank" rel="noopener noreferrer" {...props} />;
56 | }
57 |
58 | interface RoundedImageProps extends React.ComponentProps<typeof Image> {
59 |   alt: string;
60 | }
61 |
62 | function RoundedImage(props: RoundedImageProps) {
63 |   return <Image {...props} />;
64 | }
65 |
66 | interface CodeProps {
67 |   children: string;
68 | }
69 |
70 | function Code({ children, ...props }: CodeProps) {
71 |   const codeHTML = highlight(children);
72 |   return <code dangerouslySetInnerHTML={{ __html: codeHTML }} {...props} />;
73 | }
74 |
75 | function slugify(str: string): string {
76 |   return str
77 |     .toString()
78 |     .toLowerCase()
79 |     .trim()
80 |     .replace(/\s+/g, "-")
81 |     .replace(/&/g, "-and-")
82 |     .replace(/[^\w\-]+/g, "")
83 |     .replace(/\-\-+/g, "-");
84 | }
85 |
86 | function createHeading(level: number) {
87 |   const Heading = ({ children }: { children: React.ReactNode }) => {
88 |     const slug = slugify(children as string);
89 |
90 |     return React.createElement(
91 |       `h${level}`,
92 |       { id: slug },
93 |       [
94 |         React.createElement("a", {
95 |           href: `#${slug}`,
96 |           key: `link-${slug}`,
97 |           className: "anchor",
98 |         }),
99 |       ],
100 |       children,
101 |     );
102 |   };
103 |
104 |   Heading.displayName = `Heading${level}`;
105 |
106 |   return Heading;
107 | }
108 |
109 | interface IframeProps extends React.IframeHTMLAttributes<HTMLIFrameElement> {
110 |   src: string;
111 | }
112 |
113 | function Iframe({ src, ...props }: IframeProps) {
114 |   return <iframe src={src} {...props} />;
115 | }
116 |
117 | const components = {
118 |   h1: createHeading(1),
119 |   h2: createHeading(2),
120 |   h3: createHeading(3),
121 |   h4: createHeading(4),
122 |   h5: createHeading(5),
123 |   h6: createHeading(6),
124 |   Image: RoundedImage,
125 |   a: CustomLink,
126 |   code: Code,
127 |   Table,
128 |   iframe: Iframe,
129 | };
130 |
131 | interface CustomMDXProps {
132 |   components?: Record<string, React.ComponentType<unknown>>;
133 | }
134 |
135 | export function CustomMDX(props: CustomMDXProps) {
136 |   return (
137 |     <MDXRemote
138 |       {...props}
139 |       components={{ ...components, ...(props.components || {}) }}
140 |     />
141 |   );
142 | }
```

apps/website/src/components/metrics.tsx
```
1 | import Link from "next/link";
2 |
3 | export function Metrics() {
4 |   return (
5 |     <div className="grid grid-cols-2 md:flex md:flex-nowrap gap-8 lg:absolute bottom-0 left-0 md:divide-x mt-20 lg:mt-0">
6 |       <Link href="/open-startup">
7 |         <div className="flex flex-col md:pr-8 text-center">
8 |           <h4 className="text-[#878787] text-sm mb-4">Businesses</h4>
9 |           <span className="text-2xl font-mono text-stroke">12,200+</span>
10 |         </div>
11 |       </Link>
12 |       <Link href="/open-startup">
13 |         <div className="flex flex-col md:px-8 text-center">
14 |           <h4 className="text-[#878787] text-sm mb-4">Bank accounts</h4>
15 |           <span className="text-2xl font-mono text-stroke">5,000+</span>
16 |         </div>
17 |       </Link>
18 |       <Link href="/open-startup">
19 |         <div className="flex flex-col md:px-8 text-center">
20 |           <h4 className="text-[#878787] text-sm mb-4">Transactions</h4>
21 |           <span className="text-2xl font-mono text-stroke">1.1M</span>
22 |         </div>
23 |       </Link>
24 |       <Link href="/open-startup">
25 |         <div className="flex flex-col md:px-8 text-center">
26 |           <h4 className="text-[#878787] text-sm mb-4">Transaction value</h4>
27 |           <span className="text-2xl font-mono text-stroke">$812M</span>
28 |         </div>
29 |       </Link>
30 |     </div>
31 |   );
32 | }
```

apps/website/src/components/not-found-statuses.tsx
```
1 | "use client";
2 |
3 | import { useEffect, useRef, useState } from "react";
4 |
5 | const data = [
6 |   {
7 |     name: "<Status Code>",
8 |     description: "404 Not Found",
9 |   },
10 |   {
11 |     name: "<Referrer Policy>",
12 |     description: "strict-origin-when-cross-origin",
13 |   },
14 |   {
15 |     name: "<Cache-Control>",
16 |     description: "no-store, must-revalidate",
17 |   },
18 |   {
19 |     name: "<Connection>",
20 |     description: "keep-alive",
21 |   },
22 |   {
23 |     name: "<Content-Type>",
24 |     description: "text/html; charset=utf-8",
25 |   },
26 |   {
27 |     name: "<Date>",
28 |     description: new Date().toTimeString(),
29 |   },
30 |   {
31 |     name: "<X-Powered-By>",
32 |     description: "Next.js",
33 |   },
34 |   {
35 |     name: "<Project-Name>",
36 |     description: "Midday",
37 |   },
38 | ];
39 |
40 | export function NotFoundStatuses() {
41 |   const [statuses, setStatuses] = useState();
42 |   const ref = useRef(false);
43 |   const scrollRef = useRef(undefined);
44 |
45 |   useEffect(() => {
46 |     setStatuses([
47 |       {
48 |         name: "<Request URL>",
49 |         description: location.origin,
50 |       },
51 |     ]);
52 |   }, []);
53 |
54 |   useEffect(() => {
55 |     let index = 1;
56 |
57 |     function addItems() {
58 |       const destinationArray = [];
59 |
60 |       if (index < data.length - 1) {
61 |         destinationArray.push(data[index]);
62 |
63 |         setStatuses((prev) => [...prev, data[index]]);
64 |         index++;
65 |
66 |         scrollRef.current?.scrollTo({
67 |           top: 10000000,
68 |           behavior: "smooth",
69 |           block: "end",
70 |         });
71 |
72 |         setTimeout(addItems, 500);
73 |       }
74 |     }
75 |
76 |     if (!ref.current) {
77 |       addItems();
78 |
79 |       ref.current = true;
80 |     }
81 |   }, []);
82 |
83 |   return (
84 |     <ul
85 |       className="overflow-auto p-4 flex flex-col space-y-4 h-[290px] font-mono text-xs"
86 |       ref={scrollRef}
87 |     >
88 |       {statuses?.map((status) => {
89 |         return (
90 |           <li className="flex flex-col" key={status.name}>
91 |             <span className="text-[#707070] mb-1">{status.name}</span>
92 |             <span>{status.description}</span>
93 |           </li>
94 |         );
95 |       })}
96 |     </ul>
97 |   );
98 | }
```

apps/website/src/components/not-found-terminal.tsx
```
1 | import { NotFoundStatuses } from "./not-found-statuses";
2 | import { StatusWidget } from "./status-widget";
3 |
4 | export function NotFoundTerminal() {
5 |   return (
6 |     <div className="h-[350px] w-full bg-background fixed left-0 right-0 bottom-0">
7 |       <div className="border-t-[1px] border-b-[1px] border-border w-full h-14 px-4 flex items-center">
8 |         <span className="loading-ellipsis">Data failed...</span>
9 |
10 |         <div className="flex space-x-2 ml-auto">
11 |           <StatusWidget />
12 |         </div>
13 |       </div>
14 |
15 |       <NotFoundStatuses />
16 |     </div>
17 |   );
18 | }
```

apps/website/src/components/post-author.tsx
```
1 | import Image from "next/image";
2 | import { PostCopyURL } from "./post-copy-url";
3 |
4 | const getAuthor = (id: string) =>
5 |   ({
6 |     pontus: {
7 |       name: "Pontus",
8 |       src: "https://pbs.twimg.com/profile_images/1755611130368770048/JwLEqyeo_400x400.jpg",
9 |       tagline: "Engineering",
10 |     },
11 |   })[id];
12 |
13 | type Props = {
14 |   author: string;
15 | };
16 |
17 | export function PostAuthor({ author }: Props) {
18 |   const authorData = getAuthor(author);
19 |
20 |   if (!authorData) return null;
21 |
22 |   return (
23 |     <div className="flex items-center pt-4 border-t-[1px] border-border w-full">
24 |       <div className="flex items-center space-x-2">
25 |         <Image
26 |           src={authorData.src}
27 |           width={24}
28 |           height={24}
29 |           alt={authorData.name}
30 |           className="rounded-full overflow-hidden"
31 |           quality={90}
32 |         />
33 |         <span className="font-medium text-xs">{authorData.name}</span>
34 |         <span className="text-xs text-[#878787]">{authorData.tagline}</span>
35 |       </div>
36 |       <div className="ml-auto">
37 |         <PostCopyURL slug={author} />
38 |       </div>
39 |     </div>
40 |   );
41 | }
```

apps/website/src/components/post-copy-url.tsx
```
1 | "use client";
2 |
3 | import { Icons } from "@midday/ui/icons";
4 | import { motion } from "framer-motion";
5 | import { useState } from "react";
6 |
7 | export function PostCopyURL() {
8 |   const [isCopied, setCopied] = useState(false);
9 |
10 |   const handleClipboard = async () => {
11 |     try {
12 |       setCopied(true);
13 |
14 |       await navigator.clipboard.writeText(window.location.href);
15 |
16 |       setTimeout(() => {
17 |         setCopied(false);
18 |       }, 2000);
19 |     } catch {}
20 |   };
21 |
22 |   return (
23 |     <button
24 |       type="button"
25 |       onClick={handleClipboard}
26 |       className="relative flex space-x-2 items-center"
27 |     >
28 |       <motion.div
29 |         className="absolute -left-4 top-0.3"
30 |         initial={{ opacity: 1, scale: 1 }}
31 |         animate={{ opacity: isCopied ? 0 : 1, scale: isCopied ? 0 : 1 }}
32 |       >
33 |         <Icons.Copy />
34 |       </motion.div>
35 |
36 |       <motion.div
37 |         className="absolute -left-[24px] top-0.3"
38 |         initial={{ opacity: 0, scale: 0 }}
39 |         animate={{ opacity: isCopied ? 1 : 0, scale: isCopied ? 1 : 0 }}
40 |       >
41 |         <Icons.Check />
42 |       </motion.div>
43 |
44 |       <span className="text-xs">Copy link</span>
45 |     </button>
46 |   );
47 | }
```

apps/website/src/components/post-status.tsx
```
1 | export function PostStatus({ status }) {
2 |   return (
3 |     <div className="border rounded-full font-mono px-3 py-1.5 inline-block text-[11px] mb-4 text-[#878787]">
4 |       {status}
5 |     </div>
6 |   );
7 | }
```

apps/website/src/components/section-five.tsx
```
1 | "use client";
2 |
3 | import { motion } from "framer-motion";
4 | import vaultLight from "public/vault-light.png";
5 | import vaultDark from "public/vault.png";
6 | import { CtaLink } from "./cta-link";
7 | import { DynamicImage } from "./dynamic-image";
8 | import { ExportToast } from "./export-toast";
9 |
10 | export function SectionFive() {
11 |   return (
12 |     <section className="flex justify-between space-y-12 lg:space-y-0 lg:space-x-8 flex-col lg:flex-row overflow-hidden mb-12">
13 |       <div className="border border-border lg:basis-2/3 dark:bg-[#121212] p-10 flex lg:space-x-8 lg:flex-row flex-col-reverse lg:items-start group">
14 |         <DynamicImage
15 |           lightSrc={vaultLight}
16 |           darkSrc={vaultDark}
17 |           quality={90}
18 |           alt="Vault"
19 |           className="mt-8 lg:mt-0 basis-1/2 object-contain max-w-[70%] sm:max-w-[50%] md:max-w-[35%]"
20 |         />
21 |
22 |         <div className="flex flex-col basis-1/2 relative h-full">
23 |           <h4 className="font-medium text-xl md:text-2xl mb-4">Vault</h4>
24 |
25 |           <p className="text-[#878787] mb-4 text-sm">
26 |             Store your files securely in Midday.
27 |           </p>
28 |
29 |           <p className="text-[#878787] text-sm">
30 |             There’s no need to scramble for things across different drives. Keep
31 |             all of your files, such as contracts and agreements safe in one
32 |             place.
33 |           </p>
34 |
35 |           <div className="flex flex-col space-y-2 h-full">
36 |             <div className="flex space-x-2 items-center mt-8 text-sm">
37 |               <svg
38 |                 xmlns="http://www.w3.org/2000/svg"
39 |                 width={18}
40 |                 height={13}
41 |                 fill="none"
42 |               >
43 |                 <path
44 |                   fill="currentColor"
45 |                   d="M6.55 13 .85 7.3l1.425-1.425L6.55 10.15 15.725.975 17.15 2.4 6.55 13Z"
46 |                 />
47 |               </svg>
48 |               <span className="text-primary">
49 |                 Automatic classification of documents for easy search & find
50 |               </span>
51 |             </div>
52 |             <div className="flex space-x-2 items-center text-sm">
53 |               <svg
54 |                 xmlns="http://www.w3.org/2000/svg"
55 |                 width={18}
56 |                 height={13}
57 |                 fill="none"
58 |               >
59 |                 <path
60 |                   fill="currentColor"
61 |                   d="M6.55 13 .85 7.3l1.425-1.425L6.55 10.15 15.725.975 17.15 2.4 6.55 13Z"
62 |                 />
63 |               </svg>
64 |               <span className="text-primary">Smart search</span>
65 |             </div>
66 |
67 |             <div className="absolute bottom-0 left-0">
68 |               <CtaLink text="Centralize Your Files now" />
69 |             </div>
70 |           </div>
71 |         </div>
72 |       </div>
73 |
74 |       <div className="border border-border basis-1/3 dark:bg-[#121212] p-10 flex flex-col group">
75 |         <h4 className="font-medium text-xl md:text-2xl mb-4">
76 |           Seamless export
77 |         </h4>
78 |         <p className="text-[#878787] text-sm mb-8">
79 |           Take the hassle out of preparing exports for your accountant. Just
80 |           select any time period or transaction you want and hit export. We
81 |           package everything up neatly in a CSV file (accountants loves these)
82 |           clearly pointing to the right attachment.
83 |         </p>
84 |
85 |         <motion.div
86 |           initial={{ opacity: 0, y: 20 }}
87 |           whileInView={{ opacity: 1, y: 0 }}
88 |           viewport={{ once: true }}
89 |           transition={{ duration: 0.5 }}
90 |           className="mt-auto"
91 |         >
92 |           <ExportToast />
93 |         </motion.div>
94 |
95 |         <div className="mt-8 hidden md:flex">
96 |           <CtaLink text="Streamline your workflow" />
97 |         </div>
98 |       </div>
99 |     </section>
100 |   );
101 | }
```

apps/website/src/components/section-four.tsx
```
1 | "use client";
2 |
3 | import { motion } from "framer-motion";
4 | import inboxActionsLight from "public/inbox-actions-light.png";
5 | import inboxActionsDark from "public/inbox-actions.png";
6 | import inboxSuggestedLight from "public/inbox-suggested-light.png";
7 | import inboxSuggestedDark from "public/inbox-suggested.png";
8 | import invoiceCommentsLight from "public/invoice-comments-light.png";
9 | import invoiceCommentsDark from "public/invoice-comments.png";
10 | import invoiceToolbarLight from "public/invoice-toolbar-light.png";
11 | import invoiceToolbarDark from "public/invoice-toolbar.png";
12 | import invoicingLight from "public/invoicing-light.png";
13 | import invoicingDark from "public/invoicing.png";
14 | import { CtaLink } from "./cta-link";
15 | import { DynamicImage } from "./dynamic-image";
16 |
17 | export function SectionFour() {
18 |   return (
19 |     <section className="flex justify-between space-y-12 lg:space-y-0 lg:space-x-8 flex-col lg:flex-row overflow-hidden mb-12 relative">
20 |       <div className="border border-border md:basis-2/3 dark:bg-[#121212] p-10 flex justify-between md:space-x-8 md:flex-row flex-col group">
21 |         <div className="flex flex-col md:basis-1/2">
22 |           <h4 className="font-medium text-xl md:text-2xl mb-4">Invoicing</h4>
23 |
24 |           <p className="text-[#878787] md:mb-4 text-sm">
25 |             Create and send invoices to your customers, monitor your sent
26 |             balance, track overdue payments and send reminders.
27 |           </p>
28 |
29 |           <div className="flex flex-col space-y-2">
30 |             <div className="flex space-x-2 items-center mt-8 text-sm">
31 |               <svg
32 |                 xmlns="http://www.w3.org/2000/svg"
33 |                 width={18}
34 |                 height={13}
35 |                 fill="none"
36 |               >
37 |                 <path
38 |                   fill="currentColor"
39 |                   d="M6.55 13 .85 7.3l1.425-1.425L6.55 10.15 15.725.975 17.15 2.4 6.55 13Z"
40 |                 />
41 |               </svg>
42 |               <span className="text-primary">Create Customers</span>
43 |             </div>
44 |             <div className="flex space-x-2 items-center text-sm">
45 |               <svg
46 |                 xmlns="http://www.w3.org/2000/svg"
47 |                 width={18}
48 |                 height={13}
49 |                 fill="none"
50 |               >
51 |                 <path
52 |                   fill="currentColor"
53 |                   d="M6.55 13 .85 7.3l1.425-1.425L6.55 10.15 15.725.975 17.15 2.4 6.55 13Z"
54 |                 />
55 |               </svg>
56 |               <span className="text-primary">Add Vat & Sales tax</span>
57 |             </div>
58 |
59 |             <div className="flex space-x-2 items-center text-sm">
60 |               <svg
61 |                 xmlns="http://www.w3.org/2000/svg"
62 |                 width={18}
63 |                 height={13}
64 |                 fill="none"
65 |               >
66 |                 <path
67 |                   fill="currentColor"
68 |                   d="M6.55 13 .85 7.3l1.425-1.425L6.55 10.15 15.725.975 17.15 2.4 6.55 13Z"
69 |                 />
70 |               </svg>
71 |               <span className="text-primary">Add discount</span>
72 |             </div>
73 |
74 |             <div className="flex space-x-2 items-center text-sm">
75 |               <svg
76 |                 xmlns="http://www.w3.org/2000/svg"
77 |                 width={18}
78 |                 height={13}
79 |                 fill="none"
80 |               >
81 |                 <path
82 |                   fill="currentColor"
83 |                   d="M6.55 13 .85 7.3l1.425-1.425L6.55 10.15 15.725.975 17.15 2.4 6.55 13Z"
84 |                 />
85 |               </svg>
86 |               <span className="text-primary">Add Logo</span>
87 |             </div>
88 |
89 |             <div className="flex space-x-2 items-center text-sm">
90 |               <svg
91 |                 xmlns="http://www.w3.org/2000/svg"
92 |                 width={18}
93 |                 height={13}
94 |                 fill="none"
95 |               >
96 |                 <path
97 |                   fill="currentColor"
98 |                   d="M6.55 13 .85 7.3l1.425-1.425L6.55 10.15 15.725.975 17.15 2.4 6.55 13Z"
99 |                 />
100 |               </svg>
101 |               <span className="text-primary">Send web invoices</span>
102 |             </div>
103 |
104 |             <div className="flex space-x-2 items-center text-sm">
105 |               <svg
106 |                 xmlns="http://www.w3.org/2000/svg"
107 |                 width={18}
108 |                 height={13}
109 |                 fill="none"
110 |               >
111 |                 <path
112 |                   fill="currentColor"
113 |                   d="M6.55 13 .85 7.3l1.425-1.425L6.55 10.15 15.725.975 17.15 2.4 6.55 13Z"
114 |                 />
115 |               </svg>
[TRUNCATED]
```

apps/website/src/components/section-one.tsx
```
1 | export function SectionOne() {
2 |   return (
3 |     <section className="mt-24 md:mt-[200px] mb-12">
4 |       <h3 className="text-4xl md:text-8xl font-medium">Everything you need</h3>
5 |       <p className="mt-4 md:mt-8 text-[#878787]">
6 |         From automated receipt-to-transaction mapping to conversing with your
7 |         financials and consolidating all your files
8 |       </p>
9 |     </section>
10 |   );
11 | }
```

apps/website/src/components/section-seven.tsx
```
1 | import { TextGenerateEffect } from "@/components/text-generate-effect";
2 |
3 | export function SectionSeven() {
4 |   return (
5 |     <TextGenerateEffect
6 |       className="md:pt-28 pb-12 md:pb-32 text-4xl	md:text-6xl max-w-[1370px] container md:leading-[85px] mb-12"
7 |       words="Put the boring parts of running a business on autopilot. Midday helps you to streamline your month-end procedures, reduce manual work and easily package everything up for your accountant."
8 |     />
9 |   );
10 | }
```

apps/website/src/components/section-six.tsx
```
1 | import bgLight from "public/assistant-bg-light.png";
2 | import bg from "public/assistant-bg.png";
3 | import { Assistant } from "./assistant";
4 | import { DynamicImage } from "./dynamic-image";
5 | import { Tray } from "./tray";
6 |
7 | export function SectionSix() {
8 |   return (
9 |     <section
10 |       className="mt-[300px] mb-[250px] md:mt-24 md:mb-12 relative"
11 |       id="assistant"
12 |     >
13 |       <Tray />
14 |       <div className="absolute w-full h-full flex items-center justify-center flex-col top-8 xl:top-0">
15 |         <h4 className="text-4xl mb-4 font-medium md:text-white">Assistant</h4>
16 |         <p className="max-w-[790px] px-4 text-center text-sm md:text-white dark:text-[#878787] mb-12 md:mb-0">
17 |           Ask Midday anything and get tailored insights into your financial
18 |           situation. Understand your biggest outgoings and incomings to get a
19 |           better grasp on your financials to help you cut costs, find
20 |           opportunities and build a longer runway.
21 |         </p>
22 |
23 |         <div className="mt-6 hidden xl:block">
24 |           <svg
25 |             xmlns="http://www.w3.org/2000/svg"
26 |             width={139}
27 |             height={19}
28 |             fill="none"
29 |           >
30 |             <path
31 |               fill="white"
[TRUNCATED]
```

apps/website/src/components/section-stories.tsx
```
1 | "use client";
2 |
3 | import { Avatar } from "@midday/ui/avatar";
4 | import { AvatarImageNext } from "@midday/ui/avatar";
5 | import { Button } from "@midday/ui/button";
6 | import {
7 |   Dialog,
8 |   DialogContent,
9 |   DialogHeader,
10 |   DialogTitle,
11 |   DialogTrigger,
12 | } from "@midday/ui/dialog";
13 | import { Icons } from "@midday/ui/icons";
14 | import dynamic from "next/dynamic";
15 | import { useRef, useState } from "react";
16 | import { type Story, StoryCard } from "./story-card";
17 |
18 | const ReactHlsPlayer = dynamic(() => import("react-hls-player"), {
19 |   ssr: false,
20 | });
21 |
22 | const stories = [
23 |   {
24 |     id: 1,
25 |     title: "“We are now saving 1-2 man-days each month.”",
26 |     description:
27 |       "Due to improved invoice reconciliation, we are now saving 1-2 man-days each month, and we have a better understanding of our finances thanks to dashboards.",
28 |     name: "Paweł Michalski ",
29 |     company: "VC leaders",
30 |     country: "Poland",
31 |     src: "/stories/pawel.jpeg",
32 |     content: [
33 |       {
34 |         type: "heading",
35 |         content:
36 |           "VCLeaders is an educational platform for venture capitalists that helps them build better VC firms.  ",
37 |       },
38 |       {
39 |         type: "question",
40 |         content:
41 |           "What specific challenges were you facing in managing your business operations before using Midday?",
42 |       },
43 |       {
44 |         type: "paragraph",
45 |         content:
46 |           "We are a small, remote-first team. Each month, we face challenges when reconciling our invoices. We often struggle to track down missing invoices and ensure all payments are accounted for correctly. This manual process takes more than a full day of someone's time and can take even longer if we overlook anything. Not to mention, we didn’t have any time to categorize and analyze our spending properly.",
47 |       },
48 |       {
49 |         type: "question",
50 |         content:
51 |           "How has Midday impacted your workflow or productivity since you started using it? Can you share specific examples or metrics?",
52 |       },
53 |       {
54 |         type: "paragraph",
55 |         content:
56 |           "Due to improved invoice reconciliation, we are now saving 1-2 man-days each month, and we have a better understanding of our finances thanks to dashboards.",
57 |       },
58 |       {
59 |         type: "question",
60 |         content:
61 |           "What features or aspects of Midday AI do you find most valuable, and why?",
62 |       },
63 |       {
64 |         type: "paragraph",
65 |         content:
66 |           "This tool provides me with a clear overview of my finances, including accounts payable. The user interface is also clean, and the user experience is fantastic. Now, I can easily track all the invoices I receive and issue each month.",
67 |       },
68 |     ],
69 |   },
70 |   {
71 |     id: 2,
72 |     title:
73 |       "“Without Midday I would’ve sold my company and lost loads of money”",
74 |     name: "Guy Solan",
75 |     company: "Thetis Medical",
76 |     country: "United Kingdom",
77 |     src: "/stories/guy.jpeg",
78 |     video:
79 |       "https://customer-oh6t55xltlgrfayh.cloudflarestream.com/5b86803383964d52ee6834fd289f4f4e/manifest/video.m3u8",
80 |     content: [
81 |       {
82 |         type: "paragraph",
83 |         content:
84 |           "”Without Midday I would’ve sold my company and lost loads of money. I never had the time to learn Quickbooks or Xero so had no idea what the company cash was doing without ringing up my accountant.”",
85 |       },
86 |     ],
87 |   },
88 |   {
89 |     id: 3,
90 |     title: "“It has completely transformed how I manage my day-to-day tasks”",
91 |     description:
92 |       "From generating invoices to tracking projects and having all the information centralized in one place, the change has been remarkable.",
93 |     name: "Facu Montanaro",
94 |     company: "Kundo Studio",
95 |     country: "Argentina",
96 |     src: "/stories/facu.jpeg",
97 |     content: [
98 |       {
99 |         type: "heading",
100 |         content:
101 |           "At Kundo, I work alongside a talented team to empower clients in achieving successful fundraising, launching impactful products, and driving growth through design and meaningful experiences.",
102 |       },
103 |       {
104 |         type: "paragraph",
105 |         content:
106 |           "I’m Facu Montanaro, a freelance visual designer from Argentina, focused on crafting beautiful websites and interfaces. I collaborate with startups, founders, and companies to help them thrive.",
107 |       },
108 |       {
109 |         type: "question",
110 |         content:
111 |           "What specific challenges were you facing in managing your business operations before using Midday?",
112 |       },
113 |       {
114 |         type: "paragraph",
115 |         content:
[TRUNCATED]
```

apps/website/src/components/section-three.tsx
```
1 | "use client";
2 |
3 | import { CtaLink } from "@/components/cta-link";
4 | import { motion } from "framer-motion";
5 | import breakdownLight from "public/breakdown-light.png";
6 | import breakdownDark from "public/breakdown.png";
7 | import timeFormatLight from "public/time-format-light.png";
8 | import timeFormatDark from "public/time-format.png";
9 | import timetrackerLight from "public/time-tracker-light.png";
10 | import timetrackerDark from "public/time-tracker.png";
11 | import { DynamicImage } from "./dynamic-image";
12 |
13 | export function SectionThree() {
14 |   return (
15 |     <section className="relative mb-12 group">
16 |       <div className="border border-border container dark:bg-[#121212] p-8 md:p-10 md:pb-0 overflow-hidden">
17 |         <div className="flex flex-col md:space-x-12 md:flex-row">
18 |           <div className="xl:mt-6 md:max-w-[40%] md:mr-8 md:mb-8">
19 |             <h3 className="font-medium text-xl md:text-2xl mb-4">
20 |               Time track your projects
21 |             </h3>
22 |
23 |             <p className="text-[#878787] md:mb-4 text-sm">
24 |               Track your time, monitor project durations, set rates and create{" "}
25 |               <br />
26 |               invoices from your recorded hours.
27 |             </p>
28 |
29 |             <div className="flex flex-col space-y-2">
30 |               <div className="flex space-x-2 items-center mt-8 text-sm">
31 |                 <svg
32 |                   xmlns="http://www.w3.org/2000/svg"
33 |                   width={18}
34 |                   height={13}
35 |                   fill="none"
36 |                 >
37 |                   <path
38 |                     fill="currentColor"
39 |                     d="M6.55 13 .85 7.3l1.425-1.425L6.55 10.15 15.725.975 17.15 2.4 6.55 13Z"
40 |                   />
41 |                 </svg>
42 |                 <span className="text-primary">
43 |                   Get a monthly overview of tracked hours
44 |                 </span>
45 |               </div>
46 |               <div className="flex space-x-2 items-center text-sm">
47 |                 <svg
48 |                   xmlns="http://www.w3.org/2000/svg"
49 |                   width={18}
50 |                   height={13}
51 |                   fill="none"
52 |                 >
53 |                   <path
54 |                     fill="currentColor"
55 |                     d="M6.55 13 .85 7.3l1.425-1.425L6.55 10.15 15.725.975 17.15 2.4 6.55 13Z"
56 |                   />
57 |                 </svg>
58 |                 <span className="text-primary">
59 |                   Set billable rate & time estimates
60 |                 </span>
61 |               </div>
62 |
63 |               <div className="flex space-x-2 items-center text-sm">
64 |                 <svg
65 |                   xmlns="http://www.w3.org/2000/svg"
66 |                   width={18}
67 |                   height={13}
68 |                   fill="none"
69 |                 >
70 |                   <path
71 |                     fill="currentColor"
72 |                     d="M6.55 13 .85 7.3l1.425-1.425L6.55 10.15 15.725.975 17.15 2.4 6.55 13Z"
73 |                   />
74 |                 </svg>
75 |                 <span className="text-primary">
76 |                   See billable amount & monthly breakdown
77 |                 </span>
78 |               </div>
79 |
80 |               <div className="flex space-x-2 items-center text-sm">
81 |                 <svg
82 |                   xmlns="http://www.w3.org/2000/svg"
83 |                   width={18}
84 |                   height={13}
85 |                   fill="none"
86 |                 >
87 |                   <path
88 |                     fill="currentColor"
89 |                     d="M6.55 13 .85 7.3l1.425-1.425L6.55 10.15 15.725.975 17.15 2.4 6.55 13Z"
90 |                   />
91 |                 </svg>
92 |                 <span className="text-primary">
93 |                   Create invoice based on recorded time
94 |                 </span>
95 |               </div>
96 |
97 |               <div className="flex space-x-2 items-center text-sm">
98 |                 <svg
99 |                   xmlns="http://www.w3.org/2000/svg"
100 |                   width={18}
101 |                   height={13}
102 |                   fill="none"
103 |                 >
104 |                   <path
105 |                     fill="currentColor"
106 |                     d="M6.55 13 .85 7.3l1.425-1.425L6.55 10.15 15.725.975 17.15 2.4 6.55 13Z"
107 |                   />
108 |                 </svg>
109 |                 <span className="text-primary">Export as CSV</span>
110 |               </div>
111 |             </div>
112 |
113 |             <div className="absolute bottom-6">
114 |               <CtaLink text="Start tracking time now" />
115 |             </div>
116 |           </div>
117 |
118 |           <div className="relative mt-8 md:mt-0">
119 |             <motion.div
120 |               initial={{ opacity: 0, y: 20 }}
121 |               whileInView={{ opacity: 1, y: 0 }}
122 |               transition={{ duration: 0.3, delay: 0.7 }}
123 |               viewport={{ once: true }}
[TRUNCATED]
```

apps/website/src/components/section-two.tsx
```
1 | import computerLight from "public/computer-light.png";
2 | import computerDark from "public/computer.png";
3 | import { CtaLink } from "./cta-link";
4 | import { DynamicImage } from "./dynamic-image";
5 |
6 | export function SectionTwo() {
7 |   return (
8 |     <section className="border border-border container dark:bg-[#121212] lg:pb-0 overflow-hidden mb-12 group">
9 |       <div className="flex flex-col lg:space-x-12 lg:flex-row">
10 |         <DynamicImage
11 |           lightSrc={computerLight}
12 |           darkSrc={computerDark}
13 |           height={446}
14 |           width={836}
15 |           className="-mb-[1px] object-contain lg:w-1/2"
16 |           alt="Overview"
17 |           quality={90}
18 |         />
19 |
20 |         <div className="xl:mt-6 lg:max-w-[40%] md:ml-8 md:mb-8 flex flex-col justify-center p-8 md:pl-0 relative">
21 |           <h3 className="font-medium text-xl md:text-2xl mb-4">
22 |             Financial overview
23 |           </h3>
24 |
25 |           <p className="text-[#878787] mb-8 lg:mb-4 text-sm">
26 |             Bring your own bank. We connect to over 20 000+ banks in 33
27 |             countries across US, Canada, UK and Europe. Keep tabs on your
28 |             expenses and income, and gain a clearer picture of your business's
29 |             financial track record and current situation.
30 |           </p>
31 |
32 |           <div className="flex flex-col space-y-2">
33 |             <div className="flex space-x-2 items-center ">
34 |               <svg
35 |                 xmlns="http://www.w3.org/2000/svg"
36 |                 width={18}
37 |                 height={13}
38 |                 fill="none"
39 |               >
40 |                 <path
41 |                   fill="currentColor"
42 |                   d="M6.55 13 .85 7.3l1.425-1.425L6.55 10.15 15.725.975 17.15 2.4 6.55 13Z"
43 |                 />
44 |               </svg>
45 |               <span className="text-primary text-sm">Revenue</span>
46 |             </div>
47 |
48 |             <div className="flex space-x-2 items-center">
49 |               <svg
50 |                 xmlns="http://www.w3.org/2000/svg"
51 |                 width={18}
52 |                 height={13}
53 |                 fill="none"
54 |               >
55 |                 <path
56 |                   fill="currentColor"
57 |                   d="M6.55 13 .85 7.3l1.425-1.425L6.55 10.15 15.725.975 17.15 2.4 6.55 13Z"
58 |                 />
59 |               </svg>
60 |               <span className="text-primary text-sm">Profit & Loss</span>
61 |             </div>
62 |
63 |             <div className="flex space-x-2 items-center">
64 |               <svg
65 |                 xmlns="http://www.w3.org/2000/svg"
66 |                 width={18}
67 |                 height={13}
68 |                 fill="none"
69 |               >
70 |                 <path
71 |                   fill="currentColor"
72 |                   d="M6.55 13 .85 7.3l1.425-1.425L6.55 10.15 15.725.975 17.15 2.4 6.55 13Z"
73 |                 />
74 |               </svg>
75 |               <span className="text-primary text-sm">Burnrate</span>
76 |             </div>
77 |
78 |             <div className="flex space-x-2 items-center">
79 |               <svg
80 |                 xmlns="http://www.w3.org/2000/svg"
81 |                 width={18}
82 |                 height={13}
83 |                 fill="none"
84 |               >
85 |                 <path
86 |                   fill="currentColor"
87 |                   d="M6.55 13 .85 7.3l1.425-1.425L6.55 10.15 15.725.975 17.15 2.4 6.55 13Z"
88 |                 />
89 |               </svg>
90 |               <span className="text-primary text-sm">Expenses</span>
91 |             </div>
92 |
93 |             <div className="flex space-x-2 items-center">
94 |               <svg
95 |                 xmlns="http://www.w3.org/2000/svg"
96 |                 width={18}
97 |                 height={13}
98 |                 fill="none"
99 |               >
100 |                 <path
101 |                   fill="currentColor"
102 |                   d="M6.55 13 .85 7.3l1.425-1.425L6.55 10.15 15.725.975 17.15 2.4 6.55 13Z"
103 |                 />
104 |               </svg>
105 |               <span className="text-primary text-sm">
106 |                 Unified currency overview across all your accounts
107 |               </span>
108 |             </div>
109 |
110 |             <div className="flex space-x-2 items-center">
111 |               <svg
112 |                 xmlns="http://www.w3.org/2000/svg"
113 |                 width={18}
114 |                 height={13}
115 |                 fill="none"
116 |               >
117 |                 <path
118 |                   fill="currentColor"
119 |                   d="M6.55 13 .85 7.3l1.425-1.425L6.55 10.15 15.725.975 17.15 2.4 6.55 13Z"
120 |                 />
121 |               </svg>
122 |               <span className="text-primary text-sm">Shareable reports</span>
123 |             </div>
[TRUNCATED]
```

apps/website/src/components/section-video.tsx
```
1 | "use client";
2 |
3 | import { Button } from "@midday/ui/button";
4 | import { Icons } from "@midday/ui/icons";
5 | import { motion } from "framer-motion";
6 | import dynamic from "next/dynamic";
7 | import { useRef, useState } from "react";
8 |
9 | const ReactHlsPlayer = dynamic(() => import("react-hls-player"), {
10 |   ssr: false,
11 | });
12 |
13 | export function SectionVideo() {
14 |   const playerRef = useRef(undefined);
15 |   const [isPlaying, setPlaying] = useState(false);
16 |   const [isMuted, setMuted] = useState(true);
17 |
18 |   const togglePlay = () => {
19 |     if (isPlaying) {
20 |       playerRef.current?.pause();
21 |     } else {
22 |       playerRef.current?.play();
23 |     }
24 |
25 |     setPlaying((prev) => !prev);
26 |   };
27 |
28 |   const toggleMute = () => {
29 |     setMuted((prev) => !prev);
30 |   };
31 |
32 |   return (
33 |     <motion.div
34 |       className="flex flex-col justify-center container pb-20"
35 |       onViewportLeave={() => {
36 |         playerRef.current?.pause();
37 |         setPlaying(false);
38 |       }}
39 |     >
40 |       <div className="relative">
41 |         {isPlaying && (
42 |           <div className="absolute md:top-12 md:right-12 top-4 right-4 space-x-4 items-center justify-center z-30 transition-all">
43 |             <Button
44 |               size="icon"
45 |               className="rounded-full size-10 md:size-14 transition ease-in-out hover:scale-110 hover:bg-white bg-white"
46 |               onClick={toggleMute}
47 |             >
48 |               {isMuted ? (
49 |                 <Icons.Mute size={24} className="text-black" />
50 |               ) : (
51 |                 <Icons.UnMute size={24} className="text-black" />
52 |               )}
53 |             </Button>
54 |           </div>
55 |         )}
56 |
57 |         {!isPlaying && (
58 |           <div className="absolute md:top-12 md:right-12 top-4 right-4 space-x-4 items-center justify-center z-30 transition-all">
59 |             <Button
60 |               size="icon"
61 |               className="rounded-full size-10 md:size-14 transition ease-in-out hover:scale-110 hover:bg-white bg-white"
62 |               onClick={togglePlay}
63 |             >
64 |               <Icons.Play size={24} className="text-black" />
65 |             </Button>
66 |           </div>
67 |         )}
68 |
69 |         <ReactHlsPlayer
70 |           onEnded={() => playerRef.current?.load()}
71 |           onClick={togglePlay}
72 |           src="https://customer-oh6t55xltlgrfayh.cloudflarestream.com/306702a5d5efbba0e9bcdd7cb17e9c5a/manifest/video.m3u8"
73 |           autoPlay={false}
74 |           poster="https://cdn.midday.ai/poster.webp"
75 |           playerRef={playerRef}
76 |           className="w-full"
77 |           muted={isMuted}
78 |         />
79 |       </div>
80 |     </motion.div>
81 |   );
82 | }
```

apps/website/src/components/social-links.tsx
```
1 | import { FaGithub } from "react-icons/fa";
2 | import { FaLinkedinIn, FaProductHunt, FaYoutube } from "react-icons/fa";
3 | import { FaXTwitter } from "react-icons/fa6";
4 | import { FaDiscord } from "react-icons/fa6";
5 |
6 | export function SocialLinks() {
7 |   return (
8 |     <ul className="flex space-x-4 items-center md:ml-5">
9 |       <li>
10 |         <a target="_blank" rel="noreferrer" href="https://go.midday.ai/lS72Toq">
11 |           <span className="sr-only">Twitter</span>
12 |           <FaXTwitter size={22} className="fill-[#878787]" />
13 |         </a>
14 |       </li>
15 |       <li>
16 |         <a target="_blank" rel="noreferrer" href="https://go.midday.ai/7rhA3rz">
17 |           <span className="sr-only">Producthunt</span>
18 |           <FaProductHunt size={22} className="fill-[#878787]" />
19 |         </a>
20 |       </li>
21 |       <li>
22 |         <a target="_blank" rel="noreferrer" href="https://go.midday.ai/anPiuRx">
23 |           <span className="sr-only">Discord</span>
24 |           <FaDiscord size={24} className="fill-[#878787]" />
25 |         </a>
26 |       </li>
27 |       <li>
28 |         <a target="_blank" rel="noreferrer" href="https://git.new/midday">
29 |           <span className="sr-only">Github</span>
30 |           <FaGithub size={22} className="fill-[#878787]" />
31 |         </a>
32 |       </li>
33 |       <li>
34 |         <a target="_blank" rel="noreferrer" href="https://go.midday.ai/Ct3xybK">
35 |           <span className="sr-only">LinkedIn</span>
36 |           <FaLinkedinIn size={22} className="fill-[#878787]" />
37 |         </a>
38 |       </li>
39 |       <li>
40 |         <a target="_blank" rel="noreferrer" href="https://go.midday.ai/0yq8rfn">
41 |           <span className="sr-only">Youtube</span>
42 |           <FaYoutube size={22} className="fill-[#878787]" />
43 |         </a>
44 |       </li>
45 |     </ul>
46 |   );
47 | }
```

apps/website/src/components/startpage.tsx
```
1 | import { Hero } from "@/components/hero";
2 | import { SectionFive } from "@/components/section-five";
3 | import { SectionFour } from "@/components/section-four";
4 | import { SectionOne } from "@/components/section-one";
5 | import { SectionSeven } from "@/components/section-seven";
6 | import { SectionSix } from "@/components/section-six";
7 | import { SectionThree } from "@/components/section-three";
8 | import { SectionTwo } from "@/components/section-two";
9 | import { Testimonials } from "@/components/testimonials";
10 | import SectionStories from "./section-stories";
11 | import { SectionVideo } from "./section-video";
12 |
13 | export function StartPage() {
14 |   return (
15 |     <>
16 |       <Hero />
17 |       <SectionStories />
18 |       <SectionOne />
19 |       <SectionTwo />
20 |       <SectionThree />
21 |       <SectionFour />
22 |       <SectionFive />
23 |       <SectionSix />
24 |       <SectionSeven />
25 |       <SectionVideo />
26 |       <Testimonials />
27 |     </>
28 |   );
29 | }
```

apps/website/src/components/status-widget.tsx
```
1 | "use client";
2 |
3 | import { fetchStatus } from "@/actions/fetch-status";
4 | import { cn } from "@midday/ui/cn";
5 | import { useEffect, useState } from "react";
6 |
7 | export function StatusWidget() {
8 |   const [status, setStatus] = useState("operational");
9 |
10 |   useEffect(() => {
11 |     async function fetchData() {
12 |       try {
13 |         const response = await fetchStatus();
14 |
15 |         if (response) {
16 |           setStatus(response);
17 |         }
18 |       } catch {}
19 |     }
20 |
21 |     fetchData();
22 |   }, []);
23 |
24 |   const getStatusLevel = (level) => {
25 |     return {
26 |       operational: {
27 |         label: "Operational",
28 |         color: "bg-green-500",
29 |         color2: "bg-green-400",
30 |       },
31 |       degraded_performance: {
32 |         label: "Degraded Performance",
33 |         color: "bg-yellow-500",
34 |         color2: "bg-yellow-400",
35 |       },
36 |       partial_outage: {
37 |         label: "Partial Outage",
38 |         color: "bg-yellow-500",
39 |         color2: "bg-yellow-400",
40 |       },
41 |       major_outage: {
42 |         label: "Major Outage",
43 |         color: "bg-red-500",
44 |         color2: "bg-red-400",
45 |       },
46 |       unknown: {
47 |         label: "Unknown",
48 |         color: "bg-gray-500",
49 |         color2: "bg-gray-400",
50 |       },
51 |       incident: {
52 |         label: "Incident",
53 |         color: "bg-yellow-500",
54 |         color2: "bg-yellow-400",
55 |       },
56 |       under_maintenance: {
57 |         label: "Under Maintenance",
58 |         color: "bg-gray-500",
59 |         color2: "bg-gray-400",
60 |       },
61 |     }[level];
62 |   };
63 |
64 |   const level = getStatusLevel(status);
65 |
66 |   if (!level) {
67 |     return null;
68 |   }
69 |
70 |   return (
71 |     <a
72 |       className="flex justify-between space-x-2 items-center w-full border border-border rounded-full px-3 py-1.5"
73 |       href="https://midday.openstatus.dev"
74 |       target="_blank"
75 |       rel="noreferrer"
76 |     >
77 |       <div>
78 |         <p className="text-xs font-mono">{level.label}</p>
79 |       </div>
80 |
81 |       <span className="relative ml-auto flex h-1.5 w-1.5">
82 |         <span
83 |           className={cn(
84 |             "animate-ping absolute inline-flex h-full w-full rounded-full opacity-75",
85 |             level.color2
86 |           )}
87 |         />
88 |         <span
89 |           className={cn(
90 |             "relative inline-flex rounded-full h-1.5 w-1.5",
91 |             level.color
92 |           )}
93 |         />
94 |       </span>
95 |     </a>
96 |   );
97 | }
```

apps/website/src/components/story-card.tsx
```
1 | "use client";
2 |
3 | import { Avatar, AvatarImageNext } from "@midday/ui/avatar";
4 | import { Icons } from "@midday/ui/icons";
5 |
6 | export type Story = {
7 |   id: number;
8 |   title: string;
9 |   description: string;
10 |   name: string;
11 |   company: string;
12 |   country: string;
13 |   src: string;
14 |   video?: string;
15 | };
16 |
17 | export function StoryCard({
18 |   title,
19 |   description,
20 |   name,
21 |   company,
22 |   country,
23 |   src,
24 |   video,
25 | }: Story) {
26 |   return (
27 |     <div className="w-[300px] cursor-pointer">
28 |       <div className="p-6 bg-background border border-border">
29 |         {video && (
30 |           <div className="flex items-center justify-center size-8 bg-primary rounded-full mb-2">
31 |             <Icons.Play size={16} className="text-background" />
32 |           </div>
33 |         )}
34 |         <h3 className="text-lg font-medium mb-2">{title}</h3>
35 |         <p className="text-sm text-[#878787]">{description}</p>
36 |
37 |         <div className="mt-4">
38 |           <div className="flex items-center gap-2 mb-1">
39 |             <Avatar className="size-4">
40 |               <AvatarImageNext src={src} alt={name} width={16} height={16} />
41 |             </Avatar>
42 |             <p className="text-sm">{name}</p>
43 |           </div>
44 |
45 |           <div className="flex items-center gap-2 text-[#878787]">
46 |             <p className="text-sm text-[#878787]">{company}</p> •
47 |             <p className="text-sm text-[#878787]">{country}</p>
48 |           </div>
49 |         </div>
50 |       </div>
51 |     </div>
52 |   );
53 | }
```

apps/website/src/components/subscribe-input.tsx
```
1 | "use client";
2 |
3 | import { subscribeAction } from "@/actions/subscribe-action";
4 | import { Loader2 } from "lucide-react";
5 | import { useState } from "react";
6 | import { useFormStatus } from "react-dom";
7 |
8 | function SubmitButton() {
9 |   const { pending } = useFormStatus();
10 |
11 |   if (pending) {
12 |     return (
13 |       <div className="absolute top-1 right-0">
14 |         <Loader2 className="absolute w-4 h-4 mr-3 text-base animate-spin top-2.5 right-2" />
15 |       </div>
16 |     );
17 |   }
18 |
19 |   return (
20 |     <button
21 |       type="submit"
22 |       className="absolute right-2 h-7 bg-primary top-2 px-4 font-medium text-sm z-10 text-primary-foreground"
23 |     >
24 |       Subscribe
25 |     </button>
26 |   );
27 | }
28 |
29 | export function SubscribeInput() {
30 |   const [isSubmitted, setSubmitted] = useState(false);
31 |
32 |   return (
33 |     <div>
34 |       <div className="flex justify-center">
35 |         {isSubmitted ? (
36 |           <div className="border border-[#2C2C2C] font-sm text-primary h-11 w-[330px] flex items-center py-1 px-3 justify-between">
37 |             <p>Subscribed</p>
38 |
39 |             <svg
40 |               width="17"
41 |               height="17"
42 |               fill="none"
43 |               xmlns="http://www.w3.org/2000/svg"
44 |             >
45 |               <title>Check</title>
46 |               <path
47 |                 d="m14.546 4.724-8 8-3.667-3.667.94-.94 2.727 2.72 7.06-7.053.94.94Z"
48 |                 fill="#fff"
49 |               />
50 |             </svg>
51 |           </div>
52 |         ) : (
53 |           <form
54 |             action={async (formData) => {
55 |               setSubmitted(true);
56 |               await subscribeAction(formData);
57 |
58 |               setTimeout(() => {
59 |                 setSubmitted(false);
60 |               }, 5000);
61 |             }}
62 |           >
63 |             <fieldset className="relative">
64 |               <input
65 |                 placeholder="Enter your email"
66 |                 type="email"
67 |                 name="email"
68 |                 id="email"
69 |                 autoComplete="email"
70 |                 aria-label="Email address"
71 |                 required
72 |                 className="bg-transparent font-sm text-primary outline-none py-1 px-3 w-[360px] placeholder-[#606060] h-11 border border-border"
73 |               />
74 |               <SubmitButton />
75 |             </fieldset>
76 |           </form>
77 |         )}
78 |       </div>
79 |     </div>
80 |   );
81 | }
```

apps/website/src/components/support-form.tsx
```
1 | "use client";
2 |
3 | import { sendSupportSchema } from "@/actions/schema";
4 | import { sendSupportAction } from "@/actions/send-support-action";
5 | import { zodResolver } from "@hookform/resolvers/zod";
6 | import { Button } from "@midday/ui/button";
7 | import {
8 |   Form,
9 |   FormControl,
10 |   FormField,
11 |   FormItem,
12 |   FormLabel,
13 |   FormMessage,
14 | } from "@midday/ui/form";
15 | import { Input } from "@midd