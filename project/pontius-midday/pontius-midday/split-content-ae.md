./tools/ui/revenue-ui";
8 | import { RunwayUI } from "./tools/ui/runway-ui";
9 | import { SpendingUI } from "./tools/ui/spending-ui";
10 | import { TransactionsUI } from "./tools/ui/transactions-ui";
11 |
12 | export const sleep = (ms: number) =>
13 |   new Promise((resolve) => setTimeout(resolve, ms));
14 |
15 | function getUIComponentFromMessage(message) {
16 |   if (message.role === "user") {
17 |     return <UserMessage>{message.content}</UserMessage>;
18 |   }
19 |
20 |   if (message.role === "assistant" && typeof message.content === "string") {
21 |     return <BotMessage content={message.content} />;
22 |   }
23 |
24 |   if (message.role === "tool") {
25 |     return message.content.map((tool) => {
26 |       switch (tool.toolName) {
27 |         case "getRunway": {
28 |           return <RunwayUI {...tool.result} />;
29 |         }
30 |
31 |         case "getBurnRate": {
32 |           return <BurnRateUI {...tool.result} />;
33 |         }
34 |
35 |         case "getSpending": {
36 |           return <SpendingUI {...tool.result} />;
37 |         }
38 |
39 |         case "getTransactions": {
40 |           return <TransactionsUI {...tool.result} />;
41 |         }
42 |
43 |         case "getDocuments": {
44 |           return <DocumentsUI {...tool.result} />;
45 |         }
46 |
47 |         case "createReport": {
48 |           return <ReportUI {...tool.result} />;
49 |         }
50 |
51 |         case "getProfit": {
52 |           return <ProfitUI {...tool.result} />;
53 |         }
54 |
55 |         case "getRevenue": {
56 |           return <RevenueUI {...tool.result} />;
57 |         }
58 |
59 |         default:
60 |           return null;
61 |       }
62 |     });
63 |   }
64 | }
65 |
66 | export const getUIStateFromAIState = (aiState: Chat) => {
67 |   return aiState?.messages
68 |     .filter((message) => message.role !== "system")
69 |     .map((message, index) => ({
70 |       id: `${aiState.id}-${index}`,
71 |       display: getUIComponentFromMessage(message),
72 |     }));
73 | };
```

apps/dashboard/src/actions/ai/editor/generate-editor-content.ts
```
1 | "use server";
2 |
3 | import { openai } from "@ai-sdk/openai";
4 | import { streamText } from "ai";
5 | import { createStreamableValue } from "ai/rsc";
6 |
7 | type Params = {
8 |   input: string;
9 |   context?: string;
10 | };
11 |
12 | export async function generateEditorContent({ input, context }: Params) {
13 |   const stream = createStreamableValue("");
14 |
15 |   (async () => {
16 |     const { textStream } = await streamText({
17 |       model: openai("gpt-4o-mini"),
18 |       prompt: input,
19 |       temperature: 0.8,
20 |       system: `
21 |         You are an expert AI assistant specializing in invoice-related content generation and improvement. Your task is to enhance or modify invoice text based on specific instructions. Follow these guidelines:
22 |
23 |         1. Language: Always respond in the same language as the input prompt.
24 |         2. Conciseness: Keep responses brief and precise, with a maximum of 200 characters.
25 |
26 |         You will perform one of these primary functions:
27 |         - Fix grammar: Rectify any grammatical errors while preserving the original meaning.
28 |         - Improve text: Refine the text to improve clarity and professionalism.
29 |         - Condense text: Remove any unnecessary text and only keep the invoice-related content and make it more concise.
30 |
31 |         Format your response as plain text, using '\n' for line breaks when necessary.
32 |         Do not include any titles or headings in your response.
33 |         Provide only invoice-relevant content without any extraneous information.
34 |         Begin your response directly with the relevant invoice text or information.
35 |
36 |         For custom prompts, maintain focus on invoice-related content. Ensure all generated text is appropriate for formal business communications and adheres to standard invoice practices.
37 |         Current date is: ${new Date().toISOString().split("T")[0]} \n
38 |       ${context}
39 | `,
40 |     });
41 |
42 |     for await (const delta of textStream) {
43 |       stream.update(delta);
44 |     }
45 |
46 |     stream.done();
47 |   })();
48 |
49 |   return { output: stream.value };
50 | }
```

apps/dashboard/src/actions/ai/filters/generate-invoice-filters.ts
```
1 | "use server";
2 |
3 | import { filterInvoiceSchema } from "@/actions/schema";
4 | import { openai } from "@ai-sdk/openai";
5 | import { streamObject } from "ai";
6 | import { createStreamableValue } from "ai/rsc";
7 |
8 | const VALID_FILTERS = [
9 |   "name",
10 |   "due_date",
11 |   "start",
12 |   "end",
13 |   "customers",
14 |   "statuses",
15 | ];
16 |
17 | export async function generateInvoiceFilters(prompt: string, context?: string) {
18 |   const stream = createStreamableValue();
19 |
20 |   (async () => {
21 |     const { partialObjectStream } = await streamObject({
22 |       model: openai("gpt-4o-mini"),
23 |       system: `You are a helpful assistant that generates filters for a given prompt. \n
24 |                Current date is: ${new Date().toISOString().split("T")[0]} \n
25 |                ${context}
26 |       `,
27 |       schema: filterInvoiceSchema.pick({
28 |         ...(VALID_FILTERS.reduce((acc, filter) => {
29 |           acc[filter] = true;
30 |           return acc;
31 |         }, {}) as any),
32 |       }),
33 |       prompt,
34 |       temperature: 0.7,
35 |     });
36 |
37 |     for await (const partialObject of partialObjectStream) {
38 |       stream.update(partialObject);
39 |     }
40 |
41 |     stream.done();
42 |   })();
43 |
44 |   return { object: stream.value };
45 | }
```

apps/dashboard/src/actions/ai/filters/generate-tracker-filters.ts
```
1 | "use server";
2 |
3 | import { filterTrackerSchema } from "@/actions/schema";
4 | import { openai } from "@ai-sdk/openai";
5 | import { streamObject } from "ai";
6 | import { createStreamableValue } from "ai/rsc";
7 |
8 | const VALID_FILTERS = ["name", "start", "end", "status"];
9 |
10 | export async function generateTrackerFilters(prompt: string, context?: string) {
11 |   const stream = createStreamableValue();
12 |
13 |   (async () => {
14 |     const { partialObjectStream } = await streamObject({
15 |       model: openai("gpt-4o-mini"),
16 |       system: `You are a helpful assistant that generates filters for a given prompt. \n
17 |                Current date is: ${new Date().toISOString().split("T")[0]} \n
18 |                ${context}
19 |       `,
20 |       schema: filterTrackerSchema.pick({
21 |         ...(VALID_FILTERS.reduce((acc, filter) => {
22 |           acc[filter] = true;
23 |           return acc;
24 |         }, {}) as any),
25 |       }),
26 |       prompt,
27 |       temperature: 0.7,
28 |     });
29 |
30 |     for await (const partialObject of partialObjectStream) {
31 |       stream.update(partialObject);
32 |     }
33 |
34 |     stream.done();
35 |   })();
36 |
37 |   return { object: stream.value };
38 | }
```

apps/dashboard/src/actions/ai/filters/generate-transactions-filters.ts
```
1 | "use server";
2 |
3 | import { filterTransactionsSchema } from "@/actions/schema";
4 | import { openai } from "@ai-sdk/openai";
5 | import { streamObject } from "ai";
6 | import { createStreamableValue } from "ai/rsc";
7 |
8 | const VALID_FILTERS = [
9 |   "name",
10 |   "attachments",
11 |   "categories",
12 |   "tags",
13 |   "start",
14 |   "end",
15 |   "accounts",
16 |   "assignees",
17 |   "recurring",
18 |   "amount_range",
19 | ];
20 |
21 | export async function generateTransactionsFilters(
22 |   prompt: string,
23 |   context?: string,
24 | ) {
25 |   const stream = createStreamableValue();
26 |
27 |   (async () => {
28 |     const { partialObjectStream } = await streamObject({
29 |       model: openai("gpt-4o-mini"),
30 |       system: `You are a helpful assistant that generates filters for a given prompt. \n
31 |                Current date is: ${new Date().toISOString().split("T")[0]} \n
32 |                ${context}
33 |       `,
34 |       schema: filterTransactionsSchema.pick({
35 |         ...(VALID_FILTERS.reduce((acc, filter) => {
36 |           acc[filter] = true;
37 |           return acc;
38 |         }, {}) as any),
39 |       }),
40 |       prompt,
41 |       temperature: 0.7,
42 |     });
43 |
44 |     for await (const partialObject of partialObjectStream) {
45 |       stream.update(partialObject);
46 |     }
47 |
48 |     stream.done();
49 |   })();
50 |
51 |   return { object: stream.value };
52 | }
```

apps/dashboard/src/actions/ai/filters/generate-vault-filters.ts
```
1 | "use server";
2 |
3 | import { filterVaultSchema } from "@/actions/schema";
4 | import { openai } from "@ai-sdk/openai";
5 | import { streamObject } from "ai";
6 | import { createStreamableValue } from "ai/rsc";
7 |
8 | const VALID_FILTERS = ["name", "start", "end", "owners", "tags"];
9 |
10 | export async function generateVaultFilters(prompt: string, context?: string) {
11 |   const stream = createStreamableValue();
12 |
13 |   (async () => {
14 |     const { partialObjectStream } = await streamObject({
15 |       model: openai("gpt-4o-mini"),
16 |       system: `You are a helpful assistant that generates filters for a given prompt. \n
17 |                Current date is: ${new Date().toISOString().split("T")[0]} \n
18 |                ${context}
19 |       `,
20 |       schema: filterVaultSchema.pick({
21 |         ...(VALID_FILTERS.reduce((acc, filter) => {
22 |           acc[filter] = true;
23 |           return acc;
24 |         }, {}) as any),
25 |       }),
26 |       prompt,
27 |       temperature: 0.7,
28 |     });
29 |
30 |     for await (const partialObject of partialObjectStream) {
31 |       stream.update(partialObject);
32 |     }
33 |
34 |     stream.done();
35 |   })();
36 |
37 |   return { object: stream.value };
38 | }
```

apps/dashboard/src/app/[locale]/(public)/layout.tsx
```
1 | import { UserProvider } from "@/store/user/provider";
2 |
3 | export default function Layout({ children }: { children: React.ReactNode }) {
4 |   return <UserProvider data={null}>{children}</UserProvider>;
5 | }
```

apps/dashboard/src/app/api/proxy/route.ts
```
1 | import { getSession } from "@midday/supabase/cached-queries";
2 | import { type NextRequest, NextResponse } from "next/server";
3 |
4 | export async function GET(req: NextRequest) {
5 |   const requestUrl = new URL(req.url);
6 |   const filePath = requestUrl.searchParams.get("filePath");
7 |
8 |   const {
9 |     data: { session },
10 |   } = await getSession();
11 |
12 |   if (!session) {
13 |     return new NextResponse("Unauthorized", { status: 401 });
14 |   }
15 |
16 |   return fetch(
17 |     `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/${filePath}`,
18 |     {
19 |       headers: {
20 |         authorization: `Bearer ${session?.access_token}`,
21 |       },
22 |     },
23 |   );
24 | }
```

apps/dashboard/src/components/modals/import-modal/context.tsx
```
1 | import { createContext, useContext } from "react";
2 | import type { Control, UseFormSetValue, UseFormWatch } from "react-hook-form";
3 | import { z } from "zod";
4 |
5 | export const mappableFields = {
6 |   date: {
7 |     label: "Date",
8 |     required: true,
9 |   },
10 |   description: {
11 |     label: "Description",
12 |     required: true,
13 |   },
14 |   amount: {
15 |     label: "Amount",
16 |     required: true,
17 |   },
18 |   balance: {
19 |     label: "Balance",
20 |     required: false,
21 |   },
22 | } as const;
23 |
24 | export const importSchema = z.object({
25 |   file: z.custom<File>(),
26 |   currency: z.string(),
27 |   bank_account_id: z.string(),
28 |   amount: z.string(),
29 |   balance: z.string().optional(),
30 |   date: z.string(),
31 |   description: z.string(),
32 |   inverted: z.boolean(),
33 |   table: z.array(z.record(z.string(), z.string())).optional(),
34 |   import_type: z.enum(["csv", "image"]),
35 | });
36 |
37 | export type ImportCsvFormData = {
38 |   file: File | null;
39 |   currency: string;
40 |   bank_account_id: string;
41 |   inverted: boolean;
42 |   table: Record<string, string>[] | null;
43 |   import_type: "csv" | "image";
44 | } & Record<keyof typeof mappableFields, string>;
45 |
46 | export const ImportCsvContext = createContext<{
47 |   fileColumns: string[] | null;
48 |   setFileColumns: (columns: string[] | null) => void;
49 |   firstRows: Record<string, string>[] | null;
50 |   setFirstRows: (rows: Record<string, string>[] | null) => void;
51 |   control: Control<ImportCsvFormData>;
52 |   watch: UseFormWatch<ImportCsvFormData>;
53 |   setValue: UseFormSetValue<ImportCsvFormData>;
54 | } | null>(null);
55 |
56 | export function useCsvContext() {
57 |   const context = useContext(ImportCsvContext);
58 |
59 |   if (!context)
60 |     throw new Error(
61 |       "useCsvContext must be used within an ImportCsvContext.Provider",
62 |     );
63 |
64 |   return context;
65 | }
```

apps/dashboard/src/components/modals/import-modal/field-mapping.tsx
```
1 | "use client";
2 |
3 | import { generateCsvMapping } from "@/actions/ai/generate-csv-mapping";
4 | import { SelectAccount } from "@/components/select-account";
5 | import { SelectCurrency } from "@/components/select-currency";
6 | import { useUserContext } from "@/store/user/hook";
7 | import { formatAmount } from "@/utils/format";
8 | import { formatAmountValue, formatDate } from "@midday/import";
9 | import {
10 |   Accordion,
11 |   AccordionContent,
12 |   AccordionItem,
13 |   AccordionTrigger,
14 | } from "@midday/ui/accordion";
15 | import { Icons } from "@midday/ui/icons";
16 | import { Input } from "@midday/ui/input";
17 | import { Label } from "@midday/ui/label";
18 | import {
19 |   Select,
20 |   SelectContent,
21 |   SelectGroup,
22 |   SelectItem,
23 |   SelectLabel,
24 |   SelectTrigger,
25 |   SelectValue,
26 | } from "@midday/ui/select";
27 | import { Spinner } from "@midday/ui/spinner";
28 | import { Switch } from "@midday/ui/switch";
29 | import {
30 |   Tooltip,
31 |   TooltipContent,
32 |   TooltipProvider,
33 |   TooltipTrigger,
34 | } from "@midday/ui/tooltip";
35 | import { readStreamableValue } from "ai/rsc";
36 | import { capitalCase } from "change-case";
37 | import { useEffect, useState } from "react";
38 | import { Controller } from "react-hook-form";
39 | import { mappableFields, useCsvContext } from "./context";
40 |
41 | export function FieldMapping({ currencies }: { currencies: string[] }) {
42 |   const { fileColumns, firstRows, setValue, control, watch } = useCsvContext();
43 |   const [isStreaming, setIsStreaming] = useState(true);
44 |   const [showCurrency, setShowCurrency] = useState(false);
45 |
46 |   useEffect(() => {
47 |     if (!fileColumns || !firstRows) return;
48 |
49 |     generateCsvMapping(fileColumns, firstRows)
50 |       .then(async ({ object }) => {
51 |         setIsStreaming(true);
52 |
53 |         for await (const partialObject of readStreamableValue(object)) {
54 |           if (partialObject) {
55 |             for (const [field, value] of Object.entries(partialObject)) {
56 |               if (
57 |                 Object.keys(mappableFields).includes(field) &&
58 |                 fileColumns.includes(value as string)
59 |               ) {
60 |                 setValue(field as keyof typeof mappableFields, value, {
61 |                   shouldValidate: true,
62 |                 });
63 |               }
64 |             }
65 |           }
66 |         }
67 |       })
68 |       .finally(() => setIsStreaming(false));
69 |   }, [fileColumns, firstRows]);
70 |
71 |   return (
72 |     <div className="mt-6">
73 |       <div className="grid grid-cols-2 gap-x-4 gap-y-2">
74 |         <div className="text-sm">CSV Data column</div>
75 |         <div className="text-sm">Midday data column</div>
76 |         {(Object.keys(mappableFields) as (keyof typeof mappableFields)[]).map(
77 |           (field) => (
78 |             <FieldRow
79 |               key={field}
80 |               field={field}
81 |               isStreaming={isStreaming}
82 |               currency={watch("currency")}
83 |             />
84 |           ),
85 |         )}
86 |       </div>
87 |
88 |       <Accordion
89 |         defaultValue={undefined}
90 |         collapsible
91 |         type="single"
92 |         className="w-full mt-6 border-t-[1px] border-border"
93 |       >
94 |         <AccordionItem value="settings">
95 |           <AccordionTrigger className="text-sm">Settings</AccordionTrigger>
96 |           <AccordionContent>
97 |             <div className="flex flex-col gap-4">
98 |               <Controller
99 |                 control={control}
100 |                 name="inverted"
101 |                 render={({ field: { onChange, value } }) => (
102 |                   <div className="space-y-1">
103 |                     <Label htmlFor="inverted">Inverted amount</Label>
104 |                     <p className="text-sm text-[#606060]">
105 |                       If the transactions are from credit account, you can
106 |                       invert the amount.
107 |                     </p>
108 |                     <div className="flex justify-end">
109 |                       <Switch
110 |                         id="inverted"
111 |                         checked={value}
112 |                         onCheckedChange={onChange}
113 |                       />
114 |                     </div>
115 |                   </div>
116 |                 )}
117 |               />
118 |             </div>
119 |           </AccordionContent>
120 |         </AccordionItem>
121 |       </Accordion>
122 |
123 |       <div className="mt-6">
124 |         <Label className="mb-2 block">Account</Label>
125 |         <Controller
126 |           control={control}
127 |           name="bank_account_id"
128 |           render={({ field: { value, onChange } }) => (
129 |             <SelectAccount
130 |               className="w-full"
131 |               placeholder="Select account"
132 |               value={value}
133 |               onChange={(account) => {
134 |                 onChange(account.id);
135 |
136 |                 if (account.type === "credit") {
137 |                   setValue("inverted", true, {
138 |                     shouldValidate: true,
139 |                   });
140 |                 }
141 |
142 |                 if (account?.currency) {
143 |                   setValue("currency", account.currency, {
144 |                     shouldValidate: true,
145 |                   });
146 |
147 |                   setShowCurrency(false);
148 |                 } else {
149 |                   // Show currency select if account has no currency
150 |                   setShowCurrency(!account.currency);
151 |                 }
152 |               }}
153 |             />
154 |           )}
155 |         />
156 |       </div>
157 |
158 |       {showCurrency && (
159 |         <>
160 |           <Label className="mb-2 mt-4 block">Currency</Label>
161 |           <Controller
162 |             control={control}
163 |             name="currency"
164 |             render={({ field: { onChange, value } }) => (
165 |               <SelectCurrency
166 |                 className="w-full text-xs"
167 |                 value={value}
168 |                 onChange={onChange}
[TRUNCATED]
```

apps/dashboard/src/components/modals/import-modal/index.tsx
```
1 | "use client";
2 |
3 | import { importTransactionsAction } from "@/actions/transactions/import-transactions";
4 | import { useSyncStatus } from "@/hooks/use-sync-status";
5 | import { useUpload } from "@/hooks/use-upload";
6 | import { useUserContext } from "@/store/user/hook";
7 | import { zodResolver } from "@hookform/resolvers/zod";
8 | import { AnimatedSizeContainer } from "@midday/ui/animated-size-container";
9 | import { Button } from "@midday/ui/button";
10 | import {
11 |   Dialog,
12 |   DialogContent,
13 |   DialogDescription,
14 |   DialogHeader,
15 |   DialogTitle,
16 | } from "@midday/ui/dialog";
17 | import { Icons } from "@midday/ui/icons";
18 | import { useToast } from "@midday/ui/use-toast";
19 | import { stripSpecialCharacters } from "@midday/utils";
20 | import { ErrorBoundary } from "@sentry/nextjs";
21 | import { Loader2 } from "lucide-react";
22 | import { useAction } from "next-safe-action/hooks";
23 | import { useRouter } from "next/navigation";
24 | import { parseAsBoolean, parseAsString, useQueryStates } from "nuqs";
25 | import { useEffect, useState } from "react";
26 | import { useForm } from "react-hook-form";
27 | import {
28 |   ImportCsvContext,
29 |   type ImportCsvFormData,
30 |   importSchema,
31 | } from "./context";
32 | import { FieldMapping } from "./field-mapping";
33 | import { SelectFile } from "./select-file";
34 |
35 | const pages = ["select-file", "confirm-import"] as const;
36 |
37 | type Props = {
38 |   currencies: string[];
39 |   defaultCurrency: string;
40 | };
41 |
42 | export function ImportModal({ currencies, defaultCurrency }: Props) {
43 |   const [runId, setRunId] = useState<string | undefined>();
44 |   const [accessToken, setAccessToken] = useState<string | undefined>();
45 |   const [isImporting, setIsImporting] = useState(false);
46 |   const [fileColumns, setFileColumns] = useState<string[] | null>(null);
47 |   const [firstRows, setFirstRows] = useState<Record<string, string>[] | null>(
48 |     null,
49 |   );
50 |
51 |   const { team_id: teamId } = useUserContext((state) => state.data);
52 |
53 |   const [pageNumber, setPageNumber] = useState<number>(0);
54 |   const page = pages[pageNumber];
55 |
56 |   const { uploadFile } = useUpload();
57 |
58 |   const { toast } = useToast();
59 |   const router = useRouter();
60 |
61 |   const { status, setStatus } = useSyncStatus({ runId, accessToken });
62 |
63 |   const [params, setParams] = useQueryStates({
64 |     step: parseAsString,
65 |     accountId: parseAsString,
66 |     type: parseAsString,
67 |     hide: parseAsBoolean.withDefault(false),
68 |   });
69 |
70 |   const isOpen = params.step === "import";
71 |
72 |   const importTransactions = useAction(importTransactionsAction, {
73 |     onSuccess: ({ data }) => {
74 |       if (data) {
75 |         setRunId(data.id);
76 |         setAccessToken(data.publicAccessToken);
77 |       }
78 |     },
79 |     onError: () => {
80 |       setIsImporting(false);
81 |       setRunId(undefined);
82 |       setStatus("FAILED");
83 |
84 |       toast({
85 |         duration: 3500,
86 |         variant: "error",
87 |         title: "Something went wrong please try again.",
88 |       });
89 |     },
90 |   });
91 |
92 |   const {
93 |     control,
94 |     watch,
95 |     setValue,
96 |     handleSubmit,
97 |     reset,
98 |     formState: { isValid },
99 |   } = useForm<ImportCsvFormData>({
100 |     resolver: zodResolver(importSchema),
101 |     defaultValues: {
102 |       currency: defaultCurrency,
103 |       bank_account_id: params.accountId ?? undefined,
104 |       inverted: params.type === "credit",
105 |     },
106 |   });
107 |
108 |   const file = watch("file");
109 |
110 |   const onclose = () => {
111 |     setFileColumns(null);
112 |     setFirstRows(null);
113 |     setPageNumber(0);
114 |     reset();
115 |
116 |     setParams({
117 |       step: null,
118 |       accountId: null,
119 |       type: null,
120 |       hide: null,
121 |     });
122 |   };
123 |
124 |   useEffect(() => {
125 |     if (params.accountId) {
126 |       setValue("bank_account_id", params.accountId);
127 |     }
128 |   }, [params.accountId]);
129 |
130 |   useEffect(() => {
131 |     if (params.type) {
132 |       setValue("inverted", params.type === "credit");
133 |     }
134 |   }, [params.type]);
135 |
136 |   useEffect(() => {
137 |     if (status === "FAILED") {
138 |       setIsImporting(false);
139 |       setRunId(undefined);
140 |
141 |       toast({
142 |         duration: 3500,
143 |         variant: "error",
144 |         title: "Something went wrong please try again or contact support.",
145 |       });
146 |     }
147 |   }, [status]);
148 |
149 |   useEffect(() => {
150 |     if (status === "COMPLETED") {
151 |       setRunId(undefined);
152 |       setIsImporting(false);
153 |       onclose();
154 |       router.refresh();
155 |
156 |       toast({
157 |         duration: 3500,
158 |         variant: "success",
159 |         title: "Transactions imported successfully.",
160 |       });
161 |     }
162 |   }, [status]);
163 |
164 |   // Go to second page if file looks good
165 |   useEffect(() => {
166 |     if (file && fileColumns && pageNumber === 0) {
167 |       setPageNumber(1);
168 |     }
169 |   }, [file, fileColumns, pageNumber]);
170 |
171 |   return (
172 |     <Dialog open={isOpen} onOpenChange={onclose}>
173 |       <DialogContent>
174 |         <ErrorBoundary>
175 |           <div className="p-4 pb-0">
176 |             <DialogHeader>
177 |               <div className="flex space-x-4 items-center mb-4">
[TRUNCATED]
```

apps/dashboard/src/components/modals/import-modal/select-file.tsx
```
1 | import { getTransactionsFromLayout } from "@/actions/transactions/get-transactions-from-layout";
2 | import { useUpload } from "@/hooks/use-upload";
3 | import { useUserContext } from "@/store/user/hook";
4 | import { createClient } from "@midday/supabase/client";
5 | import { cn } from "@midday/ui/cn";
6 | import { Spinner } from "@midday/ui/spinner";
7 | import { stripSpecialCharacters } from "@midday/utils";
8 | import { useAction } from "next-safe-action/hooks";
9 | import Papa from "papaparse";
10 | import { useEffect, useState } from "react";
11 | import Dropzone from "react-dropzone";
12 | import { Controller } from "react-hook-form";
13 | import { useCsvContext } from "./context";
14 | import { readLines } from "./utils";
15 |
16 | export function SelectFile() {
17 |   const supabase = createClient();
18 |   const { watch, control, setFileColumns, setFirstRows, setValue } =
19 |     useCsvContext();
20 |   const [error, setError] = useState<string | null>(null);
21 |   const [isLoading, setIsLoading] = useState(false);
22 |   const { uploadFile } = useUpload();
23 |
24 |   const { team_id: teamId } = useUserContext((state) => state.data);
25 |
26 |   const getTransactions = useAction(getTransactionsFromLayout, {
27 |     onSuccess: ({ data }) => {
28 |       const { columns, results } = data;
29 |
30 |       setValue("table", results);
31 |       setFileColumns(columns);
32 |
33 |       // Skip the first row because it can be the header row
34 |       setFirstRows(results.slice(1, 4));
35 |       setIsLoading(false);
36 |     },
37 |     onError: () => {
38 |       setError("Something went wrong while processing the file.");
39 |       setIsLoading(false);
40 |     },
41 |   });
42 |
43 |   const file = watch("file");
44 |
45 |   async function processFile() {
46 |     if (!file) {
47 |       setFileColumns(null);
48 |       return;
49 |     }
50 |
51 |     setIsLoading(true);
52 |
53 |     if (file?.type !== "text/csv") {
54 |       try {
55 |         setValue("import_type", "image");
56 |
57 |         const filename = stripSpecialCharacters(file.name);
58 |
59 |         const { path } = await uploadFile({
60 |           bucket: "vault",
61 |           path: [teamId, "imports", filename],
62 |           file,
63 |         });
64 |
65 |         getTransactions.execute({ filePath: path });
66 |       } catch (error) {
67 |         setError("Something went wrong while processing the file.");
68 |         setIsLoading(false);
69 |       }
70 |
71 |       return;
72 |     }
73 |
74 |     setValue("import_type", "csv");
75 |
76 |     readLines(file, 4)
77 |       .then((lines) => {
78 |         const { data, meta } = Papa.parse(lines, {
79 |           worker: false,
80 |           skipEmptyLines: true,
81 |           header: true,
82 |         });
83 |
84 |         if (!data || data.length < 2) {
85 |           setError("CSV file must have at least 2 rows.");
86 |           setFileColumns(null);
87 |           setFirstRows(null);
88 |           setIsLoading(false);
89 |           return;
90 |         }
91 |
92 |         if (!meta || !meta.fields || meta.fields.length <= 1) {
93 |           setError("Failed to retrieve CSV column data.");
94 |           setFileColumns(null);
95 |           setFirstRows(null);
96 |           setIsLoading(false);
97 |           return;
98 |         }
99 |
100 |         setFileColumns(meta.fields);
101 |         setFirstRows(data);
102 |         setIsLoading(false);
103 |       })
104 |       .catch(() => {
105 |         setError("Failed to read CSV file.");
106 |         setFileColumns(null);
107 |         setFirstRows(null);
108 |         setIsLoading(false);
109 |       });
110 |   }
111 |
112 |   useEffect(() => {
113 |     processFile();
114 |   }, [file]);
115 |
116 |   return (
117 |     <div className="flex flex-col gap-3">
118 |       <Controller
119 |         control={control}
120 |         name="file"
121 |         render={({ field: { onChange, onBlur } }) => (
122 |           <Dropzone
123 |             onDrop={([file]) => onChange(file)}
124 |             maxFiles={1}
125 |             accept={{
126 |               "text/csv": [".csv"],
127 |               "image/jpeg": [".jpg"],
128 |               "image/png": [".png"],
129 |             }}
130 |             maxSize={5000000}
131 |           >
132 |             {({ getRootProps, getInputProps, isDragActive, isDragReject }) => (
133 |               <div
134 |                 {...getRootProps()}
135 |                 className={cn(
136 |                   "w-full border border-dashed h-[200px] mt-8 mb-8 flex items-center justify-center",
137 |                   isDragActive && "bg-secondary text-primary",
138 |                   isDragReject && "border-destructive",
139 |                 )}
140 |               >
141 |                 <div className="text-center flex items-center justify-center flex-col text-xs text-[#878787]">
142 |                   <input {...getInputProps()} onBlur={onBlur} />
143 |
144 |                   {isLoading ? (
145 |                     <div className="flex space-x-1 items-center">
146 |                       <Spinner />
147 |                       <span>Loading...</span>
148 |                     </div>
149 |                   ) : (
150 |                     <div>
151 |                       <p>Drop your file here, or click to browse.</p>
152 |                       <span>5MB file limit.</span>
153 |                       <span className="mt-2 text-[10px]">
154 |                         CSV, PDF, jpg or png
155 |                       </span>
156 |                     </div>
157 |                   )}
158 |
159 |                   {error && (
160 |                     <p className="text-center text-sm text-red-600 mt-4">
161 |                       {error}
162 |                     </p>
163 |                   )}
164 |                 </div>
[TRUNCATED]
```

apps/dashboard/src/components/modals/import-modal/utils.ts
```
1 | export const readLines = async (file: File, count = 4): Promise<string> => {
2 |   const reader = file.stream().getReader();
3 |   const decoder = new TextDecoder("utf-8");
4 |   let { value: chunk, done: readerDone } = await reader.read();
5 |   let content = "";
6 |   const result: string[] = [];
7 |
8 |   while (!readerDone) {
9 |     content += decoder.decode(chunk, { stream: true });
10 |     const lines = content.split("\n");
11 |     if (lines.length >= count) {
12 |       reader.cancel();
13 |       return lines.slice(0, count).join("\n");
14 |     }
15 |     ({ value: chunk, done: readerDone } = await reader.read());
16 |   }
17 |
18 |   return result.join("\n");
19 | };
```

apps/dashboard/src/components/tables/categories/columns.tsx
```
1 | "use client";
2 |
3 | import { EditCategoryModal } from "@/components/modals/edit-category-modal";
4 | import { Button } from "@midday/ui/button";
5 | import { Checkbox } from "@midday/ui/checkbox";
6 | import {
7 |   DropdownMenu,
8 |   DropdownMenuContent,
9 |   DropdownMenuItem,
10 |   DropdownMenuTrigger,
11 | } from "@midday/ui/dropdown-menu";
12 | import {
13 |   Tooltip,
14 |   TooltipContent,
15 |   TooltipProvider,
16 |   TooltipTrigger,
17 | } from "@midday/ui/tooltip";
18 | import { DotsHorizontalIcon } from "@radix-ui/react-icons";
19 | import type { ColumnDef } from "@tanstack/react-table";
20 | import * as React from "react";
21 |
22 | export type Category = {
23 |   id: string;
24 |   name: string;
25 |   system: boolean;
26 |   vat?: string;
27 |   color: string;
28 | };
29 |
30 | export const columns: ColumnDef<Category>[] = [
31 |   {
32 |     header: "Name",
33 |     accessorKey: "name",
34 |     cell: ({ row }) => (
35 |       <div className="flex space-x-2 items-center">
36 |         <div
37 |           className="size-3"
38 |           style={{ backgroundColor: row.original.color }}
39 |         />
40 |         <TooltipProvider delayDuration={0}>
41 |           <Tooltip>
42 |             <TooltipTrigger asChild>
43 |               <span className="cursor-default">{row.getValue("name")}</span>
44 |             </TooltipTrigger>
45 |             {row.original?.description && (
46 |               <TooltipContent
47 |                 className="px-3 py-1.5 text-xs"
48 |                 side="right"
49 |                 sideOffset={10}
50 |               >
51 |                 {row.original.description}
52 |               </TooltipContent>
53 |             )}
54 |           </Tooltip>
55 |         </TooltipProvider>
56 |
57 |         {row.original.system && (
58 |           <div className="pl-2">
59 |             <span className="border border-border rounded-full py-1.5 px-3 text-xs text-[#878787] font-mono">
60 |               System
61 |             </span>
62 |           </div>
63 |         )}
64 |       </div>
65 |     ),
66 |   },
67 |   {
68 |     header: "VAT",
69 |     accessorKey: "vat",
70 |     cell: ({ row }) => (row.getValue("vat") ? `${row.getValue("vat")}%` : "-"),
71 |   },
72 |   {
73 |     id: "actions",
74 |     cell: ({ row, table }) => {
75 |       const [isOpen, setOpen] = React.useState(false);
76 |
77 |       return (
78 |         <div className="text-right">
79 |           <DropdownMenu>
80 |             <DropdownMenuTrigger asChild>
81 |               <Button variant="ghost" className="h-8 w-8 p-0">
82 |                 <DotsHorizontalIcon className="h-4 w-4" />
83 |               </Button>
84 |             </DropdownMenuTrigger>
85 |             <DropdownMenuContent align="end">
86 |               <DropdownMenuItem onClick={() => setOpen(true)}>
87 |                 Edit
88 |               </DropdownMenuItem>
89 |               {!row.original.system && (
90 |                 <DropdownMenuItem
91 |                   onClick={() =>
92 |                     table.options.meta?.deleteCategories.execute({
93 |                       ids: [row.original.id],
94 |                       revalidatePath: "/settings/categories",
95 |                     })
96 |                   }
97 |                 >
98 |                   Remove
99 |                 </DropdownMenuItem>
100 |               )}
101 |             </DropdownMenuContent>
102 |           </DropdownMenu>
103 |
104 |           <EditCategoryModal
105 |             id={row.id}
106 |             defaultValue={row.original}
107 |             isOpen={isOpen}
108 |             onOpenChange={setOpen}
109 |           />
110 |         </div>
111 |       );
112 |     },
113 |   },
114 | ];
```

apps/dashboard/src/components/tables/categories/header.tsx
```
1 | "use client";
2 |
3 | import { Button } from "@midday/ui/button";
4 | import { Input } from "@midday/ui/input";
5 | import type { Table } from "@tanstack/react-table";
6 | import type { Category } from "./columns";
7 |
8 | type Props = {
9 |   table?: Table<Category[]>;
10 |   onOpenChange?: (isOpen: boolean) => void;
11 | };
12 |
13 | export function Header({ table, onOpenChange }: Props) {
14 |   return (
15 |     <div className="flex items-center py-4 justify-between">
16 |       <Input
17 |         placeholder="Search..."
18 |         value={(table?.getColumn("name")?.getFilterValue() as string) ?? ""}
19 |         onChange={(event) =>
20 |           table?.getColumn("name")?.setFilterValue(event.target.value)
21 |         }
22 |         className="max-w-sm"
23 |       />
24 |
25 |       <Button onClick={() => onOpenChange?.(true)}>Create</Button>
26 |     </div>
27 |   );
28 | }
```

apps/dashboard/src/components/tables/categories/index.tsx
```
1 | import { getCategories } from "@midday/supabase/cached-queries";
2 | import { DataTable } from "./table";
3 |
4 | export async function CategoriesTable() {
5 |   const categories = await getCategories();
6 |
7 |   return <DataTable data={categories?.data} />;
8 | }
```

apps/dashboard/src/components/tables/categories/skeleton.tsx
```
1 | import { Skeleton } from "@midday/ui/skeleton";
2 | import {
3 |   Table,
4 |   TableBody,
5 |   TableCell,
6 |   TableHead,
7 |   TableHeader,
8 |   TableRow,
9 | } from "@midday/ui/table";
10 | import { Header } from "./header";
11 |
12 | export function CategoriesSkeleton() {
13 |   return (
14 |     <div className="w-full">
15 |       <Header />
16 |
17 |       <Table>
18 |         <TableHeader>
19 |           <TableRow>
20 |             <TableHead>Name</TableHead>
21 |             <TableHead>VAT</TableHead>
22 |           </TableRow>
23 |         </TableHeader>
24 |
25 |         <TableBody>
26 |           {[...Array(15)].map((_, index) => (
27 |             <TableRow
28 |               key={index.toString()}
29 |               className="hover:bg-transparent h-[49px]"
30 |             >
31 |               <TableCell className="w-[50px]">
32 |                 <Skeleton className="size-4 rounded-md" />
33 |               </TableCell>
34 |               <TableCell>
35 |                 <Skeleton className="w-[20%] h-2" />
36 |               </TableCell>
37 |               <TableCell className="w-[65px]">
38 |                 <Skeleton className="w-5 h-1" />
39 |               </TableCell>
40 |             </TableRow>
41 |           ))}
42 |         </TableBody>
43 |       </Table>
44 |     </div>
45 |   );
46 | }
```

apps/dashboard/src/components/tables/categories/table.tsx
```
1 | "use client";
2 |
3 | import { deleteCategoriesAction } from "@/actions/delete-categories-action";
4 | import { CreateCategoriesModal } from "@/components/modals/create-categories-modal";
5 | import {
6 |   AlertDialog,
7 |   AlertDialogAction,
8 |   AlertDialogCancel,
9 |   AlertDialogContent,
10 |   AlertDialogDescription,
11 |   AlertDialogFooter,
12 |   AlertDialogHeader,
13 |   AlertDialogTitle,
14 | } from "@midday/ui/alert-dialog";
15 | import { cn } from "@midday/ui/cn";
16 | import { Dialog } from "@midday/ui/dialog";
17 | import {
18 |   Table,
19 |   TableBody,
20 |   TableCell,
21 |   TableHead,
22 |   TableHeader,
23 |   TableRow,
24 | } from "@midday/ui/table";
25 | import { useToast } from "@midday/ui/use-toast";
26 | import {
27 |   flexRender,
28 |   getCoreRowModel,
29 |   getFilteredRowModel,
30 |   useReactTable,
31 | } from "@tanstack/react-table";
32 | import { useAction } from "next-safe-action/hooks";
33 | import React from "react";
34 | import { type Category, columns } from "./columns";
35 | import { Header } from "./header";
36 |
37 | type Props = {
38 |   data: Category[];
39 | };
40 |
41 | export function DataTable({ data }: Props) {
42 |   const [isOpen, onOpenChange] = React.useState(false);
43 |   const { toast } = useToast();
44 |
45 |   const deleteCategories = useAction(deleteCategoriesAction, {
46 |     onSuccess: ({ data }) => {
47 |       toast({
48 |         title:
49 |           data && data?.length > 1 ? "Categories removed." : "Category removed",
50 |         duration: 3500,
51 |         variant: "success",
52 |       });
53 |     },
54 |   });
55 |
56 |   const table = useReactTable({
57 |     data,
58 |     getRowId: ({ id }) => id,
59 |     columns,
60 |     getCoreRowModel: getCoreRowModel(),
61 |     getFilteredRowModel: getFilteredRowModel(),
62 |     meta: {
63 |       deleteCategories,
64 |     },
65 |   });
66 |
67 |   return (
68 |     <AlertDialog>
69 |       <div className="w-full">
70 |         <Header table={table} onOpenChange={onOpenChange} />
71 |
72 |         <Table>
73 |           <TableHeader>
74 |             {table.getHeaderGroups().map((headerGroup) => (
75 |               <TableRow key={headerGroup.id}>
76 |                 {headerGroup.headers.map((header) => {
77 |                   return (
78 |                     <TableHead key={header.id}>
79 |                       {header.isPlaceholder
80 |                         ? null
81 |                         : flexRender(
82 |                             header.column.columnDef.header,
83 |                             header.getContext()
84 |                           )}
85 |                     </TableHead>
86 |                   );
87 |                 })}
88 |               </TableRow>
89 |             ))}
90 |           </TableHeader>
91 |           <TableBody>
92 |             {table.getRowModel().rows.map((row) => (
93 |               <TableRow
94 |                 className="hover:bg-transparent"
95 |                 key={row.id}
96 |                 data-state={row.getIsSelected() && "selected"}
97 |               >
98 |                 {row.getVisibleCells().map((cell, index) => (
99 |                   <TableCell
100 |                     key={cell.id}
101 |                     className={cn(index === 2 && "w-[50px]")}
102 |                   >
103 |                     {flexRender(cell.column.columnDef.cell, cell.getContext())}
104 |                   </TableCell>
105 |                 ))}
106 |               </TableRow>
107 |             ))}
108 |           </TableBody>
109 |         </Table>
110 |
111 |         <Dialog open={isOpen} onOpenChange={onOpenChange}>
112 |           <CreateCategoriesModal onOpenChange={onOpenChange} isOpen={isOpen} />
113 |         </Dialog>
114 |       </div>
115 |
116 |       <AlertDialogContent>
117 |         <AlertDialogHeader>
118 |           <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
119 |           <AlertDialogDescription>
120 |             This action cannot be undone. This will permanently delete your
121 |             categories and mark assigned transactions to Uncategorized.
122 |           </AlertDialogDescription>
123 |         </AlertDialogHeader>
124 |         <AlertDialogFooter>
125 |           <AlertDialogCancel>Cancel</AlertDialogCancel>
126 |           <AlertDialogAction
127 |             onClick={() =>
128 |               deleteCategories.execute({
129 |                 ids: selectedIds,
130 |                 revalidatePath: "/settings/categories",
131 |               })
132 |             }
133 |           >
134 |             Continue
135 |           </AlertDialogAction>
136 |         </AlertDialogFooter>
137 |       </AlertDialogContent>
138 |     </AlertDialog>
139 |   );
140 | }
```

apps/dashboard/src/components/tables/customers/columns.tsx
```
1 | "use client";
2 |
3 | import { useCustomerParams } from "@/hooks/use-customer-params";
4 | import { Avatar, AvatarFallback, AvatarImageNext } from "@midday/ui/avatar";
5 | import { Badge } from "@midday/ui/badge";
6 | import { Button } from "@midday/ui/button";
7 | import {
8 |   DropdownMenu,
9 |   DropdownMenuContent,
10 |   DropdownMenuItem,
11 |   DropdownMenuTrigger,
12 | } from "@midday/ui/dropdown-menu";
13 | import { ScrollArea, ScrollBar } from "@midday/ui/scroll-area";
14 | import { DotsHorizontalIcon } from "@radix-ui/react-icons";
15 | import type { ColumnDef } from "@tanstack/react-table";
16 | import Link from "next/link";
17 | import * as React from "react";
18 |
19 | export type Customer = {
20 |   id: string;
21 |   name: string;
22 |   customer_name?: string;
23 |   website: string;
24 |   contact?: string;
25 |   email: string;
26 |   invoices: { id: string }[];
27 |   projects: { id: string }[];
28 |   tags: { tag: { id: string; name: string } }[];
29 | };
30 |
31 | export const columns: ColumnDef<Customer>[] = [
32 |   {
33 |     header: "Name",
34 |     accessorKey: "name",
35 |     cell: ({ row }) => {
36 |       const name = row.original.name ?? row.original.customer_name;
37 |
38 |       if (!name) return "-";
39 |
40 |       return (
41 |         <div className="flex items-center space-x-2">
42 |           <Avatar className="size-5">
43 |             {row.original.website && (
44 |               <AvatarImageNext
45 |                 src={`https://img.logo.dev/${row.original.website}?token=pk_X-1ZO13GSgeOoUrIuJ6GMQ&size=60`}
46 |                 alt={`${name} logo`}
47 |                 width={20}
48 |                 height={20}
49 |                 quality={100}
50 |               />
51 |             )}
52 |             <AvatarFallback className="text-[9px] font-medium">
53 |               {name?.[0]}
54 |             </AvatarFallback>
55 |           </Avatar>
56 |           <span className="truncate">{name}</span>
57 |         </div>
58 |       );
59 |     },
60 |   },
61 |   {
62 |     header: "Contact person",
63 |     accessorKey: "contact",
64 |     cell: ({ row }) => row.getValue("contact") ?? "-",
65 |   },
66 |   {
67 |     header: "Email",
68 |     accessorKey: "email",
69 |     cell: ({ row }) => row.getValue("email") ?? "-",
70 |   },
71 |   {
72 |     header: "Invoices",
73 |     accessorKey: "invoices",
74 |     cell: ({ row }) => {
75 |       if (row.original.invoices.length > 0) {
76 |         return (
77 |           <Link href={`/invoices?customers=${row.original.id}`}>
78 |             {row.original.invoices.length}
79 |           </Link>
80 |         );
81 |       }
82 |
83 |       return "-";
84 |     },
85 |   },
86 |   {
87 |     header: "Projects",
88 |     accessorKey: "projects",
89 |     cell: ({ row }) => {
90 |       if (row.original.projects.length > 0) {
91 |         return (
92 |           <Link href={`/tracker?customers=${row.original.id}`}>
93 |             {row.original.projects.length}
94 |           </Link>
95 |         );
96 |       }
97 |
98 |       return "-";
99 |     },
100 |   },
101 |   {
102 |     header: "Tags",
103 |     accessorKey: "tags",
104 |     cell: ({ row }) => {
105 |       return (
106 |         <div className="relative">
107 |           <ScrollArea className="max-w-[170px] whitespace-nowrap">
108 |             <div className="flex items-center space-x-2">
109 |               {row.original.tags?.map(({ tag }) => (
110 |                 <Link href={`/transactions?tags=${tag.id}`} key={tag.id}>
111 |                   <Badge variant="tag" className="whitespace-nowrap">
112 |                     {tag.name}
113 |                   </Badge>
114 |                 </Link>
115 |               ))}
116 |             </div>
117 |
118 |             <ScrollBar orientation="horizontal" />
119 |           </ScrollArea>
120 |
121 |           <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-background to-transparent pointer-events-none z-10" />
122 |         </div>
123 |       );
124 |     },
125 |   },
126 |   {
127 |     id: "actions",
128 |     header: "Actions",
129 |     cell: ({ row, table }) => {
130 |       const { setParams } = useCustomerParams();
131 |
132 |       return (
133 |         <div>
134 |           <DropdownMenu>
135 |             <DropdownMenuTrigger asChild className="relative">
136 |               <Button variant="ghost" className="h-8 w-8 p-0">
137 |                 <DotsHorizontalIcon className="h-4 w-4" />
138 |               </Button>
139 |             </DropdownMenuTrigger>
140 |
141 |             <DropdownMenuContent align="end">
142 |               <DropdownMenuItem
143 |                 onClick={() =>
144 |                   setParams({
145 |                     customerId: row.original.id,
146 |                   })
147 |                 }
148 |               >
149 |                 Edit customer
150 |               </DropdownMenuItem>
151 |
152 |               <DropdownMenuItem
153 |                 onClick={() =>
154 |                   table.options.meta?.deleteCustomer(row.original.id)
155 |                 }
156 |                 className="text-[#FF3638]"
157 |               >
158 |                 Delete
159 |               </DropdownMenuItem>
160 |             </DropdownMenuContent>
161 |           </DropdownMenu>
162 |         </div>
163 |       );
164 |     },
165 |   },
166 | ];
```

apps/dashboard/src/components/tables/customers/empty-states.tsx
```
1 | "use client";
2 |
3 | import { useCustomerParams } from "@/hooks/use-customer-params";
4 | import { Button } from "@midday/ui/button";
5 |
6 | export function EmptyState() {
7 |   const { setParams } = useCustomerParams();
8 |
9 |   return (
10 |     <div className="flex items-center justify-center ">
11 |       <div className="flex flex-col items-center mt-40">
12 |         <div className="text-center mb-6 space-y-2">
13 |           <h2 className="font-medium text-lg">No customers</h2>
14 |           <p className="text-[#606060] text-sm">
15 |             You haven't created any customers yet. <br />
16 |             Go ahead and create your first one.
17 |           </p>
18 |         </div>
19 |
20 |         <Button
21 |           variant="outline"
22 |           onClick={() =>
23 |             setParams({
24 |               createCustomer: true,
25 |             })
26 |           }
27 |         >
28 |           Create customer
29 |         </Button>
30 |       </div>
31 |     </div>
32 |   );
33 | }
34 |
35 | export function NoResults() {
36 |   const { setParams } = useCustomerParams();
37 |
38 |   return (
39 |     <div className="flex items-center justify-center ">
40 |       <div className="flex flex-col items-center mt-40">
41 |         <div className="text-center mb-6 space-y-2">
42 |           <h2 className="font-medium text-lg">No results</h2>
43 |           <p className="text-[#606060] text-sm">
44 |             Try another search, or adjusting the filters
45 |           </p>
46 |         </div>
47 |
48 |         <Button
49 |           variant="outline"
50 |           onClick={() => setParams(null, { shallow: false })}
51 |         >
52 |           Clear filters
53 |         </Button>
54 |       </div>
55 |     </div>
56 |   );
57 | }
```

apps/dashboard/src/components/tables/customers/index.tsx
```
1 | import { getCustomers } from "@midday/supabase/cached-queries";
2 | import { EmptyState, NoResults } from "./empty-states";
3 | import { DataTable } from "./table";
4 |
5 | type Props = {
6 |   page: number;
7 |   query?: string | null;
8 |   sort?: string[] | null;
9 |   start?: string | null;
10 |   end?: string | null;
11 | };
12 |
13 | const pageSize = 25;
14 |
15 | export async function CustomersTable({ query, sort, start, end, page }: Props) {
16 |   const filter = {
17 |     start,
18 |     end,
19 |   };
20 |
21 |   async function loadMore({ from, to }: { from: number; to: number }) {
22 |     "use server";
23 |
24 |     return getCustomers({
25 |       to,
26 |       from: from + 1,
27 |       searchQuery: query,
28 |       sort,
29 |     });
30 |   }
31 |
32 |   const { data, meta } = await getCustomers({
33 |     searchQuery: query,
34 |     sort,
35 |     to: pageSize,
36 |   });
37 |
38 |   const hasNextPage = Boolean(
39 |     meta?.count && meta.count / (page + 1) > pageSize,
40 |   );
41 |
42 |   if (!data?.length) {
43 |     if (
44 |       query?.length ||
45 |       Object.values(filter).some((value) => value !== null)
46 |     ) {
47 |       return <NoResults />;
48 |     }
49 |
50 |     return <EmptyState />;
51 |   }
52 |
53 |   return (
54 |     <DataTable
55 |       data={data}
56 |       loadMore={loadMore}
57 |       pageSize={pageSize}
58 |       hasNextPage={hasNextPage}
59 |       page={page}
60 |     />
61 |   );
62 | }
```

apps/dashboard/src/components/tables/customers/row.tsx
```
1 | "use client";
2 |
3 | import { cn } from "@midday/ui/cn";
4 | import { TableCell, TableRow } from "@midday/ui/table";
5 | import { type Row, flexRender } from "@tanstack/react-table";
6 | import type { Customer } from "./columns";
7 |
8 | type Props = {
9 |   row: Row<Customer>;
10 |   setOpen: (id?: string) => void;
11 | };
12 |
13 | export function CustomerRow({ row, setOpen }: Props) {
14 |   return (
15 |     <>
16 |       <TableRow
17 |         className="hover:bg-transparent cursor-default h-[45px]"
18 |         key={row.id}
19 |       >
20 |         {row.getVisibleCells().map((cell, index) => (
21 |           <TableCell
22 |             key={cell.id}
23 |             onClick={() => ![3, 4, 5, 6].includes(index) && setOpen(row.id)}
24 |             className={cn(index !== 0 && "hidden md:table-cell")}
25 |           >
26 |             {flexRender(cell.column.columnDef.cell, cell.getContext())}
27 |           </TableCell>
28 |         ))}
29 |       </TableRow>
30 |     </>
31 |   );
32 | }
```

apps/dashboard/src/components/tables/customers/skeleton.tsx
```
1 | import { Skeleton } from "@midday/ui/skeleton";
2 | import { Table, TableBody, TableCell, TableRow } from "@midday/ui/table";
3 | import { TableHeader } from "./table-header";
4 |
5 | export function CustomersSkeleton() {
6 |   return (
7 |     <Table>
8 |       <TableHeader />
9 |       <TableBody>
10 |         {Array.from({ length: 25 }).map((_, index) => (
11 |           <TableRow key={index.toString()} className="h-[45px]">
12 |             <TableCell>
13 |               <Skeleton className="h-4 w-24" />
14 |             </TableCell>
15 |             <TableCell>
16 |               <Skeleton className="h-4 w-32" />
17 |             </TableCell>
18 |             <TableCell>
19 |               <Skeleton className="h-4 w-20" />
20 |             </TableCell>
21 |             <TableCell>
22 |               <Skeleton className="h-4 w-24" />
23 |             </TableCell>
24 |             <TableCell>
25 |               <Skeleton className="h-4 w-16" />
26 |             </TableCell>
27 |             <TableCell>
28 |               <Skeleton className="h-4 w-8" />
29 |             </TableCell>
30 |           </TableRow>
31 |         ))}
32 |       </TableBody>
33 |     </Table>
34 |   );
35 | }
```

apps/dashboard/src/components/tables/customers/table-header.tsx
```
1 | "use client";
2 |
3 | import { useCustomerParams } from "@/hooks/use-customer-params";
4 | import { Button } from "@midday/ui/button";
5 | import {
6 |   TableHeader as BaseTableHeader,
7 |   TableHead,
8 |   TableRow,
9 | } from "@midday/ui/table";
10 | import { ArrowDown, ArrowUp } from "lucide-react";
11 |
12 | export function TableHeader() {
13 |   const { setParams, sort } = useCustomerParams({ shallow: false });
14 |   const [column, value] = sort || [];
15 |
16 |   const createSortQuery = (name: string) => {
17 |     const [currentColumn, currentValue] = sort || [];
18 |
19 |     if (name === currentColumn) {
20 |       if (currentValue === "asc") {
21 |         setParams({ sort: [name, "desc"] });
22 |       } else if (currentValue === "desc") {
23 |         setParams({ sort: null });
24 |       } else {
25 |         setParams({ sort: [name, "asc"] });
26 |       }
27 |     } else {
28 |       setParams({ sort: [name, "asc"] });
29 |     }
30 |   };
31 |
32 |   return (
33 |     <BaseTableHeader>
34 |       <TableRow>
35 |         <TableHead>
36 |           <Button
37 |             className="p-0 hover:bg-transparent space-x-2"
38 |             variant="ghost"
39 |             onClick={() => createSortQuery("name")}
40 |           >
41 |             <span>Name</span>
42 |             {"name" === column && value === "asc" && <ArrowDown size={16} />}
43 |             {"name" === column && value === "desc" && <ArrowUp size={16} />}
44 |           </Button>
45 |         </TableHead>
46 |         <TableHead className="hidden md:table-cell">
47 |           <Button
48 |             className="p-0 hover:bg-transparent space-x-2"
49 |             variant="ghost"
50 |             onClick={() => createSortQuery("contact")}
51 |           >
52 |             <span>Contact person</span>
53 |             {"contact" === column && value === "asc" && <ArrowDown size={16} />}
54 |             {"contact" === column && value === "desc" && <ArrowUp size={16} />}
55 |           </Button>
56 |         </TableHead>
57 |         <TableHead className="hidden md:table-cell">
58 |           <Button
59 |             className="p-0 hover:bg-transparent space-x-2"
60 |             variant="ghost"
61 |             onClick={() => createSortQuery("email")}
62 |           >
63 |             <span>Email</span>
64 |             {"email" === column && value === "asc" && <ArrowDown size={16} />}
65 |             {"email" === column && value === "desc" && <ArrowUp size={16} />}
66 |           </Button>
67 |         </TableHead>
68 |         <TableHead className="w-[200px] hidden md:table-cell">
69 |           <Button
70 |             className="p-0 hover:bg-transparent space-x-2"
71 |             variant="ghost"
72 |             // onClick={() => createSortQuery("customer")}
73 |           >
74 |             <span>Invoices</span>
75 |             {"invoices" === column && value === "asc" && (
76 |               <ArrowDown size={16} />
77 |             )}
78 |             {"invoices" === column && value === "desc" && <ArrowUp size={16} />}
79 |           </Button>
80 |         </TableHead>
81 |         <TableHead className="hidden md:table-cell">
82 |           <Button
83 |             className="p-0 hover:bg-transparent space-x-2"
84 |             variant="ghost"
85 |             // onClick={() => createSortQuery("projects")}
86 |           >
87 |             <span>Projects</span>
88 |             {"projects" === column && value === "asc" && (
89 |               <ArrowDown size={16} />
90 |             )}
91 |             {"projects" === column && value === "desc" && <ArrowUp size={16} />}
92 |           </Button>
93 |         </TableHead>
94 |
95 |         <TableHead className="hidden md:table-cell">
96 |           <Button
97 |             className="p-0 hover:bg-transparent space-x-2"
98 |             variant="ghost"
99 |             onClick={() => createSortQuery("tags")}
100 |           >
101 |             <span>Tags</span>
102 |             {"tags" === column && value === "asc" && <ArrowDown size={16} />}
103 |             {"tags" === column && value === "desc" && <ArrowUp size={16} />}
104 |           </Button>
105 |         </TableHead>
106 |
107 |         <TableHead className="hidden md:table-cell">Actions</TableHead>
108 |       </TableRow>
109 |     </BaseTableHeader>
110 |   );
111 | }
```

apps/dashboard/src/components/tables/customers/table.tsx
```
1 | "use client";
2 |
3 | import { deleteCustomerAction } from "@/actions/delete-customer-action";
4 | import { useCustomerParams } from "@/hooks/use-customer-params";
5 | import { Spinner } from "@midday/ui/spinner";
6 | import { Table, TableBody } from "@midday/ui/table";
7 | import {
8 |   getCoreRowModel,
9 |   getFilteredRowModel,
10 |   useReactTable,
11 | } from "@tanstack/react-table";
12 | import { useAction } from "next-safe-action/hooks";
13 | import React, { useEffect, useState } from "react";
14 | import { useInView } from "react-intersection-observer";
15 | import { type Customer, columns } from "./columns";
16 | import { CustomerRow } from "./row";
17 | import { TableHeader } from "./table-header";
18 |
19 | type Props = {
20 |   data: Customer[];
21 |   loadMore: ({
22 |     from,
23 |     to,
24 |   }: {
25 |     from: number;
26 |     to: number;
27 |   }) => Promise<{ data: Customer[]; meta: { count: number } }>;
28 |   pageSize: number;
29 |   hasNextPage: boolean;
30 | };
31 |
32 | export function DataTable({
33 |   data: initialData,
34 |   loadMore,
35 |   pageSize,
36 |   hasNextPage: initialHasNextPage,
37 | }: Props) {
38 |   const [data, setData] = useState(initialData);
39 |   const [from, setFrom] = useState(pageSize);
40 |   const { ref, inView } = useInView();
41 |   const [hasNextPage, setHasNextPage] = useState(initialHasNextPage);
42 |   const { setParams } = useCustomerParams();
43 |
44 |   const deleteCustomer = useAction(deleteCustomerAction);
45 |
46 |   const setOpen = (id?: string) => {
47 |     if (id) {
48 |       setParams({ customerId: id });
49 |     } else {
50 |       setParams(null);
51 |     }
52 |   };
53 |
54 |   const handleDeleteCustomer = (id: string) => {
55 |     setData((prev) => {
56 |       return prev.filter((item) => item.id !== id);
57 |     });
58 |
59 |     deleteCustomer.execute({ id });
60 |   };
61 |
62 |   const table = useReactTable({
63 |     data,
64 |     getRowId: ({ id }) => id,
65 |     columns,
66 |     getCoreRowModel: getCoreRowModel(),
67 |     getFilteredRowModel: getFilteredRowModel(),
68 |     meta: {
69 |       deleteCustomer: handleDeleteCustomer,
70 |     },
71 |   });
72 |
73 |   const loadMoreData = async () => {
74 |     const formatedFrom = from;
75 |     const to = formatedFrom + pageSize * 2;
76 |
77 |     try {
78 |       const { data, meta } = await loadMore({
79 |         from: formatedFrom,
80 |         to,
81 |       });
82 |
83 |       setData((prev) => [...prev, ...data]);
84 |       setFrom(to);
85 |       setHasNextPage(meta.count > to);
86 |     } catch {
87 |       setHasNextPage(false);
88 |     }
89 |   };
90 |
91 |   useEffect(() => {
92 |     if (inView) {
93 |       loadMoreData();
94 |     }
95 |   }, [inView]);
96 |
97 |   useEffect(() => {
98 |     setData(initialData);
99 |   }, [initialData]);
100 |
101 |   return (
102 |     <div>
103 |       <Table>
104 |         <TableHeader />
105 |
106 |         <TableBody>
107 |           {table.getRowModel().rows.map((row) => (
108 |             <CustomerRow key={row.id} row={row} setOpen={setOpen} />
109 |           ))}
110 |         </TableBody>
111 |       </Table>
112 |
113 |       {hasNextPage && (
114 |         <div className="flex items-center justify-center mt-6" ref={ref}>
115 |           <div className="flex items-center space-x-2 px-6 py-5">
116 |             <Spinner />
117 |             <span className="text-sm text-[#606060]">Loading more...</span>
118 |           </div>
119 |         </div>
120 |       )}
121 |     </div>
122 |   );
123 | }
```

apps/dashboard/src/components/tables/invoices/columns.tsx
```
1 | "use client";
2 |
3 | import type { InvoiceTemplate } from "@/actions/invoice/schema";
4 | import { updateInvoiceAction } from "@/actions/invoice/update-invoice-action";
5 | import { FormatAmount } from "@/components/format-amount";
6 | import { InvoiceStatus } from "@/components/invoice-status";
7 | import { OpenURL } from "@/components/open-url";
8 | import { useInvoiceParams } from "@/hooks/use-invoice-params";
9 | import { formatDate, getDueDateStatus } from "@/utils/format";
10 | import { Avatar, AvatarFallback, AvatarImageNext } from "@midday/ui/avatar";
11 | import { Button } from "@midday/ui/button";
12 | import { cn } from "@midday/ui/cn";
13 | import {
14 |   DropdownMenu,
15 |   DropdownMenuContent,
16 |   DropdownMenuItem,
17 |   DropdownMenuTrigger,
18 | } from "@midday/ui/dropdown-menu";
19 | import { Icons } from "@midday/ui/icons";
20 | import { Tooltip, TooltipContent, TooltipTrigger } from "@midday/ui/tooltip";
21 | import { TooltipProvider } from "@midday/ui/tooltip";
22 | import { useToast } from "@midday/ui/use-toast";
23 | import { DotsHorizontalIcon } from "@radix-ui/react-icons";
24 | import type { ColumnDef } from "@tanstack/react-table";
25 | import { formatDistanceToNow } from "date-fns";
26 | import { useAction } from "next-safe-action/hooks";
27 | import * as React from "react";
28 |
29 | export type Invoice = {
30 |   id: string;
31 |   due_date: string;
32 |   issue_date?: string;
33 |   paid_at?: string;
34 |   status: string;
35 |   currency: string;
36 |   invoice_number: string;
37 |   amount?: number;
38 |   vat?: number;
39 |   tax?: number;
40 |   updated_at?: string;
41 |   viewed_at?: string;
42 |   template: InvoiceTemplate;
43 |   token: string;
44 |   sent_to?: string | null;
45 |   customer_details?: JSON;
46 |   internal_note?: string | null;
47 |   customer?: {
48 |     id: string;
49 |     name: string;
50 |     website: string;
51 |   };
52 |   // Used when relation is deleted
53 |   customer_name?: string;
54 | };
55 |
56 | export const columns: ColumnDef<Invoice>[] = [
57 |   {
58 |     header: "Invoice no.",
59 |     accessorKey: "invoice_number",
60 |     cell: ({ row }) => row.getValue("invoice_number"),
61 |   },
62 |   {
63 |     header: "Status",
64 |     accessorKey: "status",
65 |     cell: ({ row }) => <InvoiceStatus status={row.getValue("status")} />,
66 |   },
67 |   {
68 |     header: "Due date",
69 |     accessorKey: "due_date",
70 |     cell: ({ row, table }) => {
71 |       const date = row.getValue("due_date");
72 |
73 |       const showDate =
74 |         row.original.status === "unpaid" ||
75 |         row.original.status === "overdue" ||
76 |         row.original.status === "pending";
77 |
78 |       return (
79 |         <div className="flex flex-col space-y-1 w-[80px]">
80 |           <span>
81 |             {date ? formatDate(date, table.options.meta?.dateFormat) : "-"}
82 |           </span>
83 |           {showDate && (
84 |             <span className="text-xs text-muted-foreground">
85 |               {date ? getDueDateStatus(date) : "-"}
86 |             </span>
87 |           )}
88 |         </div>
89 |       );
90 |     },
91 |   },
92 |   {
93 |     header: "Customer",
94 |     accessorKey: "customer",
95 |     cell: ({ row }) => {
96 |       const customer = row.original.customer;
97 |       const name = customer?.name || row.original.customer_name;
98 |       const viewAt = row.original.viewed_at;
99 |
100 |       if (!name) return "-";
101 |
102 |       return (
103 |         <div className="flex items-center space-x-2">
104 |           <Avatar className="size-5">
105 |             {customer?.website && (
106 |               <AvatarImageNext
107 |                 src={`https://img.logo.dev/${customer?.website}?token=pk_X-1ZO13GSgeOoUrIuJ6GMQ&size=60`}
108 |                 alt={`${name} logo`}
109 |                 width={20}
110 |                 height={20}
111 |                 quality={100}
112 |               />
113 |             )}
114 |             <AvatarFallback className="text-[9px] font-medium">
115 |               {name?.[0]}
116 |             </AvatarFallback>
117 |           </Avatar>
118 |           <span className="truncate">{name}</span>
119 |
120 |           {viewAt && row.original.status !== "paid" && (
121 |             <TooltipProvider delayDuration={0}>
122 |               <Tooltip>
123 |                 <TooltipTrigger className="flex items-center space-x-2">
124 |                   <Icons.Visibility className="size-4 text-[#878787]" />
125 |                 </TooltipTrigger>
126 |                 <TooltipContent
127 |                   className="text-xs py-1 px-2"
128 |                   side="right"
129 |                   sideOffset={5}
130 |                 >
131 |                   {`Viewed ${formatDistanceToNow(viewAt)} ago`}
132 |                 </TooltipContent>
133 |               </Tooltip>
134 |             </TooltipProvider>
135 |           )}
136 |         </div>
137 |       );
138 |     },
139 |   },
140 |   {
141 |     header: "Amount",
142 |     accessorKey: "amount",
143 |     cell: ({ row }) => (
144 |       <span
145 |         className={cn({
146 |           "line-through": row.original.status === "canceled",
147 |         })}
148 |       >
149 |         <FormatAmount
150 |           amount={row.getValue("amount")}
151 |           currency={row.original.currency}
152 |         />
153 |       </span>
154 |     ),
155 |   },
156 |   {
157 |     header: "Issue date",
158 |     accessorKey: "issue_date",
159 |     cell: ({ row, table }) => {
[TRUNCATED]
```

apps/dashboard/src/components/tables/invoices/empty-states.tsx
```
1 | "use client";
2 |
3 | import { useInvoiceParams } from "@/hooks/use-invoice-params";
4 | import { Button } from "@midday/ui/button";
5 |
6 | export function EmptyState() {
7 |   const { setParams } = useInvoiceParams();
8 |
9 |   return (
10 |     <div className="flex items-center justify-center ">
11 |       <div className="flex flex-col items-center mt-40">
12 |         <div className="text-center mb-6 space-y-2">
13 |           <h2 className="font-medium text-lg">No invoices</h2>
14 |           <p className="text-[#606060] text-sm">
15 |             You haven't created any invoices yet. <br />
16 |             Go ahead and create your first one.
17 |           </p>
18 |         </div>
19 |
20 |         <Button
21 |           variant="outline"
22 |           onClick={() =>
23 |             setParams({
24 |               type: "create",
25 |             })
26 |           }
27 |         >
28 |           Create invoice
29 |         </Button>
30 |       </div>
31 |     </div>
32 |   );
33 | }
34 |
35 | export function NoResults() {
36 |   const { setParams } = useInvoiceParams();
37 |
38 |   return (
39 |     <div className="flex items-center justify-center ">
40 |       <div className="flex flex-col items-center mt-40">
41 |         <div className="text-center mb-6 space-y-2">
42 |           <h2 className="font-medium text-lg">No results</h2>
43 |           <p className="text-[#606060] text-sm">
44 |             Try another search, or adjusting the filters
45 |           </p>
46 |         </div>
47 |
48 |         <Button
49 |           variant="outline"
50 |           onClick={() => setParams(null, { shallow: false })}
51 |         >
52 |           Clear filters
53 |         </Button>
54 |       </div>
55 |     </div>
56 |   );
57 | }
```

apps/dashboard/src/components/tables/invoices/index.tsx
```
1 | import { getInvoices } from "@midday/supabase/cached-queries";
2 | import { EmptyState, NoResults } from "./empty-states";
3 | import { DataTable } from "./table";
4 |
5 | type Props = {
6 |   page: number;
7 |   query?: string | null;
8 |   sort?: string[] | null;
9 |   start?: string | null;
10 |   end?: string | null;
11 |   statuses?: string[] | null;
12 |   customers?: string[] | null;
13 | };
14 |
15 | const pageSize = 25;
16 |
17 | export async function InvoicesTable({
18 |   query,
19 |   sort,
20 |   start,
21 |   end,
22 |   statuses,
23 |   customers,
24 |   page,
25 | }: Props) {
26 |   const filter = {
27 |     start,
28 |     end,
29 |     statuses,
30 |     customers,
31 |   };
32 |
33 |   async function loadMore({ from, to }: { from: number; to: number }) {
34 |     "use server";
35 |
36 |     return getInvoices({
37 |       to,
38 |       from: from + 1,
39 |       searchQuery: query,
40 |       sort,
41 |       filter,
42 |     });
43 |   }
44 |
45 |   const { data, meta } = await getInvoices({
46 |     searchQuery: query,
47 |     sort,
48 |     filter,
49 |     to: pageSize,
50 |   });
51 |
52 |   const hasNextPage = Boolean(
53 |     meta?.count && meta.count / (page + 1) > pageSize,
54 |   );
55 |
56 |   if (!data?.length) {
57 |     if (
58 |       query?.length ||
59 |       Object.values(filter).some((value) => value !== null)
60 |     ) {
61 |       return <NoResults />;
62 |     }
63 |
64 |     return <EmptyState />;
65 |   }
66 |
67 |   return (
68 |     <DataTable
69 |       data={data}
70 |       loadMore={loadMore}
71 |       pageSize={pageSize}
72 |       hasNextPage={hasNextPage}
73 |       page={page}
74 |     />
75 |   );
76 | }
```

apps/dashboard/src/components/tables/invoices/row.tsx
```
1 | "use client";
2 |
3 | import { cn } from "@midday/ui/cn";
4 | import { TableCell, TableRow } from "@midday/ui/table";
5 | import { type Row, flexRender } from "@tanstack/react-table";
6 | import type { Invoice } from "./columns";
7 |
8 | type Props = {
9 |   row: Row<Invoice>;
10 |   setOpen: (id?: string) => void;
11 | };
12 |
13 | export function InvoiceRow({ row, setOpen }: Props) {
14 |   return (
15 |     <>
16 |       <TableRow
17 |         className="hover:bg-transparent cursor-default h-[57px] cursor-pointer"
18 |         key={row.id}
19 |       >
20 |         {row.getVisibleCells().map((cell, index) => (
21 |           <TableCell
22 |             key={cell.id}
23 |             className={cn(
24 |               index === 2 && "w-[50px]",
25 |               (cell.column.id === "actions" ||
26 |                 cell.column.id === "recurring" ||
27 |                 cell.column.id === "invoice_number" ||
28 |                 cell.column.id === "issue_date") &&
29 |                 "hidden md:table-cell",
30 |             )}
31 |             onClick={() =>
32 |               index !== row.getVisibleCells().length - 1 && setOpen(row.id)
33 |             }
34 |           >
35 |             {flexRender(cell.column.columnDef.cell, cell.getContext())}
36 |           </TableCell>
37 |         ))}
38 |       </TableRow>
39 |     </>
40 |   );
41 | }
```

apps/dashboard/src/components/tables/invoices/skeleton.tsx
```
1 | import { Skeleton } from "@midday/ui/skeleton";
2 | import { Table, TableBody, TableCell, TableRow } from "@midday/ui/table";
3 | import { TableHeader } from "./table-header";
4 |
5 | export function InvoiceSkeleton() {
6 |   return (
7 |     <Table>
8 |       <TableHeader />
9 |       <TableBody>
10 |         {Array.from({ length: 25 }).map((_, index) => (
11 |           <TableRow key={index.toString()} className="h-[57px]">
12 |             <TableCell>
13 |               <Skeleton className="h-4 w-24" />
14 |             </TableCell>
15 |             <TableCell>
16 |               <Skeleton className="h-4 w-32" />
17 |             </TableCell>
18 |             <TableCell>
19 |               <Skeleton className="h-4 w-20" />
20 |             </TableCell>
21 |             <TableCell>
22 |               <Skeleton className="h-4 w-24" />
23 |             </TableCell>
24 |             <TableCell>
25 |               <Skeleton className="h-4 w-16" />
26 |             </TableCell>
27 |             <TableCell>
28 |               <Skeleton className="h-4 w-8" />
29 |             </TableCell>
30 |           </TableRow>
31 |         ))}
32 |       </TableBody>
33 |     </Table>
34 |   );
35 | }
```

apps/dashboard/src/components/tables/invoices/table-header.tsx
```
1 | "use client";
2 |
3 | import { useInvoiceParams } from "@/hooks/use-invoice-params";
4 | import { Button } from "@midday/ui/button";
5 | import {
6 |   TableHeader as BaseTableHeader,
7 |   TableHead,
8 |   TableRow,
9 | } from "@midday/ui/table";
10 | import { ArrowDown, ArrowUp } from "lucide-react";
11 |
12 | export function TableHeader() {
13 |   const { setParams, sort } = useInvoiceParams({ shallow: false });
14 |   const [column, value] = sort || [];
15 |
16 |   const createSortQuery = (name: string) => {
17 |     const [currentColumn, currentValue] = sort || [];
18 |
19 |     if (name === currentColumn) {
20 |       if (currentValue === "asc") {
21 |         setParams({ sort: [name, "desc"] });
22 |       } else if (currentValue === "desc") {
23 |         setParams({ sort: null });
24 |       } else {
25 |         setParams({ sort: [name, "asc"] });
26 |       }
27 |     } else {
28 |       setParams({ sort: [name, "asc"] });
29 |     }
30 |   };
31 |
32 |   return (
33 |     <BaseTableHeader>
34 |       <TableRow>
35 |         <TableHead className="hidden md:table-cell">
36 |           <Button
37 |             className="p-0 hover:bg-transparent space-x-2"
38 |             variant="ghost"
39 |             onClick={() => createSortQuery("invoice_number")}
40 |           >
41 |             <span>Invoice no.</span>
42 |             {"invoice_number" === column && value === "asc" && (
43 |               <ArrowDown size={16} />
44 |             )}
45 |             {"invoice_number" === column && value === "desc" && (
46 |               <ArrowUp size={16} />
47 |             )}
48 |           </Button>
49 |         </TableHead>
50 |         <TableHead>
51 |           <Button
52 |             className="p-0 hover:bg-transparent space-x-2"
53 |             variant="ghost"
54 |             onClick={() => createSortQuery("status")}
55 |           >
56 |             <span>Status</span>
57 |             {"status" === column && value === "asc" && <ArrowDown size={16} />}
58 |             {"status" === column && value === "desc" && <ArrowUp size={16} />}
59 |           </Button>
60 |         </TableHead>
61 |         <TableHead>
62 |           <Button
63 |             className="p-0 hover:bg-transparent space-x-2"
64 |             variant="ghost"
65 |             onClick={() => createSortQuery("due_date")}
66 |           >
67 |             <span>Due Date</span>
68 |             {"due_date" === column && value === "asc" && (
69 |               <ArrowDown size={16} />
70 |             )}
71 |             {"due_date" === column && value === "desc" && <ArrowUp size={16} />}
72 |           </Button>
73 |         </TableHead>
74 |         <TableHead className="w-[200px]">
75 |           <Button
76 |             className="p-0 hover:bg-transparent space-x-2"
77 |             variant="ghost"
78 |             onClick={() => createSortQuery("customer")}
79 |           >
80 |             <span>Customer</span>
81 |             {"customer" === column && value === "asc" && (
82 |               <ArrowDown size={16} />
83 |             )}
84 |             {"customer" === column && value === "desc" && <ArrowUp size={16} />}
85 |           </Button>
86 |         </TableHead>
87 |         <TableHead>
88 |           <Button
89 |             className="p-0 hover:bg-transparent space-x-2"
90 |             variant="ghost"
91 |             onClick={() => createSortQuery("amount")}
92 |           >
93 |             <span>Amount</span>
94 |             {"amount" === column && value === "asc" && <ArrowDown size={16} />}
95 |             {"amount" === column && value === "desc" && <ArrowUp size={16} />}
96 |           </Button>
97 |         </TableHead>
98 |
99 |         <TableHead className="hidden md:table-cell">
100 |           <Button
101 |             className="p-0 hover:bg-transparent space-x-2"
102 |             variant="ghost"
103 |             onClick={() => createSortQuery("issue_date")}
104 |           >
105 |             <span>Issue Date</span>
106 |             {"issue_date" === column && value === "asc" && (
107 |               <ArrowDown size={16} />
108 |             )}
109 |             {"issue_date" === column && value === "desc" && (
110 |               <ArrowUp size={16} />
111 |             )}
112 |           </Button>
113 |         </TableHead>
114 |         <TableHead className="hidden md:table-cell">
115 |           <Button
116 |             className="p-0 hover:bg-transparent space-x-2"
117 |             variant="ghost"
118 |             onClick={() => createSortQuery("recurring")}
119 |           >
120 |             <span>Recurring</span>
121 |             {"recurring" === column && value === "asc" && (
122 |               <ArrowDown size={16} />
123 |             )}
124 |             {"recurring" === column && value === "desc" && (
125 |               <ArrowUp size={16} />
126 |             )}
127 |           </Button>
128 |         </TableHead>
129 |         <TableHead className="hidden md:table-cell">Actions</TableHead>
130 |       </TableRow>
131 |     </BaseTableHeader>
132 |   );
133 | }
```

apps/dashboard/src/components/tables/invoices/table.tsx
```
1 | "use client";
2 |
3 | import { deleteInvoiceAction } from "@/actions/invoice/delete-invoice-action";
4 | import { InvoiceDetailsSheet } from "@/components/sheets/invoice-details-sheet";
5 | import { useInvoiceParams } from "@/hooks/use-invoice-params";
6 | import { useUserContext } from "@/store/user/hook";
7 | import { Spinner } from "@midday/ui/spinner";
8 | import { Table, TableBody } from "@midday/ui/table";
9 | import {
10 |   getCoreRowModel,
11 |   getFilteredRowModel,
12 |   useReactTable,
13 | } from "@tanstack/react-table";
14 | import { useAction } from "next-safe-action/hooks";
15 | import React, { useEffect, useState } from "react";
16 | import { useInView } from "react-intersection-observer";
17 | import { type Invoice, columns } from "./columns";
18 | import { InvoiceRow } from "./row";
19 | import { TableHeader } from "./table-header";
20 |
21 | type Props = {
22 |   data: Invoice[];
23 |   loadMore: ({
24 |     from,
25 |     to,
26 |   }: {
27 |     from: number;
28 |     to: number;
29 |   }) => Promise<{ data: Invoice[]; meta: { count: number } }>;
30 |   pageSize: number;
31 |   hasNextPage: boolean;
32 | };
33 |
34 | export function DataTable({
35 |   data: initialData,
36 |   loadMore,
37 |   pageSize,
38 |   hasNextPage: initialHasNextPage,
39 | }: Props) {
40 |   const [data, setData] = useState(initialData);
41 |   const [from, setFrom] = useState(pageSize);
42 |   const { ref, inView } = useInView();
43 |   const [hasNextPage, setHasNextPage] = useState(initialHasNextPage);
44 |   const { setParams, invoiceId, type } = useInvoiceParams();
45 |
46 |   const deleteInvoice = useAction(deleteInvoiceAction);
47 |   const { date_format: dateFormat } = useUserContext((state) => state.data);
48 |
49 |   const selectedInvoice = data.find((invoice) => invoice?.id === invoiceId);
50 |
51 |   const setOpen = (id?: string) => {
52 |     if (id) {
53 |       setParams({ type: "details", invoiceId: id });
54 |     } else {
55 |       setParams(null);
56 |     }
57 |   };
58 |
59 |   const handleDeleteInvoice = (id: string) => {
60 |     setData((prev) => {
61 |       return prev.filter((item) => item.id !== id);
62 |     });
63 |
64 |     deleteInvoice.execute({ id });
65 |   };
66 |
67 |   const table = useReactTable({
68 |     data,
69 |     getRowId: ({ id }) => id,
70 |     columns,
71 |     getCoreRowModel: getCoreRowModel(),
72 |     getFilteredRowModel: getFilteredRowModel(),
73 |     meta: {
74 |       deleteInvoice: handleDeleteInvoice,
75 |       dateFormat,
76 |     },
77 |   });
78 |
79 |   const loadMoreData = async () => {
80 |     const formatedFrom = from;
81 |     const to = formatedFrom + pageSize * 2;
82 |
83 |     try {
84 |       const { data, meta } = await loadMore({
85 |         from: formatedFrom,
86 |         to,
87 |       });
88 |
89 |       setData((prev) => [...prev, ...data]);
90 |       setFrom(to);
91 |       setHasNextPage(meta.count > to);
92 |     } catch {
93 |       setHasNextPage(false);
94 |     }
95 |   };
96 |
97 |   useEffect(() => {
98 |     if (inView) {
99 |       loadMoreData();
100 |     }
101 |   }, [inView]);
102 |
103 |   useEffect(() => {
104 |     setData(initialData);
105 |   }, [initialData]);
106 |
107 |   return (
108 |     <div>
109 |       <Table>
110 |         <TableHeader />
111 |
112 |         <TableBody>
113 |           {table.getRowModel().rows.map((row) => (
114 |             <InvoiceRow key={row.id} row={row} setOpen={setOpen} />
115 |           ))}
116 |         </TableBody>
117 |       </Table>
118 |
119 |       {hasNextPage && (
120 |         <div className="flex items-center justify-center mt-6" ref={ref}>
121 |           <div className="flex items-center space-x-2 px-6 py-5">
122 |             <Spinner />
123 |             <span className="text-sm text-[#606060]">Loading more...</span>
124 |           </div>
125 |         </div>
126 |       )}
127 |
128 |       <InvoiceDetailsSheet
129 |         data={selectedInvoice}
130 |         isOpen={type === "details" && !!invoiceId}
131 |         setOpen={setOpen}
132 |       />
133 |     </div>
134 |   );
135 | }
```

apps/dashboard/src/components/tables/members/columns.tsx
```
1 | import { changeUserRoleAction } from "@/actions/change-user-role-action";
2 | import { deleteTeamMemberAction } from "@/actions/delete-team-member-action";
3 | import { leaveTeamAction } from "@/actions/leave-team-action";
4 | import { useI18n } from "@/locales/client";
5 | import {
6 |   AlertDialog,
7 |   AlertDialogAction,
8 |   AlertDialogCancel,
9 |   AlertDialogContent,
10 |   AlertDialogDescription,
11 |   AlertDialogFooter,
12 |   AlertDialogHeader,
13 |   AlertDialogTitle,
14 |   AlertDialogTrigger,
15 | } from "@midday/ui/alert-dialog";
16 | import { Avatar, AvatarFallback, AvatarImageNext } from "@midday/ui/avatar";
17 | import { Button } from "@midday/ui/button";
18 | import {
19 |   DropdownMenu,
20 |   DropdownMenuContent,
21 |   DropdownMenuItem,
22 |   DropdownMenuTrigger,
23 | } from "@midday/ui/dropdown-menu";
24 | import {
25 |   Select,
26 |   SelectContent,
27 |   SelectItem,
28 |   SelectTrigger,
29 |   SelectValue,
30 | } from "@midday/ui/select";
31 | import { useToast } from "@midday/ui/use-toast";
32 | import type { ColumnDef } from "@tanstack/react-table";
33 | import { MoreHorizontal } from "lucide-react";
34 | import { Loader2 } from "lucide-react";
35 | import { useAction } from "next-safe-action/hooks";
36 | import { useRouter } from "next/navigation";
37 |
38 | export const columns: ColumnDef[] = [
39 |   {
40 |     id: "member",
41 |     accessorKey: "user.full_name",
42 |     cell: ({ row }) => {
43 |       return (
44 |         <div>
45 |           <div className="flex items-center space-x-4">
46 |             <Avatar className="rounded-full w-8 h-8">
47 |               <AvatarImageNext
48 |                 src={row.original.user?.avatar_url}
49 |                 alt={row.original.user?.full_name ?? ""}
50 |                 width={32}
51 |                 height={32}
52 |               />
53 |               <AvatarFallback>
54 |                 <span className="text-xs">
55 |                   {row.original.user.full_name?.charAt(0)?.toUpperCase()}
56 |                 </span>
57 |               </AvatarFallback>
58 |             </Avatar>
59 |             <div className="flex flex-col">
60 |               <span className="font-medium text-sm">
61 |                 {row.original.user.full_name}
62 |               </span>
63 |               <span className="text-sm text-[#606060]">
64 |                 {row.original.user.email}
65 |               </span>
66 |             </div>
67 |           </div>
68 |         </div>
69 |       );
70 |     },
71 |   },
72 |   {
73 |     id: "actions",
74 |     cell: ({ row, table }) => {
75 |       const t = useI18n();
76 |       const router = useRouter();
77 |       const { toast } = useToast();
78 |
79 |       const changeUserRole = useAction(changeUserRoleAction, {
80 |         onSuccess: () => {
81 |           toast({
82 |             title: "Team role has been updated.",
83 |             duration: 3500,
84 |             variant: "success",
85 |           });
86 |         },
87 |         onError: () => {
88 |           toast({
89 |             duration: 3500,
90 |             variant: "error",
91 |             title: "Something went wrong please try again.",
92 |           });
93 |         },
94 |       });
95 |
96 |       const deleteTeamMember = useAction(deleteTeamMemberAction, {
97 |         onSuccess: () => {
98 |           toast({
99 |             title: "Team member removed.",
100 |             duration: 3500,
101 |             variant: "success",
102 |           });
103 |         },
104 |         onError: () => {
105 |           toast({
106 |             duration: 3500,
107 |             variant: "error",
108 |             title: "Something went wrong please try again.",
109 |           });
110 |         },
111 |       });
112 |
113 |       const leaveTeam = useAction(leaveTeamAction, {
114 |         onSuccess: () => router.push("/teams"),
115 |         onError: () => {
116 |           toast({
117 |             duration: 3500,
118 |             variant: "error",
119 |             title:
120 |               "You cannot leave since you are the only remaining owner of the team. Delete this team instead.",
121 |           });
122 |         },
123 |       });
124 |
125 |       return (
126 |         <div className="flex justify-end">
127 |           <div className="flex space-x-2 items-center">
128 |             {(table.options.meta.currentUser.role === "owner" &&
129 |               table.options.meta.currentUser.user.id !==
130 |                 row.original.user.id) ||
131 |             (table.options.meta.currentUser.role === "owner" &&
132 |               table.options.meta.totalOwners > 1) ? (
133 |               <Select
134 |                 value={row.original.role}
135 |                 onValueChange={(role) => {
136 |                   changeUserRole.execute({
137 |                     userId: row.original.user.id,
138 |                     teamId: row.original.team_id,
139 |                     role,
140 |                     revalidatePath: "/settings/members",
141 |                   });
142 |                 }}
143 |               >
144 |                 <SelectTrigger>
145 |                   <SelectValue placeholder={t(`roles.${row.original.role}`)} />
146 |                 </SelectTrigger>
147 |                 <SelectContent>
148 |                   <SelectItem value="owner">Owner</SelectItem>
149 |                   <SelectItem value="member">Member</SelectItem>
150 |                 </SelectContent>
151 |               </Select>
152 |             ) : (
153 |               <span className="text-sm text-[#606060]">
154 |                 {t(`roles.${row.original.role}`)}
155 |               </span>
156 |             )}
157 |
158 |             {table.options.meta.currentUser.role === "owner" && (
159 |               <DropdownMenu>
160 |                 <DropdownMenuTrigger asChild>
161 |                   <Button variant="ghost" className="h-8 w-8 p-0">
162 |                     <MoreHorizontal className="h-4 w-4" />
163 |                   </Button>
164 |                 </DropdownMenuTrigger>
165 |                 <DropdownMenuContent align="end">
[TRUNCATED]
```

apps/dashboard/src/components/tables/members/index.tsx
```
1 | import { getTeamUser } from "@midday/supabase/cached-queries";
2 | import { getTeamMembersQuery } from "@midday/supabase/queries";
3 | import { createClient } from "@midday/supabase/server";
4 | import { DataTable } from "./table";
5 |
6 | export async function MembersTable() {
7 |   const supabase = createClient();
8 |   const user = await getTeamUser();
9 |   const teamMembers = await getTeamMembersQuery(supabase, user.data.team_id);
10 |
11 |   return <DataTable data={teamMembers?.data} currentUser={user?.data} />;
12 | }
```

apps/dashboard/src/components/tables/members/table.tsx
```
1 | "use client";
2 |
3 | import { changeUserRoleAction } from "@/actions/change-user-role-action";
4 | import { deleteTeamMemberAction } from "@/actions/delete-team-member-action";
5 | import { leaveTeamAction } from "@/actions/leave-team-action";
6 | import { InviteTeamMembersModal } from "@/components/modals/invite-team-members-modal";
7 | import { useI18n } from "@/locales/client";
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
19 | import { Avatar, AvatarFallback, AvatarImageNext } from "@midday/ui/avatar";
20 | import { Button } from "@midday/ui/button";
21 | import { cn } from "@midday/ui/cn";
22 | import { Dialog } from "@midday/ui/dialog";
23 | import {
24 |   DropdownMenu,
25 |   DropdownMenuContent,
26 |   DropdownMenuItem,
27 |   DropdownMenuTrigger,
28 | } from "@midday/ui/dropdown-menu";
29 | import { Input } from "@midday/ui/input";
30 | import {
31 |   Select,
32 |   SelectContent,
33 |   SelectItem,
34 |   SelectTrigger,
35 |   SelectValue,
36 | } from "@midday/ui/select";
37 | import { Table, TableBody, TableCell, TableRow } from "@midday/ui/table";
38 | import { useToast } from "@midday/ui/use-toast";
39 | import {
40 |   type ColumnDef,
41 |   flexRender,
42 |   getCoreRowModel,
43 |   useReactTable,
44 | } from "@tanstack/react-table";
45 | import { MoreHorizontal } from "lucide-react";
46 | import { Loader2 } from "lucide-react";
47 | import { useAction } from "next-safe-action/hooks";
48 | import { useRouter } from "next/navigation";
49 | import * as React from "react";
50 |
51 | export const columns: ColumnDef[] = [
52 |   {
53 |     id: "member",
54 |     accessorKey: "user.full_name",
55 |     header: () => "Select all",
56 |     cell: ({ row }) => {
57 |       return (
58 |         <div>
59 |           <div className="flex items-center space-x-4">
60 |             <Avatar className="rounded-full w-8 h-8">
61 |               <AvatarImageNext
62 |                 src={row.original.user?.avatar_url}
63 |                 alt={row.original.user?.full_name ?? ""}
64 |                 width={32}
65 |                 height={32}
66 |               />
67 |               <AvatarFallback>
68 |                 <span className="text-xs">
69 |                   {row.original.user?.full_name?.charAt(0)?.toUpperCase()}
70 |                 </span>
71 |               </AvatarFallback>
72 |             </Avatar>
73 |             <div className="flex flex-col">
74 |               <span className="font-medium text-sm">
75 |                 {row.original.user?.full_name}
76 |               </span>
77 |               <span className="text-sm text-[#606060]">
78 |                 {row.original.user?.email}
79 |               </span>
80 |             </div>
81 |           </div>
82 |         </div>
83 |       );
84 |     },
85 |   },
86 |   {
87 |     id: "actions",
88 |     cell: ({ row, table }) => {
89 |       const t = useI18n();
90 |       const router = useRouter();
91 |       const { toast } = useToast();
92 |
93 |       const changeUserRole = useAction(changeUserRoleAction, {
94 |         onSuccess: () =>
95 |           toast({
96 |             title: "Team role has been updated.",
97 |             duration: 3500,
98 |             variant: "success",
99 |           }),
100 |         onError: () => {
101 |           toast({
102 |             duration: 3500,
103 |             variant: "error",
104 |             title: "Something went wrong please try again.",
105 |           });
106 |         },
107 |       });
108 |
109 |       const deleteTeamMember = useAction(deleteTeamMemberAction, {
110 |         onSuccess: () =>
111 |           toast({
112 |             title: "Team member removed.",
113 |             duration: 3500,
114 |             variant: "success",
115 |           }),
116 |         onError: () => {
117 |           toast({
118 |             duration: 3500,
119 |             variant: "error",
120 |             title: "Something went wrong please try again.",
121 |           });
122 |         },
123 |       });
124 |
125 |       const leaveTeam = useAction(leaveTeamAction, {
126 |         onSuccess: () => router.push("/teams"),
127 |         onError: () => {
128 |           toast({
129 |             duration: 3500,
130 |             variant: "error",
131 |             title:
132 |               "You cannot leave since you are the only remaining owner of the team. Delete this team instead.",
133 |           });
134 |         },
135 |       });
136 |
137 |       return (
138 |         <div className="flex justify-end">
139 |           <div className="flex space-x-2 items-center">
140 |             {(table.options.meta.currentUser.role === "owner" &&
141 |               table.options.meta.currentUser.user.id !==
142 |                 row.original.user?.id) ||
143 |             (table.options.meta.currentUser.role === "owner" &&
144 |               table.options.meta.totalOwners > 1) ? (
145 |               <Select
146 |                 value={row.original.role}
147 |                 onValueChange={(role) => {
148 |                   changeUserRole.execute({
149 |                     userId: row.original.user?.id,
150 |                     teamId: row.original.team_id,
151 |                     role,
152 |                     revalidatePath: "/settings/members",
153 |                   });
154 |                 }}
155 |               >
156 |                 <SelectTrigger>
157 |                   <SelectValue placeholder={t(`roles.${row.original.role}`)} />
158 |                 </SelectTrigger>
159 |                 <SelectContent>
160 |                   <SelectItem value="owner">Owner</SelectItem>
161 |                   <SelectItem value="member">Member</SelectItem>
162 |                 </SelectContent>
163 |               </Select>
164 |             ) : (
[TRUNCATED]
```

apps/dashboard/src/components/tables/pending-invites/index.tsx
```
1 | import { getTeamUser } from "@midday/supabase/cached-queries";
2 | import { getTeamInvitesQuery } from "@midday/supabase/queries";
3 | import { createClient } from "@midday/supabase/server";
4 | import { DataTable } from "./table";
5 |
6 | export async function PendingInvitesTable() {
7 |   const supabase = createClient();
8 |   const user = await getTeamUser();
9 |   const teamInvites = await getTeamInvitesQuery(supabase, user.data.team_id);
10 |
11 |   return <DataTable data={teamInvites?.data} currentUser={user?.data} />;
12 | }
```

apps/dashboard/src/components/tables/pending-invites/table.tsx
```
1 | "use client";
2 |
3 | import { deleteInviteAction } from "@/actions/delete-invite-action";
4 | import { InviteTeamMembersModal } from "@/components/modals/invite-team-members-modal";
5 | import { useI18n } from "@/locales/client";
6 | import { Avatar, AvatarFallback } from "@midday/ui/avatar";
7 | import { Button } from "@midday/ui/button";
8 | import { cn } from "@midday/ui/cn";
9 | import { Dialog } from "@midday/ui/dialog";
10 | import {
11 |   DropdownMenu,
12 |   DropdownMenuContent,
13 |   DropdownMenuItem,
14 |   DropdownMenuTrigger,
15 | } from "@midday/ui/dropdown-menu";
16 | import { Input } from "@midday/ui/input";
17 | import { Skeleton } from "@midday/ui/skeleton";
18 | import { Table, TableBody, TableCell, TableRow } from "@midday/ui/table";
19 | import { useToast } from "@midday/ui/use-toast";
20 | import {
21 |   type ColumnDef,
22 |   flexRender,
23 |   getCoreRowModel,
24 |   useReactTable,
25 | } from "@tanstack/react-table";
26 | import { MoreHorizontal } from "lucide-react";
27 | import { useAction } from "next-safe-action/hooks";
28 | import * as React from "react";
29 |
30 | export type Payment = {
31 |   id: string;
32 |   amount: number;
33 |   status: "pending" | "processing" | "success" | "failed";
34 |   email: string;
35 | };
36 |
37 | export const columns: ColumnDef<Payment>[] = [
38 |   {
39 |     id: "member",
40 |     accessorKey: "user.full_name",
41 |     header: () => "Select all",
42 |     cell: ({ row }) => {
43 |       return (
44 |         <div className="flex items-center space-x-4">
45 |           <Avatar className="rounded-full w-8 h-8">
46 |             <AvatarFallback>
47 |               <span className="text-xs">P</span>
48 |             </AvatarFallback>
49 |           </Avatar>
50 |           <div className="flex flex-col">
51 |             <span className="font-medium text-sm">Pending Invitation</span>
52 |             <span className="text-sm text-[#606060]">{row.original.email}</span>
53 |           </div>
54 |         </div>
55 |       );
56 |     },
57 |   },
58 |   {
59 |     id: "actions",
60 |     cell: ({ row, table }) => {
61 |       const t = useI18n();
62 |       const { toast } = useToast();
63 |
64 |       const deleteInvite = useAction(deleteInviteAction, {
65 |         onSuccess: () => {
66 |           toast({
67 |             title: "Team invite removed.",
68 |             duration: 3500,
69 |             variant: "success",
70 |           });
71 |         },
72 |         onError: () => {
73 |           toast({
74 |             duration: 3500,
75 |             variant: "error",
76 |             title: "Something went wrong please try again.",
77 |           });
78 |         },
79 |       });
80 |
81 |       return (
82 |         <div className="flex justify-end">
83 |           <div className="flex space-x-2 items-center">
84 |             <span className="text-[#606060]">
85 |               {t(`roles.${row.original.role}`)}
86 |             </span>
87 |             {table.options.meta.currentUser.role === "owner" && (
88 |               <DropdownMenu>
89 |                 <DropdownMenuTrigger asChild>
90 |                   <Button variant="ghost" className="h-8 w-8 p-0">
91 |                     <span className="sr-only">Open menu</span>
92 |                     <MoreHorizontal className="h-4 w-4" />
93 |                   </Button>
94 |                 </DropdownMenuTrigger>
95 |                 <DropdownMenuContent align="end">
96 |                   <DropdownMenuItem
97 |                     className="text-destructive"
98 |                     onClick={() =>
99 |                       deleteInvite.execute({
100 |                         id: row.original.id,
101 |                         revalidatePath: "settings/members",
102 |                       })
103 |                     }
104 |                   >
105 |                     Remove
106 |                   </DropdownMenuItem>
107 |                 </DropdownMenuContent>
108 |               </DropdownMenu>
109 |             )}
110 |           </div>
111 |         </div>
112 |       );
113 |     },
114 |     meta: {
115 |       className: "text-right",
116 |     },
117 |   },
118 | ];
119 |
120 | export function PendingInvitesSkeleton() {
121 |   return (
122 |     <div className="w-full">
123 |       <DataTableHeader />
124 |
125 |       <Table>
126 |         <TableBody>
127 |           {[...Array(6)].map((_, index) => (
128 |             <TableRow key={index.toString()} className="hover:bg-transparent">
129 |               <TableCell className="border-r-[0px] py-4">
130 |                 <div className="flex items-center space-x-4">
131 |                   <Skeleton className="rounded-full w-8 h-8" />
132 |
133 |                   <div className="flex flex-col space-y-2">
134 |                     <Skeleton className="w-[200px] h-3" />
135 |                     <Skeleton className="w-[150px] h-2" />
136 |                   </div>
137 |                 </div>
138 |               </TableCell>
139 |             </TableRow>
140 |           ))}
141 |         </TableBody>
142 |       </Table>
143 |     </div>
144 |   );
145 | }
146 |
147 | export function DataTableHeader({ table }) {
148 |   const [isOpen, onOpenChange] = React.useState(false);
149 |
150 |   return (
151 |     <div className="flex items-center pb-4 space-x-4">
152 |       <Input
153 |         className="flex-1"
154 |         placeholder="Search..."
155 |         value={(table?.getColumn("member")?.getFilterValue() as string) ?? ""}
156 |         onChange={(event) =>
157 |           table?.getColumn("member")?.setFilterValue(event.target.value)
158 |         }
159 |         autoComplete="off"
160 |         autoCapitalize="none"
[TRUNCATED]
```

apps/dashboard/src/components/tables/select-team/table.tsx
```
1 | "use client";
2 |
3 | import { changeTeamAction } from "@/actions/change-team-action";
4 | import { Avatar, AvatarFallback, AvatarImageNext } from "@midday/ui/avatar";
5 | import { Button } from "@midday/ui/button";
6 | import { Table, TableBody, TableCell, TableRow } from "@midday/ui/table";
7 | import { useAction } from "next-safe-action/hooks";
8 |
9 | export function SelectTeamTable({ data }) {
10 |   const changeTeam = useAction(changeTeamAction);
11 |
12 |   return (
13 |     <Table>
14 |       <TableBody>
15 |         {data.map((row) => (
16 |           <TableRow key={row.id} className="hover:bg-transparent">
17 |             <TableCell className="border-r-[0px] py-4">
18 |               <div className="flex items-center space-x-4">
19 |                 <Avatar className="rounded-full w-8 h-8">
20 |                   <AvatarImageNext
21 |                     src={row.team?.logo_url}
22 |                     alt={row.team?.name ?? ""}
23 |                     width={32}
24 |                     height={32}
25 |                   />
26 |                   <AvatarFallback>
27 |                     <span className="text-xs">
28 |                       {row.team.name?.charAt(0)?.toUpperCase()}
29 |                     </span>
30 |                   </AvatarFallback>
31 |                 </Avatar>
32 |                 <div className="flex flex-col">
33 |                   <span className="font-medium text-sm">{row.team.name}</span>
34 |                 </div>
35 |               </div>
36 |             </TableCell>
37 |             <TableCell>
38 |               <div className="flex justify-end">
39 |                 <div className="flex space-x-3 items-center">
40 |                   <Button
41 |                     variant="outline"
42 |                     onClick={() =>
43 |                       changeTeam.execute({
44 |                         teamId: row.team.id,
45 |                         redirectTo: "/",
46 |                       })
47 |                     }
48 |                   >
49 |                     Launch
50 |                   </Button>
51 |                 </div>
52 |               </div>
53 |             </TableCell>
54 |           </TableRow>
55 |         ))}
56 |       </TableBody>
57 |     </Table>
58 |   );
59 | }
```

apps/dashboard/src/components/tables/teams/index.tsx
```
1 | import { getUser } from "@midday/supabase/cached-queries";
2 | import {
3 |   getTeamsByUserIdQuery,
4 |   getUserInvitesQuery,
5 | } from "@midday/supabase/queries";
6 | import { createClient } from "@midday/supabase/server";
7 | import { DataTable } from "./table";
8 |
9 | export async function TeamsTable() {
10 |   const supabase = createClient();
11 |   const user = await getUser();
12 |
13 |   const [teams, invites] = await Promise.all([
14 |     getTeamsByUserIdQuery(supabase, user.data?.id),
15 |     getUserInvitesQuery(supabase, user.data?.email),
16 |   ]);
17 |
18 |   return (
19 |     <DataTable
20 |       data={[
21 |         ...teams?.data,
22 |         ...invites?.data?.map((invite) => ({ ...invite, isInvite: true })),
23 |       ]}
24 |     />
25 |   );
26 | }
```

apps/dashboard/src/components/tables/teams/table.tsx
```
1 | "use client";
2 |
3 | import { acceptInviteAction } from "@/actions/accept-invite-action";
4 | import { changeTeamAction } from "@/actions/change-team-action";
5 | import { declineInviteAction } from "@/actions/decline-invite-action";
6 | import { leaveTeamAction } from "@/actions/leave-team-action";
7 | import { CreateTeamModal } from "@/components/modals/create-team-modal";
8 | import { useI18n } from "@/locales/client";
9 | import {
10 |   AlertDialog,
11 |   AlertDialogAction,
12 |   AlertDialogCancel,
13 |   AlertDialogContent,
14 |   AlertDialogDescription,
15 |   AlertDialogFooter,
16 |   AlertDialogHeader,
17 |   AlertDialogTitle,
18 |   AlertDialogTrigger,
19 | } from "@midday/ui/alert-dialog";
20 | import { Avatar, AvatarFallback, AvatarImageNext } from "@midday/ui/avatar";
21 | import { Button } from "@midday/ui/button";
22 | import { cn } from "@midday/ui/cn";
23 | import { Dialog, DialogTrigger } from "@midday/ui/dialog";
24 | import {
25 |   DropdownMenu,
26 |   DropdownMenuContent,
27 |   DropdownMenuItem,
28 |   DropdownMenuTrigger,
29 | } from "@midday/ui/dropdown-menu";
30 | import { Input } from "@midday/ui/input";
31 | import { Skeleton } from "@midday/ui/skeleton";
32 | import { Table, TableBody, TableCell, TableRow } from "@midday/ui/table";
33 | import { useToast } from "@midday/ui/use-toast";
34 | import {
35 |   type ColumnDef,
36 |   flexRender,
37 |   getCoreRowModel,
38 |   useReactTable,
39 | } from "@tanstack/react-table";
40 | import { MoreHorizontal } from "lucide-react";
41 | import { Loader2 } from "lucide-react";
42 | import { useAction } from "next-safe-action/hooks";
43 | import * as React from "react";
44 |
45 | export type Payment = {
46 |   id: string;
47 |   amount: number;
48 |   status: "pending" | "processing" | "success" | "failed";
49 |   email: string;
50 | };
51 |
52 | export const columns: ColumnDef<Payment>[] = [
53 |   {
54 |     id: "team",
55 |     accessorKey: "team.name",
56 |     cell: ({ row }) => {
57 |       const t = useI18n();
58 |
59 |       return (
60 |         <div className="flex items-center space-x-4">
61 |           <Avatar className="rounded-full w-8 h-8">
62 |             <AvatarImageNext
63 |               src={row.original.team?.logo_url}
64 |               alt={row.original.team?.name ?? ""}
65 |               width={32}
66 |               height={32}
67 |             />
68 |             <AvatarFallback>
69 |               <span className="text-xs">
70 |                 {row.original.team.name?.charAt(0)?.toUpperCase()}
71 |               </span>
72 |             </AvatarFallback>
73 |           </Avatar>
74 |           <div className="flex flex-col">
75 |             <span className="font-medium text-sm">
76 |               {row.original.team.name}
77 |             </span>
78 |             <span className="text-sm text-[#606060]">
79 |               {t(`roles.${row.original.role}`)}
80 |             </span>
81 |           </div>
82 |         </div>
83 |       );
84 |     },
85 |   },
86 |   {
87 |     id: "actions",
88 |     cell: ({ row }) => {
89 |       const { toast } = useToast();
90 |       const manageTeam = useAction(changeTeamAction);
91 |       const viewTeam = useAction(changeTeamAction);
92 |
93 |       const leaveTeam = useAction(leaveTeamAction, {
94 |         onError: () => {
95 |           toast({
96 |             duration: 3500,
97 |             variant: "error",
98 |             title:
99 |               "You cannot leave since you are the only remaining owner of the team. Delete this team instead.",
100 |           });
101 |         },
102 |       });
103 |
104 |       const declineInvite = useAction(declineInviteAction);
105 |       const acceptInvite = useAction(acceptInviteAction);
106 |
107 |       if (row.original.isInvite) {
108 |         return (
109 |           <div className="flex justify-end">
110 |             <div className="flex space-x-3 items-center">
111 |               <Button
112 |                 variant="outline"
113 |                 onClick={() =>
114 |                   declineInvite.execute({
115 |                     id: row.original.id,
116 |                     revalidatePath: "/account/teams",
117 |                   })
118 |                 }
119 |               >
120 |                 Decline
121 |               </Button>
122 |
123 |               <Button
124 |                 variant="outline"
125 |                 onClick={() =>
126 |                   acceptInvite.execute({
127 |                     id: row.original.id,
128 |                     revalidatePath: "/account/teams",
129 |                   })
130 |                 }
131 |               >
132 |                 Accept
133 |               </Button>
134 |             </div>
135 |           </div>
136 |         );
137 |       }
138 |
139 |       return (
140 |         <div className="flex justify-end">
141 |           <div className="flex space-x-3 items-center">
142 |             <Button
143 |               variant="outline"
144 |               onClick={() =>
145 |                 viewTeam.execute({
146 |                   teamId: row.original.team.id,
147 |                   redirectTo: "/",
148 |                 })
149 |               }
150 |             >
151 |               View
152 |             </Button>
153 |             {row.original.role === "owner" && (
154 |               <Button
155 |                 variant="outline"
156 |                 onClick={() =>
157 |                   manageTeam.execute({
158 |                     teamId: row.original.team.id,
159 |                     redirectTo: "/settings",
160 |                   })
161 |                 }
162 |               >
163 |                 Manage
164 |               </Button>
165 |             )}
166 |
167 |             <DropdownMenu>
168 |               <DropdownMenuTrigger asChild>
169 |                 <Button variant="ghost" className="h-8 w-8 p-0">
170 |                   <MoreHorizontal className="h-4 w-4" />
[TRUNCATED]
```

apps/dashboard/src/components/tables/tracker/data-table-header.tsx
```
1 | "use client";
2 |
3 | import { Button } from "@midday/ui/button";
4 | import { TableHead, TableHeader, TableRow } from "@midday/ui/table";
5 | import { ArrowDown, ArrowUp } from "lucide-react";
6 | import { usePathname, useRouter, useSearchParams } from "next/navigation";
7 | import { useCallback } from "react";
8 |
9 | export function DataTableHeader() {
10 |   const searchParams = useSearchParams();
11 |   const pathname = usePathname();
12 |   const router = useRouter();
13 |   const [column, value] = searchParams.get("sort")
14 |     ? searchParams.get("sort")?.split(":")
15 |     : [];
16 |
17 |   const createSortQuery = useCallback(
18 |     (name: string) => {
19 |       const params = new URLSearchParams(searchParams);
20 |       const prevSort = params.get("sort");
21 |
22 |       if (`${name}:asc` === prevSort) {
23 |         params.set("sort", `${name}:desc`);
24 |       } else if (`${name}:desc` === prevSort) {
25 |         params.delete("sort");
26 |       } else {
27 |         params.set("sort", `${name}:asc`);
28 |       }
29 |
30 |       router.replace(`${pathname}?${params.toString()}`);
31 |     },
32 |     [searchParams, router, pathname],
33 |   );
34 |
35 |   return (
36 |     <TableHeader>
37 |       <TableRow className="h-[45px]">
38 |         <TableHead className="w-[320px]">
39 |           <Button
40 |             className="p-0 hover:bg-transparent space-x-2"
41 |             variant="ghost"
42 |             onClick={() => createSortQuery("name")}
43 |           >
44 |             <span>Project</span>
45 |             {"name" === column && value === "asc" && <ArrowDown size={16} />}
46 |             {"name" === column && value === "desc" && <ArrowUp size={16} />}
47 |           </Button>
48 |         </TableHead>
49 |         <TableHead className="w-[180px]">
50 |           <Button
51 |             className="p-0 hover:bg-transparent space-x-2"
52 |             variant="ghost"
53 |             onClick={() => createSortQuery("customer")}
54 |           >
55 |             <span>Customer</span>
56 |             {"customer" === column && value === "asc" && (
57 |               <ArrowDown size={16} />
58 |             )}
59 |             {"customer" === column && value === "desc" && <ArrowUp size={16} />}
60 |           </Button>
61 |         </TableHead>
62 |
63 |         <TableHead className="w-[180px]">
64 |           <Button
65 |             className="p-0 hover:bg-transparent space-x-2"
66 |             variant="ghost"
67 |             onClick={() => createSortQuery("time")}
68 |           >
69 |             <span>Total Time</span>
70 |             {"time" === column && value === "asc" && <ArrowDown size={16} />}
71 |             {"time" === column && value === "desc" && <ArrowUp size={16} />}
72 |           </Button>
73 |         </TableHead>
74 |         <TableHead className="w-[160px]">
75 |           <Button
76 |             className="p-0 hover:bg-transparent space-x-2"
77 |             variant="ghost"
78 |             onClick={() => createSortQuery("amount")}
79 |           >
80 |             <span>Total Amount</span>
81 |             {"amount" === column && value === "asc" && <ArrowDown size={16} />}
82 |             {"amount" === column && value === "desc" && <ArrowUp size={16} />}
83 |           </Button>
84 |         </TableHead>
85 |         <TableHead className="w-[330px]">
86 |           <Button
87 |             className="p-0 hover:bg-transparent space-x-2"
88 |             variant="ghost"
89 |             onClick={() => createSortQuery("description")}
90 |           >
91 |             <span className="line-clamp-1 text-ellipsis">Description</span>
92 |             {"description" === column && value === "asc" && (
93 |               <ArrowDown size={16} />
94 |             )}
95 |             {"description" === column && value === "desc" && (
96 |               <ArrowUp size={16} />
97 |             )}
98 |           </Button>
99 |         </TableHead>
100 |
101 |         <TableHead className="min-w-[170px]">
102 |           <Button
103 |             className="p-0 hover:bg-transparent space-x-2"
104 |             variant="ghost"
105 |             onClick={() => createSortQuery("tags")}
106 |           >
107 |             <span>Tags</span>
108 |             {"tags" === column && value === "asc" && <ArrowDown size={16} />}
109 |             {"tags" === column && value === "desc" && <ArrowUp size={16} />}
110 |           </Button>
111 |         </TableHead>
112 |
113 |         <TableHead className="w-[140px]">
114 |           <Button
115 |             className="p-0 hover:bg-transparent space-x-2"
116 |             variant="ghost"
117 |             onClick={() => createSortQuery("assigned")}
118 |           >
119 |             <span>Assigned</span>
120 |             {"assigned" === column && value === "asc" && (
121 |               <ArrowDown size={16} />
122 |             )}
123 |             {"assigned" === column && value === "desc" && <ArrowUp size={16} />}
124 |           </Button>
125 |         </TableHead>
126 |         <TableHead className="w-[170px]">
127 |           <Button
128 |             className="p-0 hover:bg-transparent space-x-2"
129 |             variant="ghost"
130 |             onClick={() => createSortQuery("status")}
131 |           >
132 |             <span>Status</span>
133 |             {"status" === column && value === "asc" && <ArrowDown size={16} />}
134 |             {"status" === column && value === "desc" && <ArrowUp size={16} />}
135 |           </Button>
136 |         </TableHead>
137 |       </TableRow>
138 |     </TableHeader>
139 |   );
140 | }
```

apps/dashboard/src/components/tables/tracker/data-table-row.tsx
```
1 | "use client";
2 |
3 | import { deleteProjectAction } from "@/actions/project/delete-project-action";
4 | import { TrackerExportCSV } from "@/components/tracker-export-csv";
5 | import { TrackerStatus } from "@/components/tracker-status";
6 | import { useInvoiceParams } from "@/hooks/use-invoice-params";
7 | import { useTrackerParams } from "@/hooks/use-tracker-params";
8 | import { useUserContext } from "@/store/user/hook";
9 | import { formatAmount, secondsToHoursAndMinutes } from "@/utils/format";
10 | import {
11 |   AlertDialog,
12 |   AlertDialogAction,
13 |   AlertDialogCancel,
14 |   AlertDialogContent,
15 |   AlertDialogDescription,
16 |   AlertDialogFooter,
17 |   AlertDialogHeader,
18 |   AlertDialogTitle,
19 |   AlertDialogTrigger,
20 | } from "@midday/ui/alert-dialog";
21 | import { Avatar, AvatarFallback, AvatarImageNext } from "@midday/ui/avatar";
22 | import { Badge } from "@midday/ui/badge";
23 | import {
24 |   DropdownMenu,
25 |   DropdownMenuContent,
26 |   DropdownMenuItem,
27 |   DropdownMenuSeparator,
28 |   DropdownMenuTrigger,
29 | } from "@midday/ui/dropdown-menu";
30 | import { Icons } from "@midday/ui/icons";
31 | import { ScrollArea, ScrollBar } from "@midday/ui/scroll-area";
32 | import { TableCell, TableRow } from "@midday/ui/table";
33 | import { useToast } from "@midday/ui/use-toast";
34 | import { useAction } from "next-safe-action/hooks";
35 | import Link from "next/link";
36 | import type { TrackerProject } from "./data-table";
37 |
38 | type DataTableCellProps = {
39 |   children: React.ReactNode;
40 |   className?: string;
41 |   onClick?: () => void;
42 | };
43 |
44 | export function DataTableCell({
45 |   children,
46 |   className,
47 |   onClick,
48 | }: DataTableCellProps) {
49 |   return (
50 |     <TableCell className={className} onClick={onClick}>
51 |       {children}
52 |     </TableCell>
53 |   );
54 | }
55 |
56 | type RowProps = {
57 |   children: React.ReactNode;
58 | };
59 |
60 | export function Row({ children }: RowProps) {
61 |   return <TableRow className="h-[45px]">{children}</TableRow>;
62 | }
63 |
64 | type DataTableRowProps = {
65 |   row: TrackerProject;
66 |   userId: string;
67 | };
68 |
69 | export function DataTableRow({ row, userId }: DataTableRowProps) {
70 |   const { toast } = useToast();
71 |   const { setParams } = useTrackerParams();
72 |   const { setParams: setInvoiceParams } = useInvoiceParams();
73 |   const { locale } = useUserContext((state) => state.data);
74 |
75 |   const deleteAction = useAction(deleteProjectAction, {
76 |     onError: () => {
77 |       toast({
78 |         duration: 2500,
79 |         variant: "error",
80 |         title: "Something went wrong please try again.",
81 |       });
82 |     },
83 |   });
84 |
85 |   const onClick = () => {
86 |     setParams({
87 |       projectId: row.id,
88 |       update: true,
89 |     });
90 |   };
91 |
92 |   return (
93 |     <AlertDialog>
94 |       <DropdownMenu>
95 |         <Row>
96 |           <DataTableCell onClick={onClick} className="cursor-pointer">
97 |             {row.name}
98 |           </DataTableCell>
99 |           <DataTableCell onClick={onClick} className="cursor-pointer">
100 |             {row.customer ? (
101 |               <div className="flex items-center space-x-2">
102 |                 <Avatar className="size-5">
103 |                   {row.customer?.website && (
104 |                     <AvatarImageNext
105 |                       src={`https://img.logo.dev/${row.customer?.website}?token=pk_X-1ZO13GSgeOoUrIuJ6GMQ&size=60`}
106 |                       alt={`${row.customer?.name} logo`}
107 |                       width={20}
108 |                       height={20}
109 |                       quality={100}
110 |                     />
111 |                   )}
112 |                   <AvatarFallback className="text-[9px] font-medium">
113 |                     {row.customer?.name?.[0]}
114 |                   </AvatarFallback>
115 |                 </Avatar>
116 |                 <span className="truncate">{row.customer?.name}</span>
117 |               </div>
118 |             ) : (
119 |               "-"
120 |             )}
121 |           </DataTableCell>
122 |
123 |           <DataTableCell onClick={onClick} className="cursor-pointer">
124 |             <span className="text-sm">
125 |               {row.estimate
126 |                 ? `${secondsToHoursAndMinutes(row.total_duration)} / ${secondsToHoursAndMinutes(row.estimate * 3600)}`
127 |                 : secondsToHoursAndMinutes(row?.total_duration)}
128 |             </span>
129 |           </DataTableCell>
130 |           <DataTableCell onClick={onClick} className="cursor-pointer">
131 |             <span className="text-sm">
132 |               {formatAmount({
133 |                 currency: row.currency,
134 |                 amount: row.total_amount,
135 |                 minimumFractionDigits: 0,
136 |                 maximumFractionDigits: 0,
137 |                 locale,
138 |               })}
139 |             </span>
140 |           </DataTableCell>
141 |           <DataTableCell onClick={onClick} className="cursor-pointer">
142 |             {row.description}
143 |           </DataTableCell>
144 |           <DataTableCell>
145 |             <div className="relative">
146 |               <ScrollArea className="w-[170px] whitespace-nowrap">
147 |                 <div className="flex items-center space-x-2">
148 |                   {row.tags?.map((tag) => (
149 |                     <Link
150 |                       href={`/transactions?tags=${tag.tag.id}`}
151 |                       key={tag.id}
152 |                     >
153 |                       <Badge variant="tag" className="whitespace-nowrap">
154 |                         {tag.tag.name}
155 |                       </Badge>
156 |                     </Link>
157 |                   ))}
158 |                 </div>
159 |
160 |                 <ScrollBar orientation="horizontal" />
161 |               </ScrollArea>
162 |
[TRUNCATED]
```

apps/dashboard/src/components/tables/tracker/data-table.tsx
```
1 | "use client";
2 |
3 | import { Button } from "@midday/ui/button";
4 | import { Spinner } from "@midday/ui/spinner";
5 | import { Table, TableBody } from "@midday/ui/table";
6 | import { useEffect, useState } from "react";
7 | import { useInView } from "react-intersection-observer";
8 | import { DataTableHeader } from "./data-table-header";
9 | import { DataTableRow } from "./data-table-row";
10 |
11 | export type TrackerProject = {
12 |   id: string;
13 |   name: string;
14 |   description: string;
15 |   status: "active" | "completed";
16 |   total_duration: number;
17 |   estimate?: number;
18 |   rate?: number;
19 |   currency?: string;
20 |   customer?: {
21 |     id: string;
22 |     name: string;
23 |     website: string;
24 |   };
25 |   users: {
26 |     id: string;
27 |     full_name: string;
28 |     avatar_url?: string;
29 |   }[];
30 | };
31 |
32 | type DataTableProps = {
33 |   data: TrackerProject[];
34 |   pageSize: number;
35 |   userId: string;
36 |   meta: {
37 |     count: number;
38 |   };
39 |   loadMore: (params: { from: number; to: number }) => Promise<{
40 |     data: TrackerProject[];
41 |     meta: { count: number };
42 |   }>;
43 | };
44 |
45 | export function DataTable({
46 |   data: initialData,
47 |   pageSize,
48 |   meta,
49 |   loadMore,
50 |   userId,
51 | }: DataTableProps) {
52 |   const [data, setData] = useState(initialData);
53 |   const [from, setFrom] = useState(pageSize);
54 |   const { ref, inView } = useInView();
55 |   const [hasNextPage, setHasNextPage] = useState(meta.count > pageSize);
56 |
57 |   useEffect(() => {
58 |     if (inView) {
59 |       loadMoreData();
60 |     }
61 |   }, [inView]);
62 |
63 |   useEffect(() => {
64 |     setData(initialData);
65 |   }, [initialData]);
66 |
67 |   const loadMoreData = async () => {
68 |     const formatedFrom = from;
69 |     const to = formatedFrom + pageSize;
70 |
71 |     try {
72 |       const { data, meta } = await loadMore({
73 |         from: formatedFrom,
74 |         to,
75 |       });
76 |
77 |       setData((prev) => [...prev, ...data]);
78 |       setFrom(to);
79 |       setHasNextPage(meta.count > to);
80 |     } catch {
81 |       setHasNextPage(false);
82 |     }
83 |   };
84 |
85 |   return (
86 |     <>
87 |       <Table>
88 |         <DataTableHeader />
89 |
90 |         <TableBody>
91 |           {data.map((row) => (
92 |             <DataTableRow row={row} key={row.id} userId={userId} />
93 |           ))}
94 |         </TableBody>
95 |       </Table>
96 |
97 |       {hasNextPage && (
98 |         <div className="flex items-center justify-center mt-6" ref={ref}>
99 |           <Button variant="outline" className="space-x-2 px-6 py-5">
100 |             <Spinner />
101 |             <span className="text-sm text-[#606060]">Loading more...</span>
102 |           </Button>
103 |         </div>
104 |       )}
105 |     </>
106 |   );
107 | }
```

apps/dashboard/src/components/tables/tracker/empty-states.tsx
```
1 | "use client";
2 |
3 | import { useTrackerParams } from "@/hooks/use-tracker-params";
4 | import { Button } from "@midday/ui/button";
5 |
6 | export function EmptyState() {
7 |   const { setParams } = useTrackerParams();
8 |
9 |   return (
10 |     <div className="flex items-center justify-center ">
11 |       <div className="flex flex-col items-center mt-14">
12 |         <div className="text-center mb-6 space-y-2">
13 |           <h2 className="font-medium text-lg">No projects</h2>
14 |           <p className="text-[#606060] text-sm">
15 |             You haven't created any projects yet. <br />
16 |             Go ahead and create your first one.
17 |           </p>
18 |         </div>
19 |
20 |         <Button
21 |           variant="outline"
22 |           onClick={() =>
23 |             setParams({
24 |               create: true,
25 |             })
26 |           }
27 |         >
28 |           Create project
29 |         </Button>
30 |       </div>
31 |     </div>
32 |   );
33 | }
34 |
35 | export function NoResults() {
36 |   const { setParams } = useTrackerParams();
37 |
38 |   return (
39 |     <div className="flex items-center justify-center ">
40 |       <div className="flex flex-col items-center mt-14">
41 |         <div className="text-center mb-6 space-y-2">
42 |           <h2 className="font-medium text-lg">No results</h2>
43 |           <p className="text-[#606060] text-sm">
44 |             Try another search, or adjusting the filters
45 |           </p>
46 |         </div>
47 |
48 |         <Button
49 |           variant="outline"
50 |           onClick={() => setParams(null, { shallow: false })}
51 |         >
52 |           Clear filters
53 |         </Button>
54 |       </div>
55 |     </div>
56 |   );
57 | }
```

apps/dashboard/src/components/tables/tracker/index.tsx
```
1 | import { DataTable } from "@/components/tables/tracker/data-table";
2 | import { getTrackerProjects } from "@midday/supabase/cached-queries";
3 | import { EmptyState, NoResults } from "./empty-states";
4 |
5 | const pageSize = 20;
6 |
7 | type Props = {
8 |   status?: string;
9 |   sort?: string;
10 |   q?: string;
11 |   start?: string;
12 |   end?: string;
13 |   userId: string;
14 |   customerIds?: string[];
15 | };
16 |
17 | export async function Table({
18 |   status,
19 |   sort,
20 |   q,
21 |   start,
22 |   end,
23 |   userId,
24 |   customerIds,
25 | }: Props) {
26 |   const hasFilters = Boolean(status || q);
27 |
28 |   const { data, meta } = await getTrackerProjects({
29 |     from: 0,
30 |     to: pageSize,
31 |     sort,
32 |     start,
33 |     end,
34 |     filter: { status, customers: customerIds },
35 |     search: {
36 |       query: q,
37 |       fuzzy: true,
38 |     },
39 |   });
40 |
41 |   async function loadMore({ from, to }) {
42 |     "use server";
43 |
44 |     return getTrackerProjects({
45 |       to,
46 |       from: from + 1,
47 |       sort,
48 |       filter: {
49 |         status,
50 |         customers: customerIds,
51 |       },
52 |       search: {
53 |         query: q,
54 |         fuzzy: true,
55 |       },
56 |     });
57 |   }
58 |
59 |   if (!data?.length && !hasFilters) {
60 |     return <EmptyState />;
61 |   }
62 |
63 |   if (!data?.length && hasFilters) {
64 |     return <NoResults />;
65 |   }
66 |
67 |   return (
68 |     <DataTable
69 |       data={data}
70 |       pageSize={pageSize}
71 |       loadMore={loadMore}
72 |       meta={meta}
73 |       userId={userId}
74 |     />
75 |   );
76 | }
```

apps/dashboard/src/components/tables/tracker/loading.tsx
```
1 | "use client";
2 | import { Skeleton } from "@midday/ui/skeleton";
3 | import { Table, TableBody, TableCell, TableRow } from "@midday/ui/table";
4 | import { DataTableHeader } from "./data-table-header";
5 |
6 | const data = [...Array(10)].map((_, i) => ({ id: i.toString() }));
7 |
8 | export function Loading() {
9 |   return (
10 |     <Table>
11 |       <DataTableHeader />
12 |
13 |       <TableBody>
14 |         {data?.map((row) => (
15 |           <TableRow key={row.id} className="h-[45px]">
16 |             <TableCell className="w-[440px]">
17 |               <Skeleton className="h-3.5 w-[305px]" />
18 |             </TableCell>
19 |
20 |             <TableCell className="w-[140px]">
21 |               <Skeleton className="h-3.5 w-[60%]" />
22 |             </TableCell>
23 |             <TableCell className="w-[430px]">
24 |               <Skeleton className="h-3.5 w-[50%]" />
25 |             </TableCell>
26 |
27 |             <TableCell>
28 |               <Skeleton className="h-3.5 w-[50%]" />
29 |             </TableCell>
30 |           </TableRow>
31 |         ))}
32 |       </TableBody>
33 |     </Table>
34 |   );
35 | }
```

apps/dashboard/src/components/tables/transactions/bottom-bar.tsx
```
1 | "use client";
2 |
3 | import { useI18n } from "@/locales/client";
4 | import { useUserContext } from "@/store/user/hook";
5 | import { formatAmount } from "@/utils/format";
6 | import { Icons } from "@midday/ui/icons";
7 | import {
8 |   Tooltip,
9 |   TooltipContent,
10 |   TooltipProvider,
11 |   TooltipTrigger,
12 | } from "@midday/ui/tooltip";
13 | import { AnimatePresence, motion } from "framer-motion";
14 |
15 | type Props = {
16 |   count: number;
17 |   show: boolean;
18 |   totalAmount?: {
19 |     amount: number;
20 |     currency: string;
21 |   }[];
22 | };
23 |
24 | export function BottomBar({ count, show, totalAmount }: Props) {
25 |   const { locale } = useUserContext((state) => state.data);
26 |   const multiCurrency = totalAmount && totalAmount.length > 1;
27 |   const t = useI18n();
28 |   const first = totalAmount && totalAmount.at(0);
29 |
30 |   const amountPerCurrency =
31 |     totalAmount &&
32 |     totalAmount
33 |       .map((total) =>
34 |         formatAmount({
35 |           amount: total?.amount,
36 |           currency: total.currency,
37 |           locale,
38 |         }),
39 |       )
40 |       .join(", ");
41 |
42 |   return (
43 |     <AnimatePresence>
44 |       <motion.div
45 |         className="h-12 fixed bottom-2 left-0 right-0 pointer-events-none flex justify-center"
46 |         animate={{ y: show ? 0 : 100 }}
47 |         initial={{ y: 100 }}
48 |       >
49 |         <div className="pointer-events-auto backdrop-filter backdrop-blur-lg dark:bg-[#1A1A1A]/80 bg-[#F6F6F3]/80 h-12 justify-between items-center flex px-4 border dark:border-[#2C2C2C] border-[#DCDAD2] rounded-full space-x-2">
50 |           <TooltipProvider delayDuration={0}>
51 |             <Tooltip>
52 |               <TooltipTrigger className="flex items-center space-x-2">
53 |                 <Icons.Info className="text-[#606060]" />
54 |                 <span className="text-sm">
55 |                   {multiCurrency
56 |                     ? t("bottom_bar.multi_currency")
57 |                     : first &&
58 |                       formatAmount({
59 |                         amount: first?.amount,
60 |                         currency: first?.currency,
61 |                         locale,
62 |                         maximumFractionDigits: 0,
63 |                         minimumFractionDigits: 0,
64 |                       })}
65 |                 </span>
66 |               </TooltipTrigger>
67 |               <TooltipContent sideOffset={30} className="px-3 py-1.5 text-xs">
68 |                 {multiCurrency
69 |                   ? amountPerCurrency
70 |                   : t("bottom_bar.description")}
71 |               </TooltipContent>
72 |             </Tooltip>
73 |           </TooltipProvider>
74 |
75 |           <span className="text-sm text-[#878787]">
76 |             ({t("bottom_bar.transactions", { count })})
77 |           </span>
78 |         </div>
79 |       </motion.div>
80 |     </AnimatePresence>
81 |   );
82 | }
```

apps/dashboard/src/components/tables/transactions/columns.tsx
```
1 | "use client";
2 |
3 | import { AssignedUser } from "@/components/assigned-user";
4 | import { Category } from "@/components/category";
5 | import { FormatAmount } from "@/components/format-amount";
6 | import { TransactionBankAccount } from "@/components/transaction-bank-account";
7 | import { TransactionMethod } from "@/components/transaction-method";
8 | import { TransactionStatus } from "@/components/transaction-status";
9 | import { formatDate } from "@/utils/format";
10 | import {
11 |   AlertDialog,
12 |   AlertDialogAction,
13 |   AlertDialogCancel,
14 |   AlertDialogContent,
15 |   AlertDialogDescription,
16 |   AlertDialogFooter,
17 |   AlertDialogHeader,
18 |   AlertDialogTitle,
19 |   AlertDialogTrigger,
20 | } from "@midday/ui/alert-dialog";
21 | import { Badge } from "@midday/ui/badge";
22 | import { Button } from "@midday/ui/button";
23 | import { Checkbox } from "@midday/ui/checkbox";
24 | import { cn } from "@midday/ui/cn";
25 | import {
26 |   DropdownMenu,
27 |   DropdownMenuContent,
28 |   DropdownMenuItem,
29 |   DropdownMenuSeparator,
30 |   DropdownMenuTrigger,
31 | } from "@midday/ui/dropdown-menu";
32 | import { Icons } from "@midday/ui/icons";
33 | import { ScrollArea, ScrollBar } from "@midday/ui/scroll-area";
34 | import {
35 |   Tooltip,
36 |   TooltipContent,
37 |   TooltipProvider,
38 |   TooltipTrigger,
39 | } from "@midday/ui/tooltip";
40 | import type { ColumnDef } from "@tanstack/react-table";
41 | import { Loader2 } from "lucide-react";
42 |
43 | export type Transaction = {
44 |   id: string;
45 |   amount: number;
46 |   status: "posted" | "excluded" | "included" | "pending" | "completed";
47 |   frequency?: string;
48 |   recurring?: boolean;
49 |   manual?: boolean;
50 |   date: string;
51 |   category?: {
52 |     slug: string;
53 |     name: string;
54 |     color: string;
55 |   };
56 |   name: string;
57 |   description?: string;
58 |   currency: string;
59 |   method: string;
60 |   attachments?: {
61 |     id: string;
62 |     path: string;
63 |     name: string;
64 |     type: string;
65 |     size: number;
66 |   }[];
67 |   assigned?: {
68 |     avatar_url: string;
69 |     full_name: string;
70 |   };
71 |   bank_account?: {
72 |     name: string;
73 |     bank_connection: {
74 |       logo_url: string;
75 |     };
76 |   };
77 |   tags?: {
78 |     id: string;
79 |     name: string;
80 |   }[];
81 | };
82 |
83 | export const columns: ColumnDef<Transaction>[] = [
84 |   {
85 |     id: "select",
86 |     cell: ({ row }) => (
87 |       <Checkbox
88 |         checked={row.getIsSelected()}
89 |         onCheckedChange={(value) => row.toggleSelected(!!value)}
90 |       />
91 |     ),
92 |     enableSorting: false,
93 |     enableHiding: false,
94 |   },
95 |   {
96 |     accessorKey: "date",
97 |     header: "Date",
98 |     cell: ({ row, table }) => {
99 |       return formatDate(row.original.date, table.options.meta?.dateFormat);
100 |     },
101 |   },
102 |   {
103 |     accessorKey: "description",
104 |     header: "Description",
105 |     cell: ({ row }) => {
106 |       return (
107 |         <div className="flex items-center space-x-2">
108 |           <TooltipProvider delayDuration={20}>
109 |             <Tooltip>
110 |               <TooltipTrigger asChild>
111 |                 <span
112 |                   className={cn(
113 |                     row.original?.category?.slug === "income" &&
114 |                       "text-[#00C969]",
115 |                   )}
116 |                 >
117 |                   <div className="flex space-x-2 items-center">
118 |                     <span className="line-clamp-1 text-ellipsis max-w-[100px] md:max-w-none">
119 |                       {row.original.name}
120 |                     </span>
121 |
122 |                     {row.original.status === "pending" && (
123 |                       <div className="flex space-x-1 items-center border rounded-md text-[10px] py-1 px-2 h-[22px] text-[#878787]">
124 |                         <span>Pending</span>
125 |                       </div>
126 |                     )}
127 |                   </div>
128 |                 </span>
129 |               </TooltipTrigger>
130 |
131 |               {row.original?.description && (
132 |                 <TooltipContent
133 |                   className="px-3 py-1.5 text-xs max-w-[380px]"
134 |                   side="left"
135 |                   sideOffset={10}
136 |                 >
137 |                   {row.original.description}
138 |                 </TooltipContent>
139 |               )}
140 |             </Tooltip>
141 |           </TooltipProvider>
142 |         </div>
143 |       );
144 |     },
145 |   },
146 |   {
147 |     accessorKey: "amount",
148 |     header: "Amount",
149 |     cell: ({ row }) => {
150 |       return (
151 |         <span
152 |           className={cn(
153 |             "text-sm",
154 |             row.original?.category?.slug === "income" && "text-[#00C969]",
155 |           )}
156 |         >
157 |           <FormatAmount
158 |             amount={row.original.amount}
159 |             currency={row.original.currency}
160 |           />
161 |         </span>
162 |       );
163 |     },
164 |   },
165 |   {
166 |     accessorKey: "category",
167 |     header: "Category",
168 |     cell: ({ row }) => {
169 |       return (
170 |         <Category
171 |           name={row.original?.category?.name}
172 |           color={row.original?.category?.color}
173 |         />
174 |       );
175 |     },
176 |   },
177 |   {
178 |     accessorKey: "tags",
179 |     header: "Tags",
180 |     cell: ({ row }) => {
181 |       return (
182 |         <div className="relative">
183 |           <ScrollArea className="max-w-[170px] whitespace-nowrap">
[TRUNCATED]
```

apps/dashboard/src/components/tables/transactions/data-table-header.tsx
```
1 | "use client";
2 |
3 | import { Button } from "@midday/ui/button";
4 | import { Checkbox } from "@midday/ui/checkbox";
5 | import { TableHead, TableHeader, TableRow } from "@midday/ui/table";
6 | import { ArrowDown, ArrowUp } from "lucide-react";
7 | import { usePathname, useRouter, useSearchParams } from "next/navigation";
8 | import { useCallback } from "react";
9 |
10 | type Props = {
11 |   table?: any;
12 |   loading?: boolean;
13 | };
14 |
15 | export function DataTableHeader({ table, loading }: Props) {
16 |   const searchParams = useSearchParams();
17 |   const pathname = usePathname();
18 |   const router = useRouter();
19 |   const [column, value] = searchParams.get("sort")
20 |     ? searchParams.get("sort")?.split(":")
21 |     : [];
22 |
23 |   const createSortQuery = useCallback(
24 |     (name: string) => {
25 |       const params = new URLSearchParams(searchParams);
26 |       const prevSort = params.get("sort");
27 |
28 |       if (`${name}:asc` === prevSort) {
29 |         params.set("sort", `${name}:desc`);
30 |       } else if (`${name}:desc` === prevSort) {
31 |         params.delete("sort");
32 |       } else {
33 |         params.set("sort", `${name}:asc`);
34 |       }
35 |
36 |       router.replace(`${pathname}?${params.toString()}`);
37 |     },
38 |     [searchParams, router, pathname],
39 |   );
40 |
41 |   const isVisible = (id) =>
42 |     loading ||
43 |     table
44 |       ?.getAllLeafColumns()
45 |       .find((col) => col.id === id)
46 |       .getIsVisible();
47 |
48 |   return (
49 |     <TableHeader>
50 |       <TableRow className="h-[45px] hover:bg-transparent">
51 |         <TableHead className="min-w-[50px] hidden md:table-cell px-3 md:px-4 py-2">
52 |           <Checkbox
53 |             checked={
54 |               table?.getIsAllPageRowsSelected() ||
55 |               (table?.getIsSomePageRowsSelected() && "indeterminate")
56 |             }
57 |             onCheckedChange={(value) =>
58 |               table.toggleAllPageRowsSelected(!!value)
59 |             }
60 |           />
61 |         </TableHead>
62 |
63 |         {isVisible("date") && (
64 |           <TableHead className="min-w-[120px] px-3 md:px-4 py-2">
65 |             <Button
66 |               className="p-0 hover:bg-transparent space-x-2"
67 |               variant="ghost"
68 |               onClick={() => createSortQuery("date")}
69 |             >
70 |               <span>Date</span>
71 |               {"date" === column && value === "asc" && <ArrowDown size={16} />}
72 |               {"date" === column && value === "desc" && <ArrowUp size={16} />}
73 |             </Button>
74 |           </TableHead>
75 |         )}
76 |
77 |         {isVisible("description") && (
78 |           <TableHead className="w-[100px] md:w-[320px] px-3 md:px-4 py-2">
79 |             <Button
80 |               className="p-0 hover:bg-transparent space-x-2"
81 |               variant="ghost"
82 |               onClick={() => createSortQuery("name")}
83 |             >
84 |               <span>Description</span>
85 |               {"name" === column && value === "asc" && <ArrowDown size={16} />}
86 |               {"name" === column && value === "desc" && <ArrowUp size={16} />}
87 |             </Button>
88 |           </TableHead>
89 |         )}
90 |
91 |         {isVisible("amount") && (
92 |           <TableHead className="md:min-w-[200px] px-3 md:px-4 py-2">
93 |             <Button
94 |               className="p-0 hover:bg-transparent space-x-2"
95 |               variant="ghost"
96 |               onClick={() => createSortQuery("amount")}
97 |             >
98 |               <span>Amount</span>
99 |               {"amount" === column && value === "asc" && (
100 |                 <ArrowDown size={16} />
101 |               )}
102 |               {"amount" === column && value === "desc" && <ArrowUp size={16} />}
103 |             </Button>
104 |           </TableHead>
105 |         )}
106 |
107 |         {isVisible("category") && (
108 |           <TableHead className="md:min-w-[200px] hidden md:table-cell px-3 md:px-4 py-2">
109 |             <Button
110 |               className="p-0 hover:bg-transparent space-x-2"
111 |               variant="ghost"
112 |               onClick={() => createSortQuery("category")}
113 |             >
114 |               <span>Category</span>
115 |               {"category" === column && value === "asc" && (
116 |                 <ArrowDown size={16} />
117 |               )}
118 |               {"category" === column && value === "desc" && (
119 |                 <ArrowUp size={16} />
120 |               )}
121 |             </Button>
122 |           </TableHead>
123 |         )}
124 |
125 |         {isVisible("tags") && (
126 |           <TableHead className="md:min-w-[170px] hidden md:table-cell px-3 md:px-4 py-2">
127 |             <Button
128 |               className="p-0 hover:bg-transparent space-x-2"
129 |               variant="ghost"
130 |               onClick={() => createSortQuery("tags")}
131 |             >
132 |               <span>Tags</span>
133 |             </Button>
134 |           </TableHead>
135 |         )}
136 |
137 |         {isVisible("bank_account") && (
138 |           <TableHead className="md:w-[250px] hidden md:table-cell px-3 md:px-4 py-2">
139 |             <Button
140 |               className="p-0 hover:bg-transparent space-x-2"
141 |               variant="ghost"
142 |               onClick={() => createSortQuery("bank_account")}
143 |             >
144 |               <span>Account</span>
145 |               {"bank_account" === column && value === "asc" && (
[TRUNCATED]
```

apps/dashboard/src/components/tables/transactions/data-table.tsx
```
1 | "use client";
2 |
3 | import { deleteTransactionsAction } from "@/actions/delete-transactions-action";
4 | import type { UpdateTransactionValues } from "@/actions/schema";
5 | import { updateColumnVisibilityAction } from "@/actions/update-column-visibility-action";
6 | import { updateTransactionAction } from "@/actions/update-transaction-action";
7 | import { TransactionSheet } from "@/components/sheets/transaction-sheet";
8 | import { useTransactionsStore } from "@/store/transactions";
9 | import { useUserContext } from "@/store/user/hook";
10 | import { Cookies } from "@/utils/constants";
11 | import { Button } from "@midday/ui/button";
12 | import { cn } from "@midday/ui/cn";
13 | import { Spinner } from "@midday/ui/spinner";
14 | import { Table, TableBody, TableCell, TableRow } from "@midday/ui/table";
15 | import { useToast } from "@midday/ui/use-toast";
16 | import {
17 |   type ColumnDef,
18 |   type VisibilityState,
19 |   flexRender,
20 |   getCoreRowModel,
21 |   useReactTable,
22 | } from "@tanstack/react-table";
23 | import { useAction } from "next-safe-action/hooks";
24 | import { useQueryState } from "nuqs";
25 | import { useEffect } from "react";
26 | import { useState } from "react";
27 | import { useInView } from "react-intersection-observer";
28 | import { BottomBar } from "./bottom-bar";
29 | import { DataTableHeader } from "./data-table-header";
30 | import { ExportBar } from "./export-bar";
31 |
32 | interface DataTableProps<TData, TValue> {
33 |   columns: ColumnDef<TData, TValue>[];
34 |   data: TData[];
35 |   hasNextPage?: boolean;
36 |   hasFilters?: boolean;
37 |   loadMore: () => void;
38 |   query?: string;
39 |   pageSize: number;
40 |   meta: Record<string, string>;
41 |   initialColumnVisibility: VisibilityState;
42 | }
43 |
44 | export function DataTable<TData, TValue>({
45 |   columns,
46 |   query,
47 |
48 |   data: initialData,
49 |   pageSize,
50 |   loadMore,
51 |   meta: pageMeta,
52 |   hasFilters,
53 |   hasNextPage: initialHasNextPage,
54 |   initialColumnVisibility,
55 | }: DataTableProps<TData, TValue>) {
56 |   const { toast } = useToast();
57 |   const [data, setData] = useState(initialData);
58 |   const [from, setFrom] = useState(pageSize);
59 |   const { ref, inView } = useInView();
60 |   const { date_format: dateFormat } = useUserContext((state) => state.data);
61 |
62 |   const [hasNextPage, setHasNextPage] = useState(initialHasNextPage);
63 |   const { setColumns, setCanDelete, rowSelection, setRowSelection } =
64 |     useTransactionsStore();
65 |
66 |   const [transactionId, setTransactionId] = useQueryState("id");
67 |   const selectedRows = Object.keys(rowSelection).length;
68 |
69 |   const showBottomBar =
70 |     (hasFilters && !selectedRows) || (query && !selectedRows);
71 |
72 |   const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
73 |     initialColumnVisibility ?? {},
74 |   );
75 |
76 |   const updateTransaction = useAction(updateTransactionAction, {
77 |     onSuccess: ({ data }) => {
78 |       if (data?.status === "excluded") {
79 |         toast({
80 |           duration: 3500,
81 |           title: "Transaction excluded",
82 |           description:
83 |             "You can view excluded transactions by adding the filter excluded.",
84 |         });
85 |       }
86 |     },
87 |     onError: () => {
88 |       toast({
89 |         duration: 3500,
90 |         variant: "error",
91 |         title: "Something went wrong please try again.",
92 |       });
93 |     },
94 |   });
95 |
96 |   const handleUpdateTransaction = (
97 |     values: UpdateTransactionValues,
98 |     optimisticData?: any,
99 |   ) => {
100 |     setData((prev) => {
101 |       return prev.map((item) => {
102 |         if (item.id === values.id) {
103 |           return {
104 |             ...item,
105 |             ...values,
106 |             ...(optimisticData ?? {}),
107 |           };
108 |         }
109 |
110 |         return item;
111 |       });
112 |     });
113 |
114 |     updateTransaction.execute(values);
115 |   };
116 |
117 |   const deleteTransactions = useAction(deleteTransactionsAction, {
118 |     onError: () => {
119 |       toast({
120 |         duration: 3500,
121 |         variant: "error",
122 |         title: "Something went wrong please try again.",
123 |       });
124 |     },
125 |   });
126 |
127 |   const handleDeleteTransactions = ({ ids }) => {
128 |     setData((prev) => {
129 |       return prev.filter((item) => !ids?.includes(item.id));
130 |     });
131 |
132 |     deleteTransactions.execute({ ids });
133 |   };
134 |
135 |   const setOpen = (id: string | boolean) => {
136 |     if (id) {
137 |       setTransactionId(id);
138 |     } else {
139 |       setTransactionId(null);
140 |     }
141 |   };
142 |
143 |   const handleCopyUrl = async (id: string) => {
144 |     try {
145 |       await navigator.clipboard.writeText(
146 |         `${window.location.origin}/transactions?id=${id}`,
147 |       );
148 |
149 |       toast({
150 |         duration: 4000,
151 |         title: "Copied URL to clipboard.",
152 |         variant: "success",
153 |       });
154 |     } catch {}
155 |   };
156 |
157 |   const table = useReactTable({
158 |     getRowId: (row) => row.id,
159 |     data,
160 |     columns,
161 |     getCoreRowModel: getCoreRowModel(),
162 |     onRowSelectionChange: setRowSelection,
163 |     onColumnVisibilityChange: setColumnVisibility,
164 |     meta: {
165 |       setOpen,
166 |       copyUrl: handleCopyUrl,
167 |       updateTransaction: handleUpdateTransaction,
168 |       deleteTransactions: handleDeleteTransactions,
169 |       dateFormat,
170 |     },
171 |     state: {
172 |       rowSelection,
173 |       columnVisibility,
174 |     },
175 |   });
176 |
177 |   const loadMoreData = async () => {
178 |     const formatedFrom = from;
179 |     const to = formatedFrom + pageSize * 2;
180 |
181 |     try {
[TRUNCATED]
```

apps/dashboard/src/components/tables/transactions/empty-states.tsx
```
1 | "use client";
2 |
3 | import { AddAccountButton } from "@/components/add-account-button";
4 | import { Button } from "@midday/ui/button";
5 | import { Icons } from "@midday/ui/icons";
6 | import { useRouter } from "next/navigation";
7 |
8 | type Props = {
9 |   hasFilters?: boolean;
10 | };
11 |
12 | export function NoResults({ hasFilters }: Props) {
13 |   const router = useRouter();
14 |
15 |   return (
16 |     <div className="h-[calc(100vh-300px)] flex items-center justify-center">
17 |       <div className="flex flex-col items-center">
18 |         <Icons.Transactions2 className="mb-4" />
19 |         <div className="text-center mb-6 space-y-2">
20 |           <h2 className="font-medium text-lg">No results</h2>
21 |           <p className="text-[#606060] text-sm">
22 |             {hasFilters
23 |               ? "Try another search, or adjusting the filters"
24 |               : "There are no transactions imported yet"}
25 |           </p>
26 |         </div>
27 |
28 |         {hasFilters && (
29 |           <Button
30 |             variant="outline"
31 |             onClick={() => router.push("/transactions")}
32 |           >
33 |             Clear filters
34 |           </Button>
35 |         )}
36 |       </div>
37 |     </div>
38 |   );
39 | }
40 |
41 | export function NoAccounts() {
42 |   return (
43 |     <div className="absolute w-full h-[calc(100vh-300px)] top-0 left-0 flex items-center justify-center z-20">
44 |       <div className="text-center max-w-sm mx-auto flex flex-col items-center justify-center">
45 |         <h2 className="text-xl font-medium mb-2">Connect bank account</h2>
46 |         <p className="text-sm text-[#878787] mb-6">
47 |           Get instant transaction insights. Easily spot missing receipts,
48 |           categorize expenses, and reconcile everything seamlessly for
49 |           accounting.
50 |         </p>
51 |
52 |         <AddAccountButton />
53 |       </div>
54 |     </div>
55 |   );
56 | }
```

apps/dashboard/src/components/tables/transactions/export-bar.tsx
```
1 | import { exportTransactionsAction } from "@/actions/export-transactions-action";
2 | import { useExportStore } from "@/store/export";
3 | import { useTransactionsStore } from "@/store/transactions";
4 | import { Button } from "@midday/ui/button";
5 | import { useToast } from "@midday/ui/use-toast";
6 | import { AnimatePresence, motion } from "framer-motion";
7 | import { Loader2 } from "lucide-react";
8 | import { useAction } from "next-safe-action/hooks";
9 | import { useEffect, useState } from "react";
10 |
11 | type Props = {
12 |   selected: boolean;
13 | };
14 |
15 | export function ExportBar({ selected }: Props) {
16 |   const { toast } = useToast();
17 |   const { setExportData } = useExportStore();
18 |   const { rowSelection, setRowSelection } = useTransactionsStore();
19 |   const [isOpen, setOpen] = useState(false);
20 |
21 |   const { execute, status } = useAction(exportTransactionsAction, {
22 |     onSuccess: ({ data }) => {
23 |       if (data?.id && data?.publicAccessToken) {
24 |         setExportData({
25 |           runId: data.id,
26 |           accessToken: data.publicAccessToken,
27 |         });
28 |
29 |         setRowSelection(() => ({}));
30 |       }
31 |
32 |       setOpen(false);
33 |     },
34 |     onError: () => {
35 |       toast({
36 |         duration: 3500,
37 |         variant: "error",
38 |         title: "Something went wrong please try again.",
39 |       });
40 |     },
41 |   });
42 |
43 |   useEffect(() => {
44 |     if (selected) {
45 |       setOpen(true);
46 |     } else {
47 |       setOpen(false);
48 |     }
49 |   }, [selected]);
50 |
51 |   return (
52 |     <AnimatePresence>
53 |       <motion.div
54 |         className="h-12 fixed left-[50%] bottom-2 w-[400px] -ml-[200px]"
55 |         animate={{ y: isOpen ? 0 : 100 }}
56 |         initial={{ y: 100 }}
57 |       >
58 |         <div className="mx-2 md:mx-0 backdrop-filter backdrop-blur-lg dark:bg-[#1A1A1A]/80 bg-[#F6F6F3]/80 h-12 justify-between items-center flex px-4 border dark:border-[#2C2C2C] border-[#DCDAD2] rounded-full">
59 |           <span className="text-sm">{selected} selected</span>
60 |
61 |           <div className="flex items-center space-x-4">
62 |             <button
63 |               type="button"
64 |               onClick={() => setRowSelection(() => ({}))}
65 |               className="text-sm"
66 |             >
67 |               Deselect all
68 |             </button>
69 |             <Button
70 |               className="h-8 text-sm"
71 |               onClick={() => execute(Object.keys(rowSelection))}
72 |               disabled={status === "executing"}
73 |             >
74 |               {status === "executing" ? (
75 |                 <Loader2 className="h-4 w-4 animate-spin" />
76 |               ) : (
77 |                 `Export (${selected})`
78 |               )}
79 |             </Button>
80 |           </div>
81 |         </div>
82 |       </motion.div>
83 |     </AnimatePresence>
84 |   );
85 | }
```

apps/dashboard/src/components/tables/transactions/index.tsx
```
1 | import { DataTable } from "@/components/tables/transactions/data-table";
2 | import { Cookies } from "@/utils/constants";
3 | import { getTransactions } from "@midday/supabase/cached-queries";
4 | import { cookies } from "next/headers";
5 | import { columns } from "./columns";
6 | import { NoResults } from "./empty-states";
7 |
8 | const pageSize = 50;
9 | const maxItems = 100000;
10 |
11 | type Props = {
12 |   filter: any;
13 |   page: number;
14 |   sort: any;
15 |   query: string | null;
16 | };
17 |
18 | export async function Table({ filter, page, sort, query }: Props) {
19 |   const hasFilters = Object.values(filter).some((value) => value !== null);
20 |   const initialColumnVisibility = JSON.parse(
21 |     cookies().get(Cookies.TransactionsColumns)?.value || "[]",
22 |   );
23 |
24 |   // NOTE: When we have a filter we want to show all results so users can select
25 |   // And handle all in once (export etc)
26 |   const transactions = await getTransactions({
27 |     to: hasFilters ? maxItems : page > 0 ? pageSize : pageSize - 1,
28 |     from: 0,
29 |     filter,
30 |     sort,
31 |     searchQuery: query ?? undefined,
32 |   });
33 |
34 |   const { data, meta } = transactions ?? {};
35 |
36 |   async function loadMore({ from, to }: { from: number; to: number }) {
37 |     "use server";
38 |
39 |     return getTransactions({
40 |       to,
41 |       from: from + 1,
42 |       filter,
43 |       sort,
44 |       searchQuery: query ?? undefined,
45 |     });
46 |   }
47 |
48 |   if (!data?.length) {
49 |     if (query?.length) {
50 |       return <NoResults hasFilters />;
51 |     }
52 |
53 |     return <NoResults hasFilters={hasFilters} />;
54 |   }
55 |
56 |   const hasNextPage = Boolean(
57 |     meta?.count && meta.count / (page + 1) > pageSize,
58 |   );
59 |
60 |   return (
61 |     <DataTable
62 |       initialColumnVisibility={initialColumnVisibility}
63 |       columns={columns}
64 |       data={data}
65 |       pageSize={pageSize}
66 |       loadMore={loadMore}
67 |       hasNextPage={hasNextPage}
68 |       meta={meta}
69 |       hasFilters={hasFilters}
70 |       page={page}
71 |       query={query}
72 |     />
73 |   );
74 | }
```

apps/dashboard/src/components/tables/transactions/loading.tsx
```
1 | "use client";
2 | import { cn } from "@midday/ui/cn";
3 | import { Skeleton } from "@midday/ui/skeleton";
4 | import { Table, TableBody, TableCell, TableRow } from "@midday/ui/table";
5 | import { DataTableHeader } from "./data-table-header";
6 |
7 | const data = [...Array(40)].map((_, i) => ({ id: i.toString() }));
8 |
9 | export function Loading({ isEmpty }: { isEmpty?: boolean }) {
10 |   return (
11 |     <Table
12 |       className={cn(isEmpty && "opacity-20 pointer-events-none blur-[7px]")}
13 |     >
14 |       <DataTableHeader loading />
15 |
16 |       <TableBody>
17 |         {data?.map((row) => (
18 |           <TableRow key={row.id} className="h-[45px]">
19 |             <TableCell className="w-[50px]">
20 |               <Skeleton
21 |                 className={cn("h-3.5 w-[15px]", isEmpty && "animate-none")}
22 |               />
23 |             </TableCell>
24 |
25 |             <TableCell className="w-[100px]">
26 |               <Skeleton
27 |                 className={cn("h-3.5 w-[60%]", isEmpty && "animate-none")}
28 |               />
29 |             </TableCell>
30 |             <TableCell className="w-[430px]">
31 |               <Skeleton
32 |                 className={cn("h-3.5 w-[50%]", isEmpty && "animate-none")}
33 |               />
34 |             </TableCell>
35 |             <TableCell className="w-[200px]">
36 |               <Skeleton
37 |                 className={cn("h-3.5 w-[50%]", isEmpty && "animate-none")}
38 |               />
39 |             </TableCell>
40 |
41 |             <TableCell className="w-[200px]">
42 |               <Skeleton
43 |                 className={cn("h-3.5 w-[60%]", isEmpty && "animate-none")}
44 |               />
45 |             </TableCell>
46 |             <TableCell className="w-[150px]">
47 |               <Skeleton
48 |                 className={cn("h-3.5 w-[80px]", isEmpty && "animate-none")}
49 |               />
50 |             </TableCell>
51 |             <TableCell className="w-[200px]">
52 |               <div className="flex items-center space-x-2 w-[80%]">
53 |                 <Skeleton className="h-5 w-5 rounded-full" />
54 |                 <Skeleton
55 |                   className={cn("h-3.5 w-[70%]", isEmpty && "animate-none")}
56 |                 />
57 |               </div>
58 |             </TableCell>
59 |             <TableCell className="w-50px">
60 |               <Skeleton
61 |                 className={cn(
62 |                   "h-[20px] w-[20px] rounded-full",
63 |                   isEmpty && "animate-none",
64 |                 )}
65 |               />
66 |             </TableCell>
67 |             <TableCell className="w-60px" />
68 |           </TableRow>
69 |         ))}
70 |       </TableBody>
71 |     </Table>
72 |   );
73 | }
```

apps/dashboard/src/components/tables/vault/contants.ts
```
1 | export const DEFAULT_FOLDER_NAME = "Untitled Folder";
2 |
3 | export const TAGS = [
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
26 |   "financial_records",
27 |   "advertising_copy",
28 |   "press_releases",
29 |   "branding_guidelines",
30 |   "market_research_reports",
31 |   "campaign_performance_reports",
32 |   "customer_surveys",
33 |   "quality_control_reports",
34 |   "inventory_reports",
35 |   "maintenance_logs",
36 |   "production_schedules",
37 |   "vendor_agreements",
38 |   "supplier_agreements",
39 |   "sales_contracts",
40 |   "sales_reports",
41 |   "client_proposals",
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
78 | ];
```

apps/dashboard/src/components/tables/vault/data-table-row.tsx
```
1 | "use client";
2 |
3 | import { createFolderAction } from "@/actions/create-folder-action";
4 | import { deleteFileAction } from "@/actions/delete-file-action";
5 | import { deleteFolderAction } from "@/actions/delete-folder-action";
6 | import { shareFileAction } from "@/actions/share-file-action";
7 | import { updateDocumentAction } from "@/actions/update-document-action";
8 | import { AssignedUser } from "@/components/assigned-user";
9 | import { FileIcon } from "@/components/file-icon";
10 | import { FilePreview } from "@/components/file-preview";
11 | import { SelectTag } from "@/components/select-tag";
12 | import { useI18n } from "@/locales/client";
13 | import { useUserContext } from "@/store/user/hook";
14 | import { useVaultContext } from "@/store/vault/hook";
15 | import { formatDate, formatSize } from "@/utils/format";
16 | import {
17 |   AlertDialog,
18 |   AlertDialogAction,
19 |   AlertDialogCancel,
20 |   AlertDialogContent,
21 |   AlertDialogDescription,
22 |   AlertDialogFooter,
23 |   AlertDialogHeader,
24 |   AlertDialogTitle,
25 |   AlertDialogTrigger,
26 | } from "@midday/ui/alert-dialog";
27 | import {
28 |   ContextMenu,
29 |   ContextMenuContent,
30 |   ContextMenuItem,
31 |   ContextMenuSub,
32 |   ContextMenuSubContent,
33 |   ContextMenuSubTrigger,
34 |   ContextMenuTrigger,
35 | } from "@midday/ui/context-menu";
36 | import {
37 |   DropdownMenu,
38 |   DropdownMenuContent,
39 |   DropdownMenuItem,
40 |   DropdownMenuPortal,
41 |   DropdownMenuSub,
42 |   DropdownMenuSubContent,
43 |   DropdownMenuSubTrigger,
44 |   DropdownMenuTrigger,
45 | } from "@midday/ui/dropdown-menu";
46 | import {
47 |   HoverCard,
48 |   HoverCardContent,
49 |   HoverCardTrigger,
50 | } from "@midday/ui/hover-card";
51 | import { Icons } from "@midday/ui/icons";
52 | import { Input } from "@midday/ui/input";
53 | import { TableCell, TableRow } from "@midday/ui/table";
54 | import { useToast } from "@midday/ui/use-toast";
55 | import { isSupportedFilePreview } from "@midday/utils";
56 | import ms from "ms";
57 | import { useAction } from "next-safe-action/hooks";
58 | import Link from "next/link";
59 | import { useParams, usePathname } from "next/navigation";
60 | import { useEffect, useRef, useState } from "react";
61 | import { useHotkeys } from "react-hotkeys-hook";
62 | import { DEFAULT_FOLDER_NAME } from "./contants";
63 | import { Tag } from "./tag";
64 |
65 | export const translatedFolderName = (t: any, folder: string) => {
66 |   switch (folder) {
67 |     case "all":
68 |       return t("folders.all");
69 |     case "exports":
70 |       return t("folders.exports");
71 |     case "inbox":
72 |       return t("folders.inbox");
73 |     case "imports":
74 |       return t("folders.imports");
75 |     case "transactions":
76 |       return t("folders.transactions");
77 |     case "invoices":
78 |       return t("folders.invoices");
79 |     default:
80 |       return decodeURIComponent(folder);
81 |   }
82 | };
83 |
84 | type Props = {
85 |   isEditing: boolean;
86 |   name: string;
87 |   path: string;
88 |   href: string;
89 | };
90 |
91 | function RowTitle({ name: initialName, isEditing, path, href }: Props) {
92 |   const inputRef = useRef<HTMLInputElement>(null);
93 |   const t = useI18n();
94 |   const [canceled, setCanceled] = useState(false);
95 |   const { toast } = useToast();
96 |   const [name, setName] = useState(initialName ?? DEFAULT_FOLDER_NAME);
97 |   const { deleteItem, data } = useVaultContext((s) => s);
98 |
99 |   useEffect(() => {
100 |     if (isEditing) {
101 |       setTimeout(() => {
102 |         inputRef.current?.focus();
103 |       }, 200);
104 |     }
105 |   }, [isEditing]);
106 |
107 |   useHotkeys(
108 |     "esc",
109 |     () => {
110 |       const name = initialName ?? DEFAULT_FOLDER_NAME;
111 |       deleteItem(name);
112 |       setCanceled(true);
113 |     },
114 |     { enableOnFormTags: true, enabled: isEditing },
115 |   );
116 |
117 |   const createFolder = useAction(createFolderAction, {
118 |     onExecute: () => {},
119 |     onError: () => {
120 |       toast({
121 |         duration: 3500,
122 |         variant: "error",
123 |         title:
124 |           "A folder with this name already exists. Please use a different name.",
125 |       });
126 |     },
127 |   });
128 |
129 |   const checkAndCreateFolder = () => {
130 |     if (
131 |       !canceled &&
132 |       name === initialName &&
133 |       data.some((folder) => folder.name === name && folder.isFolder)
134 |     ) {
135 |       return;
136 |     }
137 |
138 |     createFolder.execute({ path, name });
139 |   };
140 |
141 |   const handleOnKeyDown = (evt: React.KeyboardEvent<HTMLInputElement>) => {
142 |     if (evt.key === "Enter") {
143 |       checkAndCreateFolder();
144 |     }
145 |   };
146 |
147 |   if (isEditing) {
148 |     return (
149 |       <Input
150 |         ref={inputRef}
151 |         className="w-auto border-0 h-auto p-0"
152 |         value={name}
153 |         onBlur={checkAndCreateFolder}
154 |         onKeyDown={handleOnKeyDown}
155 |         onChange={(evt) => setName(evt.target.value)}
156 |         onFocus={(evt) => evt.target.select()}
157 |       />
158 |     );
159 |   }
160 |
161 |   if (href) {
162 |     return (
163 |       <Link prefetch href={href}>
164 |         {translatedFolderName(t, name)}
165 |       </Link>
166 |     );
167 |   }
168 |
169 |   return (
170 |     <span className="line-clamp-1 max-w-[70%]">
171 |       {translatedFolderName(t, name)}
172 |     </span>
173 |   );
174 | }
[TRUNCATED]
```

apps/dashboard/src/components/tables/vault/data-table.loading.tsx
```
1 | import { Skeleton } from "@midday/ui/skeleton";
2 | import { Table, TableBody, TableCell, TableRow } from "@midday/ui/table";
3 | import { DataTableHeader } from "./date-table-header";
4 |
5 | export function Loading() {
6 |   return (
7 |     <div className="mt-3 h-[calc(100vh-370px)] border overflow-scroll relative">
8 |       <Table>
9 |         <DataTableHeader />
10 |         <TableBody className="border-r-0 border-l-0">
11 |           {[...Array(20)].map((_, index) => (
12 |             <TableRow
13 |               className="h-[45px] cursor-default"
14 |               key={index.toString()}
15 |             >
16 |               <TableCell>
17 |                 <Skeleton className="h-[20px] w-[20%]" />
18 |               </TableCell>
19 |               <TableCell>
20 |                 <Skeleton className="h-[20px] w-[25%]" />
21 |               </TableCell>
22 |               <TableCell>
23 |                 <Skeleton className="w-24 h-7 rounded-full" />
24 |               </TableCell>
25 |               <TableCell>
26 |                 <Skeleton className="h-[15px] w-[50%]" />
27 |               </TableCell>
28 |             </TableRow>
29 |           ))}
30 |         </TableBody>
31 |       </Table>
32 |     </div>
33 |   );
34 | }
```

apps/dashboard/src/components/tables/vault/data-table.server.tsx
```
1 | import { VaultProvider } from "@/store/vault/provider";
2 | import { getVaultQuery } from "@midday/supabase/queries";
3 | import { createClient } from "@midday/supabase/server";
4 | import { DataTable } from "./data-table";
5 | import { EmptyTable } from "./empty-table";
6 | import { UploadZone } from "./upload-zone";
7 | import { VaultActions } from "./vault-actions";
8 |
9 | type Props = {
10 |   folders: string[];
11 |   disableActions: boolean;
12 |   teamId: string;
13 | };
14 |
15 | export async function DataTableServer({
16 |   folders,
17 |   disableActions,
18 |   filter,
19 |   teamId,
20 | }: Props) {
21 |   const parentId = folders.at(-1);
22 |   const supabase = createClient();
23 |
24 |   const { data } = await getVaultQuery(supabase, {
25 |     teamId,
26 |     parentId: parentId && decodeURIComponent(parentId),
27 |     filter,
28 |     searchQuery: filter?.q,
29 |   });
30 |
31 |   const isSearch = Object.values(filter).some((value) => value !== null);
32 |
33 |   return (
34 |     <VaultProvider data={data}>
35 |       <div className="relative">
36 |         <VaultActions disableActions={disableActions} />
37 |
38 |         <div className="mt-3 h-[calc(100vh-380px)] border">
39 |           <UploadZone>
40 |             <DataTable teamId={teamId} />
41 |
42 |             {data.length === 0 && (
43 |               <EmptyTable type={isSearch ? "search" : parentId} />
44 |             )}
45 |           </UploadZone>
46 |         </div>
47 |       </div>
48 |     </VaultProvider>
49 |   );
50 | }
```

apps/dashboard/src/components/tables/vault/data-table.tsx
```
1 | "use client";
2 |
3 | import { useVaultContext } from "@/store/vault/hook";
4 | import { createClient } from "@midday/supabase/client";
5 | import { Table, TableBody } from "@midday/ui/table";
6 | import { useEffect } from "react";
7 | import { DataTableRow } from "./data-table-row";
8 | import { DataTableHeader } from "./date-table-header";
9 |
10 | export function DataTable({ teamId }: { teamId: string }) {
11 |   const { data, updateItem } = useVaultContext((s) => s);
12 |   const supabase = createClient();
13 |
14 |   useEffect(() => {
15 |     const channel = supabase
16 |       .channel("realtime_documents")
17 |       .on(
18 |         "postgres_changes",
19 |         {
20 |           event: "UPDATE",
21 |           schema: "public",
22 |           table: "documents",
23 |           filter: `team_id=eq.${teamId}`,
24 |         },
25 |         (payload) => {
26 |           // Update if the document is not classified
27 |           if (!payload.old.tag && payload.old.id) {
28 |             updateItem(payload.old.id, {
29 |               tag: payload.new?.tag,
30 |             });
31 |           }
32 |         },
33 |       )
34 |       .subscribe();
35 |
36 |     return () => {
37 |       supabase.removeChannel(channel);
38 |     };
39 |   }, []);
40 |
41 |   return (
42 |     <Table>
43 |       <DataTableHeader />
44 |
45 |       <TableBody className="border-r-0 border-l-0 select-text">
46 |         {data?.map((row) => (
47 |           <DataTableRow key={row.name} data={row} />
48 |         ))}
49 |       </TableBody>
50 |     </Table>
51 |   );
52 | }
```

apps/dashboard/src/components/tables/vault/date-table-header.tsx
```
1 | import { TableHead, TableHeader, TableRow } from "@midday/ui/table";
2 |
3 | export function DataTableHeader() {
4 |   return (
5 |     <TableHeader className="border-0">
6 |       <TableRow>
7 |         <TableHead className="w-[45%]">Name</TableHead>
8 |         <TableHead className="w-[20%]">Owner</TableHead>
9 |         <TableHead className="w-[20%]">Tag</TableHead>
10 |         <TableHead className="w-[15%]">Created at</TableHead>
11 |       </TableRow>
12 |     </TableHeader>
13 |   );
14 | }
```

apps/dashboard/src/components/tables/vault/empty-table.tsx
```
1 | type Props = {
2 |   type?: string;
3 | };
4 |
5 | export function EmptyTable({ type }: Props) {
6 |   switch (type) {
7 |     case "exports":
8 |       return (
9 |         <div className="h-[calc(100%-80px)] p-4 flex justify-center items-center">
10 |           <div className="items-center flex flex-col text-center">
11 |             <h2 className="mb-2">Exports</h2>
12 |             <p className="text-sm text-[#878787]">
13 |               This is where your exports based from <br />
14 |               transactions will end up.
15 |             </p>
16 |           </div>
17 |         </div>
18 |       );
19 |
20 |     case "transactions":
21 |       return (
22 |         <div className="h-[calc(100%-80px)] p-4 flex justify-center items-center">
23 |           <div className="items-center flex flex-col text-center">
24 |             <h2 className="mb-2">Transactions</h2>
25 |             <p className="text-sm text-[#878787]">
26 |               This is where your attachments from <br />
27 |               transactions will end up.
28 |             </p>
29 |           </div>
30 |         </div>
31 |       );
32 |
33 |     case "imports":
34 |       return (
35 |         <div className="h-[calc(100%-80px)] p-4 flex justify-center items-center">
36 |           <div className="items-center flex flex-col text-center">
37 |             <h2 className="mb-2">Imports</h2>
38 |             <p className="text-sm text-[#878787]">
39 |               This is where your imports
40 |               <br />
41 |               will end up.
42 |             </p>
43 |           </div>
44 |         </div>
45 |       );
46 |
47 |     case "inbox":
48 |       return (
49 |         <div className="h-[calc(100%-80px)] p-4 flex justify-center items-center">
50 |           <div className="items-center flex flex-col text-center">
51 |             <h2 className="mb-2">Inbox</h2>
52 |             <p className="text-sm text-[#878787]">
53 |               This is where your inbox attachments
54 |               <br />
55 |               will end up.
56 |             </p>
57 |           </div>
58 |         </div>
59 |       );
60 |
61 |     case "invoices":
62 |       return (
63 |         <div className="h-[calc(100%-80px)] p-4 flex justify-center items-center">
64 |           <div className="items-center flex flex-col text-center">
65 |             <h2 className="mb-2">Invoices</h2>
66 |             <p className="text-sm text-[#878787]">
67 |               This is where your created
68 |               <br />
69 |               invoices will end up.
70 |             </p>
71 |           </div>
72 |         </div>
73 |       );
74 |
75 |     case "search":
76 |       return (
77 |         <div className="h-[calc(100%-80px)] p-4 flex justify-center items-center">
78 |           <div className="items-center flex flex-col text-center">
79 |             <h2 className="mb-2">No results found.</h2>
80 |             <p className="text-sm text-[#878787]">Try adjusting your search.</p>
81 |           </div>
82 |         </div>
83 |       );
84 |
85 |     default:
86 |       return (
87 |         <div className="h-[calc(100%-80px)] p-4 flex justify-center items-center">
88 |           <div className="items-center flex flex-col text-center">
89 |             <h2 className="mb-2">Drop your files here</h2>
90 |             <p className="text-sm text-[#878787]">
91 |               Or upload them via the <br /> "Upload file" button above
92 |             </p>
93 |           </div>
94 |         </div>
95 |       );
96 |   }
97 | }
```

apps/dashboard/src/components/tables/vault/index.tsx
```
1 | import { Breadcrumbs } from "@/components/breadcrumbs";
2 | import { VaultSettingsModal } from "@/components/modals/vault-settings-modal";
3 | import { VaultSearchFilter } from "@/components/vault-search-filter";
4 | import { getTeamMembers, getUser } from "@midday/supabase/cached-queries";
5 | import { Suspense } from "react";
6 | import { Loading } from "./data-table.loading";
7 | import { DataTableServer } from "./data-table.server";
8 |
9 | type Props = {
10 |   folders: string[];
11 |   disableActions: boolean;
12 |   hideBreadcrumbs?: boolean;
13 | };
14 |
15 | export async function Table({ folders, disableActions, filter }: Props) {
16 |   const [members, user] = await Promise.all([getTeamMembers(), getUser()]);
17 |
18 |   const team = user?.data?.team;
19 |
20 |   return (
21 |     <div>
22 |       <div className="h-[32px] mt-6 mb-[21px] flex items-center justify-between mr-11">
23 |         <Breadcrumbs
24 |           folders={folders}
25 |           hide={Object.values(filter).some((value) => value !== null)}
26 |         />
27 |
28 |         <div className="flex items-center gap-2">
29 |           <VaultSearchFilter
30 |             members={members?.data?.map((member) => ({
31 |               id: member?.user?.id,
32 |               name: member.user?.full_name,
33 |             }))}
34 |           />
35 |
36 |           <VaultSettingsModal
37 |             documentClassification={team?.document_classification}
38 |           />
39 |         </div>
40 |       </div>
41 |
42 |       <Suspense fallback={<Loading />}>
43 |         <DataTableServer
44 |           folders={folders}
45 |           disableActions={disableActions}
46 |           filter={filter}
47 |           teamId={team?.id}
48 |         />
49 |       </Suspense>
50 |     </div>
51 |   );
52 | }
```

apps/dashboard/src/components/tables/vault/search-params.ts
```
1 | import {
2 |   createSearchParamsCache,
3 |   parseAsArrayOf,
4 |   parseAsString,
5 | } from "nuqs/server";
6 |
7 | export const searchParamsCache = createSearchParamsCache({
8 |   q: parseAsString,
9 |   start: parseAsString,
10 |   end: parseAsString,
11 |   owners: parseAsArrayOf(parseAsString),
12 |   tags: parseAsArrayOf(parseAsString),
13 | });
```

apps/dashboard/src/components/tables/vault/tag.tsx
```
1 | "use client";
2 |
3 | import { useI18n } from "@/locales/client";
4 | import { cn } from "@midday/ui/cn";
5 | import { Skeleton } from "@midday/ui/skeleton";
6 |
7 | export function Tag({
8 |   name,
9 |   isLoading,
10 |   className,
11 | }: {
12 |   name?: string;
13 |   isLoading?: boolean;
14 |   className?: string;
15 | }) {
16 |   const t = useI18n();
17 |
18 |   if (isLoading) {
19 |     return <Skeleton className="w-24 h-6 rounded-full" />;
20 |   }
21 |
22 |   if (!name) {
23 |     return null;
24 |   }
25 |
26 |   return (
27 |     <div
28 |       className={cn(
29 |         "p-1 text-[#878787] bg-[#F2F1EF] text-[10px] dark:bg-[#1D1D1D] px-3 py-1 rounded-full cursor-default font-mono inline-flex max-w-full",
30 |         className,
31 |       )}
32 |     >
33 |       <span className="line-clamp-1 truncate inline-block">
34 |         {t(`tags.${name}`)}
35 |       </span>
36 |     </div>
37 |   );
38 | }
```

apps/dashboard/src/components/tables/vault/upload-zone.tsx
```
1 | "use client";
2 |
3 | import { invalidateCacheAction } from "@/actions/invalidate-cache-action";
4 | import { useUserContext } from "@/store/user/hook";
5 | import { useVaultContext } from "@/store/vault/hook";
6 | import { resumableUpload } from "@/utils/upload";
7 | import { createClient } from "@midday/supabase/client";
8 | import { cn } from "@midday/ui/cn";
9 | import {
10 |   ContextMenu,
11 |   ContextMenuContent,
12 |   ContextMenuItem,
13 |   ContextMenuTrigger,
14 | } from "@midday/ui/context-menu";
15 | import { useToast } from "@midday/ui/use-toast";
16 | import { useParams } from "next/navigation";
17 | import { useEffect, useRef, useState } from "react";
18 | import { useDropzone } from "react-dropzone";
19 | import { DEFAULT_FOLDER_NAME } from "./contants";
20 |
21 | type Props = {
22 |   children: React.ReactNode;
23 | };
24 |
25 | export function UploadZone({ children }: Props) {
26 |   const supabase = createClient();
27 |   const [progress, setProgress] = useState(0);
28 |   const [showProgress, setShowProgress] = useState(false);
29 |   const [toastId, setToastId] = useState(null);
30 |   const uploadProgress = useRef([]);
31 |   const params = useParams();
32 |   const folders = params?.folders ?? [];
33 |   const { toast, dismiss, update } = useToast();
34 |   const { createFolder } = useVaultContext((s) => s);
35 |
36 |   const { team_id: teamId } = useUserContext((state) => state.data);
37 |
38 |   const isDefaultFolder = [
39 |     "exports",
40 |     "inbox",
41 |     "import",
42 |     "transactions",
43 |   ].includes(folders?.at(0) ?? "");
44 |
45 |   useEffect(() => {
46 |     if (!toastId && showProgress) {
47 |       const { id } = toast({
48 |         title: `Uploading ${uploadProgress.current.length} files`,
49 |         progress,
50 |         variant: "progress",
51 |         description: "Please do not close browser until completed",
52 |         duration: Number.POSITIVE_INFINITY,
53 |       });
54 |
55 |       setToastId(id);
56 |     } else {
57 |       update(toastId, {
58 |         progress,
59 |         title: `Uploading ${uploadProgress.current.length} files`,
60 |       });
61 |     }
62 |   }, [showProgress, progress, toastId]);
63 |
64 |   const onDrop = async (files) => {
65 |     // NOTE: If onDropRejected
66 |     if (!files.length) {
67 |       return;
68 |     }
69 |
70 |     // Set default progress
71 |     uploadProgress.current = files.map(() => 0);
72 |
73 |     setShowProgress(true);
74 |
75 |     const filePath = [teamId, ...folders];
76 |
77 |     try {
78 |       await Promise.all(
79 |         files.map(async (file, idx) => {
80 |           await resumableUpload(supabase, {
81 |             bucket: "vault",
82 |             path: filePath,
83 |             file,
84 |             onProgress: (bytesUploaded, bytesTotal) => {
85 |               uploadProgress.current[idx] = (bytesUploaded / bytesTotal) * 100;
86 |
87 |               const _progress = uploadProgress.current.reduce(
88 |                 (acc, currentValue) => {
89 |                   return acc + currentValue;
90 |                 },
91 |                 0,
92 |               );
93 |
94 |               setProgress(Math.round(_progress / files.length));
95 |             },
96 |           });
97 |         }),
98 |       );
99 |
100 |       // Reset once done
101 |       uploadProgress.current = [];
102 |
103 |       setProgress(0);
104 |       toast({
105 |         title: "Upload successful.",
106 |         variant: "success",
107 |         duration: 2000,
108 |       });
109 |
110 |       setShowProgress(false);
111 |       setToastId(null);
112 |       dismiss(toastId);
113 |       invalidateCacheAction([`vault_${teamId}`]);
114 |     } catch {
115 |       toast({
116 |         duration: 2500,
117 |         variant: "error",
118 |         title: "Something went wrong please try again.",
119 |       });
120 |     }
121 |   };
122 |
123 |   const { getRootProps, getInputProps, isDragActive } = useDropzone({
124 |     onDrop,
125 |     onDropRejected: ([reject]) => {
126 |       if (reject?.errors.find(({ code }) => code === "file-too-large")) {
127 |         toast({
128 |           duration: 2500,
129 |           variant: "error",
130 |           title: "File size to large.",
131 |         });
132 |       }
133 |
134 |       if (reject?.errors.find(({ code }) => code === "file-invalid-type")) {
135 |         toast({
136 |           duration: 2500,
137 |           variant: "error",
138 |           title: "File type not supported.",
139 |         });
140 |       }
141 |     },
142 |     maxSize: 8000000, // 8MB
143 |     accept: {
144 |       "image/png": [".png"],
145 |       "image/jpeg": [".jpg", ".jpeg"],
146 |       "application/pdf": [".pdf"],
147 |       "application/zip": [".zip"],
148 |       "text/csv": [".csv"],
149 |       "application/vnd.openxmlformats-officedocument.presentationml.presentation":
150 |         [".pptx"],
151 |     },
152 |   });
153 |
154 |   return (
155 |     <ContextMenu>
156 |       <ContextMenuTrigger asChild>
157 |         <div
158 |           {...getRootProps({ onClick: (evt) => evt.stopPropagation() })}
159 |           className="relative h-full"
160 |         >
161 |           <div className="absolute top-0 bottom-0 right-0 left-0 z-50 pointer-events-none">
162 |             <div
163 |               className={cn(
164 |                 "bg-background dark:bg-[#1A1A1A] h-full flex items-center justify-center text-center invisible",
165 |                 isDragActive && "visible",
166 |               )}
167 |             >
168 |               <input {...getInputProps()} id="upload-files" />
169 |
170 |               <p className="text-xs">
171 |                 Drop your files here, to
[TRUNCATED]
```

apps/dashboard/src/components/tables/vault/vault-actions.tsx
```
1 | "use client";
2 |
3 | import { useVaultContext } from "@/store/vault/hook";
4 | import { Button } from "@midday/ui/button";
5 | import {
6 |   DropdownMenu,
7 |   DropdownMenuContent,
8 |   DropdownMenuItem,
9 |   DropdownMenuShortcut,
10 |   DropdownMenuTrigger,
11 | } from "@midday/ui/dropdown-menu";
12 | import { Icons } from "@midday/ui/icons";
13 | import { useHotkeys } from "react-hotkeys-hook";
14 | import { DEFAULT_FOLDER_NAME } from "./contants";
15 |
16 | export function VaultActions({ disableActions }: { disableActions: boolean }) {
17 |   const createFolder = useVaultContext((s) => s.createFolder);
18 |
19 |   const handleCreateFolder = () => {
20 |     createFolder({ name: DEFAULT_FOLDER_NAME });
21 |   };
22 |
23 |   useHotkeys("shift+meta+u", (evt) => {
24 |     evt.preventDefault();
25 |     document.getElementById("upload-files")?.click();
26 |   });
27 |
28 |   useHotkeys("shift+meta+f", (evt) => {
29 |     evt.preventDefault();
30 |     handleCreateFolder();
31 |   });
32 |
33 |   return (
34 |     <div className="absolute -top-[55px] right-0">
35 |       <DropdownMenu>
36 |         <DropdownMenuTrigger asChild>
37 |           <Button variant="outline" size="icon">
38 |             <Icons.Add size={17} />
39 |           </Button>
40 |         </DropdownMenuTrigger>
41 |         <DropdownMenuContent align="end" className="w-[200px]" sideOffset={10}>
42 |           <DropdownMenuItem
43 |             className="flex items-center gap-2"
44 |             disabled={disableActions}
45 |             onClick={handleCreateFolder}
46 |           >
47 |             <Icons.CreateNewFolder size={17} />
48 |             <span>Create folder</span>
49 |             <DropdownMenuShortcut>⇧⌘F</DropdownMenuShortcut>
50 |           </DropdownMenuItem>
51 |
52 |           <DropdownMenuItem
53 |             className="flex items-center gap-2"
54 |             disabled={disableActions}
55 |             onClick={() => document.getElementById("upload-files")?.click()}
56 |           >
57 |             <Icons.FileUpload size={17} />
58 |             <span>Upload files</span>
59 |             <DropdownMenuShortcut>⇧⌘U</DropdownMenuShortcut>
60 |           </DropdownMenuItem>
61 |         </DropdownMenuContent>
62 |       </DropdownMenu>
63 |     </div>
64 |   );
65 | }
```

apps/dashboard/src/components/widgets/account-balance/account-balance-widget.tsx
```
1 | import { getBankAccountsBalances } from "@midday/supabase/cached-queries";
2 | import { AccountBalance } from "./account-balance";
3 |
4 | export function AccountBalanceSkeleton() {
5 |   return null;
6 | }
7 |
8 | export async function AccountBalanceWidget() {
9 |   const accountsData = await getBankAccountsBalances();
10 |
11 |   return (
12 |     <div className="h-full">
13 |       <div className="flex justify-between">
14 |         <div>
15 |           <h2 className="text-lg">Account balance</h2>
16 |         </div>
17 |       </div>
18 |
19 |       <AccountBalance data={accountsData?.data} />
20 |     </div>
21 |   );
22 | }
```

apps/dashboard/src/components/widgets/account-balance/account-balance.tsx
```
1 | "use client";
2 |
3 | import { AddAccountButton } from "@/components/add-account-button";
4 | import { FormatAmount } from "@/components/format-amount";
5 | import { useI18n } from "@/locales/client";
6 | import { formatAccountName } from "@/utils/format";
7 | import { cn } from "@midday/ui/cn";
8 | import Image from "next/image";
9 | import { useState } from "react";
10 |
11 | type Props = {
12 |   data: {
13 |     id: string;
14 |     name: string;
15 |     balance: number;
16 |     currency: string;
17 |     logo_url?: string;
18 |   }[];
19 | };
20 |
21 | export function AccountBalance({ data }: Props) {
22 |   const [activeIndex, setActiveIndex] = useState(0);
23 |   const t = useI18n();
24 |
25 |   const formattedData = data.map((account) => {
26 |     if (account.name === "total_balance") {
27 |       return {
28 |         ...account,
29 |         id: account.name,
30 |         name: t("account_balance.total_balance"),
31 |       };
32 |     }
33 |
34 |     return account;
35 |   });
36 |
37 |   const activeAccount = formattedData.at(activeIndex);
38 |
39 |   if (!activeAccount) {
40 |     return (
41 |       <div className="flex justify-center items-center h-full flex-col">
42 |         <h2 className="font-medium mb-1">No accounts connected</h2>
43 |         <p className="text-[#606060] text-sm mb-8 text-center">
44 |           Get your balance in real-time by connecting <br />
45 |           your bank account.
46 |         </p>
47 |         <AddAccountButton />
48 |       </div>
49 |     );
50 |   }
51 |
52 |   return (
53 |     <div className="flex justify-between mt-12 items-center flex-col space-y-6">
54 |       <div className="-mt-6 w-[80%] md:w-[75%] lg:w-[85%] 2xl:w-[80%] aspect-square rounded-full bg-[#F2F1EF] dark:bg-secondary flex items-center justify-center p-8 flex-col space-y-2">
55 |         <h2 className="font-mono font-medium text-2xl">
56 |           <FormatAmount
57 |             amount={activeAccount.balance}
58 |             currency={activeAccount.currency}
59 |           />
60 |         </h2>
61 |
62 |         <div className="flex space-x-2 items-center">
63 |           {activeAccount?.logo_url && (
64 |             <Image
65 |               src={activeAccount.logo_url}
66 |               alt=""
67 |               width={24}
68 |               height={24}
69 |               quality={100}
70 |               className="rounded-full border border-1 aspect-square"
71 |             />
72 |           )}
73 |
74 |           <span className="text-xs font-medium text-[#606060]">
75 |             {formatAccountName({
76 |               name: activeAccount.name,
77 |               currency: activeAccount.currency,
78 |             })}
79 |           </span>
80 |         </div>
81 |       </div>
82 |
83 |       {formattedData.length > 1 && (
84 |         <div className="flex space-x-2">
85 |           {formattedData.map((account, idx) => (
86 |             <button
87 |               type="button"
88 |               onMouseEnter={() => setActiveIndex(idx)}
89 |               onClick={() => setActiveIndex(idx)}
90 |               key={account.id}
91 |               className={cn(
92 |                 "w-[8px] h-[8px] rounded-full bg-[#1D1D1D] dark:bg-[#D9D9D9] opacity-30 transition-all cursor-pointer",
93 |                 idx === activeIndex && "opacity-1",
94 |               )}
95 |             />
96 |           ))}
97 |         </div>
98 |       )}
99 |     </div>
100 |   );
101 | }
```

apps/dashboard/src/components/widgets/account-balance/index.tsx
```
1 | import { ErrorFallback } from "@/components/error-fallback";
2 | import { ErrorBoundary } from "next/dist/client/components/error-boundary";
3 | import { Suspense } from "react";
4 | import {
5 |   AccountBalanceSkeleton,
6 |   AccountBalanceWidget,
7 | } from "./account-balance-widget";
8 |
9 | export async function AccountBalance() {
10 |   return (
11 |     <div className="border relative aspect-square overflow-hidden p-4 md:p-8">
12 |       <ErrorBoundary errorComponent={ErrorFallback}>
13 |         <Suspense fallback={<AccountBalanceSkeleton />}>
14 |           <AccountBalanceWidget />
15 |         </Suspense>
16 |       </ErrorBoundary>
17 |     </div>
18 |   );
19 | }
```

apps/dashboard/src/components/widgets/inbox/data.ts
```
1 | export const inboxData = [];
```

apps/dashboard/src/components/widgets/inbox/inbox-header.tsx
```
1 | "use client";
2 |
3 | import { changeInboxFilterAction } from "@/actions/inbox/filter";
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
15 | const options = ["all", "todo", "done"];
16 |
17 | type Props = {
18 |   filter: string;
19 |   disabled: boolean;
20 | };
21 |
22 | export function InboxHeader({ filter, disabled }: Props) {
23 |   const t = useI18n();
24 |   const { execute, optimisticState } = useOptimisticAction(
25 |     changeInboxFilterAction,
26 |     {
27 |       currentState: filter,
28 |       updateFn: (_, newState) => newState,
29 |     },
30 |   );
31 |
32 |   return (
33 |     <div className="flex justify-between">
34 |       <div>
35 |         <Link href="/inbox" prefetch>
36 |           <h2 className="text-lg">Inbox</h2>
37 |         </Link>
38 |       </div>
39 |
40 |       <DropdownMenu>
41 |         <DropdownMenuTrigger disabled={disabled}>
42 |           <div className="flex items-center space-x-2">
43 |             <span>{t(`inbox_filter.${optimisticState}`)}</span>
44 |             <Icons.ChevronDown />
45 |           </div>
46 |         </DropdownMenuTrigger>
47 |         <DropdownMenuContent className="w-[130px]">
48 |           {options.map((option) => (
49 |             <DropdownMenuCheckboxItem
50 |               key={option}
51 |               onCheckedChange={() => execute(option)}
52 |               checked={option === optimisticState}
53 |             >
54 |               {t(`inbox_filter.${option}`)}
55 |             </DropdownMenuCheckboxItem>
56 |           ))}
57 |         </DropdownMenuContent>
58 |       </DropdownMenu>
59 |     </div>
60 |   );
61 | }
```

apps/dashboard/src/components/widgets/inbox/inbox-list.tsx
```
1 | "use client";
2 |
3 | import { FormatAmount } from "@/components/format-amount";
4 | import { InboxStatus } from "@/components/inbox-status";
5 | import { Icons } from "@midday/ui/icons";
6 | import { format } from "date-fns";
7 | import Link from "next/link";
8 |
9 | export function InboxList({ data }) {
10 |   return (
11 |     <div className="flex flex-col gap-4 overflow-auto scrollbar-hide aspect-square pb-14 mt-8">
12 |       {data.map((item) => {
13 |         const tab = item.transaction_id ? "done" : "todo";
14 |
15 |         return (
16 |           <Link
17 |             key={item.id}
18 |             href={`/inbox?inboxId=${item.id}&tab=${tab}`}
19 |             className="flex flex-col items-start gap-2 border p-4 text-left text-sm transition-all"
20 |           >
21 |             <div className="flex w-full flex-col gap-1">
22 |               <div className="flex items-center mb-1">
23 |                 <div className="flex items-center gap-2">
24 |                   <div className="flex items-center space-x-2">
25 |                     <div className="font-semibold">{item?.display_name}</div>
26 |                     {item.status === "handled" && <Icons.Check />}
27 |                   </div>
28 |                 </div>
29 |                 <div className="ml-auto text-xs text-muted-foreground">
30 |                   {item.date && format(new Date(item.date), "MMM d")}
31 |                 </div>
32 |               </div>
33 |               <div className="flex">
34 |                 {item?.currency && item?.amount && (
35 |                   <div className="text-xs font-medium">
36 |                     <FormatAmount
37 |                       amount={item.amount}
38 |                       currency={item.currency}
39 |                     />
40 |                   </div>
41 |                 )}
42 |                 <div className="ml-auto">
43 |                   <InboxStatus item={item} />
44 |                 </div>
45 |               </div>
46 |             </div>
47 |           </Link>
48 |         );
49 |       })}
50 |     </div>
51 |   );
52 | }
```

apps/dashboard/src/components/widgets/inbox/inbox-widget.tsx
```
1 | import { CopyInput } from "@/components/copy-input";
2 | import { getInboxEmail } from "@midday/inbox";
3 | import { getUser } from "@midday/supabase/cached-queries";
4 | import { getInboxQuery } from "@midday/supabase/queries";
5 | import { createClient } from "@midday/supabase/server";
6 | import { inboxData } from "./data";
7 | import { InboxList } from "./inbox-list";
8 |
9 | export async function InboxWidget({ filter, disabled }) {
10 |   const user = await getUser();
11 |   const supabase = createClient();
12 |
13 |   const { data } = disabled
14 |     ? inboxData
15 |     : await getInboxQuery(supabase, {
16 |         to: 15,
17 |         from: 0,
18 |         teamId: user.data.team_id,
19 |         done: filter === "done",
20 |         todo: filter === "todo",
21 |       });
22 |
23 |   if (!data?.length) {
24 |     return (
25 |       <div className="flex flex-col space-y-4 items-center justify-center h-full text-center">
26 |         <div>
27 |           <CopyInput value={getInboxEmail(user?.data?.team?.inbox_id)} />
28 |         </div>
29 |
30 |         <p className="text-sm text-[#606060]">
31 |           Use this email for online purchases to seamlessly
32 |           <br />
33 |           match invoices againsts transactions.
34 |         </p>
35 |       </div>
36 |     );
37 |   }
38 |
39 |   return <InboxList data={data} />;
40 | }
```

apps/dashboard/src/components/widgets/inbox/index.tsx
```
1 | import { ErrorFallback } from "@/components/error-fallback";
2 | import { InboxListSkeleton } from "@/components/inbox-list-skeleton";
3 | import { Cookies } from "@/utils/constants";
4 | import { ErrorBoundary } from "next/dist/client/components/error-boundary";
5 | import { cookies } from "next/headers";
6 | import { Suspense } from "react";
7 | import { InboxHeader } from "./inbox-header";
8 | import { InboxWidget } from "./inbox-widget";
9 |
10 | export async function Inbox({ disabled }) {
11 |   const filter = cookies().get(Cookies.InboxFilter)?.value ?? "all";
12 |
13 |   return (
14 |     <div className="border relative aspect-square overflow-hidden p-4 md:p-8">
15 |       <InboxHeader filter={filter} disabled={disabled} />
16 |
17 |       <ErrorBoundary errorComponent={ErrorFallback}>
18 |         <Suspense
19 |           key={filter}
20 |           fallback={<InboxListSkeleton numberOfItems={3} className="pt-8" />}
21 |         >
22 |           <InboxWidget disabled={disabled} filter={filter} />
23 |         </Suspense>
24 |       </ErrorBoundary>
25 |     </div>
26 |   );
27 | }
```

apps/dashboard/src/components/widgets/insights/index.tsx
```
1 | import { Suspense } from "react";
2 | import { InsightsWidget } from "./insights-widget";
3 |
4 | export function Insights() {
5 |   return (
6 |     <div className="border aspect-square overflow-hidden relative flex flex-col p-4 md:p-8">
7 |       <h2 className="text-lg">Assistant</h2>
8 |
9 |       <Suspense>
10 |         <InsightsWidget />
11 |       </Suspense>
12 |     </div>
13 |   );
14 | }
```

apps/dashboard/src/components/widgets/insights/insight-input.tsx
```
1 | "use client";
2 |
3 | import { useAssistantStore } from "@/store/assistant";
4 | import { Icons } from "@midday/ui/icons";
5 | import { Input } from "@midday/ui/input";
6 |
7 | export function InsightInput() {
8 |   const { setOpen } = useAssistantStore();
9 |
10 |   return (
11 |     <div>
12 |       <div className="absolute bottom-4 left-4 right-4 md:bottom-8 md:left-8 md:right-8">
13 |         <div className="relative z-20">
14 |           <Input
15 |             placeholder="Ask Midday a question..."
16 |             className="w-full h-11 cursor-pointer bg-background"
17 |             onFocus={() => setOpen()}
18 |           />
19 |           <Icons.LogoIcon className="absolute right-3 bottom-3.5 pointer-events-none" />
20 |         </div>
21 |       </div>
22 |       <div className="absolute h-[76px] bg-gradient-to-t from-background to-[#fff]/70 dark:to-[#121212]/90 bottom-0 left-0 right-0 w-full z-10" />
23 |     </div>
24 |   );
25 | }
```

apps/dashboard/src/components/widgets/insights/insight-list.tsx
```
1 | "use client";
2 |
3 | import { chatExamples } from "@/components/chat/examples";
4 | import { useAssistantStore } from "@/store/assistant";
5 | import { shuffle } from "@midday/utils";
6 | import { useEffect, useState } from "react";
7 |
8 | export function InsightList() {
9 |   const { setOpen } = useAssistantStore();
10 |   const [items, setItems] = useState([]);
11 |
12 |   useEffect(() => {
13 |     const items = shuffle(chatExamples).slice(0, 4);
14 |     setItems(items);
15 |   }, []);
16 |
17 |   return (
18 |     <div className="mb-16">
19 |       <ul className="flex flex-col justify-center items-center space-y-3 flex-shrink">
20 |         {items.map((example) => (
21 |           <li
22 |             key={example}
23 |             className="rounded-full dark:bg-secondary bg-[#F2F1EF] text-xs font-mono text-[#606060] hover:opacity-80 transition-all cursor-default"
24 |           >
25 |             <button
26 |               onClick={() => setOpen(example)}
27 |               type="button"
28 |               className="inline-block p-3 py-2"
29 |             >
30 |               <span>{example}</span>
31 |             </button>
32 |           </li>
33 |         ))}
34 |       </ul>
35 |     </div>
36 |   );
37 | }
```

apps/dashboard/src/components/widgets/insights/insights-widget.tsx
```
1 | import { getUIStateFromAIState } from "@/actions/ai/chat/utils";
2 | import { getLatestChat } from "@/actions/ai/storage";
3 | import { ChatList } from "@/components/chat/chat-list";
4 | import { InsightInput } from "./insight-input";
5 | import { InsightList } from "./insight-list";
6 |
7 | export async function InsightsWidget() {
8 |   const chat = await getLatestChat();
9 |
10 |   return (
11 |     <div>
12 |       <div className="mt-8 overflow-auto scrollbar-hide pb-32 aspect-square flex flex-col-reverse">
13 |         {chat ? (
14 |           <ChatList messages={getUIStateFromAIState(chat)} />
15 |         ) : (
16 |           <InsightList />
17 |         )}
18 |       </div>
19 |       <InsightInput />
20 |     </div>
21 |   );
22 | }
```

apps/dashboard/src/components/widgets/invoice/empty-state.tsx
```
1 | "use client";
2 |
3 | import { useInvoiceParams } from "@/hooks/use-invoice-params";
4 | import { Button } from "@midday/ui/button";
5 |
6 | export function EmptyState() {
7 |   const { setParams } = useInvoiceParams();
8 |
9 |   return (
10 |     <div className="flex flex-col space-y-4 items-center justify-center h-full text-center mt-16">
11 |       <p className="text-sm text-[#606060]">
12 |         No invoices created yet.
13 |         <br />
14 |         Create an invoice to get started.
15 |       </p>
16 |
17 |       <Button variant="outline" onClick={() => setParams({ type: "create" })}>
18 |         Create invoice
19 |       </Button>
20 |     </div>
21 |   );
22 | }
```

apps/dashboard/src/components/widgets/invoice/index.tsx
```
1 | import { ErrorFallback } from "@/components/error-fallback";
2 | import { ErrorBoundary } from "next/dist/client/components/error-boundary";
3 | import { Suspense } from "react";
4 | import { InvoiceWidgetHeader } from "./invoice-header";
5 | import { InvoiceWidget, InvoiceWidgetSkeleton } from "./invoice-widget";
6 |
7 | export function Invoice() {
8 |   return (
9 |     <div className="border aspect-square overflow-hidden relative p-4 md:p-8">
10 |       <InvoiceWidgetHeader />
11 |
12 |       <ErrorBoundary errorComponent={ErrorFallback}>
13 |         <Suspense fallback={<InvoiceWidgetSkeleton />}>
14 |           <InvoiceWidget />
15 |         </Suspense>
16 |       </ErrorBoundary>
17 |     </div>
18 |   );
19 | }
```

apps/dashboard/src/components/widgets/invoice/invoice-header.tsx
```
1 | "use client";
2 |
3 | import { useInvoiceParams } from "@/hooks/use-invoice-params";
4 | import { Button } from "@midday/ui/button";
5 | import { Icons } from "@midday/ui/icons";
6 | import Link from "next/link";
7 |
8 | export function InvoiceWidgetHeader() {
9 |   const { setParams } = useInvoiceParams();
10 |
11 |   return (
12 |     <div className="flex justify-between items-center">
13 |       <Link href="/invoices" prefetch>
14 |         <h2 className="text-lg">Invoices</h2>
15 |       </Link>
16 |
17 |       <Button
18 |         variant="outline"
19 |         size="icon"
20 |         onClick={() => setParams({ type: "create" })}
21 |       >
22 |         <Icons.Add />
23 |       </Button>
24 |     </div>
25 |   );
26 | }
```

apps/dashboard/src/components/widgets/invoice/invoice-row.tsx
```
1 | "use client";
2 |
3 | import { FormatAmount } from "@/components/format-amount";
4 | import { InvoiceStatus } from "@/components/invoice-status";
5 | import { InvoiceDetailsSheet } from "@/components/sheets/invoice-details-sheet";
6 | import type { Invoice } from "@/components/tables/invoices/columns";
7 | import { getDueDateStatus } from "@/utils/format";
8 | import { formatDate } from "@/utils/format";
9 | import { cn } from "@midday/ui/cn";
10 | import { Skeleton } from "@midday/ui/skeleton";
11 | import { useState } from "react";
12 |
13 | type Props = {
14 |   invoice: Invoice;
15 | };
16 |
17 | export function InvoiceRowSkeleton() {
18 |   return (
19 |     <li className="h-[57px] flex items-center w-full">
20 |       <div className="flex items-center w-full">
21 |         <div className="flex flex-col space-y-1 w-1/4">
22 |           <Skeleton className="h-4 w-20" />
23 |           <Skeleton className="h-3 w-16" />
24 |         </div>
25 |
26 |         <div className="w-1/4">
27 |           <Skeleton className="h-5 w-16" />
28 |         </div>
29 |
30 |         <div className="w-1/4">
31 |           <Skeleton className="h-4 w-24" />
32 |         </div>
33 |
34 |         <div className="w-1/4 flex justify-end">
35 |           <Skeleton className="h-4 w-16" />
36 |         </div>
37 |       </div>
38 |     </li>
39 |   );
40 | }
41 |
42 | export function InvoiceRow({ invoice }: Props) {
43 |   const [isOpen, setOpen] = useState(false);
44 |
45 |   const showDate =
46 |     invoice.status === "unpaid" ||
47 |     invoice.status === "overdue" ||
48 |     invoice.status === "pending";
49 |
50 |   return (
51 |     <>
52 |       <li
53 |         key={invoice.id}
54 |         className="h-[57px] flex items-center w-full"
55 |         onClick={() => setOpen(true)}
56 |       >
57 |         <div className="flex items-center w-full">
58 |           <div className="flex flex-col space-y-1 w-1/4">
59 |             <span className="text-sm">
60 |               {invoice.due_date ? formatDate(invoice.due_date) : "-"}
61 |             </span>
62 |             {showDate && (
63 |               <span className="text-xs text-muted-foreground">
64 |                 {invoice.due_date ? getDueDateStatus(invoice.due_date) : "-"}
65 |               </span>
66 |             )}
67 |           </div>
68 |
69 |           <div className="w-1/4">
70 |             <InvoiceStatus status={invoice.status} />
71 |           </div>
72 |
73 |           <div className="w-1/4 text-sm">{invoice.customer?.name}</div>
74 |
75 |           <div
76 |             className={cn(
77 |               "w-1/4 flex justify-end text-sm",
78 |               invoice.status === "canceled" && "line-through",
79 |             )}
80 |           >
81 |             <FormatAmount amount={invoice.amount} currency={invoice.currency} />
82 |           </div>
83 |         </div>
84 |       </li>
85 |
86 |       <InvoiceDetailsSheet data={invoice} setOpen={setOpen} isOpen={isOpen} />
87 |     </>
88 |   );
89 | }
```

apps/dashboard/src/components/widgets/invoice/invoice-widget.tsx
```
1 | import { PaymentScoreVisualizer } from "@/components/payment-score-visualizer";
2 | import { getI18n } from "@/locales/server";
3 | import { getInvoices, getPaymentStatus } from "@midday/supabase/cached-queries";
4 | import { Skeleton } from "@midday/ui/skeleton";
5 | import { Invoice } from "./invoice";
6 | import { InvoiceRowSkeleton } from "./invoice-row";
7 |
8 | export function InvoiceWidgetSkeleton() {
9 |   return (
10 |     <div className="mt-8">
11 |       <div className="flex justify-between items-center p-3 py-2 border border-border">
12 |         <div className="w-1/2">
13 |           <div className="flex flex-col gap-2">
14 |             <Skeleton className="h-4 w-3/4" />
15 |             <Skeleton className="h-3 w-1/2" />
16 |           </div>
17 |         </div>
18 |       </div>
19 |       <div className="mt-4 space-y-2">
20 |         {Array.from({ length: 10 }).map((_, index) => (
21 |           <InvoiceRowSkeleton key={index.toString()} />
22 |         ))}
23 |       </div>
24 |     </div>
25 |   );
26 | }
27 |
28 | export async function InvoiceWidget() {
29 |   const [t, { data: paymentStatusData }, { data: invoicesData }] =
30 |     await Promise.all([getI18n(), getPaymentStatus(), getInvoices()]);
31 |
32 |   const { payment_status, score } = paymentStatusData ?? {};
33 |   const invoices = invoicesData ?? [];
34 |
35 |   return (
36 |     <div className="mt-8">
37 |       <div className="flex justify-between items-center p-3 py-2 border border-border">
38 |         <div>
39 |           <div className="flex flex-col gap-2">
40 |             <div>{t(`payment_status.${payment_status}`)}</div>
41 |             <div className="text-sm text-muted-foreground">Payment score</div>
42 |           </div>
43 |         </div>
44 |         <PaymentScoreVisualizer score={score} paymentStatus={payment_status} />
45 |       </div>
46 |
47 |       <Invoice invoices={invoices} />
48 |     </div>
49 |   );
50 | }
```

apps/dashboard/src/components/widgets/invoice/invoice.tsx
```
1 | import type { Invoice as InvoiceType } from "@/components/tables/invoices/columns";
2 | import { EmptyState } from "./empty-state";
3 | import { InvoiceRow } from "./invoice-row";
4 |
5 | type Props = {
6 |   invoices: InvoiceType[];
7 | };
8 |
9 | export function Invoice({ invoices }: Props) {
10 |   if (!invoices.length) {
11 |     return <EmptyState />;
12 |   }
13 |
14 |   return (
15 |     <ul className="bullet-none divide-y cursor-pointer overflow-auto scrollbar-hide aspect-square pb-32 mt-4">
16 |       {invoices?.map((invoice) => {
17 |         return <InvoiceRow key={invoice.id} invoice={invoice} />;
18 |       })}
19 |     </ul>
20 |   );
21 | }
```

apps/dashboard/src/components/widgets/tracker/index.tsx
```
1 | import { ErrorFallback } from "@/components/error-fallback";
2 | import { ErrorBoundary } from "next/dist/client/components/error-boundary";
3 | import { Suspense } from "react";
4 | import {
5 |   TrackerWidgetServer,
6 |   TrackerWidgetSkeleton,
7 | } from "./tracker-widget.server";
8 |
9 | type Props = {
10 |   date: string;
11 | };
12 |
13 | export function Tracker({ date }: Props) {
14 |   return (
15 |     <div className="border aspect-square overflow-hidden relative p-4 md:p-8">
16 |       <ErrorBoundary errorComponent={ErrorFallback}>
17 |         <Suspense fallback={<TrackerWidgetSkeleton key={date} />}>
18 |           <TrackerWidgetServer date={date} />
19 |         </Suspense>
20 |       </ErrorBoundary>
21 |     </div>
22 |   );
23 | }
```

apps/dashboard/src/components/widgets/tracker/tracker-header.tsx
```
1 | "use client";
2 |
3 | import { TrackerMonthSelect } from "@/components/tracker-month-select";
4 | import { secondsToHoursAndMinutes } from "@/utils/format";
5 | import Link from "next/link";
6 |
7 | type Props = {
8 |   totalDuration?: number;
9 | };
10 |
11 | export function TrackerHeader({ totalDuration }: Props) {
12 |   return (
13 |     <div className="flex justify-between">
14 |       <div>
15 |         <Link href="/tracker" prefetch>
16 |           <h2 className="text-lg">Tracker</h2>
17 |         </Link>
18 |         <span className="text-[#878787] text-sm">
19 |           {totalDuration ? secondsToHoursAndMinutes(totalDuration) : "0h"}
20 |         </span>
21 |       </div>
22 |
23 |       <TrackerMonthSelect />
24 |     </div>
25 |   );
26 | }
```

apps/dashboard/src/components/widgets/tracker/tracker-indicator.tsx
```
1 | import { cn } from "@midday/ui/cn";
2 |
3 | interface Props {
4 |   count: number;
5 |   isToday: boolean;
6 | }
7 |
8 | export function TrackerIndicator({ count, isToday }: Props) {
9 |   if (count === 1) {
10 |     return (
11 |       <div className="absolute bottom-2 left-3 right-3">
12 |         <div
13 |           className={cn("h-1 w-1/2 bg-border", isToday && "bg-background")}
14 |         />
15 |       </div>
16 |     );
17 |   }
18 |
19 |   if (count === 2) {
20 |     return (
21 |       <div className="absolute bottom-2 left-3 right-3 flex justify-center space-x-1">
22 |         <div
23 |           className={cn("h-1 w-1/2 bg-border", isToday && "bg-background")}
24 |         />
25 |         <div
26 |           className={cn("h-1 w-1/2 bg-border", isToday && "bg-background")}
27 |         />
28 |       </div>
29 |     );
30 |   }
31 |
32 |   if (count === 3) {
33 |     return (
34 |       <div className="absolute bottom-2 left-3 right-3 flex justify-center space-x-1">
35 |         <div
36 |           className={cn("h-1 w-1/2 bg-border", isToday && "bg-background")}
37 |         />
38 |         <div
39 |           className={cn("h-1 w-1/2 bg-border", isToday && "bg-background")}
40 |         />
41 |         <div
42 |           className={cn("h-1 w-1/2 bg-border", isToday && "bg-background")}
43 |         />
44 |       </div>
45 |     );
46 |   }
47 |
48 |   if (count > 3) {
49 |     return (
50 |       <div className="absolute bottom-2 left-3 right-3">
51 |         <div
52 |           className={cn("h-1 w-full bg-border", isToday && "bg-background")}
53 |         />
54 |       </div>
55 |     );
56 |   }
57 |
58 |   return null;
59 | }
```

apps/dashboard/src/components/widgets/tracker/tracker-widget.server.tsx
```
1 | import {
2 |   getTrackerRecordsByRange,
3 |   getUser,
4 | } from "@midday/supabase/cached-queries";
5 | import { endOfMonth, formatISO, startOfMonth } from "date-fns";
6 | import { TrackerHeader } from "./tracker-header";
7 | import { TrackerWidget } from "./tracker-widget";
8 |
9 | export function TrackerWidgetSkeleton() {
10 |   return <TrackerHeader />;
11 | }
12 |
13 | type Props = {
14 |   date?: string;
15 | };
16 |
17 | export async function TrackerWidgetServer({ date }: Props) {
18 |   const currentDate = date ?? formatISO(new Date(), { representation: "date" });
19 |
20 |   const [{ data: userData }, trackerData] = await Promise.all([
21 |     getUser(),
22 |     getTrackerRecordsByRange({
23 |       from: formatISO(startOfMonth(new Date(currentDate)), {
24 |         representation: "date",
25 |       }),
26 |       to: formatISO(endOfMonth(new Date(currentDate)), {
27 |         representation: "date",
28 |       }),
29 |     }),
30 |   ]);
31 |
32 |   return (
33 |     <TrackerWidget
34 |       data={trackerData?.data}
35 |       date={currentDate}
36 |       meta={trackerData?.meta}
37 |       weekStartsOnMonday={userData?.week_starts_on_monday}
38 |     />
39 |   );
40 | }
```

apps/dashboard/src/components/widgets/tracker/tracker-widget.tsx
```
1 | "use client";
2 |
3 | import { useTrackerParams } from "@/hooks/use-tracker-params";
4 | import { sortDates } from "@/utils/tracker";
5 | import { cn } from "@midday/ui/cn";
6 | import { useClickAway } from "@uidotdev/usehooks";
7 | import {
8 |   eachDayOfInterval,
9 |   endOfMonth,
10 |   endOfWeek,
11 |   format,
12 |   formatISO,
13 |   isToday,
14 |   startOfMonth,
15 |   startOfWeek,
16 | } from "date-fns";
17 | import { useEffect, useState } from "react";
18 | import { TrackerHeader } from "./tracker-header";
19 | import { TrackerIndicator } from "./tracker-indicator";
20 |
21 | type TrackerMeta = {
22 |   totalDuration?: number;
23 | };
24 |
25 | type TrackerRecord = {
26 |   id: string;
27 |   duration: number;
28 |   date: string;
29 | };
30 |
31 | type Props = {
32 |   date?: string;
33 |   meta?: TrackerMeta;
34 |   data?: Record<string, TrackerRecord[]>;
35 |   weekStartsOnMonday?: boolean;
36 | };
37 |
38 | export function TrackerWidget({
39 |   date: initialDate,
40 |   meta,
41 |   data,
42 |   weekStartsOnMonday = false,
43 | }: Props) {
44 |   const {
45 |     date: currentDate,
46 |     range,
47 |     setParams,
48 |     selectedDate,
49 |   } = useTrackerParams(initialDate);
50 |
51 |   const [isDragging, setIsDragging] = useState(false);
52 |   const [dragStart, setDragStart] = useState<string | null>(null);
53 |   const [dragEnd, setDragEnd] = useState<string | null>(null);
54 |
55 |   const monthStart = startOfMonth(currentDate);
56 |   const monthEnd = endOfMonth(currentDate);
57 |   const calendarStart = startOfWeek(monthStart, {
58 |     weekStartsOn: weekStartsOnMonday ? 1 : 0,
59 |   });
60 |   const calendarEnd = endOfWeek(monthEnd, {
61 |     weekStartsOn: weekStartsOnMonday ? 1 : 0,
62 |   });
63 |   const calendarDays = eachDayOfInterval({
64 |     start: calendarStart,
65 |     end: calendarEnd,
66 |   });
67 |
68 |   const sortedDates = sortDates(range ?? []);
69 |
70 |   const firstWeek = eachDayOfInterval({
71 |     start: calendarStart,
72 |     end: endOfWeek(calendarStart, { weekStartsOn: weekStartsOnMonday ? 1 : 0 }),
73 |   });
74 |
75 |   const ref = useClickAway<HTMLDivElement>(() => {
76 |     if (range?.length === 1) {
77 |       setParams({ range: null });
78 |     }
79 |   });
80 |
81 |   const getEventCount = (date: Date) => {
82 |     return data?.[formatISO(date, { representation: "date" })]?.length ?? 0;
83 |   };
84 |
85 |   const handleMouseDown = (date: Date) => {
86 |     setIsDragging(true);
87 |     const dateStr = formatISO(date, { representation: "date" });
88 |     setDragStart(dateStr);
89 |     setDragEnd(null);
90 |     setParams({ range: [dateStr] });
91 |   };
92 |
93 |   const handleMouseEnter = (date: Date) => {
94 |     if (isDragging) {
95 |       setDragEnd(formatISO(date, { representation: "date" }));
96 |     }
97 |   };
98 |
99 |   const handleMouseUp = () => {
100 |     setIsDragging(false);
101 |     if (dragStart && dragEnd) {
102 |       setParams({
103 |         range: [dragStart, dragEnd].sort(),
104 |       });
105 |     } else if (dragStart) {
106 |       setParams({ selectedDate: dragStart, range: null });
107 |     }
108 |     setDragStart(null);
109 |     setDragEnd(null);
110 |   };
111 |
112 |   useEffect(() => {
113 |     const handleGlobalMouseUp = () => {
114 |       if (isDragging) {
115 |         handleMouseUp();
116 |       }
117 |     };
118 |
119 |     document.addEventListener("mouseup", handleGlobalMouseUp);
120 |     return () => {
121 |       document.removeEventListener("mouseup", handleGlobalMouseUp);
122 |     };
123 |   }, [isDragging, dragStart, dragEnd]);
124 |
125 |   return (
126 |     <div ref={ref}>
127 |       <TrackerHeader totalDuration={meta?.totalDuration} />
128 |
129 |       <div className="mt-4">
130 |         <div className="grid grid-cols-7 gap-px border border-border bg-border">
131 |           {firstWeek.map((day) => (
132 |             <div
133 |               key={day.toString()}
134 |               className="py-4 px-3 bg-background text-xs font-medium text-[#878787] font-mono"
135 |             >
136 |               {format(day, "EEE").toUpperCase()}
137 |             </div>
138 |           ))}
139 |           {calendarDays.map((date, index) => {
140 |             const isCurrentMonth =
141 |               new Date(date).getMonth() === new Date(currentDate).getMonth();
142 |             const dateStr = formatISO(date, { representation: "date" });
143 |             const isInDragRange =
144 |               dragStart &&
145 |               dragEnd &&
146 |               ((dateStr >= dragStart && dateStr <= dragEnd) ||
147 |                 (dateStr <= dragStart && dateStr >= dragEnd));
148 |
149 |             return (
150 |               <button
151 |                 type="button"
152 |                 onMouseDown={() => handleMouseDown(date)}
153 |                 onMouseEnter={() => handleMouseEnter(date)}
154 |                 key={index.toString()}
155 |                 className={cn(
156 |                   "pt-2 pb-5 px-3 font-mono text-sm relative transition-all duration-100 text-left aspect-square",
157 |                   isCurrentMonth && isToday(date)
158 |                     ? "bg-[#f0f0f0] dark:bg-[#202020]"
159 |                     : "bg-background",
160 |                   !isCurrentMonth &&
161 |                     "bg-[repeating-linear-gradient(-60deg,#DBDBDB,#DBDBDB_1px,transparent_1px,transparent_5px)] dark:bg-[repeating-linear-gradient(-60deg,#2C2C2C,#2C2C2C_1px,transparent_1px,transparent_5px)]",
162 |                   selectedDate === dateStr && "ring-1 ring-primary",
163 |                   (range?.includes(dateStr) ||
164 |                     (sortedDates.length === 2 &&
165 |                       date >= new Date(sortedDates[0] || 0) &&
166 |                       date <= new Date(sortedDates[1] || 0))) &&
[TRUNCATED]
```

apps/dashboard/src/components/widgets/vault/index.tsx
```
1 | import { ErrorFallback } from "@/components/error-fallback";
2 | import { ErrorBoundary } from "next/dist/client/components/error-boundary";
3 | import { Suspense } from "react";
4 | import {
5 |   VaultWidget,
6 |   VaultWidgetHeader,
7 |   VaultWidgetSkeleton,
8 | } from "./vault-widget";
9 |
10 | export function Vault() {
11 |   return (
12 |     <div className="border aspect-square overflow-hidden relative p-4 md:p-8">
13 |       <VaultWidgetHeader />
14 |
15 |       <ErrorBoundary errorComponent={ErrorFallback}>
16 |         <Suspense fallback={<VaultWidgetSkeleton />}>
17 |           <VaultWidget />
18 |         </Suspense>
19 |       </ErrorBoundary>
20 |     </div>
21 |   );
22 | }
```

apps/dashboard/src/components/widgets/vault/vault-widget.tsx
```
1 | import { getUser } from "@midday/supabase/cached-queries";
2 | import { getVaultActivityQuery } from "@midday/supabase/queries";
3 | import { createClient } from "@midday/supabase/server";
4 | import Link from "next/link";
5 | import { Vault } from "./vault";
6 |
7 | export function VaultWidgetSkeleton() {
8 |   return null;
9 | }
10 |
11 | export function VaultWidgetHeader() {
12 |   return (
13 |     <div>
14 |       <Link href="/vault" prefetch>
15 |         <h2 className="text-lg">Recent files</h2>
16 |       </Link>
17 |       <div className="flex py-3 border-b-[1px] justify-between mt-4">
18 |         <span className="font-medium text-sm">Name</span>
19 |         <span className="font-medium text-sm">Tag</span>
20 |       </div>
21 |     </div>
22 |   );
23 | }
24 |
25 | export async function VaultWidget() {
26 |   const supabase = createClient();
27 |   const { data: userData } = await getUser();
28 |
29 |   const { data: storageData } = await getVaultActivityQuery(
30 |     supabase,
31 |     userData?.team_id,
32 |   );
33 |
34 |   const files = storageData
35 |     ?.filter((file) => file?.path_tokens.pop() !== ".emptyFolderPlaceholder")
36 |     .map((file) => {
37 |       const [_, ...pathWithoutTeamId] = file?.path_tokens ?? [];
38 |
39 |       return {
40 |         id: file.id,
41 |         name: file.name?.split("/").at(-1),
42 |         path: file.path_tokens,
43 |         mimetype: file.metadata?.mimetype,
44 |         team_id: file.team_id,
45 |         tag: file.tag,
46 |         filePath: pathWithoutTeamId?.join("/"),
47 |       };
48 |     });
49 |
50 |   if (!files?.length) {
51 |     return (
52 |       <div className="flex items-center justify-center aspect-square">
53 |         <p className="text-sm text-[#606060] -mt-12">No files found</p>
54 |       </div>
55 |     );
56 |   }
57 |
58 |   return <Vault files={files} />;
59 | }
```

apps/dashboard/src/components/widgets/vault/vault.tsx
```
1 | import { FilePreview } from "@/components/file-preview";
2 | import { Tag } from "@/components/tables/vault/tag";
3 | import {
4 |   HoverCard,
5 |   HoverCardContent,
6 |   HoverCardTrigger,
7 | } from "@midday/ui/hover-card";
8 | import { isSupportedFilePreview } from "@midday/utils";
9 |
10 | type Props = {
11 |   files: {
12 |     id: string;
13 |     name: string;
14 |     tag?: string;
15 |     mimetype: string;
16 |     team_id: string;
17 |     filePath: string;
18 |   }[];
19 | };
20 |
21 | export function Vault({ files }: Props) {
22 |   return (
23 |     <ul className="bullet-none divide-y cursor-pointer overflow-auto scrollbar-hide aspect-square pb-24">
24 |       {files?.map((file) => {
25 |         const filePreviewSupported = isSupportedFilePreview(file.mimetype);
26 |
27 |         return (
28 |           <li key={file.id}>
29 |             <HoverCard openDelay={200}>
30 |               <HoverCardTrigger asChild>
31 |                 <div className="flex items-center py-3">
32 |                   <div className="w-[55%]">
33 |                     <span className="text-sm line-clamp-1">{file.name}</span>
34 |                   </div>
35 |
36 |                   <div className="ml-auto w-[40%] flex justify-end">
37 |                     <Tag name={file.tag} />
38 |                   </div>
39 |                 </div>
40 |               </HoverCardTrigger>
41 |               {filePreviewSupported && (
42 |                 <HoverCardContent className="w-[273px] h-[358px] p-0 overflow-hidden">
43 |                   <FilePreview
44 |                     width={280}
45 |                     height={365}
46 |                     src={`/api/proxy?filePath=vault/${file.team_id}/${file.filePath}/${file.name}`}
47 |                     downloadUrl={`/api/download/file?path=${file.filePath}/${file.name}&filename=${file.name}`}
48 |                     name={file.name}
49 |                     type={file?.mimetype}
50 |                   />
51 |                 </HoverCardContent>
52 |               )}
53 |             </HoverCard>
54 |           </li>
55 |         );
56 |       })}
57 |     </ul>
58 |   );
59 | }
```

apps/engine/src/providers/gocardless/__snapshots__/transform.test.ts.snap
```
1 | // Bun Snapshot v1, https://goo.gl/fbAQLP
2 |
3 | exports[`Transform income transaction 1`] = `
4 | {
5 |   "amount": -38000,
6 |   "balance": null,
7 |   "category": "transfer",
8 |   "currency": "SEK",
9 |   "currency_rate": null,
10 |   "currency_source": null,
11 |   "date": "2024-02-23",
12 |   "description": null,
13 |   "id": "86b1bc36e6a6d2a5dee8ff7138920255",
14 |   "method": "transfer",
15 |   "name": "Lön 160434262327",
16 |   "status": "posted",
17 | }
18 | `;
19 |
20 | exports[`Transform accounts 1`] = `
21 | {
22 |   "balance": {
23 |     "amount": 1942682.86,
24 |     "currency": "SEK",
25 |   },
26 |   "currency": "SEK",
27 |   "enrollment_id": null,
28 |   "id": "b11e5627-cac8-41c9-a74a-2b88438fe07d",
29 |   "institution": {
30 |     "id": "PLEO_PLEODK00",
31 |     "logo": "https://cdn-engine.midday.ai/PLEO_PLEODK00.png",
32 |     "name": "Pleo",
33 |     "provider": "gocardless",
34 |   },
35 |   "name": "Pleo Account",
36 |   "resource_id": "3133",
37 |   "type": "depository",
38 | }
39 | `;
40 |
41 | exports[`Transform account balance 1`] = `
42 | {
43 |   "amount": 1942682.86,
44 |   "currency": "SEK",
45 | }
46 | `;
```

apps/engine/src/providers/plaid/__snapshots__/transform.test.ts.snap
```
1 | // Bun Snapshot v1, https://goo.gl/fbAQLP
2 |
3 | exports[`Transform pending transaction 1`] = `
4 | {
5 |   "amount": -5.4,
6 |   "balance": null,
7 |   "category": "travel",
8 |   "currency": "CAD",
9 |   "currency_rate": null,
10 |   "currency_source": null,
11 |   "date": "2024-02-24",
12 |   "description": "Uber",
13 |   "id": "NxkDjlyk45cQoDm5PEqJuKJaw6qrj9cy89zBA",
14 |   "method": "other",
15 |   "name": "Uber 063015 SF**POOL**",
16 |   "status": "pending",
17 | }
18 | `;
19 |
20 | exports[`Transform income transaction 1`] = `
21 | {
22 |   "amount": -1500,
23 |   "balance": null,
24 |   "category": "travel",
25 |   "currency": "CAD",
26 |   "currency_rate": null,
27 |   "currency_source": null,
28 |   "date": "2024-02-22",
29 |   "description": null,
30 |   "id": "5QKmMdaKWgtzkvKEPmqriLZR1mV3kMF5X9EeX",
31 |   "method": "other",
32 |   "name": "United Airlines",
33 |   "status": "posted",
34 | }
35 | `;
36 |
37 | exports[`Transform type transfer 1`] = `
38 | {
39 |   "amount": -31.53,
40 |   "balance": null,
41 |   "category": "travel",
42 |   "currency": "CAD",
43 |   "currency_rate": null,
44 |   "currency_source": null,
45 |   "date": "2024-02-24",
46 |   "description": "Uber",
47 |   "id": "NxkDjlyk45cQoDm5PEqJuKJaw6qrj9cy89zBA",
48 |   "method": "transfer",
49 |   "name": "Uber 063015 SF**POOL**",
50 |   "status": "pending",
51 | }
52 | `;
53 |
54 | exports[`Transform accounts 1`] = `
55 | {
56 |   "balance": {
57 |     "amount": 56302.06,
58 |     "currency": "CAD",
59 |   },
60 |   "currency": "CAD",
61 |   "enrollment_id": null,
62 |   "id": "kKZWQnoZVqcBeN71qdyoh8mVoErgb7tL7gmBL",
63 |   "institution": {
64 |     "id": "ins_100546",
65 |     "logo": "https://cdn-engine.midday.ai/ins_100546.jpg",
66 |     "name": "American Funds Retirement Solutions",
67 |     "provider": "plaid",
68 |   },
69 |   "name": "Plaid Mortgage",
70 |   "resource_id": null,
71 |   "type": "other_asset",
72 | }
73 | `;
74 |
75 | exports[`Transform account balance 1`] = `
76 | {
77 |   "amount": 2000,
78 |   "currency": "USD",
79 | }
80 | `;
```

apps/engine/src/providers/teller/__snapshots__/transform.test.ts.snap
```
1 | // Bun Snapshot v1, https://goo.gl/fbAQLP
2 |
3 | exports[`Transform pending transaction 1`] = `
4 | {
5 |   "amount": -83.62,
6 |   "balance": null,
7 |   "category": null,
8 |   "currency": "USD",
9 |   "currency_rate": null,
10 |   "currency_source": null,
11 |   "date": "2024-03-05",
12 |   "description": "Bank Of Many",
13 |   "id": "txn_os41r5u90e29shubl2000",
14 |   "method": "other",
15 |   "name": "Online Check Deposit",
16 |   "status": "pending",
17 | }
18 | `;
19 |
20 | exports[`Transform pending transaction 2`] = `
21 | {
22 |   "amount": -29,
23 |   "balance": null,
24 |   "category": null,
25 |   "currency": "USD",
26 |   "currency_rate": null,
27 |   "currency_source": null,
28 |   "date": "2024-03-05",
29 |   "description": "Bank Of Many",
30 |   "id": "txn_os41r5u90e29shubl2000",
31 |   "method": "other",
32 |   "name": "Technology",
33 |   "status": "pending",
34 | }
35 | `;
36 |
37 | exports[`Transform card payment transaction 1`] = `
38 | {
39 |   "amount": -68.9,
40 |   "balance": 83431.46,
41 |   "category": null,
42 |   "currency": "USD",
43 |   "currency_rate": null,
44 |   "currency_source": null,
45 |   "date": "2024-03-01",
46 |   "description": null,
47 |   "id": "txn_os41r5u90e29shubl2005",
48 |   "method": "card_purchase",
49 |   "name": "Nordstrom",
50 |   "status": "posted",
51 | }
52 | `;
53 |
54 | exports[`Transform income transaction 1`] = `
55 | {
56 |   "amount": 1000000,
57 |   "balance": 83296.4,
58 |   "category": "income",
59 |   "currency": "USD",
60 |   "currency_rate": null,
61 |   "currency_source": null,
62 |   "date": "2024-03-03",
63 |   "description": null,
64 |   "id": "txn_os41r5u90e29shubl2002",
65 |   "method": "card_purchase",
66 |   "name": "Exxon Mobil",
67 |   "status": "posted",
68 | }
69 | `;
70 |
71 | exports[`Transform type transfer 1`] = `
72 | {
73 |   "amount": -37.99,
74 |   "balance": 85897.25,
75 |   "category": null,
76 |   "currency": "USD",
77 |   "currency_rate": null,
78 |   "currency_source": null,
79 |   "date": "2024-01-27",
80 |   "description": "Yourself",
81 |   "id": "txn_os41r5ua0e29shubl2001",
82 |   "method": "transfer",
83 |   "name": "Recurring Transfer To Savings",
84 |   "status": "posted",
85 | }
86 | `;
87 |
88 | exports[`Transform accounts 1`] = `
89 | {
90 |   "balance": {
91 |     "amount": 2011100,
92 |     "currency": "USD",
93 |   },
94 |   "currency": "USD",
95 |   "enrollment_id": "enr_os557c8pck2deoskak000",
96 |   "id": "acc_os557c2mge29shubl2000",
97 |   "institution": {
98 |     "id": "mercury",
99 |     "logo": "https://cdn-engine.midday.ai/mercury.jpg",
100 |     "name": "Mercury",
101 |     "provider": "teller",
102 |   },
103 |   "name": "Platinum Card",
104 |   "resource_id": null,
105 |   "type": "credit",
106 | }
107 | `;
108 |
109 | exports[`Transform account balance 1`] = `
110 | {
111 |   "amount": 2011100,
112 |   "currency": "USD",
113 | }
114 | `;
```

apps/website/src/app/components/editor/page.tsx
```
1 | import { Editor } from "@midday/ui/editor";
2 | import type { Metadata } from "next";
3 |
4 | export const metadata: Metadata = {
5 |   title: "Editor | Midday",
6 |   description: "A rich text editor with AI tools powered by Vercel AI SDK.",
7 | };
8 |
9 | const defaultContent = `
10 | <h2>Introducing Midday Editor</h2>
11 |
12 | <p>We have developed a text editor based on Tiptap, which is a core component of our Invoicing feature. This editor has been enhanced with AI capabilities using the Vercel AI SDK, allowing for intelligent text processing and generation. After extensive internal use and refinement, we have now released this editor as an open-source tool for the wider developer community.</p>
13 |
14 | <br />
15 |
16 | <strong>Easy Integration</strong>
17 |
18 | <p>To ensure seamless integration and consistency within your codebase, we've made it easy to add the Midday Editor to your project. You can simply copy and paste the necessary code from our dedicated documentation. This method allows you to quickly incorporate all required dependencies and components directly into your project repository.</p>
19 |
20 | <br />
21 |
22 | <p>We're actively working on adding the Midday Editor to the shadcn/cli, which will soon allow you to install it with just one command. Stay tuned for this upcoming feature!</p>
23 |
24 | <br />
25 |
26 | <strong>Ongoing Development</strong>
27 |
28 | <p>As we continue to develop and expand Midday's features, we're constantly adding new functionality to the editor. Our team is committed to enhancing its capabilities, improving performance, and introducing innovative AI-powered tools to make your editing experience even more powerful and efficient.</p>
29 |
30 | <br />
31 | `;
32 |
33 | export default function Page() {
34 |   return (
35 |     <div className="container mt-24 max-w-[540px]">
36 |       <Editor initialContent={defaultContent} />
37 |
38 |       <div className="mt-8">
39 |         <div className="border bg-card text-card-foreground shadow-sm">
40 |           <div className="flex flex-col space-y-1.5 p-6">
41 |             <h3 className="text-xl font-medium">Install Midday Editor</h3>
42 |             <p className="text-sm text-[#878787]">
43 |               Get started with our powerful AI-enhanced text editor
44 |             </p>
45 |           </div>
46 |           <div className="p-6 pt-0">
47 |             <a
48 |               href="https://go.midday.ai/editor-code"
49 |               target="_blank"
50 |               rel="noopener noreferrer"
51 |               className="inline-flex items-center justify-center text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
52 |             >
53 |               View implementation
54 |             </a>
55 |           </div>
56 |         </div>
57 |       </div>
58 |     </div>
59 |   );
60 | }
```

apps/website/src/app/components/invoice/page.tsx
```
1 | import type { Metadata } from "next";
2 | import Image from "next/image";
3 | import invoice from "public/images/update/invoice-pdf/pdf-invoice.jpg";
4 |
5 | export const metadata: Metadata = {
6 |   title: "React PDF Invoice Template | Midday",
7 |   description: "A React PDF invoice template with Tiptap JSON support.",
8 | };
9 |
10 | export default function Page() {
11 |   return (
12 |     <div className="container mt-24 max-w-[540px]">
13 |       <Image src={invoice} alt="Invoice" />
14 |       <div className="mt-8">
15 |         <div className="border bg-card text-card-foreground shadow-sm">
16 |           <div className="flex flex-col space-y-1.5 p-6">
17 |             <h3 className="text-xl font-medium">Use Midday Invoice Template</h3>
18 |             <p className="text-sm text-[#878787]">
19 |               Get started with our powerful React PDF invoice template
20 |             </p>
21 |           </div>
22 |           <div className="p-6 pt-0">
23 |             <a
24 |               href="https://go.midday.ai/inv"
25 |               target="_blank"
26 |               rel="noopener noreferrer"
27 |               className="inline-flex items-center justify-center text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
28 |             >
29 |               View implementation
30 |             </a>
31 |           </div>
32 |         </div>
33 |       </div>
34 |     </div>
35 |   );
36 | }
```

apps/website/src/app/components/invoice-og/page.tsx
```
1 | import type { Metadata } from "next";
2 | import Image from "next/image";
3 | import ogInvoice from "../invoice-og.png";
4 |
5 | export const metadata: Metadata = {
6 |   title: "Open Graph Template | Midday",
7 |   description: "A Next.js Open Graph template for invoices.",
8 | };
9 |
10 | export default function Page() {
11 |   return (
12 |     <div className="container mt-24 max-w-[540px]">
13 |       <Image src={ogInvoice} alt="Invoice" className="border border-border" />
14 |       <div className="mt-8">
15 |         <div className="border bg-card text-card-foreground shadow-sm">
16 |           <div className="flex flex-col space-y-1.5 p-6">
17 |             <h3 className="text-xl font-medium">Open Graph Template</h3>
18 |             <p className="text-sm text-[#878787]">
19 |               Get started with our Next.js Open Graph template
20 |             </p>
21 |           </div>
22 |           <div className="p-6 pt-0">
23 |             <a
24 |               href="https://go.midday.ai/inv-og"
25 |               target="_blank"
26 |               rel="noopener noreferrer"
27 |               className="inline-flex items-center justify-center text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
28 |             >
29 |               View implementation
30 |             </a>
31 |           </div>
32 |         </div>
33 |       </div>
34 |     </div>
35 |   );
36 | }
```

apps/website/src/app/components/invoice-react/page.tsx
```
1 | import type { Metadata } from "next";
2 | import Image from "next/image";
3 | import invoice from "./invoice-react.jpg";
4 |
5 | export const metadata: Metadata = {
6 |   title: "React Invoice Template | Midday",
7 |   description: "A React invoice template with Tiptap JSON support.",
8 | };
9 |
10 | export default function Page() {
11 |   return (
12 |     <div className="container mt-24 max-w-[540px]">
13 |       <Image src={invoice} alt="Invoice" className="border border-border" />
14 |       <div className="mt-8">
15 |         <div className="border bg-card text-card-foreground shadow-sm">
16 |           <div className="flex flex-col space-y-1.5 p-6">
17 |             <h3 className="text-xl font-medium">Use Midday Invoice Template</h3>
18 |             <p className="text-sm text-[#878787]">
19 |               Get started with our powerful React invoice template
20 |             </p>
21 |           </div>
22 |           <div className="p-6 pt-0">
23 |             <a
24 |               href="https://go.midday.ai/inv-react"
25 |               target="_blank"
26 |               rel="noopener noreferrer"
27 |               className="inline-flex items-center justify-center text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
28 |             >
29 |               View implementation
30 |             </a>
31 |           </div>
32 |         </div>
33 |       </div>
34 |     </div>
35 |   );
36 | }
```

apps/website/src/app/components/invoice-toolbar/page.tsx
```
1 | import type { Metadata } from "next";
2 | import Image from "next/image";
3 | import invoiceToolbar from "../invoice-toolbar.png";
4 |
5 | export const metadata: Metadata = {
6 |   title: "Invoice Toolbar | Midday",
7 |   description: "A Next.js Invoice Toolbar for invoices.",
8 | };
9 |
10 | export default function Page() {
11 |   return (
12 |     <div className="container mt-24 max-w-[540px]">
13 |       <div className="py-[200px] flex items-center justify-center">
14 |         <Image
15 |           src={invoiceToolbar}
16 |           alt="Invoice Toolbar"
17 |           className="max-w-[240px]"
18 |         />
19 |       </div>
20 |       <div className="mt-8">
21 |         <div className="border bg-card text-card-foreground shadow-sm">
22 |           <div className="flex flex-col space-y-1.5 p-6">
23 |             <h3 className="text-xl font-medium">Invoice Toolbar</h3>
24 |             <p className="text-sm text-[#878787]">
25 |               Get started with our Invoice Toolbar
26 |             </p>
27 |           </div>
28 |           <div className="p-6 pt-0">
29 |             <a
30 |               href="https://go.midday.ai/83E5GCe"
31 |               target="_blank"
32 |               rel="noopener noreferrer"
33 |               className="inline-flex items-center justify-center text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
34 |             >
35 |               View implementation
36 |             </a>
37 |           </div>
38 |         </div>
39 |       </div>
40 |     </div>
41 |   );
42 | }
```

apps/website/src/app/updates/[slug]/page.tsx
```
1 | import { baseUrl } from "@/app/sitemap";
2 | import { CustomMDX } from "@/components/mdx";
3 | import { PostAuthor } from "@/components/post-author";
4 | import { PostStatus } from "@/components/post-status";
5 | import { getBlogPosts } from "@/lib/blog";
6 | import type { Metadata } from "next";
7 | import Image from "next/image";
8 | import { notFound } from "next/navigation";
9 |
10 | export async function generateStaticParams() {
11 |   const posts = getBlogPosts();
12 |
13 |   return posts.map((post) => ({
14 |     slug: post.slug,
15 |   }));
16 | }
17 |
18 | export async function generateMetadata(props): Promise<Metadata | undefined> {
19 |   const params = await props.params;
20 |   const post = getBlogPosts().find((post) => post.slug === params.slug);
21 |   if (!post) {
22 |     return;
23 |   }
24 |
25 |   const {
26 |     title,
27 |     publishedAt: publishedTime,
28 |     summary: description,
29 |     image,
30 |   } = post.metadata;
31 |
32 |   return {
33 |     title,
34 |     description,
35 |     openGraph: {
36 |       title,
37 |       description,
38 |       type: "article",
39 |       publishedTime,
40 |       url: `${baseUrl}/blog/${post.slug}`,
41 |       images: [
42 |         {
43 |           url: image,
44 |         },
45 |       ],
46 |     },
47 |     twitter: {
48 |       card: "summary_large_image",
49 |       title,
50 |       description,
51 |       images: [image],
52 |     },
53 |   };
54 | }
55 |
56 | export default async function Page(props: {
57 |   params: Promise<{ slug: string }>;
58 | }) {
59 |   const params = await props.params;
60 |
61 |   const { slug } = params;
62 |
63 |   const post = getBlogPosts().find((post) => post.slug === slug);
64 |
65 |   if (!post) {
66 |     notFound();
67 |   }
68 |
69 |   return (
70 |     <div className="container max-w-[1140px] flex justify-center">
71 |       <script
72 |         type="application/ld+json"
73 |         suppressHydrationWarning
74 |         dangerouslySetInnerHTML={{
75 |           __html: JSON.stringify({
76 |             "@context": "https://schema.org",
77 |             "@type": "BlogPosting",
78 |             headline: post.metadata.title,
79 |             datePublished: post.metadata.publishedAt,
80 |             dateModified: post.metadata.publishedAt,
81 |             description: post.metadata.summary,
82 |             image: `${baseUrl}${post.metadata.image}`,
83 |             url: `${baseUrl}/updates/${post.slug}`,
84 |           }),
85 |         }}
86 |       />
87 |
88 |       <article className="max-w-[680px] pt-[80px] md:pt-[150px] w-full">
89 |         <PostStatus status={post.metadata.tag} />
90 |
91 |         <h2 className="font-medium text-2xl mb-6">{post.metadata.title}</h2>
92 |
93 |         <div className="updates">
94 |           {post.metadata.image && (
95 |             <Image
96 |               src={post.metadata.image}
97 |               alt={post.metadata.title}
98 |               width={680}
99 |               height={442}
100 |               className="mb-12"
101 |             />
102 |           )}
103 |           <CustomMDX source={post.content} />
104 |         </div>
105 |
106 |         <div className="mt-10">
107 |           <PostAuthor author="pontus" />
108 |         </div>
109 |       </article>
110 |     </div>
111 |   );
112 | }
```

apps/website/src/app/updates/posts/apps.mdx
```
1 | ---
2 | title: "Introducing Apps"
3 | publishedAt: "2024-09-29"
4 | summary: "We are excited to announce the launch of Apps in the Midday. You can now easily connect your favorite tools to streamline your workflow."
5 | image: "/images/update/apps/apps.jpg"
6 | tag: "Updates"
7 | ---
8 |
9 | We are excited to announce the launch of Apps in Midday. You can now easily connect your favorite tools to streamline your workflow. Starting with Slack, we will continue to expand to other tools that you love.
10 | <br />
11 |
12 |
13 | ## Install Apps
14 | ![Apps overview](/images/update/apps/apps-1.png)
15 | <br />
16 | There is a new Apps menu in the sidebar. Here you can find all the apps available to you.
17 |
18 | To install an app, you can either click the "Install" button, or click the "Details" button to learn more about the app.
19 |
20 | <br />
21 | ## App Details
22 | ![App details](/images/update/apps/apps-2.png)
23 | <br />
24 |
25 | You can read more about the specific app in the details page, in this example we are looking at the Slack app that will enable you to connect your Slack workspace to Midday and get notifications about new transactions and give you Midday Assistant right in your Slack workspace.
26 |
27 |
28 | <br/>
29 | ## Slack Assistant
30 | ![Slack Assistant](/images/update/apps/slack.png)
31 | <br />
32 |
33 | In the example above we are using the Slack Assistant to send a message to the channel. You can use the Slack Assistant to know your burn rate, track your expenses, and get insights about your transactions.
34 |
35 | You can also upload receipts and invoices to Midday right from Slack and we will extract the data and match it to your transactions.
36 | <br />
37 | While this is just the beginning, we are excited to bring more apps to you.
38 | <br />
39 | <br />
40 |
41 | [Sign up for an account](https://app.midday.ai) and start using Midday today.
```

apps/website/src/app/updates/posts/assistant.mdx
```
1 | ---
2 | title: "Introducing Midday Assistant"
3 | publishedAt: "2024-05-20"
4 | summary: "Our most requested feature is now ready for you to try! Introducing Midday Assistant. With help from the community, we have implemented many great features."
5 | image: "/images/assistant.png"
6 | tag: "Updates"
7 | ---
8 |
9 | Our most requested feature is now ready for you to try! Introducing Midday Assistant. With help from the community, we have implemented many great features. Here are some highlights of what you can do using the assistant today:
10 |
11 | <br />
12 |
13 | - Find the things you are looking for (transactions, invoices, documents, and more)
14 | - Watch your spending
15 | - View your profit, revenue, burn rate, and revenue graphs
16 | - Find transactions without receipts
17 |
18 | <br />
19 | These are just some examples. You can ask follow-up questions and dig deeper into
20 | your data.
21 |
22 | <br />
23 |
24 | This is just the beginning of Midday Assistant, and we will continue to invest and listen to your feedback so you have everything you need to run your business. Don't hesitate to give us feedback directly from the assistant or by scheduling a quick [15-minute call](https://cal.com/pontus-midday/15min) with us to share your thoughts!
25 |
26 | <br />
27 | If you are running Midday on Mac, you should update to `v1.9` for the latest version.
28 |
29 | <br />
30 |
31 | To get started you can [sign in here](https://app.midday.ai).
```

apps/website/src/app/updates/posts/august-product-updates.mdx
```
1 | ---
2 | title: "August Product Update"
3 | publishedAt: "2024-09-03"
4 | summary: "In this release, we're introducing three major updates along with a few helpful additions. You'll enjoy a much better vault experience with search and filters, document classifications, and significantly improved speed. Plus, we've added AI filters for transactions and a much better import feature."
5 | tag: "Updates"
6 | ---
7 |
8 | In this release, we're introducing three major updates along with a few helpful additions. You'll enjoy a much better vault experience with search and filters, document classifications, and significantly improved speed. Plus, we've added AI filters for transactions and a much better import feature.
9 | <br />
10 |
11 |
12 | ## Vault
13 | ![Vault](/images/update/august-product-updates/vault.jpg)
14 | <br />
15 | We have rebuilt our Vault to be much faster, added a search where you can search for content within your documents, plus we have added the option for you to enable classifications of documents, for example invoices and receipts, so it's easy to filter.
16 |
17 | #### Search and filters
18 | We extract information and make your documents easy to find by simply searching for what you are looking for.
19 |
20 | #### Classifications (off by default)
21 | With the help of AI, we can classify your documents for an even easier way to find and identify them. You can enable this feature in your Vault settings.
22 |
23 | <br />
24 | <br />
25 |
26 | ## Import transactions
27 | ![Import transactions](/images/update/august-product-updates/import.jpg)
28 | <br />
29 | We have updated our import solution to support CSV, PDF, and screenshots of transactions to help as many users as possible get started with Midday.
30 |
31 | #### AI Mapping
32 | We have updated our UI to support manual override on mapping fields when we can't figure them out for you.
33 |
34 | #### Screenshots and PDFs
35 | We added support for uploading images of transactions to assist users whose banks don't have CSV files available.
36 |
37 | #### Create Transaction
38 | You can also manually create transactions from the transactions page.
39 |
40 | <br />
41 | <br />
42 |
43 | ## Filters for transactions
44 | ![Filters](/images/update/august-product-updates/filters.jpg)
45 | <br />
46 | It's now easier than ever to find the transaction you are looking for, or filter based on a specific date range. For example, you can search for: "Transactions from Q1 this year without receipts". You get what I mean - give it a try and let us know what you think.
47 |
48 | <br />
49 | ### Updated filters
50 | A much cleaner look, context-based filters, and the ability to navigate them using your keyboard for fast access.
51 |
52 | #### Bulk actions
53 | Sometimes, you want to change many transactions at the same time. We have now updated the UI to be much better for this purpose.
54 |
55 | <br />
56 | <br />
57 |
58 | ## What's coming next
59 |
60 | ![Time Tracker](/images/update/august-product-updates/tracker.jpg)
61 | <br />
62 | #### Time Tracker
63 | Our time tracker is getting a much-needed UI update that's much easier to understand and navigate. Along with that, our native app will also get a timer and command menu.
64 |
65 | <br />
66 | <br />
67 |
68 | ![Invoicing](/images/update/august-product-updates/invoice.jpg)
69 | <br />
70 | #### Invoicing
71 | Viktor is working hard on the design and prototyping extensively to create the best possible experience with creating invoices. We will update you all along the way, and we are really excited to deliver this feature to all of you soon!
72 |
73 |
74 | <br />
75 |
76 | Give these a try and let us know what you think [get started here](https://app.midday.ai).
```

apps/website/src/app/updates/posts/dub.mdx
```
1 | ---
2 | title: "How we implemented link-sharing using Dub.co"
3 | publishedAt: "2024-04-04"
4 | summary: "We have some features like Time Tracker, Reports and files from Vault that our users shares outside their company and with that we have an authorization layer on our side using Supabase, but these links are often really long because they include a unique token."
5 | image: "/images/dub.png"
6 | tag: "Engineering"
7 | ---
8 |
9 | Earlier this week [Dub.co](http://Dub.co) shared our [customer story](https://dub.co/customers/midday) on why we choose Dub as our link-sharing infrastructure.
10 |
11 | <br />
12 | In this blog post where gonna share a little more in details how we implemented this
13 | functionality.
14 |
15 | <br />
16 | We have some features like Time Tracker, Reports and files from Vault that our users
17 | shares outside their company and with that we have an authorization layer on our
18 | side using Supabase, but these links are often really long because they include a
19 | unique token.
20 | <br />
21 | Our solution was to implement Dub to generate unique short URLs.
22 |
23 | <br />
24 | ### How we implemented sharing for our reports
25 |
26 | <br />
27 | ![Midday - Overview](/images/overview.png)
28 |
29 | <br />
30 | If you look closely you can se our link looks like this: [https://go.midday.ai/5eYKrmV](https://go.midday.ai/5eYKrmV)
31 |
32 | <br />
33 | When the user clicks `Share` we execute a server action using the library `next-safe-action`
34 |
35 | that looks like this:
36 |
37 | ```typescript
38 | const createReport = useAction(createReportAction, {
39 |   onError: () => {
40 |     toast({
41 |       duration: 2500,
42 |       variant: "error",
43 |       title: "Something went wrong pleaase try again.",
44 |     });
45 |   },
46 |   onSuccess: (data) => {
47 |     setOpen(false);
48 |
49 |     const { id } = toast({
50 |       title: "Report published",
51 |       description: "Your report is ready to share.",
52 |       variant: "success",
53 |       footer: (
54 |         <div className="mt-4 space-x-2 flex w-full">
55 |           <CopyInput
56 |             value={data.short_link}
57 |             className="border-[#2C2C2C] w-full"
58 |           />
59 |
60 |           <Link href={data.short_link} onClick={() => dismiss(id)}>
61 |             <Button>View</Button>
62 |           </Link>
63 |         </div>
64 |       ),
65 |     });
66 |   },
67 | });
68 | ```
69 |
70 | <br />
71 |
72 | The nice thing with next-safe-action is that you get callbacks on onError and onSuccess so in this case we show a toast based on the callback.
73 |
74 | <br />
75 |
76 | The action is pretty straightforward too, we first save the report based on the current parameters (from, to and type) depending on what kind of report we are creating.
77 |
78 | <br />
79 | We save it in Supabase and get a id back that we use to generate our sharable URL.
80 |
81 | ```typescript
82 | const dub = new Dub({ projectSlug: "midday" });
83 |
84 | export const createReportAction = action(schema, async (params) => {
85 |   const supabase = createClient();
86 |   const user = await getUser();
87 |
88 |   const { data } = await supabase
89 |     .from("reports")
90 |     .insert({
91 |       team_id: user.data.team_id,
92 |       from: params.from,
93 |       to: params.to,
94 |       type: params.type,
95 |       expire_at: params.expiresAt,
96 |     })
97 |     .select("*")
98 |     .single();
99 |
100 |   const link = await dub.links.create({
101 |     url: `${params.baseUrl}/report/${data.id}`,
102 |     rewrite: true,
103 |     expiresAt: params.expiresAt,
104 |   });
105 |
106 |   const { data: linkData } = await supabase
107 |     .from("reports")
108 |     .update({
109 |       link_id: link.id,
110 |       short_link: link.shortLink,
111 |     })
112 |     .eq("id", data.id)
113 |     .select("*")
114 |     .single();
115 |
116 |   const logsnag = await setupLogSnag();
117 |
118 |   logsnag.track({
119 |     event: LogEvents.OverviewReport.name,
120 |     icon: LogEvents.OverviewReport.icon,
121 |     channel: LogEvents.OverviewReport.channel,
122 |   });
123 |
124 |   return linkData;
125 | });
126 | ```
127 |
128 | <br />
129 | With the combination of server actions, Supabase and Dub we can create really beautiful
130 | URLs with analytics on top.
131 |
132 | <br />
[TRUNCATED]
```

apps/website/src/app/updates/posts/early-adopter.mdx
```
1 | ---
2 | title: "The Early Adopter Plan"
3 | publishedAt: "2024-03-15"
4 | summary: "We are currently collaborating with our first group of beta users to refine our product and find the right fit for the market. If you're interested in shaping the future of Midday and becoming an early adopter, feel free to join our community. There's no obligation to contribute, and we're thrilled that you want to try out the system."
5 | image: "/images/plan.png"
6 | tag: "Update"
7 | ---
8 |
9 | ### Being an Early Adopter
10 |
11 | We are currently collaborating with our first group of beta users to refine our product and find the right fit for the market. If you're interested in shaping the future of Midday and becoming an early adopter, feel free to join our community. There's no obligation to contribute, and we're thrilled that you want to try out the system.
12 |
13 | <br />
14 | During our private beta phase, you may encounter some bugs, but we genuinely want
15 | all your feedback.
16 |
17 | <br />
18 | ### The Early Adopter Plan
19 |
20 | - This plan includes access to all features.
21 | - Priced at $30 per month but free while in beta.
22 | - Your subscription price will remain unchanged for life as a token of appreciation for supporting Midday in its early stage, regardless of the additional features we introduce.
23 |
24 | <br />
25 | ### Community-Driven Development
26 |
27 | As we continue to enhance Midday, we highly value your input and ideas. Here are three ways you can share your thoughts with us:
28 |
29 | - [Join our Discord server](https://go.midday.ai/anPiuRx).
30 | - Leave feedback directly through the system (control+space).
31 | - [Schedule a 15-minute call with our team](/talk-to-us).
```

apps/website/src/app/updates/posts/engine.mdx
```
1 | ---
2 | title: "Midday Engine"
3 | publishedAt: "2024-06-18"
4 | summary: "The core of Midday is based on our customers transactions. Using this data, we can do a lot to help you run your business smarter when it comes to financial insights, reconciling receipts, and more."
5 | image: "/images/engine.png"
6 | tag: "Updates"
7 | ---
8 |
9 | The core of Midday is based on our customers transactions. Using this data, we can do a lot to help you run your business smarter when it comes to financial insights, reconciling receipts, and more.
10 |
11 | <br />
12 |
13 | Today we support 3 different banking providers which enables us to connect to over
14 | 20 000+ banks in 33 countries across US, Canada, UK and Europe and more to come.
15 |
16 | <br />
17 | Here is an overview of the technologies and services we use to build our engine.
18 |
19 | <br />
20 | ![Engine - Providers](/images/providers.png)
21 | <br />
22 |
23 | ### Architecture
24 |
25 | We provide an API that gives our services transformed transactions, accounts, and balances for Midday to use. Here is how we built it and the technologies we chose.
26 |
27 | <br />
28 |
29 | - **[Cloudflare](https://www.cloudflare.com/)** - (workers, cron, mTLS)
30 | - **[Hono](https://hono.dev/)**- (framework, OpenAPI, RPC)
31 | - **[Typesense](https://typesense.org/)** - search index
32 | - **[Trigger.dev](https://trigger.dev/)** - background jobs
33 | - **[Unkey](https://unkey.dev/)** - API keys, rate limiting, and usage analytics
34 | - **[Sentry](https://sentry.io)** - Observability
35 | - **[OpenStatus](https://www.openstatus.dev/)** - monitoring and alerts
36 |
37 | <br />
38 | ### Cloudflare
39 |
40 | We use a lot of services in Cloudflare. Workers is the compute where our API is hosted, using Hono as our framework.
41 |
42 | <br />
43 | The API uses OpenAPI v3.0 and exposes endpoints for transactions, accounts, search,
44 | and balances.
45 |
46 | We use Cloudflare KV for session caching with GoCardless to avoid hitting any rate limits and for general caching purposes.
47 |
48 | <br />
49 | In the end, we have one interface for our customers to search for their institution.
50 | To support this, we retrieve all institutions from our providers, transform the information,
51 | and store it in Typesense. We use a simple Cron job in Cloudflare every 24 hours
52 | to ensure we have the most recent information.
53 |
54 | <br />
55 | To connect to Teller, you need to use mTLS to authenticate. Thanks to Cloudflare,
56 | we can just upload our certificate and configure our worker to use it when needed.
57 |
58 | <br />
59 | ### Hono
60 |
61 | We chose to use the Hono framework because it's portable, super lightweight, and provides an incredible developer experience among other features:
62 |
63 | - **Caching** - we cache directly in Cloudflare
64 | - **Zod** - for parsing and validating payloads
65 | - **OpenAPI** - generate our specification
66 |
67 | <br />
68 | ### Typesense
69 |
70 | For our customers, we want just one interface for them to search and find their bank. For that to be possible, we needed an index, and we went with Typesense because it's super powerful and easy to use.
71 |
72 | We show banks based on country, fuzzy search, and priority.
73 |
74 | <br />
75 | ### Unkey
76 |
77 | We will soon offer Engine to other companies to use. We will use Unkey for API key management, rate limits, and analytics.
78 |
79 | <br />
80 | ### Trigger.dev
81 |
82 | Our platform fetches transactions regularly with the help of background jobs hosted by Trigger.dev, communicating with our Engine API via RPC. We also use:
83 |
84 | - **Retries**
85 | - **Logging**
86 | - **Error handling**
87 |
88 | <br />
89 | ### Sentry
90 |
91 | To deliver a great service, it's super important to fix bugs and issues fast. With the help of Sentry, we can see what's going on and where we have issues. Additionally, we can also know when external APIs underperform or if we have any other bottlenecks.
92 |
93 | - **Logging and debugging**
94 | - **Alerts**
95 | - **Performance metrics**
96 |
97 | <br />
98 | ### OpenStatus
99 |
[TRUNCATED]
```

apps/website/src/app/updates/posts/incident-report-for-june-22-2024.mdx
```
1 | ---
2 | title: "Incident report for June 22"
3 | publishedAt: "2024-06-22"
4 | summary: ""
5 | tag: "Security"
6 | ---
7 |
8 | On June 22nd, we got notified by [Lunchcat](https://lunchcat.dev) that users' email addresses and names could be accessed through our API.
9 |
10 | <br />
11 | We have addressed the issue and revised our security policy accordingly.
12 | <br />
13 | We deeply apologize for any impact this incident may have had on our users. Our commitment
14 | to transparency and prevention remains steadfast. Below is a summary of what occurred,
15 | how we resolved the issue, and the measures we are implementing to prevent future
16 | occurrences.
17 |
18 | <br />
19 | ### Incident timeline
20 |
21 | - On June 22nd, at 3:01 PM, we got notified about the issue.
22 | - On June 22nd, at 3:44 PM, we identified the issue.
23 | - On June 22nd, at 3:49 PM, we resolved the issue.
24 |
25 | <br />
26 | ### How this affects you
27 |
28 | No user action is required to continue safely. <br />
29 | Accessed: User email and name.
30 |
31 | <br />
32 | ### Actions and remediations
33 |
34 | These are the preventative measures that we have **already taken**:
35 |
36 | - Fixed our misconfigured access policy
37 |
38 | <br />
39 | These are the preventative measures that we will be taking **immediately**:
40 |
41 | - Improving monitoring and alerting
42 |
43 | <br />
44 | ### Conclusion
45 |
46 | We sincerely apologize to everyone affected by this incident, and we appreciate your understanding.
47 |
48 | Please reach out to us at support@midday.ai if you have any questions.
```

apps/website/src/app/updates/posts/invoice-pdf.mdx
```
1 | ---
2 | title: "Generating PDF Invoices: Our Approach"
3 | publishedAt: "2024-10-23"
4 | summary: "Discover how we're implementing PDF invoice generation in Midday, using React-based solutions for customizable, efficient document creation."
5 | image: "/images/update/invoice-pdf/pdf.jpg"
6 | tag: "Updates"
7 | ---
8 | With our upcoming Invoicing feature, we have explored various methods to generate PDF invoices, ranging from running Puppeteer to using a headless browser on Cloudflare, as well as considering paid services and generating PDFs using React.
9 |
10 | <br />
11 | We've noticed that generating PDF invoices is a common challenge in the developer community, so we decided to share our solution with you.
12 | <br />
13 |
14 |
15 | ## Invoice in Midday
16 | ![PDF Invoices](/images/update/invoice-pdf/invoice.jpg)
17 | <br />
18 | We are building a new experience for invoices in Midday. You'll be able to create and send invoices to your customers, as well as generate PDFs for each invoice.
19 |
20 | <br />
21 |
22 | Our interface is highly customizable with a visual editor where you can easily change the layout, add your logo, and tailor the text to your preferences.
23 |
24 | <br />
25 |
26 | We use an editor based on Tiptap to support rich text, with AI-powered grammar checking and text improvement available at the click of a button.
27 |
28 | <br />
29 |
30 | While the editor saves the content using JSON, we also needed to ensure compatibility with our PDF generation process.
31 |
32 | <br/>
33 |
34 | When you send an invoice to a customer, they will receive an email with a unique link to the invoice. Clicking this link will render the invoice on a web page where you and the
35 | customer can communicate in real-time using our chat interface.
36 |
37 | <br />
38 |
39 | You'll also be able to track when the customer has viewed the invoice and if they have any questions about it.
40 |
41 | <br />
42 |
43 | ## PDF Generation
44 | ![PDF Invoices](/images/update/invoice-pdf/pdf-invoice.jpg)
45 | <br />
46 |
47 | There are numerous ways to generate PDFs, and we've explored many different solutions. While we considered paid services, we ultimately decided to prioritize giving you full control over the invoices without relying on external services.
48 |
49 | <br />
50 |
51 | We went with `react-pdf` to generate the PDFs. This is a great library that allows us to generate PDFs using React. We can easily customize the layout and add our own styles to the documents and it feels just like `react-email` concept where we use react to generate our templates.
52 |
53 | <br />
54 |
55 | The invoice is then generated and saved to your [Vault](https://midday.ai/vault), so we can match it to incoming transactions and mark it as paid.
56 |
57 | <br />
58 |
59 | We first create an API endpoint that will generate the PDF and return the PDF as Content Type `application/pdf`.
60 |
61 | ```tsx
62 | import { InvoiceTemplate, renderToStream } from "@midday/invoice";
63 | import { getInvoiceQuery } from "@midday/supabase/queries";
64 | import { createClient } from "@midday/supabase/server";
65 | import type { NextRequest } from "next/server";
66 |
67 | export const preferredRegion = ["fra1", "sfo1", "iad1"];
68 | export const dynamic = "force-dynamic";
69 |
70 | export async function GET(req: NextRequest) {
71 |   const supabase = createClient();
72 |   const requestUrl = new URL(req.url);
73 |   const id = requestUrl.searchParams.get("id");
74 |   const size = requestUrl.searchParams.get("size") as "letter" | "a4";
75 |   const preview = requestUrl.searchParams.get("preview") === "true";
76 |
77 |   if (!id) {
78 |     return new Response("No invoice id provided", { status: 400 });
79 |   }
80 |
81 |   const { data } = await getInvoiceQuery(supabase, id);
82 |
83 |   if (!data) {
84 |     return new Response("Invoice not found", { status: 404 });
85 |   }
86 |
87 |   const stream = await renderToStream(await InvoiceTemplate({ ...data, size }));
88 |
89 |   const blob = await new Response(stream).blob();
90 |
91 |   const headers: Record<string, string> = {
92 |     "Content-Type": "application/pdf",
93 |     "Cache-Control": "no-store, max-age=0",
94 |   };
95 |
96 |   if (!preview) {
97 |     headers["Content-Disposition"] =
98 |       `attachment; filename="${data.invoice_number}.pdf"`;
99 |   }
100 |
101 |   return new Response(blob, { headers });
102 | }
103 | ```
104 |
[TRUNCATED]
```

apps/website/src/app/updates/posts/july-product-updates.mdx
```
1 | ---
2 | title: "July Product Updates"
3 | publishedAt: "2024-08-02"
4 | summary: "In this release, we’re introducing three major updates along with a few helpful additions. You’ll enjoy a much better inbox experience with improved company names, logos, and bulk upload using drag-and-drop. Plus, our Assistant has received several upgrades."
5 | tag: "Updates"
6 | ---
7 |
8 | In this release, we’re introducing three major updates along with a few helpful additions. You’ll enjoy a much better inbox experience with improved company names, logos, and bulk upload using drag-and-drop. Plus, our Assistant has received several upgrades.
9 | <br />
10 |
11 |
12 | ## Inbox
13 | ![Inbox](/images/update/july-product-updates/inbox.png)
14 |
15 | We have rebuilt our Inbox to extract information more reliably and quickly. You can now bulk upload using drag-and-drop, and we will reconcile these with your transactions.
16 |
17 | #### Bulk Uploading (Finally!)
18 | Easily upload multiple files at once with our new drag-and-drop feature.
19 |
20 | #### Improved Accuracy
21 | Experience higher accuracy in identifying names, amounts, and logos.
22 |
23 | <br />
24 | <br />
25 |
26 | ## Assistant
27 | ![Assitant](/images/update/july-product-updates/assistant.png)
28 |
29 | We have updated our assistant to be nearly 30% faster thanks to GPT-4o and several performance improvements in our data layer.
30 |
31 | #### Create Reports
32 | You can now create reports directly from the Assistant.
33 |
34 | #### Documents (Beta)
35 | Upload documents and ask questions around them.
36 |
37 | #### Voice (Alpha)
38 | We are exploring new ways to interact with your Assistant using voice commands.
39 |
40 | <br />
41 | <br />
42 |
43 | ![Engine](/images/update/july-product-updates/engine.png)
44 |
45 | Thanks to our new engine, you can now search for your bank directly. It's much more reliable, and you can view the status of your connection. You can also manually sync your connection in the Settings.
46 |
47 | #### Search for banks
48 | It's now possible to just search for your bank.
49 |
50 | #### Connection status
51 | Sometimes, the connection to your bank may change. We now clearly display this in the Settings and provide instructions on how to resolve it, either through a sync or a reconnection.
52 |
53 | #### Reconnect flow
54 | Especially for banks in the EU, you need to reconnect your bank every 3-6 months. We now send a reminder email and provide an easy flow that takes just 60 seconds to get you back on track.
55 |
56 | <br />
57 | <br />
58 |
59 | ## What's coming next
60 |
61 | #### Time Tracker
62 | Our time tracker will soon includes real-time tracking capabilities, allowing you to monitor productivity and manage your time more effectively.
63 |
64 | #### Invoicing
65 | We have started developing our invoice feature and have created designs based on feedback from many of you to ensure the best possible experience.
66 |
67 | #### Multi-Currency Support
68 | Soon, you will gain a clear picture of your business finances, even if you operate with multiple currencies.
69 |
70 |
71 | <br />
72 |
73 | Give these a try and let us know what you think [get started here](https://app.midday.ai).
```

apps/website/src/app/updates/posts/lognsag.mdx
```
1 | ---
2 | title: "How we take data-driven decisions with LogSnag"
3 | publishedAt: "2024-04-16"
4 | summary: "It's important for every new product to take the right decisions as often you can, and thanks for our public roadmap"
5 | image: "/images/logsnag.png"
6 | tag: "Engineering"
7 | ---
8 |
9 | It's important for every new product to take the right decisions as often you can, and thanks for our public roadmap, votes on feature request and building in public we have a deep connection with our users, but on top of that we also want data to back our decisions.
10 | And thats why we have implemented LogSnag to track a lot of events so we can take data-driven decisions too.
11 |
12 | <br />
13 | There are planty of ways how you can implement analytics, in this blog post we will
14 | share how we solved it in Midday using NextJS and server-actions.
15 |
16 | <br />
17 | Because we have a monorepo we started with creating a new package called `@midday/events`
18 | where we install `@logsnag/next`.
19 |
20 | <br />
21 | The package includes all the events we want to track in Midday for example:
22 |
23 | ```typescript
24 | {
25 |     SignIn: {
26 |         name: "User Signed In",
27 |         icon: "🌝",
28 |         channel: "login",
29 |     },
30 |         SignOut: {
31 |         name: "User Signed Out",
32 |         icon: "🌝",
33 |         channel: "login",
34 |     },
35 | }
36 | ```
37 |
38 | <br />
39 | And based of these realtime events we can make clear graphs like Line Chart, Bar
40 | Chart and Funnel Charts.
41 | <br />
42 |
43 | ![LogSnag - Events](/images/graph.png)
44 |
45 | <br />
46 | ### How we implemented LogSnag
47 |
48 | When you sign in to Midday we first ask you about tracking, we want you to keep your privacy. This is done by showing a `Toast` component with the option to Accept or Decline, we save this decision
49 | in a cookie so we now if we should add a identifier for the events or not.
50 |
51 | <br />
52 | ![LogSnag - Events](/images/signin.png)
53 | <br />
54 |
55 | We run a server action called `tracking-consent-action.ts`:
56 |
57 | ```typescript
58 | "use server";
59 |
60 | import { Cookies } from "@/utils/constants";
61 | import { addYears } from "date-fns";
62 | import { cookies } from "next/headers";
63 | import { action } from "./safe-action";
64 | import { trackingConsentSchema } from "./schema";
65 |
66 | export const trackingConsentAction = action(
67 |   trackingConsentSchema,
68 |   async (value) => {
69 |     cookies().set({
70 |       name: Cookies.TrackingConsent,
71 |       value: value ? "1" : "0",
72 |       expires: addYears(new Date(), 1),
73 |     });
74 |
75 |     return value;
76 |   }
77 | );
78 | ```
79 |
80 | <br />
81 |
82 | We then wrap the `track` method from LogSnag to enable or disabled the `user_id` to the event.
83 |
84 | ```typescript
85 | export const setupLogSnag = async (options?: Props) => {
86 |   const { userId, fullName } = options ?? {};
87 |   const consent = cookies().get(Cookies.TrackingConsent)?.value === "0";
88 |
89 |   const logsnag = new LogSnag({
90 |     token: process.env.LOGSNAG_PRIVATE_TOKEN!,
91 |     project: process.env.NEXT_PUBLIC_LOGSNAG_PROJECT!,
92 |     disableTracking: Boolean(process.env.NEXT_PUBLIC_LOGSNAG_DISABLED!),
93 |   });
94 |
95 |   if (consent && userId && fullName) {
96 |     await logsnag.identify({
97 |       user_id: userId,
98 |       properties: {
99 |         name: fullName,
100 |       },
101 |     });
102 |   }
103 |
104 |   return {
105 |     ...logsnag,
106 |     track: (options: TrackOptions) =>
107 |       logsnag.track({
108 |         ...options,
109 |         user_id: consent ? userId : undefined,
110 |       }),
111 |   };
112 | };
113 | ```
114 |
115 | <br />
116 | We use the `setupLogSnag` function like this:
117 |
118 | ```typescript
119 | export const exportTransactionsAction = action(
120 |   exportTransactionsSchema,
121 |   async (transactionIds) => {
122 |     const user = await getUser();
123 |
124 |     const event = await client.sendEvent({
125 |       name: Events.TRANSACTIONS_EXPORT,
126 |       payload: {
127 |         transactionIds,
128 |         teamId: user.data.team_id,
129 |         locale: user.data.locale,
130 |       },
131 |     });
132 |
133 |     const logsnag = await setupLogSnag({
134 |       userId: user.data.id,
135 |       fullName: user.data.full_name,
136 |     });
137 |
138 |     logsnag.track({
139 |       event: LogEvents.ExportTransactions.name,
140 |       icon: LogEvents.ExportTransactions.icon,
141 |       channel: LogEvents.ExportTransactions.channel,
142 |     });
143 |
[TRUNCATED]
```

apps/website/src/app/updates/posts/midday-resend.mdx
```
1 | ---
2 | title: "Why Midday trusts Resend to send financial notifications"
3 | publishedAt: "2024-03-20"
4 | summary: "From sign up, to implementing the SDK, Resend was different - we were setup in less than an hour"
5 | image: "/images/resend.png"
6 | tag: "Engineering"
7 | ---
8 |
9 | > From sign up, to implementing the SDK, Resend was different - we were setup in less than an hour.
10 |
11 | <br />
12 | Here at Midday, we care deeply about design, and we knew from the beginning that
13 | we wanted branded emails with reusable components.
14 |
15 | <br />
16 | By integrating [react.email](https://react.email/) with [Tailwind CSS](https://react.email/docs/components/tailwind),
17 | we've crafted an optimal user experience. **This combination has been transformative**,
18 | allowing us to enable our local development and online hosting.
19 |
20 | <br />
21 | The transition to Resend was strikingly smooth. I'm used to other services where
22 | you need to request access, quotes, and other information before getting started.
23 | From sign up, to implementing the SDK, Resend was different - **we were setup in
24 | less than an hour.**
25 |
26 | <br />
27 | We use Resend to ensure that our clients receive notifications for new bank transactions,
28 | invitations, and other significant interactions. What truly sets Resend apart for
29 | us are the continuous changes and improvements, like the Batch API, which specifically
30 | helped optimize our invite system.
31 |
32 | <br />
33 |
34 | I didn't think that you could further innovate an email API, but **Resend keeps
35 | shipping features that we did not know we needed.**
36 |
37 | <br />
38 | We haven't had the need to contact Resend for support yet, but the team has supported
39 | us while we shared our journey building emails on X, which truly showed me how **they
40 | differ from other email providers in the best way.**
41 |
42 | <br />
43 | I'm really excited for our launch, along side my co-founder Viktor Hofte.
44 |
45 | <br />
46 | Resend is a **game changer when it comes to developer experience and design.** If
47 | you care deeply about your product you should use Resend.
48 |
49 | <br />
50 | This is a cross post from [Resend](https://resend.com/customers/midday)
```

apps/website/src/app/updates/posts/novu.mdx
```
1 | ---
2 | title: "How we are sending notifications easy with Novu"
3 | publishedAt: "2024-04-29"
4 | summary: "Midday is all about being on top of your business. Stay informed about your business insights, track when you get paid, receive updates on new transactions"
5 | image: "/images/novu.png"
6 | tag: "Engineering"
7 | ---
8 |
9 | Midday is all about being on top of your business. Stay informed about your business insights, track when you get paid, receive updates on new transactions, and access general information how your business actually are doing. And that includes well-timed notifications via emails and push notifications, carefully curated for your convenience.
10 |
11 | <br />
12 | ### The challenge: Implementing a unified infrastructure for notifications
13 |
14 | From the beginning, we knew the importance of a unified approach to managing our notifications. From past experiences of stitching together different solutions to support various notification needs, we were determined to create a system that could seamlessly support web, desktop, and mobile applications. Our goal is to ensure that our notification system can scale alongside our growth.
15 |
16 | <br />
17 | ### The solution: Novu
18 |
19 | While we tried a bunch of different providers we decided to
20 | go with Novu based on our requirements:
21 |
22 | - Support Resend, Expo
23 | - In App notifications
24 | - User Preferences
25 |
26 | <br />
27 | Novu not only ticked every box they also got a huge bonus for being open source and
28 | you get 30K events/month for free.
29 |
30 | <br />
31 | ### Implementation and SDKs
32 |
33 | We started with created our own package `@midday/notifications` where
34 | we installed `@novu/node` dependency, where we register our notification
35 | types for convenience:
36 |
37 | ```typescript
38 | // Our notification templates
39 | export enum Templates {
40 |   Transaction = "transaction",
41 |   Transactions = "transactions",
42 |   Inbox = "inbox",
43 |   Match = "match",
44 | }
45 |
46 | // Our notification types (email|in-app)
47 | export enum Events {
48 |   TransactionNewInApp = "transaction_new_in_app",
49 |   TransactionsNewInApp = "transactions_new_in_app",
50 |   TransactionNewEmail = "transaction_new_email",
51 |   InboxNewInApp = "inbox_new_in_app",
52 |   MatchNewInApp = "match_in_app",
53 | }
54 | ```
55 |
56 | And using our [New Transactions email](https://email.midday.ai/preview/transactions) as an example, which is sent from a background job using Trigger.dev when you have new transactions.
57 |
58 | ```typescript
59 | import { Notifications, Types, Events } from "@midday/notifications";
60 |
61 | // Generate html from react-email
62 | const html = await renderAsync(
63 |   TransactionsEmail({
64 |     fullName: user.full_name,
65 |     transactions,
66 |     locale: user.locale,
67 |   })
68 | );
69 |
70 | await Notifications.trigger({
71 |   name: Events.TransactionNewEmail,
72 |   payload: {
73 |     type: Types.Transaction,
74 |     subject: t("transactions.subject"),
75 |     html,
76 |   },
77 |   user: {
78 |     subscriberId: user.id,
79 |     teamId: team_id,
80 |     email: user.email,
81 |     fullName: user.full_name,
82 |     avatarUrl: user.avatar_url,
83 |   },
84 | });
85 | ```
86 |
87 | Because we are sending the email with the variables `subject` and `html` with the generated content we are just adding those to Novu and then we're done.
88 |
89 | <br />
90 | ![Novu - Variables](/images/variables.png)
91 |
92 | <br />
93 | And to send In App Notifications it's just a matter of changing the `Events` and
94 | `Types`.
95 |
96 | ```typescript
97 | import { Notifications, Types, Events } from "@midday/notifications";
98 |
99 | await Notifications.trigger({
100 |   name: Events.TransactionNewInApp,
101 |   payload: {
102 |     recordId: transaction.id,
103 |     type: Types.Transaction,
104 |     description: t("notifications.transaction", {
105 |       from: transaction.name,
106 |     }),
107 |   },
108 |   user: {
109 |     subscriberId: user.id,
110 |     teamId: team_id,
111 |     email: user.email,
112 |     fullName: user.full_name,
113 |     avatarUrl: user.avatar_url,
114 |   },
115 | });
116 | ```
117 |
118 | <br />
119 | ### The results: Beautiful In App Notificaitons and Emails
120 | <br />
121 | ![Midday - In App Notifications](/images/notification-center.gif)
122 | <br />
123 | Thanks to the SDK `@novu/headless` we implemented the notification center for Midday
124 | in a matter of hours to match our branding exacly like we wanted while Novu delivers
125 | the notifications in realtime.
126 |
127 | <br />
128 |
[TRUNCATED]
```

apps/website/src/app/updates/posts/october-product-updates.mdx
```
1 | ---
2 | title: "October Product Updates"
3 | publishedAt: "2024-10-31"
4 | summary: "I’m incredibly excited to announce that our most requested feature is finally here—Invoicing!  Let’s dive into how it works and what we’re focusing on for the next month."
5 | tag: "Updates"
6 | ---
7 |
8 | I’m incredibly excited to announce that our most requested feature is finally here—Invoicing!  Let’s dive into how it works and what we’re focusing on for the next month.
9 | <br />
10 |
11 |
12 | ## Invoicing
13 | ![Invoicing](/images/update/october-product-updates/invoicing.jpg)
14 | <br />
15 | We have designed and developed a new visual editor from the ground up, based on extensive research and feedback from early users. While it may look simple, it’s incredibly powerful for all your needs.
16 | <br />
17 | Here are some features we support from the start:
18 |
19 | - Edit and change labels and names
20 | - Rich text editor for content, including links, bold, italic, and more
21 | - AI-enhanced editor with grammar assistance
22 | - Date formats, currencies, VAT, sales tax, discounts, QR codes
23 |
24 | <br />
25 | And much more!
26 |
27 | <br />
28 | ## Web invoice
29 | ![Web invoice](/images/update/october-product-updates/web-invoice.jpg)
30 | <br />
31 | You can choose to send an email to your customers with the newly created invoice. This will open a web-based invoice where they can communicate in real-time instead of exchanging emails back and forth.
32 | <br />
33 | They can also download a PDF, and as the owner, you can see the last view date.
34 |
35 | <br />
36 | <br />
37 |
38 | ## Invoice status
39 | ![Invoice status](/images/update/october-product-updates/invoice-status.png)
40 | <br />
41 | If you have a bank account connected to Midday, we will automatically mark an invoice as paid when we find a match. You’ll be notified, and the generated PDF will be attached to your transaction for bookkeeping.<br />
42 |
43 | <br />
44 | You’ll also be notified when invoices become overdue, allowing you to send a reminder email with the press of a button.
45 | <br />
46 |
47 |
48 |
49 | ## What's coming next
50 |
51 | #### Stability and improvements
52 | Our main focus right now is to prepare Midday for our v1 release in Q1 next year. We’re working on our banking integrations to handle various edge cases more effectively, ironing out all the small bugs, and improving the overall experience with Midday.
53 |
54 | If you find any bugs or have any feedback, just let us know!
55 |
56 | <br />
57 |
58 | Create your first invoice and let us know what you think [get started here](https://app.midday.ai).
```

apps/website/src/app/updates/posts/public-beta.mdx
```
1 | ---
2 | title: "Announcing Public Beta"
3 | publishedAt: "2024-06-24"
4 | summary: "For the past three months, we have been working hard in private beta with our customers. Today, we are excited to announce our public beta."
5 | image: "/images/public-beta.jpg"
6 | tag: "Updates"
7 | ---
8 |
9 | For the past three months, we have been working hard in private beta with our customers. Today, we are excited to announce our public beta.
10 |
11 | <br />
12 |
13 | Both Viktor and I want to personally thank all of you who have given us feedback, attended meetings, and supported us during this time. We are super excited to continue our journey together to make Midday the best all-in-one tool for running our business smarter.
14 |
15 | <br />
16 |
17 | As we enter our public beta, new customers will have access to a special deal of $49/month, but it will be free during the beta period.
18 |
19 | <br />
20 | ### What's next
21 |
22 | We aim to have Midday `v1` ready in October, which is also when we will start charging for the service.
23 |
24 | <br />
25 | Until then, here are our focus areas:
26 |
27 | - **Invoicing** - Deliver the first version of our invoicing service
28 | - **Budget** - Add support for budgeting
29 | - **Apps & Integrations** - Integrate with Xero, Fortnox, and QuickBooks
30 | - **Bug Fixes & Improvements** - General improvements to the platform
31 |
32 | <br />
33 | ### ProductHunt
34 |
35 | Along with this milestone, we are launching on Product Hunt on Wednesday, June 26 (12:00 am PST). We would love to have your support by voting for us. [You can subscribe for a notification here](https://go.midday.ai/ph).
36 |
37 | <br />
38 | ### Get started
39 |
40 | Now that Middays is in public beta, feel free to try us out by [signing in here](https://app.midday.ai).
```

apps/website/src/app/updates/posts/slack-assistant.mdx
```
1 | ---
2 | title: "Building the Midday Slack Assistant"
3 | publishedAt: "2024-09-29"
4 | summary: "This is a technical deep dive into how we built the Midday Slack Assistant using Vercel AI SDK, Trigger.dev and Supabase."
5 | image: "/images/update/apps/slack.png"
6 | tag: "Updates"
7 | ---
8 |
9 | In this technical deep dive, we’ll explore how we built the Midday Slack Assistant by leveraging the Vercel AI SDK, Trigger.dev, and Supabase. Our goal was to create an AI-powered assistant that helps users gain financial insights, upload receipts, and manage invoices—all seamlessly from within their Slack workspace.
10 |
11 | ## Background
12 | Midday already has an assistant available on both web and desktop via Electron, but we haven’t yet built a dedicated mobile app. As we continue iterating on our web app, we plan to eventually create a mobile version using Expo. In the meantime, we wanted to give our users a way to interact with Midday on the go. With that in mind, we turned to Slack, where users can quickly upload receipts and invoices without leaving the app they’re already using for work.
13 |
14 | <br />
15 | ## Goals
16 | We aimed to enable our users to:
17 |
18 | - Upload receipts and invoices, and match them to transactions.
19 | - Query their financial status (e.g., burn rate, cash flow).
20 | - Receive notifications about transactions.
21 |
22 | <br />
23 | ## Slack Assistant
24 | Slack recently introduced a new messaging experience for app agents and assistants, making them more discoverable and accessible in user workflows. This update allows developers to build AI assistants based on their own APIs, seamlessly integrated into the Slack interface.
25 | <br />
26 |
27 | When users install our Slack app from the <a href="https://midday.ai/updates/apps">Apps section within Midday</a>, we obtain the necessary permissions to interact with the Slack API, send messages, and listen to events.
28 | <br />
29 |
30 |
31 | ## Authentication
32 | To connect the Slack app to a user’s workspace, we utilize Slack’s OAuth flow to retrieve an access token with the required scopes. These scopes include:
33 |
34 | - `assistant_thread_context_changed`: Detects changes in the assistant thread context.
35 | - `assistant_thread_started`: Tracks when an assistant thread starts.
36 | - `file_created`: Monitors file uploads.
37 | - `message.channel`: Captures messages posted in public channels.
38 | - `message.im`: Captures direct messages.
39 | <br />
40 |
41 | Once authenticated, we store this data in our `apps` table along with the team ID and access token, structured as a JSONB column for flexibility.
42 |
43 | <br />
44 |
45 | ## Event Subscriptions
46 |
47 | Here’s where the magic happens: We use a Next.js route to handle incoming Slack events and route them to our internal handler. This handler checks the event payload to determine the appropriate action. If it detects a file upload, it triggers a background job via Trigger.dev. If it’s a message, we forward it to our Assistant logic.
48 |
49 | <br />
50 |
51 | ## File Upload Handling
52 |
53 | When a file upload event occurs, we send the file to a background job and save it in our Supabase database. Using OCR, we extract key details such as `amount`, `currency`, `date`, and `merchant` from the receipt. Then, we attempt to match the data with existing transactions in our system using Azure Document Intelligence Models.
54 | <br />
55 |
56 | Here’s a quick demo of how the file upload works in Slack:
57 | <br />
58 | <div className="relative" style={{ paddingTop: '71.05263157894737%' }}>
59 |   <iframe
60 |     src="https://customer-oh6t55xltlgrfayh.cloudflarestream.com/7ac615c3849c444f56c555f7b1ff3e31/iframe?poster=https%3A%2F%2Fcustomer-oh6t55xltlgrfayh.cloudflarestream.com%2F7ac615c3849c444f56c555f7b1ff3e31%2Fthumbnails%2Fthumbnail.jpg%3Ftime%3D%26height%3D600"
61 |     loading="lazy"
62 |     className="border-none absolute inset-0 h-full w-full"
63 |     allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
64 |     allowFullScreen
65 |   />
66 | </div>
67 |
68 | <br />
69 | ## Slack Assistant Features
70 |
71 | When you open the Slack Assistant, you’re greeted with a welcome message and a set of suggested actions. This welcome message is triggered by the `assistant_thread_started` event and looks like this:
72 |
73 | ```
74 | import type { AssistantThreadStartedEvent, WebClient } from "@slack/web-api";
75 |
76 | export async function assistantThreadStarted(
77 |   event: AssistantThreadStartedEvent,
78 |   client: WebClient,
79 | ) {
80 |   const prompts = [
81 |     { title: "What’s my runway?", message: "What's my runway?" },
[TRUNCATED]
```

apps/website/src/app/updates/posts/trigger-dev.mdx
```
1 | ---
2 | title: "How we are using Trigger.dev for our background jobs"
3 | publishedAt: "2024-03-19"
4 | summary: "At Midday, we use background jobs extensively. Here's an in-depth exploration of our approach."
5 | image: "/images/trigger.png"
6 | tag: "Engineering"
7 | ---
8 |
9 | At Midday, we use background jobs extensively. Here's an in-depth exploration of our approach.
10 |
11 | <br />
12 | ### Transactions Setup
13 |
14 | Upon successful user authentication of their bank, we initiate the creation of a **`bank_connection`** containing essential data and provider information (Plaid, GoCardLess, Teller). This facilitates subsequent retrieval of transactions on their behalf. Additionally, we store bank connection accounts in **`bank_accounts`**, along with an enable/disable flag, enabling us to determine which accounts to fetch transactions from.
15 |
16 | Once **`bank_connection`** and **`bank_accounts`** are securely stored in the database, we trigger the **`transactions-setup`** job. This job orchestrates the initial synchronization from the providers through batch requests, ensuring resilience against extensive transaction loads. Moreover, it dynamically schedules intervals for running **`transactions-sync`** every hour for each team. Clients subscribe to the **`eventId`** to track the completion of the initial sync process.
17 |
18 | <br />
19 | ### Transactions Sync
20 |
21 | The **`transactions-sync`** task fetches transactions for each team hourly. A team may have multiple connected bank accounts, requiring one request per account. We aim to consolidate new transactions into a single collection for notification purposes. Transactions are limited to the last 30 days, streamlining data retrieval.
22 |
23 | This approach offers a 30-day window for rectifying any potential errors and acquiring new transactions. Moreover, teams can seamlessly enable/disable accounts between sync runs, as transactions are fetched exclusively for enabled accounts. If a **`team_id`** is not found, indicating deletion, the scheduler is promptly removed.
24 |
25 | <br />
26 | ### Process Document
27 |
28 | Upon receipt of a new inbound email from Postmarks, we upload the attachments (invoices) to Supabase and create an **`inbox`** record. Subsequently, we trigger the **`process-document`** job, responsible for parsing the invoice using Google Document AI to extract vital information such as **`due_date`**, **`amount`**, and currency. Successful extraction triggers the **`match-inbox`** event.
29 |
30 | <br />
31 | ### **Match Inbox**
32 |
33 | The **`match-inbox`** process utilizes the **`inboxId`**, **`teamId`**, and **`amount`** to verify transactions matching the invoice amount, accounting for sign differences (transactions are always signed, whereas invoices are not). This verification extends back 45 days, considering cases where no attachments are available yet. Currently, encountering multiple matches necessitates further validation, a feature we plan to address in future UI enhancements.
34 |
35 | <br />
36 | ### Export Transactions
37 |
38 | The **`export-transactions`** task retrieves selected **`transactionIds`**, gathers their attachments, compiles a CSV file, and uploads it to our Vault. Clients subscribe to monitor the progress status of this operation.
39 |
40 | <br />
41 | ### GitHub
42 |
43 | You can find all of our jobs in our [GitHub repository](https://github.com/midday-ai/midday/tree/main/packages/jobs/src).
```

packages/app-store/src/slack/lib/events/index.ts
```
1 | import { createSlackWebClient } from "@midday/app-store/slack";
2 | import type { SlackEvent } from "@slack/bolt";
3 | import { waitUntil } from "@vercel/functions";
4 | import { fileShare } from "./file";
5 | import { assistantThreadMessage, assistantThreadStarted } from "./thread";
6 |
7 | export async function handleSlackEvent(
8 |   event: SlackEvent,
9 |   options: { token: string; teamId: string },
10 | ) {
11 |   const client = createSlackWebClient({
12 |     token: options.token,
13 |   });
14 |
15 |   if (event.type === "assistant_thread_started") {
16 |     waitUntil(assistantThreadStarted(event, client));
17 |     return;
18 |   }
19 |
20 |   // In Assisant Threads
21 |   if (event.subtype === "file_share") {
22 |     waitUntil(fileShare(event, options));
23 |     return;
24 |   }
25 |
26 |   if (
27 |     event.text &&
28 |     event.type === "message" &&
29 |     event.channel_type === "im" &&
30 |     !event.bot_id && // Ignore bot messages
31 |     event.subtype !== "assistant_app_thread"
32 |   ) {
33 |     waitUntil(assistantThreadMessage(event, client, options));
34 |     return;
35 |   }
36 | }
```

packages/app-store/src/slack/lib/notifications/index.ts
```
1 | export * from "./transactions";
```

packages/app-store/src/slack/lib/notifications/transactions.ts
```
1 | import type { SupabaseClient } from "@supabase/supabase-js";
2 | import { z } from "zod";
3 | import { createSlackWebClient } from "../client";
4 |
5 | const transactionSchema = z.object({
6 |   amount: z.string(),
7 |   name: z.string(),
8 | });
9 |
10 | export async function sendSlackTransactionNotifications({
11 |   teamId,
12 |   transactions,
13 |   supabase,
14 | }: {
15 |   teamId: string;
16 |   transactions: z.infer<typeof transactionSchema>[];
17 |   supabase: SupabaseClient;
18 | }) {
19 |   const { data } = await supabase
20 |     .from("apps")
21 |     .select("settings, config")
22 |     .eq("team_id", teamId)
23 |     .eq("app_id", "slack")
24 |     .single();
25 |
26 |   const enabled = data?.settings?.find(
27 |     (setting: { id: string; value: boolean }) => setting.id === "transactions",
28 |   )?.value;
29 |
30 |   if (!enabled || !data?.config?.access_token) {
31 |     return;
32 |   }
33 |
34 |   const client = createSlackWebClient({
35 |     token: data.config.access_token,
36 |   });
37 |
38 |   try {
39 |     await client.chat.postMessage({
40 |       channel: data.config.channel_id,
41 |
42 |       blocks: [
43 |         {
44 |           type: "section",
45 |           text: {
46 |             type: "mrkdwn",
47 |             text: "You got some new transactions! We'll do our best to match these with receipts in your Inbox or you can simply upload them in your <slack://app?id=A07PN48FW3A|Midday Assistant>.",
48 |           },
49 |         },
50 |         {
51 |           type: "divider",
52 |         },
53 |         ...transactions.map((transaction) => ({
54 |           type: "section",
55 |           fields: [
56 |             {
57 |               type: "mrkdwn",
58 |               text: transaction.name,
59 |             },
60 |             {
61 |               type: "mrkdwn",
62 |               text: transaction.amount,
63 |             },
64 |           ],
65 |         })),
66 |         {
67 |           type: "divider",
68 |         },
69 |         {
70 |           type: "actions",
71 |           elements: [
72 |             {
73 |               type: "button",
74 |               text: {
75 |                 type: "plain_text",
76 |                 text: "View transactions",
77 |               },
78 |               url: "https://app.midday.ai/transactions",
79 |               action_id: "button_click",
80 |             },
81 |           ],
82 |         },
83 |       ],
84 |     });
85 |   } catch (error) {
86 |     console.error(error);
87 |   }
88 | }
```

packages/app-store/src/slack/lib/tools/get-burn-rate.ts
```
1 | import { getBurnRateQuery } from "@midday/supabase/queries";
2 | import type { Client } from "@midday/supabase/types";
3 | import { startOfMonth } from "date-fns";
4 | import { z } from "zod";
5 |
6 | export function getBurnRateTool({
7 |   defaultValues,
8 |   supabase,
9 |   teamId,
10 | }: {
11 |   defaultValues: {
12 |     from: string;
13 |     to: string;
14 |   };
15 |   supabase: Client;
16 |   teamId: string;
17 | }) {
18 |   return {
19 |     description: "Get burn rate",
20 |     parameters: z.object({
21 |       startDate: z.coerce
22 |         .date()
23 |         .describe("The start date of the burn rate, in ISO-8601 format")
24 |         .default(new Date(defaultValues.from)),
25 |       endDate: z.coerce
26 |         .date()
27 |         .describe("The end date of the burn rate, in ISO-8601 format")
28 |         .default(new Date(defaultValues.to)),
29 |       currency: z
30 |         .string()
31 |         .describe("The currency for the burn rate")
32 |         .optional(),
33 |     }),
34 |     execute: async ({
35 |       currency,
36 |       startDate,
37 |       endDate,
38 |     }: { currency?: string; startDate: Date; endDate: Date }) => {
39 |       const { data } = await getBurnRateQuery(supabase, {
40 |         currency,
41 |         from: startOfMonth(startDate).toISOString(),
42 |         to: endDate.toISOString(),
43 |         teamId,
44 |       });
45 |
46 |       if (!data) {
47 |         return "No burn rate found";
48 |       }
49 |
50 |       const averageBurnRate =
51 |         data?.reduce((acc, curr) => acc + curr.value, 0) / data?.length;
52 |
53 |       return `Based on your historical data, your average burn rate is ${Intl.NumberFormat(
54 |         "en-US",
55 |         {
56 |           style: "currency",
57 |           currency: data.at(0)?.currency,
58 |         },
59 |       ).format(averageBurnRate)} per month.`;
60 |     },
61 |   };
62 | }
```

packages/app-store/src/slack/lib/tools/get-profit.ts
```
1 | import { getMetricsQuery } from "@midday/supabase/queries";
2 | import type { Client } from "@midday/supabase/types";
3 | import { startOfMonth } from "date-fns";
4 | import { z } from "zod";
5 |
6 | export function getProfitTool({
7 |   defaultValues,
8 |   supabase,
9 |   teamId,
10 | }: {
11 |   defaultValues: {
12 |     from: string;
13 |     to: string;
14 |   };
15 |   supabase: Client;
16 |   teamId: string;
17 | }) {
18 |   return {
19 |     description: "Get profit",
20 |     parameters: z.object({
21 |       startDate: z.coerce
22 |         .date()
23 |         .describe("The start date of the profit, in ISO-8601 format")
24 |         .default(new Date(defaultValues.from)),
25 |       endDate: z.coerce
26 |         .date()
27 |         .describe("The end date of the profit, in ISO-8601 format")
28 |         .default(new Date(defaultValues.to)),
29 |       currency: z.string().describe("The currency for profit").optional(),
30 |     }),
31 |     execute: async ({
32 |       currency,
33 |       startDate,
34 |       endDate,
35 |     }: { currency?: string; startDate: Date; endDate: Date }) => {
36 |       const data = await getMetricsQuery(supabase, {
37 |         teamId,
38 |         from: startOfMonth(new Date(startDate)).toISOString(),
39 |         to: new Date(endDate).toISOString(),
40 |         type: "profit",
41 |         currency,
42 |       });
43 |
44 |       if (!data) {
45 |         return "No profit data found";
46 |       }
47 |
48 |       return `Based on the period from ${startDate.toLocaleDateString()} to ${endDate.toLocaleDateString()}, the current profit is ${Intl.NumberFormat(
49 |         "en-US",
50 |         {
51 |           style: "currency",
52 |           currency: data.summary.currency,
53 |         },
54 |       ).format(data.summary.currentTotal)}`;
55 |     },
56 |   };
57 | }
```

packages/app-store/src/slack/lib/tools/get-revenue.ts
```
1 | import { getMetricsQuery } from "@midday/supabase/queries";
2 | import type { Client } from "@midday/supabase/types";
3 | import { startOfMonth } from "date-fns";
4 | import { z } from "zod";
5 |
6 | export function getRevenueTool({
7 |   defaultValues,
8 |   supabase,
9 |   teamId,
10 | }: {
11 |   defaultValues: {
12 |     from: string;
13 |     to: string;
14 |   };
15 |   supabase: Client;
16 |   teamId: string;
17 | }) {
18 |   return {
19 |     description: "Get revenue",
20 |     parameters: z.object({
21 |       startDate: z.coerce
22 |         .date()
23 |         .describe("The start date of the revenue, in ISO-8601 format")
24 |         .default(new Date(defaultValues.from)),
25 |       endDate: z.coerce
26 |         .date()
27 |         .describe("The end date of the revenue, in ISO-8601 format")
28 |         .default(new Date(defaultValues.to)),
29 |       currency: z.string().describe("The currency for revenue").optional(),
30 |     }),
31 |     execute: async ({
32 |       currency,
33 |       startDate,
34 |       endDate,
35 |     }: { currency?: string; startDate: Date; endDate: Date }) => {
36 |       const data = await getMetricsQuery(supabase, {
37 |         teamId,
38 |         from: startOfMonth(new Date(startDate)).toISOString(),
39 |         to: new Date(endDate).toISOString(),
40 |         type: "revenue",
41 |         currency,
42 |       });
43 |
44 |       if (!data) {
45 |         return "No revenue data found";
46 |       }
47 |
48 |       return `Based on the period from ${startDate.toLocaleDateString()} to ${endDate.toLocaleDateString()}, the current revenue is ${Intl.NumberFormat(
49 |         "en-US",
50 |         {
51 |           style: "currency",
52 |           currency: data.summary.currency,
53 |         },
54 |       ).format(data.summary.currentTotal)}`;
55 |     },
56 |   };
57 | }
```

packages/app-store/src/slack/lib/tools/get-runway.ts
```
1 | import { getRunwayQuery } from "@midday/supabase/queries";
2 | import type { Client } from "@midday/supabase/types";
3 | import { startOfMonth } from "date-fns";
4 | import { z } from "zod";
5 |
6 | export function getRunwayTool({
7 |   defaultValues,
8 |   supabase,
9 |   teamId,
10 | }: {
11 |   defaultValues: {
12 |     from: string;
13 |     to: string;
14 |   };
15 |   supabase: Client;
16 |   teamId: string;
17 | }) {
18 |   return {
19 |     description: "Get the runway",
20 |     parameters: z.object({
21 |       currency: z.string().describe("The currency for the runway").optional(),
22 |       startDate: z.coerce
23 |         .date()
24 |         .describe("The start date of the runway, in ISO-8601 format")
25 |         .default(new Date(defaultValues.from)),
26 |       endDate: z.coerce
27 |         .date()
28 |         .describe("The end date of the runway, in ISO-8601 format")
29 |         .default(new Date(defaultValues.to)),
30 |     }),
31 |     execute: async ({
32 |       currency,
33 |       startDate,
34 |       endDate,
35 |     }: { currency?: string; startDate: Date; endDate: Date }) => {
36 |       const { data } = await getRunwayQuery(supabase, {
37 |         currency,
38 |         from: startOfMonth(startDate).toISOString(),
39 |         to: endDate.toISOString(),
40 |         teamId,
41 |       });
42 |
43 |       if (!data) {
44 |         return "No runway found";
45 |       }
46 |
47 |       return `Runway with currency ${currency} is ${data} months. Based on the data from ${startDate.toISOString()} to ${endDate.toISOString()}.`;
48 |     },
49 |   };
50 | }
```

packages/app-store/src/slack/lib/tools/get-spending.ts
```
1 | import { getSpendingQuery } from "@midday/supabase/queries";
2 | import type { Client } from "@midday/supabase/types";
3 | import { startOfMonth } from "date-fns";
4 | import { z } from "zod";
5 |
6 | export function getSpendingTool({
7 |   defaultValues,
8 |   supabase,
9 |   teamId,
10 | }: {
11 |   defaultValues: {
12 |     from: string;
13 |     to: string;
14 |   };
15 |   supabase: Client;
16 |   teamId: string;
17 | }) {
18 |   return {
19 |     description: "Get spending from category",
20 |     parameters: z.object({
21 |       currency: z.string().describe("The currency for spending").optional(),
22 |       category: z.string().describe("The category for spending"),
23 |       startDate: z.coerce
24 |         .date()
25 |         .describe("The start date of the spending, in ISO-8601 format")
26 |         .default(new Date(defaultValues.from)),
27 |       endDate: z.coerce
28 |         .date()
29 |         .describe("The end date of the spending, in ISO-8601 format")
30 |         .default(new Date(defaultValues.to)),
31 |     }),
32 |     execute: async ({
33 |       category,
34 |       currency,
35 |       startDate,
36 |       endDate,
37 |     }: {
38 |       currency?: string;
39 |       startDate: Date;
40 |       endDate: Date;
41 |       category: string;
42 |     }) => {
43 |       const { data } = await getSpendingQuery(supabase, {
44 |         currency,
45 |         from: startOfMonth(startDate).toISOString(),
46 |         to: endDate.toISOString(),
47 |         teamId,
48 |       });
49 |
50 |       const found = data?.find(
51 |         (c) => category?.toLowerCase() === c?.name?.toLowerCase(),
52 |       );
53 |
54 |       if (!found) {
55 |         return "No spending on this category found";
56 |       }
57 |
58 |       return `You have spent ${Intl.NumberFormat("en-US", {
59 |         style: "currency",
60 |         currency: found.currency,
61 |       }).format(
62 |         Math.abs(found.amount),
63 |       )} on ${found.name} from ${startDate.toISOString()} to ${endDate.toISOString()}.`;
64 |     },
65 |   };
66 | }
```

packages/app-store/src/slack/lib/tools/index.ts
```
1 | export * from "./get-burn-rate";
2 | export * from "./get-runway";
3 | export * from "./get-spending";
4 | export * from "./system-prompt";
```

packages/app-store/src/slack/lib/tools/system-prompt.ts
```
1 | export const systemPrompt = `\
2 |     You are a helpful assistant in Midday who can help users ask questions about their transactions, revenue, spending find invoices and more.
3 |     If the user wants the runway, call \`getRunway\` function.
4 |     If the user wants the burn rate, call \`getBurnRate\` function.
5 |     If the user wants the profit, call \`getProfit\` function.
6 |     If the user wants to see spending based on a category, call \`getSpending\` function.
7 |     If the user wants to see revenue, call \`getRevenue\` function.
8 |     Always try to call the functions with default values, otherwise ask the user to respond with parameters.
9 |     Don't ever return markdown, just plain text.
10 |     Current date is: ${new Date().toISOString().split("T")[0]} \n
11 |     `;
```

packages/invoice/src/templates/html/components/description.tsx
```
1 | import { isValidJSON } from "../../../utils/content";
2 | import { EditorContent } from "./editor-content";
3 |
4 | export function Description({ content }: { content: string }) {
5 |   const value = isValidJSON(content) ? JSON.parse(content) : null;
6 |
7 |   // If the content is not valid JSON, return the content as a string
8 |   if (!value) {
9 |     return <div className="font-mono leading-4 text-[11px]">{content}</div>;
10 |   }
11 |
12 |   return <EditorContent content={value} />;
13 | }
```

packages/invoice/src/templates/html/components/editor-content.tsx
```
1 | import { formatEditorContent } from "../format";
2 |
3 | export function EditorContent({ content }: { content?: JSON }) {
4 |   if (!content) {
5 |     return null;
6 |   }
7 |
8 |   return (
9 |     <div className="font-mono leading-4">{formatEditorContent(content)}</div>
10 |   );
11 | }
```

packages/invoice/src/templates/html/components/line-items.tsx
```
1 | import { formatAmount } from "@midday/utils/format";
2 | import { calculateLineItemTotal } from "../../../utils/calculate";
3 | import type { LineItem } from "../../types";
4 | import { Description } from "./description";
5 |
6 | type Props = {
7 |   lineItems: LineItem[];
8 |   currency: string;
9 |   descriptionLabel: string;
10 |   quantityLabel: string;
11 |   priceLabel: string;
12 |   totalLabel: string;
13 |   includeDecimals?: boolean;
14 |   locale: string;
15 |   includeUnits?: boolean;
16 | };
17 |
18 | export function LineItems({
19 |   lineItems,
20 |   currency,
21 |   descriptionLabel,
22 |   quantityLabel,
23 |   priceLabel,
24 |   totalLabel,
25 |   includeDecimals = false,
26 |   includeUnits = false,
27 |   locale,
28 | }: Props) {
29 |   const maximumFractionDigits = includeDecimals ? 2 : 0;
30 |
31 |   return (
32 |     <div className="mt-5 font-mono">
33 |       <div className="grid grid-cols-[1.5fr_15%_15%_15%] gap-4 items-end relative group mb-2 w-full pb-1 border-b border-border">
34 |         <div className="text-[11px] text-[#878787]">{descriptionLabel}</div>
35 |         <div className="text-[11px] text-[#878787]">{quantityLabel}</div>
36 |         <div className="text-[11px] text-[#878787]">{priceLabel}</div>
37 |         <div className="text-[11px] text-[#878787] text-right">
38 |           {totalLabel}
39 |         </div>
40 |       </div>
41 |
42 |       {lineItems.map((item, index) => (
43 |         <div
44 |           key={`line-item-${index.toString()}`}
45 |           className="grid grid-cols-[1.5fr_15%_15%_15%] gap-4 items-start relative group mb-1 w-full py-1"
46 |         >
47 |           <div className="self-start">
48 |             <Description content={item.name} />
49 |           </div>
50 |           <div className="text-[11px] self-start">{item.quantity}</div>
51 |           <div className="text-[11px] self-start">
52 |             {includeUnits && item.unit
53 |               ? `${formatAmount({
54 |                   currency,
55 |                   amount: item.price,
56 |                   maximumFractionDigits,
57 |                   locale,
58 |                 })}/${item.unit}`
59 |               : formatAmount({
60 |                   currency,
61 |                   amount: item.price,
62 |                   maximumFractionDigits,
63 |                   locale,
64 |                 })}
65 |           </div>
66 |           <div className="text-[11px] text-right self-start">
67 |             {formatAmount({
68 |               maximumFractionDigits,
69 |               currency,
70 |               amount: calculateLineItemTotal({
71 |                 price: item.price,
72 |                 quantity: item.quantity,
73 |               }),
74 |               locale,
75 |             })}
76 |           </div>
77 |         </div>
78 |       ))}
79 |     </div>
80 |   );
81 | }
```

packages/invoice/src/templates/html/components/logo.tsx
```
1 | type Props = {
2 |   logo: string;
3 |   customerName: string;
4 | };
5 |
6 | export function Logo({ logo, customerName }: Props) {
7 |   return (
8 |     <img
9 |       src={logo}
10 |       alt={customerName}
11 |       style={{
12 |         height: 80,
13 |         objectFit: "contain",
14 |       }}
15 |     />
16 |   );
17 | }
```

packages/invoice/src/templates/html/components/meta.tsx
```
1 | import { TZDate } from "@date-fns/tz";
2 | import { format } from "date-fns";
3 | import type { Template } from "../../types";
4 |
5 | type Props = {
6 |   template: Template;
7 |   invoiceNumber: string;
8 |   issueDate: string;
9 |   dueDate: string;
10 |   timezone: string;
11 | };
12 |
13 | export function Meta({
14 |   template,
15 |   invoiceNumber,
16 |   issueDate,
17 |   dueDate,
18 |   timezone,
19 | }: Props) {
20 |   return (
21 |     <div className="mb-2">
22 |       <h2 className="text-[21px] font-medium font-mono mb-1 w-fit min-w-[100px]">
23 |         {template.title}
24 |       </h2>
25 |       <div className="flex flex-col gap-0.5">
26 |         <div className="flex space-x-1 items-center">
27 |           <div className="flex items-center flex-shrink-0 space-x-1">
28 |             <span className="truncate font-mono text-[11px] text-[#878787]">
29 |               {template.invoice_no_label}:
30 |             </span>
31 |             <span className="text-[11px] font-mono flex-shrink-0">
32 |               {invoiceNumber}
33 |             </span>
34 |           </div>
35 |         </div>
36 |
37 |         <div>
38 |           <div>
39 |             <div className="flex space-x-1 items-center">
40 |               <div className="flex items-center flex-shrink-0 space-x-1">
41 |                 <span className="truncate font-mono text-[11px] text-[#878787]">
42 |                   {template.issue_date_label}:
43 |                 </span>
44 |                 <span className="text-[11px] font-mono flex-shrink-0">
45 |                   {format(
46 |                     new TZDate(issueDate, timezone),
47 |                     template.date_format,
48 |                   )}
49 |                 </span>
50 |               </div>
51 |             </div>
52 |           </div>
53 |         </div>
54 |         <div>
55 |           <div>
56 |             <div className="flex space-x-1 items-center">
57 |               <div className="flex items-center flex-shrink-0 space-x-1">
58 |                 <span className="truncate font-mono text-[11px] text-[#878787]">
59 |                   {template.due_date_label}:
60 |                 </span>
61 |                 <span className="text-[11px] font-mono flex-shrink-0">
62 |                   {format(new TZDate(dueDate, timezone), template.date_format)}
63 |                 </span>
64 |               </div>
65 |             </div>
66 |           </div>
67 |         </div>
68 |       </div>
69 |     </div>
70 |   );
71 | }
```

packages/invoice/src/templates/html/components/summary.tsx
```
1 | import { calculateTotal } from "../../../utils/calculate";
2 | import type { LineItem } from "../../types";
3 |
4 | type Props = {
5 |   includeVAT: boolean;
6 |   includeTax: boolean;
7 |   includeDiscount: boolean;
8 |   discount?: number;
9 |   discountLabel: string;
10 |   taxRate: number;
11 |   vatRate: number;
12 |   locale: string;
13 |   currency: string;
14 |   vatLabel: string;
15 |   taxLabel: string;
16 |   totalLabel: string;
17 |   lineItems: LineItem[];
18 |   includeDecimals?: boolean;
19 |   subtotalLabel: string;
20 | };
21 |
22 | export function Summary({
23 |   includeVAT,
24 |   includeTax,
25 |   includeDiscount,
26 |   discountLabel,
27 |   locale,
28 |   discount,
29 |   taxRate,
30 |   vatRate,
31 |   currency,
32 |   vatLabel,
33 |   taxLabel,
34 |   totalLabel,
35 |   lineItems,
36 |   includeDecimals,
37 |   subtotalLabel,
38 | }: Props) {
39 |   const maximumFractionDigits = includeDecimals ? 2 : 0;
40 |
41 |   const {
42 |     subTotal,
43 |     total,
44 |     vat: totalVAT,
45 |     tax: totalTax,
46 |   } = calculateTotal({
47 |     lineItems,
48 |     taxRate,
49 |     vatRate,
50 |     discount: discount ?? 0,
51 |     includeVAT,
52 |     includeTax,
53 |   });
54 |
55 |   return (
56 |     <div className="w-[320px] flex flex-col">
57 |       <div className="flex justify-between items-center py-1">
58 |         <span className="text-[11px] text-[#878787] font-mono">
59 |           {subtotalLabel}
60 |         </span>
61 |         <span className="text-right font-mono text-[11px] text-[#878787]">
62 |           {new Intl.NumberFormat(locale, {
63 |             style: "currency",
64 |             currency: currency,
65 |             maximumFractionDigits,
66 |           }).format(subTotal)}
67 |         </span>
68 |       </div>
69 |
70 |       {includeDiscount && (
71 |         <div className="flex justify-between items-center py-1">
72 |           <span className="text-[11px] text-[#878787] font-mono">
73 |             {discountLabel}
74 |           </span>
75 |           <span className="text-right font-mono text-[11px] text-[#878787]">
76 |             {new Intl.NumberFormat(locale, {
77 |               style: "currency",
78 |               currency: currency,
79 |               maximumFractionDigits,
80 |             }).format(discount ?? 0)}
81 |           </span>
82 |         </div>
83 |       )}
84 |
85 |       {includeVAT && (
86 |         <div className="flex justify-between items-center py-1">
87 |           <span className="text-[11px] text-[#878787] font-mono">
88 |             {vatLabel} ({vatRate}%)
89 |           </span>
90 |           <span className="text-right font-mono text-[11px] text-[#878787]">
91 |             {new Intl.NumberFormat(locale, {
92 |               style: "currency",
93 |               currency: currency,
94 |               maximumFractionDigits,
95 |             }).format(totalVAT)}
96 |           </span>
97 |         </div>
98 |       )}
99 |
100 |       {includeTax && (
101 |         <div className="flex justify-between items-center py-1">
102 |           <span className="text-[11px] text-[#878787] font-mono">
103 |             {taxLabel} ({taxRate}%)
104 |           </span>
105 |           <span className="text-right font-mono text-[11px] text-[#878787]">
106 |             {new Intl.NumberFormat(locale, {
107 |               style: "currency",
108 |               currency: currency,
109 |               maximumFractionDigits,
110 |             }).format(totalTax)}
111 |           </span>
112 |         </div>
113 |       )}
114 |
115 |       <div className="flex justify-between items-center py-4 mt-2 border-t border-border">
116 |         <span className="text-[11px] text-[#878787] font-mono">
117 |           {totalLabel}
118 |         </span>
119 |         <span className="text-right font-mono text-[21px]">
120 |           {new Intl.NumberFormat(locale, {
121 |             style: "currency",
122 |             currency: currency,
123 |             maximumFractionDigits,
124 |           }).format(total)}
125 |         </span>
126 |       </div>
127 |     </div>
128 |   );
129 | }
```

packages/invoice/src/templates/og/components/avatar.tsx
```
1 | type Props = {
2 |   customerName?: string;
3 |   logoUrl?: string;
4 |   isValidLogo: boolean;
5 | };
6 |
7 | export function Avatar({ logoUrl, isValidLogo, customerName }: Props) {
8 |   if (isValidLogo) {
9 |     return (
10 |       <img
11 |         src={logoUrl}
12 |         alt="Avatar"
13 |         tw="w-10 h-10 border-[0.5px] border-[#2D2D2D] rounded-full overflow-hidden"
14 |       />
15 |     );
16 |   }
17 |
18 |   return (
19 |     <div tw="w-10 h-10 rounded-full border-[0.5px] border-[#2D2D2D] bg-[#1C1C1C] text-[#F2F2F2] flex items-center justify-center">
20 |       {customerName?.[0]}
21 |     </div>
22 |   );
23 | }
```

packages/invoice/src/templates/og/components/editor-content.tsx
```
1 | import { formatEditorContent } from "../format";
2 |
3 | export function EditorContent({ content }: { content?: JSON }) {
4 |   if (!content) {
5 |     return null;
6 |   }
7 |
8 |   return (
9 |     <div tw="flex" style={{ lineHeight: 1.5 }}>
10 |       {formatEditorContent(content)}
11 |     </div>
12 |   );
13 | }
```

packages/invoice/src/templates/og/components/header.tsx
```
1 | import { Avatar } from "./avatar";
2 | import { Status } from "./status";
3 |
4 | type Props = {
5 |   customerName: string;
6 |   status: "draft" | "overdue" | "paid" | "unpaid" | "canceled";
7 |   logoUrl?: string;
8 |   isValidLogo: boolean;
9 | };
10 |
11 | export function Header({ customerName, status, logoUrl, isValidLogo }: Props) {
12 |   return (
13 |     <div tw="flex mb-12 items-center justify-between w-full">
14 |       <Avatar
15 |         logoUrl={logoUrl}
16 |         isValidLogo={isValidLogo}
17 |         customerName={customerName}
18 |       />
19 |       <Status status={status} />
20 |     </div>
21 |   );
22 | }
```

packages/invoice/src/templates/og/components/logo.tsx
```
1 | export function Logo({
2 |   src,
3 |   customerName,
4 | }: { src: string; customerName: string }) {
5 |   if (!src) return null;
6 |   return <img src={src} alt={customerName} width={112} height={112} />;
7 | }
```

packages/invoice/src/templates/og/components/meta.tsx
```
1 | import { TZDate } from "@date-fns/tz";
2 | import { format } from "date-fns";
3 | import type { Template } from "../../types";
4 |
5 | type Props = {
6 |   template: Template;
7 |   invoiceNumber: string;
8 |   issueDate: string;
9 |   dueDate: string;
10 | };
11 |
12 | export function Meta({ template, invoiceNumber, issueDate, dueDate }: Props) {
13 |   return (
14 |     <div tw="flex justify-between items-center mt-14 mb-2">
15 |       <div tw="flex items-center">
16 |         <span tw="text-[22px] text-[#878787] font-mono mr-2">
17 |           {template.invoice_no_label}:
18 |         </span>
19 |         <span tw="text-[22px] text-white font-mono">{invoiceNumber}</span>
20 |       </div>
21 |
22 |       <div tw="flex items-center">
23 |         <span tw="text-[22px] text-[#878787] font-mono mr-2">
24 |           {template.issue_date_label}:
25 |         </span>
26 |         <span tw="text-[22px] text-white font-mono">
27 |           {format(
28 |             new TZDate(issueDate, template.timezone),
29 |             template.date_format,
30 |           )}
31 |         </span>
32 |       </div>
33 |
34 |       <div tw="flex items-center">
35 |         <span tw="text-[22px] text-[#878787] font-mono mr-2">
36 |           {template.due_date_label}:
37 |         </span>
38 |         <span tw="text-[22px] text-white font-mono">
39 |           {format(new TZDate(dueDate, template.timezone), template.date_format)}
40 |         </span>
41 |       </div>
42 |     </div>
43 |   );
44 | }
```

packages/invoice/src/templates/og/components/status.tsx
```
1 | export function Status({
2 |   status,
3 | }: {
4 |   status: "draft" | "overdue" | "paid" | "unpaid" | "canceled";
5 | }) {
6 |   const getStatusStyles = () => {
7 |     if (status === "draft" || status === "canceled") {
8 |       return "text-[#878787] bg-[#1D1D1D] text-[20px]";
9 |     }
10 |
11 |     if (status === "overdue") {
12 |       return "bg-[#262111] text-[#FFD02B]";
13 |     }
14 |
15 |     if (status === "paid") {
16 |       return "text-[#00C969] bg-[#17241B]";
17 |     }
18 |
19 |     return "text-[#F5F5F3] bg-[#292928]";
20 |   };
21 |
22 |   return (
23 |     <div
24 |       tw={`flex px-4 py-1 rounded-full font-mono max-w-full text-[22px] ${getStatusStyles()}`}
25 |     >
26 |       <span tw="font-mono">
27 |         {status.charAt(0).toUpperCase() + status.slice(1)}
28 |       </span>
29 |     </div>
30 |   );
31 | }
```

packages/invoice/src/templates/pdf/components/description.tsx
```
1 | import { Text, View } from "@react-pdf/renderer";
2 | import { isValidJSON } from "../../../utils/content";
3 | import { EditorContent } from "./editor-content";
4 |
5 | export function Description({ content }: { content: string }) {
6 |   const value = isValidJSON(content) ? JSON.parse(content) : null;
7 |
8 |   // If the content is not valid JSON, return the content as a string
9 |   if (!value) {
10 |     return (
11 |       <Text style={{ fontFamily: "Helvetica", fontSize: 9 }}>{content}</Text>
12 |     );
13 |   }
14 |
15 |   return (
16 |     <View
17 |       style={{
18 |         alignSelf: "flex-start",
19 |         marginTop: -10,
20 |       }}
21 |     >
22 |       <EditorContent content={value} />
23 |     </View>
24 |   );
25 | }
```

packages/invoice/src/templates/pdf/components/editor-content.tsx
```
1 | import { View } from "@react-pdf/renderer";
2 | import { formatEditorContent } from "../format";
3 |
4 | export function EditorContent({ content }: { content?: JSON }) {
5 |   if (!content) {
6 |     return null;
7 |   }
8 |
9 |   return (
10 |     <View style={{ marginTop: 10, lineHeight: 0.9 }}>
11 |       {formatEditorContent(content)}
12 |     </View>
13 |   );
14 | }
```

packages/invoice/src/templates/pdf/components/line-items.tsx
```
1 | import { formatAmount } from "@midday/utils/format";
2 | import { Text, View } from "@react-pdf/renderer";
3 | import type { LineItem } from "../../types";
4 | import { Description } from "./description";
5 |
6 | type Props = {
7 |   lineItems: LineItem[];
8 |   currency: string;
9 |   descriptionLabel: string;
10 |   quantityLabel: string;
11 |   priceLabel: string;
12 |   totalLabel: string;
13 |   locale: string;
14 |   includeDecimals?: boolean;
15 |   includeUnits?: boolean;
16 | };
17 |
18 | export function LineItems({
19 |   lineItems,
20 |   currency,
21 |   descriptionLabel,
22 |   quantityLabel,
23 |   priceLabel,
24 |   totalLabel,
25 |   locale,
26 |   includeDecimals,
27 |   includeUnits,
28 | }: Props) {
29 |   const maximumFractionDigits = includeDecimals ? 2 : 0;
30 |   return (
31 |     <View style={{ marginTop: 20 }}>
32 |       <View
33 |         style={{
34 |           flexDirection: "row",
35 |           borderBottomWidth: 0.5,
36 |           borderBottomColor: "#000",
37 |           paddingBottom: 5,
38 |           marginBottom: 5,
39 |         }}
40 |       >
41 |         <Text style={{ flex: 3, fontSize: 9, fontWeight: 500 }}>
42 |           {descriptionLabel}
43 |         </Text>
44 |         <Text style={{ flex: 1, fontSize: 9, fontWeight: 500 }}>
45 |           {quantityLabel}
46 |         </Text>
47 |         <Text style={{ flex: 1, fontSize: 9, fontWeight: 500 }}>
48 |           {priceLabel}
49 |         </Text>
50 |         <Text
51 |           style={{
52 |             flex: 1,
53 |             fontSize: 9,
54 |             fontWeight: 500,
55 |             textAlign: "right",
56 |           }}
57 |         >
58 |           {totalLabel}
59 |         </Text>
60 |       </View>
61 |       {lineItems.map((item, index) => (
62 |         <View
63 |           key={`line-item-${index.toString()}`}
64 |           style={{
65 |             flexDirection: "row",
66 |             paddingVertical: 5,
67 |             alignItems: "flex-start",
68 |           }}
69 |         >
70 |           <View style={{ flex: 3 }}>
71 |             <Description content={item.name} />
72 |           </View>
73 |
74 |           <Text style={{ flex: 1, fontSize: 9 }}>{item.quantity}</Text>
75 |
76 |           <Text style={{ flex: 1, fontSize: 9 }}>
77 |             {formatAmount({
78 |               currency,
79 |               amount: item.price,
80 |               locale,
81 |               maximumFractionDigits,
82 |             })}
83 |             {includeUnits && item.unit ? ` / ${item.unit}` : null}
84 |           </Text>
85 |
86 |           <Text style={{ flex: 1, fontSize: 9, textAlign: "right" }}>
87 |             {formatAmount({
88 |               currency,
89 |               amount: item.quantity * item.price,
90 |               locale,
91 |               maximumFractionDigits,
92 |             })}
93 |           </Text>
94 |         </View>
95 |       ))}
96 |     </View>
97 |   );
98 | }
```

packages/invoice/src/templates/pdf/components/meta.tsx
```
1 | import { TZDate } from "@date-fns/tz";
2 | import { Text, View } from "@react-pdf/renderer";
3 | import { format } from "date-fns";
4 |
5 | interface MetaProps {
6 |   invoiceNo: string;
7 |   issueDate: string;
8 |   dueDate: string;
9 |   invoiceNoLabel: string;
10 |   issueDateLabel: string;
11 |   dueDateLabel: string;
12 |   dateFormat?: string;
13 |   timezone: string;
14 |   title: string;
15 | }
16 |
17 | export function Meta({
18 |   invoiceNo,
19 |   issueDate,
20 |   dueDate,
21 |   invoiceNoLabel,
22 |   issueDateLabel,
23 |   dueDateLabel,
24 |   dateFormat = "MM/dd/yyyy",
25 |   timezone,
26 |   title,
27 | }: MetaProps) {
28 |   return (
29 |     <View>
30 |       <Text style={{ fontSize: 21, fontWeight: 500, marginBottom: 8 }}>
31 |         {title}
32 |       </Text>
33 |       <View style={{ flexDirection: "column", gap: 4 }}>
34 |         <View style={{ flexDirection: "row", alignItems: "center" }}>
35 |           <Text style={{ fontSize: 9, fontWeight: 500, marginRight: 2 }}>
36 |             {invoiceNoLabel}:
37 |           </Text>
38 |           <Text style={{ fontSize: 9 }}>{invoiceNo}</Text>
39 |         </View>
40 |         <View style={{ flexDirection: "row", alignItems: "center" }}>
41 |           <Text style={{ fontSize: 9, fontWeight: 500, marginRight: 2 }}>
42 |             {issueDateLabel}:
43 |           </Text>
44 |           <Text style={{ fontSize: 9 }}>
45 |             {format(new TZDate(issueDate, timezone), dateFormat)}
46 |           </Text>
47 |         </View>
48 |         <View style={{ flexDirection: "row", alignItems: "center" }}>
49 |           <Text style={{ fontSize: 9, fontWeight: 500, marginRight: 2 }}>
50 |             {dueDateLabel}:
51 |           </Text>
52 |           <Text style={{ fontSize: 9 }}>
53 |             {format(new TZDate(dueDate, timezone), dateFormat)}
54 |           </Text>
55 |         </View>
56 |       </View>
57 |     </View>
58 |   );
59 | }
```

packages/invoice/src/templates/pdf/components/note.tsx
```
1 | import { Text, View } from "@react-pdf/renderer";
2 | import { EditorContent } from "./editor-content";
3 |
4 | type Props = {
5 |   content?: JSON;
6 |   noteLabel?: string;
7 | };
8 |
9 | export function Note({ content, noteLabel }: Props) {
10 |   if (!content) return null;
11 |   return (
12 |     <View style={{ marginTop: 20 }}>
13 |       <Text style={{ fontSize: 9, fontWeight: 500 }}>{noteLabel}</Text>
14 |       <EditorContent content={content} />
15 |     </View>
16 |   );
17 | }
```

packages/invoice/src/templates/pdf/components/payment-details.tsx
```
1 | import { Text, View } from "@react-pdf/renderer";
2 | import { EditorContent } from "./editor-content";
3 |
4 | type Props = {
5 |   content?: JSON;
6 |   paymentLabel?: string;
7 | };
8 |
9 | export function PaymentDetails({ content, paymentLabel }: Props) {
10 |   if (!content) return null;
11 |
12 |   return (
13 |     <View style={{ marginTop: 20 }}>
14 |       <Text style={{ fontSize: 9, fontWeight: 500 }}>{paymentLabel}</Text>
15 |       <EditorContent content={content} />
16 |     </View>
17 |   );
18 | }
```

packages/invoice/src/templates/pdf/components/qr-code.tsx
```
1 | import { Image, View } from "@react-pdf/renderer";
2 |
3 | interface QRCodeProps {
4 |   data: string;
5 |   size?: number;
6 | }
7 |
8 | export function QRCode({ data, size = 40 }: QRCodeProps) {
9 |   return (
10 |     <View style={{ marginTop: 20 }}>
11 |       <Image src={data} style={{ width: size, height: size }} />
12 |     </View>
13 |   );
14 | }
```

packages/invoice/src/templates/pdf/components/summary.tsx
```
1 | import { formatAmount } from "@midday/utils/format";
2 | import { Text, View } from "@react-pdf/renderer";
3 |
4 | interface SummaryProps {
5 |   amount: number;
6 |   tax?: number;
7 |   taxRate?: number;
8 |   vat?: number;
9 |   vatRate?: number;
10 |   currency: string;
11 |   totalLabel: string;
12 |   taxLabel: string;
13 |   vatLabel: string;
14 |   locale: string;
15 |   discount?: number;
16 |   discountLabel: string;
17 |   includeDiscount: boolean;
18 |   includeVAT: boolean;
19 |   includeTax: boolean;
20 |   includeDecimals: boolean;
21 |   subtotalLabel: string;
22 |   subtotal: number;
23 | }
24 |
25 | export function Summary({
26 |   amount,
27 |   tax,
28 |   taxRate,
29 |   vat,
30 |   vatRate,
31 |   currency,
32 |   totalLabel,
33 |   taxLabel,
34 |   vatLabel,
35 |   locale,
36 |   discount,
37 |   discountLabel,
38 |   includeDiscount,
39 |   includeVAT,
40 |   includeTax,
41 |   includeDecimals,
42 |   subtotalLabel,
43 |   subtotal,
44 | }: SummaryProps) {
45 |   const maximumFractionDigits = includeDecimals ? 2 : 0;
46 |
47 |   return (
48 |     <View
49 |       style={{
50 |         marginTop: 60,
51 |         marginBottom: 40,
52 |         alignItems: "flex-end",
53 |         marginLeft: "auto",
54 |         width: 250,
55 |       }}
56 |     >
57 |       <View style={{ flexDirection: "row", marginBottom: 5, width: "100%" }}>
58 |         <Text style={{ fontSize: 9, flex: 1 }}>{subtotalLabel}</Text>
59 |         <Text style={{ fontSize: 9, textAlign: "right" }}>
60 |           {formatAmount({
61 |             currency,
62 |             amount: subtotal,
63 |             locale,
64 |             maximumFractionDigits,
65 |           })}
66 |         </Text>
67 |       </View>
68 |
69 |       {includeDiscount && discount && (
70 |         <View style={{ flexDirection: "row", marginBottom: 5, width: "100%" }}>
71 |           <Text style={{ fontSize: 9, flex: 1 }}>{discountLabel}</Text>
72 |           <Text style={{ fontSize: 9, textAlign: "right" }}>
73 |             {formatAmount({
74 |               currency,
75 |               amount: discount,
76 |               locale,
77 |               maximumFractionDigits,
78 |             })}
79 |           </Text>
80 |         </View>
81 |       )}
82 |
83 |       {includeVAT && (
84 |         <View style={{ flexDirection: "row", marginBottom: 5, width: "100%" }}>
85 |           <Text style={{ fontSize: 9, flex: 1 }}>
86 |             {vatLabel} ({vatRate}%)
87 |           </Text>
88 |           <Text style={{ fontSize: 9, textAlign: "right" }}>
89 |             {formatAmount({
90 |               currency,
91 |               amount: vat,
92 |               locale,
93 |               maximumFractionDigits,
94 |             })}
95 |           </Text>
96 |         </View>
97 |       )}
98 |
99 |       {includeTax && (
100 |         <View style={{ flexDirection: "row", marginBottom: 5, width: "100%" }}>
101 |           <Text style={{ fontSize: 9, flex: 1 }}>
102 |             {taxLabel} ({taxRate}%)
103 |           </Text>
104 |           <Text style={{ fontSize: 9, textAlign: "right" }}>
105 |             {formatAmount({
106 |               currency,
107 |               amount: tax,
108 |               locale,
109 |               maximumFractionDigits,
110 |             })}
111 |           </Text>
112 |         </View>
113 |       )}
114 |
115 |       <View
116 |         style={{
117 |           flexDirection: "row",
118 |           marginTop: 5,
119 |           borderTopWidth: 0.5,
120 |           borderTopColor: "#000",
121 |           justifyContent: "space-between",
122 |           alignItems: "center",
123 |           paddingTop: 5,
124 |           width: "100%",
125 |         }}
126 |       >
127 |         <Text style={{ fontSize: 9, marginRight: 10 }}>{totalLabel}</Text>
128 |         <Text style={{ fontSize: 21 }}>
129 |           {formatAmount({ currency, amount, locale, maximumFractionDigits })}
130 |         </Text>
131 |       </View>
132 |     </View>
133 |   );
134 | }
```

packages/ui/src/components/editor/extentions/register.ts
```
1 | // You can find the list of extensions here: https://tiptap.dev/docs/editor/extensions/functionality
2 |
3 | import Link from "@tiptap/extension-link";
4 | import Placeholder from "@tiptap/extension-placeholder";
5 | import Underline from "@tiptap/extension-underline";
6 | import StarterKit from "@tiptap/starter-kit";
7 |
8 | // Add your extensions here
9 | const extensions = [
10 |   StarterKit,
11 |   Underline,
12 |   Link.configure({
13 |     openOnClick: false,
14 |     autolink: true,
15 |     defaultProtocol: "https",
16 |   }),
17 | ];
18 |
19 | export function registerExtensions(options?: { placeholder?: string }) {
20 |   const { placeholder } = options ?? {};
21 |   return [...extensions, Placeholder.configure({ placeholder })];
22 | }
```

apps/dashboard/src/actions/ai/chat/tools/burn-rate.tsx
```
1 | import type { MutableAIState } from "@/actions/ai/types";
2 | import { calculateAvgBurnRate } from "@/utils/format";
3 | import { getBurnRate, getRunway } from "@midday/supabase/cached-queries";
4 | import { startOfMonth } from "date-fns";
5 | import { nanoid } from "nanoid";
6 | import { z } from "zod";
7 | import { BurnRateUI } from "./ui/burn-rate-ui";
8 |
9 | type Args = {
10 |   aiState: MutableAIState;
11 |   currency: string;
12 |   dateFrom: string;
13 |   dateTo: string;
14 | };
15 |
16 | export function getBurnRateTool({ aiState, dateFrom, dateTo }: Args) {
17 |   return {
18 |     description: "Get burn rate",
19 |     parameters: z.object({
20 |       startDate: z.coerce
21 |         .date()
22 |         .describe("The start date of the burn rate, in ISO-8601 format")
23 |         .default(new Date(dateFrom)),
24 |       endDate: z.coerce
25 |         .date()
26 |         .describe("The end date of the burn rate, in ISO-8601 format")
27 |         .default(new Date(dateTo)),
28 |       currency: z
29 |         .string()
30 |         .describe("The currency for the burn rate")
31 |         .optional(),
32 |     }),
33 |     generate: async (args) => {
34 |       const toolCallId = nanoid();
35 |
36 |       const { currency, startDate, endDate } = args;
37 |
38 |       const [{ data: months }, { data: burnRateData }] = await Promise.all([
39 |         getRunway({
40 |           currency,
41 |           from: startOfMonth(new Date(startDate)).toISOString(),
42 |           to: endDate.toISOString(),
43 |         }),
44 |         getBurnRate({
45 |           from: startDate.toISOString(),
46 |           to: endDate.toISOString(),
47 |           currency,
48 |         }),
49 |       ]);
50 |
51 |       const averageBurnRate = calculateAvgBurnRate(burnRateData);
52 |
53 |       const props = {
54 |         averageBurnRate,
55 |         currency,
56 |         startDate,
57 |         endDate,
58 |         months,
59 |         data: burnRateData,
60 |       };
61 |
62 |       aiState.done({
63 |         ...aiState.get(),
64 |         messages: [
65 |           ...aiState.get().messages,
66 |           {
67 |             id: nanoid(),
68 |             role: "assistant",
69 |             content: [
70 |               {
71 |                 type: "tool-call",
72 |                 toolName: "getBurnRate",
73 |                 toolCallId,
74 |                 args,
75 |               },
76 |             ],
77 |           },
78 |           {
79 |             id: nanoid(),
80 |             role: "tool",
81 |             content: [
82 |               {
83 |                 type: "tool-result",
84 |                 toolName: "getBurnRate",
85 |                 toolCallId,
86 |                 result: props,
87 |               },
88 |             ],
89 |           },
90 |         ],
91 |       });
92 |
93 |       return <BurnRateUI {...props} />;
94 |     },
95 |   };
96 | }
```

apps/dashboard/src/actions/ai/chat/tools/forecast.tsx
```
1 | import type { MutableAIState } from "@/actions/ai/types";
2 | import { openai } from "@ai-sdk/openai";
3 | import { getMetrics } from "@midday/supabase/cached-queries";
4 | import { generateText } from "ai";
5 | import { startOfMonth } from "date-fns";
6 | import { nanoid } from "nanoid";
7 | import { z } from "zod";
8 | import { ForecastUI } from "./ui/forecast-ui";
9 |
10 | type Args = {
11 |   aiState: MutableAIState;
12 |   dateFrom: string;
13 |   dateTo: string;
14 | };
15 |
16 | export function getForecastTool({ aiState, dateFrom, dateTo }: Args) {
17 |   return {
18 |     description: "Forecast profit or revenue",
19 |     parameters: z.object({
20 |       startDate: z.coerce
21 |         .date()
22 |         .describe("The start date of the forecast, in ISO-8601 format")
23 |         .default(new Date(dateFrom)),
24 |       endDate: z.coerce
25 |         .date()
26 |         .describe("The end date of the forecast, in ISO-8601 format")
27 |         .default(new Date(dateTo)),
28 |       type: z.enum(["profit", "revenue"]).describe("The type of forecast"),
29 |       currency: z.string().describe("The currency for forecast").optional(),
30 |     }),
31 |     generate: async (args) => {
32 |       const { currency, startDate, endDate, type } = args;
33 |
34 |       const data = await getMetrics({
35 |         from: startOfMonth(new Date(startDate)).toISOString(),
36 |         to: new Date(endDate).toISOString(),
37 |         type,
38 |         currency,
39 |       });
40 |
41 |       const prev = data?.result?.map((d) => {
42 |         return `${d.current.date}: ${Intl.NumberFormat("en", {
43 |           style: "currency",
44 |           currency: data.meta.currency,
45 |         }).format(d.current.value)}\n`;
46 |       });
47 |
48 |       const { text } = await generateText({
49 |         model: openai("gpt-4o-mini"),
50 |         system:
51 |           "You are a financial forecaster and analyst. Your task is to provide simple, clear, and concise content. Return only the result with a short description only with text. Make sure to mention that this is an indication of the forecast and should be verified.",
52 |         prompt: `forecast next month ${type} based on the last 12 months ${type}:\n${prev}
53 |           Current date: ${new Date().toISOString()}
54 |         `,
55 |       });
56 |
57 |       const toolCallId = nanoid();
58 |
59 |       const props = {
60 |         content: text,
61 |       };
62 |
63 |       aiState.done({
64 |         ...aiState.get(),
65 |         messages: [
66 |           ...aiState.get().messages,
67 |           {
68 |             id: nanoid(),
69 |             role: "assistant",
70 |             content: [
71 |               {
72 |                 type: "tool-call",
73 |                 toolName: "getForecast",
74 |                 toolCallId,
75 |                 args,
76 |               },
77 |             ],
78 |           },
79 |           {
80 |             id: nanoid(),
81 |             role: "tool",
82 |             content: [
83 |               {
84 |                 type: "tool-result",
85 |                 toolName: "getForecast",
86 |                 toolCallId,
87 |                 result: props,
88 |               },
89 |             ],
90 |           },
91 |         ],
92 |       });
93 |
94 |       return <ForecastUI {...props} />;
95 |     },
96 |   };
97 | }
```

apps/dashboard/src/actions/ai/chat/tools/get-documents.tsx
```
1 | import type { MutableAIState } from "@/actions/ai/types";
2 | import { getVaultQuery } from "@midday/supabase/queries";
3 | import { createClient } from "@midday/supabase/server";
4 | import { nanoid } from "nanoid";
5 | import { z } from "zod";
6 | import { DocumentsUI } from "./ui/documents-ui";
7 |
8 | type Args = {
9 |   aiState: MutableAIState;
10 |   teamId: string;
11 | };
12 |
13 | export function getDocumentsTool({ aiState, teamId }: Args) {
14 |   return {
15 |     description: "Find documents",
16 |     parameters: z.object({
17 |       name: z.string().describe("The name of the document"),
18 |     }),
19 |     generate: async (args) => {
20 |       const { name } = args;
21 |       const supabase = createClient();
22 |
23 |       const { data } = await getVaultQuery(supabase, {
24 |         teamId,
25 |         searchQuery: name,
26 |       });
27 |
28 |       const formattedData = data?.map((item) => ({
29 |         ...item,
30 |         content_type: item?.metadata?.mimetype,
31 |         display_name: item?.name,
32 |         file_path: item?.path_tokens,
33 |       }));
34 |
35 |       const props = {
36 |         data: formattedData,
37 |       };
38 |
39 |       const toolCallId = nanoid();
40 |
41 |       aiState.done({
42 |         ...aiState.get(),
43 |         messages: [
44 |           ...aiState.get().messages,
45 |           {
46 |             id: nanoid(),
47 |             role: "assistant",
48 |             content: [
49 |               {
50 |                 type: "tool-call",
51 |                 toolName: "getDocuments",
52 |                 toolCallId,
53 |                 args,
54 |               },
55 |             ],
56 |           },
57 |           {
58 |             id: nanoid(),
59 |             role: "tool",
60 |             content: [
61 |               {
62 |                 type: "tool-result",
63 |                 toolName: "getDocuments",
64 |                 toolCallId,
65 |                 result: props,
66 |               },
67 |             ],
68 |           },
69 |         ],
70 |       });
71 |
72 |       return <DocumentsUI {...props} />;
73 |     },
74 |   };
75 | }
```

apps/dashboard/src/actions/ai/chat/tools/get-invoces.tsx
```
1 | import type { MutableAIState } from "@/actions/ai/types";
2 | import { getInboxSearchQuery } from "@midday/supabase/queries";
3 | import { createClient } from "@midday/supabase/server";
4 | import { nanoid } from "nanoid";
5 | import { z } from "zod";
6 | import { DocumentsUI } from "./ui/documents-ui";
7 |
8 | type Args = {
9 |   aiState: MutableAIState;
10 |   teamId: string;
11 | };
12 |
13 | export function getInvoicesTool({ aiState, teamId }: Args) {
14 |   return {
15 |     description: "Find receipt or invoice",
16 |     parameters: z.object({
17 |       name: z.string().describe("The name of the invoice or receipt"),
18 |     }),
19 |     generate: async (args) => {
20 |       const { name, amount } = args;
21 |       const supabase = createClient();
22 |
23 |       const searchQuery = name || amount;
24 |
25 |       const data = await getInboxSearchQuery(supabase, {
26 |         teamId,
27 |         q: searchQuery,
28 |       });
29 |
30 |       const props = {
31 |         data,
32 |       };
33 |
34 |       const toolCallId = nanoid();
35 |
36 |       aiState.done({
37 |         ...aiState.get(),
38 |         messages: [
39 |           ...aiState.get().messages,
40 |           {
41 |             id: nanoid(),
42 |             role: "assistant",
43 |             content: [
44 |               {
45 |                 type: "tool-call",
46 |                 toolName: "getInvoices",
47 |                 toolCallId,
48 |                 args,
49 |               },
50 |             ],
51 |           },
52 |           {
53 |             id: nanoid(),
54 |             role: "tool",
55 |             content: [
56 |               {
57 |                 type: "tool-result",
58 |                 toolName: "getInvoices",
59 |                 toolCallId,
60 |                 result: props,
61 |               },
62 |             ],
63 |           },
64 |         ],
65 |       });
66 |
67 |       return <DocumentsUI {...props} />;
68 |     },
69 |   };
70 | }
```

apps/dashboard/src/actions/ai/chat/tools/get-transactions.tsx
```
1 | import type { MutableAIState } from "@/actions/ai/types";
2 | import { getTransactions } from "@midday/supabase/cached-queries";
3 | import { nanoid } from "nanoid";
4 | import { z } from "zod";
5 | import { TransactionsUI } from "./ui/transactions-ui";
6 |
7 | type Args = {
8 |   aiState: MutableAIState;
9 | };
10 |
11 | export function getTransactionsTool({ aiState }: Args) {
12 |   return {
13 |     description: "Find transactions or show expenses",
14 |     parameters: z.object({
15 |       name: z.string().describe("The name of the transactions").optional(),
16 |       categories: z
17 |         .array(z.string())
18 |         .describe("The categories of the transactions")
19 |         .optional(),
20 |       amount: z.string().describe("The amount of the transactions").optional(),
21 |       expense: z
22 |         .boolean()
23 |         .describe("Filter for expense transactions")
24 |         .optional(),
25 |       recurring: z
26 |         .array(z.enum(["all", "weekly", "monthly", "annually"]))
27 |         .describe("Filter for recurring transactions")
28 |         .optional(),
29 |       attachments: z
30 |         .enum(["include", "exclude"])
31 |         .describe(
32 |           "Filter transactions if they are completed or not, if they have receipts or attachments",
33 |         )
34 |         .optional(),
35 |       limit: z.number().describe("Limit the number of transactions").optional(),
36 |       fromDate: z.coerce
37 |         .date()
38 |         .describe("Filter transactions from this date, in ISO-8601 format")
39 |         .optional(),
40 |       toDate: z.coerce
41 |         .date()
42 |         .describe("Filter transactions to this date, in ISO-8601 format")
43 |         .optional(),
44 |     }),
45 |     generate: async (args) => {
46 |       const {
47 |         name,
48 |         categories,
49 |         amount,
50 |         expense,
51 |         limit = 4,
52 |         fromDate,
53 |         toDate,
54 |         attachments,
55 |         recurring,
56 |       } = args;
57 |
58 |       const toolCallId = nanoid();
59 |
60 |       const searchQuery = name || amount;
61 |
62 |       const filter = {
63 |         start: fromDate,
64 |         end: toDate,
65 |         categories,
66 |         attachments,
67 |         recurring,
68 |       };
69 |
70 |       const sort = expense ? ["amount", "asc"] : undefined;
71 |
72 |       const { data, meta } = await getTransactions({
73 |         searchQuery,
74 |         from: 0,
75 |         to: limit,
76 |         filter,
77 |         sort,
78 |       });
79 |
80 |       const props = {
81 |         data,
82 |         meta,
83 |         q: searchQuery,
84 |         filter,
85 |         sort,
86 |       };
87 |
88 |       aiState.done({
89 |         ...aiState.get(),
90 |         messages: [
91 |           ...aiState.get().messages,
92 |           {
93 |             id: nanoid(),
94 |             role: "assistant",
95 |             content: [
96 |               {
97 |                 type: "tool-call",
98 |                 toolName: "getTransactions",
99 |                 toolCallId,
100 |                 args,
101 |               },
102 |             ],
103 |           },
104 |           {
105 |             id: nanoid(),
106 |             role: "tool",
107 |             content: [
108 |               {
109 |                 type: "tool-result",
110 |                 toolName: "getTransactions",
111 |                 toolCallId,
112 |                 result: props,
113 |               },
114 |             ],
115 |           },
116 |         ],
117 |       });
118 |
119 |       return <TransactionsUI {...props} />;
120 |     },
121 |   };
122 | }
```

apps/dashboard/src/actions/ai/chat/tools/profit.tsx
```
1 | import type { MutableAIState } from "@/actions/ai/types";
2 | import { getMetrics } from "@midday/supabase/cached-queries";
3 | import { startOfMonth } from "date-fns";
4 | import { nanoid } from "nanoid";
5 | import { z } from "zod";
6 | import { ProfitUI } from "./ui/profit-ui";
7 |
8 | type Args = {
9 |   aiState: MutableAIState;
10 |   dateFrom: string;
11 |   dateTo: string;
12 | };
13 |
14 | export function getProfitTool({ aiState, dateFrom, dateTo }: Args) {
15 |   return {
16 |     description: "Get profit",
17 |     parameters: z.object({
18 |       startDate: z.coerce
19 |         .date()
20 |         .describe("The start date of the profit, in ISO-8601 format")
21 |         .default(new Date(dateFrom)),
22 |       endDate: z.coerce
23 |         .date()
24 |         .describe("The end date of the profit, in ISO-8601 format")
25 |         .default(new Date(dateTo)),
26 |       currency: z.string().describe("The currency for profit").optional(),
27 |     }),
28 |     generate: async (args) => {
29 |       const { currency, startDate, endDate } = args;
30 |
31 |       const data = await getMetrics({
32 |         from: startOfMonth(new Date(startDate)).toISOString(),
33 |         to: new Date(endDate).toISOString(),
34 |         type: "profit",
35 |         currency,
36 |       });
37 |
38 |       const toolCallId = nanoid();
39 |
40 |       const props = {
41 |         data,
42 |         startDate: startOfMonth(new Date(startDate)).toISOString(),
43 |         endDate: new Date(endDate).toISOString(),
44 |       };
45 |
46 |       aiState.done({
47 |         ...aiState.get(),
48 |         messages: [
49 |           ...aiState.get().messages,
50 |           {
51 |             id: nanoid(),
52 |             role: "assistant",
53 |             content: [
54 |               {
55 |                 type: "tool-call",
56 |                 toolName: "getProfit",
57 |                 toolCallId,
58 |                 args,
59 |               },
60 |             ],
61 |           },
62 |           {
63 |             id: nanoid(),
64 |             role: "tool",
65 |             content: [
66 |               {
67 |                 type: "tool-result",
68 |                 toolName: "getProfit",
69 |                 toolCallId,
70 |                 result: props,
71 |               },
72 |             ],
73 |           },
74 |         ],
75 |       });
76 |
77 |       return <ProfitUI {...props} />;
78 |     },
79 |   };
80 | }
```

apps/dashboard/src/actions/ai/chat/tools/report.tsx
```
1 | import type { MutableAIState } from "@/actions/ai/types";
2 | import { dub } from "@/utils/dub";
3 | import { createClient } from "@midday/supabase/server";
4 | import { startOfMonth } from "date-fns";
5 | import { nanoid } from "nanoid";
6 | import { z } from "zod";
7 | import { ReportUI } from "./ui/report-ui";
8 |
9 | type Args = {
10 |   aiState: MutableAIState;
11 |   userId: string;
12 |   teamId: string;
13 |   dateFrom: string;
14 |   dateTo: string;
15 | };
16 |
17 | export function createReport({
18 |   aiState,
19 |   userId,
20 |   teamId,
21 |   dateFrom,
22 |   dateTo,
23 | }: Args) {
24 |   return {
25 |     description: "Create report",
26 |     parameters: z.object({
27 |       startDate: z.coerce
28 |         .date()
29 |         .describe("The start date of the report, in ISO-8601 format")
30 |         .default(new Date(dateFrom)),
31 |       endDate: z.coerce
32 |         .date()
33 |         .describe("The end date of the report, in ISO-8601 format")
34 |         .default(new Date(dateTo)),
35 |       type: z
36 |         .enum(["profit", "revenue", "burn_rate", "expense"])
37 |         .describe("The report type"),
38 |       currency: z.string().describe("The currency for the report").optional(),
39 |     }),
40 |     generate: async (args) => {
41 |       const { currency, startDate, endDate, type, expiresAt } = args;
42 |
43 |       const supabase = createClient();
44 |
45 |       const { data } = await supabase
46 |         .from("reports")
47 |         .insert({
48 |           team_id: teamId,
49 |           from: startOfMonth(new Date(startDate)).toISOString(),
50 |           to: new Date(endDate).toISOString(),
51 |           type,
52 |           expire_at: expiresAt,
53 |           currency,
54 |           created_by: userId,
55 |         })
56 |         .select("*")
57 |         .single();
58 |
59 |       const link = await dub.links.create({
60 |         url: `https://app.midday.ai/report/${data.id}`,
61 |         expiresAt,
62 |       });
63 |
64 |       const { data: linkData } = await supabase
65 |         .from("reports")
66 |         .update({
67 |           link_id: link.id,
68 |           short_link: link.shortLink,
69 |         })
70 |         .eq("id", data.id)
71 |         .select("*")
72 |         .single();
73 |
74 |       const props = {
75 |         startDate: linkData?.from,
76 |         endDate: linkData?.to,
77 |         shortLink: linkData?.short_link,
78 |         type: linkData?.type,
79 |       };
80 |
81 |       const toolCallId = nanoid();
82 |
83 |       aiState.done({
84 |         ...aiState.get(),
85 |         messages: [
86 |           ...aiState.get().messages,
87 |           {
88 |             id: nanoid(),
89 |             role: "assistant",
90 |             content: [
91 |               {
92 |                 type: "tool-call",
93 |                 toolName: "createReport",
94 |                 toolCallId,
95 |                 args,
96 |               },
97 |             ],
98 |           },
99 |           {
100 |             id: nanoid(),
101 |             role: "tool",
102 |             content: [
103 |               {
104 |                 type: "tool-result",
105 |                 toolName: "createReport",
106 |                 toolCallId,
107 |                 result: props,
108 |               },
109 |             ],
110 |           },
111 |         ],
112 |       });
113 |       return <ReportUI {...props} />;
114 |     },
115 |   };
116 | }
```

apps/dashboard/src/actions/ai/chat/tools/revenue.tsx
```
1 | import type { MutableAIState } from "@/actions/ai/types";
2 | import { getMetrics } from "@midday/supabase/cached-queries";
3 | import { startOfMonth } from "date-fns";
4 | import { nanoid } from "nanoid";
5 | import { z } from "zod";
6 | import { RevenueUI } from "./ui/revenue-ui";
7 |
8 | type Args = {
9 |   aiState: MutableAIState;
10 |   dateFrom: string;
11 |   dateTo: string;
12 | };
13 |
14 | export function getRevenueTool({ aiState, dateFrom, dateTo }: Args) {
15 |   return {
16 |     description: "Get revenue",
17 |     parameters: z.object({
18 |       startDate: z.coerce
19 |         .date()
20 |         .describe("The start date of the revenue, in ISO-8601 format")
21 |         .default(new Date(dateFrom)),
22 |       endDate: z.coerce
23 |         .date()
24 |         .describe("The end date of the revenue, in ISO-8601 format")
25 |         .default(new Date(dateTo)),
26 |       currency: z.string().describe("The currency for revenue").optional(),
27 |     }),
28 |     generate: async (args) => {
29 |       const { currency, startDate, endDate } = args;
30 |
31 |       const data = await getMetrics({
32 |         from: startOfMonth(new Date(startDate)).toISOString(),
33 |         to: new Date(endDate).toISOString(),
34 |         type: "revenue",
35 |         currency,
36 |       });
37 |
38 |       const toolCallId = nanoid();
39 |
40 |       const props = {
41 |         data,
42 |         startDate,
43 |         endDate,
44 |       };
45 |
46 |       aiState.done({
47 |         ...aiState.get(),
48 |         messages: [
49 |           ...aiState.get().messages,
50 |           {
51 |             id: nanoid(),
52 |             role: "assistant",
53 |             content: [
54 |               {
55 |                 type: "tool-call",
56 |                 toolName: "getRevenue",
57 |                 toolCallId,
58 |                 args,
59 |               },
60 |             ],
61 |           },
62 |           {
63 |             id: nanoid(),
64 |             role: "tool",
65 |             content: [
66 |               {
67 |                 type: "tool-result",
68 |                 toolName: "getRevenue",
69 |                 toolCallId,
70 |                 result: props,
71 |               },
72 |             ],
73 |           },
74 |         ],
75 |       });
76 |
77 |       return <RevenueUI {...props} />;
78 |     },
79 |   };
80 | }
```

apps/dashboard/src/actions/ai/chat/tools/runway.tsx
```
1 | import type { MutableAIState } from "@/actions/ai/types";
2 | import { getRunway } from "@midday/supabase/cached-queries";
3 | import { startOfMonth } from "date-fns";
4 | import { nanoid } from "nanoid";
5 | import { z } from "zod";
6 | import { RunwayUI } from "./ui/runway-ui";
7 |
8 | type Args = {
9 |   aiState: MutableAIState;
10 |   dateFrom: string;
11 |   dateTo: string;
12 | };
13 |
14 | export function getRunwayTool({ aiState, dateFrom, dateTo }: Args) {
15 |   return {
16 |     description: "Get runway",
17 |     parameters: z.object({
18 |       startDate: z.coerce
19 |         .date()
20 |         .describe("The start date of the runway, in ISO-8601 format")
21 |         .default(new Date(dateFrom)),
22 |       endDate: z.coerce
23 |         .date()
24 |         .describe("The end date of the runway, in ISO-8601 format")
25 |         .default(new Date(dateTo)),
26 |       currency: z.string().describe("The currency for the runway").optional(),
27 |     }),
28 |     generate: async (args) => {
29 |       const { currency, startDate, endDate } = args;
30 |
31 |       const { data } = await getRunway({
32 |         currency,
33 |         from: startOfMonth(new Date(startDate)).toISOString(),
34 |         to: endDate.toISOString(),
35 |       });
36 |
37 |       const toolCallId = nanoid();
38 |
39 |       const props = {
40 |         months: data,
41 |       };
42 |
43 |       aiState.done({
44 |         ...aiState.get(),
45 |         messages: [
46 |           ...aiState.get().messages,
47 |           {
48 |             id: nanoid(),
49 |             role: "assistant",
50 |             content: [
51 |               {
52 |                 type: "tool-call",
53 |                 toolName: "getRunway",
54 |                 toolCallId,
55 |                 args,
56 |               },
57 |             ],
58 |           },
59 |           {
60 |             id: nanoid(),
61 |             role: "tool",
62 |             content: [
63 |               {
64 |                 type: "tool-result",
65 |                 toolName: "getRunway",
66 |                 toolCallId,
67 |                 result: props,
68 |               },
69 |             ],
70 |           },
71 |         ],
72 |       });
73 |
74 |       return <RunwayUI {...props} />;
75 |     },
76 |   };
77 | }
```

apps/dashboard/src/actions/ai/chat/tools/spending.tsx
```
1 | import type { MutableAIState } from "@/actions/ai/types";
2 | import { getSpending } from "@midday/supabase/cached-queries";
3 | import { startOfMonth } from "date-fns";
4 | import { nanoid } from "nanoid";
5 | import { z } from "zod";
6 | import { SpendingUI } from "./ui/spending-ui";
7 |
8 | type Args = {
9 |   aiState: MutableAIState;
10 |   dateFrom: string;
11 |   dateTo: string;
12 | };
13 |
14 | export function getSpendingTool({ aiState, dateFrom, dateTo }: Args) {
15 |   return {
16 |     description: "Get spending from category",
17 |     parameters: z.object({
18 |       currency: z.string().describe("The currency for spending").optional(),
19 |       category: z.string().describe("The category for spending"),
20 |       startDate: z.coerce
21 |         .date()
22 |         .describe("The start date of the spending, in ISO-8601 format")
23 |         .default(new Date(dateFrom)),
24 |       endDate: z.coerce
25 |         .date()
26 |         .describe("The end date of the spending, in ISO-8601 format")
27 |         .default(new Date(dateTo)),
28 |     }),
29 |     generate: async (args) => {
30 |       const { startDate, endDate, currency, category } = args;
31 |       const toolCallId = nanoid();
32 |
33 |       const { data } = await getSpending({
34 |         from: startOfMonth(new Date(startDate)).toISOString(),
35 |         to: new Date(endDate).toISOString(),
36 |         currency,
37 |       });
38 |
39 |       const found = data.find(
40 |         (c) => category.toLowerCase() === c?.name?.toLowerCase(),
41 |       );
42 |
43 |       const props = {
44 |         currency: found?.currency,
45 |         category,
46 |         amount: found?.amount,
47 |         name: found?.name,
48 |         startDate,
49 |         endDate,
50 |       };
51 |
52 |       aiState.done({
53 |         ...aiState.get(),
54 |         messages: [
55 |           ...aiState.get().messages,
56 |           {
57 |             id: nanoid(),
58 |             role: "assistant",
59 |             content: [
60 |               {
61 |                 type: "tool-call",
62 |                 toolName: "getSpending",
63 |                 toolCallId,
64 |                 args,
65 |               },
66 |             ],
67 |           },
68 |           {
69 |             id: nanoid(),
70 |             role: "tool",
71 |             content: [
72 |               {
73 |                 type: "tool-result",
74 |                 toolName: "getSpending",
75 |                 toolCallId,
76 |                 result: props,
77 |               },
78 |             ],
79 |           },
80 |         ],
81 |       });
82 |
83 |       return <SpendingUI {...props} />;
84 |     },
85 |   };
86 | }
```

apps/dashboard/src/app/[locale]/(app)/(sidebar)/error.tsx
```
1 | "use client";
2 |
3 | import { Button } from "@midday/ui/button";
4 | import * as Sentry from "@sentry/nextjs";
5 | import Link from "next/link";
6 | import { useEffect } from "react";
7 |
8 | export default function ErrorPage({
9 |   reset,
10 |   error,
11 | }: { reset: () => void; error: Error & { digest?: string } }) {
12 |   useEffect(() => {
13 |     Sentry.captureException(error);
14 |   }, [error]);
15 |
16 |   return (
17 |     <div className="h-[calc(100vh-200px)] w-full">
18 |       <div className="mt-8 flex flex-col items-center justify-center h-full">
19 |         <div className="flex justify-between items-center flex-col mt-8 text-center mb-8">
20 |           <h2 className="font-medium mb-4">Something went wrong</h2>
21 |           <p className="text-sm text-[#878787]">
22 |             An unexpected error has occurred. Please try again
23 |             <br /> or contact support if the issue persists.
24 |           </p>
25 |         </div>
26 |
27 |         <div className="flex space-x-4">
28 |           <Button onClick={() => reset()} variant="outline">
29 |             Try again
30 |           </Button>
31 |
32 |           <Link href="/account/support">
33 |             <Button>Contact us</Button>
34 |           </Link>
35 |         </div>
36 |       </div>
37 |     </div>
38 |   );
39 | }
```

apps/dashboard/src/app/[locale]/(app)/(sidebar)/layout.tsx
```
1 | import { AI } from "@/actions/ai/chat";
2 | import { DefaultSettings } from "@/components/default-settings.server";
3 | import { Header } from "@/components/header";
4 | import { GlobalSheets } from "@/components/sheets/global-sheets";
5 | import { Sidebar } from "@/components/sidebar";
6 | import { UserProvider } from "@/store/user/provider";
7 | import { setupAnalytics } from "@midday/events/server";
8 | import { getCountryCode, getCurrency } from "@midday/location";
9 | import { uniqueCurrencies } from "@midday/location/currencies";
10 | import { getUser } from "@midday/supabase/cached-queries";
11 | import { nanoid } from "nanoid";
12 | import dynamic from "next/dynamic";
13 | import { redirect } from "next/navigation";
14 | import { Suspense } from "react";
15 |
16 | const AssistantModal = dynamic(
17 |   () =>
18 |     import("@/components/assistant/assistant-modal").then(
19 |       (mod) => mod.AssistantModal,
20 |     ),
21 |   {
22 |     ssr: false,
23 |   },
24 | );
25 |
26 | const ExportStatus = dynamic(
27 |   () => import("@/components/export-status").then((mod) => mod.ExportStatus),
28 |   {
29 |     ssr: false,
30 |   },
31 | );
32 |
33 | const SelectBankAccountsModal = dynamic(
34 |   () =>
35 |     import("@/components/modals/select-bank-accounts").then(
36 |       (mod) => mod.SelectBankAccountsModal,
37 |     ),
38 |   {
39 |     ssr: false,
40 |   },
41 | );
42 |
43 | const ImportModal = dynamic(
44 |   () =>
45 |     import("@/components/modals/import-modal").then((mod) => mod.ImportModal),
46 |   {
47 |     ssr: false,
48 |   },
49 | );
50 |
51 | const HotKeys = dynamic(
52 |   () => import("@/components/hot-keys").then((mod) => mod.HotKeys),
53 |   {
54 |     ssr: false,
55 |   },
56 | );
57 |
58 | const ConnectTransactionsModal = dynamic(
59 |   () =>
60 |     import("@/components/modals/connect-transactions-modal").then(
61 |       (mod) => mod.ConnectTransactionsModal,
62 |     ),
63 |   {
64 |     ssr: false,
65 |   },
66 | );
67 |
68 | export default async function Layout({
69 |   children,
70 | }: {
71 |   children: React.ReactNode;
72 | }) {
73 |   const user = await getUser();
74 |   const countryCode = getCountryCode();
75 |   const currency = getCurrency();
76 |
77 |   if (!user?.data?.team) {
78 |     redirect("/teams");
79 |   }
80 |
81 |   if (user) {
82 |     await setupAnalytics({ userId: user.data.id });
83 |   }
84 |
85 |   return (
86 |     <UserProvider data={user.data}>
87 |       <div className="relative">
88 |         <AI
89 |           initialAIState={{ user: user.data, messages: [], chatId: nanoid() }}
90 |         >
91 |           <Sidebar />
92 |
93 |           <div className="mx-4 md:ml-[95px] md:mr-10 pb-8">
94 |             <Header />
95 |             {children}
96 |           </div>
97 |
98 |           {/* This is used to make the header draggable on macOS */}
99 |           <div className="hidden todesktop:block todesktop:[-webkit-app-region:drag] fixed top-0 w-full h-4 pointer-events-none" />
100 |
101 |           <AssistantModal />
102 |           <ConnectTransactionsModal countryCode={countryCode} />
103 |           <SelectBankAccountsModal />
104 |           <ImportModal
105 |             currencies={uniqueCurrencies}
106 |             defaultCurrency={currency}
107 |           />
108 |           <ExportStatus />
109 |           <HotKeys />
110 |
111 |           <Suspense>
112 |             <GlobalSheets defaultCurrency={currency} />
113 |           </Suspense>
114 |
115 |           <Suspense>
116 |             {/* Set default user timezone and locale */}
117 |             <DefaultSettings />
118 |           </Suspense>
119 |         </AI>
120 |       </div>
121 |     </UserProvider>
122 |   );
123 | }
```

apps/dashboard/src/app/[locale]/(app)/(sidebar)/page.tsx
```
1 | import { ChartSelectors } from "@/components/charts/chart-selectors";
2 | import { Charts } from "@/components/charts/charts";
3 | import { EmptyState } from "@/components/charts/empty-state";
4 | import { OverviewModal } from "@/components/modals/overview-modal";
5 | import { Widgets } from "@/components/widgets";
6 | import { Cookies } from "@/utils/constants";
7 | import { getTeamBankAccounts } from "@midday/supabase/cached-queries";
8 | import { cn } from "@midday/ui/cn";
9 | import { startOfMonth, startOfYear, subMonths } from "date-fns";
10 | import type { Metadata } from "next";
11 | import { cookies } from "next/headers";
12 |
13 | // NOTE: GoCardLess serverAction needs this currently
14 | // (Fetch accounts takes up to 20s and default limit is 15s)
15 | export const maxDuration = 30;
16 |
17 | export const metadata: Metadata = {
18 |   title: "Overview | Midday",
19 | };
20 |
21 | const defaultValue = {
22 |   from: subMonths(startOfMonth(new Date()), 12).toISOString(),
23 |   to: new Date().toISOString(),
24 |   period: "monthly",
25 | };
26 |
27 | export default async function Overview({ searchParams }) {
28 |   const accounts = await getTeamBankAccounts();
29 |   const chartType = cookies().get(Cookies.ChartType)?.value ?? "profit";
30 |
31 |   const hideConnectFlow = cookies().has(Cookies.HideConnectFlow);
32 |
33 |   const initialPeriod = cookies().has(Cookies.SpendingPeriod)
34 |     ? JSON.parse(cookies().get(Cookies.SpendingPeriod)?.value)
35 |     : {
36 |         id: "this_year",
37 |         from: startOfYear(new Date()).toISOString(),
38 |         to: new Date().toISOString(),
39 |       };
40 |
41 |   const value = {
42 |     ...(searchParams.from && { from: searchParams.from }),
43 |     ...(searchParams.to && { to: searchParams.to }),
44 |   };
45 |
46 |   const isEmpty = !accounts?.data?.length;
47 |
48 |   return (
49 |     <>
50 |       <div>
51 |         <div className="h-[530px] mb-4">
52 |           <ChartSelectors defaultValue={defaultValue} />
53 |
54 |           <div className="mt-8 relative">
55 |             {isEmpty && <EmptyState />}
56 |
57 |             <div className={cn(isEmpty && "blur-[8px] opacity-20")}>
58 |               <Charts
59 |                 value={value}
60 |                 defaultValue={defaultValue}
61 |                 disabled={isEmpty}
62 |                 type={chartType}
63 |                 currency={searchParams.currency}
64 |               />
65 |             </div>
66 |           </div>
67 |         </div>
68 |
69 |         <Widgets
70 |           initialPeriod={initialPeriod}
71 |           disabled={isEmpty}
72 |           searchParams={searchParams}
73 |         />
74 |       </div>
75 |
76 |       <OverviewModal defaultOpen={isEmpty && !hideConnectFlow} />
77 |     </>
78 |   );
79 | }
```

apps/dashboard/src/app/[locale]/(app)/setup/page.tsx
```
1 | import { SetupForm } from "@/components/setup-form";
2 | import { getSession, getUser } from "@midday/supabase/cached-queries";
3 | import { Icons } from "@midday/ui/icons";
4 | import type { Metadata } from "next";
5 | import Link from "next/link";
6 | import { redirect } from "next/navigation";
7 |
8 | export const metadata: Metadata = {
9 |   title: "Setup account | Midday",
10 | };
11 |
12 | export default async function Page() {
13 |   const { data } = await getUser();
14 |
15 |   if (!data?.id) {
16 |     return redirect("/");
17 |   }
18 |
19 |   return (
20 |     <div>
21 |       <div className="absolute left-5 top-4 md:left-10 md:top-10">
22 |         <Link href="/">
23 |           <Icons.Logo />
24 |         </Link>
25 |       </div>
26 |
27 |       <div className="flex min-h-screen justify-center items-center overflow-hidden p-6 md:p-0">
28 |         <div className="relative z-20 m-auto flex w-full max-w-[380px] flex-col">
29 |           <h1 className="text-2xl font-medium pb-4">Update your account</h1>
30 |           <p className="text-sm text-[#878787] mb-8">
31 |             Add your name and an optional avatar.
32 |           </p>
33 |
34 |           <SetupForm
35 |             userId={data.id}
36 |             avatarUrl={data.avatar_url}
37 |             fullName={data.full_name}
38 |           />
39 |         </div>
40 |       </div>
41 |     </div>
42 |   );
43 | }
```

apps/dashboard/src/app/[locale]/(app)/teams/page.tsx
```
1 | import { SelectTeamTable } from "@/components/tables/select-team/table";
2 | import { UserMenu } from "@/components/user-menu";
3 | import { getUser } from "@midday/supabase/cached-queries";
4 | import { getTeamsByUserIdQuery } from "@midday/supabase/queries";
5 | import { createClient } from "@midday/supabase/server";
6 | import { Icons } from "@midday/ui/icons";
7 | import type { Metadata } from "next";
8 | import Link from "next/link";
9 | import { redirect } from "next/navigation";
10 | import { Suspense } from "react";
11 |
12 | export const metadata: Metadata = {
13 |   title: "Teams | Midday",
14 | };
15 |
16 | export default async function Teams() {
17 |   const supabase = createClient();
18 |   const user = await getUser();
19 |
20 |   const teams = await getTeamsByUserIdQuery(supabase, user?.data?.id);
21 |
22 |   if (!teams?.data?.length) {
23 |     redirect("/teams/create");
24 |   }
25 |
26 |   return (
27 |     <>
28 |       <header className="w-full absolute left-0 right-0 flex justify-between items-center">
29 |         <div className="ml-5 mt-4 md:ml-10 md:mt-10">
30 |           <Link href="/">
31 |             <Icons.Logo />
32 |           </Link>
33 |         </div>
34 |
35 |         <div className="mr-5 mt-4 md:mr-10 md:mt-10">
36 |           <Suspense>
37 |             <UserMenu onlySignOut />
38 |           </Suspense>
39 |         </div>
40 |       </header>
41 |
42 |       <div className="flex min-h-screen justify-center items-center overflow-hidden p-6 md:p-0">
43 |         <div className="relative z-20 m-auto flex w-full max-w-[480px] flex-col">
44 |           <div>
45 |             <h1 className="text-2xl font-medium pb-4">Welcome back</h1>
46 |             <p className="text-sm text-[#878787] mb-8">
47 |               Select team or create a new one.
48 |             </p>
49 |           </div>
50 |
51 |           <SelectTeamTable data={teams.data} />
52 |
53 |           <div className="text-center mt-8 border-t-[1px] border-border pt-6">
54 |             <Link href="/teams/create" className="text-sm">
55 |               Create team
56 |             </Link>
57 |           </div>
58 |         </div>
59 |       </div>
60 |     </>
61 |   );
62 | }
```

apps/dashboard/src/app/[locale]/(public)/all-done/event-emitter.tsx
```
1 | "use client";
2 |
3 | import { useEffect } from "react";
4 | import type { WindowEvent } from "./schema";
5 |
6 | type Props = {
7 |   event: WindowEvent;
8 | };
9 |
10 | export const EventEmitter = ({ event }: Props) => {
11 |   useEffect(() => {
12 |     if (!window?.opener) {
13 |       return;
14 |     }
15 |
16 |     if (event) {
17 |       window.opener.postMessage(event, "*");
18 |     }
19 |   }, [event]);
20 |
21 |   return null;
22 | };
```

apps/dashboard/src/app/[locale]/(public)/all-done/page.tsx
```
1 | import Image from "next/image";
2 | import { notFound } from "next/navigation";
3 | import appIcon from "public/appicon.png";
4 | import { EventEmitter } from "./event-emitter";
5 | import { searchParamsSchema } from "./schema";
6 |
7 | type Props = {
8 |   searchParams: Record<string, string | string[] | undefined>;
9 | };
10 |
11 | const AllDonePage = ({ searchParams }: Props) => {
12 |   const parsedSearchParams = searchParamsSchema.safeParse(searchParams);
13 |
14 |   if (!parsedSearchParams.success) {
15 |     notFound();
16 |   }
17 |
18 |   return (
19 |     <>
20 |       <EventEmitter event={parsedSearchParams.data.event} />
21 |       <div>
22 |         <div className="h-screen flex flex-col items-center justify-center text-center text-sm text-[#606060]">
23 |           <Image
24 |             src={appIcon}
25 |             width={80}
26 |             height={80}
27 |             alt="Midday"
28 |             quality={100}
29 |             className="mb-10"
30 |           />
31 |
32 |           <p>You may close this browser tab when done</p>
33 |         </div>
34 |       </div>
35 |     </>
36 |   );
37 | };
38 |
39 | export default AllDonePage;
```

apps/dashboard/src/app/[locale]/(public)/all-done/schema.ts
```
1 | import { z } from "zod";
2 |
3 | export const searchParamsSchema = z.object({
4 |   event: z.literal("app_oauth_completed"),
5 | });
6 |
7 | export type WindowEvent = z.infer<typeof searchParamsSchema>["event"];
```

apps/dashboard/src/app/[locale]/(public)/login/page.tsx
```
1 | import { AppleSignIn } from "@/components/apple-sign-in";
2 | import { ConsentBanner } from "@/components/consent-banner";
3 | import { DesktopCommandMenuSignIn } from "@/components/desktop-command-menu-sign-in";
4 | import { GithubSignIn } from "@/components/github-sign-in";
5 | import { GoogleSignIn } from "@/components/google-sign-in";
6 | import { OTPSignIn } from "@/components/otp-sign-in";
7 | import { SlackSignIn } from "@/components/slack-sign-in";
8 | import { Cookies } from "@/utils/constants";
9 | import { isEU } from "@midday/location";
10 | import {
11 |   Accordion,
12 |   AccordionContent,
13 |   AccordionItem,
14 |   AccordionTrigger,
15 | } from "@midday/ui/accordion";
16 | import { Icons } from "@midday/ui/icons";
17 | import type { Metadata } from "next";
18 | import { cookies, headers } from "next/headers";
19 | import Link from "next/link";
20 | import { userAgent } from "next/server";
21 |
22 | export const metadata: Metadata = {
23 |   title: "Login | Midday",
24 | };
25 |
26 | export default async function Page(params) {
27 |   if (params?.searchParams?.return_to === "desktop/command") {
28 |     return <DesktopCommandMenuSignIn />;
29 |   }
30 |
31 |   const cookieStore = cookies();
32 |   const preferred = cookieStore.get(Cookies.PreferredSignInProvider);
33 |   const showTrackingConsent =
34 |     isEU() && !cookieStore.has(Cookies.TrackingConsent);
35 |   const { device } = userAgent({ headers: headers() });
36 |
37 |   let moreSignInOptions = null;
38 |   let preferredSignInOption =
39 |     device?.vendor === "Apple" ? (
40 |       <div className="flex flex-col space-y-2">
41 |         <GoogleSignIn />
42 |         <AppleSignIn />
43 |       </div>
44 |     ) : (
45 |       <GoogleSignIn />
46 |     );
47 |
48 |   switch (preferred?.value) {
49 |     case "apple":
50 |       preferredSignInOption = <AppleSignIn />;
51 |       moreSignInOptions = (
52 |         <>
53 |           <GoogleSignIn />
54 |           <SlackSignIn />
55 |           <GithubSignIn />
56 |           <OTPSignIn className="border-t-[1px] border-border pt-8" />
57 |         </>
58 |       );
59 |       break;
60 |
61 |     case "slack":
62 |       preferredSignInOption = <SlackSignIn />;
63 |       moreSignInOptions = (
64 |         <>
65 |           <GoogleSignIn />
66 |           <AppleSignIn />
67 |           <GithubSignIn />
68 |           <OTPSignIn className="border-t-[1px] border-border pt-8" />
69 |         </>
70 |       );
71 |       break;
72 |
73 |     case "github":
74 |       preferredSignInOption = <GithubSignIn />;
75 |       moreSignInOptions = (
76 |         <>
77 |           <GoogleSignIn />
78 |           <AppleSignIn />
79 |           <SlackSignIn />
80 |           <OTPSignIn className="border-t-[1px] border-border pt-8" />
81 |         </>
82 |       );
83 |       break;
84 |
85 |     case "google":
86 |       preferredSignInOption = <GoogleSignIn />;
87 |       moreSignInOptions = (
88 |         <>
89 |           <AppleSignIn />
90 |           <GithubSignIn />
91 |           <SlackSignIn />
92 |           <OTPSignIn className="border-t-[1px] border-border pt-8" />
93 |         </>
94 |       );
95 |       break;
96 |
97 |     case "otp":
98 |       preferredSignInOption = <OTPSignIn />;
99 |       moreSignInOptions = (
100 |         <>
101 |           <GoogleSignIn />
102 |           <AppleSignIn />
103 |           <GithubSignIn />
104 |           <SlackSignIn />
105 |         </>
106 |       );
107 |       break;
108 |
109 |     default:
110 |       if (device?.vendor === "Apple") {
111 |         moreSignInOptions = (
112 |           <>
113 |             <SlackSignIn />
114 |             <GithubSignIn />
115 |             <OTPSignIn className="border-t-[1px] border-border pt-8" />
116 |           </>
117 |         );
118 |       } else {
119 |         moreSignInOptions = (
120 |           <>
121 |             <AppleSignIn />
122 |             <SlackSignIn />
123 |             <GithubSignIn />
124 |             <OTPSignIn className="border-t-[1px] border-border pt-8" />
125 |           </>
126 |         );
127 |       }
128 |   }
129 |
130 |   return (
131 |     <div>
132 |       <header className="w-full fixed left-0 right-0">
133 |         <div className="ml-5 mt-4 md:ml-10 md:mt-10">
134 |           <Link href="https://midday.ai">
135 |             <Icons.Logo />
136 |           </Link>
137 |         </div>
138 |       </header>
139 |
140 |       <div className="flex min-h-screen justify-center items-center overflow-hidden p-6 md:p-0">
141 |         <div className="relative z-20 m-auto flex w-full max-w-[380px] flex-col py-8">
142 |           <div className="flex w-full flex-col relative">
143 |             <div className="pb-4 bg-gradient-to-r from-primary dark:via-primary dark:to-[#848484] to-[#000] inline-block text-transparent bg-clip-text">
144 |               <h1 className="font-medium pb-1 text-3xl">Login to midday.</h1>
145 |             </div>
146 |
147 |             <p className="font-medium pb-1 text-2xl text-[#878787]">
148 |               Automate financial tasks, <br /> stay organized, and make
149 |               <br />
150 |               informed decisions
151 |               <br /> effortlessly.
152 |             </p>
153 |
[TRUNCATED]
```

apps/dashboard/src/app/[locale]/(public)/verify/page.tsx
```
1 | import { DesktopSignInVerifyCode } from "@/components/desktop-sign-in-verify-code";
2 |
3 | export default async function Verify({ searchParams }) {
4 |   return <DesktopSignInVerifyCode code={searchParams?.code} />;
5 | }
```

apps/dashboard/src/app/api/auth/callback/route.ts
```
1 | import { Cookies } from "@/utils/constants";
2 | import { LogEvents } from "@midday/events/events";
3 | import { setupAnalytics } from "@midday/events/server";
4 | import { getSession } from "@midday/supabase/cached-queries";
5 | import { createClient } from "@midday/supabase/server";
6 | import { addYears } from "date-fns";
7 | import { cookies } from "next/headers";
8 | import { NextResponse } from "next/server";
9 | import type { NextRequest } from "next/server";
10 |
11 | export const preferredRegion = ["fra1", "sfo1", "iad1"];
12 |
13 | export async function GET(req: NextRequest) {
14 |   const cookieStore = cookies();
15 |   const requestUrl = new URL(req.url);
16 |   const code = requestUrl.searchParams.get("code");
17 |   const client = requestUrl.searchParams.get("client");
18 |   const returnTo = requestUrl.searchParams.get("return_to");
19 |   const provider = requestUrl.searchParams.get("provider");
20 |   const mfaSetupVisited = cookieStore.has(Cookies.MfaSetupVisited);
21 |
22 |   if (client === "desktop") {
23 |     return NextResponse.redirect(`${requestUrl.origin}/verify?code=${code}`);
24 |   }
25 |
26 |   if (provider) {
27 |     cookieStore.set(Cookies.PreferredSignInProvider, provider, {
28 |       expires: addYears(new Date(), 1),
29 |     });
30 |   }
31 |
32 |   if (code) {
33 |     const supabase = createClient(cookieStore);
34 |     await supabase.auth.exchangeCodeForSession(code);
35 |
36 |     const {
37 |       data: { session },
38 |     } = await getSession();
39 |
40 |     if (session) {
41 |       const userId = session.user.id;
42 |
43 |       const analytics = await setupAnalytics({
44 |         userId,
45 |         fullName: session.user.user_metadata?.full_name,
46 |       });
47 |
48 |       await analytics.track({
49 |         event: LogEvents.SignIn.name,
50 |         channel: LogEvents.SignIn.channel,
51 |       });
52 |
53 |       // If user have no teams, redirect to team creation
54 |       const { count } = await supabase
55 |         .from("users_on_team")
56 |         .select("*", { count: "exact" })
57 |         .eq("user_id", userId);
58 |
59 |       if (count === 0 && !returnTo?.startsWith("teams/invite/")) {
60 |         return NextResponse.redirect(`${requestUrl.origin}/teams/create`);
61 |       }
62 |     }
63 |   }
64 |
65 |   if (!mfaSetupVisited) {
66 |     cookieStore.set(Cookies.MfaSetupVisited, "true", {
67 |       expires: addYears(new Date(), 1),
68 |     });
69 |
70 |     return NextResponse.redirect(`${requestUrl.origin}/mfa/setup`);
71 |   }
72 |
73 |   if (returnTo) {
74 |     return NextResponse.redirect(`${requestUrl.origin}/${returnTo}`);
75 |   }
76 |
77 |   return NextResponse.redirect(requestUrl.origin);
78 | }
```

apps/dashboard/src/app/api/download/file/route.ts
```
1 | import { getUser } from "@midday/supabase/cached-queries";
2 | import { createClient } from "@midday/supabase/server";
3 | import { download } from "@midday/supabase/storage";
4 |
5 | export const preferredRegion = ["fra1", "sfo1", "iad1"];
6 |
7 | export async function GET(req, res) {
8 |   const supabase = createClient();
9 |   const user = await getUser();
10 |   const requestUrl = new URL(req.url);
11 |   const path = requestUrl.searchParams.get("path");
12 |   const filename = requestUrl.searchParams.get("filename");
13 |
14 |   const { data } = await download(supabase, {
15 |     bucket: "vault",
16 |     path: `${user.data.team_id}/${path}`,
17 |   });
18 |
19 |   const responseHeaders = new Headers(res.headers);
20 |
21 |   responseHeaders.set(
22 |     "Content-Disposition",
23 |     `attachment; filename="${filename}"`,
24 |   );
25 |
26 |   return new Response(data, {
27 |     headers: responseHeaders,
28 |   });
29 | }
```

apps/dashboard/src/app/api/download/invoice/route.ts
```
1 | import { PdfTemplate, renderToStream } from "@midday/invoice";
2 | import { getInvoiceQuery } from "@midday/supabase/queries";
3 | import { createClient } from "@midday/supabase/server";
4 | import type { NextRequest } from "next/server";
5 | import { z } from "zod";
6 |
7 | export const preferredRegion = ["fra1", "sfo1", "iad1"];
8 | export const dynamic = "force-dynamic";
9 |
10 | const paramsSchema = z.object({
11 |   id: z.string().uuid(),
12 |   size: z.enum(["letter", "a4"]).default("a4"),
13 |   preview: z.preprocess((val) => val === "true", z.boolean().default(false)),
14 | });
15 |
16 | export async function GET(req: NextRequest) {
17 |   const supabase = createClient({ admin: true });
18 |   const requestUrl = new URL(req.url);
19 |
20 |   const result = paramsSchema.safeParse(
21 |     Object.fromEntries(requestUrl.searchParams.entries()),
22 |   );
23 |
24 |   if (!result.success) {
25 |     return new Response("Invalid parameters", { status: 400 });
26 |   }
27 |
28 |   const { id, size, preview } = result.data;
29 |
30 |   const { data } = await getInvoiceQuery(supabase, id);
31 |
32 |   if (!data) {
33 |     return new Response("Invoice not found", { status: 404 });
34 |   }
35 |
36 |   const stream = await renderToStream(await PdfTemplate({ ...data, size }));
37 |
38 |   const blob = await new Response(stream).blob();
39 |
40 |   const headers: Record<string, string> = {
41 |     "Content-Type": "application/pdf",
42 |     "Cache-Control": "no-store, max-age=0",
43 |   };
44 |
45 |   if (!preview) {
46 |     headers["Content-Disposition"] =
47 |       `attachment; filename="${data.invoice_number}.pdf"`;
48 |   }
49 |
50 |   return new Response(blob, { headers });
51 | }
```

apps/dashboard/src/app/api/download/zip/route.ts
```
1 | import { getUser } from "@midday/supabase/cached-queries";
2 | import { getVaultRecursiveQuery } from "@midday/supabase/queries";
3 | import { createClient } from "@midday/supabase/server";
4 | import { download } from "@midday/supabase/storage";
5 | import { BlobReader, BlobWriter, ZipWriter } from "@zip.js/zip.js";
6 | import type { NextRequest, NextResponse } from "next/server";
7 |
8 | export const preferredRegion = ["fra1", "sfo1", "iad1"];
9 | export const dynamic = "force-dynamic";
10 |
11 | export async function GET(req: NextRequest, res: NextResponse) {
12 |   const requestUrl = new URL(req.url);
13 |   const supabase = createClient();
14 |   const user = await getUser();
15 |   const path = requestUrl.searchParams.get("path");
16 |   const filename = requestUrl.searchParams.get("filename");
17 |
18 |   const promises: any = [];
19 |
20 |   const files = await getVaultRecursiveQuery(supabase, {
21 |     teamId: user.data.team_id,
22 |     path,
23 |   });
24 |
25 |   files.forEach((file) => {
26 |     promises.push(
27 |       download(supabase, {
28 |         bucket: "vault",
29 |         path: `${file.basePath}/${file.name}`,
30 |       }),
31 |     );
32 |   });
33 |
34 |   const response = await Promise.allSettled(promises);
35 |
36 |   const zipFileWriter = new BlobWriter("application/zip");
37 |   const zipWriter = new ZipWriter(zipFileWriter, { bufferedWrite: true });
38 |
39 |   const downloadedFiles = response.map((result, index) => {
40 |     if (result.status === "fulfilled") {
41 |       return {
42 |         name: files[index].name,
43 |         blob: result.value.data,
44 |       };
45 |     }
46 |   });
47 |
48 |   downloadedFiles.forEach((downloadedFile) => {
49 |     if (downloadedFile?.blob) {
50 |       zipWriter.add(downloadedFile.name, new BlobReader(downloadedFile.blob));
51 |     }
52 |   });
53 |
54 |   const responseHeaders = new Headers(res.headers);
55 |
56 |   responseHeaders.set(
57 |     "Content-Disposition",
58 |     `attachment; filename="${filename}.zip"`,
59 |   );
60 |
61 |   const data = await zipWriter.close();
62 |
63 |   return new Response(data, {
64 |     headers: responseHeaders,
65 |   });
66 | }
```

apps/dashboard/src/app/api/gocardless/reconnect/route.ts
```
1 | import { getSession } from "@midday/supabase/cached-queries";
2 | import { updateBankConnection } from "@midday/supabase/mutations";
3 | import { createClient } from "@midday/supabase/server";
4 | import { revalidateTag } from "next/cache";
5 | import { type NextRequest, NextResponse } from "next/server";
6 |
7 | export const dynamic = "force-dynamic";
8 | export const preferredRegion = ["fra1", "sfo1", "iad1"];
9 |
10 | export async function GET(req: NextRequest) {
11 |   const {
12 |     data: { session },
13 |   } = await getSession();
14 |
15 |   if (!session) {
16 |     return NextResponse.redirect(new URL("/", req.url));
17 |   }
18 |
19 |   const supabase = createClient();
20 |   const requestUrl = new URL(req.url);
21 |   const id = requestUrl.searchParams.get("id");
22 |   const referenceId = requestUrl.searchParams.get("reference_id") ?? undefined;
23 |   const isDesktop = requestUrl.searchParams.get("desktop");
24 |
25 |   if (id) {
26 |     const { data } = await updateBankConnection(supabase, { id, referenceId });
27 |     revalidateTag(`bank_connections_${data?.team_id}`);
28 |   }
29 |
30 |   if (isDesktop === "true") {
31 |     return NextResponse.redirect(
32 |       `midday://settings/accounts?id=${id}&step=reconnect`,
33 |     );
34 |   }
35 |
36 |   return NextResponse.redirect(
37 |     `${requestUrl.origin}/settings/accounts?id=${id}&step=reconnect`,
38 |   );
39 | }
```

apps/dashboard/src/app/api/webhook/inbox/route.ts
```
1 | import { env } from "@/env.mjs";
2 | import { logger } from "@/utils/logger";
3 | import { getAllowedAttachments, prepareDocument } from "@midday/documents";
4 | import { LogEvents } from "@midday/events/events";
5 | import { setupAnalytics } from "@midday/events/server";
6 | import { getInboxIdFromEmail, inboxWebhookPostSchema } from "@midday/inbox";
7 | import { client as RedisClient } from "@midday/kv";
8 | import { createClient } from "@midday/supabase/server";
9 | import { inboxDocument } from "jobs/tasks/inbox/document";
10 | import { nanoid } from "nanoid";
11 | import { headers } from "next/headers";
12 | import { NextResponse } from "next/server";
13 | import { Resend } from "resend";
14 |
15 | export const runtime = "nodejs";
16 | export const maxDuration = 300; // 5min
17 |
18 | // https://postmarkapp.com/support/article/800-ips-for-firewalls#webhooks
19 | const ipRange = [
20 |   "3.134.147.250",
21 |   "50.31.156.6",
22 |   "50.31.156.77",
23 |   "18.217.206.57",
24 | ];
25 |
26 | const FORWARD_FROM_EMAIL = "inbox@midday.ai";
27 |
28 | const resend = new Resend(env.RESEND_API_KEY);
29 |
30 | export async function POST(req: Request) {
31 |   const clientIp = headers().get("x-forwarded-for") ?? "";
32 |
33 |   if (
34 |     process.env.NODE_ENV !== "development" &&
35 |     (!clientIp || !ipRange.includes(clientIp))
36 |   ) {
37 |     return NextResponse.json({ error: "Invalid IP address" }, { status: 403 });
38 |   }
39 |
40 |   const parsedBody = inboxWebhookPostSchema.safeParse(await req.json());
41 |
42 |   if (!parsedBody.success) {
43 |     const errors = parsedBody.error.errors.map((error) => ({
44 |       path: error.path.join("."),
45 |       message: error.message,
46 |     }));
47 |
48 |     return NextResponse.json(
49 |       { error: "Invalid request body", errors },
50 |       { status: 400 },
51 |     );
52 |   }
53 |
54 |   const {
55 |     MessageID,
56 |     FromFull,
57 |     Subject,
58 |     Attachments,
59 |     TextBody,
60 |     HtmlBody,
61 |     OriginalRecipient,
62 |   } = parsedBody.data;
63 |
64 |   const inboxId = getInboxIdFromEmail(OriginalRecipient);
65 |
66 |   if (!inboxId) {
67 |     return NextResponse.json(
68 |       { error: "Invalid OriginalRecipient email" },
69 |       { status: 400 },
70 |     );
71 |   }
72 |
73 |   // Ignore emails from our own domain to fix infinite loop
74 |   if (FromFull.Email === FORWARD_FROM_EMAIL) {
75 |     return NextResponse.json({ success: true });
76 |   }
77 |
78 |   const supabase = createClient({ admin: true });
79 |
80 |   try {
81 |     const { data: teamData } = await supabase
82 |       .from("teams")
83 |       .select("id, inbox_email, inbox_forwarding")
84 |       .eq("inbox_id", inboxId)
85 |       .single()
86 |       .throwOnError();
87 |
88 |     const analytics = await setupAnalytics();
89 |
90 |     analytics.track({
91 |       event: LogEvents.InboxInbound.name,
92 |       channel: LogEvents.InboxInbound.channel,
93 |     });
94 |
95 |     const teamId = teamData?.id;
96 |
97 |     const fallbackName = Subject ?? FromFull?.Name;
98 |     const forwardEmail = teamData?.inbox_email;
99 |     const forwardingEnabled = teamData?.inbox_forwarding && forwardEmail;
100 |
101 |     if (forwardingEnabled) {
102 |       const messageKey = `message-id:${MessageID}`;
103 |       const isForwarded = await RedisClient.exists(messageKey);
104 |
105 |       if (!isForwarded) {
106 |         const { error } = await resend.emails.send({
107 |           from: `${FromFull?.Name} <${FORWARD_FROM_EMAIL}>`,
108 |           to: [forwardEmail],
109 |           subject: fallbackName,
110 |           text: TextBody,
111 |           html: HtmlBody,
112 |           attachments: Attachments?.map((a) => ({
113 |             filename: a.Name,
114 |             content: a.Content,
115 |           })),
116 |           react: null,
117 |           headers: {
118 |             "X-Entity-Ref-ID": nanoid(),
119 |           },
120 |         });
121 |
122 |         if (!error) {
123 |           await RedisClient.set(messageKey, true, { ex: 9600 });
124 |         }
125 |       }
126 |     }
127 |
128 |     const allowedAttachments = getAllowedAttachments(Attachments);
129 |
130 |     // If no attachments we just want to forward the email
131 |     if (!allowedAttachments?.length && forwardEmail) {
132 |       const messageKey = `message-id:${MessageID}`;
133 |       const isForwarded = await RedisClient.exists(messageKey);
134 |
135 |       if (!isForwarded) {
136 |         const { error } = await resend.emails.send({
137 |           from: `${FromFull?.Name} <${FORWARD_FROM_EMAIL}>`,
138 |           to: [forwardEmail],
139 |           subject: fallbackName,
140 |           text: TextBody,
141 |           html: HtmlBody,
142 |           attachments: Attachments?.map((a) => ({
143 |             filename: a.Name,
144 |             content: a.Content,
145 |           })),
146 |           react: null,
147 |           headers: {
148 |             "X-Entity-Ref-ID": nanoid(),
149 |           },
150 |         });
151 |
152 |         if (!error) {
153 |           await RedisClient.set(messageKey, true, { ex: 9600 });
154 |         }
155 |       }
156 |
157 |       return NextResponse.json({
158 |         success: true,
159 |       });
160 |     }
161 |
162 |     // Transform and upload files, filtering out attachments smaller than 100kb except PDFs
[TRUNCATED]
```

apps/dashboard/src/app/api/webhook/plaid/route.ts
```
1 | import { logger } from "@/utils/logger";
2 | import { createClient } from "@midday/supabase/server";
3 | import { isAfter, subDays } from "date-fns";
4 | import { syncConnection } from "jobs/tasks/bank/sync/connection";
5 | import { type NextRequest, NextResponse } from "next/server";
6 | import { z } from "zod";
7 |
8 | // https://plaid.com/docs/api/webhooks/#configuring-webhooks
9 | const ALLOWED_IPS = [
10 |   "52.21.26.131",
11 |   "52.21.47.157",
12 |   "52.41.247.19",
13 |   "52.88.82.239",
14 | ];
15 |
16 | const webhookSchema = z.object({
17 |   webhook_type: z.enum([
18 |     "TRANSACTIONS",
19 |     "HISTORICAL_UPDATE",
20 |     "INITIAL_UPDATE",
21 |     "TRANSACTIONS_REMOVED",
22 |   ]),
23 |   webhook_code: z.enum(["SYNC_UPDATES_AVAILABLE", "HISTORICAL_UPDATE"]),
24 |   item_id: z.string(),
25 |   error: z
26 |     .object({
27 |       error_type: z.string(),
28 |       error_code: z.string(),
29 |       error_code_reason: z.string(),
30 |       error_message: z.string(),
31 |       display_message: z.string(),
32 |       request_id: z.string(),
33 |       causes: z.array(z.string()),
34 |       status: z.number(),
35 |     })
36 |     .nullable(),
37 |   new_transactions: z.number().optional(),
38 |   environment: z.enum(["sandbox", "production"]),
39 | });
40 |
41 | export async function POST(req: NextRequest) {
42 |   const clientIp = req.headers.get("x-forwarded-for") || "";
43 |
44 |   if (!ALLOWED_IPS.includes(clientIp)) {
45 |     return NextResponse.json(
46 |       { error: "Unauthorized IP address" },
47 |       { status: 403 },
48 |     );
49 |   }
50 |
51 |   const body = await req.json();
52 |
53 |   const result = webhookSchema.safeParse(body);
54 |
55 |   if (!result.success) {
56 |     logger("Invalid plaid webhook payload", {
57 |       details: result.error.issues,
58 |     });
59 |
60 |     return NextResponse.json(
61 |       { error: "Invalid webhook payload", details: result.error.issues },
62 |       { status: 400 },
63 |     );
64 |   }
65 |
66 |   const supabase = createClient({ admin: true });
67 |
68 |   const { data: connectionData } = await supabase
69 |     .from("bank_connections")
70 |     .select("id, created_at")
71 |     .eq("reference_id", result.data.item_id)
72 |     .single();
73 |
74 |   if (!connectionData) {
75 |     return NextResponse.json(
76 |       { error: "Connection not found" },
77 |       { status: 404 },
78 |     );
79 |   }
80 |
81 |   switch (result.data.webhook_type) {
82 |     case "TRANSACTIONS": {
83 |       // Only run manual sync if the historical update is complete and the connection was created in the last 24 hours
84 |       const manualSync =
85 |         result.data.webhook_code === "HISTORICAL_UPDATE" &&
86 |         isAfter(new Date(connectionData.created_at), subDays(new Date(), 1));
87 |
88 |       logger("Triggering manual sync", {
89 |         connectionId: connectionData.id,
90 |         manualSync,
91 |       });
92 |
93 |       await syncConnection.trigger({
94 |         connectionId: connectionData.id,
95 |         manualSync,
96 |       });
97 |
98 |       break;
99 |     }
100 |   }
101 |
102 |   return NextResponse.json({ success: true });
103 | }
```

apps/dashboard/src/app/api/webhook/registered/route.ts
```
1 | import * as crypto from "node:crypto";
2 | import { env } from "@/env.mjs";
3 | import { logger } from "@/utils/logger";
4 | import { resend } from "@/utils/resend";
5 | import WelcomeEmail from "@midday/email/emails/welcome";
6 | import { LogEvents } from "@midday/events/events";
7 | import { setupAnalytics } from "@midday/events/server";
8 | import { render } from "@react-email/render";
9 | import { nanoid } from "nanoid";
10 | import { headers } from "next/headers";
11 | import { NextResponse } from "next/server";
12 |
13 | export const dynamic = "force-dynamic";
14 |
15 | // NOTE: This is trigger from supabase database webhook
16 | export async function POST(req: Request) {
17 |   const text = await req.clone().text();
18 |   const signature = headers().get("x-supabase-signature");
19 |
20 |   if (!signature) {
21 |     return NextResponse.json({ message: "Missing signature" }, { status: 401 });
22 |   }
23 |
24 |   const decodedSignature = Buffer.from(signature, "base64");
25 |
26 |   const calculatedSignature = crypto
27 |     .createHmac("sha256", process.env.WEBHOOK_SECRET_KEY!)
28 |     .update(text)
29 |     .digest();
30 |
31 |   const hmacMatch = crypto.timingSafeEqual(
32 |     decodedSignature,
33 |     calculatedSignature,
34 |   );
35 |
36 |   if (!hmacMatch) {
37 |     return NextResponse.json({ message: "Not Authorized" }, { status: 401 });
38 |   }
39 |
40 |   const body = await req.json();
41 |
42 |   const email = body.record.email;
43 |   const userId = body.record.id;
44 |   const fullName = body.record.raw_user_meta_data.full_name;
45 |
46 |   const analytics = await setupAnalytics({
47 |     userId,
48 |     fullName,
49 |   });
50 |
51 |   analytics.track({
52 |     event: LogEvents.Registered.name,
53 |     channel: LogEvents.Registered.channel,
54 |   });
55 |
56 |   if (fullName) {
57 |     await resend.emails.send({
58 |       to: email,
59 |       subject: "Welcome to Midday",
60 |       from: "Pontus from Midday <pontus@midday.ai>",
61 |       html: await render(
62 |         WelcomeEmail({
63 |           fullName,
64 |         }),
65 |       ),
66 |       headers: {
67 |         "X-Entity-Ref-ID": nanoid(),
68 |       },
69 |     });
70 |   }
71 |
72 |   try {
73 |     const [firstName, lastName] = fullName?.split(" ") ?? [];
74 |
75 |     await resend.contacts.create({
76 |       email,
77 |       firstName,
78 |       lastName,
79 |       unsubscribed: false,
80 |       audienceId: env.RESEND_AUDIENCE_ID,
81 |     });
82 |   } catch (error) {
83 |     logger(error as string);
84 |   }
85 |
86 |   return NextResponse.json({ success: true });
87 | }
```

apps/dashboard/src/app/api/webhook/teller/route.ts
```
1 | import { validateTellerSignature } from "@/utils/teller";
2 | import { createClient } from "@midday/supabase/server";
3 | import { isAfter, subDays } from "date-fns";
4 | import { syncConnection } from "jobs/tasks/bank/sync/connection";
5 | import { type NextRequest, NextResponse } from "next/server";
6 | import { z } from "zod";
7 |
8 | const webhookSchema = z.object({
9 |   id: z.string(),
10 |   payload: z.object({
11 |     enrollment_id: z.string().optional(),
12 |     reason: z.string().optional(),
13 |   }),
14 |   timestamp: z.string(),
15 |   type: z.enum([
16 |     "enrollment.disconnected",
17 |     "transactions.processed",
18 |     "account.number_verification.processed",
19 |     "webhook.test",
20 |   ]),
21 | });
22 |
23 | export async function POST(req: NextRequest) {
24 |   const text = await req.clone().text();
25 |   const body = await req.json();
26 |
27 |   const signatureValid = validateTellerSignature({
28 |     signatureHeader: req.headers.get("teller-signature"),
29 |     text,
30 |   });
31 |
32 |   if (!signatureValid) {
33 |     return NextResponse.json(
34 |       { error: "Invalid webhook signature" },
35 |       { status: 401 },
36 |     );
37 |   }
38 |
39 |   // Parse and validate webhook body
40 |   const result = webhookSchema.safeParse(body);
41 |
42 |   if (!result.success) {
43 |     return NextResponse.json(
44 |       { error: "Invalid webhook payload", details: result.error.issues },
45 |       { status: 400 },
46 |     );
47 |   }
48 |
49 |   const { type, payload } = result.data;
50 |
51 |   if (type === "webhook.test") {
52 |     return NextResponse.json({ success: true });
53 |   }
54 |
55 |   if (!payload.enrollment_id) {
56 |     return NextResponse.json(
57 |       { error: "Missing enrollment_id" },
58 |       { status: 400 },
59 |     );
60 |   }
61 |
62 |   const supabase = createClient({ admin: true });
63 |
64 |   const { data: connectionData } = await supabase
65 |     .from("bank_connections")
66 |     .select("id, created_at")
67 |     .eq("enrollment_id", payload.enrollment_id)
68 |     .single();
69 |
70 |   if (!connectionData) {
71 |     return NextResponse.json(
72 |       { error: "Connection not found" },
73 |       { status: 404 },
74 |     );
75 |   }
76 |
77 |   switch (type) {
78 |     case "transactions.processed":
79 |       {
80 |         // Only run manual sync if the connection was created in the last 24 hours
81 |         const manualSync = isAfter(
82 |           new Date(connectionData.created_at),
83 |           subDays(new Date(), 1),
84 |         );
85 |
86 |         await syncConnection.trigger({
87 |           connectionId: connectionData.id,
88 |           manualSync,
89 |         });
90 |       }
91 |       break;
92 |   }
93 |
94 |   return NextResponse.json({ success: true });
95 | }
```

packages/app-store/src/slack/lib/events/file/index.ts
```
1 | export * from "./share";
```

packages/app-store/src/slack/lib/events/file/share.ts
```
1 | import { inboxSlackUpload } from "@midday/dashboard/jobs/tasks/inbox/slack-upload";
2 | import type { FileShareMessageEvent } from "@slack/web-api";
3 |
4 | export async function fileShare(
5 |   event: FileShareMessageEvent,
6 |   { teamId, token }: { teamId: string; token: string },
7 | ) {
8 |   const files = event?.files?.map((file) => ({
9 |     id: file.id,
10 |     name: file.name,
11 |     mimetype: file.mimetype,
12 |     size: file.size,
13 |     url: file.url_private_download,
14 |   }));
15 |
16 |   if (files && files.length > 0) {
17 |     await inboxSlackUpload.batchTrigger(
18 |       files.map((file) => ({
19 |         payload: {
20 |           teamId,
21 |           token,
22 |           channelId: event.channel,
23 |           threadId: event.thread_ts,
24 |           file: {
25 |             id: file.id,
26 |             name: file.name!,
27 |             mimetype: file.mimetype,
28 |             size: file.size,
29 |             url: file.url!,
30 |           },
31 |         },
32 |       })),
33 |     );
34 |   }
35 | }
```

packages/app-store/src/slack/lib/events/thread/index.ts
```
1 | export * from "./message";
2 | export * from "./started";
```

packages/app-store/src/slack/lib/events/thread/message.ts
```
1 | import { openai } from "@ai-sdk/openai";
2 | import { createClient } from "@midday/supabase/server";
3 | import type { AssistantThreadStartedEvent, WebClient } from "@slack/web-api";
4 | import { generateText } from "ai";
5 | import { startOfMonth, subMonths } from "date-fns";
6 | import {
7 |   getBurnRateTool,
8 |   getRunwayTool,
9 |   getSpendingTool,
10 |   systemPrompt,
11 | } from "../../tools";
12 | import { getProfitTool } from "../../tools/get-profit";
13 | import { getRevenueTool } from "../../tools/get-revenue";
14 |
15 | const defaultValues = {
16 |   from: subMonths(startOfMonth(new Date()), 12).toISOString(),
17 |   to: new Date().toISOString(),
18 | };
19 |
20 | export async function assistantThreadMessage(
21 |   event: AssistantThreadStartedEvent,
22 |   client: WebClient,
23 |   { teamId }: { teamId: string },
24 | ) {
25 |   const supabase = createClient({ admin: true });
26 |
27 |   // Update the status of the thread
28 |   await client.assistant.threads.setStatus({
29 |     channel_id: event.channel,
30 |     thread_ts: event.thread_ts,
31 |     status: "Is thinking...",
32 |   });
33 |
34 |   const threadHistory = await client.conversations.replies({
35 |     channel: event.channel,
36 |     ts: event.thread_ts,
37 |     limit: 5,
38 |     inclusive: true,
39 |   });
40 |
41 |   const lastTwoMessages = threadHistory.messages
42 |     ?.map((msg) => ({
43 |       role: msg.bot_id ? "assistant" : "user",
44 |       content: msg.text || "",
45 |     }))
46 |     .reverse();
47 |
48 |   if (!lastTwoMessages || lastTwoMessages.length === 0) {
49 |     console.warn("No messages found in the thread");
50 |   }
51 |
52 |   const { text } = await generateText({
53 |     model: openai("gpt-4o-mini"),
54 |     maxToolRoundtrips: 5,
55 |     system: systemPrompt,
56 |     messages: [
57 |       ...(lastTwoMessages ?? []),
58 |       {
59 |         role: "user",
60 |         content: event.text,
61 |       },
62 |     ],
63 |     tools: {
64 |       getRunway: getRunwayTool({
65 |         defaultValues,
66 |         supabase,
67 |         teamId,
68 |       }),
69 |       getBurnRate: getBurnRateTool({
70 |         defaultValues,
71 |         supabase,
72 |         teamId,
73 |       }),
74 |       getSpending: getSpendingTool({
75 |         defaultValues,
76 |         supabase,
77 |         teamId,
78 |       }),
79 |       getProfit: getProfitTool({
80 |         defaultValues,
81 |         supabase,
82 |         teamId,
83 |       }),
84 |       getRevenue: getRevenueTool({
85 |         defaultValues,
86 |         supabase,
87 |         teamId,
88 |       }),
89 |     },
90 |   });
91 |
92 |   if (text) {
93 |     // Send the message to the thread
94 |     await client.chat.postMessage({
95 |       channel: event.channel,
96 |       thread_ts: event.thread_ts,
97 |       blocks: [
98 |         {
99 |           type: "section",
100 |           text: {
101 |             type: "mrkdwn",
102 |             text: text,
103 |           },
104 |         },
105 |       ],
106 |     });
107 |   } else {
108 |     // If no previous message found, post the new message
109 |     await client.chat.postMessage({
110 |       channel: event.channel,
111 |       thread_ts: event.thread_ts,
112 |       text: "Sorry I couldn't find an answer to that question",
113 |     });
114 |
115 |     await client.assistant.threads.setStatus({
116 |       channel_id: event.channel,
117 |       thread_ts: event.thread_ts,
118 |       status: "",
119 |     });
120 |   }
121 | }
```

packages/app-store/src/slack/lib/events/thread/started.ts
```
1 | import type { AssistantThreadStartedEvent, WebClient } from "@slack/web-api";
2 |
3 | export async function assistantThreadStarted(
4 |   event: AssistantThreadStartedEvent,
5 |   client: WebClient,
6 | ) {
7 |   const prompts = [
8 |     {
9 |       title: "What's my profit?",
10 |       message: "What's my profit?",
11 |     },
12 |     {
13 |       title: "What did I spend on software last month?",
14 |       message: "How much did I spend on software last month?",
15 |     },
16 |     {
17 |       title: "What's my burn rate?",
18 |       message: "What's my burn rate?",
19 |     },
20 |     {
21 |       title: "What's my runway?",
22 |       message: "What's my runway?",
23 |     },
24 |     {
25 |       title: "What's my revenue?",
26 |       message: "What's my revenue?",
27 |     },
28 |   ];
29 |
30 |   try {
31 |     // Post welcome message
32 |     await client.chat.postMessage({
33 |       channel: event.assistant_thread.channel_id,
34 |       thread_ts: event.assistant_thread.thread_ts,
35 |       text: "Welcome! I'm your financial assistant. Here are some suggestions on what you can do:",
36 |     });
37 |
38 |     // Set suggested prompts
39 |     await client.assistant.threads.setSuggestedPrompts({
40 |       channel_id: event.assistant_thread.channel_id,
41 |       thread_ts: event.assistant_thread.thread_ts,
42 |       prompts: prompts.sort(() => 0.5 - Math.random()).slice(0, 4),
43 |     });
44 |   } catch (error) {
45 |     console.error("Error handling assistant thread start:", error);
46 |     // Set an error status if something goes wrong
47 |     await client.assistant.threads.setStatus({
48 |       channel_id: event.assistant_thread.channel_id,
49 |       thread_ts: event.assistant_thread.thread_ts,
50 |       status: "Something went wrong",
51 |     });
52 |   }
53 | }
```

packages/ui/src/components/editor/extentions/ai/ask-ai.tsx
```
1 | "use client";
2 |
3 | import { MdOutlineAutoAwesome } from "react-icons/md";
4 | import { BubbleMenuButton } from "../bubble-menu/bubble-menu-button";
5 |
6 | type Props = {
7 |   onSelect: () => void;
8 | };
9 |
10 | export function AskAI({ onSelect }: Props) {
11 |   return (
12 |     <BubbleMenuButton
13 |       action={onSelect}
14 |       isActive={false}
15 |       className="flex space-x-2 items-center"
16 |     >
17 |       <MdOutlineAutoAwesome className="size-4" />
18 |     </BubbleMenuButton>
19 |   );
20 | }
```

packages/ui/src/components/editor/extentions/ai/example-action.ts
```
1 | "use server";
2 |
3 | import { openai } from "@ai-sdk/openai";
4 | import { streamText } from "ai";
5 | import { createStreamableValue } from "ai/rsc";
6 |
7 | type Params = {
8 |   input: string;
9 |   context?: string;
10 | };
11 |
12 | export async function generateEditorContent({ input, context }: Params) {
13 |   const stream = createStreamableValue("");
14 |
15 |   (async () => {
16 |     const { textStream } = await streamText({
17 |       model: openai("gpt-4o-mini"),
18 |       prompt: input,
19 |       temperature: 0.8,
20 |       system: `
21 |         You are an expert AI assistant specializing in content generation and improvement. Your task is to enhance or modify text based on specific instructions. Follow these guidelines:
22 |
23 |         1. Language: Always respond in the same language as the input prompt.
24 |         2. Conciseness: Keep responses brief and precise, with a maximum of 200 characters.
25 |
26 |         Format your response as plain text, using '\n' for line breaks when necessary.
27 |         Do not include any titles or headings in your response.
28 |         Begin your response directly with the relevant text or information.
29 |       ${context}
30 | `,
31 |     });
32 |
33 |     for await (const delta of textStream) {
34 |       stream.update(delta);
35 |     }
36 |
37 |     stream.done();
38 |   })();
39 |
40 |   return { output: stream.value };
41 | }
```

packages/ui/src/components/editor/extentions/ai/index.tsx
```
1 | "use client";
2 |
3 | import type { Editor } from "@tiptap/react";
4 | import { useClickAway } from "@uidotdev/usehooks";
5 | import { readStreamableValue } from "ai/rsc";
6 | import { motion } from "framer-motion";
7 | import { useState } from "react";
8 | import {
9 |   MdOutlineAutoAwesome,
10 |   MdOutlineCloseFullscreen,
11 |   MdOutlineSpellcheck,
12 |   MdOutlineWrapText,
13 | } from "react-icons/md";
14 | import { BubbleMenuButton } from "../bubble-menu/bubble-menu-button";
15 | import { generateEditorContent } from "./example-action";
16 |
17 | const selectors = [
18 |   {
19 |     name: "Grammar",
20 |     icon: MdOutlineSpellcheck,
21 |     instructions:
22 |       "Fix grammar: Rectify any grammatical errors while preserving the original meaning.",
23 |   },
24 |   {
25 |     name: "Improve",
26 |     icon: MdOutlineWrapText,
27 |     instructions:
28 |       "Improve text: Refine the text to improve clarity and professionalism.",
29 |   },
30 |   {
31 |     name: "Condense",
32 |     icon: MdOutlineCloseFullscreen,
33 |     instructions:
34 |       "Condense text: Remove any unnecessary text and only keep the invoice-related content and make it more concise.",
35 |   },
36 | ];
37 |
38 | interface AIMenuProps {
39 |   editor: Editor;
40 |   onOpenChange: (open: boolean) => void;
41 | }
42 |
43 | function formatEditorContent(content: string): string {
44 |   return content.replace(/\n/g, "<br />");
45 | }
46 |
47 | export function AIMenu({ onOpenChange, editor }: AIMenuProps) {
48 |   const [isTypingPrompt, setIsTypingPrompt] = useState(false);
49 |
50 |   const ref = useClickAway<HTMLDivElement>(() => {
51 |     onOpenChange(false);
52 |     setIsTypingPrompt(false);
53 |   });
54 |
55 |   const handleGenerate = async (instructions: string) => {
56 |     const selectedText = editor?.state.doc.textBetween(
57 |       editor?.state.selection?.from,
58 |       editor?.state.selection?.to,
59 |       "",
60 |     );
61 |
62 |     if (!selectedText) {
63 |       return;
64 |     }
65 |
66 |     try {
67 |       const { output } = await generateEditorContent({
68 |         input: selectedText,
69 |         context: instructions,
70 |       });
71 |
72 |       let generatedContent = "";
73 |       for await (const delta of readStreamableValue(output)) {
74 |         generatedContent += delta;
75 |         editor?.commands.insertContent(formatEditorContent(delta ?? ""));
76 |       }
77 |     } catch (error) {
78 |       console.error("Error generating content:", error);
79 |     } finally {
80 |       onOpenChange(false);
81 |     }
82 |   };
83 |
84 |   return (
85 |     <div ref={ref} className="flex whitespace-nowrap divide-x">
86 |       <motion.div
87 |         initial={{ opacity: 0, y: 10 }}
88 |         animate={{ opacity: 1, y: 0 }}
89 |         transition={{ duration: 0.2 }}
90 |       >
91 |         {isTypingPrompt ? (
92 |           <div className="relative">
93 |             <input
94 |               autoFocus
95 |               placeholder="Type your prompt…"
96 |               onBlur={() => setIsTypingPrompt(false)}
97 |               className="w-[280px] text-[11px] border-none px-4 h-8 bg-background focus:outline-none"
98 |               onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
99 |                 if (e.key === "Enter") {
100 |                   e.preventDefault();
101 |                   onOpenChange(false);
102 |                   handleGenerate(`Custom prompt: ${e.currentTarget.value}`);
103 |                 }
104 |               }}
105 |             />
106 |             <kbd className="pointer-events-none h-5 select-none items-center gap-1 px-1.5 font-mono text-[13px] font-medium absolute right-2 top-1/2 -translate-y-1/2">
107 |               <span>↵</span>
108 |             </kbd>
109 |           </div>
110 |         ) : (
111 |           <BubbleMenuButton
112 |             action={() => setIsTypingPrompt(true)}
113 |             isActive={false}
114 |           >
115 |             <div className="flex items-center space-x-1">
116 |               <MdOutlineAutoAwesome className="size-3" />
117 |               <span className="text-[11px] font-mono">Ask AI</span>
118 |             </div>
119 |           </BubbleMenuButton>
120 |         )}
121 |       </motion.div>
122 |
123 |       {!isTypingPrompt &&
124 |         selectors.map((selector, index) => (
125 |           <motion.div
126 |             key={selector.name}
127 |             initial={{ opacity: 0, y: 10 }}
128 |             animate={{ opacity: 1, y: 0 }}
129 |             transition={{ duration: 0.2, delay: (index + 1) * 0.05 }}
130 |           >
131 |             <BubbleMenuButton
132 |               action={() => handleGenerate(selector.instructions)}
133 |               isActive={false}
134 |             >
135 |               <div className="flex items-center space-x-1">
136 |                 <selector.icon className="size-3" />
137 |                 <span>{selector.name}</span>
138 |               </div>
139 |             </BubbleMenuButton>
140 |           </motion.div>
141 |         ))}
142 |     </div>
143 |   );
144 | }
```

packages/ui/src/components/editor/extentions/bubble-menu/bubble-item.tsx
```
1 | "use client";
2 |
3 | import type { Editor } from "@tiptap/react";
4 | import { BubbleMenuButton } from "./bubble-menu-button";
5 |
6 | interface BubbleItemProps {
7 |   editor: Editor;
8 |   action: () => void;
9 |   isActive: boolean;
10 |   children: React.ReactNode;
11 | }
12 |
13 | export function BubbleMenuItem({
14 |   editor,
15 |   action,
16 |   isActive,
17 |   children,
18 | }: BubbleItemProps) {
19 |   return (
20 |     <BubbleMenuButton
21 |       action={() => {
22 |         editor.chain().focus();
23 |         action();
24 |       }}
25 |       isActive={isActive}
26 |     >
27 |       {children}
28 |     </BubbleMenuButton>
29 |   );
30 | }
```

packages/ui/src/components/editor/extentions/bubble-menu/bubble-menu-button.tsx
```
1 | "use client";
2 |
3 | interface BubbleMenuButtonProps {
4 |   action: () => void;
5 |   isActive: boolean;
6 |   children: React.ReactNode;
7 |   className?: string;
8 | }
9 |
10 | export function BubbleMenuButton({
11 |   action,
12 |   isActive,
13 |   children,
14 |   className,
15 | }: BubbleMenuButtonProps) {
16 |   return (
17 |     <button
18 |       type="button"
19 |       onClick={action}
20 |       className={`px-2.5 py-1.5 text-[11px] font-mono transition-colors ${className} ${
21 |         isActive
22 |           ? "bg-white dark:bg-stone-900 text-primary"
23 |           : "bg-transparent hover:bg-muted"
24 |       }`}
25 |     >
26 |       {children}
27 |     </button>
28 |   );
29 | }
```

packages/ui/src/components/editor/extentions/bubble-menu/index.tsx
```
1 | import { type Editor, BubbleMenu as TiptapBubbleMenu } from "@tiptap/react";
2 | import { useState } from "react";
3 | import {
4 |   MdOutlineFormatBold,
5 |   MdOutlineFormatItalic,
6 |   MdOutlineFormatStrikethrough,
7 | } from "react-icons/md";
8 | import type { Props as TippyOptions } from "tippy.js";
9 | import { AIMenu } from "../ai";
10 | import { AskAI } from "../ai/ask-ai";
11 | import { BubbleMenuItem } from "./bubble-item";
12 | import { LinkItem } from "./link-item";
13 |
14 | export function BubbleMenu({
15 |   editor,
16 |   tippyOptions,
17 | }: {
18 |   editor: Editor;
19 |   tippyOptions?: TippyOptions;
20 | }) {
21 |   const [showAI, setShowAI] = useState(false);
22 |   const [openLink, setOpenLink] = useState(false);
23 |
24 |   if (!editor) {
25 |     return null;
26 |   }
27 |
28 |   return (
29 |     <div>
30 |       <TiptapBubbleMenu editor={editor} tippyOptions={tippyOptions}>
31 |         <div className="flex w-fit max-w-[90vw] overflow-hidden rounded-full border border-border bg-background text-mono font-regular">
32 |           {showAI ? (
33 |             <AIMenu onOpenChange={setShowAI} editor={editor} />
34 |           ) : (
35 |             <>
36 |               <AskAI onSelect={() => setShowAI(true)} />
37 |
38 |               <BubbleMenuItem
39 |                 editor={editor}
40 |                 action={() => editor.chain().focus().toggleBold().run()}
41 |                 isActive={editor.isActive("bold")}
42 |               >
43 |                 <MdOutlineFormatBold className="size-4" />
44 |                 <span className="sr-only">Bold</span>
45 |               </BubbleMenuItem>
46 |
47 |               <BubbleMenuItem
48 |                 editor={editor}
49 |                 action={() => editor.chain().focus().toggleItalic().run()}
50 |                 isActive={editor.isActive("italic")}
51 |               >
52 |                 <MdOutlineFormatItalic className="size-4" />
53 |                 <span className="sr-only">Italic</span>
54 |               </BubbleMenuItem>
55 |
56 |               <BubbleMenuItem
57 |                 editor={editor}
58 |                 action={() => editor.chain().focus().toggleStrike().run()}
59 |                 isActive={editor.isActive("strike")}
60 |               >
61 |                 <MdOutlineFormatStrikethrough className="size-4" />
62 |                 <span className="sr-only">Strike</span>
63 |               </BubbleMenuItem>
64 |
65 |               <LinkItem editor={editor} open={openLink} setOpen={setOpenLink} />
66 |             </>
67 |           )}
68 |         </div>
69 |       </TiptapBubbleMenu>
70 |     </div>
71 |   );
72 | }
```

packages/ui/src/components/editor/extentions/bubble-menu/link-item.tsx
```
1 | "use client";
2 |
3 | import type { Editor } from "@tiptap/react";
4 | import { useRef, useState } from "react";
5 | import {
6 |   MdOutlineAddLink,
7 |   MdOutlineCheck,
8 |   MdOutlineDelete,
9 |   MdOutlineLinkOff,
10 | } from "react-icons/md";
11 | import { Button } from "../../../button";
12 | import { Popover, PopoverContent, PopoverTrigger } from "../../../popover";
13 | import { formatUrlWithProtocol } from "../../utils";
14 | import { BubbleMenuButton } from "./bubble-menu-button";
15 |
16 | interface LinkItemProps {
17 |   editor: Editor;
18 |   open: boolean;
19 |   setOpen: (open: boolean) => void;
20 | }
21 |
22 | export function LinkItem({ editor, open, setOpen }: LinkItemProps) {
23 |   const [value, setValue] = useState("");
24 |   const isActive = editor.isActive("link");
25 |   const inputRef = useRef<HTMLInputElement>(null);
26 |   const linkValue = editor.getAttributes("link").href;
27 |
28 |   const handleSubmit = () => {
29 |     const url = formatUrlWithProtocol(value);
30 |
31 |     if (url) {
32 |       editor
33 |         .chain()
34 |         .focus()
35 |         .extendMarkRange("link")
36 |         .setLink({ href: url })
37 |         .run();
38 |
39 |       setOpen(false);
40 |     }
41 |   };
42 |
43 |   return (
44 |     <Popover modal={false} open={open} onOpenChange={setOpen}>
45 |       <PopoverTrigger asChild>
46 |         <div>
47 |           <BubbleMenuButton isActive={isActive} action={() => setOpen(true)}>
48 |             {linkValue ? (
49 |               <MdOutlineLinkOff className="size-4" />
50 |             ) : (
51 |               <MdOutlineAddLink className="size-4" />
52 |             )}
53 |           </BubbleMenuButton>
54 |         </div>
55 |       </PopoverTrigger>
56 |       <PopoverContent align="end" className="w-60 p-0" sideOffset={10}>
57 |         <div className="flex p-1">
58 |           <input
59 |             ref={inputRef}
60 |             type="text"
61 |             placeholder="Paste a link"
62 |             className="flex-1 bg-background p-0.5 h-7 text-xs outline-none placeholder:text-[#878787]"
63 |             defaultValue={linkValue || ""}
64 |             onChange={(e) => setValue(e.target.value)}
65 |             onKeyDown={(e) => {
66 |               if (e.key === "Enter") {
67 |                 handleSubmit();
68 |               }
69 |             }}
70 |           />
71 |
72 |           {linkValue ? (
73 |             <Button
74 |               size="icon"
75 |               variant="outline"
76 |               type="button"
77 |               className="flex size-7 items-center p-1 text-red-600 transition-all hover:bg-red-100 dark:hover:bg-red-800 hover:border-none"
78 |               onClick={() => {
79 |                 editor.chain().focus().unsetLink().run();
80 |                 if (inputRef.current) {
81 |                   inputRef.current.value = "";
82 |                 }
83 |                 setOpen(false);
84 |               }}
85 |             >
86 |               <MdOutlineDelete className="size-4" />
87 |             </Button>
88 |           ) : (
89 |             <Button
90 |               size="icon"
91 |               className="size-7"
92 |               type="button"
93 |               onClick={handleSubmit}
94 |             >
95 |               <MdOutlineCheck className="size-4" />
96 |             </Button>
97 |           )}
98 |         </div>
99 |       </PopoverContent>
100 |     </Popover>
101 |   );
102 | }
```

apps/dashboard/src/actions/ai/chat/tools/ui/burn-rate-ui.tsx
```
1 | "use client";
2 |
3 | import { AreaChart } from "@/components/charts/area-chart";
4 | import { BotCard } from "@/components/chat/messages";
5 | import { FormatAmount } from "@/components/format-amount";
6 | import { useUserContext } from "@/store/user/hook";
7 | import { formatDate } from "@/utils/format";
8 | import { addMonths } from "date-fns";
9 |
10 | type Props = {
11 |   averageBurnRate: number;
12 |   data: any;
13 |   months: number;
14 | };
15 |
16 | export function BurnRateUI({ averageBurnRate, months, data }: Props) {
17 |   const { date_format: dateFormat } = useUserContext((state) => state.data);
18 |
19 |   if (!data?.length) {
20 |     return (
21 |       <BotCard>
22 |         We couldn't find any historical data to provide you with a burn rate.
23 |       </BotCard>
24 |     );
25 |   }
26 |   return (
27 |     <BotCard className="font-sans space-y-4">
28 |       <p className="font-mono">
29 |         Based on your historical data, your avarage burn rate is{" "}
30 |         <FormatAmount amount={averageBurnRate} currency={data.currency} />
31 |         per month. Your expected runway is {months} months, ending in{" "}
32 |         {formatDate(addMonths(new Date(), months).toISOString(), dateFormat)}.
33 |       </p>
34 |
35 |       <AreaChart data={data} height={200} />
36 |     </BotCard>
37 |   );
38 | }
```

apps/dashboard/src/actions/ai/chat/tools/ui/documents-ui.tsx
```
1 | "use client";
2 |
3 | import { BotCard } from "@/components/chat/messages";
4 | import { FilePreview } from "@/components/file-preview";
5 | import type { FileType } from "@midday/utils";
6 |
7 | type Document = {
8 |   id: string;
9 |   display_name: string;
10 |   size: number;
11 |   file_path: string[];
12 |   content_type: FileType;
13 | };
14 |
15 | type Props = {
16 |   data?: Document[];
17 | };
18 |
19 | export function DocumentsUI({ data }: Props) {
20 |   if (!data?.length) {
21 |     return (
22 |       <BotCard>
23 |         No documents were found for your request. Please try a different
24 |         message.
25 |       </BotCard>
26 |     );
27 |   }
28 |
29 |   return (
30 |     <BotCard className="font-sans space-y-4">
31 |       <p className="font-mono">
32 |         We found {data.length} documents based on your search
33 |       </p>
34 |
35 |       <div className="w-full overflow-auto space-x-4 flex scrollbar-hide max-w-[671px] pr-4">
36 |         {data?.map((item) => {
37 |           const filename = item.file_path?.at(-1);
38 |           const [, ...rest] = item.file_path;
39 |           // Without team_id
40 |           const downloadPath = rest.join("/");
41 |
42 |           return (
43 |             <div key={item.id}>
44 |               <FilePreview
45 |                 width={150}
46 |                 height={198}
47 |                 preview
48 |                 disableFullscreen
49 |                 name={item.display_name}
50 |                 type={item.content_type}
51 |                 download
52 |                 downloadUrl={`/api/download/file?path=${downloadPath}&filename=${filename}`}
53 |                 src={`/api/proxy?filePath=vault/${item?.file_path?.join("/")}`}
54 |               />
55 |             </div>
56 |           );
57 |         })}
58 |       </div>
59 |     </BotCard>
60 |   );
61 | }
```

apps/dashboard/src/actions/ai/chat/tools/ui/error-fallback.tsx
```
1 | export function ErrorFallback() {
2 |   return (
3 |     <div className="ml-4 flex-1 space-y-2 overflow-hidden pl-2 text-xs font-mono leading-relaxed">
4 |       Something went wrong. Please try again.
5 |     </div>
6 |   );
7 | }
```

apps/dashboard/src/actions/ai/chat/tools/ui/forecast-ui.tsx
```
1 | "use client";
2 |
3 | import { BotCard, BotMessage } from "@/components/chat/messages";
4 |
5 | type Props = {
6 |   content: string;
7 | };
8 |
9 | export function ForecastUI({ content }: Props) {
10 |   if (!content) {
11 |     return (
12 |       <BotCard>
13 |         We couldn't find any historical data to provide you with a forecast.
14 |       </BotCard>
15 |     );
16 |   }
17 |
18 |   return <BotMessage content={content} />;
19 | }
```

apps/dashboard/src/actions/ai/chat/tools/ui/profit-ui.tsx
```
1 | "use client";
2 |
3 | import { BarChart } from "@/components/charts/bar-chart";
4 | import { BotCard } from "@/components/chat/messages";
5 | import { FormatAmount } from "@/components/format-amount";
6 | import { useUserContext } from "@/store/user/hook";
7 | import { formatDate } from "@/utils/format";
8 |
9 | type Props = {
10 |   data: any;
11 |   startDate: string;
12 |   endDate: string;
13 | };
14 |
15 | export function ProfitUI({ data, startDate, endDate }: Props) {
16 |   const { date_format: dateFormat } = useUserContext((state) => state.data);
17 |
18 |   if (!data?.result?.length) {
19 |     return (
20 |       <BotCard>
21 |         We couldn't find any data to provide you with a profit summary.
22 |       </BotCard>
23 |     );
24 |   }
25 |   return (
26 |     <BotCard className="font-sans space-y-16">
27 |       <div>
28 |         <p className="font-mono">
29 |           Based on the period from {formatDate(startDate, dateFormat)} and{" "}
30 |           {formatDate(endDate, dateFormat)} your current profit is{" "}
31 |           <FormatAmount
32 |             amount={data.summary.currentTotal}
33 |             currency={data.summary.currency}
34 |           />
35 |           . In the previous period, your profit was{" "}
36 |           <FormatAmount
37 |             maximumFractionDigits={0}
38 |             minimumFractionDigits={0}
39 |             amount={data.summary.prevTotal || 0}
40 |             currency={data.summary.currency}
41 |           />
42 |           .
43 |         </p>
44 |       </div>
45 |
46 |       <BarChart data={data} currency={data.summary.currency} height={200} />
47 |     </BotCard>
48 |   );
49 | }
```

apps/dashboard/src/actions/ai/chat/tools/ui/report-ui.tsx
```
1 | "use client";
2 |
3 | import { BotCard } from "@/components/chat/messages";
4 | import { CopyInput } from "@/components/copy-input";
5 | import { useI18n } from "@/locales/client";
6 | import { useUserContext } from "@/store/user/hook";
7 | import { formatDate } from "@/utils/format";
8 |
9 | type Props = {
10 |   shortLink: string;
11 |   type: "burn_rate" | "profit" | "revenue";
12 |   startDate: string;
13 |   endDate: string;
14 | };
15 |
16 | export function ReportUI({ shortLink, type, startDate, endDate }: Props) {
17 |   const { date_format: dateFormat } = useUserContext((state) => state.data);
18 |   const t = useI18n();
19 |
20 |   if (!shortLink) {
21 |     return (
22 |       <BotCard>We couldn't create a report for you, please try again.</BotCard>
23 |     );
24 |   }
25 |
26 |   return (
27 |     <BotCard className="font-sans space-y-4">
28 |       <p className="font-mono">
29 |         Here is your report for {t(`chart_type.${type}`)} between{" "}
30 |         {formatDate(startDate, dateFormat)} and{" "}
31 |         {formatDate(endDate, dateFormat)}
32 |       </p>
33 |
34 |       <div className="flex">
35 |         <CopyInput value={shortLink} className="w-auto" />
36 |       </div>
37 |     </BotCard>
38 |   );
39 | }
```

apps/dashboard/src/actions/ai/chat/tools/ui/revenue-ui.tsx
```
1 | "use client";
2 |
3 | import { BarChart } from "@/components/charts/bar-chart";
4 | import { BotCard } from "@/components/chat/messages";
5 | import { FormatAmount } from "@/components/format-amount";
6 | import { useUserContext } from "@/store/user/hook";
7 | import { formatDate } from "@/utils/format";
8 |
9 | type Props = {
10 |   data: any;
11 |   startDate: string;
12 |   endDate: string;
13 | };
14 |
15 | export function RevenueUI({ data, startDate, endDate }: Props) {
16 |   const { date_format: dateFormat } = useUserContext((state) => state.data);
17 |
18 |   if (!data?.result?.length) {
19 |     return (
20 |       <BotCard>
21 |         We couldn't find any data to provide you with a revenue summary.
22 |       </BotCard>
23 |     );
24 |   }
25 |   return (
26 |     <BotCard className="font-sans space-y-16">
27 |       <div>
28 |         <p className="font-mono">
29 |           Based on the period from {formatDate(startDate, dateFormat)} and{" "}
30 |           {formatDate(endDate, dateFormat)} your revenue is{" "}
31 |           <FormatAmount
32 |             amount={data.summary.currentTotal}
33 |             currency={data.summary.currency}
34 |           />
35 |           . In the previous period, your profit was{" "}
36 |           <FormatAmount
37 |             maximumFractionDigits={0}
38 |             minimumFractionDigits={0}
39 |             amount={data.summary.prevTotal || 0}
40 |             currency={data.summary.currency}
41 |           />
42 |           .
43 |         </p>
44 |       </div>
45 |
46 |       <BarChart data={data} currency={data.summary.currency} height={200} />
47 |     </BotCard>
48 |   );
49 | }
```

apps/dashboard/src/actions/ai/chat/tools/ui/runway-ui.tsx
```
1 | "use client";
2 |
3 | import { BotCard } from "@/components/chat/messages";
4 | import { useUserContext } from "@/store/user/hook";
5 | import { formatDate } from "@/utils/format";
6 | import { addMonths } from "date-fns";
7 |
8 | type Props = {
9 |   months: number;
10 | };
11 |
12 | export function RunwayUI({ months }: Props) {
13 |   const { date_format: dateFormat } = useUserContext((state) => state.data);
14 |
15 |   if (!months) {
16 |     return (
17 |       <BotCard>
18 |         We couldn't find any historical data to provide you with a runway.
19 |       </BotCard>
20 |     );
21 |   }
22 |
23 |   return (
24 |     <BotCard>
25 |       Based on your historical data, your expected runway is {months} months,
26 |       ending in{" "}
27 |       {formatDate(addMonths(new Date(), months).toISOString(), dateFormat)}.
28 |     </BotCard>
29 |   );
30 | }
```

apps/dashboard/src/actions/ai/chat/tools/ui/show-all-button.tsx
```
1 | "use client";
2 |
3 | import { useAssistantStore } from "@/store/assistant";
4 | import { isDesktopApp } from "@todesktop/client-core/platform/todesktop";
5 | import { useRouter } from "next/navigation";
6 |
7 | type Props = {
8 |   filter: Record<string, string>;
9 |   sort?: string[];
10 |   q: string;
11 | };
12 |
13 | export function ShowAllButton({ filter, q, sort }: Props) {
14 |   const { setOpen } = useAssistantStore();
15 |   const router = useRouter();
16 |
17 |   const params = new URLSearchParams();
18 |
19 |   if (q) {
20 |     params.append("q", q);
21 |   }
22 |
23 |   if (Object.keys(filter).length > 0) {
24 |     for (const [key, value] of Object.entries(filter)) {
25 |       params.append(key, value);
26 |     }
27 |   }
28 |
29 |   if (sort) {
30 |     params.append("sort", `${sort.at(0)}:${sort.at(1)}`);
31 |   }
32 |
33 |   const handleOnClick = () => {
34 |     setOpen();
35 |     router.push(`/transactions?${params.toString()}`);
36 |   };
37 |
38 |   if (isDesktopApp()) {
39 |     // TODO: Fix link in desktop
40 |     return null;
41 |   }
42 |
43 |   return (
44 |     <button
45 |       type="button"
46 |       onClick={handleOnClick}
47 |       className="text-[#878787] font-sans"
48 |     >
49 |       Show all
50 |     </button>
51 |   );
52 | }
```

apps/dashboard/src/actions/ai/chat/tools/ui/spending-ui.tsx
```
1 | "use client";
2 |
3 | import { BotCard } from "@/components/chat/messages";
4 | import { FormatAmount } from "@/components/format-amount";
5 | import { useUserContext } from "@/store/user/hook";
6 | import { formatDate } from "@/utils/format";
7 |
8 | type Props = {
9 |   amount: number;
10 |   currency: string;
11 |   category: string;
12 |   name?: string;
13 |   startDate: string;
14 |   endDate: string;
15 | };
16 |
17 | export function SpendingUI({
18 |   amount,
19 |   currency,
20 |   category,
21 |   name,
22 |   startDate,
23 |   endDate,
24 | }: Props) {
25 |   const { date_format: dateFormat } = useUserContext((state) => state.data);
26 |
27 |   if (!amount) {
28 |     return (
29 |       <BotCard>
30 |         We couldn't find any spending in this category {category} between{" "}
31 |         {formatDate(startDate, dateFormat)} and{" "}
32 |         {formatDate(endDate, dateFormat)}
33 |       </BotCard>
34 |     );
35 |   }
36 |
37 |   return (
38 |     <BotCard>
39 |       You have spent{" "}
40 |       <FormatAmount amount={Math.abs(amount)} currency={currency} /> on {name}{" "}
41 |       between {formatDate(startDate, dateFormat)} and{" "}
42 |       {formatDate(endDate, dateFormat)}
43 |     </BotCard>
44 |   );
45 | }
```

apps/dashboard/src/actions/ai/chat/tools/ui/transactions-ui.tsx
```
1 | "use client";
2 |
3 | import { BotCard } from "@/components/chat/messages";
4 | import { FormatAmount } from "@/components/format-amount";
5 | import { TransactionStatus } from "@/components/transaction-status";
6 | import { useI18n } from "@/locales/client";
7 | import { useUserContext } from "@/store/user/hook";
8 | import { formatDate } from "@/utils/format";
9 | import { cn } from "@midday/ui/cn";
10 | import {
11 |   Table,
12 |   TableBody,
13 |   TableCell,
14 |   TableHead,
15 |   TableHeader,
16 |   TableRow,
17 | } from "@midday/ui/table";
18 | import { ShowAllButton } from "./show-all-button";
19 |
20 | type Props = {
21 |   meta: any;
22 |   data: any;
23 |   q: string;
24 |   filter: Record<string, string>;
25 |   sort?: Record<string, string>;
26 | };
27 |
28 | export function TransactionsUI({ meta, data, q, filter, sort }: Props) {
29 |   const t = useI18n();
30 |   const { date_format: dateFormat } = useUserContext((state) => state.data);
31 |
32 |   if (!meta.count) {
33 |     return (
34 |       <BotCard>
35 |         No transactions were found for your request. Please try a different
36 |         message.
37 |       </BotCard>
38 |     );
39 |   }
40 |
41 |   return (
42 |     <BotCard className="space-y-4">
43 |       {meta.totalAmount.length === 1 && (
44 |         <p>
45 |           We found {meta.count}{" "}
46 |           {filter.recurring ? "recurring transactions" : "transactions"} with a
47 |           total amount of{" "}
48 |           <FormatAmount
49 |             amount={meta.totalAmount.at(0).amount}
50 |             currency={meta.totalAmount.at(0).currency}
51 |           />
52 |         </p>
53 |       )}
54 |
55 |       {meta.totalAmount.length > 1 && (
56 |         <p>We found {meta.count} transactions </p>
57 |       )}
58 |
59 |       {meta.count > 0 && (
60 |         <Table className="text-xs font-sans">
61 |           <TableHeader>
62 |             <TableRow>
63 |               <TableHead className="w-[45%] h-10">Description</TableHead>
64 |               <TableHead className="h-10 min-w-[80px]">Date</TableHead>
65 |               <TableHead className="h-10">Amount</TableHead>
66 |               <TableHead className="h-10 text-right w-[50px]">Status</TableHead>
67 |             </TableRow>
68 |           </TableHeader>
69 |           <TableBody>
70 |             {data?.map((transaction) => {
71 |               const fullfilled =
72 |                 transaction.status === "completed" ||
73 |                 transaction?.attachments?.length > 0;
74 |
75 |               return (
76 |                 <TableRow key={transaction.id} className="h-[34px]">
77 |                   <TableCell
78 |                     className={cn(
79 |                       "font-normal",
80 |                       transaction.category?.slug === "income" &&
81 |                         "text-[#00C969]",
82 |                     )}
83 |                   >
84 |                     <span className="line-clamp-1">{transaction.name}</span>
85 |                   </TableCell>
86 |                   <TableCell className="font-normal">
87 |                     {formatDate(transaction.date, dateFormat)}
88 |                   </TableCell>
89 |                   <TableCell
90 |                     className={cn(
91 |                       "font-normal",
92 |                       transaction.category?.slug === "income" &&
93 |                         "text-[#00C969]",
94 |                     )}
95 |                   >
96 |                     <FormatAmount
97 |                       amount={transaction.amount}
98 |                       currency={transaction.currency}
99 |                     />
100 |                   </TableCell>
101 |                   <TableCell className="text-right font-normal">
102 |                     <TransactionStatus fullfilled={fullfilled} />
103 |                   </TableCell>
104 |                 </TableRow>
105 |               );
106 |             })}
107 |           </TableBody>
108 |         </Table>
109 |       )}
110 |
111 |       {meta.count > 5 && <ShowAllButton filter={filter} q={q} sort={sort} />}
112 |     </BotCard>
113 |   );
114 | }
```

apps/dashboard/src/app/[locale]/(app)/(sidebar)/account/layout.tsx
```
1 | import { SecondaryMenu } from "@/components/secondary-menu";
2 |
3 | export default function Layout({ children }: { children: React.ReactNode }) {
4 |   return (
5 |     <div className="max-w-[800px]">
6 |       <SecondaryMenu
7 |         items={[
8 |           { path: "/account", label: "General" },
9 |           { path: "/account/date-and-locale", label: "Date & Locale" },
10 |           { path: "/account/security", label: "Security" },
11 |           { path: "/account/assistant", label: "Assistant" },
12 |           { path: "/account/teams", label: "Teams" },
13 |           { path: "/account/support", label: "Support" },
14 |         ]}
15 |       />
16 |
17 |       <main className="mt-8">{children}</main>
18 |     </div>
19 |   );
20 | }
```

apps/dashboard/src/app/[locale]/(app)/(sidebar)/account/page.tsx
```
1 | import { ChangeEmail } from "@/components/change-email";
2 | import { ChangeTheme } from "@/components/change-theme";
3 | import { DeleteAccount } from "@/components/delete-account";
4 | import { DisplayName } from "@/components/display-name";
5 | import { UserAvatar } from "@/components/user-avatar";
6 | import { getUser } from "@midday/supabase/cached-queries";
7 | import type { Metadata } from "next";
8 |
9 | export const metadata: Metadata = {
10 |   title: "Account Settings | Midday",
11 | };
12 |
13 | export default async function Account() {
14 |   const { data: userData } = await getUser();
15 |
16 |   return (
17 |     <div className="space-y-12">
18 |       <UserAvatar
19 |         userId={userData.id}
20 |         fullName={userData.full_name}
21 |         avatarUrl={userData?.avatar_url}
22 |       />
23 |       <DisplayName fullName={userData.full_name} />
24 |       <ChangeEmail email={userData.email} />
25 |       <ChangeTheme />
26 |       <DeleteAccount />
27 |     </div>
28 |   );
29 | }
```

apps/dashboard/src/app/[locale]/(app)/(sidebar)/apps/page.tsx
```
1 | import { AppsHeader } from "@/components/apps-header";
2 | import { AppsServer } from "@/components/apps.server";
3 | import { AppsSkeleton } from "@/components/apps.skeleton";
4 | import { getUser } from "@midday/supabase/cached-queries";
5 | import type { Metadata } from "next";
6 | import { Suspense } from "react";
7 |
8 | export const metadata: Metadata = {
9 |   title: "Apps | Midday",
10 | };
11 |
12 | export default async function Page() {
13 |   const { data } = await getUser();
14 |
15 |   return (
16 |     <div className="mt-4">
17 |       <AppsHeader  />
18 |
19 |       <Suspense fallback={<AppsSkeleton />}>
20 |         <AppsServer user={data} />
21 |       </Suspense>
22 |     </div>
23 |   );
24 | }
```

apps/dashboard/src/app/[locale]/(app)/(sidebar)/customers/page.tsx
```
1 | import { CustomersHeader } from "@/components/customers-header";
2 | import { ErrorFallback } from "@/components/error-fallback";
3 | import { CustomersTable } from "@/components/tables/customers";
4 | import { CustomersSkeleton } from "@/components/tables/customers/skeleton";
5 | import type { Metadata } from "next";
6 | import { ErrorBoundary } from "next/dist/client/components/error-boundary";
7 | import { Suspense } from "react";
8 | import { searchParamsCache } from "./search-params";
9 |
10 | export const metadata: Metadata = {
11 |   title: "Customers | Midday",
12 | };
13 |
14 | export default async function Page({
15 |   searchParams,
16 | }: {
17 |   searchParams: Record<string, string | string[] | undefined>;
18 | }) {
19 |   const {
20 |     q: query,
21 |     sort,
22 |     start,
23 |     end,
24 |     page,
25 |   } = searchParamsCache.parse(searchParams);
26 |
27 |   return (
28 |     <div className="flex flex-col pt-6 gap-6">
29 |       <CustomersHeader />
30 |
31 |       <ErrorBoundary errorComponent={ErrorFallback}>
32 |         <Suspense fallback={<CustomersSkeleton />}>
33 |           <CustomersTable
34 |             query={query}
35 |             sort={sort}
36 |             start={start}
37 |             end={end}
38 |             page={page}
39 |           />
40 |         </Suspense>
41 |       </ErrorBoundary>
42 |     </div>
43 |   );
44 | }
```

apps/dashboard/src/app/[locale]/(app)/(sidebar)/customers/search-params.ts
```
1 | import {
2 |   createSearchParamsCache,
3 |   parseAsArrayOf,
4 |   parseAsInteger,
5 |   parseAsString,
6 | } from "nuqs/server";
7 |
8 | export const searchParamsCache = createSearchParamsCache({
9 |   page: parseAsInteger.withDefault(0),
10 |   q: parseAsString.withDefault(""),
11 |   sort: parseAsArrayOf(parseAsString),
12 |   start: parseAsString,
13 |   end: parseAsString,
14 | });
```

apps/dashboard/src/app/[locale]/(app)/(sidebar)/inbox/page.tsx
```
1 | import { Inbox } from "@/components/inbox";
2 | import { InboxViewSkeleton } from "@/components/inbox-skeleton";
3 | import { Cookies } from "@/utils/constants";
4 | import { uniqueCurrencies } from "@midday/location/currencies";
5 | import type { Metadata } from "next";
6 | import { cookies } from "next/headers";
7 | import { Suspense } from "react";
8 |
9 | export const metadata: Metadata = {
10 |   title: "Inbox | Midday",
11 | };
12 |
13 | type Props = {
14 |   searchParams: { [key: string]: string | string[] | undefined };
15 | };
16 |
17 | export default async function InboxPage({ searchParams }: Props) {
18 |   const ascending =
19 |     cookies().get(Cookies.InboxOrder)?.value === "true" ?? false;
20 |
21 |   return (
22 |     <Suspense
23 |       key={ascending.toString()}
24 |       fallback={<InboxViewSkeleton ascending />}
25 |     >
26 |       <Inbox
27 |         ascending={ascending}
28 |         query={searchParams?.q}
29 |         currencies={uniqueCurrencies}
30 |       />
31 |     </Suspense>
32 |   );
33 | }
```

apps/dashboard/src/app/[locale]/(app)/(sidebar)/invoices/page.tsx
```
1 | import { ErrorFallback } from "@/components/error-fallback";
2 | import { InvoiceHeader } from "@/components/invoice-header";
3 | import {
4 |   InvoicePaymentScore,
5 |   InvoicePaymentScoreSkeleton,
6 | } from "@/components/invoice-payment-score";
7 | import { InvoiceSummarySkeleton } from "@/components/invoice-summary";
8 | import { InvoicesOpen } from "@/components/invoices-open";
9 | import { InvoicesOverdue } from "@/components/invoices-overdue";
10 | import { InvoicesPaid } from "@/components/invoices-paid";
11 | import { InvoicesTable } from "@/components/tables/invoices";
12 | import { InvoiceSkeleton } from "@/components/tables/invoices/skeleton";
13 | import { getDefaultSettings } from "@midday/invoice/default";
14 | import type { Metadata } from "next";
15 | import { ErrorBoundary } from "next/dist/client/components/error-boundary";
16 | import { Suspense } from "react";
17 | import { searchParamsCache } from "./search-params";
18 |
19 | export const metadata: Metadata = {
20 |   title: "Invoices | Midday",
21 | };
22 |
23 | export default async function Page({
24 |   searchParams,
25 | }: {
26 |   searchParams: Record<string, string | string[] | undefined>;
27 | }) {
28 |   const {
29 |     q: query,
30 |     sort,
31 |     start,
32 |     end,
33 |     statuses,
34 |     customers,
35 |     page,
36 |   } = searchParamsCache.parse(searchParams);
37 |
38 |   const defaultSettings = await getDefaultSettings();
39 |
40 |   const loadingKey = JSON.stringify({
41 |     q: query,
42 |     sort,
43 |     start,
44 |     end,
45 |     statuses,
46 |     customers,
47 |     page,
48 |   });
49 |
50 |   return (
51 |     <div className="flex flex-col gap-6">
52 |       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 pt-6">
53 |         <Suspense fallback={<InvoiceSummarySkeleton />}>
54 |           <InvoicesOpen defaultCurrency={defaultSettings.currency} />
55 |         </Suspense>
56 |         <Suspense fallback={<InvoiceSummarySkeleton />}>
57 |           <InvoicesOverdue defaultCurrency={defaultSettings.currency} />
58 |         </Suspense>
59 |         <Suspense fallback={<InvoiceSummarySkeleton />}>
60 |           <InvoicesPaid defaultCurrency={defaultSettings.currency} />
61 |         </Suspense>
62 |         <Suspense fallback={<InvoicePaymentScoreSkeleton />}>
63 |           <InvoicePaymentScore />
64 |         </Suspense>
65 |       </div>
66 |
67 |       <InvoiceHeader />
68 |
69 |       <ErrorBoundary errorComponent={ErrorFallback}>
70 |         <Suspense fallback={<InvoiceSkeleton />} key={loadingKey}>
71 |           <InvoicesTable
72 |             query={query}
73 |             sort={sort}
74 |             start={start}
75 |             end={end}
76 |             statuses={statuses}
77 |             customers={customers}
78 |             page={page}
79 |           />
80 |         </Suspense>
81 |       </ErrorBoundary>
82 |     </div>
83 |   );
84 | }
```

apps/dashboard/src/app/[locale]/(app)/(sidebar)/invoices/search-params.ts
```
1 | import {
2 |   createSearchParamsCache,
3 |   parseAsArrayOf,
4 |   parseAsInteger,
5 |   parseAsString,
6 | } from "nuqs/server";
7 |
8 | export const searchParamsCache = createSearchParamsCache({
9 |   page: parseAsInteger.withDefault(0),
10 |   q: parseAsString.withDefault(""),
11 |   sort: parseAsArrayOf(parseAsString),
12 |   start: parseAsString,
13 |   end: parseAsString,
14 |   statuses: parseAsArrayOf(parseAsString),
15 |   customers: parseAsArrayOf(parseAsString),
16 | });
```

apps/dashboard/src/app/[locale]/(app)/(sidebar)/settings/layout.tsx
```
1 | import { Header } from "@/components/header";
2 | import { SecondaryMenu } from "@/components/secondary-menu";
3 |
4 | export default function Layout({ children }: { children: React.ReactNode }) {
5 |   return (
6 |     <div className="max-w-[800px]">
7 |       <SecondaryMenu
8 |         items={[
9 |           { path: "/settings", label: "General" },
10 |           { path: "/settings/accounts", label: "Bank Connections" },
11 |           { path: "/settings/categories", label: "Categories" },
12 |           { path: "/settings/members", label: "Members" },
13 |           { path: "/settings/notifications", label: "Notifications" },
14 |         ]}
15 |       />
16 |
17 |       <main className="mt-8">{children}</main>
18 |     </div>
19 |   );
20 | }
```

apps/dashboard/src/app/[locale]/(app)/(sidebar)/settings/page.tsx
```
1 | import { DeleteTeam } from "@/components/delete-team";
2 | import { TeamAvatar } from "@/components/team-avatar";
3 | import { TeamName } from "@/components/team-name";
4 | import { getUser } from "@midday/supabase/cached-queries";
5 | import type { Metadata } from "next";
6 |
7 | export const metadata: Metadata = {
8 |   title: "Team Settings | Midday",
9 | };
10 |
11 | export default async function Account() {
12 |   const user = await getUser();
13 |
14 |   return (
15 |     <div className="space-y-12">
16 |       <TeamAvatar
17 |         teamId={user?.data?.team?.id}
18 |         name={user?.data?.team?.name}
19 |         logoUrl={user?.data?.team?.logo_url}
20 |       />
21 |
22 |       <TeamName name={user?.data?.team?.name} />
23 |       <DeleteTeam name={user?.data?.team?.name} teamId={user?.data?.team?.id} />
24 |     </div>
25 |   );
26 | }
```

apps/dashboard/src/app/[locale]/(app)/(sidebar)/tracker/page.tsx
```
1 | import { OpenTrackerSheet } from "@/components/open-tracker-sheet";
2 | import { Table } from "@/components/tables/tracker";
3 | import { Loading } from "@/components/tables/tracker/loading";
4 | import { TrackerCalendar } from "@/components/tracker-calendar";
5 | import { TrackerSearchFilter } from "@/components/tracker-search-filter";
6 | import {
7 |   getCustomers,
8 |   getTrackerRecordsByRange,
9 |   getUser,
10 | } from "@midday/supabase/cached-queries";
11 | import { endOfMonth, formatISO, startOfMonth } from "date-fns";
12 | import type { Metadata } from "next";
13 | import { Suspense } from "react";
14 | import { searchParamsCache } from "./search-params";
15 |
16 | export const metadata: Metadata = {
17 |   title: "Tracker | Midday",
18 | };
19 |
20 | type Props = {
21 |   searchParams: {
22 |     statuses: string;
23 |     sort: string;
24 |     q: string;
25 |     start?: string;
26 |     end?: string;
27 |     customers?: string[];
28 |   };
29 | };
30 |
31 | export default async function Tracker({ searchParams }: Props) {
32 |   const {
33 |     sort: sortParams,
34 |     statuses,
35 |     customers,
36 |   } = searchParamsCache.parse(searchParams);
37 |
38 |   const sort = sortParams?.split(":") ?? ["status", "asc"];
39 |
40 |   const currentDate =
41 |     searchParams?.date ?? formatISO(new Date(), { representation: "date" });
42 |
43 |   const [{ data: userData }, { data, meta }, { data: customersData }] =
44 |     await Promise.all([
45 |       getUser(),
46 |       getTrackerRecordsByRange({
47 |         from: formatISO(startOfMonth(new Date(currentDate)), {
48 |           representation: "date",
49 |         }),
50 |         to: formatISO(endOfMonth(new Date(currentDate)), {
51 |           representation: "date",
52 |         }),
53 |       }),
54 |       getCustomers(),
55 |     ]);
56 |
57 |   return (
58 |     <div>
59 |       <TrackerCalendar
60 |         weekStartsOnMonday={userData?.week_starts_on_monday}
61 |         timeFormat={userData?.time_format}
62 |         data={data}
63 |         meta={meta}
64 |       />
65 |
66 |       <div className="mt-14 mb-6 flex items-center justify-between space-x-4">
67 |         <h2 className="text-md font-medium">Projects</h2>
68 |
69 |         <div className="flex space-x-2">
70 |           <TrackerSearchFilter customers={customersData} />
71 |           <OpenTrackerSheet />
72 |         </div>
73 |       </div>
74 |
75 |       <Suspense fallback={<Loading />}>
76 |         <Table
77 |           status={statuses}
78 |           sort={sort}
79 |           q={searchParams?.q}
80 |           start={searchParams?.start}
81 |           end={searchParams?.end}
82 |           userId={userData?.id}
83 |           customerIds={customers}
84 |         />
85 |       </Suspense>
86 |     </div>
87 |   );
88 | }
```

apps/dashboard/src/app/[locale]/(app)/(sidebar)/tracker/search-params.ts
```
1 | import {
2 |   createSearchParamsCache,
3 |   parseAsArrayOf,
4 |   parseAsString,
5 | } from "nuqs/server";
6 |
7 | export const searchParamsCache = createSearchParamsCache({
8 |   customers: parseAsArrayOf(parseAsString),
9 |   statuses: parseAsArrayOf(parseAsString),
10 |   sort: parseAsString,
11 | });
```

apps/dashboard/src/app/[locale]/(app)/(sidebar)/transactions/page.tsx
```
1 | import { ErrorFallback } from "@/components/error-fallback";
2 | import { TransactionsModal } from "@/components/modals/transactions-modal";
3 | import { CreateTransactionSheet } from "@/components/sheets/create-transaction-sheet";
4 | import { Table } from "@/components/tables/transactions";
5 | import { NoAccounts } from "@/components/tables/transactions/empty-states";
6 | import { Loading } from "@/components/tables/transactions/loading";
7 | import { TransactionsActions } from "@/components/transactions-actions";
8 | import { TransactionsSearchFilter } from "@/components/transactions-search-filter";
9 | import { Cookies } from "@/utils/constants";
10 | import {
11 |   getCategories,
12 |   getTags,
13 |   getTeamBankAccounts,
14 |   getTeamMembers,
15 |   getUser,
16 | } from "@midday/supabase/cached-queries";
17 | import type { Metadata } from "next";
18 | import { ErrorBoundary } from "next/dist/client/components/error-boundary";
19 | import { cookies } from "next/headers";
20 | import { Suspense } from "react";
21 | import { searchParamsCache } from "./search-params";
22 |
23 | export const metadata: Metadata = {
24 |   title: "Transactions | Midday",
25 | };
26 |
27 | export default async function Transactions({
28 |   searchParams,
29 | }: {
30 |   searchParams: Record<string, string | string[] | undefined>;
31 | }) {
32 |   const {
33 |     q: query,
34 |     page,
35 |     attachments,
36 |     start,
37 |     end,
38 |     categories,
39 |     assignees,
40 |     statuses,
41 |     recurring,
42 |     accounts,
43 |     tags,
44 |     amount_range,
45 |     amount,
46 |   } = searchParamsCache.parse(searchParams);
47 |
48 |   // Move this in a suspense
49 |   const [accountsData, categoriesData, teamMembersData, userData, tagsData] =
50 |     await Promise.all([
51 |       getTeamBankAccounts(),
52 |       getCategories(),
53 |       getTeamMembers(),
54 |       getUser(),
55 |       getTags(),
56 |     ]);
57 |
58 |   const filter = {
59 |     attachments,
60 |     start,
61 |     end,
62 |     categories,
63 |     assignees,
64 |     statuses,
65 |     recurring,
66 |     accounts,
67 |     tags,
68 |     amount_range,
69 |     amount,
70 |   };
71 |
72 |   const sort = searchParams?.sort?.split(":");
73 |   const hideConnectFlow = cookies().has(Cookies.HideConnectFlow);
74 |
75 |   const isOpen = Boolean(searchParams.step);
76 |   const isEmpty = !accountsData?.data?.length && !isOpen;
77 |   const loadingKey = JSON.stringify({
78 |     page,
79 |     filter,
80 |     sort,
81 |     query,
82 |   });
83 |
84 |   return (
85 |     <>
86 |       <div className="flex justify-between py-6">
87 |         <TransactionsSearchFilter
88 |           placeholder="Search or type filter"
89 |           categories={[
90 |             ...categoriesData?.data?.map((category) => ({
91 |               slug: category.slug,
92 |               name: category.name,
93 |             })),
94 |             {
95 |               // TODO, move this to the database
96 |               id: "uncategorized",
97 |               name: "Uncategorized",
98 |               slug: "uncategorized",
99 |             },
100 |           ]}
101 |           accounts={accountsData?.data?.map((account) => ({
102 |             id: account.id,
103 |             name: account.name,
104 |             currency: account.currency,
105 |           }))}
106 |           members={teamMembersData?.data?.map((member) => ({
107 |             id: member?.user?.id,
108 |             name: member.user?.full_name,
109 |           }))}
110 |           tags={tagsData?.data?.map((tag) => ({
111 |             id: tag.id,
112 |             name: tag.name,
113 |           }))}
114 |         />
115 |         <TransactionsActions
116 |           isEmpty={isEmpty}
117 |           tags={tagsData?.data?.map((tag) => ({
118 |             id: tag.id,
119 |             name: tag.name,
120 |           }))}
121 |         />
122 |       </div>
123 |
124 |       {isEmpty ? (
125 |         <div className="relative h-[calc(100vh-200px)] overflow-hidden">
126 |           <NoAccounts />
127 |           <Loading isEmpty />
128 |         </div>
129 |       ) : (
130 |         <ErrorBoundary errorComponent={ErrorFallback}>
131 |           <Suspense fallback={<Loading />} key={loadingKey}>
132 |             <Table filter={filter} page={page} sort={sort} query={query} />
133 |           </Suspense>
134 |         </ErrorBoundary>
135 |       )}
136 |
137 |       <TransactionsModal defaultOpen={isEmpty && !hideConnectFlow} />
138 |       <CreateTransactionSheet
139 |         categories={categoriesData?.data}
140 |         userId={userData?.data?.id}
141 |         accountId={accountsData?.data?.at(0)?.id}
142 |         currency={accountsData?.data?.at(0)?.currency}
143 |       />
144 |     </>
145 |   );
146 | }
```

apps/dashboard/src/app/[locale]/(app)/(sidebar)/transactions/search-params.ts
```
1 | import {
2 |   createSearchParamsCache,
3 |   parseAsArrayOf,
4 |   parseAsInteger,
5 |   parseAsString,
6 |   parseAsStringLiteral,
7 | } from "nuqs/server";
8 |
9 | export const searchParamsCache = createSearchParamsCache({
10 |   q: parseAsString,
11 |   page: parseAsInteger.withDefault(0),
12 |   attachments: parseAsStringLiteral(["exclude", "include"] as const),
13 |   start: parseAsString,
14 |   end: parseAsString,
15 |   categories: parseAsArrayOf(parseAsString),
16 |   tags: parseAsArrayOf(parseAsString),
17 |   amount_range: parseAsArrayOf(parseAsInteger),
18 |   accounts: parseAsArrayOf(parseAsString),
19 |   assignees: parseAsArrayOf(parseAsString),
20 |   amount: parseAsArrayOf(parseAsString),
21 |   recurring: parseAsArrayOf(
22 |     parseAsStringLiteral(["all", "weekly", "monthly", "annually"] as const),
23 |   ),
24 |   statuses: parseAsStringLiteral([
25 |     "completed",
26 |     "uncompleted",
27 |     "archived",
28 |     "excluded",
29 |   ] as const),
30 | });
```

apps/dashboard/src/app/[locale]/(app)/(sidebar)/vault/layout.tsx
```
1 | import { VaultActivity } from "@/components/vault-activity";
2 | import { Loading } from "@/components/vault-activity.loading";
3 | import { type ReactNode, Suspense } from "react";
4 |
5 | export default function Layout({
6 |   children,
7 | }: {
8 |   children: ReactNode;
9 | }) {
10 |   return (
11 |     <div>
12 |       <Suspense fallback={<Loading />}>
13 |         <VaultActivity />
14 |       </Suspense>
15 |
16 |       {children}
17 |     </div>
18 |   );
19 | }
```

apps/dashboard/src/app/[locale]/(app)/desktop/command/page.tsx
```
1 | import { AI } from "@/actions/ai/chat";
2 | import { Assistant } from "@/components/assistant";
3 | import { getUser } from "@midday/supabase/cached-queries";
4 | import { nanoid } from "nanoid";
5 |
6 | export default async function Page() {
7 |   const user = await getUser();
8 |
9 |   return (
10 |     <AI initialAIState={{ user: user.data, messages: [], chatId: nanoid() }}>
11 |       <Assistant />
12 |     </AI>
13 |   );
14 | }
```

apps/dashboard/src/app/[locale]/(app)/mfa/setup/page.tsx
```
1 | import { SetupMfa } from "@/components/setup-mfa";
2 | import type { Metadata } from "next";
3 |
4 | export const metadata: Metadata = {
5 |   title: "Setup MFA | Midday",
6 | };
7 |
8 | export default function Setup() {
9 |   return <SetupMfa />;
10 | }
```

apps/dashboard/src/app/[locale]/(app)/mfa/verify/page.tsx
```
1 | "use client";
2 |
3 | import { VerifyMfa } from "@/components/verify-mfa";
4 | import { Icons } from "@midday/ui/icons";
5 | import Link from "next/link";
6 |
7 | export default function Verify() {
8 |   return (
9 |     <div>
10 |       <div className="absolute left-5 top-4 md:left-10 md:top-10">
11 |         <Link href="https://midday.ai">
12 |           <Icons.Logo />
13 |         </Link>
14 |       </div>
15 |
16 |       <div className="flex min-h-screen justify-center items-center overflow-hidden p-6 md:p-0">
17 |         <div className="relative z-20 m-auto flex w-full max-w-[380px] flex-col">
18 |           <VerifyMfa />
19 |         </div>
20 |       </div>
21 |     </div>
22 |   );
23 | }
```

apps/dashboard/src/app/[locale]/(app)/teams/create/page.tsx
```
1 | import { CreateTeamForm } from "@/components/forms/create-team-form";
2 | import { UserMenu } from "@/components/user-menu";
3 | import { Icons } from "@midday/ui/icons";
4 | import type { Metadata } from "next";
5 | import Link from "next/link";
6 | import { Suspense } from "react";
7 |
8 | export const metadata: Metadata = {
9 |   title: "Create Team | Midday",
10 | };
11 |
12 | export default async function CreateTeam() {
13 |   return (
14 |     <>
15 |       <header className="w-full absolute left-0 right-0 flex justify-between items-center">
16 |         <div className="ml-5 mt-4 md:ml-10 md:mt-10">
17 |           <Link href="/">
18 |             <Icons.Logo />
19 |           </Link>
20 |         </div>
21 |
22 |         <div className="mr-5 mt-4 md:mr-10 md:mt-10">
23 |           <Suspense>
24 |             <UserMenu onlySignOut />
25 |           </Suspense>
26 |         </div>
27 |       </header>
28 |
29 |       <div className="flex min-h-screen justify-center items-center overflow-hidden p-6 md:p-0">
30 |         <div className="relative z-20 m-auto flex w-full max-w-[340px] flex-col">
31 |           <div>
32 |             <h1 className="text-2xl font-medium mb-8">
33 |               What’s the name of your company or team?
34 |             </h1>
35 |           </div>
36 |
37 |           <div className="mb-2">
38 |             <p className="text-sm">
39 |               This will be the name of your Midday workspace — choose something
40 |               that your team will recognize.
41 |             </p>
42 |           </div>
43 |
44 |           <CreateTeamForm />
45 |         </div>
46 |       </div>
47 |     </>
48 |   );
49 | }
```

apps/dashboard/src/app/[locale]/(app)/teams/invite/page.tsx
```
1 | import { InviteForm } from "@/components/forms/invite-form";
2 | import { UserMenu } from "@/components/user-menu";
3 | import { Icons } from "@midday/ui/icons";
4 | import type { Metadata } from "next";
5 | import Link from "next/link";
6 | import { Suspense } from "react";
7 |
8 | export const metadata: Metadata = {
9 |   title: "Invite Team Member | Midday",
10 | };
11 |
12 | export default async function InviteMembers() {
13 |   return (
14 |     <>
15 |       <header className="w-full absolute left-0 right-0 flex justify-between items-center">
16 |         <div className="ml-5 mt-4 md:ml-10 md:mt-10">
17 |           <Link href="/">
18 |             <Icons.Logo />
19 |           </Link>
20 |         </div>
21 |
22 |         <div className="mr-5 mt-4 md:mr-10 md:mt-10">
23 |           <Suspense>
24 |             <UserMenu onlySignOut />
25 |           </Suspense>
26 |         </div>
27 |       </header>
28 |
29 |       <div className="flex min-h-screen justify-center items-center overflow-hidden p-6 md:p-0">
30 |         <div className="relative z-20 m-auto flex w-full max-w-[340px] flex-col">
31 |           <h1 className="text-2xl font-medium pb-4">Invite team members</h1>
32 |           <p className="text-sm text-[#878787] mb-8">
33 |             Add the email addresses of the people you want on your team and send
34 |             them invites to join.
35 |           </p>
36 |
37 |           <InviteForm />
38 |         </div>
39 |       </div>
40 |     </>
41 |   );
42 | }
```

apps/dashboard/src/app/[locale]/(public)/report/[id]/page.tsx
```
1 | import { AnimatedNumber } from "@/components/animated-number";
2 | import { AreaChart } from "@/components/charts/area-chart";
3 | import { BarChart } from "@/components/charts/bar-chart";
4 | import { StackedBarChart } from "@/components/charts/stacked-bar-chart";
5 | import { FormatAmount } from "@/components/format-amount";
6 | import { calculateAvgBurnRate } from "@/utils/format";
7 | import {
8 |   getBurnRateQuery,
9 |   getExpensesQuery,
10 |   getMetricsQuery,
11 |   getRunwayQuery,
12 | } from "@midday/supabase/queries";
13 | import { createClient } from "@midday/supabase/server";
14 | import { Button } from "@midday/ui/button";
15 | import { format } from "date-fns";
16 | import type { Metadata } from "next";
17 | import Link from "next/link";
18 | import { notFound } from "next/navigation";
19 |
20 | export const revalidate = 3600;
21 | export const fetchCache = "force-cache";
22 |
23 | function getReportMeta(data) {
24 |   const period = `${format(new Date(data.from), "LLL dd, y")} - ${format(
25 |     new Date(data.to),
26 |     "LLL dd, y",
27 |   )}`;
28 |
29 |   switch (data.type) {
30 |     case "profit":
31 |       return {
32 |         title: `Profit for ${data.team.name} (${period})`,
33 |         description: `Profit for ${data.team.name} based on the period ${period}`,
34 |         shortTitle: "Profit",
35 |       };
36 |     case "revenue":
37 |       return {
38 |         title: `Revenue for ${data.team.name} (${period})`,
39 |         description: `Revenue for ${data.team.name} based on the period ${period}`,
40 |         shortTitle: "Revenue",
41 |       };
42 |     case "burn_rate":
43 |       return {
44 |         title: `Burn rate for ${data.team.name} (${period})`,
45 |         description: `Burn rate for ${data.team.name} based on the period ${period}`,
46 |         shortTitle: "Burn rate",
47 |       };
48 |     case "expense":
49 |       return {
50 |         title: `Expense report for ${data.team.name} (${period})`,
51 |         description: `Expense report for ${data.team.name} based on the period ${period}`,
52 |         shortTitle: "Expense report",
53 |       };
54 |
55 |     default:
56 |       return {};
57 |   }
58 | }
59 |
60 | export async function generateMetadata({ params }): Promise<Metadata> {
61 |   const supabase = createClient({ admin: true });
62 |
63 |   const { data, error } = await supabase
64 |     .from("reports")
65 |     .select("*, team:team_id(name)")
66 |     .eq("id", params.id)
67 |     .single();
68 |
69 |   if (error) {
70 |     return {};
71 |   }
72 |
73 |   return {
74 |     ...getReportMeta(data),
75 |     robots: {
76 |       index: false,
77 |     },
78 |   };
79 | }
80 |
81 | export default async function Report({ params }) {
82 |   const supabase = createClient({ admin: true });
83 |
84 |   const { data, error } = await supabase
85 |     .from("reports")
86 |     .select("*, team:team_id(name)")
87 |     .eq("id", params.id)
88 |     .single();
89 |
90 |   if (error) {
91 |     return notFound();
92 |   }
93 |
94 |   async function getContent() {
95 |     switch (data?.type) {
96 |       case "profit":
97 |       case "revenue": {
98 |         const metricsData = await getMetricsQuery(supabase, {
99 |           teamId: data.team_id,
100 |           from: data.from,
101 |           to: data.to,
102 |           type: data.type,
103 |           currency: data.currency,
104 |         });
105 |
106 |         return (
107 |           <>
108 |             <div className="flex flex-col space-y-2 items-start mb-16">
109 |               <div>
110 |                 <h1 className="text-4xl font-mono">
111 |                   <FormatAmount
112 |                     amount={metricsData.summary.currentTotal}
113 |                     currency={metricsData.summary.currency}
114 |                   />
115 |                 </h1>
116 |               </div>
117 |               <div className="text-[#878787]">
118 |                 {format(new Date(data.from), "LLL dd, y")} -{" "}
119 |                 {format(new Date(data.to), "LLL dd, y")}
120 |               </div>
121 |             </div>
122 |
123 |             <BarChart data={metricsData} currency={data.currency} />
124 |           </>
125 |         );
126 |       }
127 |       case "burn_rate": {
128 |         const [{ data: burnRateData }, { data: runway }] = await Promise.all([
129 |           getBurnRateQuery(supabase, {
130 |             teamId: data.team_id,
131 |             from: data.from,
132 |             to: data.to,
133 |             type: data.type,
134 |             currency: data.currency,
135 |           }),
136 |           getRunwayQuery(supabase, {
137 |             teamId: data.team_id,
138 |             from: data.from,
139 |             to: data.to,
140 |             type: data.type,
141 |             currency: data.currency,
142 |           }),
143 |         ]);
144 |
145 |         return (
146 |           <>
147 |             <div className="flex flex-col space-y-2 items-start mb-16">
148 |               <div>
149 |                 <h1 className="text-4xl font-mono">
150 |                   <FormatAmount
151 |                     amount={calculateAvgBurnRate(burnRateData)}
152 |                     currency={data.currency}
153 |                   />
154 |                 </h1>
155 |               </div>
[TRUNCATED]
```

apps/dashboard/src/app/api/apps/slack/events/route.ts
```
1 | import {
2 |   config,
3 |   handleSlackEvent,
4 |   verifySlackRequest,
5 | } from "@midday/app-store/slack";
6 | import { createClient } from "@midday/supabase/server";
7 | import { headers } from "next/headers";
8 | import { NextResponse } from "next/server";
9 |
10 | export async function POST(req: Request) {
11 |   const rawBody = await req.text();
12 |
13 |   const { challenge, team_id, event } = JSON.parse(rawBody);
14 |
15 |   if (challenge) {
16 |     return new NextResponse(challenge);
17 |   }
18 |
19 |   try {
20 |     verifySlackRequest({
21 |       signingSecret: process.env.SLACK_SIGNING_SECRET!,
22 |       body: rawBody,
23 |       // @ts-expect-error - headers are not typed
24 |       headers: Object.fromEntries(headers().entries()),
25 |     });
26 |   } catch (error) {
27 |     console.error("Slack request verification failed:", error);
28 |     return NextResponse.json(
29 |       { error: "Invalid Slack request" },
30 |       { status: 401 },
31 |     );
32 |   }
33 |
34 |   // We don't need to handle message_deleted events
35 |   if (event?.type === "message_deleted") {
36 |     return NextResponse.json({
37 |       success: true,
38 |     });
39 |   }
40 |
41 |   const supabase = createClient({ admin: true });
42 |
43 |   const { data } = await supabase
44 |     .from("apps")
45 |     .select("team_id, config")
46 |     .eq("app_id", config.id)
47 |     .eq("config->>team_id", team_id)
48 |     .single();
49 |
50 |   if (!data) {
51 |     return NextResponse.json(
52 |       { error: "Unauthorized: No matching team found" },
53 |       { status: 401 },
54 |     );
55 |   }
56 |
57 |   if (event) {
58 |     await handleSlackEvent(event, {
59 |       token: data?.config.access_token,
60 |       teamId: data.team_id,
61 |     });
62 |   }
63 |
64 |   return NextResponse.json({
65 |     success: true,
66 |   });
67 | }
```

apps/dashboard/src/app/api/apps/slack/install-url/route.ts
```
1 | import { getInstallUrl } from "@midday/app-store/slack";
2 | import { getUser } from "@midday/supabase/cached-queries";
3 | import { NextResponse } from "next/server";
4 |
5 | export async function GET() {
6 |   const { data } = await getUser();
7 |
8 |   if (!data) {
9 |     return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
10 |   }
11 |
12 |   const url = await getInstallUrl({
13 |     teamId: data.team_id,
14 |     userId: data.id,
15 |   });
16 |
17 |   return NextResponse.json({
18 |     url,
19 |   });
20 | }
```

apps/dashboard/src/app/api/apps/slack/interactive/route.ts
```
1 | export async function POST() {
2 |   return new Response(null, { status: 200 });
3 | }
```

apps/dashboard/src/app/api/apps/slack/oauth_callback/route.ts
```
1 | import { createApp } from "@midday/app-store/db";
2 | import {
3 |   config,
4 |   createSlackApp,
5 |   slackInstaller,
6 | } from "@midday/app-store/slack";
7 | import { type NextRequest, NextResponse } from "next/server";
8 | import { z } from "zod";
9 |
10 | const paramsSchema = z.object({
11 |   code: z.string(),
12 |   state: z.string(),
13 | });
14 |
15 | const metadataSchema = z.object({
16 |   teamId: z.string(),
17 |   userId: z.string(),
18 | });
19 |
20 | const slackAuthResponseSchema = z.object({
21 |   ok: z.literal(true),
22 |   app_id: z.string(),
23 |   authed_user: z.object({
24 |     id: z.string(),
25 |   }),
26 |   scope: z.string(),
27 |   token_type: z.literal("bot"),
28 |   access_token: z.string(),
29 |   bot_user_id: z.string(),
30 |   team: z.object({
31 |     id: z.string(),
32 |     name: z.string(),
33 |   }),
34 |   incoming_webhook: z.object({
35 |     channel: z.string(),
36 |     channel_id: z.string(),
37 |     configuration_url: z.string().url(),
38 |     url: z.string().url(),
39 |   }),
40 | });
41 |
42 | export async function GET(request: NextRequest) {
43 |   const requestUrl = new URL(request.url);
44 |
45 |   const rawParams = Object.fromEntries(requestUrl.searchParams.entries());
46 |   const parsedParams = paramsSchema.safeParse(rawParams);
47 |
48 |   if (!parsedParams.success) {
49 |     console.error("Invalid params", parsedParams.error.errors);
50 |     return NextResponse.json({ error: "Invalid params" }, { status: 400 });
51 |   }
52 |
53 |   const veryfiedState = await slackInstaller.stateStore?.verifyStateParam(
54 |     new Date(),
55 |     parsedParams.data.state,
56 |   );
57 |   const parsedMetadata = metadataSchema.safeParse(
58 |     JSON.parse(veryfiedState?.metadata ?? "{}"),
59 |   );
60 |
61 |   if (!parsedMetadata.success) {
62 |     console.error("Invalid metadata", parsedMetadata.error.errors);
63 |     return NextResponse.json({ error: "Invalid metadata" }, { status: 400 });
64 |   }
65 |
66 |   try {
67 |     const slackOauthAccessUrl = [
68 |       "https://slack.com/api/oauth.v2.access",
69 |       `?client_id=${process.env.NEXT_PUBLIC_SLACK_CLIENT_ID}`,
70 |       `&client_secret=${process.env.SLACK_CLIENT_SECRET}`,
71 |       `&code=${parsedParams.data.code}`,
72 |       `&redirect_uri=${process.env.NEXT_PUBLIC_SLACK_OAUTH_REDIRECT_URL}`,
73 |     ].join("");
74 |
75 |     const response = await fetch(slackOauthAccessUrl);
76 |     const json = await response.json();
77 |
78 |     const parsedJson = slackAuthResponseSchema.safeParse(json);
79 |
80 |     if (!parsedJson.success) {
81 |       console.error(
82 |         "Invalid JSON response from slack",
83 |         parsedJson.error.errors,
84 |       );
85 |       return NextResponse.json(
86 |         { error: "Failed to exchange code for token" },
87 |         { status: 500 },
88 |       );
89 |     }
90 |
91 |     const createdSlackIntegration = await createApp({
92 |       team_id: parsedMetadata.data.teamId,
93 |       created_by: parsedMetadata.data.userId,
94 |       app_id: config.id,
95 |       settings: config.settings,
96 |       config: {
97 |         access_token: parsedJson.data.access_token,
98 |         team_id: parsedJson.data.team.id,
99 |         team_name: parsedJson.data.team.name,
100 |         channel: parsedJson.data.incoming_webhook.channel,
101 |         channel_id: parsedJson.data.incoming_webhook.channel_id,
102 |         slack_configuration_url:
103 |           parsedJson.data.incoming_webhook.configuration_url,
104 |         url: parsedJson.data.incoming_webhook.url,
105 |         bot_user_id: parsedJson.data.bot_user_id,
106 |       },
107 |     });
108 |
109 |     if (createdSlackIntegration) {
110 |       const slackApp = createSlackApp({
111 |         token: createdSlackIntegration.config.access_token,
112 |         botId: createdSlackIntegration.config.bot_user_id,
113 |       });
114 |
115 |       try {
116 |         await slackApp.client.chat.postMessage({
117 |           channel: createdSlackIntegration.config.channel_id,
118 |           unfurl_links: false,
119 |           unfurl_media: false,
120 |           blocks: [
121 |             {
122 |               type: "section",
123 |               text: {
124 |                 type: "mrkdwn",
125 |                 text: "Hello there! 👋 I'm your new Midday bot, I'll send notifications in this channel regarding new transactions and other important updates.\n\n Head over to the <slack://app?id=A07PN48FW3A&tab=home|Midday Assistant> to ask questions.",
126 |               },
127 |             },
128 |             {
129 |               type: "divider",
130 |             },
131 |             {
132 |               type: "context",
133 |               elements: [
134 |                 {
135 |                   type: "mrkdwn",
136 |                   text: "<https://app.midday.ai/apps?app=slack&settings=true|Notification settings>",
137 |                 },
138 |               ],
139 |             },
140 |           ],
141 |         });
142 |       } catch (err) {
143 |         console.error(err);
144 |       }
145 |
146 |       const requestUrl = new URL(request.url);
147 |
148 |       if (process.env.NODE_ENV === "development") {
149 |         requestUrl.protocol = "http";
150 |       }
151 |
152 |       // This window will be in a popup so we redirect to the all-done route which closes the window
[TRUNCATED]
```

apps/dashboard/src/app/api/webhook/cache/revalidate/route.ts
```
1 | import { revalidateTag } from "next/cache";
2 | import { NextResponse } from "next/server";
3 | import { z } from "zod";
4 |
5 | const schema = z.object({
6 |   tag: z.enum(["bank"]),
7 |   id: z.string(),
8 | });
9 |
10 | const cacheTags = {
11 |   bank: [
12 |     "transactions",
13 |     "bank_connections",
14 |     "bank_accounts",
15 |     "insights",
16 |     "spending",
17 |     "bank_accounts_currencies",
18 |     "bank_accounts_balances",
19 |     "metrics",
20 |     "expenses",
21 |     "burn_rate",
22 |     "runway",
23 |   ],
24 |   vault: ["vault"],
25 | } as const;
26 |
27 | export async function POST(req: Request) {
28 |   const authHeader = req.headers.get("Authorization");
29 |   const apiKey = authHeader?.split("Bearer ")?.at(1);
30 |
31 |   if (apiKey !== process.env.MIDDAY_CACHE_API_SECRET) {
32 |     return NextResponse.json(
33 |       { error: "Unauthorized request" },
34 |       { status: 401 },
35 |     );
36 |   }
37 |
38 |   const parsedBody = schema.safeParse(await req.json());
39 |
40 |   if (!parsedBody.success) {
41 |     return NextResponse.json(
42 |       { error: "Invalid request body" },
43 |       { status: 400 },
44 |     );
45 |   }
46 |
47 |   const { tag, id } = parsedBody.data;
48 |
49 |   if (!(tag in cacheTags)) {
50 |     return NextResponse.json({ error: "Invalid tag" }, { status: 400 });
51 |   }
52 |
53 |   for (const cacheTag of cacheTags[tag]) {
54 |     revalidateTag(`${cacheTag}_${id}`);
55 |   }
56 |
57 |   return NextResponse.json({ success: true });
58 | }
```

apps/dashboard/src/app/[locale]/(app)/(sidebar)/account/assistant/page.tsx
```
1 | import { getAssistantSettings } from "@/actions/ai/storage";
2 | import { AssistantHistory } from "@/components/assistant-history";
3 | import type { Metadata } from "next";
4 |
5 | export const metadata: Metadata = {
6 |   title: "Assistant | Midday",
7 | };
8 |
9 | export default async function Page() {
10 |   const settings = await getAssistantSettings();
11 |
12 |   return (
13 |     <div className="space-y-12">
14 |       <AssistantHistory enabled={settings?.enabled} />
15 |     </div>
16 |   );
17 | }
```

apps/dashboard/src/app/[locale]/(app)/(sidebar)/account/date-and-locale/page.tsx
```
1 | import { ChangeTimezone } from "@/components/change-timezone";
2 | import { DateFormatSettings } from "@/components/date-format-settings";
3 | import { LocaleSettings } from "@/components/locale-settings";
4 | import { TimeFormatSettings } from "@/components/time-format-settings";
5 | import { WeekSettings } from "@/components/week-settings";
6 | import { getTimezones } from "@midday/location";
7 | import { getUser } from "@midday/supabase/cached-queries";
8 | import type { Metadata } from "next";
9 |
10 | export const metadata: Metadata = {
11 |   title: "Date & Locale | Midday",
12 | };
13 |
14 | export default async function Page() {
15 |   const { data: userData } = await getUser();
16 |
17 |   const timezones = getTimezones();
18 |
19 |   return (
20 |     <div className="space-y-12">
21 |       <LocaleSettings locale={userData?.locale} />
22 |       <ChangeTimezone timezone={userData?.timezone} timezones={timezones} />
23 |       <TimeFormatSettings timeFormat={userData?.time_format} />
24 |       <DateFormatSettings dateFormat={userData?.date_format} />
25 |       <WeekSettings weekStartsOnMonday={userData?.week_starts_on_monday} />
26 |     </div>
27 |   );
28 | }
```

apps/dashboard/src/app/[locale]/(app)/(sidebar)/account/security/page.tsx
```
1 | import { MfaSettingsList } from "@/components/mfa-settings-list";
2 | import { AddNewDeviceModal } from "@/components/modals/add-new-device";
3 | import type { Metadata } from "next";
4 |
5 | export const metadata: Metadata = {
6 |   title: "Security | Midday",
7 | };
8 |
9 | export default async function Security() {
10 |   return (
11 |     <div className="space-y-12">
12 |       <MfaSettingsList />
13 |       <AddNewDeviceModal />
14 |     </div>
15 |   );
16 | }
```

apps/dashboard/src/app/[locale]/(app)/(sidebar)/account/support/page.tsx
```
1 | import { SupportForm } from "@/components/support-form";
2 | import { getUser } from "@midday/supabase/cached-queries";
3 | import type { Metadata } from "next";
4 |
5 | export const metadata: Metadata = {
6 |   title: "Support | Midday",
7 | };
8 |
9 | export default async function Support() {
10 |   const { data: userData } = await getUser();
11 |
12 |   return (
13 |     <div className="space-y-12">
14 |       <div className="max-w-[450px]">
15 |         <SupportForm
16 |           email={userData.email}
17 |           avatarUrl={userData.avatar_url}
18 |           fullName={userData.full_name}
19 |           teamName={userData.team.name}
20 |         />
21 |       </div>
22 |     </div>
23 |   );
24 | }
```

apps/dashboard/src/app/[locale]/(app)/(sidebar)/account/teams/page.tsx
```
1 | import { TeamsTable } from "@/components/tables/teams";
2 | import { TeamsSkeleton } from "@/components/tables/teams/table";
3 | import type { Metadata } from "next";
4 | import { Suspense } from "react";
5 |
6 | export const metadata: Metadata = {
7 |   title: "Teams | Midday",
8 | };
9 |
10 | export default function Teams() {
11 |   return (
12 |     <Suspense fallback={<TeamsSkeleton />}>
13 |       <TeamsTable />
14 |     </Suspense>
15 |   );
16 | }
```

apps/dashboard/src/app/[locale]/(app)/(sidebar)/settings/accounts/page.tsx
```
1 | import { BaseCurrency } from "@/components/base-currency/base-currency";
2 | import { ConnectedAccounts } from "@/components/connected-accounts";
3 | import type { Metadata } from "next";
4 |
5 | export const metadata: Metadata = {
6 |   title: "Accounts | Midday",
7 | };
8 |
9 | export default function Page() {
10 |   return (
11 |     <div className="space-y-12">
12 |       <ConnectedAccounts />
13 |       <BaseCurrency />
14 |     </div>
15 |   );
16 | }
```

apps/dashboard/src/app/[locale]/(app)/(sidebar)/settings/billing/page.tsx
```
1 | import { Metadata } from "next";
2 |
3 | export const metadata: Metadata = {
4 |   title: "Billing | Midday",
5 | };
6 |
7 | export default async function Billing() {
8 |   return (
9 |     <div className="space-y-12">
10 |       <div>Plan</div>
11 |       <div>Payment Method</div>
12 |       <div>Add-Ons</div>
13 |       <div>Billing Address</div>
14 |     </div>
15 |   );
16 | }
```

apps/dashboard/src/app/[locale]/(app)/(sidebar)/settings/categories/page.tsx
```
1 | import { CategoriesTable } from "@/components/tables/categories";
2 | import { CategoriesSkeleton } from "@/components/tables/categories/skeleton";
3 | import type { Metadata } from "next";
4 | import { Suspense } from "react";
5 |
6 | export const metadata: Metadata = {
7 |   title: "Categories | Midday",
8 | };
9 |
10 | export default function Categories() {
11 |   return (
12 |     <Suspense fallback={<CategoriesSkeleton />}>
13 |       <CategoriesTable />
14 |     </Suspense>
15 |   );
16 | }
```

apps/dashboard/src/app/[locale]/(app)/(sidebar)/settings/members/page.tsx
```
1 | import { TeamMembers } from "@/components/team-members";
2 | import type { Metadata } from "next";
3 |
4 | export const metadata: Metadata = {
5 |   title: "Members | Midday",
6 | };
7 |
8 | export default async function Members() {
9 |   return <TeamMembers />;
10 | }
```

apps/dashboard/src/app/[locale]/(app)/(sidebar)/settings/notifications/page.tsx
```
1 | import { NotificationsSettingsList } from "@/components/notifications-settings-list";
2 | import type { Metadata } from "next";
3 | import { Suspense } from "react";
4 |
5 | export const metadata: Metadata = {
6 |   title: "Notifications | Midday",
7 | };
8 |
9 | export default async function Notifications() {
10 |   return (
11 |     <Suspense>
12 |       <NotificationsSettingsList />
13 |     </Suspense>
14 |   );
15 | }
```

apps/dashboard/src/app/[locale]/(app)/(sidebar)/settings/team/page.tsx
```
1 | import { Metadata } from "next";
2 |
3 | export const metadata: Metadata = {
4 |   title: "Team | Midday",
5 | };
6 |
7 | export default async function Team() {
8 |   return null;
9 | }
```

apps/dashboard/src/app/[locale]/(app)/(sidebar)/vault/[[...folders]]/page.tsx
```
1 | import { Table } from "@/components/tables/vault";
2 | import { searchParamsCache } from "@/components/tables/vault/search-params";
3 | import type { Metadata } from "next";
4 |
5 | export const metadata: Metadata = {
6 |   title: "Vault | Midday",
7 | };
8 |
9 | type Props = {
10 |   searchParams: { [key: string]: string | string[] | undefined };
11 |   params: {
12 |     folders: string[];
13 |     q?: string;
14 |     owners?: string;
15 |     start?: string;
16 |     end?: string;
17 |   };
18 | };
19 |
20 | export default function Vault({ params, searchParams }: Props) {
21 |   const disableActions = [
22 |     "exports",
23 |     "inbox",
24 |     "imports",
25 |     "transactions",
26 |     "invoices",
27 |   ].includes(params.folders?.[0] ?? "");
28 |
29 |   const filter = searchParamsCache.parse(searchParams);
30 |
31 |   return (
32 |     <Table
33 |       folders={params.folders ?? []}
34 |       disableActions={disableActions}
35 |       filter={filter}
36 |     />
37 |   );
38 | }
```

apps/dashboard/src/app/[locale]/(app)/teams/invite/[code]/page.tsx
```
1 | import { SignOutButton } from "@/components/sign-out-button";
2 | import { UserMenu } from "@/components/user-menu";
3 | import { joinTeamByInviteCode } from "@midday/supabase/mutations";
4 | import { createClient } from "@midday/supabase/server";
5 | import { Button } from "@midday/ui/button";
6 | import { Icons } from "@midday/ui/icons";
7 | import type { Metadata } from "next";
8 | import { revalidateTag } from "next/cache";
9 | import Link from "next/link";
10 | import { redirect } from "next/navigation";
11 | import { Suspense } from "react";
12 |
13 | export const metadata: Metadata = {
14 |   title: "Join team | Midday",
15 | };
16 |
17 | export default async function InviteCode({
18 |   params,
19 | }: { params: { code: string } }) {
20 |   const supabase = createClient();
21 |   const { code } = params;
22 |
23 |   if (code) {
24 |     const user = await joinTeamByInviteCode(supabase, code);
25 |
26 |     if (user) {
27 |       revalidateTag(`user_${user.id}`);
28 |       revalidateTag(`teams_${user.id}`);
29 |
30 |       if (!user.full_name) {
31 |         redirect("/setup");
32 |       }
33 |
34 |       redirect("/");
35 |     }
36 |   }
37 |
38 |   return (
39 |     <div>
40 |       <header className="w-full absolute left-0 right-0 flex justify-between items-center">
41 |         <div className="ml-5 mt-4 md:ml-10 md:mt-10">
42 |           <Link href="/">
43 |             <Icons.Logo />
44 |           </Link>
45 |         </div>
46 |
47 |         <div className="mr-5 mt-4 md:mr-10 md:mt-10">
48 |           <Suspense>
49 |             <UserMenu onlySignOut />
50 |           </Suspense>
51 |         </div>
52 |       </header>
53 |
54 |       <div className="flex min-h-screen justify-center items-center overflow-hidden p-6 md:p-0">
55 |         <div className="relative z-20 m-auto flex w-full max-w-[380px] flex-col">
56 |           <div className="flex w-full flex-col relative">
57 |             <div className="pb-4">
58 |               <h1 className="font-medium pb-1 text-3xl">
59 |                 {" "}
60 |                 This invite link is not associated with your current account.
61 |               </h1>
62 |             </div>
63 |
64 |             <p className="text-sm text-[#606060] mt-2">
65 |               Please sign in with the email address that received the invite, or
66 |               contact the team admin for assistance.
67 |             </p>
68 |
69 |             <div className="pointer-events-auto mt-6 flex flex-col mb-4 space-y-4">
70 |               <SignOutButton />
71 |               <Link href="/teams" className="w-full">
72 |                 <Button className="w-full">Go to teams</Button>
73 |               </Link>
74 |             </div>
75 |           </div>
76 |         </div>
77 |       </div>
78 |     </div>
79 |   );
80 | }
```
