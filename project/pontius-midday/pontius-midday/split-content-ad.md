opover>
54 |     </div>
55 |   );
56 | }
```

apps/dashboard/src/components/invoice/edit-block.tsx
```
1 | "use client";
2 |
3 | import type { InvoiceFormValues } from "@/actions/invoice/schema";
4 | import { cn } from "@midday/ui/cn";
5 | import { Controller, useFormContext } from "react-hook-form";
6 | import { Editor } from "./editor";
7 |
8 | type Props = {
9 |   name: keyof InvoiceFormValues;
10 | };
11 |
12 | export function EditBlock({ name }: Props) {
13 |   const { control, watch } = useFormContext();
14 |   const id = watch("id");
15 |
16 |   return (
17 |     <div className="group">
18 |       <Controller
19 |         name={name}
20 |         control={control}
21 |         render={({ field }) => (
22 |           <Editor
23 |             // NOTE: This is a workaround to get the new content to render
24 |             key={id}
25 |             tabIndex={-1}
26 |             initialContent={field.value}
27 |             onChange={field.onChange}
28 |             placeholder="Write something..."
29 |             disablePlaceholder
30 |             className={cn(
31 |               "transition-opacity",
32 |               field.value ? "opacity-100" : "opacity-0 group-hover:opacity-100",
33 |             )}
34 |           />
35 |         )}
36 |       />
37 |     </div>
38 |   );
39 | }
```

apps/dashboard/src/components/invoice/editor.tsx
```
1 | "use client";
2 |
3 | import { cn } from "@midday/ui/cn";
4 | import { Editor as BaseEditor } from "@midday/ui/editor";
5 | import type { Editor as EditorInstance, JSONContent } from "@tiptap/react";
6 | import { useCallback, useState } from "react";
7 |
8 | type Props = {
9 |   initialContent?: JSONContent;
10 |   className?: string;
11 |   onChange?: (content?: JSONContent | null) => void;
12 |   onBlur?: (content: JSONContent | null) => void;
13 |   placeholder?: string;
14 |   disablePlaceholder?: boolean;
15 |   tabIndex?: number;
16 | };
17 |
18 | export function Editor({
19 |   initialContent,
20 |   className,
21 |   onChange,
22 |   onBlur,
23 |   placeholder,
24 |   disablePlaceholder = false,
25 |   tabIndex,
26 | }: Props) {
27 |   const [isFocused, setIsFocused] = useState(false);
28 |   const [content, setContent] = useState<JSONContent | null | undefined>(
29 |     initialContent,
30 |   );
31 |
32 |   const handleUpdate = useCallback(
33 |     (editor: EditorInstance) => {
34 |       const json = editor.getJSON();
35 |       const newIsEmpty = editor.state.doc.textContent.length === 0;
36 |
37 |       setContent(newIsEmpty ? null : json);
38 |       onChange?.(newIsEmpty ? null : json);
39 |     },
40 |     [onChange],
41 |   );
42 |
43 |   const handleBlur = useCallback(() => {
44 |     setIsFocused(false);
45 |
46 |     // Only call onBlur if the content has changed
47 |     if (content !== initialContent) {
48 |       onBlur?.(content ?? null);
49 |     }
50 |     onBlur?.(content ?? null);
51 |   }, [content, onBlur]);
52 |
53 |   const showPlaceholder = !disablePlaceholder && !content && !isFocused;
54 |
55 |   return (
56 |     <BaseEditor
57 |       className={cn(
58 |         "font-mono text-[11px] text-primary leading-[18px] invoice-editor",
59 |         showPlaceholder &&
60 |           "w-full bg-[repeating-linear-gradient(-60deg,#DBDBDB,#DBDBDB_1px,transparent_1px,transparent_5px)] dark:bg-[repeating-linear-gradient(-60deg,#2C2C2C,#2C2C2C_1px,transparent_1px,transparent_5px)]",
61 |         className,
62 |       )}
63 |       placeholder={placeholder}
64 |       initialContent={content ?? undefined}
65 |       onUpdate={handleUpdate}
66 |       onFocus={() => setIsFocused(true)}
67 |       onBlur={handleBlur}
68 |       tabIndex={tabIndex}
69 |     />
70 |   );
71 | }
```

apps/dashboard/src/components/invoice/form-context.tsx
```
1 | "use client";
2 |
3 | import {
4 |   type InvoiceFormValues,
5 |   type InvoiceTemplate,
6 |   invoiceFormSchema,
7 | } from "@/actions/invoice/schema";
8 | import { useInvoiceParams } from "@/hooks/use-invoice-params";
9 | import { UTCDate } from "@date-fns/utc";
10 | import { zodResolver } from "@hookform/resolvers/zod";
11 | import type { Settings } from "@midday/invoice/default";
12 | import { createClient } from "@midday/supabase/client";
13 | import { getDraftInvoiceQuery } from "@midday/supabase/queries";
14 | import { addMonths } from "date-fns";
15 | import { useEffect, useState } from "react";
16 | import { FormProvider, useForm } from "react-hook-form";
17 | import { v4 as uuidv4 } from "uuid";
18 |
19 | const defaultTemplate: InvoiceTemplate = {
20 |   title: "Invoice",
21 |   customer_label: "To",
22 |   from_label: "From",
23 |   invoice_no_label: "Invoice No",
24 |   issue_date_label: "Issue Date",
25 |   due_date_label: "Due Date",
26 |   description_label: "Description",
27 |   price_label: "Price",
28 |   quantity_label: "Quantity",
29 |   total_label: "Total",
30 |   total_summary_label: "Total",
31 |   subtotal_label: "Subtotal",
32 |   vat_label: "VAT",
33 |   tax_label: "Tax",
34 |   payment_label: "Payment Details",
35 |   payment_details: undefined,
36 |   note_label: "Note",
37 |   logo_url: undefined,
38 |   currency: "USD",
39 |   from_details: undefined,
40 |   size: "a4",
41 |   include_vat: true,
42 |   include_tax: true,
43 |   discount_label: "Discount",
44 |   include_discount: false,
45 |   include_units: false,
46 |   include_decimals: false,
47 |   include_qr: true,
48 |   date_format: "dd/MM/yyyy",
49 |   tax_rate: 0,
50 |   vat_rate: 0,
51 |   delivery_type: "create",
52 |   timezone: undefined,
53 | };
54 |
55 | type FormContextProps = {
56 |   id?: string | null;
57 |   children: React.ReactNode;
58 |   template: InvoiceTemplate;
59 |   invoiceNumber: string;
60 |   defaultSettings: Settings;
61 |   isOpen: boolean;
62 | };
63 |
64 | export function FormContext({
65 |   id,
66 |   children,
67 |   template,
68 |   defaultSettings,
69 |   isOpen,
70 |   invoiceNumber,
71 | }: FormContextProps) {
72 |   const supabase = createClient();
73 |   const { lineItems, currency } = useInvoiceParams();
74 |   const [isLoading, setLoading] = useState(false);
75 |
76 |   const defaultValues = {
77 |     id: uuidv4(),
78 |     template: {
79 |       ...defaultTemplate,
80 |       size: defaultSettings.size ?? defaultTemplate.size,
81 |       include_tax: defaultSettings.include_tax ?? defaultTemplate.include_tax,
82 |       include_vat: defaultSettings.include_vat ?? defaultTemplate.include_vat,
83 |       locale: defaultSettings.locale,
84 |       // Use user timezone
85 |       timezone: defaultSettings.timezone,
86 |       ...template,
87 |     },
88 |     customer_details: undefined,
89 |     from_details: template.from_details ?? defaultTemplate.from_details,
90 |     payment_details:
91 |       template.payment_details ?? defaultTemplate.payment_details,
92 |     note_details: undefined,
93 |     customer_id: undefined,
94 |     issue_date: new UTCDate(),
95 |     due_date: addMonths(new UTCDate(), 1),
96 |     invoice_number: invoiceNumber,
97 |     line_items: [{ name: "", quantity: 0, price: 0, vat: 0 }],
98 |     tax: undefined,
99 |     token: undefined,
100 |     discount: undefined,
101 |     subtotal: undefined,
102 |     status: "draft",
103 |     top_block: undefined,
104 |     bottom_block: undefined,
105 |   };
106 |
107 |   const form = useForm<InvoiceFormValues>({
108 |     resolver: zodResolver(invoiceFormSchema),
109 |     defaultValues,
110 |     mode: "onChange",
111 |   });
112 |
113 |   useEffect(() => {
114 |     if (!isOpen) {
115 |       form.reset(defaultValues);
116 |     }
117 |   }, [isOpen]);
118 |
119 |   useEffect(() => {
120 |     async function fetchInvoice() {
121 |       const { data } = await getDraftInvoiceQuery(supabase, id);
122 |
123 |       if (data) {
124 |         form.reset({
125 |           ...data,
126 |           template: {
127 |             ...defaultValues.template,
128 |             ...data.template,
129 |           },
130 |         });
131 |       }
132 |
133 |       setLoading(false);
134 |     }
135 |
136 |     if (id) {
137 |       setLoading(true);
138 |       fetchInvoice();
139 |     }
140 |   }, [id, isOpen]);
141 |
142 |   // These values comes from the tracker table
143 |   useEffect(() => {
144 |     if (lineItems) {
145 |       form.setValue("line_items", lineItems);
146 |     }
147 |   }, [lineItems]);
148 |
149 |   useEffect(() => {
150 |     if (currency) {
151 |       form.setValue("template.currency", currency);
152 |     }
153 |   }, [currency]);
154 |
155 |   if (isLoading) {
156 |     return null;
157 |   }
158 |
159 |   return <FormProvider {...form}>{children}</FormProvider>;
160 | }
```

apps/dashboard/src/components/invoice/form.tsx
```
1 | import { draftInvoiceAction } from "@/actions/invoice/draft-invoice-action";
2 | import type { InvoiceFormValues } from "@/actions/invoice/schema";
3 | import { formatRelativeTime } from "@/utils/format";
4 | import { Icons } from "@midday/ui/icons";
5 | import { ScrollArea } from "@midday/ui/scroll-area";
6 | import { useDebounce } from "@uidotdev/usehooks";
7 | import { useAction } from "next-safe-action/hooks";
8 | import { useEffect, useState } from "react";
9 | import { useFormContext, useWatch } from "react-hook-form";
10 | import { OpenURL } from "../open-url";
11 | import { type Customer, CustomerDetails } from "./customer-details";
12 | import { EditBlock } from "./edit-block";
13 | import { FromDetails } from "./from-details";
14 | import { LineItems } from "./line-items";
15 | import { Logo } from "./logo";
16 | import { Meta } from "./meta";
17 | import { NoteDetails } from "./note-details";
18 | import { PaymentDetails } from "./payment-details";
19 | import { SubmitButton } from "./submit-button";
20 | import { Summary } from "./summary";
21 | import { transformFormValuesToDraft } from "./utils";
22 |
23 | type Props = {
24 |   teamId: string;
25 |   customers: Customer[];
26 |   updatedAt?: Date;
27 |   onSubmit: (values: InvoiceFormValues) => void;
28 |   isSubmitting: boolean;
29 | };
30 |
31 | export function Form({ teamId, customers, onSubmit, isSubmitting }: Props) {
32 |   const [lastUpdated, setLastUpdated] = useState<Date | undefined>();
33 |   const [lastEditedText, setLastEditedText] = useState("");
34 |
35 |   const form = useFormContext<InvoiceFormValues>();
36 |
37 |   const token = form.watch("token");
38 |
39 |   const draftInvoice = useAction(draftInvoiceAction, {
40 |     onSuccess: ({ data }) => {
41 |       setLastUpdated(new Date());
42 |       form.setValue("token", data?.token, { shouldValidate: true });
43 |     },
44 |   });
45 |
46 |   // Only watch the fields that are used in the upsert action
47 |   const formValues = useWatch({
48 |     control: form.control,
49 |     name: [
50 |       "customer_details",
51 |       "customer_id",
52 |       "customer_name",
53 |       "template",
54 |       "line_items",
55 |       "amount",
56 |       "vat",
57 |       "tax",
58 |       "due_date",
59 |       "issue_date",
60 |       "note_details",
61 |       "payment_details",
62 |       "from_details",
63 |       "invoice_number",
64 |       "top_block",
65 |       "bottom_block",
66 |     ],
67 |   });
68 |
69 |   const isDirty = form.formState.isDirty;
70 |   const invoiceNumberValid = !form.getFieldState("invoice_number").error;
71 |   const debouncedValues = useDebounce(formValues, 500);
72 |
73 |   useEffect(() => {
74 |     const currentFormValues = form.getValues();
75 |
76 |     // Only draft the invoice if the customer is selected and the invoice number is valid
77 |     if (isDirty && form.watch("customer_id") && invoiceNumberValid) {
78 |       draftInvoice.execute(transformFormValuesToDraft(currentFormValues));
79 |     }
80 |   }, [debouncedValues, isDirty, invoiceNumberValid]);
81 |
82 |   useEffect(() => {
83 |     const updateLastEditedText = () => {
84 |       if (!lastUpdated) {
85 |         setLastEditedText("");
86 |         return;
87 |       }
88 |
89 |       setLastEditedText(`Edited ${formatRelativeTime(lastUpdated)}`);
90 |     };
91 |
92 |     updateLastEditedText();
93 |     const intervalId = setInterval(updateLastEditedText, 1000);
94 |
95 |     return () => clearInterval(intervalId);
96 |   }, [lastUpdated]);
97 |
98 |   // Submit the form and the draft invoice
99 |   const handleSubmit = (values: InvoiceFormValues) => {
100 |     onSubmit(values);
101 |
102 |     draftInvoice.execute(transformFormValuesToDraft(values));
103 |   };
104 |
105 |   // Prevent form from submitting when pressing enter
106 |   const handleKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
107 |     if (e.key === "Enter") {
108 |       e.preventDefault();
109 |     }
110 |   };
111 |
112 |   return (
113 |     <form
114 |       onSubmit={form.handleSubmit(handleSubmit)}
115 |       className="relative h-full"
116 |       onKeyDown={handleKeyDown}
117 |     >
118 |       <ScrollArea className="h-[calc(100vh-200px)] bg-background" hideScrollbar>
119 |         <div className="p-8 pb-4 h-full flex flex-col">
120 |           <div className="flex justify-between">
121 |             <Meta teamId={teamId} />
122 |             <Logo teamId={teamId} />
123 |           </div>
124 |
125 |           <div className="grid grid-cols-2 gap-6 mt-8 mb-4">
126 |             <div>
127 |               <FromDetails />
128 |             </div>
129 |             <div>
130 |               <CustomerDetails customers={customers} />
131 |             </div>
132 |           </div>
133 |
134 |           <EditBlock name="top_block" />
135 |
136 |           <div className="mt-4">
137 |             <LineItems />
138 |           </div>
139 |
140 |           <div className="mt-12 flex justify-end mb-8">
141 |             <Summary />
142 |           </div>
143 |
144 |           <div className="flex flex-col mt-auto">
145 |             <div className="grid grid-cols-2 gap-6 mb-4 overflow-hidden">
146 |               <PaymentDetails />
147 |               <NoteDetails />
148 |             </div>
149 |
150 |             <EditBlock name="bottom_block" />
151 |           </div>
152 |         </div>
153 |       </ScrollArea>
154 |
155 |       <div className="absolute bottom-14 w-full h-9">
[TRUNCATED]
```

apps/dashboard/src/components/invoice/from-details.tsx
```
1 | "use client";
2 |
3 | import { updateInvoiceTemplateAction } from "@/actions/invoice/update-invoice-template-action";
4 | import { Editor } from "@/components/invoice/editor";
5 | import { useAction } from "next-safe-action/hooks";
6 | import { Controller, useFormContext } from "react-hook-form";
7 | import { LabelInput } from "./label-input";
8 |
9 | export function FromDetails() {
10 |   const { control, watch } = useFormContext();
11 |   const id = watch("id");
12 |
13 |   const updateInvoiceTemplate = useAction(updateInvoiceTemplateAction);
14 |
15 |   return (
16 |     <div>
17 |       <LabelInput
18 |         name="template.from_label"
19 |         className="mb-2 block"
20 |         onSave={(value) => {
21 |           updateInvoiceTemplate.execute({
22 |             from_label: value,
23 |           });
24 |         }}
25 |       />
26 |
27 |       <Controller
28 |         name="from_details"
29 |         control={control}
30 |         render={({ field }) => (
31 |           <Editor
32 |             // NOTE: This is a workaround to get the new content to render
33 |             key={id}
34 |             initialContent={field.value}
35 |             onChange={field.onChange}
36 |             onBlur={(content) => {
37 |               updateInvoiceTemplate.execute({
38 |                 from_details: content ? JSON.stringify(content) : null,
39 |               });
40 |             }}
41 |             className="min-h-[90px] [&>div]:min-h-[90px]"
42 |           />
43 |         )}
44 |       />
45 |     </div>
46 |   );
47 | }
```

apps/dashboard/src/components/invoice/input.tsx
```
1 | import { cn } from "@midday/ui/cn";
2 | import { Input as BaseInput, type InputProps } from "@midday/ui/input";
3 | import { useState } from "react";
4 | import { useFormContext } from "react-hook-form";
5 |
6 | export function Input({ className, ...props }: InputProps) {
7 |   const { register, watch } = useFormContext();
8 |   const [isFocused, setIsFocused] = useState(false);
9 |   const fieldName = props.name as string;
10 |   const fieldValue = watch(fieldName);
11 |
12 |   const { ref, ...rest } = register(fieldName, {
13 |     valueAsNumber: props.type === "number",
14 |   });
15 |
16 |   const isPlaceholder = !fieldValue && !isFocused;
17 |
18 |   return (
19 |     <div className="relative">
20 |       <BaseInput
21 |         {...props}
22 |         {...rest}
23 |         ref={ref}
24 |         autoComplete="off"
25 |         value={fieldValue || ""}
26 |         className={cn(
27 |           "border-0 p-0 h-6 border-b border-transparent focus:border-border font-mono text-xs",
28 |           isPlaceholder && "opacity-0",
29 |           className,
30 |         )}
31 |         onFocus={(evt) => {
32 |           setIsFocused(true);
33 |           props.onFocus?.(evt);
34 |         }}
35 |         onBlur={(evt) => {
36 |           setIsFocused(false);
37 |           props.onBlur?.(evt);
38 |         }}
39 |       />
40 |       {isPlaceholder && (
41 |         <div className="absolute inset-0 pointer-events-none">
42 |           <div className="h-full w-full bg-[repeating-linear-gradient(-60deg,#DBDBDB,#DBDBDB_1px,transparent_1px,transparent_5px)] dark:bg-[repeating-linear-gradient(-60deg,#2C2C2C,#2C2C2C_1px,transparent_1px,transparent_5px)]" />
43 |         </div>
44 |       )}
45 |     </div>
46 |   );
47 | }
```

apps/dashboard/src/components/invoice/invoice-no.tsx
```
1 | import { updateInvoiceTemplateAction } from "@/actions/invoice/update-invoice-template-action";
2 | import { useInvoiceParams } from "@/hooks/use-invoice-params";
3 | import { createClient } from "@midday/supabase/client";
4 | import { searchInvoiceNumberQuery } from "@midday/supabase/queries";
5 | import { cn } from "@midday/ui/cn";
6 | import {
7 |   Tooltip,
8 |   TooltipContent,
9 |   TooltipProvider,
10 |   TooltipTrigger,
11 | } from "@midday/ui/tooltip";
12 | import { useAction } from "next-safe-action/hooks";
13 | import { useEffect, useState } from "react";
14 | import { useFormContext } from "react-hook-form";
15 | import { Input } from "./input";
16 | import { LabelInput } from "./label-input";
17 |
18 | type Props = {
19 |   teamId: string;
20 | };
21 |
22 | export function InvoiceNo({ teamId }: Props) {
23 |   const { watch, setError, clearErrors } = useFormContext();
24 |   const supabase = createClient();
25 |   const invoiceNumber = watch("invoice_number");
26 |
27 |   const [isInvoiceNumberExists, setIsInvoiceNumberExists] = useState(false);
28 |
29 |   const { type } = useInvoiceParams();
30 |
31 |   const updateInvoiceTemplate = useAction(updateInvoiceTemplateAction);
32 |
33 |   useEffect(() => {
34 |     async function searchInvoiceNumber() {
35 |       if (invoiceNumber) {
36 |         const { data } = await searchInvoiceNumberQuery(supabase, {
37 |           teamId,
38 |           query: invoiceNumber,
39 |         });
40 |
41 |         const exists = data && data.length > 0;
42 |         setIsInvoiceNumberExists(exists ?? false);
43 |
44 |         if (exists) {
45 |           setError("invoice_number", {
46 |             type: "manual",
47 |             message: "Invoice number already exists",
48 |           });
49 |         } else {
50 |           clearErrors("invoice_number");
51 |         }
52 |       }
53 |     }
54 |
55 |     // Only search for invoice number if we are creating a new invoice
56 |     if (type === "create") {
57 |       searchInvoiceNumber();
58 |     }
59 |   }, [invoiceNumber, teamId, type]);
60 |
61 |   return (
62 |     <div className="flex space-x-1 items-center">
63 |       <div className="flex items-center flex-shrink-0">
64 |         <LabelInput
65 |           name="template.invoice_no_label"
66 |           onSave={(value) => {
67 |             updateInvoiceTemplate.execute({
68 |               invoice_no_label: value,
69 |             });
70 |           }}
71 |           className="truncate"
72 |         />
73 |         <span className="text-[11px] text-[#878787] font-mono flex-shrink-0">
74 |           :
75 |         </span>
76 |       </div>
77 |
78 |       <TooltipProvider delayDuration={100}>
79 |         <Tooltip>
80 |           <TooltipTrigger asChild>
81 |             <div>
82 |               <Input
83 |                 name="invoice_number"
84 |                 className={cn(
85 |                   "w-28 flex-shrink p-0 border-none text-[11px] h-4.5 overflow-hidden",
86 |                   isInvoiceNumberExists ? "text-red-500" : "",
87 |                 )}
88 |               />
89 |             </div>
90 |           </TooltipTrigger>
91 |           {isInvoiceNumberExists && (
92 |             <TooltipContent className="text-xs px-3 py-1.5">
93 |               <p>Invoice number already exists</p>
94 |             </TooltipContent>
95 |           )}
96 |         </Tooltip>
97 |       </TooltipProvider>
98 |     </div>
99 |   );
100 | }
```

apps/dashboard/src/components/invoice/invoice-title.tsx
```
1 | "use client";
2 |
3 | import { updateInvoiceTemplateAction } from "@/actions/invoice/update-invoice-template-action";
4 | import { useAction } from "next-safe-action/hooks";
5 | import { useFormContext } from "react-hook-form";
6 | import { Input } from "./input";
7 |
8 | export function InvoiceTitle() {
9 |   const { watch } = useFormContext();
10 |   const invoiceTitle = watch("template.title");
11 |
12 |   const updateInvoiceTemplate = useAction(updateInvoiceTemplateAction);
13 |
14 |   return (
15 |     <Input
16 |       className="text-[21px] font-medium mb-2 w-fit min-w-[100px] !border-none"
17 |       name="template.title"
18 |       onBlur={() => {
19 |         updateInvoiceTemplate.execute({ title: invoiceTitle });
20 |       }}
21 |     />
22 |   );
23 | }
```

apps/dashboard/src/components/invoice/issue-date.tsx
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
12 | export function IssueDate() {
13 |   const { setValue, watch } = useFormContext<InvoiceFormValues>();
14 |   const issueDate = watch("issue_date");
15 |   const dateFormat = watch("template.date_format");
16 |   const [isOpen, setIsOpen] = useState(false);
17 |
18 |   const handleSelect = (date: Date | undefined) => {
19 |     if (date) {
20 |       setValue("issue_date", date, { shouldValidate: true, shouldDirty: true });
21 |       setIsOpen(false);
22 |     }
23 |   };
24 |
25 |   const updateInvoiceTemplate = useAction(updateInvoiceTemplateAction);
26 |
27 |   return (
28 |     <div className="flex space-x-1 items-center">
29 |       <div className="flex items-center">
30 |         <LabelInput
31 |           name="template.issue_date_label"
32 |           onSave={(value) => {
33 |             updateInvoiceTemplate.execute({
34 |               issue_date_label: value,
35 |             });
36 |           }}
37 |         />
38 |         <span className="text-[11px] text-[#878787] font-mono">:</span>
39 |       </div>
40 |
41 |       <Popover open={isOpen} onOpenChange={setIsOpen} modal>
42 |         <PopoverTrigger className="text-primary text-[11px] font-mono whitespace-nowrap flex">
43 |           {issueDate && format(issueDate, dateFormat)}
44 |         </PopoverTrigger>
45 |         <PopoverContent className="w-auto p-0">
46 |           <Calendar
47 |             mode="single"
48 |             selected={issueDate ? new TZDate(issueDate, "UTC") : undefined}
49 |             onSelect={handleSelect}
50 |             initialFocus
51 |           />
52 |         </PopoverContent>
53 |       </Popover>
54 |     </div>
55 |   );
56 | }
```

apps/dashboard/src/components/invoice/label-input.tsx
```
1 | "use client";
2 |
3 | import { cn } from "@midday/ui/cn";
4 | import { useFormContext } from "react-hook-form";
5 |
6 | type Props = {
7 |   name: string;
8 |   required?: boolean;
9 |   className?: string;
10 |   onSave?: (value: string) => void;
11 | };
12 |
13 | export function LabelInput({ name, className, onSave }: Props) {
14 |   const { setValue, watch } = useFormContext();
15 |   const value = watch(name);
16 |
17 |   return (
18 |     <span
19 |       className={cn(
20 |         "text-[11px] text-[#878787] min-w-10 font-mono outline-none",
21 |         className,
22 |       )}
23 |       id={name}
24 |       contentEditable
25 |       suppressContentEditableWarning
26 |       onBlur={(e) => {
27 |         const newValue = e.currentTarget.textContent || "";
28 |         setValue(name, newValue, { shouldValidate: true });
29 |
30 |         // Only call onSave if the value has changed
31 |         if (newValue !== value) {
32 |           onSave?.(newValue);
33 |         }
34 |       }}
35 |     >
36 |       {value}
37 |     </span>
38 |   );
39 | }
```

apps/dashboard/src/components/invoice/line-items.tsx
```
1 | "use client";
2 |
3 | import type { InvoiceFormValues } from "@/actions/invoice/schema";
4 | import { updateInvoiceTemplateAction } from "@/actions/invoice/update-invoice-template-action";
5 | import { formatAmount } from "@/utils/format";
6 | import { calculateLineItemTotal } from "@midday/invoice/calculate";
7 | import { Button } from "@midday/ui/button";
8 | import { Icons } from "@midday/ui/icons";
9 | import { Reorder, useDragControls } from "framer-motion";
10 | import { useAction } from "next-safe-action/hooks";
11 | import { useFieldArray, useFormContext, useWatch } from "react-hook-form";
12 | import { AmountInput } from "./amount-input";
13 | import { Description } from "./description";
14 | import { Input } from "./input";
15 | import { LabelInput } from "./label-input";
16 | import { QuantityInput } from "./quantity-input";
17 |
18 | export function LineItems() {
19 |   const { control } = useFormContext<InvoiceFormValues>();
20 |   const currency = useWatch({ control, name: "template.currency" });
21 |
22 |   const includeDecimals = useWatch({
23 |     control,
24 |     name: "template.include_decimals",
25 |   });
26 |
27 |   const includeUnits = useWatch({
28 |     control,
29 |     name: "template.include_units",
30 |   });
31 |
32 |   const maximumFractionDigits = includeDecimals ? 2 : 0;
33 |
34 |   const { fields, append, remove, swap } = useFieldArray({
35 |     control,
36 |     name: "line_items",
37 |   });
38 |
39 |   const updateInvoiceTemplate = useAction(updateInvoiceTemplateAction);
40 |
41 |   const reorderList = (newFields: typeof fields) => {
42 |     const firstDiffIndex = fields.findIndex(
43 |       (field, index) => field.id !== newFields[index]?.id,
44 |     );
45 |
46 |     if (firstDiffIndex !== -1) {
47 |       const newIndex = newFields.findIndex(
48 |         (field) => field.id === fields[firstDiffIndex]?.id,
49 |       );
50 |
51 |       if (newIndex !== -1) {
52 |         swap(firstDiffIndex, newIndex);
53 |       }
54 |     }
55 |   };
56 |
57 |   const handleRemove = (index: number) => {
58 |     if (fields.length > 1) {
59 |       remove(index);
60 |     }
61 |   };
62 |
63 |   return (
64 |     <div className="space-y-4">
65 |       <div
66 |         className={`grid ${includeUnits ? "grid-cols-[1.5fr_15%25%_15%]" : "grid-cols-[1.5fr_15%_15%_15%]"} gap-4 items-end mb-2`}
67 |       >
68 |         <LabelInput
69 |           name="template.description_label"
70 |           onSave={(value) => {
71 |             updateInvoiceTemplate.execute({
72 |               description_label: value,
73 |             });
74 |           }}
75 |           className="truncate"
76 |         />
77 |
78 |         <LabelInput
79 |           name="template.quantity_label"
80 |           onSave={(value) => {
81 |             updateInvoiceTemplate.execute({
82 |               quantity_label: value,
83 |             });
84 |           }}
85 |           className="truncate"
86 |         />
87 |
88 |         <LabelInput
89 |           name="template.price_label"
90 |           onSave={(value) => {
91 |             updateInvoiceTemplate.execute({
92 |               price_label: value,
93 |             });
94 |           }}
95 |           className="truncate"
96 |         />
97 |
98 |         <LabelInput
99 |           name="template.total_label"
100 |           onSave={(value) => {
101 |             updateInvoiceTemplate.execute({
102 |               total_label: value,
103 |             });
104 |           }}
105 |           className="text-right truncate"
106 |         />
107 |       </div>
108 |
109 |       <Reorder.Group
110 |         axis="y"
111 |         values={fields}
112 |         onReorder={reorderList}
113 |         className="!m-0"
114 |       >
115 |         {fields.map((field, index) => (
116 |           <LineItemRow
117 |             key={field.id}
118 |             item={field}
119 |             index={index}
120 |             handleRemove={handleRemove}
121 |             isReorderable={fields.length > 1}
122 |             currency={currency}
123 |             maximumFractionDigits={maximumFractionDigits}
124 |             includeUnits={includeUnits}
125 |           />
126 |         ))}
127 |       </Reorder.Group>
128 |
129 |       <button
130 |         type="button"
131 |         onClick={() =>
132 |           append({
133 |             name: "",
134 |             quantity: 0,
135 |             price: 0,
136 |           })
137 |         }
138 |         className="flex items-center space-x-2 text-xs text-[#878787] font-mono"
139 |       >
140 |         <Icons.Add />
141 |         <span className="text-[11px]">Add item</span>
142 |       </button>
143 |     </div>
144 |   );
145 | }
146 |
147 | function LineItemRow({
148 |   index,
149 |   handleRemove,
150 |   isReorderable,
151 |   item,
152 |   currency,
153 |   maximumFractionDigits,
154 |   includeUnits,
155 | }: {
156 |   index: number;
157 |   handleRemove: (index: number) => void;
158 |   isReorderable: boolean;
159 |   item: InvoiceFormValues["line_items"][number];
160 |   currency: string;
161 |   maximumFractionDigits: number;
162 |   includeUnits?: boolean;
163 | }) {
164 |   const controls = useDragControls();
165 |   const { control } = useFormContext<InvoiceFormValues>();
166 |
167 |   const locale = useWatch({ control, name: "template.locale" });
168 |
169 |   const price = useWatch({
170 |     control,
171 |     name: `line_items.${index}.price`,
172 |   });
173 |
174 |   const quantity = useWatch({
175 |     control,
176 |     name: `line_items.${index}.quantity`,
177 |   });
178 |
179 |   return (
180 |     <Reorder.Item
[TRUNCATED]
```

apps/dashboard/src/components/invoice/logo.tsx
```
1 | "use client";
2 |
3 | import type { InvoiceFormValues } from "@/actions/invoice/schema";
4 | import { updateInvoiceTemplateAction } from "@/actions/invoice/update-invoice-template-action";
5 | import { useUpload } from "@/hooks/use-upload";
6 | import { Icons } from "@midday/ui/icons";
7 | import { Skeleton } from "@midday/ui/skeleton";
8 | import { useToast } from "@midday/ui/use-toast";
9 | import { useAction } from "next-safe-action/hooks";
10 | import { useFormContext } from "react-hook-form";
11 |
12 | export function Logo({ teamId }: { teamId: string }) {
13 |   const { watch, setValue } = useFormContext<InvoiceFormValues>();
14 |   const logoUrl = watch("template.logo_url");
15 |   const { uploadFile, isLoading } = useUpload();
16 |   const { toast } = useToast();
17 |
18 |   const updateInvoiceTemplate = useAction(updateInvoiceTemplateAction);
19 |
20 |   const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
21 |     const file = event.target.files?.[0];
22 |     if (file) {
23 |       try {
24 |         const { url } = await uploadFile({
25 |           file,
26 |           path: [teamId, "invoice", file.name],
27 |           bucket: "avatars",
28 |         });
29 |
30 |         setValue("template.logo_url", url, { shouldValidate: true });
31 |
32 |         updateInvoiceTemplate.execute({
33 |           logo_url: url,
34 |         });
35 |       } catch (error) {
36 |         toast({
37 |           title: "Something went wrong, please try again.",
38 |           variant: "error",
39 |         });
40 |       }
41 |     }
42 |   };
43 |
44 |   return (
45 |     <div className="relative h-[80px] group">
46 |       <label htmlFor="logo-upload" className="block h-full">
47 |         {isLoading ? (
48 |           <Skeleton className="w-full h-full" />
49 |         ) : logoUrl ? (
50 |           <>
51 |             <img
52 |               src={logoUrl}
53 |               alt="Invoice logo"
54 |               className="h-full w-auto max-w-none object-contain"
55 |             />
56 |             <button
57 |               type="button"
58 |               className="absolute inset-0 bg-black bg-opacity-50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity flex-col gap-1"
59 |               style={{ width: "auto" }}
60 |               onClick={(e) => {
61 |                 e.preventDefault();
62 |                 setValue("template.logo_url", undefined, {
63 |                   shouldValidate: true,
64 |                 });
65 |                 updateInvoiceTemplate.execute({ logo_url: null });
66 |               }}
67 |             >
68 |               <Icons.Clear className="size-4" />
69 |               <span className="text-xs font-medium">Remove</span>
70 |             </button>
71 |           </>
72 |         ) : (
73 |           <div className="h-[80px] w-[80px] bg-[repeating-linear-gradient(-60deg,#DBDBDB,#DBDBDB_1px,transparent_1px,transparent_5px)] dark:bg-[repeating-linear-gradient(-60deg,#2C2C2C,#2C2C2C_1px,transparent_1px,transparent_5px)]" />
74 |         )}
75 |       </label>
76 |
77 |       <input
78 |         id="logo-upload"
79 |         type="file"
80 |         accept="image/jpeg,image/jpg,image/png"
81 |         className="hidden"
82 |         onChange={handleUpload}
83 |         disabled={isLoading}
84 |       />
85 |     </div>
86 |   );
87 | }
```

apps/dashboard/src/components/invoice/meta.tsx
```
1 | import { DueDate } from "./due-date";
2 | import { InvoiceNo } from "./invoice-no";
3 | import { InvoiceTitle } from "./invoice-title";
4 | import { IssueDate } from "./issue-date";
5 |
6 | type Props = {
7 |   teamId: string;
8 | };
9 |
10 | export function Meta({ teamId }: Props) {
11 |   return (
12 |     <div>
13 |       <InvoiceTitle />
14 |
15 |       <div className="flex flex-col gap-0.5">
16 |         <div>
17 |           <InvoiceNo teamId={teamId} />
18 |         </div>
19 |         <div>
20 |           <IssueDate />
21 |         </div>
22 |         <div>
23 |           <DueDate />
24 |         </div>
25 |       </div>
26 |     </div>
27 |   );
28 | }
```

apps/dashboard/src/components/invoice/note-details.tsx
```
1 | "use client";
2 |
3 | import { updateInvoiceTemplateAction } from "@/actions/invoice/update-invoice-template-action";
4 | import { Editor } from "@/components/invoice/editor";
5 | import { useAction } from "next-safe-action/hooks";
6 | import { Controller, useFormContext } from "react-hook-form";
7 | import { LabelInput } from "./label-input";
8 |
9 | export function NoteDetails() {
10 |   const { control, watch } = useFormContext();
11 |   const id = watch("id");
12 |
13 |   const updateInvoiceTemplate = useAction(updateInvoiceTemplateAction);
14 |
15 |   return (
16 |     <div>
17 |       <LabelInput
18 |         name="template.note_label"
19 |         onSave={(value) => {
20 |           updateInvoiceTemplate.execute({
21 |             note_label: value,
22 |           });
23 |         }}
24 |         className="mb-2 block"
25 |       />
26 |
27 |       <Controller
28 |         control={control}
29 |         name="note_details"
30 |         render={({ field }) => {
31 |           return (
32 |             <Editor
33 |               // NOTE: This is a workaround to get the new content to render
34 |               key={id}
35 |               initialContent={field.value}
36 |               onChange={field.onChange}
37 |               className="min-h-[78px]"
38 |             />
39 |           );
40 |         }}
41 |       />
42 |     </div>
43 |   );
44 | }
```

apps/dashboard/src/components/invoice/payment-details.tsx
```
1 | "use client";
2 |
3 | import { updateInvoiceTemplateAction } from "@/actions/invoice/update-invoice-template-action";
4 | import { Editor } from "@/components/invoice/editor";
5 | import { useAction } from "next-safe-action/hooks";
6 | import { Controller, useFormContext } from "react-hook-form";
7 | import { LabelInput } from "./label-input";
8 |
9 | export function PaymentDetails() {
10 |   const { control, watch } = useFormContext();
11 |   const id = watch("id");
12 |
13 |   const updateInvoiceTemplate = useAction(updateInvoiceTemplateAction);
14 |
15 |   return (
16 |     <div>
17 |       <LabelInput
18 |         name="template.payment_label"
19 |         onSave={(value) => {
20 |           updateInvoiceTemplate.execute({
21 |             payment_label: value,
22 |           });
23 |         }}
24 |         className="mb-2 block"
25 |       />
26 |
27 |       <Controller
28 |         control={control}
29 |         name="payment_details"
30 |         render={({ field }) => (
31 |           <Editor
32 |             // NOTE: This is a workaround to get the new content to render
33 |             key={id}
34 |             initialContent={field.value}
35 |             onChange={field.onChange}
36 |             onBlur={(content) => {
37 |               updateInvoiceTemplate.execute({
38 |                 payment_details: content ? JSON.stringify(content) : null,
39 |               });
40 |             }}
41 |             className="min-h-[78px]"
42 |           />
43 |         )}
44 |       />
45 |     </div>
46 |   );
47 | }
```

apps/dashboard/src/components/invoice/quantity-input.tsx
```
1 | import { cn } from "@midday/ui/cn";
2 | import { QuantityInput as BaseQuantityInput } from "@midday/ui/quantity-input";
3 | import { useState } from "react";
4 | import { useController, useFormContext } from "react-hook-form";
5 |
6 | export function QuantityInput({
7 |   name,
8 |   ...props
9 | }: { name: string } & Omit<Parameters<typeof BaseQuantityInput>[0], "value">) {
10 |   const [isFocused, setIsFocused] = useState(false);
11 |
12 |   const { control } = useFormContext();
13 |   const {
14 |     field: { value, onChange, onBlur },
15 |   } = useController({
16 |     name,
17 |     control,
18 |   });
19 |
20 |   const isPlaceholder = !value && !isFocused;
21 |
22 |   return (
23 |     <div className="relative">
24 |       <BaseQuantityInput
25 |         {...props}
26 |         value={value}
27 |         min={0}
28 |         onChange={onChange}
29 |         onFocus={() => setIsFocused(true)}
30 |         className={cn(
31 |           isPlaceholder && "opacity-0 [&_button]:pointer-events-none",
32 |         )}
33 |         onBlur={() => {
34 |           setIsFocused(false);
35 |           onBlur();
36 |         }}
37 |       />
38 |
39 |       {isPlaceholder && (
40 |         <div className="absolute inset-0 pointer-events-none">
41 |           <div className="h-full w-full bg-[repeating-linear-gradient(-60deg,#DBDBDB,#DBDBDB_1px,transparent_1px,transparent_5px)] dark:bg-[repeating-linear-gradient(-60deg,#2C2C2C,#2C2C2C_1px,transparent_1px,transparent_5px)]" />
42 |         </div>
43 |       )}
44 |     </div>
45 |   );
46 | }
```

apps/dashboard/src/components/invoice/settings-menu.tsx
```
1 | "use client";
2 |
3 | import { updateInvoiceTemplateAction } from "@/actions/invoice/update-invoice-template-action";
4 | import { uniqueCurrencies } from "@midday/location/currencies";
5 | import {
6 |   DropdownMenu,
7 |   DropdownMenuCheckboxItem,
8 |   DropdownMenuContent,
9 |   DropdownMenuSub,
10 |   DropdownMenuSubContent,
11 |   DropdownMenuSubTrigger,
12 |   DropdownMenuTrigger,
13 | } from "@midday/ui/dropdown-menu";
14 | import { Icons } from "@midday/ui/icons";
15 | import { useAction } from "next-safe-action/hooks";
16 | import { useFormContext } from "react-hook-form";
17 | import { SelectCurrency } from "../select-currency";
18 |
19 | const dateFormats = [
20 |   { value: "dd/MM/yyyy", label: "DD/MM/YYYY" },
21 |   { value: "MM/dd/yyyy", label: "MM/DD/YYYY" },
22 |   { value: "yyyy-MM-dd", label: "YYYY-MM-DD" },
23 | ];
24 |
25 | const invoiceSizes = [
26 |   { value: "a4", label: "A4" },
27 |   { value: "letter", label: "Letter" },
28 | ];
29 |
30 | const booleanOptions = [
31 |   { value: true, label: "Yes" },
32 |   { value: false, label: "No" },
33 | ];
34 |
35 | const menuItems = [
36 |   {
37 |     icon: Icons.DateFormat,
38 |     label: "Date format",
39 |     options: dateFormats,
40 |     key: "date_format",
41 |   },
42 |   {
43 |     icon: Icons.CropFree,
44 |     label: "Invoice size",
45 |     options: invoiceSizes,
46 |     key: "size",
47 |   },
48 |   {
49 |     icon: Icons.Tax,
50 |     label: "Sales Tax",
51 |     options: booleanOptions,
52 |     key: "include_tax",
53 |   },
54 |   {
55 |     icon: Icons.Vat,
56 |     label: "VAT",
57 |     options: booleanOptions,
58 |     key: "include_vat",
59 |   },
60 |   {
61 |     icon: Icons.CurrencyOutline,
62 |     label: "Currency",
63 |     options: uniqueCurrencies.map((currency) => ({
64 |       value: currency,
65 |       label: currency,
66 |     })),
67 |     key: "currency",
68 |   },
69 |   {
70 |     icon: Icons.ConfirmationNumber,
71 |     label: "Discount",
72 |     options: booleanOptions,
73 |     key: "include_discount",
74 |   },
75 |   {
76 |     icon: Icons.Straighten,
77 |     label: "Units",
78 |     options: booleanOptions,
79 |     key: "include_units",
80 |   },
81 |   {
82 |     icon: Icons.Decimals,
83 |     label: "Decimals",
84 |     options: booleanOptions,
85 |     key: "include_decimals",
86 |   },
87 |   {
88 |     icon: Icons.QrCode,
89 |     label: "QR Code",
90 |     options: booleanOptions,
91 |     key: "include_qr",
92 |   },
93 | ];
94 |
95 | export function SettingsMenu() {
96 |   const { watch, setValue } = useFormContext();
97 |   const updateInvoiceTemplate = useAction(updateInvoiceTemplateAction);
98 |
99 |   return (
100 |     <DropdownMenu>
101 |       <DropdownMenuTrigger asChild>
102 |         <button type="button">
103 |           <Icons.MoreVertical className="size-5" />
104 |         </button>
105 |       </DropdownMenuTrigger>
106 |       <DropdownMenuContent align="end" className="w-48">
107 |         {menuItems.map((item, index) => {
108 |           const watchKey = `template.${item.key}`;
109 |
110 |           if (item.key === "currency") {
111 |             return (
112 |               <DropdownMenuSub key={index.toString()}>
113 |                 <DropdownMenuSubTrigger>
114 |                   <item.icon className="mr-2 size-4" />
115 |                   <span className="text-xs">{item.label}</span>
116 |                 </DropdownMenuSubTrigger>
117 |                 <DropdownMenuSubContent className="p-0">
118 |                   <SelectCurrency
119 |                     headless
120 |                     className="text-xs"
121 |                     currencies={uniqueCurrencies}
122 |                     value={watch(watchKey)}
123 |                     onChange={(value) => {
124 |                       setValue(watchKey, value, {
125 |                         shouldValidate: true,
126 |                       });
127 |                       updateInvoiceTemplate.execute({
128 |                         [item.key]: value,
129 |                       });
130 |                     }}
131 |                   />
132 |                 </DropdownMenuSubContent>
133 |               </DropdownMenuSub>
134 |             );
135 |           }
136 |
137 |           return (
138 |             <DropdownMenuSub key={index.toString()}>
139 |               <DropdownMenuSubTrigger>
140 |                 <item.icon className="mr-2 size-4" />
141 |                 <span className="text-xs">{item.label}</span>
142 |               </DropdownMenuSubTrigger>
143 |               <DropdownMenuSubContent className="p-0 max-h-48 overflow-y-auto">
144 |                 {item.options.map((option, optionIndex) => (
145 |                   <DropdownMenuCheckboxItem
146 |                     key={optionIndex.toString()}
147 |                     className="text-xs"
148 |                     checked={watch(watchKey) === option.value}
149 |                     onCheckedChange={(checked) => {
150 |                       if (checked) {
151 |                         setValue(watchKey, option.value, {
152 |                           shouldValidate: true,
153 |                         });
154 |
155 |                         updateInvoiceTemplate.execute({
156 |                           [item.key]: option.value,
157 |                         });
158 |                       }
159 |                     }}
160 |                     onSelect={(event) => event.preventDefault()}
161 |                   >
162 |                     {option.label}
163 |                   </DropdownMenuCheckboxItem>
164 |                 ))}
165 |               </DropdownMenuSubContent>
166 |             </DropdownMenuSub>
167 |           );
168 |         })}
169 |       </DropdownMenuContent>
170 |     </DropdownMenu>
171 |   );
172 | }
```

apps/dashboard/src/components/invoice/submit-button.tsx
```
1 | "use client";
2 |
3 | import type { InvoiceFormValues } from "@/actions/invoice/schema";
4 | import { updateInvoiceTemplateAction } from "@/actions/invoice/update-invoice-template-action";
5 | import { Button } from "@midday/ui/button";
6 | import {
7 |   DropdownMenu,
8 |   DropdownMenuCheckboxItem,
9 |   DropdownMenuContent,
10 |   DropdownMenuTrigger,
11 | } from "@midday/ui/dropdown-menu";
12 | import { Icons } from "@midday/ui/icons";
13 | import { SubmitButton as BaseSubmitButton } from "@midday/ui/submit-button";
14 | import { useAction } from "next-safe-action/hooks";
15 | import { useState } from "react";
16 | import { useFormContext } from "react-hook-form";
17 |
18 | type Props = {
19 |   isSubmitting: boolean;
20 |   disabled?: boolean;
21 | };
22 |
23 | export function SubmitButton({ isSubmitting, disabled }: Props) {
24 |   const { watch, setValue, formState } = useFormContext<InvoiceFormValues>();
25 |
26 |   const selectedOption = watch("template.delivery_type");
27 |   const canUpdate = watch("status") !== "draft";
28 |
29 |   const invoiceNumberValid = !formState.errors.invoice_number;
30 |
31 |   const updateInvoiceTemplate = useAction(updateInvoiceTemplateAction);
32 |
33 |   const handleOptionChange = (value: string) => {
34 |     const deliveryType = value as "create" | "create_and_send";
35 |
36 |     updateInvoiceTemplate.execute({
37 |       delivery_type: deliveryType,
38 |     });
39 |
40 |     setValue("template.delivery_type", deliveryType, {
41 |       shouldValidate: true,
42 |     });
43 |   };
44 |
45 |   const isValid = formState.isValid && invoiceNumberValid;
46 |
47 |   const options = [
48 |     {
49 |       label: canUpdate ? "Update" : "Create",
50 |       value: "create",
51 |     },
52 |     {
53 |       label: canUpdate ? "Update & Send" : "Create & Send",
54 |       value: "create_and_send",
55 |     },
56 |   ];
57 |
58 |   return (
59 |     <div className="flex divide-x">
60 |       <BaseSubmitButton
61 |         isSubmitting={isSubmitting}
62 |         disabled={!isValid || disabled}
63 |       >
64 |         {options.find((o) => o.value === selectedOption)?.label}
65 |       </BaseSubmitButton>
66 |
67 |       <DropdownMenu>
68 |         <DropdownMenuTrigger asChild>
69 |           <Button
70 |             disabled={!isValid || isSubmitting || disabled}
71 |             className="size-9 p-0 [&[data-state=open]>svg]:rotate-180"
72 |           >
73 |             <Icons.ChevronDown className="size-4 transition-transform duration-200" />
74 |           </Button>
75 |         </DropdownMenuTrigger>
76 |         <DropdownMenuContent align="end" sideOffset={10}>
77 |           {options.map((option) => (
78 |             <DropdownMenuCheckboxItem
79 |               key={option.value}
80 |               checked={selectedOption === option.value}
81 |               onCheckedChange={() => handleOptionChange(option.value)}
82 |             >
83 |               {option.label}
84 |             </DropdownMenuCheckboxItem>
85 |           ))}
86 |         </DropdownMenuContent>
87 |       </DropdownMenu>
88 |     </div>
89 |   );
90 | }
```

apps/dashboard/src/components/invoice/summary.tsx
```
1 | import type { InvoiceFormValues } from "@/actions/invoice/schema";
2 | import { updateInvoiceTemplateAction } from "@/actions/invoice/update-invoice-template-action";
3 | import { calculateTotal } from "@midday/invoice/calculate";
4 | import { useAction } from "next-safe-action/hooks";
5 | import { useCallback, useEffect } from "react";
6 | import { useFormContext, useWatch } from "react-hook-form";
7 | import { AnimatedNumber } from "../animated-number";
8 | import { FormatAmount } from "../format-amount";
9 | import { AmountInput } from "./amount-input";
10 | import { LabelInput } from "./label-input";
11 | import { TaxInput } from "./tax-input";
12 | import { VATInput } from "./vat-input";
13 |
14 | export function Summary() {
15 |   const { control, setValue } = useFormContext<InvoiceFormValues>();
16 |
17 |   const updateInvoiceTemplate = useAction(updateInvoiceTemplateAction);
18 |
19 |   const includeDecimals = useWatch({
20 |     control,
21 |     name: "template.include_decimals",
22 |   });
23 |
24 |   const maximumFractionDigits = includeDecimals ? 2 : 0;
25 |
26 |   const currency = useWatch({
27 |     control,
28 |     name: "template.currency",
29 |   });
30 |
31 |   const locale = useWatch({
32 |     control,
33 |     name: "template.locale",
34 |   });
35 |
36 |   const includeTax = useWatch({
37 |     control,
38 |     name: "template.include_tax",
39 |   });
40 |
41 |   const taxRate = useWatch({
42 |     control,
43 |     name: "template.tax_rate",
44 |   });
45 |
46 |   const vatRate = useWatch({
47 |     control,
48 |     name: "template.vat_rate",
49 |   });
50 |
51 |   const includeVAT = useWatch({
52 |     control,
53 |     name: "template.include_vat",
54 |   });
55 |
56 |   const includeDiscount = useWatch({
57 |     control,
58 |     name: "template.include_discount",
59 |   });
60 |
61 |   const lineItems = useWatch({
62 |     control,
63 |     name: "line_items",
64 |   });
65 |
66 |   const discount = useWatch({
67 |     control,
68 |     name: "discount",
69 |   });
70 |
71 |   const {
72 |     subTotal,
73 |     total,
74 |     vat: totalVAT,
75 |     tax: totalTax,
76 |   } = calculateTotal({
77 |     lineItems,
78 |     taxRate,
79 |     vatRate,
80 |     includeTax,
81 |     discount: discount ?? 0,
82 |   });
83 |
84 |   const updateFormValues = useCallback(() => {
85 |     setValue("amount", total, { shouldValidate: true });
86 |     setValue("vat", totalVAT, { shouldValidate: true });
87 |     setValue("tax", totalTax, { shouldValidate: true });
88 |     setValue("subtotal", subTotal, { shouldValidate: true });
89 |   }, [total, totalVAT, totalTax, subTotal]);
90 |
91 |   useEffect(() => {
92 |     updateFormValues();
93 |   }, [updateFormValues]);
94 |
95 |   useEffect(() => {
96 |     if (!includeTax) {
97 |       setValue("template.tax_rate", 0, { shouldValidate: true });
98 |     }
99 |   }, [includeTax]);
100 |
101 |   useEffect(() => {
102 |     if (!includeVAT) {
103 |       setValue("template.vat_rate", 0, { shouldValidate: true });
104 |     }
105 |   }, [includeVAT]);
106 |
107 |   useEffect(() => {
108 |     if (!includeDiscount) {
109 |       setValue("discount", 0, { shouldValidate: true });
110 |     }
111 |   }, [includeDiscount]);
112 |
113 |   return (
114 |     <div className="w-[320px] flex flex-col">
115 |       <div className="flex justify-between items-center py-1">
116 |         <LabelInput
117 |           className="flex-shrink-0 min-w-6"
118 |           name="template.subtotal_label"
119 |           onSave={(value) => {
120 |             updateInvoiceTemplate.execute({
121 |               subtotal_label: value,
122 |             });
123 |           }}
124 |         />
125 |         <span className="text-right font-mono text-[11px] text-[#878787]">
126 |           <FormatAmount
127 |             amount={subTotal}
128 |             maximumFractionDigits={maximumFractionDigits}
129 |             currency={currency}
130 |             locale={locale}
131 |           />
132 |         </span>
133 |       </div>
134 |
135 |       {includeDiscount && (
136 |         <div className="flex justify-between items-center py-1">
137 |           <LabelInput
138 |             name="template.discount_label"
139 |             onSave={(value) => {
140 |               updateInvoiceTemplate.execute({
141 |                 discount_label: value,
142 |               });
143 |             }}
144 |           />
145 |
146 |           <AmountInput
147 |             placeholder="0"
148 |             allowNegative={false}
149 |             name="discount"
150 |             className="text-right font-mono text-[11px] text-[#878787] border-none"
151 |           />
152 |         </div>
153 |       )}
154 |
155 |       {includeVAT && (
156 |         <div className="flex justify-between items-center py-1">
157 |           <div className="flex items-center gap-1">
158 |             <LabelInput
159 |               className="flex-shrink-0 min-w-5"
160 |               name="template.vat_label"
161 |               onSave={(value) => {
162 |                 updateInvoiceTemplate.execute({
163 |                   vat_label: value,
164 |                 });
165 |               }}
166 |             />
167 |
168 |             <VATInput />
169 |           </div>
170 |
171 |           <span className="text-right font-mono text-[11px] text-[#878787]">
172 |             <FormatAmount
173 |               amount={totalVAT}
174 |               maximumFractionDigits={maximumFractionDigits}
175 |               currency={currency}
176 |               locale={locale}
177 |             />
178 |           </span>
179 |         </div>
180 |       )}
181 |
182 |       {includeTax && (
183 |         <div className="flex justify-between items-center py-1">
[TRUNCATED]
```

apps/dashboard/src/components/invoice/tax-input.tsx
```
1 | import { CurrencyInput } from "@midday/ui/currency-input";
2 | import { useController, useFormContext } from "react-hook-form";
3 |
4 | export function TaxInput() {
5 |   const { control } = useFormContext();
6 |   const {
7 |     field: { value, onChange },
8 |   } = useController({
9 |     name: "template.tax_rate",
10 |     control,
11 |   });
12 |
13 |   return (
14 |     <CurrencyInput
15 |       suffix="%)"
16 |       prefix="("
17 |       autoComplete="off"
18 |       value={value}
19 |       onValueChange={(values) => {
20 |         onChange(values.floatValue);
21 |       }}
22 |       className="p-0 border-0 h-6 text-xs !bg-transparent font-mono flex-shrink-0 w-16 text-[11px] text-[#878787]"
23 |       thousandSeparator={false}
24 |       decimalScale={2}
25 |       isAllowed={(values) => {
26 |         const { floatValue } = values;
27 |         return (
28 |           floatValue === undefined || (floatValue >= 0 && floatValue <= 100)
29 |         );
30 |       }}
31 |       allowNegative={false}
32 |     />
33 |   );
34 | }
```

apps/dashboard/src/components/invoice/utils.ts
```
1 | import type { InvoiceFormValues } from "@/actions/invoice/schema";
2 | import type { Customer } from "./customer-details";
3 |
4 | export const transformCustomerToContent = (customer?: Customer) => {
5 |   if (!customer) return null;
6 |
7 |   const content = [];
8 |
9 |   if (customer.name) {
10 |     content.push({
11 |       type: "paragraph",
12 |       content: [
13 |         {
14 |           text: customer.name,
15 |           type: "text",
16 |         },
17 |       ],
18 |     });
19 |   }
20 |
21 |   if (customer.address_line_1) {
22 |     content.push({
23 |       type: "paragraph",
24 |       content: [{ text: customer.address_line_1, type: "text" }],
25 |     });
26 |   }
27 |
28 |   if (customer.zip || customer.city) {
29 |     content.push({
30 |       type: "paragraph",
31 |       content: [
32 |         {
33 |           text: `${customer.zip || ""} ${customer.city || ""}`.trim(),
34 |           type: "text",
35 |         },
36 |       ],
37 |     });
38 |   }
39 |
40 |   if (customer.country) {
41 |     content.push({
42 |       type: "paragraph",
43 |       content: [{ text: customer.country, type: "text" }],
44 |     });
45 |   }
46 |
47 |   if (customer.email) {
48 |     content.push({
49 |       type: "paragraph",
50 |       content: [{ text: customer.email, type: "text" }],
51 |     });
52 |   }
53 |
54 |   if (customer.phone) {
55 |     content.push({
56 |       type: "paragraph",
57 |       content: [{ text: customer.phone, type: "text" }],
58 |     });
59 |   }
60 |
61 |   if (customer.vat) {
62 |     content.push({
63 |       type: "paragraph",
64 |       content: [{ text: `VAT: ${customer.vat}`, type: "text" }],
65 |     });
66 |   }
67 |
68 |   return {
69 |     type: "doc",
70 |     content,
71 |   };
72 | };
73 |
74 | export const transformFormValuesToDraft = (values: InvoiceFormValues) => {
75 |   return {
76 |     ...values,
77 |     template: {
78 |       ...values.template,
79 |       ...(values.payment_details && {
80 |         payment_details: JSON.stringify(values.payment_details),
81 |       }),
82 |       ...(values.from_details && {
83 |         from_details: JSON.stringify(values.from_details),
84 |       }),
85 |     },
86 |     ...(values.payment_details && {
87 |       payment_details: JSON.stringify(values.payment_details),
88 |     }),
89 |     ...(values.from_details && {
90 |       from_details: JSON.stringify(values.from_details),
91 |     }),
92 |     ...(values.customer_details && {
93 |       customer_details: JSON.stringify(values.customer_details),
94 |     }),
95 |     ...(values.note_details && {
96 |       note_details: JSON.stringify(values.note_details),
97 |     }),
98 |   };
99 | };
100 |
101 | export function parseInputValue(value?: string | null) {
102 |   if (value === null) return null;
103 |   return value ? JSON.parse(value) : undefined;
104 | }
```

apps/dashboard/src/components/invoice/vat-input.tsx
```
1 | import { CurrencyInput } from "@midday/ui/currency-input";
2 | import { useController, useFormContext } from "react-hook-form";
3 |
4 | export function VATInput() {
5 |   const { control } = useFormContext();
6 |   const {
7 |     field: { value, onChange },
8 |   } = useController({
9 |     name: "template.vat_rate",
10 |     control,
11 |   });
12 |
13 |   return (
14 |     <CurrencyInput
15 |       suffix="%)"
16 |       prefix="("
17 |       autoComplete="off"
18 |       value={value}
19 |       onValueChange={(values) => {
20 |         onChange(values.floatValue);
21 |       }}
22 |       className="p-0 border-0 h-6 text-xs !bg-transparent font-mono flex-shrink-0 w-16 text-[11px] text-[#878787]"
23 |       thousandSeparator={false}
24 |       decimalScale={2}
25 |       isAllowed={(values) => {
26 |         const { floatValue } = values;
27 |         return (
28 |           floatValue === undefined || (floatValue >= 0 && floatValue <= 100)
29 |         );
30 |       }}
31 |       allowNegative={false}
32 |     />
33 |   );
34 | }
```

apps/dashboard/src/components/modals/add-new-device.tsx
```
1 | "use client";
2 |
3 | import { mfaVerifyAction } from "@/actions/mfa-verify-action";
4 | import { createClient } from "@midday/supabase/client";
5 | import { Button } from "@midday/ui/button";
6 | import { Dialog, DialogContent } from "@midday/ui/dialog";
7 | import { InputOTP, InputOTPGroup, InputOTPSlot } from "@midday/ui/input-otp";
8 | import { useAction } from "next-safe-action/hooks";
9 | import Image from "next/image";
10 | import { usePathname, useRouter, useSearchParams } from "next/navigation";
11 | import { useEffect, useState } from "react";
12 |
13 | export function AddNewDeviceModal() {
14 |   const supabase = createClient();
15 |   const searchParams = useSearchParams();
16 |   const router = useRouter();
17 |   const pathname = usePathname();
18 |   const [isValidating, setValidating] = useState(false);
19 |   const [factorId, setFactorId] = useState("");
20 |   const [error, setError] = useState(false);
21 |   const [qr, setQR] = useState("");
22 |   const isOpen = searchParams.get("add") === "device";
23 |
24 |   const verify = useAction(mfaVerifyAction, {
25 |     onSuccess: () => router.push(pathname),
26 |   });
27 |
28 |   const onComplete = async (code: string) => {
29 |     if (!isValidating) {
30 |       setValidating(true);
31 |
32 |       const challenge = await supabase.auth.mfa.challenge({ factorId });
33 |
34 |       if (!challenge.data) {
35 |         setError(true);
36 |         return;
37 |       }
38 |
39 |       verify.execute({
40 |         factorId,
41 |         challengeId: challenge.data.id,
42 |         code,
43 |       });
44 |     }
45 |   };
46 |
47 |   useEffect(() => {
48 |     setValidating(false);
49 |     setError(false);
50 |
51 |     async function enroll() {
52 |       const { data, error } = await supabase.auth.mfa.enroll({
53 |         factorType: "totp",
54 |       });
55 |
56 |       if (error) {
57 |         throw error;
58 |       }
59 |
60 |       setFactorId(data.id);
61 |
62 |       setQR(data.totp.qr_code);
63 |     }
64 |
65 |     if (isOpen) {
66 |       enroll();
67 |     }
68 |   }, [isOpen]);
69 |
70 |   const handleOnClose = () => {
71 |     router.push(pathname);
72 |
73 |     supabase.auth.mfa.unenroll({
74 |       factorId,
75 |     });
76 |   };
77 |
78 |   return (
79 |     <Dialog open={isOpen} onOpenChange={handleOnClose}>
80 |       <DialogContent
81 |         className="max-w-[455px]"
82 |         onInteractOutside={(evt) => {
83 |           evt.preventDefault();
84 |         }}
85 |       >
86 |         <div className="p-6">
87 |           <div className="flex items-center justify-center mt-8">
88 |             <div className="w-[190px] h-[190px] bg-white rounded-md">
89 |               {qr && (
90 |                 <Image
91 |                   src={qr}
92 |                   alt="qr"
93 |                   width={190}
94 |                   height={190}
95 |                   quality={100}
96 |                 />
97 |               )}
98 |             </div>
99 |           </div>
100 |
101 |           <div className="my-8">
102 |             <p className="font-medium pb-1 text-2xl text-[#606060]">
103 |               Use an authenticator app to scan the following QR code, and
104 |               provide the code to complete the setup.
105 |             </p>
106 |           </div>
107 |
108 |           <div className="flex w-full justify-center">
109 |             <InputOTP
110 |               maxLength={6}
111 |               onComplete={onComplete}
112 |               autoFocus
113 |               disabled={isValidating}
114 |               className={error ? "invalid" : ""}
115 |               render={({ slots }) => (
116 |                 <InputOTPGroup>
117 |                   {slots.map((slot, index) => (
118 |                     <InputOTPSlot key={index.toString()} {...slot} />
119 |                   ))}
120 |                 </InputOTPGroup>
121 |               )}
122 |             />
123 |           </div>
124 |
125 |           <div className="flex border-t-[1px] pt-4 mt-4 justify-center">
126 |             <Button
127 |               onClick={handleOnClose}
128 |               variant="ghost"
129 |               className="text-medium text-sm hover:bg-transparent"
130 |             >
131 |               Cancel
132 |             </Button>
133 |           </div>
134 |         </div>
135 |       </DialogContent>
136 |     </Dialog>
137 |   );
138 | }
```

apps/dashboard/src/components/modals/connect-transactions-modal.tsx
```
1 | "use client";
2 |
3 | import { createPlaidLinkTokenAction } from "@/actions/institutions/create-plaid-link";
4 | import { exchangePublicToken } from "@/actions/institutions/exchange-public-token";
5 | import { getInstitutions } from "@/actions/institutions/get-institutions";
6 | import { useConnectParams } from "@/hooks/use-connect-params";
7 | import type { Institutions } from "@midday-ai/engine/resources/institutions/institutions";
8 | import { track } from "@midday/events/client";
9 | import { LogEvents } from "@midday/events/events";
10 | import { Button } from "@midday/ui/button";
11 | import {
12 |   Dialog,
13 |   DialogContent,
14 |   DialogDescription,
15 |   DialogHeader,
16 |   DialogTitle,
17 | } from "@midday/ui/dialog";
18 | import { Input } from "@midday/ui/input";
19 | import { Skeleton } from "@midday/ui/skeleton";
20 | import { useDebounce, useScript } from "@uidotdev/usehooks";
21 | import { useRouter } from "next/navigation";
22 | import { useEffect, useState } from "react";
23 | import { usePlaidLink } from "react-plaid-link";
24 | import { BankLogo } from "../bank-logo";
25 | import { ConnectBankProvider } from "../connect-bank-provider";
26 | import { CountrySelector } from "../country-selector";
27 | import { InstitutionInfo } from "../institution-info";
28 |
29 | function SearchSkeleton() {
30 |   return (
31 |     <div className="space-y-4">
32 |       {Array.from(new Array(10), (_, index) => (
33 |         <div className="flex items-center space-x-4" key={index.toString()}>
34 |           <Skeleton className="h-9 w-9 rounded-full" />
35 |           <div className="flex flex-col space-y-1">
36 |             <Skeleton className="h-2 rounded-none w-[140px]" />
37 |             <Skeleton className="h-2 rounded-none w-[40px]" />
38 |           </div>
39 |         </div>
40 |       ))}
41 |     </div>
42 |   );
43 | }
44 |
45 | type SearchResultProps = {
46 |   id: string;
47 |   name: string;
48 |   logo: string | null;
49 |   provider: string;
50 |   availableHistory: number;
51 |   openPlaid: () => void;
52 | };
53 |
54 | function SearchResult({
55 |   id,
56 |   name,
57 |   logo,
58 |   provider,
59 |   availableHistory,
60 |   openPlaid,
61 | }: SearchResultProps) {
62 |   return (
63 |     <div className="flex justify-between">
64 |       <div className="flex items-center">
65 |         <BankLogo src={logo} alt={name} />
66 |
67 |         <div className="ml-4 space-y-1 cursor-default">
68 |           <p className="text-sm font-medium leading-none">{name}</p>
69 |           <InstitutionInfo provider={provider}>
70 |             <span className="text-[#878787] text-xs capitalize">
71 |               Via {provider}
72 |             </span>
73 |           </InstitutionInfo>
74 |         </div>
75 |       </div>
76 |
77 |       <ConnectBankProvider
78 |         id={id}
79 |         provider={provider}
80 |         openPlaid={openPlaid}
81 |         availableHistory={availableHistory}
82 |       />
83 |     </div>
84 |   );
85 | }
86 |
87 | type ConnectTransactionsModalProps = {
88 |   countryCode: string;
89 | };
90 |
91 | export function ConnectTransactionsModal({
92 |   countryCode: initialCountryCode,
93 | }: ConnectTransactionsModalProps) {
94 |   const router = useRouter();
95 |   const [loading, setLoading] = useState(true);
96 |   const [results, setResults] = useState<Institutions["data"]>([]);
97 |   const [plaidToken, setPlaidToken] = useState<string | undefined>();
98 |
99 |   const {
100 |     countryCode,
101 |     q: query,
102 |     step,
103 |     setParams,
104 |   } = useConnectParams(initialCountryCode);
105 |
106 |   const isOpen = step === "connect";
107 |   const debouncedSearchTerm = useDebounce(query, 200);
108 |
109 |   // NOTE: Load SDKs here so it's not unmonted
110 |   useScript("https://cdn.teller.io/connect/connect.js", {
111 |     removeOnUnmount: false,
112 |   });
113 |
114 |   const { open: openPlaid } = usePlaidLink({
115 |     token: plaidToken,
116 |     publicKey: "",
117 |     env: process.env.NEXT_PUBLIC_PLAID_ENVIRONMENT!,
118 |     clientName: "Midday",
119 |     product: ["transactions"],
120 |     onSuccess: async (public_token, metadata) => {
121 |       const { access_token, item_id } = await exchangePublicToken(public_token);
122 |
123 |       setParams({
124 |         step: "account",
125 |         provider: "plaid",
126 |         token: access_token,
127 |         ref: item_id,
128 |         institution_id: metadata.institution?.institution_id,
129 |       });
130 |       track({
131 |         event: LogEvents.ConnectBankAuthorized.name,
132 |         channel: LogEvents.ConnectBankAuthorized.channel,
133 |         provider: "plaid",
134 |       });
135 |     },
136 |     onExit: () => {
137 |       setParams({ step: "connect" });
138 |
139 |       track({
140 |         event: LogEvents.ConnectBankCanceled.name,
141 |         channel: LogEvents.ConnectBankCanceled.channel,
142 |         provider: "plaid",
143 |       });
144 |     },
145 |   });
146 |
147 |   const handleOnClose = () => {
148 |     setParams(
149 |       {
150 |         step: null,
151 |         countryCode: null,
152 |         q: null,
153 |         ref: null,
154 |       },
155 |       {
156 |         // NOTE: Rerender so the overview modal is visible
157 |         shallow: false,
158 |       },
159 |     );
160 |   };
161 |
162 |   async function fetchData(query?: string) {
163 |     try {
164 |       setLoading(true);
165 |       const { data } = await getInstitutions({ countryCode, query });
[TRUNCATED]
```

apps/dashboard/src/components/modals/create-categories-modal.tsx
```
1 | import { createCategoriesAction } from "@/actions/create-categories-action";
2 | import {
3 |   type CreateCategoriesFormValues,
4 |   createCategoriesSchema,
5 | } from "@/actions/schema";
6 | import { InputColor } from "@/components/input-color";
7 | import { zodResolver } from "@hookform/resolvers/zod";
8 | import { Button } from "@midday/ui/button";
9 | import {
10 |   DialogContent,
11 |   DialogDescription,
12 |   DialogFooter,
13 |   DialogHeader,
14 |   DialogTitle,
15 | } from "@midday/ui/dialog";
16 | import { Form, FormControl, FormField, FormItem } from "@midday/ui/form";
17 | import { Icons } from "@midday/ui/icons";
18 | import { Input } from "@midday/ui/input";
19 | import { useToast } from "@midday/ui/use-toast";
20 | import { Loader2 } from "lucide-react";
21 | import { useAction } from "next-safe-action/hooks";
22 | import { useEffect } from "react";
23 | import { useFieldArray, useForm } from "react-hook-form";
24 | import { VatInput } from "../vat-input";
25 |
26 | type Props = {
27 |   onOpenChange: (isOpen: boolean) => void;
28 |   isOpen: boolean;
29 | };
30 |
31 | const newItem = {
32 |   name: undefined,
33 |   description: undefined,
34 |   vat: undefined,
35 |   color: undefined,
36 | };
37 |
38 | export function CreateCategoriesModal({ onOpenChange, isOpen }: Props) {
39 |   const { toast } = useToast();
40 |
41 |   const createCategories = useAction(createCategoriesAction, {
42 |     onSuccess: () => {
43 |       onOpenChange(false);
44 |
45 |       toast({
46 |         title: "Successfully created categories.",
47 |         variant: "success",
48 |         duration: 3500,
49 |       });
50 |     },
51 |     onError: () => {
52 |       toast({
53 |         duration: 3500,
54 |         variant: "error",
55 |         title: "Something went wrong please try again.",
56 |       });
57 |     },
58 |   });
59 |
60 |   const form = useForm<CreateCategoriesFormValues>({
61 |     resolver: zodResolver(createCategoriesSchema),
62 |     defaultValues: {
63 |       categories: [newItem],
64 |     },
65 |   });
66 |
67 |   useEffect(() => {
68 |     form.reset({
69 |       categories: [newItem],
70 |     });
71 |   }, [isOpen]);
72 |
73 |   const onSubmit = form.handleSubmit((data) => {
74 |     createCategories.execute({
75 |       categories: data.categories.filter(
76 |         (category) => category.name !== undefined,
77 |       ),
78 |     });
79 |   });
80 |
81 |   const { fields, append } = useFieldArray({
82 |     name: "categories",
83 |     control: form.control,
84 |   });
85 |
86 |   return (
87 |     <DialogContent className="max-w-[455px]">
88 |       <Form {...form}>
89 |         <form onSubmit={form.handleSubmit(onSubmit)}>
90 |           <div className="p-4">
91 |             <DialogHeader className="mb-4">
92 |               <DialogTitle>Create categories</DialogTitle>
93 |               <DialogDescription>
94 |                 You can add your own categories here.
95 |               </DialogDescription>
96 |             </DialogHeader>
97 |
98 |             <div className="flex flex-col space-y-6 max-h-[400px] overflow-auto">
99 |               {fields.map((field, index) => (
100 |                 <div key={field.id} className="flex flex-col space-y-2">
101 |                   <div className="flex space-x-2">
102 |                     <FormField
103 |                       control={form.control}
104 |                       name={`categories.${index}.name`}
105 |                       render={({ field }) => (
106 |                         <FormItem className="flex-1">
107 |                           <FormControl>
108 |                             <InputColor
109 |                               autoFocus
110 |                               placeholder="Name"
111 |                               onChange={({ name, color }) => {
112 |                                 field.onChange(name);
113 |                                 form.setValue(
114 |                                   `categories.${index}.color`,
115 |                                   color,
116 |                                 );
117 |                               }}
118 |                               defaultValue={field.value}
119 |                               defaultColor={form.watch(
120 |                                 `categories.${index}.color`,
121 |                               )}
122 |                             />
123 |                           </FormControl>
124 |                         </FormItem>
125 |                       )}
126 |                     />
127 |
128 |                     <div className="flex-1 relative">
129 |                       <FormField
130 |                         control={form.control}
131 |                         name={`categories.${index}.vat`}
132 |                         render={({ field }) => (
133 |                           <FormItem className="flex-1">
134 |                             <FormControl>
135 |                               <VatInput
136 |                                 value={field.value}
137 |                                 name={form.watch(`categories.${index}.name`)}
138 |                                 onChange={(evt) => {
139 |                                   field.onChange(evt.target.value);
140 |                                 }}
141 |                                 onSelect={(vat) => {
142 |                                   if (vat) {
143 |                                     form.setValue(
144 |                                       `categories.${index}.vat`,
145 |                                       vat.toString(),
146 |                                     );
147 |                                   }
148 |                                 }}
149 |                               />
150 |                             </FormControl>
151 |                           </FormItem>
152 |                         )}
153 |                       />
154 |                     </div>
155 |                   </div>
156 |
157 |                   <FormField
158 |                     control={form.control}
159 |                     name={`categories.${index}.description`}
160 |                     render={({ field }) => (
161 |                       <FormItem className="flex-1">
162 |                         <FormControl>
163 |                           <Input
164 |                             {...field}
165 |                             autoFocus={false}
166 |                             placeholder="Description"
167 |                           />
168 |                         </FormControl>
169 |                       </FormItem>
170 |                     )}
171 |                   />
172 |                 </div>
173 |               ))}
174 |             </div>
175 |
176 |             <Button
177 |               variant="outline"
178 |               type="button"
179 |               className="mt-4 space-x-1"
180 |               onClick={() => {
181 |                 append(newItem, { shouldFocus: false });
182 |               }}
[TRUNCATED]
```

apps/dashboard/src/components/modals/create-team-modal.tsx
```
1 | import { createTeamAction } from "@/actions/create-team-action";
2 | import { createTeamSchema } from "@/actions/schema";
3 | import { zodResolver } from "@hookform/resolvers/zod";
4 | import { Button } from "@midday/ui/button";
5 | import {
6 |   DialogContent,
7 |   DialogDescription,
8 |   DialogFooter,
9 |   DialogHeader,
10 |   DialogTitle,
11 | } from "@midday/ui/dialog";
12 | import {
13 |   Form,
14 |   FormControl,
15 |   FormField,
16 |   FormItem,
17 |   FormMessage,
18 | } from "@midday/ui/form";
19 | import { Input } from "@midday/ui/input";
20 | import { Loader2 } from "lucide-react";
21 | import { useAction } from "next-safe-action/hooks";
22 | import { useForm } from "react-hook-form";
23 | import type { z } from "zod";
24 |
25 | type Props = {
26 |   onOpenChange: (isOpen: boolean) => void;
27 | };
28 |
29 | export function CreateTeamModal({ onOpenChange }: Props) {
30 |   const createTeam = useAction(createTeamAction, {
31 |     onSuccess: () => onOpenChange(false),
32 |   });
33 |
34 |   const form = useForm<z.infer<typeof createTeamSchema>>({
35 |     resolver: zodResolver(createTeamSchema),
36 |     defaultValues: {
37 |       name: "",
38 |       redirectTo: "/",
39 |     },
40 |   });
41 |
42 |   function onSubmit(values: z.infer<typeof createTeamSchema>) {
43 |     createTeam.execute({ name: values.name });
44 |   }
45 |
46 |   return (
47 |     <DialogContent className="max-w-[455px]">
48 |       <div className="p-4">
49 |         <DialogHeader>
50 |           <DialogTitle>Create team</DialogTitle>
51 |           <DialogDescription>
52 |             For example, you can use the name of your company or department.
53 |           </DialogDescription>
54 |         </DialogHeader>
55 |
56 |         <Form {...form}>
57 |           <form onSubmit={form.handleSubmit(onSubmit)}>
58 |             <FormField
59 |               control={form.control}
60 |               name="name"
61 |               render={({ field }) => (
62 |                 <FormItem>
63 |                   <FormControl>
64 |                     <Input
65 |                       autoFocus
66 |                       className="mt-3"
67 |                       placeholder="Ex: Acme Marketing or Acme Co"
68 |                       autoComplete="off"
69 |                       autoCapitalize="none"
70 |                       autoCorrect="off"
71 |                       spellCheck="false"
72 |                       {...field}
73 |                     />
74 |                   </FormControl>
75 |
76 |                   <FormMessage />
77 |                 </FormItem>
78 |               )}
79 |             />
80 |
81 |             <div className="mt-6 mb-6">
82 |               <DialogFooter>
83 |                 <div className="space-x-4">
84 |                   <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
85 |                     Cancel
86 |                   </Button>
87 |                   <Button
88 |                     type="submit"
89 |                     disabled={createTeam.status === "executing"}
90 |                   >
91 |                     {createTeam.status === "executing" ? (
92 |                       <Loader2 className="h-4 w-4 animate-spin" />
93 |                     ) : (
94 |                       "Continue"
95 |                     )}
96 |                   </Button>
97 |                 </div>
98 |               </DialogFooter>
99 |             </div>
100 |           </form>
101 |         </Form>
102 |       </div>
103 |     </DialogContent>
104 |   );
105 | }
```

apps/dashboard/src/components/modals/edit-bank-account-modal.tsx
```
1 | import { updateBankAccountAction } from "@/actions/update-bank-account-action";
2 | import { useI18n } from "@/locales/client";
3 | import { zodResolver } from "@hookform/resolvers/zod";
4 | import { Button } from "@midday/ui/button";
5 | import { CurrencyInput } from "@midday/ui/currency-input";
6 | import {
7 |   Dialog,
8 |   DialogContent,
9 |   DialogFooter,
10 |   DialogHeader,
11 |   DialogTitle,
12 | } from "@midday/ui/dialog";
13 | import {
14 |   Form,
15 |   FormControl,
16 |   FormDescription,
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
30 | import { Loader2 } from "lucide-react";
31 | import { useAction } from "next-safe-action/hooks";
32 | import { useForm } from "react-hook-form";
33 | import { z } from "zod";
34 |
35 | const formSchema = z.object({
36 |   name: z.string().min(1, {
37 |     message: "Account Name must be at least 1 characters.",
38 |   }),
39 |   type: z.string(),
40 |   balance: z.number().min(0, {
41 |     message: "Balance must be at least 0.",
42 |   }),
43 | });
44 |
45 | type Props = {
46 |   id: string;
47 |   onOpenChange: (isOpen: boolean) => void;
48 |   isOpen: boolean;
49 |   defaultName: string;
50 |   defaultType?: string;
51 |   defaultBalance: number;
52 | };
53 |
54 | export function EditBankAccountModal({
55 |   id,
56 |   onOpenChange,
57 |   isOpen,
58 |   defaultName,
59 |   defaultType,
60 |   defaultBalance,
61 | }: Props) {
62 |   const t = useI18n();
63 |
64 |   const updateAccount = useAction(updateBankAccountAction, {
65 |     onSuccess: () => onOpenChange(false),
66 |   });
67 |
68 |   const form = useForm<z.infer<typeof formSchema>>({
69 |     resolver: zodResolver(formSchema),
70 |     defaultValues: {
71 |       name: defaultName,
72 |       type: defaultType,
73 |       balance: defaultBalance,
74 |     },
75 |   });
76 |
77 |   function onSubmit(values: z.infer<typeof formSchema>) {
78 |     updateAccount.execute({ id, ...values });
79 |   }
80 |
81 |   const accountTypes = () => {
82 |     return [
83 |       "depository",
84 |       "credit",
85 |       "other_asset",
86 |       "loan",
87 |       "other_liability",
88 |     ].map((type) => (
89 |       <SelectItem key={type} value={type}>
90 |         {t(`account_type.${type}`)}
91 |       </SelectItem>
92 |     ));
93 |   };
94 |
95 |   return (
96 |     <Dialog open={isOpen} onOpenChange={onOpenChange}>
97 |       <DialogContent
98 |         className="max-w-[455px]"
99 |         onOpenAutoFocus={(evt) => evt.preventDefault()}
100 |       >
101 |         <div className="p-4">
102 |           <DialogHeader>
103 |             <DialogTitle className="flex justify-between">
104 |               Edit Account
105 |             </DialogTitle>
106 |           </DialogHeader>
107 |
108 |           <Form {...form}>
109 |             <form onSubmit={form.handleSubmit(onSubmit)} className="mt-6">
110 |               <FormField
111 |                 control={form.control}
112 |                 name="name"
113 |                 render={({ field }) => (
114 |                   <FormItem>
115 |                     <FormLabel>Name</FormLabel>
116 |                     <FormControl>
117 |                       <Input
118 |                         autoFocus
119 |                         placeholder="Company Account"
120 |                         autoComplete="off"
121 |                         autoCapitalize="none"
122 |                         autoCorrect="off"
123 |                         spellCheck="false"
124 |                         {...field}
125 |                       />
126 |                     </FormControl>
127 |                     <FormDescription>
128 |                       You can change the name of the account here
129 |                     </FormDescription>
130 |                     <FormMessage />
131 |                   </FormItem>
132 |                 )}
133 |               />
134 |
135 |               <FormField
136 |                 control={form.control}
137 |                 name="type"
138 |                 render={({ field }) => (
139 |                   <FormItem className="mt-4">
140 |                     <FormLabel>Type</FormLabel>
141 |                     <Select
142 |                       onValueChange={field.onChange}
143 |                       defaultValue={field.value}
144 |                     >
145 |                       <FormControl>
146 |                         <SelectTrigger>
147 |                           <SelectValue placeholder="Change account type" />
148 |                         </SelectTrigger>
149 |                       </FormControl>
150 |                       <SelectContent>{accountTypes()}</SelectContent>
151 |                     </Select>
152 |                     <FormDescription>Change the account type</FormDescription>
153 |                   </FormItem>
154 |                 )}
155 |               />
156 |
157 |               <FormField
158 |                 control={form.control}
159 |                 name="balance"
160 |                 render={({ field }) => (
161 |                   <FormItem className="mt-4">
162 |                     <FormLabel>Balance</FormLabel>
163 |
164 |                     <FormControl>
165 |                       <CurrencyInput
166 |                         min={0}
167 |                         value={field.value}
168 |                         onValueChange={(values) => {
169 |                           field.onChange(values.floatValue);
170 |                         }}
171 |                       />
172 |                     </FormControl>
173 |
174 |                     <FormDescription>
175 |                       Change the account balance
176 |                     </FormDescription>
177 |                   </FormItem>
178 |                 )}
179 |               />
180 |
181 |               <DialogFooter className="mt-10 w-full">
182 |                 <div className="space-y-4 w-full">
183 |                   <Button
184 |                     disabled={updateAccount.status === "executing"}
185 |                     className="w-full"
186 |                     type="submit"
187 |                   >
188 |                     {updateAccount.status === "executing" ? (
[TRUNCATED]
```

apps/dashboard/src/components/modals/edit-category-modal.tsx
```
1 | import {
2 |   type UpdateCategoriesFormValues,
3 |   updateCategorySchema,
4 | } from "@/actions/schema";
5 | import { updateCategoryAction } from "@/actions/update-category-action";
6 | import { zodResolver } from "@hookform/resolvers/zod";
7 | import { Button } from "@midday/ui/button";
8 | import {
9 |   Dialog,
10 |   DialogContent,
11 |   DialogFooter,
12 |   DialogHeader,
13 |   DialogTitle,
14 | } from "@midday/ui/dialog";
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
26 | import { InputColor } from "../input-color";
27 | import { VatInput } from "../vat-input";
28 |
29 | type Props = {
30 |   id: string;
31 |   onOpenChange: (isOpen: boolean) => void;
32 |   isOpen: boolean;
33 |   defaultValue: {
34 |     name: string;
35 |     color: string;
36 |     description?: string;
37 |     vat?: string;
38 |   };
39 | };
40 |
41 | export function EditCategoryModal({
42 |   id,
43 |   onOpenChange,
44 |   isOpen,
45 |   defaultValue,
46 | }: Props) {
47 |   const updateCategory = useAction(updateCategoryAction, {
48 |     onSuccess: () => onOpenChange(false),
49 |   });
50 |
51 |   const form = useForm<UpdateCategoriesFormValues>({
52 |     resolver: zodResolver(updateCategorySchema),
53 |     defaultValues: {
54 |       id,
55 |       name: defaultValue.name,
56 |       color: defaultValue.color,
57 |       description: defaultValue.description ?? undefined,
58 |       vat: defaultValue?.vat?.toString() ?? undefined,
59 |     },
60 |   });
61 |
62 |   function onSubmit(values: UpdateCategoriesFormValues) {
63 |     updateCategory.execute({
64 |       ...values,
65 |       description: values.description?.length ? values.description : null,
66 |       vat: values.vat?.length ? values.vat.toString() : null,
67 |     });
68 |   }
69 |
70 |   return (
71 |     <Dialog open={isOpen} onOpenChange={onOpenChange}>
72 |       <DialogContent className="max-w-[455px]">
73 |         <div className="p-4">
74 |           <DialogHeader>
75 |             <DialogTitle>Edit Category</DialogTitle>
76 |           </DialogHeader>
77 |
78 |           <Form {...form}>
79 |             <form onSubmit={form.handleSubmit(onSubmit)} className="mt-6 mb-6">
80 |               <div className="flex flex-col space-y-2">
81 |                 <div className="flex space-x-2">
82 |                   <FormField
83 |                     control={form.control}
84 |                     name="name"
85 |                     render={({ field }) => (
86 |                       <FormItem className="flex-1">
87 |                         <FormControl>
88 |                           <div className="relative">
89 |                             <div
90 |                               className="size-3 transition-colors rounded-[2px] absolute top-3 left-2"
91 |                               style={{
92 |                                 backgroundColor: form.watch("color"),
93 |                               }}
94 |                             />
95 |
96 |                             <InputColor
97 |                               placeholder="Category"
98 |                               onChange={({ name, color }) => {
99 |                                 form.setValue("color", color);
100 |                                 field.onChange(name);
101 |                               }}
102 |                               defaultValue={field.value}
103 |                               defaultColor={form.watch("color")}
104 |                             />
105 |
106 |                             <FormMessage />
107 |                           </div>
108 |                         </FormControl>
109 |                       </FormItem>
110 |                     )}
111 |                   />
112 |
113 |                   <div className="flex-1 relative">
114 |                     <FormField
115 |                       control={form.control}
116 |                       name="vat"
117 |                       render={({ field }) => (
118 |                         <FormItem className="flex-1">
119 |                           <FormControl>
120 |                             <VatInput
121 |                               value={field.value}
122 |                               name={form.watch("name")}
123 |                               onChange={(evt) => {
124 |                                 field.onChange(evt.target.value);
125 |                               }}
126 |                               onSelect={(vat) => {
127 |                                 if (vat) {
128 |                                   form.setValue("vat", vat.toString());
129 |                                 }
130 |                               }}
131 |                             />
132 |                           </FormControl>
133 |                         </FormItem>
134 |                       )}
135 |                     />
136 |                   </div>
137 |                 </div>
138 |
139 |                 <FormField
140 |                   control={form.control}
141 |                   name="description"
142 |                   render={({ field }) => (
143 |                     <FormItem className="flex-1">
144 |                       <FormControl>
145 |                         <Input
146 |                           {...field}
147 |                           autoFocus={false}
148 |                           placeholder="Description"
149 |                         />
150 |                       </FormControl>
151 |                     </FormItem>
152 |                   )}
153 |                 />
154 |               </div>
155 |
156 |               <DialogFooter className="mt-8 w-full">
157 |                 <div className="space-y-4 w-full">
158 |                   <Button
159 |                     disabled={updateCategory.status === "executing"}
160 |                     className="w-full"
161 |                     type="submit"
162 |                   >
163 |                     {updateCategory.status === "executing" ? (
164 |                       <Loader2 className="h-4 w-4 animate-spin" />
165 |                     ) : (
166 |                       "Save"
167 |                     )}
168 |                   </Button>
169 |                 </div>
170 |               </DialogFooter>
171 |             </form>
172 |           </Form>
173 |         </div>
174 |       </DialogContent>
175 |     </Dialog>
176 |   );
177 | }
```

apps/dashboard/src/components/modals/edit-inbox-modal.tsx
```
1 | import { updateInboxAction } from "@/actions/inbox/update";
2 | import {
3 |   type UpdateInboxFormValues,
4 |   updateInboxSchema,
5 | } from "@/actions/schema";
6 | import { zodResolver } from "@hookform/resolvers/zod";
7 | import { Button } from "@midday/ui/button";
8 | import {
9 |   Dialog,
10 |   DialogContent,
11 |   DialogFooter,
12 |   DialogHeader,
13 |   DialogTitle,
14 | } from "@midday/ui/dialog";
15 | import { Form, FormControl, FormField, FormItem } from "@midday/ui/form";
16 | import { Input } from "@midday/ui/input";
17 | import { Loader2 } from "lucide-react";
18 | import { useAction } from "next-safe-action/hooks";
19 | import { useEffect } from "react";
20 | import { useForm } from "react-hook-form";
21 | import { SelectCurrency } from "../select-currency";
22 |
23 | type Props = {
24 |   id: string;
25 |   onOpenChange: (isOpen: boolean) => void;
26 |   isOpen: boolean;
27 |   currencies: string[];
28 |   defaultValue: {
29 |     display_name: string;
30 |     amount: string;
31 |     currency: string;
32 |   };
33 | };
34 |
35 | export function EditInboxModal({
36 |   id,
37 |   onOpenChange,
38 |   isOpen,
39 |   defaultValue,
40 |   currencies,
41 | }: Props) {
42 |   const updateCategory = useAction(updateInboxAction, {
43 |     onSuccess: () => onOpenChange(false),
44 |   });
45 |
46 |   const form = useForm<UpdateInboxFormValues>({
47 |     resolver: zodResolver(updateInboxSchema),
48 |   });
49 |
50 |   useEffect(() => {
51 |     form.reset({
52 |       id,
53 |       display_name: defaultValue.display_name,
54 |       amount: defaultValue.amount?.toString(),
55 |       currency: defaultValue.currency ?? undefined,
56 |     });
57 |   }, [id]);
58 |
59 |   function onSubmit(values: UpdateInboxFormValues) {
60 |     updateCategory.execute(values);
61 |   }
62 |
63 |   return (
64 |     <Dialog open={isOpen} onOpenChange={onOpenChange}>
65 |       <DialogContent className="max-w-[455px]">
66 |         <div className="p-4">
67 |           <DialogHeader>
68 |             <DialogTitle>Edit</DialogTitle>
69 |           </DialogHeader>
70 |
71 |           <Form {...form}>
72 |             <form onSubmit={form.handleSubmit(onSubmit)} className="mt-6 mb-6">
73 |               <div className="flex flex-col space-y-2">
74 |                 <FormField
75 |                   control={form.control}
76 |                   name="display_name"
77 |                   render={({ field }) => (
78 |                     <FormItem className="flex-1">
79 |                       <FormControl>
80 |                         <Input {...field} placeholder="Name" />
81 |                       </FormControl>
82 |                     </FormItem>
83 |                   )}
84 |                 />
85 |
86 |                 <div className="flex flex-row space-x-2">
87 |                   <FormField
88 |                     control={form.control}
89 |                     name="amount"
90 |                     render={({ field }) => (
91 |                       <FormItem className="w-full">
92 |                         <FormControl>
93 |                           <Input {...field} placeholder="Amount" />
94 |                         </FormControl>
95 |                       </FormItem>
96 |                     )}
97 |                   />
98 |
99 |                   <FormField
100 |                     control={form.control}
101 |                     name="currency"
102 |                     render={({ field }) => (
103 |                       <FormItem className="w-full">
104 |                         <FormControl>
105 |                           <SelectCurrency
106 |                             className="w-full text-xs"
107 |                             {...field}
108 |                             currencies={Object.values(currencies)?.map(
109 |                               (currency) => currency,
110 |                             )}
111 |                           />
112 |                         </FormControl>
113 |                       </FormItem>
114 |                     )}
115 |                   />
116 |                 </div>
117 |               </div>
118 |
119 |               <DialogFooter className="mt-8 w-full">
120 |                 <div className="space-y-4 w-full">
121 |                   <Button
122 |                     disabled={updateCategory.status === "executing"}
123 |                     className="w-full"
124 |                     type="submit"
125 |                   >
126 |                     {updateCategory.status === "executing" ? (
127 |                       <Loader2 className="h-4 w-4 animate-spin" />
128 |                     ) : (
129 |                       "Save"
130 |                     )}
131 |                   </Button>
132 |                 </div>
133 |               </DialogFooter>
134 |             </form>
135 |           </Form>
136 |         </div>
137 |       </DialogContent>
138 |     </Dialog>
139 |   );
140 | }
```

apps/dashboard/src/components/modals/inbox-settings-modal.tsx
```
1 | "use client";
2 |
3 | import { Button } from "@midday/ui/button";
4 | import {
5 |   DialogContent,
6 |   DialogDescription,
7 |   DialogHeader,
8 |   DialogTitle,
9 | } from "@midday/ui/dialog";
10 | import { Dialog } from "@midday/ui/dialog";
11 | import { Icons } from "@midday/ui/icons";
12 | import { useState } from "react";
13 | import { InboxSettings } from "../inbox-settings";
14 |
15 | type Props = {
16 |   forwardEmail: string;
17 |   inboxForwarding: boolean;
18 |   inboxId: string;
19 | };
20 |
21 | export function InboxSettingsModal({
22 |   forwardEmail,
23 |   inboxForwarding,
24 |   inboxId,
25 | }: Props) {
26 |   const [open, setOpen] = useState(false);
27 |
28 |   return (
29 |     <Dialog open={open} onOpenChange={setOpen}>
30 |       <div>
31 |         <Button variant="outline" size="icon" onClick={() => setOpen(true)}>
32 |           <Icons.InboxCustomize />
33 |         </Button>
34 |       </div>
35 |
36 |       <DialogContent
37 |         className="max-w-[455px]"
38 |         onOpenAutoFocus={(evt) => evt.preventDefault()}
39 |       >
40 |         <div className="p-4">
41 |           <DialogHeader className="mb-8">
42 |             <DialogTitle>Settings</DialogTitle>
43 |             <DialogDescription>
44 |               Make changes to your inbox here. Click save when you're done.
45 |             </DialogDescription>
46 |           </DialogHeader>
47 |
48 |           <InboxSettings
49 |             forwardEmail={forwardEmail}
50 |             inboxForwarding={inboxForwarding}
51 |             inboxId={inboxId}
52 |             onSuccess={() => setOpen(false)}
53 |           />
54 |         </div>
55 |       </DialogContent>
56 |     </Dialog>
57 |   );
58 | }
```

apps/dashboard/src/components/modals/invite-team-members-modal.tsx
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
10 | import {
11 |   DialogContent,
12 |   DialogDescription,
13 |   DialogFooter,
14 |   DialogHeader,
15 |   DialogTitle,
16 | } from "@midday/ui/dialog";
17 | import { Form, FormControl, FormField, FormItem } from "@midday/ui/form";
18 | import { Icons } from "@midday/ui/icons";
19 | import { Input } from "@midday/ui/input";
20 | import {
21 |   Select,
22 |   SelectContent,
23 |   SelectItem,
24 |   SelectTrigger,
25 |   SelectValue,
26 | } from "@midday/ui/select";
27 | import { useToast } from "@midday/ui/use-toast";
28 | import { Loader2 } from "lucide-react";
29 | import { useAction } from "next-safe-action/hooks";
30 | import { useEffect } from "react";
31 | import { useFieldArray, useForm } from "react-hook-form";
32 |
33 | export function InviteTeamMembersModal({ onOpenChange, isOpen }) {
34 |   const { toast } = useToast();
35 |
36 |   const inviteMembers = useAction(inviteTeamMembersAction, {
37 |     onSuccess: () => {
38 |       onOpenChange(false);
39 |
40 |       toast({
41 |         title: "Successfully invited Team Members.",
42 |         variant: "success",
43 |         duration: 3500,
44 |       });
45 |     },
46 |     onError: () => {
47 |       toast({
48 |         duration: 3500,
49 |         variant: "error",
50 |         title: "Something went wrong please try again.",
51 |       });
52 |     },
53 |   });
54 |
55 |   const form = useForm<InviteTeamMembersFormValues>({
56 |     resolver: zodResolver(inviteTeamMembersSchema),
57 |     defaultValues: {
58 |       invites: [
59 |         {
60 |           email: "",
61 |           role: "member",
62 |         },
63 |       ],
64 |     },
65 |   });
66 |
67 |   useEffect(() => {
68 |     form.reset();
69 |   }, [isOpen]);
70 |
71 |   const onSubmit = form.handleSubmit((data) => {
72 |     inviteMembers.execute({
73 |       // Remove invites without email (last appended invite validation)
74 |       invites: data.invites.filter((invite) => invite.email !== undefined),
75 |       revalidatePath: "/settings/members",
76 |     });
77 |   });
78 |
79 |   const { fields, append } = useFieldArray({
80 |     name: "invites",
81 |     control: form.control,
82 |   });
83 |
84 |   return (
85 |     <DialogContent className="max-w-[455px]">
86 |       <Form {...form}>
87 |         <form onSubmit={form.handleSubmit(onSubmit)}>
88 |           <div className="p-4">
89 |             <DialogHeader>
90 |               <DialogTitle>Invite Members</DialogTitle>
91 |               <DialogDescription>
92 |                 Invite new members by email address.
93 |               </DialogDescription>
94 |             </DialogHeader>
95 |
96 |             {fields.map((field, index) => (
97 |               <div
98 |                 className="flex items-center justify-between mt-3 space-x-4"
99 |                 key={index.toString()}
100 |               >
101 |                 <FormField
102 |                   control={form.control}
103 |                   key={field.id}
104 |                   name={`invites.${index}.email`}
105 |                   render={({ field }) => (
106 |                     <FormItem className="flex-1">
107 |                       <FormControl>
108 |                         <Input
109 |                           placeholder="jane@example.com"
110 |                           type="email"
111 |                           autoComplete="off"
112 |                           autoCapitalize="none"
113 |                           autoCorrect="off"
114 |                           spellCheck="false"
115 |                           {...field}
116 |                         />
117 |                       </FormControl>
118 |                     </FormItem>
119 |                   )}
120 |                 />
121 |
122 |                 <FormField
123 |                   control={form.control}
124 |                   name={`invites.${index}.role`}
125 |                   render={({ field }) => (
126 |                     <FormItem>
127 |                       <Select
128 |                         onValueChange={field.onChange}
129 |                         defaultValue={field.value}
130 |                       >
131 |                         <FormControl>
132 |                           <SelectTrigger>
133 |                             <SelectValue placeholder="Select role" />
134 |                           </SelectTrigger>
135 |                         </FormControl>
136 |                         <SelectContent>
137 |                           <SelectItem value="owner">Owner</SelectItem>
138 |                           <SelectItem value="member">Member</SelectItem>
139 |                         </SelectContent>
140 |                       </Select>
141 |                     </FormItem>
142 |                   )}
143 |                 />
144 |               </div>
145 |             ))}
146 |
147 |             <Button
148 |               variant="outline"
149 |               type="button"
150 |               className="mt-4 space-x-1"
151 |               onClick={() => append({ email: undefined, role: "member" })}
152 |             >
153 |               <Icons.Add />
154 |               <span>Add more</span>
155 |             </Button>
156 |             <DialogFooter className="border-t-[1px] pt-4 mt-8 items-center !justify-between">
157 |               <div>
158 |                 {Object.values(form.formState.errors).length > 0 && (
159 |                   <span className="text-sm text-destructive">
160 |                     Please complete the fields above.
161 |                   </span>
162 |                 )}
163 |               </div>
164 |               <Button
165 |                 type="submit"
166 |                 disabled={inviteMembers.status === "executing"}
167 |                 className="w-full md:w-auto"
168 |               >
169 |                 {inviteMembers.status === "executing" ? (
170 |                   <Loader2 className="h-4 w-4 animate-spin" />
171 |                 ) : (
172 |                   "Invite"
173 |                 )}
174 |               </Button>
175 |             </DialogFooter>
176 |           </div>
177 |         </form>
178 |       </Form>
179 |     </DialogContent>
180 |   );
181 | }
```

apps/dashboard/src/components/modals/overview-modal.tsx
```
1 | "use client";
2 |
3 | import { hideConnectFlowAction } from "@/actions/hide-connect-flow-action";
4 | import { AddAccountButton } from "@/components/add-account-button";
5 | import { cn } from "@midday/ui/cn";
6 | import { Dialog, DialogContent } from "@midday/ui/dialog";
7 | import { useAction } from "next-safe-action/hooks";
8 | import Image from "next/image";
9 | import OverViewScreenOneLight from "public/assets/overview-1-light.png";
10 | import OverViewScreenOne from "public/assets/overview-1.png";
11 | import OverViewScreenTwoLight from "public/assets/overview-2-light.png";
12 | import OverViewScreenTwo from "public/assets/overview-2.png";
13 | import { Fragment, useState } from "react";
14 |
15 | const images = [
16 |   { id: 1, src: OverViewScreenOne, src2: OverViewScreenOneLight },
17 |   { id: 2, src: OverViewScreenTwo, src2: OverViewScreenTwoLight },
18 | ];
19 |
20 | export function OverviewModal({
21 |   defaultOpen = false,
22 | }: { defaultOpen?: boolean }) {
23 |   const [activeId, setActive] = useState(1);
24 |   const [isOpen, setIsOpen] = useState(defaultOpen);
25 |
26 |   const hideConnectFlow = useAction(hideConnectFlowAction);
27 |
28 |   const handleOnOpenChange = () => {
29 |     setIsOpen(!isOpen);
30 |
31 |     if (isOpen) {
32 |       hideConnectFlow.execute();
33 |     }
34 |   };
35 |
36 |   return (
37 |     <Dialog
38 |       defaultOpen={defaultOpen}
39 |       open={isOpen}
40 |       onOpenChange={handleOnOpenChange}
41 |     >
42 |       <DialogContent
43 |         onInteractOutside={(e) => {
44 |           e.preventDefault();
45 |         }}
46 |       >
47 |         <div className="bg-background p-2">
48 |           <div className="p-4">
49 |             <div className="mb-8 space-y-5">
50 |               <h2 className="font-medium text-xl">
51 |                 Get insights of your business you didn't know
52 |               </h2>
53 |               <p className="text-[#878787] text-sm">
54 |                 View real-time profit/revenue as well as revenue numbers.
55 |                 Compare to previous years. See what you spend your money on and
56 |                 where you can save.
57 |               </p>
58 |             </div>
59 |
60 |             <div className="pb-8 relative h-[272px]">
61 |               {images.map((image) => (
62 |                 <Fragment key={image.id}>
63 |                   <Image
64 |                     quality={100}
65 |                     src={image.src}
66 |                     width={486}
67 |                     height={251}
68 |                     alt="Overview"
69 |                     className={cn(
70 |                       "w-full opacity-0 absolute transition-all hidden dark:block",
71 |                       image.id === activeId && "opacity-1",
72 |                     )}
73 |                   />
74 |
75 |                   <Image
76 |                     quality={100}
77 |                     src={image.src2}
78 |                     width={486}
79 |                     height={251}
80 |                     alt="Overview"
81 |                     className={cn(
82 |                       "w-full opacity-0 absolute transition-all block dark:hidden",
83 |                       image.id === activeId && "opacity-1",
84 |                     )}
85 |                   />
86 |                 </Fragment>
87 |               ))}
88 |             </div>
89 |
90 |             <div className="flex justify-between mt-12 items-center">
91 |               <div className="flex space-x-2">
92 |                 {images.map((image) => (
93 |                   <button
94 |                     type="button"
95 |                     onMouseEnter={() => setActive(image.id)}
96 |                     onClick={() => setActive(image.id)}
97 |                     key={image.id}
98 |                     className={cn(
99 |                       "w-[16px] h-[6px] rounded-full bg-[#1D1D1D] dark:bg-[#D9D9D9] opacity-30 transition-all cursor-pointer",
100 |                       image.id === activeId && "opacity-1",
101 |                     )}
102 |                   />
103 |                 ))}
104 |               </div>
105 |
106 |               <AddAccountButton onClick={handleOnOpenChange} />
107 |             </div>
108 |           </div>
109 |         </div>
110 |       </DialogContent>
111 |     </Dialog>
112 |   );
113 | }
```

apps/dashboard/src/components/modals/select-bank-accounts.tsx
```
1 | "use client";
2 |
3 | import { connectBankAccountAction } from "@/actions/connect-bank-account-action";
4 | import { getAccounts } from "@/actions/institutions/get-accounts";
5 | import { connectBankAccountSchema } from "@/actions/schema";
6 | import { sendSupportAction } from "@/actions/send-support-action";
7 | import { useConnectParams } from "@/hooks/use-connect-params";
8 | import { useI18n } from "@/locales/client";
9 | import { getInitials } from "@/utils/format";
10 | import { zodResolver } from "@hookform/resolvers/zod";
11 | import { Avatar, AvatarFallback } from "@midday/ui/avatar";
12 | import { Button } from "@midday/ui/button";
13 | import {
14 |   Dialog,
15 |   DialogContent,
16 |   DialogDescription,
17 |   DialogHeader,
18 |   DialogTitle,
19 | } from "@midday/ui/dialog";
20 | import {
21 |   Form,
22 |   FormControl,
23 |   FormField,
24 |   FormItem,
25 |   FormLabel,
26 | } from "@midday/ui/form";
27 | import { Icons } from "@midday/ui/icons";
28 | import { Skeleton } from "@midday/ui/skeleton";
29 | import { Switch } from "@midday/ui/switch";
30 | import { Tabs, TabsContent } from "@midday/ui/tabs";
31 | import { Textarea } from "@midday/ui/textarea";
32 | import { useToast } from "@midday/ui/use-toast";
33 | import { Loader2 } from "lucide-react";
34 | import { useAction } from "next-safe-action/hooks";
35 | import { useEffect, useState } from "react";
36 | import { useForm } from "react-hook-form";
37 | import z from "zod";
38 | import { FormatAmount } from "../format-amount";
39 | import { LoadingTransactionsEvent } from "../loading-transactions-event";
40 |
41 | type Account = {
42 |   id: string;
43 |   name: string;
44 |   balance: number;
45 |   currency: string;
46 |   type: string;
47 |   subtype: string;
48 |   mask: string;
49 |   institution: {
50 |     id: string;
51 |     name: string;
52 |   };
53 | };
54 |
55 | function RowsSkeleton() {
56 |   return (
57 |     <div className="space-y-6">
58 |       <div className="flex items-center space-x-4">
59 |         <Skeleton className="h-9 w-9 rounded-full" />
60 |         <div className="space-y-2">
61 |           <Skeleton className="h-3.5 w-[210px] rounded-none" />
62 |           <Skeleton className="h-2.5 w-[180px] rounded-none" />
63 |         </div>
64 |       </div>
65 |       <div className="flex items-center space-x-4">
66 |         <Skeleton className="h-9 w-9 rounded-full" />
67 |         <div className="space-y-2">
68 |           <Skeleton className="h-3.5 w-[250px] rounded-none" />
69 |           <Skeleton className="h-2.5 w-[200px] rounded-none" />
70 |         </div>
71 |       </div>
72 |     </div>
73 |   );
74 | }
75 |
76 | function SupportForm() {
77 |   const form = useForm({
78 |     resolver: zodResolver(z.object({ message: z.string() })),
79 |     defaultValues: {
80 |       message: "",
81 |     },
82 |   });
83 |
84 |   const sendSupport = useAction(sendSupportAction, {
85 |     onSuccess: () => {
86 |       form.reset();
87 |     },
88 |   });
89 |
90 |   const handleOnSubmit = form.handleSubmit((values) => {
91 |     sendSupport.execute({
92 |       message: values.message,
93 |       type: "bank-connection",
94 |       priority: "3",
95 |       subject: "Select bank accounts",
96 |       url: document.URL,
97 |     });
98 |   });
99 |
100 |   if (sendSupport.status === "hasSucceeded") {
101 |     return (
102 |       <div className="h-[250px] flex items-center justify-center flex-col space-y-1">
103 |         <p className="font-medium text-sm">Thank you!</p>
104 |         <p className="text-sm text-[#4C4C4C]">
105 |           We will be back with you as soon as possible.
106 |         </p>
107 |       </div>
108 |     );
109 |   }
110 |
111 |   return (
112 |     <Form {...form}>
113 |       <form onSubmit={handleOnSubmit}>
114 |         <FormField
115 |           control={form.control}
116 |           name="message"
117 |           render={({ field }) => (
118 |             <FormItem>
119 |               <FormLabel>Message</FormLabel>
120 |               <FormControl>
121 |                 <Textarea
122 |                   placeholder="Describe the issue you're facing, along with any relevant information. Please be as detailed and specific as possible."
123 |                   className="resize-none min-h-[150px]"
124 |                   autoFocus
125 |                   {...field}
126 |                 />
127 |               </FormControl>
128 |             </FormItem>
129 |           )}
130 |         />
131 |
132 |         <div className="flex justify-end">
133 |           <Button
134 |             type="submit"
135 |             disabled={
136 |               sendSupport.status === "executing" || !form.formState.isValid
137 |             }
138 |             className="mt-4"
139 |           >
140 |             {sendSupport.status === "executing" ? (
141 |               <Loader2 className="h-4 w-4 animate-spin" />
142 |             ) : (
143 |               "Submit"
144 |             )}
145 |           </Button>
146 |         </div>
147 |       </form>
148 |     </Form>
149 |   );
150 | }
151 |
152 | export function SelectBankAccountsModal() {
153 |   const { toast } = useToast();
154 |   const t = useI18n();
155 |
156 |   const [accounts, setAccounts] = useState<Account[]>([]);
[TRUNCATED]
```

apps/dashboard/src/components/modals/transactions-modal.tsx
```
1 | "use client";
2 |
3 | import { hideConnectFlowAction } from "@/actions/hide-connect-flow-action";
4 | import { AddAccountButton } from "@/components/add-account-button";
5 | import { cn } from "@midday/ui/cn";
6 | import { Dialog, DialogContent } from "@midday/ui/dialog";
7 | import { useAction } from "next-safe-action/hooks";
8 | import Image from "next/image";
9 | import TransactionsScreenOneLight from "public/assets/transactions-1-light.png";
10 | import TransactionsScreenOne from "public/assets/transactions-1.png";
11 | import TransactionsScreenTwoLight from "public/assets/transactions-2-light.png";
12 | import TransactionsScreenTwo from "public/assets/transactions-2.png";
13 | import { Fragment, useState } from "react";
14 |
15 | const images = [
16 |   { id: 1, src: TransactionsScreenOne, src2: TransactionsScreenOneLight },
17 |   { id: 2, src: TransactionsScreenTwo, src2: TransactionsScreenTwoLight },
18 | ];
19 |
20 | export function TransactionsModal({
21 |   defaultOpen = false,
22 | }: {
23 |   defaultOpen?: boolean;
24 | }) {
25 |   const [activeId, setActive] = useState(1);
26 |   const [isOpen, setIsOpen] = useState(defaultOpen);
27 |
28 |   const hideConnectFlow = useAction(hideConnectFlowAction);
29 |
30 |   const handleOnOpenChange = () => {
31 |     setIsOpen(!isOpen);
32 |
33 |     if (isOpen) {
34 |       hideConnectFlow.execute();
35 |     }
36 |   };
37 |
38 |   return (
39 |     <Dialog
40 |       defaultOpen={defaultOpen}
41 |       open={isOpen}
42 |       onOpenChange={handleOnOpenChange}
43 |     >
44 |       <DialogContent
45 |         onInteractOutside={(e) => {
46 |           e.preventDefault();
47 |         }}
48 |       >
49 |         <div className="bg-background p-2">
50 |           <div className="p-4">
51 |             <div className="mb-8 space-y-5">
52 |               <h2 className="font-medium text-xl">
53 |                 Get real-time transaction data
54 |               </h2>
55 |               <p className="text-[#878787] text-sm">
56 |                 Get instant transaction insights. Easily spot missing receipts,
57 |                 categorize expenses, and reconcile everything seamlessly for
58 |                 accounting.
59 |               </p>
60 |             </div>
61 |
62 |             <div className="pb-8 relative h-[272px]">
63 |               {images.map((image) => (
64 |                 <Fragment key={image.id}>
65 |                   <Image
66 |                     quality={100}
67 |                     src={image.src}
68 |                     width={486}
69 |                     height={251}
70 |                     alt="Overview"
71 |                     className={cn(
72 |                       "w-full opacity-0 absolute transition-all hidden dark:block",
73 |                       image.id === activeId && "opacity-1",
74 |                     )}
75 |                   />
76 |
77 |                   <Image
78 |                     quality={100}
79 |                     src={image.src2}
80 |                     width={486}
81 |                     height={251}
82 |                     alt="Overview"
83 |                     className={cn(
84 |                       "w-full opacity-0 absolute transition-all block dark:hidden",
85 |                       image.id === activeId && "opacity-1",
86 |                     )}
87 |                   />
88 |                 </Fragment>
89 |               ))}
90 |             </div>
91 |
92 |             <div className="flex justify-between mt-12 items-center">
93 |               <div className="flex space-x-2">
94 |                 {images.map((image) => (
95 |                   <button
96 |                     type="button"
97 |                     onMouseEnter={() => setActive(image.id)}
98 |                     onClick={() => setActive(image.id)}
99 |                     key={image.id}
100 |                     className={cn(
101 |                       "w-[16px] h-[6px] rounded-full bg-[#1D1D1D] dark:bg-[#D9D9D9] opacity-30 transition-all cursor-pointer",
102 |                       image.id === activeId && "opacity-1",
103 |                     )}
104 |                   />
105 |                 ))}
106 |               </div>
107 |
108 |               <AddAccountButton />
109 |             </div>
110 |           </div>
111 |         </div>
112 |       </DialogContent>
113 |     </Dialog>
114 |   );
115 | }
```

apps/dashboard/src/components/modals/vault-settings-modal.tsx
```
1 | "use client";
2 |
3 | import { Button } from "@midday/ui/button";
4 | import {
5 |   DialogContent,
6 |   DialogDescription,
7 |   DialogHeader,
8 |   DialogTitle,
9 | } from "@midday/ui/dialog";
10 | import { Dialog } from "@midday/ui/dialog";
11 | import { Icons } from "@midday/ui/icons";
12 | import { useState } from "react";
13 | import { VaultSettings } from "../vault-settings";
14 |
15 | type Props = {
16 |   documentClassification: boolean;
17 | };
18 |
19 | export function VaultSettingsModal({ documentClassification }: Props) {
20 |   const [open, setOpen] = useState(false);
21 |
22 |   return (
23 |     <Dialog open={open} onOpenChange={setOpen}>
24 |       <div>
25 |         <Button variant="outline" size="icon" onClick={() => setOpen(true)}>
26 |           <Icons.Settings />
27 |         </Button>
28 |       </div>
29 |
30 |       <DialogContent
31 |         className="max-w-[455px]"
32 |         onOpenAutoFocus={(evt) => evt.preventDefault()}
33 |       >
34 |         <div className="p-4">
35 |           <DialogHeader className="mb-8">
36 |             <DialogTitle>Settings</DialogTitle>
37 |             <DialogDescription>
38 |               Make changes to your vault here. Click save when you're done.
39 |             </DialogDescription>
40 |           </DialogHeader>
41 |
42 |           <VaultSettings
43 |             documentClassification={documentClassification}
44 |             onSuccess={() => setOpen(false)}
45 |           />
46 |         </div>
47 |       </DialogContent>
48 |     </Dialog>
49 |   );
50 | }
```

apps/dashboard/src/components/sheets/create-transaction-sheet.tsx
```
1 | "use client";
2 |
3 | import { CreateTransactionForm } from "@/components/forms/create-transaction-form";
4 | import { Drawer, DrawerContent } from "@midday/ui/drawer";
5 | import { useMediaQuery } from "@midday/ui/hooks";
6 | import { ScrollArea } from "@midday/ui/scroll-area";
7 | import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@midday/ui/sheet";
8 | import { useQueryState } from "nuqs";
9 | import React from "react";
10 |
11 | export function CreateTransactionSheet({
12 |   categories,
13 |   userId,
14 |   accountId,
15 |   currency,
16 | }: {
17 |   categories: any;
18 |   userId: string;
19 |   accountId: string;
20 |   currency: string;
21 | }) {
22 |   const isDesktop = useMediaQuery("(min-width: 768px)");
23 |   const [open, setOpen] = useQueryState("create-transaction");
24 |
25 |   const isOpen = Boolean(open);
26 |
27 |   const handleOpenChange = (open: boolean) => {
28 |     setOpen(open ? "true" : null);
29 |   };
30 |
31 |   if (isDesktop) {
32 |     return (
33 |       <Sheet open={isOpen} onOpenChange={handleOpenChange}>
34 |         <SheetContent>
35 |           <SheetHeader className="mb-8">
36 |             <SheetTitle>Create Transaction</SheetTitle>
37 |           </SheetHeader>
38 |
39 |           <ScrollArea className="h-full p-0 pb-[100px]" hideScrollbar>
40 |             <CreateTransactionForm
41 |               categories={categories}
42 |               userId={userId}
43 |               accountId={accountId}
44 |               currency={currency}
45 |               onCreate={() => setOpen(null)}
46 |             />
47 |           </ScrollArea>
48 |         </SheetContent>
49 |       </Sheet>
50 |     );
51 |   }
52 |
53 |   return (
54 |     <Drawer open={isOpen} onOpenChange={handleOpenChange}>
55 |       <DrawerContent className="p-6">
56 |         <CreateTransactionForm
57 |           categories={categories}
58 |           userId={userId}
59 |           accountId={accountId}
60 |           currency={currency}
61 |           onCreate={() => setOpen(null)}
62 |         />
63 |       </DrawerContent>
64 |     </Drawer>
65 |   );
66 | }
```

apps/dashboard/src/components/sheets/customer-create-sheet.tsx
```
1 | "use client";
2 |
3 | import { useCustomerParams } from "@/hooks/use-customer-params";
4 | import { Button } from "@midday/ui/button";
5 | import { Icons } from "@midday/ui/icons";
6 | import { Sheet, SheetContent, SheetHeader } from "@midday/ui/sheet";
7 | import React from "react";
8 | import { CustomerForm } from "../forms/customer-form";
9 |
10 | export function CustomerCreateSheet() {
11 |   const { setParams, createCustomer } = useCustomerParams();
12 |
13 |   const isOpen = Boolean(createCustomer);
14 |
15 |   return (
16 |     <Sheet open={isOpen} onOpenChange={() => setParams(null)}>
17 |       <SheetContent stack>
18 |         <SheetHeader className="mb-6 flex justify-between items-center flex-row">
19 |           <h2 className="text-xl">Create Customer</h2>
20 |           <Button
21 |             size="icon"
22 |             variant="ghost"
23 |             onClick={() => setParams(null)}
24 |             className="p-0 m-0 size-auto hover:bg-transparent"
25 |           >
26 |             <Icons.Close className="size-5" />
27 |           </Button>
28 |         </SheetHeader>
29 |
30 |         <CustomerForm />
31 |       </SheetContent>
32 |     </Sheet>
33 |   );
34 | }
```

apps/dashboard/src/components/sheets/customer-edit-sheet.tsx
```
1 | "use client";
2 |
3 | import { deleteCustomerAction } from "@/actions/delete-customer-action";
4 | import { useCustomerParams } from "@/hooks/use-customer-params";
5 | import { createClient } from "@midday/supabase/client";
6 | import { getCustomerQuery } from "@midday/supabase/queries";
7 | import {
8 |   AlertDialog,
9 |   AlertDialogAction,
10 |   AlertDialogCancel,
11 |   AlertDialogContent,
12 |   AlertDialogDescription,
13 |   AlertDialogFooter,
14 |   AlertDialogHeader,
15 |   AlertDialogTitle,
16 |   AlertDialogTrigger,
17 | } from "@midday/ui/alert-dialog";
18 | import {
19 |   DropdownMenu,
20 |   DropdownMenuContent,
21 |   DropdownMenuItem,
22 |   DropdownMenuTrigger,
23 | } from "@midday/ui/dropdown-menu";
24 | import { Icons } from "@midday/ui/icons";
25 | import { Sheet, SheetContent, SheetHeader } from "@midday/ui/sheet";
26 | import { useAction } from "next-safe-action/hooks";
27 | import React, { useEffect, useState } from "react";
28 | import { CustomerForm } from "../forms/customer-form";
29 | import type { Customer } from "../invoice/customer-details";
30 |
31 | export function CustomerEditSheet() {
32 |   const [customer, setCustomer] = useState<Customer | null>(null);
33 |   const { setParams, customerId } = useCustomerParams();
34 |
35 |   const isOpen = Boolean(customerId);
36 |   const supabase = createClient();
37 |
38 |   const deleteCustomer = useAction(deleteCustomerAction, {
39 |     onSuccess: () => {
40 |       setParams({
41 |         customerId: null,
42 |       });
43 |     },
44 |   });
45 |
46 |   useEffect(() => {
47 |     async function fetchCustomer() {
48 |       if (customerId) {
49 |         const { data } = await getCustomerQuery(supabase, customerId);
50 |
51 |         if (data) {
52 |           setCustomer(data as Customer);
53 |         }
54 |       }
55 |     }
56 |
57 |     if (customerId) {
58 |       fetchCustomer();
59 |     } else {
60 |       setCustomer(null);
61 |     }
62 |   }, [customerId, supabase]);
63 |
64 |   return (
65 |     <Sheet open={isOpen} onOpenChange={() => setParams(null)}>
66 |       <SheetContent stack>
67 |         <SheetHeader className="mb-6 flex justify-between items-center flex-row">
68 |           <h2 className="text-xl">Edit Customer</h2>
69 |
70 |           {customerId && (
71 |             <DropdownMenu>
72 |               <DropdownMenuTrigger asChild>
73 |                 <button type="button">
74 |                   <Icons.MoreVertical className="size-5" />
75 |                 </button>
76 |               </DropdownMenuTrigger>
77 |               <DropdownMenuContent sideOffset={10} align="end">
78 |                 <AlertDialog>
79 |                   <AlertDialogTrigger asChild>
80 |                     <DropdownMenuItem
81 |                       className="text-destructive"
82 |                       onSelect={(e) => e.preventDefault()}
83 |                     >
84 |                       Delete
85 |                     </DropdownMenuItem>
86 |                   </AlertDialogTrigger>
87 |                   <AlertDialogContent>
88 |                     <AlertDialogHeader>
89 |                       <AlertDialogTitle>
90 |                         Are you absolutely sure?
91 |                       </AlertDialogTitle>
92 |                       <AlertDialogDescription>
93 |                         This action cannot be undone. This will permanently
94 |                         delete the customer and remove their data from our
95 |                         servers.
96 |                       </AlertDialogDescription>
97 |                     </AlertDialogHeader>
98 |                     <AlertDialogFooter>
99 |                       <AlertDialogCancel>Cancel</AlertDialogCancel>
100 |                       <AlertDialogAction
101 |                         onClick={() =>
102 |                           deleteCustomer.execute({ id: customerId })
103 |                         }
104 |                       >
105 |                         Delete
106 |                       </AlertDialogAction>
107 |                     </AlertDialogFooter>
108 |                   </AlertDialogContent>
109 |                 </AlertDialog>
110 |               </DropdownMenuContent>
111 |             </DropdownMenu>
112 |           )}
113 |         </SheetHeader>
114 |
115 |         <CustomerForm data={customer} />
116 |       </SheetContent>
117 |     </Sheet>
118 |   );
119 | }
```

apps/dashboard/src/components/sheets/global-sheets.tsx
```
1 | import { Cookies } from "@/utils/constants";
2 | import { getUser } from "@midday/supabase/cached-queries";
3 | import { cookies } from "next/headers";
4 | import { Suspense } from "react";
5 | import { CustomerCreateSheet } from "./customer-create-sheet";
6 | import { CustomerEditSheet } from "./customer-edit-sheet";
7 | import { InvoiceCommentsSheet } from "./invoice-comments";
8 | import { InvoiceCreateSheetServer } from "./invoice-create-sheet.server";
9 | import { TrackerSheetsServer } from "./tracker-sheets.server";
10 |
11 | type Props = {
12 |   defaultCurrency: string;
13 | };
14 |
15 | export async function GlobalSheets({ defaultCurrency }: Props) {
16 |   const { data: userData } = await getUser();
17 |
18 |   return (
19 |     <>
20 |       <Suspense fallback={null}>
21 |         <TrackerSheetsServer
22 |           teamId={userData?.team_id}
23 |           userId={userData?.id}
24 |           timeFormat={userData?.time_format}
25 |           defaultCurrency={defaultCurrency}
26 |         />
27 |       </Suspense>
28 |
29 |       <CustomerCreateSheet />
30 |       <CustomerEditSheet />
31 |       <InvoiceCommentsSheet />
32 |
33 |       <Suspense fallback={null}>
34 |         {/* We preload the invoice data (template, invoice number etc) */}
35 |         <InvoiceCreateSheetServer teamId={userData?.team_id} />
36 |       </Suspense>
37 |     </>
38 |   );
39 | }
```

apps/dashboard/src/components/sheets/invoice-comments.tsx
```
1 | "use client";
2 |
3 | import { useInvoiceParams } from "@/hooks/use-invoice-params";
4 | // import { createClient } from "@midday/supabase/client";
5 | // import { getCustomerQuery } from "@midday/supabase/queries";
6 |
7 | import { Sheet, SheetContent, SheetHeader } from "@midday/ui/sheet";
8 | import React, { useEffect, useState } from "react";
9 | import { InvoiceComments } from "../invoice-comments";
10 |
11 | export function InvoiceCommentsSheet() {
12 |   //   const [customer, setCustomer] = useState<Customer | null>(null);
13 |   const { setParams, invoiceId, type } = useInvoiceParams();
14 |
15 |   const isOpen = Boolean(invoiceId && type === "comments");
16 |   //   const supabase = createClient();
17 |
18 |   //   useEffect(() => {
19 |   //     async function fetchCustomer() {
20 |   //       const { data } = await getCustomerQuery(supabase, customerId);
21 |
22 |   //       if (data) {
23 |   //         setCustomer(data);
24 |   //       }
25 |   //     }
26 |
27 |   //     if (customerId) {
28 |   //       fetchCustomer();
29 |   //     }
30 |   //   }, [customerId]);
31 |
32 |   return (
33 |     <Sheet open={isOpen} onOpenChange={() => setParams(null)}>
34 |       <SheetContent>
35 |         <SheetHeader className="mb-10 flex justify-between items-center flex-row">
36 |           <h2 className="text-xl">Comments</h2>
37 |         </SheetHeader>
38 |
39 |         <InvoiceComments />
40 |       </SheetContent>
41 |     </Sheet>
42 |   );
43 | }
```

apps/dashboard/src/components/sheets/invoice-create-sheet.server.tsx
```
1 | import { getDefaultSettings } from "@midday/invoice/default";
2 | import {
3 |   getCustomers,
4 |   getInvoiceTemplates,
5 |   getLastInvoiceNumber,
6 | } from "@midday/supabase/cached-queries";
7 | import { InvoiceCreateSheet } from "./invoice-create-sheet";
8 |
9 | export async function InvoiceCreateSheetServer({ teamId }: { teamId: string }) {
10 |   const [
11 |     { data: templatesData },
12 |     { data: customersData },
13 |     { data: invoiceNumber },
14 |   ] = await Promise.all([
15 |     getInvoiceTemplates(),
16 |     getCustomers(),
17 |     getLastInvoiceNumber(),
18 |   ]);
19 |
20 |   const defaultSettings = await getDefaultSettings();
21 |
22 |   // Filter out null values
23 |   const template = templatesData
24 |     ? Object.fromEntries(
25 |         Object.entries(templatesData).filter(([_, value]) => value !== null),
26 |       )
27 |     : {};
28 |
29 |   return (
30 |     <InvoiceCreateSheet
31 |       teamId={teamId}
32 |       customers={customersData}
33 |       template={template}
34 |       defaultSettings={defaultSettings}
35 |       invoiceNumber={invoiceNumber}
36 |     />
37 |   );
38 | }
```

apps/dashboard/src/components/sheets/invoice-create-sheet.tsx
```
1 | "use client";
2 |
3 | import type { InvoiceTemplate } from "@/actions/invoice/schema";
4 | import { useInvoiceParams } from "@/hooks/use-invoice-params";
5 | import type { Settings } from "@midday/invoice/default";
6 | import { Sheet } from "@midday/ui/sheet";
7 | import React from "react";
8 | import type { Customer } from "../invoice/customer-details";
9 | import { FormContext } from "../invoice/form-context";
10 | import { InvoiceSheetContent } from "./invoice-sheet-content";
11 |
12 | type Props = {
13 |   teamId: string;
14 |   template: InvoiceTemplate;
15 |   customers: Customer[];
16 |   defaultSettings: Settings;
17 |   invoiceNumber: string | null;
18 | };
19 |
20 | export function InvoiceCreateSheet({
21 |   teamId,
22 |   template,
23 |   customers,
24 |   defaultSettings,
25 |   invoiceNumber,
26 | }: Props) {
27 |   const { setParams, type, invoiceId } = useInvoiceParams();
28 |   const isOpen = Boolean(type === "create" || type === "edit");
29 |
30 |   return (
31 |     <FormContext
32 |       template={template}
33 |       invoiceNumber={invoiceNumber}
34 |       isOpen={isOpen}
35 |       id={invoiceId}
36 |       defaultSettings={defaultSettings}
37 |     >
38 |       <Sheet open={isOpen} onOpenChange={() => setParams(null)}>
39 |         <InvoiceSheetContent
40 |           teamId={teamId}
41 |           customers={customers}
42 |           invoiceNumber={invoiceNumber}
43 |         />
44 |       </Sheet>
45 |     </FormContext>
46 |   );
47 | }
```

apps/dashboard/src/components/sheets/invoice-details-sheet.tsx
```
1 | import { useInvoiceParams } from "@/hooks/use-invoice-params";
2 | import { Drawer, DrawerContent } from "@midday/ui/drawer";
3 | import { useMediaQuery } from "@midday/ui/hooks";
4 | import { Sheet, SheetContent } from "@midday/ui/sheet";
5 | import React from "react";
6 | import { InvoiceDetails } from "../invoice-details";
7 | import type { Invoice } from "../tables/invoices/columns";
8 |
9 | type Props = {
10 |   setOpen: (id?: string) => void;
11 |   isOpen: boolean;
12 |   data?: Invoice;
13 |   locale: string;
14 | };
15 |
16 | export function InvoiceDetailsSheet({ setOpen, isOpen, data, locale }: Props) {
17 |   const isDesktop = useMediaQuery("(min-width: 768px)");
18 |   const { invoiceId } = useInvoiceParams();
19 |
20 |   if (isDesktop) {
21 |     return (
22 |       <Sheet open={isOpen} onOpenChange={setOpen}>
23 |         <SheetContent>
24 |           <InvoiceDetails id={invoiceId} data={data} />
25 |         </SheetContent>
26 |       </Sheet>
27 |     );
28 |   }
29 |
30 |   return (
31 |     <Drawer
32 |       open={isOpen}
33 |       onOpenChange={(open: boolean) => {
34 |         if (!open) {
35 |           setOpen(undefined);
36 |         }
37 |       }}
38 |     >
39 |       <DrawerContent className="p-6">
40 |         <InvoiceDetails id={invoiceId} data={data} />
41 |       </DrawerContent>
42 |     </Drawer>
43 |   );
44 | }
```

apps/dashboard/src/components/sheets/invoice-sheet-content.tsx
```
1 | "use client";
2 |
3 | import { createInvoiceAction } from "@/actions/invoice/create-invoice-action";
4 | import { useInvoiceParams } from "@/hooks/use-invoice-params";
5 | import { Button } from "@midday/ui/button";
6 | import { SheetContent, SheetHeader } from "@midday/ui/sheet";
7 | import { useAction } from "next-safe-action/hooks";
8 | import { useEffect, useState } from "react";
9 | import { useFormContext } from "react-hook-form";
10 | import { InvoiceSuccessful } from "../invoice-successful";
11 | import type { Customer } from "../invoice/customer-details";
12 | import { Form } from "../invoice/form";
13 | import { SettingsMenu } from "../invoice/settings-menu";
14 | import { OpenURL } from "../open-url";
15 | import type { Invoice } from "../tables/invoices/columns";
16 |
17 | function InvoiceSheetHeader({
18 |   type,
19 | }: { type: "created" | "created_and_sent" }) {
20 |   if (type === "created") {
21 |     return (
22 |       <SheetHeader className="mb-6 flex flex-col">
23 |         <h2 className="text-xl">Created</h2>
24 |         <p className="text-sm text-[#808080]">
25 |           Your invoice was created successfully
26 |         </p>
27 |       </SheetHeader>
28 |     );
29 |   }
30 |
31 |   if (type === "created_and_sent") {
32 |     return (
33 |       <SheetHeader className="mb-6 flex flex-col">
34 |         <h2 className="text-xl">Created & Sent</h2>
35 |         <p className="text-sm text-[#808080]">
36 |           Your invoice was created and sent successfully
37 |         </p>
38 |       </SheetHeader>
39 |     );
40 |   }
41 |
42 |   return null;
43 | }
44 |
45 | type Props = {
46 |   teamId: string;
47 |   customers: Customer[];
48 |   invoiceNumber: string | null;
49 | };
50 |
51 | export function InvoiceSheetContent({
52 |   teamId,
53 |   customers,
54 |   invoiceNumber,
55 | }: Props) {
56 |   const { setParams, type } = useInvoiceParams();
57 |   const [invoice, setInvoice] = useState<Invoice | null>(null);
58 |
59 |   const createInvoice = useAction(createInvoiceAction, {
60 |     onSuccess: ({ data }) => {
61 |       setInvoice(data);
62 |     },
63 |   });
64 |
65 |   const { watch } = useFormContext();
66 |   const templateSize = watch("template.size");
67 |   const deliveryType = watch("template.delivery_type");
68 |
69 |   const size = templateSize === "a4" ? 650 : 740;
70 |   const isOpen = Boolean(type === "create" || type === "edit");
71 |
72 |   useEffect(() => {
73 |     setInvoice(null);
74 |   }, [isOpen]);
75 |
76 |   if (invoice && invoice.status !== "draft") {
77 |     return (
78 |       <SheetContent className="bg-white dark:bg-[#0C0C0C] transition-[max-width] duration-300 ease-in-out">
79 |         <InvoiceSheetHeader
80 |           type={
81 |             invoice?.template.delivery_type === "create_and_send"
82 |               ? "created_and_sent"
83 |               : "created"
84 |           }
85 |         />
86 |
87 |         <div className="flex flex-col justify-center h-[calc(100vh-260px)]">
88 |           <InvoiceSuccessful invoice={invoice} />
89 |         </div>
90 |
91 |         <div className="flex mt-auto absolute bottom-6 justify-end gap-4 right-6 left-6">
92 |           <OpenURL href={`${window.location.origin}/i/${invoice.token}`}>
93 |             <Button variant="secondary">View invoice</Button>
94 |           </OpenURL>
95 |
96 |           <Button
97 |             onClick={() => {
98 |               setInvoice(null);
99 |               setParams(null, { shallow: false });
100 |
101 |               setTimeout(() => {
102 |                 setParams({ type: "create" });
103 |               }, 600);
104 |             }}
105 |           >
106 |             Create another
107 |           </Button>
108 |         </div>
109 |       </SheetContent>
110 |     );
111 |   }
112 |
113 |   return (
114 |     <SheetContent
115 |       style={{ maxWidth: size }}
116 |       className="bg-white dark:bg-[#0C0C0C] transition-[max-width] duration-300 ease-in-out"
117 |     >
118 |       <SheetHeader className="mb-6 flex justify-between items-center flex-row">
119 |         <div className="ml-auto">
120 |           <SettingsMenu />
121 |         </div>
122 |       </SheetHeader>
123 |
124 |       <Form
125 |         teamId={teamId}
126 |         customers={customers}
127 |         isSubmitting={createInvoice.isPending}
128 |         onSubmit={({ id }) => createInvoice.execute({ id, deliveryType })}
129 |         invoiceNumber={invoiceNumber}
130 |       />
131 |     </SheetContent>
132 |   );
133 | }
```

apps/dashboard/src/components/sheets/tracker-create-sheet.tsx
```
1 | "use client";
2 |
3 | import { createProjectAction } from "@/actions/project/create-project-action";
4 | import { createProjectSchema } from "@/actions/schema";
5 | import { TrackerProjectForm } from "@/components/forms/tracker-project-form";
6 | import type { Customer } from "@/components/invoice/customer-details";
7 | import { useTrackerParams } from "@/hooks/use-tracker-params";
8 | import { zodResolver } from "@hookform/resolvers/zod";
9 | import { Drawer, DrawerContent, DrawerHeader } from "@midday/ui/drawer";
10 | import { useMediaQuery } from "@midday/ui/hooks";
11 | import { ScrollArea } from "@midday/ui/scroll-area";
12 | import { Sheet, SheetContent, SheetHeader } from "@midday/ui/sheet";
13 | import { useToast } from "@midday/ui/use-toast";
14 | import { useAction } from "next-safe-action/hooks";
15 | import React from "react";
16 | import { useForm } from "react-hook-form";
17 | import type { z } from "zod";
18 |
19 | type Props = {
20 |   currencyCode: string;
21 |   customers: Customer[];
22 | };
23 |
24 | export function TrackerCreateSheet({ currencyCode, customers }: Props) {
25 |   const { toast } = useToast();
26 |   const isDesktop = useMediaQuery("(min-width: 768px)");
27 |   const { setParams, create } = useTrackerParams();
28 |
29 |   const isOpen = create;
30 |
31 |   const form = useForm<z.infer<typeof createProjectSchema>>({
32 |     resolver: zodResolver(createProjectSchema),
33 |     defaultValues: {
34 |       name: undefined,
35 |       description: undefined,
36 |       rate: undefined,
37 |       status: "in_progress",
38 |       billable: false,
39 |       estimate: 0,
40 |       currency: currencyCode,
41 |       customer_id: undefined,
42 |     },
43 |   });
44 |
45 |   const action = useAction(createProjectAction, {
46 |     onSuccess: () => {
47 |       setParams({ create: null });
48 |       form.reset();
49 |     },
50 |     onError: () => {
51 |       toast({
52 |         duration: 3500,
53 |         variant: "error",
54 |         title: "Something went wrong please try again.",
55 |       });
56 |     },
57 |   });
58 |
59 |   if (isDesktop) {
60 |     return (
61 |       <Sheet open={isOpen} onOpenChange={() => setParams({ create: null })}>
62 |         <SheetContent>
63 |           <SheetHeader className="mb-8 flex justify-between items-center flex-row">
64 |             <h2 className="text-xl">Create Project</h2>
65 |           </SheetHeader>
66 |
67 |           <ScrollArea className="h-full p-0 pb-28" hideScrollbar>
68 |             <TrackerProjectForm
69 |               isSaving={action.status === "executing"}
70 |               onSubmit={action.execute}
71 |               form={form}
72 |               customers={customers}
73 |             />
74 |           </ScrollArea>
75 |         </SheetContent>
76 |       </Sheet>
77 |     );
78 |   }
79 |
80 |   return (
81 |     <Drawer
82 |       open={isOpen}
83 |       onOpenChange={(open: boolean) => {
84 |         if (!open) {
85 |           setParams({ create: null });
86 |         }
87 |       }}
88 |     >
89 |       <DrawerContent className="p-6">
90 |         <DrawerHeader className="mb-8 flex justify-between items-center flex-row">
91 |           <h2 className="text-xl">Create Project</h2>
92 |         </DrawerHeader>
93 |
94 |         <TrackerProjectForm
95 |           isSaving={action.status === "executing"}
96 |           onSubmit={action.execute}
97 |           form={form}
98 |           customers={customers}
99 |         />
100 |       </DrawerContent>
101 |     </Drawer>
102 |   );
103 | }
```

apps/dashboard/src/components/sheets/tracker-schedule-sheet.tsx
```
1 | "use client";
2 |
3 | import { useTrackerParams } from "@/hooks/use-tracker-params";
4 | import { Drawer, DrawerContent } from "@midday/ui/drawer";
5 | import { useMediaQuery } from "@midday/ui/hooks";
6 | import { Sheet, SheetContent } from "@midday/ui/sheet";
7 | import React from "react";
8 | import { TrackerSchedule } from "../tracker-schedule";
9 |
10 | type Props = {
11 |   teamId: string;
12 |   userId: string;
13 |   timeFormat: number;
14 |   lastProjectId?: string;
15 | };
16 |
17 | export function TrackerScheduleSheet({
18 |   teamId,
19 |   userId,
20 |   timeFormat,
21 |   lastProjectId,
22 | }: Props) {
23 |   const isDesktop = useMediaQuery("(min-width: 768px)");
24 |   const { setParams, projectId, range, selectedDate, update, create } =
25 |     useTrackerParams();
26 |
27 |   const isOpen =
28 |     !update &&
29 |     !create &&
30 |     (Boolean(projectId) || range?.length === 2 || Boolean(selectedDate));
31 |
32 |   if (isDesktop) {
33 |     return (
34 |       <Sheet
35 |         open={isOpen}
36 |         onOpenChange={() =>
37 |           setParams({ projectId: null, range: null, selectedDate: null })
38 |         }
39 |       >
40 |         <SheetContent>
41 |           <TrackerSchedule
42 |             teamId={teamId}
43 |             userId={userId}
44 |             timeFormat={timeFormat}
45 |             projectId={lastProjectId}
46 |           />
47 |         </SheetContent>
48 |       </Sheet>
49 |     );
50 |   }
51 |
52 |   return (
53 |     <Drawer
54 |       open={isOpen}
55 |       onOpenChange={(open: boolean) => {
56 |         if (!open) {
57 |           setParams({ projectId: null, range: null, selectedDate: null });
58 |         }
59 |       }}
60 |     >
61 |       <DrawerContent>
62 |         <TrackerSchedule
63 |           teamId={teamId}
64 |           userId={userId}
65 |           timeFormat={timeFormat}
66 |           projectId={lastProjectId}
67 |         />
68 |       </DrawerContent>
69 |     </Drawer>
70 |   );
71 | }
```

apps/dashboard/src/components/sheets/tracker-sheets.server.tsx
```
1 | import { Cookies } from "@/utils/constants";
2 | import { getCustomers } from "@midday/supabase/cached-queries";
3 | import { cookies } from "next/headers";
4 | import { TrackerCreateSheet } from "./tracker-create-sheet";
5 | import { TrackerScheduleSheet } from "./tracker-schedule-sheet";
6 | import { TrackerUpdateSheet } from "./tracker-update-sheet";
7 |
8 | type Props = {
9 |   teamId: string;
10 |   userId: string;
11 |   timeFormat: number;
12 |   defaultCurrency: string;
13 | };
14 |
15 | export async function TrackerSheetsServer({
16 |   teamId,
17 |   userId,
18 |   timeFormat,
19 |   defaultCurrency,
20 | }: Props) {
21 |   const { data: customers } = await getCustomers();
22 |
23 |   const projectId = cookies().get(Cookies.LastProject)?.value;
24 |
25 |   return (
26 |     <>
27 |       <TrackerUpdateSheet
28 |         teamId={teamId}
29 |         userId={userId}
30 |         customers={customers}
31 |       />
32 |
33 |       <TrackerCreateSheet
34 |         currencyCode={defaultCurrency}
35 |         customers={customers}
36 |       />
37 |
38 |       <TrackerScheduleSheet
39 |         teamId={teamId}
40 |         userId={userId}
41 |         timeFormat={timeFormat}
42 |         lastProjectId={projectId}
43 |       />
44 |     </>
45 |   );
46 | }
```

apps/dashboard/src/components/sheets/tracker-update-sheet.tsx
```
1 | "use client";
2 |
3 | import { deleteProjectAction } from "@/actions/project/delete-project-action";
4 | import { updateProjectAction } from "@/actions/project/update-project-action";
5 | import { updateProjectSchema } from "@/actions/schema";
6 | import { TrackerProjectForm } from "@/components/forms/tracker-project-form";
7 | import type { Customer } from "@/components/invoice/customer-details";
8 | import { useTrackerParams } from "@/hooks/use-tracker-params";
9 | import { zodResolver } from "@hookform/resolvers/zod";
10 | import { createClient } from "@midday/supabase/client";
11 | import { getTrackerProjectQuery } from "@midday/supabase/queries";
12 | import {
13 |   AlertDialog,
14 |   AlertDialogAction,
15 |   AlertDialogCancel,
16 |   AlertDialogContent,
17 |   AlertDialogDescription,
18 |   AlertDialogFooter,
19 |   AlertDialogHeader,
20 |   AlertDialogTitle,
21 |   AlertDialogTrigger,
22 | } from "@midday/ui/alert-dialog";
23 | import { Drawer, DrawerContent, DrawerHeader } from "@midday/ui/drawer";
24 | import {
25 |   DropdownMenu,
26 |   DropdownMenuContent,
27 |   DropdownMenuItem,
28 |   DropdownMenuTrigger,
29 | } from "@midday/ui/dropdown-menu";
30 | import { useMediaQuery } from "@midday/ui/hooks";
31 | import { Icons } from "@midday/ui/icons";
32 | import { ScrollArea } from "@midday/ui/scroll-area";
33 | import { Sheet, SheetContent, SheetHeader } from "@midday/ui/sheet";
34 | import { useToast } from "@midday/ui/use-toast";
35 | import { useAction } from "next-safe-action/hooks";
36 | import React, { useEffect, useState } from "react";
37 | import { useForm } from "react-hook-form";
38 | import type { z } from "zod";
39 |
40 | type Props = {
41 |   userId: string;
42 |   teamId: string;
43 |   customers: Customer[];
44 | };
45 |
46 | export function TrackerUpdateSheet({ teamId, customers }: Props) {
47 |   const { toast } = useToast();
48 |   const isDesktop = useMediaQuery("(min-width: 768px)");
49 |   const [isLoading, setIsLoading] = useState(false);
50 |   const { setParams, update, projectId } = useTrackerParams();
51 |   const supabase = createClient();
52 |   const id = projectId ?? "";
53 |
54 |   const isOpen = update !== null && Boolean(projectId);
55 |
56 |   const form = useForm<z.infer<typeof updateProjectSchema>>({
57 |     resolver: zodResolver(updateProjectSchema),
58 |     defaultValues: {
59 |       id: undefined,
60 |       name: undefined,
61 |       description: undefined,
62 |       rate: undefined,
63 |       status: undefined,
64 |       billable: undefined,
65 |       estimate: 0,
66 |       currency: undefined,
67 |       customer_id: undefined,
68 |       tags: undefined,
69 |     },
70 |   });
71 |
72 |   useEffect(() => {
73 |     const fetchData = async () => {
74 |       setIsLoading(true);
75 |
76 |       const { data } = await getTrackerProjectQuery(supabase, {
77 |         teamId,
78 |         projectId: id,
79 |       });
80 |
81 |       if (data) {
82 |         form.reset({
83 |           id: data.id,
84 |           name: data.name,
85 |           description: data.description ?? undefined,
86 |           rate: data.rate ?? undefined,
87 |           status: data.status ?? undefined,
88 |           billable: data.billable ?? undefined,
89 |           estimate: data.estimate ?? undefined,
90 |           currency: data.currency ?? undefined,
91 |           customer_id: data.customer_id ?? undefined,
92 |           tags:
93 |             data.tags?.map((tag) => ({
94 |               id: tag.tag?.id ?? "",
95 |               label: tag.tag?.name ?? "",
96 |               value: tag.tag?.name ?? "",
97 |             })) ?? undefined,
98 |         });
99 |       }
100 |
101 |       setIsLoading(false);
102 |     };
103 |
104 |     if (id) {
105 |       fetchData();
106 |     }
107 |   }, [id]);
108 |
109 |   const deleteAction = useAction(deleteProjectAction, {
110 |     onSuccess: () => {
111 |       setParams({ update: null, projectId: null });
112 |       form.reset();
113 |     },
114 |     onError: () => {
115 |       toast({
116 |         duration: 2500,
117 |         variant: "error",
118 |         title: "Something went wrong please try again.",
119 |       });
120 |     },
121 |   });
122 |
123 |   const updateAction = useAction(updateProjectAction, {
124 |     onSuccess: () => {
125 |       setParams({ update: null, projectId: null });
126 |       form.reset();
127 |     },
128 |     onError: () => {
129 |       toast({
130 |         duration: 3500,
131 |         variant: "error",
132 |         title: "Something went wrong please try again.",
133 |       });
134 |     },
135 |   });
136 |
137 |   useEffect(() => {
138 |     if (!isOpen) {
139 |       form.reset();
140 |     }
141 |   }, [isOpen]);
142 |
143 |   if (isLoading) {
144 |     return null;
145 |   }
146 |
147 |   if (isDesktop) {
148 |     return (
149 |       <AlertDialog>
150 |         <Sheet
151 |           open={isOpen}
152 |           onOpenChange={() => setParams({ update: null, projectId: null })}
153 |         >
154 |           <SheetContent>
155 |             <SheetHeader className="mb-8 flex justify-between items-center flex-row">
156 |               <h2 className="text-xl">Edit Project</h2>
157 |
158 |               <DropdownMenu>
159 |                 <DropdownMenuTrigger>
160 |                   <Icons.MoreVertical className="w-5 h-5" />
161 |                 </DropdownMenuTrigger>
162 |
163 |                 <DropdownMenuContent
164 |                   className="w-42"
165 |                   sideOffset={10}
166 |                   align="end"
167 |                 >
168 |                   <AlertDialogTrigger asChild>
169 |                     <DropdownMenuItem className="text-destructive">
170 |                       Delete
171 |                     </DropdownMenuItem>
172 |                   </AlertDialogTrigger>
173 |                 </DropdownMenuContent>
174 |               </DropdownMenu>
175 |             </SheetHeader>
176 |
[TRUNCATED]
```

apps/dashboard/src/components/sheets/transaction-sheet.tsx
```
1 | import type { UpdateTransactionValues } from "@/actions/schema";
2 | import { Drawer, DrawerContent } from "@midday/ui/drawer";
3 | import { useMediaQuery } from "@midday/ui/hooks";
4 | import { Sheet, SheetContent } from "@midday/ui/sheet";
5 | import React from "react";
6 | import { TransactionDetails } from "../transaction-details";
7 |
8 | type Props = {
9 |   setOpen: (open: boolean) => void;
10 |   isOpen: boolean;
11 |   data: any;
12 |   ids?: string[];
13 |   updateTransaction: (
14 |     values: UpdateTransactionValues,
15 |     optimisticData: any,
16 |   ) => void;
17 | };
18 |
19 | export function TransactionSheet({
20 |   setOpen,
21 |   isOpen,
22 |   data,
23 |   ids,
24 |   updateTransaction,
25 | }: Props) {
26 |   const isDesktop = useMediaQuery("(min-width: 768px)");
27 |
28 |   if (isDesktop) {
29 |     return (
30 |       <Sheet open={isOpen} onOpenChange={setOpen}>
31 |         <SheetContent>
32 |           <TransactionDetails
33 |             data={data}
34 |             ids={ids}
35 |             updateTransaction={updateTransaction}
36 |           />
37 |         </SheetContent>
38 |       </Sheet>
39 |     );
40 |   }
41 |
42 |   return (
43 |     <Drawer
44 |       open={isOpen}
45 |       onOpenChange={(open: boolean) => {
46 |         if (!open) {
47 |           setOpen(false);
48 |         }
49 |       }}
50 |     >
51 |       <DrawerContent className="p-6">
52 |         <TransactionDetails
53 |           data={data}
54 |           ids={ids}
55 |           updateTransaction={updateTransaction}
56 |         />
57 |       </DrawerContent>
58 |     </Drawer>
59 |   );
60 | }
```

apps/dashboard/src/desktop/components/browser-navigation.tsx
```
1 | "use client";
2 |
3 | import { cn } from "@midday/ui/cn";
4 | import { Icons } from "@midday/ui/icons";
5 | import { webContents } from "@todesktop/client-core";
6 | import { useEffect, useState } from "react";
7 |
8 | export function BrowserNavigation() {
9 |   const [canGoForward, setCanGoForward] = useState(false);
10 |   const [canGoBack, setCanGoBack] = useState(false);
11 |
12 |   useEffect(() => {
13 |     webContents.on("did-navigate", async () => {
14 |       if (await webContents.canGoForward()) {
15 |         setCanGoForward(true);
16 |       } else {
17 |         setCanGoForward(false);
18 |       }
19 |
20 |       if (await webContents.canGoBack()) {
21 |         setCanGoBack(true);
22 |       } else {
23 |         setCanGoBack(false);
24 |       }
25 |     });
26 |   }, []);
27 |
28 |   const handleOnNavigate = (dir: "back" | "forward") => {
29 |     if (dir === "back") {
30 |       window.todesktop.contents.goBack();
31 |     }
32 |
33 |     if (dir === "forward") {
34 |       window.todesktop.contents.goForward();
35 |     }
36 |   };
37 |
38 |   return (
39 |     <div className="hidden todesktop:block no-drag h-6">
40 |       <button
41 |         type="button"
42 |         onClick={() => handleOnNavigate("back")}
43 |         className={cn(!canGoBack && "opacity-50")}
44 |         disabled={!canGoBack}
45 |       >
46 |         <Icons.ChevronLeft className="h-6 w-6" />
47 |       </button>
48 |       <button
49 |         type="button"
50 |         onClick={() => handleOnNavigate("forward")}
51 |         className={cn(!canGoForward && "opacity-50")}
52 |         disabled={!canGoForward}
53 |       >
54 |         <Icons.ChevronRight className="h-6 w-6" />
55 |       </button>
56 |     </div>
57 |   );
58 | }
```

apps/dashboard/src/desktop/components/desktop-update.tsx
```
1 | "use client";
2 |
3 | import { cn } from "@midday/ui/cn";
4 | import {
5 |   Tooltip,
6 |   TooltipContent,
7 |   TooltipProvider,
8 |   TooltipTrigger,
9 | } from "@midday/ui/tooltip";
10 | import { todesktopUpdater } from "@todesktop/client-core";
11 | import { isDesktopApp } from "@todesktop/client-core/platform/todesktop";
12 | import { AnimatePresence, motion } from "framer-motion";
13 | import { useEffect, useState } from "react";
14 |
15 | export function DesktopUpdate() {
16 |   if (!isDesktopApp()) {
17 |     return null;
18 |   }
19 |
20 |   const [status, setStatus] = useState<
21 |     "update-available" | "update-downloaded"
22 |   >();
23 |
24 |   useEffect(() => {
25 |     todesktopUpdater.on("update-available", () => {
26 |       setStatus("update-available");
27 |     });
28 |
29 |     todesktopUpdater.on("update-downloaded", () => {
30 |       setStatus("update-downloaded");
31 |     });
32 |   }, []);
33 |
34 |   const handleOnClick = async () => {
35 |     if (status === "update-available") {
36 |       // Note: Should we handle download binary here?
37 |     }
38 |
39 |     if (status === "update-downloaded") {
40 |       setStatus(null);
41 |       todesktopUpdater.restartAndInstall();
42 |     }
43 |   };
44 |
45 |   return (
46 |     <AnimatePresence>
47 |       {status && (
48 |         <motion.div
49 |           initial={{ opacity: 0 }}
50 |           animate={{ opacity: 1 }}
51 |           exit={{ opacity: 0 }}
52 |         >
53 |           <TooltipProvider delayDuration={50}>
54 |             <Tooltip>
55 |               <TooltipTrigger asChild>
56 |                 <div className="w-[11px] h-[11px] bg-[#7aafd3] rounded-full flex items-center justify-center invisible todesktop:visible">
57 |                   <button
58 |                     className={cn("update-available", status)}
59 |                     type="button"
60 |                     onClick={handleOnClick}
61 |                   >
62 |                     <svg
63 |                       width="12"
64 |                       height="12"
65 |                       viewBox="0 0 12 12"
66 |                       fill="none"
67 |                       xmlns="http://www.w3.org/2000/svg"
68 |                     >
69 |                       <path
70 |                         d="M6 3.25V8.75M6 8.75L8.25 6.5M6 8.75L3.75 6.5"
71 |                         stroke="#294771"
72 |                         stroke-width="1.5"
73 |                         stroke-linecap="round"
74 |                         stroke-linejoin="round"
75 |                         className="svg-update"
76 |                       />
77 |                       <circle
78 |                         cx="6"
79 |                         cy="6"
80 |                         r="2.25"
81 |                         stroke="#294771"
82 |                         stroke-width="4.5"
83 |                         className="svg-progress"
84 |                       />
85 |                       <path
86 |                         d="M3.75 6C3.75 4.75736 4.75736 3.75 6 3.75C6.39468 3.75 6.71356 3.83142 7.00573 3.99422L6.42675 4.5732C6.26926 4.73069 6.3808 4.99997 6.60353 4.99997H8.74998C8.88805 4.99997 8.99998 4.88805 8.99998 4.74997V2.60353C8.99998 2.3808 8.73069 2.26926 8.5732 2.42675L8.09023 2.90972C7.51041 2.49373 6.83971 2.25 6 2.25C3.92893 2.25 2.25 3.92893 2.25 6C2.25 8.07107 3.92893 9.75 6 9.75C7.63395 9.75 9.02199 8.70541 9.53642 7.24993C9.67446 6.8594 9.46977 6.4309 9.07923 6.29287C8.68869 6.15483 8.2602 6.35953 8.12216 6.75007C7.81293 7.62497 6.97849 8.25 6 8.25C4.75736 8.25 3.75 7.24264 3.75 6Z"
87 |                         fill="#294771"
88 |                         className="svg-refresh"
89 |                       />
90 |                     </svg>
91 |                   </button>
92 |                 </div>
93 |               </TooltipTrigger>
94 |
95 |               <TooltipContent sideOffset={10} className="text-xs p-2">
96 |                 {status === "update-available" && "Update Available"}
97 |                 {status === "update-downloaded" && "Relaunch to Update"}
98 |               </TooltipContent>
99 |             </Tooltip>
100 |           </TooltipProvider>
101 |         </motion.div>
102 |       )}
103 |     </AnimatePresence>
104 |   );
105 | }
```

apps/dashboard/src/store/user/hook.ts
```
1 | import { useContext } from "react";
2 | import { useStore } from "zustand";
3 | import { UserContext, type UserState } from "./store";
4 |
5 | export function useUserContext<T>(selector: (state: UserState) => T): T {
6 |   const store = useContext(UserContext);
7 |
8 |   if (!store) {
9 |     throw new Error("Missing UserContext.Provider in the tree");
10 |   }
11 |
12 |   return useStore(store, selector);
13 | }
```

apps/dashboard/src/store/user/provider.tsx
```
1 | "use client";
2 |
3 | import { useEffect } from "react";
4 | import { UserContext, type UserProps, createUserStore } from "./store";
5 |
6 | type UserProviderProps = React.PropsWithChildren<UserProps>;
7 |
8 | export function UserProvider({ children, data }: UserProviderProps) {
9 |   const store = createUserStore({ data });
10 |
11 |   useEffect(() => {
12 |     if (data) {
13 |       store.setState({ data });
14 |     } else {
15 |       store.setState({
16 |         data: {
17 |           locale: window.navigator.language || "en-US",
18 |         },
19 |       });
20 |     }
21 |   }, [data, store]);
22 |
23 |   return <UserContext.Provider value={store}>{children}</UserContext.Provider>;
24 | }
```

apps/dashboard/src/store/user/store.ts
```
1 | import { createContext } from "react";
2 | import { createStore } from "zustand";
3 |
4 | type User = {
5 |   id: string;
6 |   team_id: string;
7 |   full_name: string;
8 |   locale: string;
9 |   date_format: string;
10 |   timezone: string;
11 | };
12 |
13 | export interface UserProps {
14 |   data: User;
15 | }
16 |
17 | export interface UserState extends UserProps {
18 |   setUser: (user: User) => void;
19 | }
20 |
21 | export const createUserStore = (initProps: UserProps) => {
22 |   return createStore<UserState>()((set) => ({
23 |     data: initProps?.data,
24 |     setUser: (user: User) => set({ data: user }),
25 |   }));
26 | };
27 |
28 | export type UserStore = ReturnType<typeof createUserStore>;
29 | export const UserContext = createContext<UserStore | null>(null);
```

apps/dashboard/src/store/vault/hook.ts
```
1 | import { useContext } from "react";
2 | import { useStore } from "zustand";
3 | import { VaultContext, type VaultState } from "./store";
4 |
5 | export function useVaultContext<T>(selector: (state: VaultState) => T): T {
6 |   const store = useContext(VaultContext);
7 |
8 |   if (!store) {
9 |     throw new Error("Missing VaultContext.Provider in the tree");
10 |   }
11 |
12 |   return useStore(store, selector);
13 | }
```

apps/dashboard/src/store/vault/provider.tsx
```
1 | "use client";
2 |
3 | import { useEffect } from "react";
4 | import { VaultContext, type VaultProps, createVaultStore } from "./store";
5 |
6 | type VaultProviderProps = React.PropsWithChildren<VaultProps>;
7 |
8 | export function VaultProvider({ children, data }: VaultProviderProps) {
9 |   const store = createVaultStore({ data });
10 |
11 |   useEffect(() => {
12 |     store.setState({ data });
13 |   }, [data, store]);
14 |
15 |   return (
16 |     <VaultContext.Provider value={store}>{children}</VaultContext.Provider>
17 |   );
18 | }
```

apps/dashboard/src/store/vault/store.ts
```
1 | import { createContext } from "react";
2 | import { createStore } from "zustand";
3 |
4 | type Item = {
5 |   id?: string;
6 |   name?: string;
7 |   tag?: string;
8 |   isFolder?: boolean;
9 |   isEditing?: boolean;
10 |   isLoading?: boolean;
11 | };
12 |
13 | export interface VaultProps {
14 |   data: Item[];
15 | }
16 |
17 | export interface VaultState extends VaultProps {
18 |   deleteItem: (id: string) => void;
19 |   createFolder: (item: Item) => void;
20 |   updateItem: (id: string, payload: Item) => void;
21 | }
22 |
23 | export type VaultStore = ReturnType<typeof createVaultStore>;
24 | export const VaultContext = createContext<VaultStore | null>(null);
25 |
26 | const DEFAULT_PROPS: VaultProps = {
27 |   data: [],
28 | };
29 |
30 | export const createVaultStore = (initProps?: Partial<VaultProps>) => {
31 |   return createStore<VaultState>()((set) => ({
32 |     ...DEFAULT_PROPS,
33 |     ...initProps,
34 |
35 |     deleteItem: (id) => {
36 |       set((state) => ({
37 |         data: state.data.filter((item) =>
38 |           item.isFolder ? item.name !== id : item.id !== id,
39 |         ),
40 |       }));
41 |     },
42 |
43 |     createFolder: (item) => {
44 |       set((state) => ({
45 |         data: [
46 |           ...state.data,
47 |           {
48 |             ...item,
49 |             isEditing: true,
50 |             isFolder: true,
51 |             id: item.name,
52 |           },
53 |         ],
54 |       }));
55 |     },
56 |
57 |     updateItem: (id, payload) => {
58 |       set((state) => {
59 |         return {
60 |           data: state.data.map((d) => (d.id === id ? { ...d, ...payload } : d)),
61 |         };
62 |       });
63 |     },
64 |   }));
65 | };
```

apps/docs/api-reference/engine/endpoint/auth-link-gocardless.mdx
```
1 | ---
2 | openapi: post /auth/gocardless/link
3 | ---
```

apps/docs/api-reference/engine/endpoint/auth-link-plaid.mdx
```
1 | ---
2 | openapi: post /auth/plaid/link
3 | ---
```

apps/docs/api-reference/engine/endpoint/get-account-balance.mdx
```
1 | ---
2 | openapi: get /accounts/balance
3 | ---
```

apps/docs/api-reference/engine/endpoint/get-accounts.mdx
```
1 | ---
2 | openapi: get /accounts
3 | ---
```

apps/docs/api-reference/engine/endpoint/get-accountsbalance.mdx
```
1 | ---
2 | openapi: get /accounts/balance
3 | ---
```

apps/docs/api-reference/engine/endpoint/get-auth-link.mdx
```
1 | ---
2 | openapi: post /auth/gocardless/link
3 | ---
```

apps/docs/api-reference/engine/endpoint/get-health.mdx
```
1 | ---
2 | openapi: get /health
3 | ---
```

apps/docs/api-reference/engine/endpoint/get-institutionssearch.mdx
```
1 | ---
2 | openapi: get /institutions/search
3 | ---
```

apps/docs/api-reference/engine/endpoint/get-link.mdx
```
1 | ---
2 | openapi: post /auth/plaid/link
3 | ---
```

apps/docs/api-reference/engine/endpoint/get-transactions.mdx
```
1 | ---
2 | openapi: get /transactions
3 | ---
```

apps/docs/api-reference/engine/endpoint/gocardless-auth-link.mdx
```
1 | ---
2 | openapi: post /auth/gocardless/link
3 | ---
```

apps/docs/api-reference/engine/endpoint/health.mdx
```
1 | ---
2 | openapi: get /health
3 | ---
```

apps/docs/api-reference/engine/endpoint/plaid-auth-link.mdx
```
1 | ---
2 | openapi: post /auth/plaid/link
3 | ---
```

apps/docs/api-reference/engine/endpoint/post-authgocardlessexchange.mdx
```
1 | ---
2 | openapi: post /auth/gocardless/exchange
3 | ---
```

apps/docs/api-reference/engine/endpoint/post-authgocardlesslink.mdx
```
1 | ---
2 | openapi: post /auth/gocardless/link
3 | ---
```

apps/docs/api-reference/engine/endpoint/post-authplaidexchange.mdx
```
1 | ---
2 | openapi: post /auth/plaid/exchange
3 | ---
```

apps/docs/api-reference/engine/endpoint/post-authplaidlink.mdx
```
1 | ---
2 | openapi: post /auth/plaid/link
3 | ---
```

apps/docs/api-reference/engine/endpoint/search-institutions.mdx
```
1 | ---
2 | openapi: get /institutions/search
3 | ---
```

apps/engine/src/providers/gocardless/gocardless-api.ts
```
1 | import { ProviderError } from "@/utils/error";
2 | import { logger } from "@/utils/logger";
3 | import { formatISO, subDays } from "date-fns";
4 | import xior from "xior";
5 | import type { XiorInstance, XiorRequestConfig } from "xior";
6 | import type { GetInstitutionsRequest, ProviderParams } from "../types";
7 | import type {
8 |   DeleteRequistionResponse,
9 |   GetAccessTokenResponse,
10 |   GetAccountBalanceResponse,
11 |   GetAccountDetailsResponse,
12 |   GetAccountResponse,
13 |   GetAccountsRequest,
14 |   GetAccountsResponse,
15 |   GetInstitutionResponse,
16 |   GetInstitutionsResponse,
17 |   GetRefreshTokenResponse,
18 |   GetRequisitionResponse,
19 |   GetRequisitionsResponse,
20 |   GetTransactionsRequest,
21 |   GetTransactionsResponse,
22 |   PostCreateAgreementResponse,
23 |   PostEndUserAgreementRequest,
24 |   PostRequisitionsRequest,
25 |   PostRequisitionsResponse,
26 | } from "./types";
27 | import { getAccessValidForDays, getMaxHistoricalDays, isError } from "./utils";
28 |
29 | export class GoCardLessApi {
30 |   #baseUrl = "https://bankaccountdata.gocardless.com";
31 |
32 |   // Cache keys
33 |   #accessTokenCacheKey = "gocardless_access_token";
34 |   #refreshTokenCacheKey = "gocardless_refresh_token";
35 |   #institutionsCacheKey = "gocardless_institutions";
36 |
37 |   #kv: KVNamespace;
38 |
39 |   #oneHour = 3600;
40 |
41 |   #secretKey;
42 |   #secretId;
43 |
44 |   constructor(params: Omit<ProviderParams, "provider">) {
45 |     this.#kv = params.kv;
46 |     this.#secretId = params.envs.GOCARDLESS_SECRET_ID;
47 |     this.#secretKey = params.envs.GOCARDLESS_SECRET_KEY;
48 |   }
49 |
50 |   async getHealthCheck() {
51 |     try {
52 |       await this.#get("/api/v2/swagger.json");
53 |
54 |       return true;
55 |     } catch {
56 |       return false;
57 |     }
58 |   }
59 |
60 |   async #getRefreshToken(refresh: string): Promise<string> {
61 |     const response = await this.#post<GetRefreshTokenResponse>(
62 |       "/api/v2/token/refresh/",
63 |       undefined,
64 |       {
65 |         refresh,
66 |       },
67 |     );
68 |
69 |     await this.#kv?.put(this.#accessTokenCacheKey, response.access, {
70 |       expirationTtl: response.access_expires - this.#oneHour,
71 |     });
72 |
73 |     return response.refresh;
74 |   }
75 |
76 |   async #getAccessToken(): Promise<string> {
77 |     const [accessToken, refreshToken] = await Promise.all([
78 |       this.#kv?.get(this.#accessTokenCacheKey),
79 |       this.#kv?.get(this.#refreshTokenCacheKey),
80 |     ]);
81 |
82 |     if (typeof accessToken === "string") {
83 |       return accessToken;
84 |     }
85 |
86 |     if (typeof refreshToken === "string") {
87 |       return this.#getRefreshToken(refreshToken);
88 |     }
89 |
90 |     const response = await this.#post<GetAccessTokenResponse>(
91 |       "/api/v2/token/new/",
92 |       undefined,
93 |       {
94 |         secret_id: this.#secretId,
95 |         secret_key: this.#secretKey,
96 |       },
97 |     );
98 |
99 |     try {
100 |       await Promise.all([
101 |         this.#kv?.put(this.#accessTokenCacheKey, response.access, {
102 |           expirationTtl: response.access_expires - this.#oneHour,
103 |         }),
104 |         this.#kv?.put(this.#refreshTokenCacheKey, response.refresh, {
105 |           expirationTtl: response.refresh_expires - this.#oneHour,
106 |         }),
107 |       ]);
108 |     } catch (error) {
109 |       logger("Error saving tokens");
110 |     }
111 |
112 |     return response.access;
113 |   }
114 |
115 |   async getAccountBalance(
116 |     accountId: string,
117 |   ): Promise<
118 |     GetAccountBalanceResponse["balances"][0]["balanceAmount"] | undefined
119 |   > {
120 |     const token = await this.#getAccessToken();
121 |
122 |     try {
123 |       const { balances } = await this.#get<GetAccountBalanceResponse>(
124 |         `/api/v2/accounts/${accountId}/balances/`,
125 |         token,
126 |       );
127 |
128 |       const foundInterimAvailable = balances?.find(
129 |         (account) =>
130 |           account.balanceType === "interimAvailable" ||
131 |           account.balanceType === "interimBooked",
132 |       );
133 |
134 |       // For some accounts, the interimAvailable balance is 0, so we need to use the expected balance
135 |       const foundExpectedAvailable = balances?.find(
136 |         (account) => account.balanceType === "expected",
137 |       );
138 |
139 |       return (
140 |         foundInterimAvailable?.balanceAmount ||
141 |         foundExpectedAvailable?.balanceAmount
142 |       );
143 |     } catch (error) {
144 |       const parsedError = isError(error);
145 |
146 |       if (parsedError) {
147 |         throw new ProviderError(parsedError);
148 |       }
149 |     }
150 |   }
151 |
152 |   async getInstitutions(
153 |     params?: GetInstitutionsRequest,
154 |   ): Promise<GetInstitutionsResponse> {
155 |     const countryCode = params?.countryCode;
156 |     const cacheKey = `${this.#institutionsCacheKey}_${countryCode}`;
157 |
158 |     const institutions = await this.#kv?.get(cacheKey);
159 |
160 |     if (institutions) {
161 |       return JSON.parse(institutions) as GetInstitutionsResponse;
162 |     }
163 |
164 |     const token = await this.#getAccessToken();
165 |
166 |     const response = await this.#get<GetInstitutionsResponse>(
167 |       "/api/v2/institutions/",
168 |       token,
169 |       undefined,
170 |       {
171 |         params: {
172 |           country: countryCode,
173 |         },
174 |       },
175 |     );
176 |
177 |     this.#kv?.put(cacheKey, JSON.stringify(response), {
178 |       expirationTtl: this.#oneHour,
179 |     });
180 |
181 |     if (countryCode) {
182 |       return response.filter((institution) =>
183 |         institution.countries.includes(countryCode),
184 |       );
185 |     }
186 |
187 |     return response;
188 |   }
189 |
190 |   async buildLink({
191 |     institutionId,
[TRUNCATED]
```

apps/engine/src/providers/gocardless/gocardless-provider.ts
```
1 | import type { Provider } from "../interface";
2 | import type {
3 |   DeleteAccountsRequest,
4 |   DeleteConnectionRequest,
5 |   GetAccountBalanceRequest,
6 |   GetAccountsRequest,
7 |   GetConnectionStatusRequest,
8 |   GetInstitutionsRequest,
9 |   GetTransactionsRequest,
10 |   ProviderParams,
11 | } from "../types";
12 | import { GoCardLessApi } from "./gocardless-api";
13 | import {
14 |   transformAccount,
15 |   transformAccountBalance,
16 |   transformConnectionStatus,
17 |   transformInstitution,
18 |   transformTransaction,
19 | } from "./transform";
20 |
21 | export class GoCardLessProvider implements Provider {
22 |   #api: GoCardLessApi;
23 |
24 |   constructor(params: Omit<ProviderParams, "provider">) {
25 |     this.#api = new GoCardLessApi(params);
26 |   }
27 |
28 |   async getHealthCheck() {
29 |     return this.#api.getHealthCheck();
30 |   }
31 |
32 |   async getTransactions({ accountId, latest }: GetTransactionsRequest) {
33 |     const response = await this.#api.getTransactions({
34 |       latest,
35 |       accountId,
36 |     });
37 |
38 |     return (response ?? []).map(transformTransaction);
39 |   }
40 |
41 |   async getAccounts({ id }: GetAccountsRequest) {
42 |     if (!id) {
43 |       throw Error("Missing params");
44 |     }
45 |
46 |     const response = await this.#api.getAccounts({ id });
47 |
48 |     return (response ?? []).map(transformAccount);
49 |   }
50 |
51 |   async getAccountBalance({ accountId }: GetAccountBalanceRequest) {
52 |     if (!accountId) {
53 |       throw Error("Missing params");
54 |     }
55 |
56 |     const response = await this.#api.getAccountBalance(accountId);
57 |
58 |     return transformAccountBalance(response);
59 |   }
60 |
61 |   async getInstitutions({ countryCode }: GetInstitutionsRequest) {
62 |     if (!countryCode) {
63 |       throw Error("Missing countryCode");
64 |     }
65 |
66 |     const response = await this.#api.getInstitutions({ countryCode });
67 |
68 |     return response.map(transformInstitution);
69 |   }
70 |
71 |   async deleteAccounts({ accountId }: DeleteAccountsRequest) {
72 |     if (!accountId) {
73 |       throw Error("Missing params");
74 |     }
75 |
76 |     await this.#api.deleteRequisition(accountId);
77 |   }
78 |
79 |   async getConnectionStatus({ id }: GetConnectionStatusRequest) {
80 |     if (!id) {
81 |       throw Error("Missing params");
82 |     }
83 |
84 |     const response = await this.#api.getRequestion(id);
85 |
86 |     return transformConnectionStatus(response);
87 |   }
88 |
89 |   async deleteConnection({ id }: DeleteConnectionRequest) {
90 |     if (!id) {
91 |       throw Error("Missing params");
92 |     }
93 |
94 |     await this.#api.deleteRequisition(id);
95 |   }
96 | }
```

apps/engine/src/providers/gocardless/transform.test.ts
```
1 | import { expect, test } from "bun:test";
2 | import {
3 |   transformAccount,
4 |   transformAccountBalance,
5 |   transformTransaction,
6 | } from "./transform";
7 |
8 | test("Transform income transaction", () => {
9 |   expect(
10 |     transformTransaction({
11 |       transactionId:
12 |         "8wwecA0PsWWCLPLazQzht2oOcxSIQ5UlWPHaNBpC3tjYtc002faJcjWzRpyO4sjz66kRpb7_5rA",
13 |       entryReference: "5490990006",
14 |       bookingDate: "2024-02-23",
15 |       valueDate: "2024-02-23",
16 |       transactionAmount: {
17 |         amount: "-38000.00",
18 |         currency: "SEK",
19 |       },
20 |       additionalInformation: "LÖN         160434262327",
21 |       proprietaryBankTransactionCode: "Transfer",
22 |       internalTransactionId: "86b1bc36e6a6d2a5dee8ff7138920255",
23 |     }),
24 |   ).toMatchSnapshot();
25 | });
26 |
27 | test("Transform accounts", () => {
28 |   expect(
29 |     transformAccount({
30 |       id: "b11e5627-cac8-41c9-a74a-2b88438fe07d",
31 |       created: "2024-02-23T13:29:47.314568Z",
32 |       last_accessed: "2024-03-06T16:34:16.782598Z",
33 |       iban: "3133",
34 |       institution_id: "PLEO_PLEODK00",
35 |       status: "READY",
36 |       owner_name: "",
37 |       account: {
38 |         resourceId: "3133",
39 |         currency: "SEK",
40 |         name: "Pleo Account",
41 |         product: "Pleo",
42 |         cashAccountType: "TRAN",
43 |         iban: "123",
44 |         ownerName: "Name",
45 |       },
46 |       balance: {
47 |         currency: "SEK",
48 |         amount: "1942682.86",
49 |       },
50 |       institution: {
51 |         id: "PLEO_PLEODK00",
52 |         name: "Pleo",
53 |         bic: "PLEODK00",
54 |         transaction_total_days: "90",
55 |         countries: ["DK", "GB", "DE", "SE", "ES", "IE", "DK"],
56 |         logo: "https://cdn-logos.gocardless.com/ais/PLEO_PLEODK00.png",
57 |       },
58 |     }),
59 |   ).toMatchSnapshot();
60 | });
61 |
62 | test("Transform account balance", () => {
63 |   expect(
64 |     transformAccountBalance({
65 |       currency: "SEK",
66 |       amount: "1942682.86",
67 |     }),
68 |   ).toMatchSnapshot();
69 | });
```

apps/engine/src/providers/gocardless/transform.ts
```
1 | import { Providers } from "@/common/schema";
2 | import { getFileExtension, getLogoURL } from "@/utils/logo";
3 | import { capitalCase } from "change-case";
4 | import type {
5 |   Account as BaseAccount,
6 |   Balance as BaseAccountBalance,
7 |   Transaction as BaseTransaction,
8 |   ConnectionStatus,
9 | } from "../types";
10 | import type {
11 |   GetRequisitionResponse,
12 |   Institution,
13 |   Transaction,
14 |   TransactionDescription,
15 |   TransformAccount,
16 |   TransformAccountBalance,
17 |   TransformAccountName,
18 |   TransformInstitution,
19 |   TransformTransaction,
20 | } from "./types";
21 |
22 | export const mapTransactionCategory = (transaction: Transaction) => {
23 |   if (+transaction.transactionAmount.amount > 0) {
24 |     return "income";
25 |   }
26 |
27 |   if (transaction?.proprietaryBankTransactionCode === "Transfer") {
28 |     return "transfer";
29 |   }
30 |
31 |   return null;
32 | };
33 |
34 | export const mapTransactionMethod = (type?: string) => {
35 |   switch (type) {
36 |     case "Payment":
37 |     case "Bankgiro payment":
38 |     case "Incoming foreign payment":
39 |       return "payment";
40 |     case "Card purchase":
41 |     case "Card foreign purchase":
42 |       return "card_purchase";
43 |     case "Card ATM":
44 |       return "card_atm";
45 |     case "Transfer":
46 |       return "transfer";
47 |     default:
48 |       return "other";
49 |   }
50 | };
51 |
52 | export const transformTransactionName = (transaction: Transaction) => {
53 |   if (transaction?.creditorName) {
54 |     return capitalCase(transaction.creditorName);
55 |   }
56 |
57 |   if (transaction?.debtorName) {
58 |     return capitalCase(transaction?.debtorName);
59 |   }
60 |
61 |   if (transaction?.additionalInformation) {
62 |     return capitalCase(transaction.additionalInformation);
63 |   }
64 |
65 |   if (transaction?.remittanceInformationStructured) {
66 |     return capitalCase(transaction.remittanceInformationStructured);
67 |   }
68 |
69 |   if (transaction?.remittanceInformationUnstructured) {
70 |     return capitalCase(transaction.remittanceInformationUnstructured);
71 |   }
72 |
73 |   const remittanceInformation =
74 |     transaction?.remittanceInformationUnstructuredArray?.at(0);
75 |
76 |   if (remittanceInformation) {
77 |     return capitalCase(remittanceInformation);
78 |   }
79 |
80 |   console.log("No transaction name", transaction);
81 |
82 |   // When there is no name, we use the proprietary bank transaction code (Service Fee)
83 |   if (transaction.proprietaryBankTransactionCode) {
84 |     return transaction.proprietaryBankTransactionCode;
85 |   }
86 |
87 |   return "No information";
88 | };
89 |
90 | const transformDescription = ({
91 |   transaction,
92 |   name,
93 | }: TransactionDescription) => {
94 |   if (transaction?.remittanceInformationUnstructuredArray?.length) {
95 |     const text = transaction?.remittanceInformationUnstructuredArray.join(" ");
96 |     const description = capitalCase(text);
97 |
98 |     // NOTE: Sometimes the description is the same as name
99 |     // Let's skip that and just save if they are not the same
100 |     if (description !== name) {
101 |       return description;
102 |     }
103 |   }
104 |
105 |   const additionalInformation =
106 |     transaction.additionalInformation &&
107 |     capitalCase(transaction.additionalInformation);
108 |
109 |   if (additionalInformation !== name) {
110 |     return additionalInformation;
111 |   }
112 |
113 |   return null;
114 | };
115 |
116 | export const transformTransaction = (
117 |   transaction: TransformTransaction,
118 | ): BaseTransaction => {
119 |   const method = mapTransactionMethod(
120 |     transaction?.proprietaryBankTransactionCode,
121 |   );
122 |
123 |   let currencyExchange: { rate: number; currency: string } | undefined;
124 |
125 |   if (Array.isArray(transaction.currencyExchange)) {
126 |     const rate = Number.parseFloat(
127 |       transaction.currencyExchange.at(0)?.exchangeRate ?? "",
128 |     );
129 |
130 |     if (rate) {
131 |       const currency = transaction?.currencyExchange?.at(0)?.sourceCurrency;
132 |
133 |       if (currency) {
134 |         currencyExchange = {
135 |           rate,
136 |           currency: currency.toUpperCase(),
137 |         };
138 |       }
139 |     }
140 |   }
141 |
142 |   const name = transformTransactionName(transaction);
143 |   const description = transformDescription({ transaction, name }) ?? null;
144 |   const balance = transaction?.balanceAfterTransaction?.balanceAmount?.amount
145 |     ? +transaction.balanceAfterTransaction.balanceAmount.amount
146 |     : null;
147 |
148 |   return {
149 |     id: transaction.internalTransactionId,
150 |     date: transaction.bookingDate,
151 |     name,
152 |     method,
153 |     amount: +transaction.transactionAmount.amount,
154 |     currency: transaction.transactionAmount.currency,
155 |     category: mapTransactionCategory(transaction),
156 |     currency_rate: currencyExchange?.rate || null,
157 |     currency_source: currencyExchange?.currency?.toUpperCase() || null,
158 |     balance,
159 |     description,
160 |     status: "posted",
161 |   };
162 | };
163 |
164 | const transformAccountName = (account: TransformAccountName) => {
165 |   // First try to use the name from the account
166 |   if (account?.name) {
167 |     return capitalCase(account.name);
168 |   }
169 |
170 |   // Then try to use the product
171 |   if (account?.product) {
172 |     return account.product;
173 |   }
174 |
175 |   // Then try to use the institution name
176 |   if (account?.institution?.name) {
177 |     return `${account.institution.name} (${account.currency.toUpperCase()})`;
178 |   }
179 |
180 |   // Last use a default name
181 |   return "No name";
182 | };
183 |
184 | export const transformAccount = ({
185 |   id,
186 |   account,
187 |   balance,
188 |   institution,
[TRUNCATED]
```

apps/engine/src/providers/gocardless/types.ts
```
1 | import type { Balance, Providers } from "../types";
2 |
3 | export type Transaction = {
4 |   transactionAmount: { amount: string; currency: string };
5 |   currencyExchange?: {
6 |     exchangeRate: string;
7 |     targetCurrency: string;
8 |     sourceCurrency: string;
9 |   }[];
10 |   remittanceInformationStructured?: string;
11 |   remittanceInformationStructuredArray?: string[];
12 |   remittanceInformationUnstructured?: string;
13 |   remittanceInformationUnstructuredArray?: string[];
14 |   proprietaryBankTransactionCode?: string;
15 |   entryReference?: string;
16 |   transactionId?: string;
17 |   internalTransactionId: string;
18 |   bookingDate: string;
19 |   valueDate?: string;
20 |   additionalInformation?: string;
21 |   creditorName?: string;
22 |   creditorAccount?: { iban?: string };
23 |   debtorName?: string;
24 |   debtorAccount?: { iban?: string };
25 |   balanceAfterTransaction?: {
26 |     balanceAmount?: {
27 |       amount: string;
28 |     };
29 |   };
30 | };
31 |
32 | export type Institution = {
33 |   id: string;
34 |   name: string;
35 |   bic: string;
36 |   transaction_total_days: string;
37 |   logo: string;
38 |   countries: string[];
39 | };
40 |
41 | export type GetRefreshTokenResponse = {
42 |   access: string;
43 |   access_expires: number;
44 |   refresh: string;
45 |   refresh_expires: number;
46 | };
47 |
48 | export type GetAccessTokenResponse = {
49 |   access: string;
50 |   access_expires: number;
51 |   refresh: string;
52 |   refresh_expires: number;
53 | };
54 |
55 | export type GetInstitutionsResponse = Institution[];
56 | export type GetInstitutionResponse = Institution;
57 |
58 | export type PostRequisitionsRequest = {
59 |   institutionId: string;
60 |   agreement: string;
61 |   redirect: string;
62 |   reference?: string;
63 | };
64 |
65 | export type PostEndUserAgreementRequest = {
66 |   institutionId: string;
67 |   transactionTotalDays: number;
68 | };
69 |
70 | export type PostRequisitionsResponse = {
71 |   id: string;
72 |   created: string;
73 |   redirect: string;
74 |   status: string;
75 |   institution_id: string;
76 |   agreement: string;
77 |   reference: string;
78 |   accounts: string[];
79 |   link: string;
80 |   ssn: string | null;
81 |   account_selection: boolean;
82 |   redirect_immediate: boolean;
83 | };
84 |
85 | export type PostCreateAgreementResponse = {
86 |   id: string;
87 |   created: string;
88 |   institution_id: string;
89 |   max_historical_days: number;
90 |   access_valid_for_days: number;
91 |   access_scope: string[];
92 |   accepted: boolean;
93 | };
94 |
95 | export type GetAccountResponse = {
96 |   id: string;
97 |   created: string;
98 |   last_accessed: string;
99 |   iban?: string;
100 |   institution_id: string;
101 |   status: string;
102 |   owner_name?: string;
103 | };
104 |
105 | export type Account = {
106 |   resourceId: string;
107 |   iban: string;
108 |   currency: string;
109 |   ownerName: string;
110 |   name: string;
111 |   product: string;
112 |   cashAccountType: string;
113 | };
114 |
115 | export type AccountDetails = {
116 |   account: Account;
117 | };
118 |
119 | export type GetAccountDetailsResponse = GetAccountResponse & AccountDetails;
120 |
121 | export type GetAccountsRequest = {
122 |   id: string;
123 | };
124 |
125 | export type Requestion = {
126 |   id: string;
127 |   created: string;
128 |   redirect: string;
129 |   status: "CR" | "GC" | "UA" | "RJ" | "SA" | "GA" | "LN" | "EX";
130 |   institution_id: string;
131 |   agreement: string;
132 |   reference: string;
133 |   accounts: string[];
134 |   user_language: string;
135 |   link: string;
136 |   ssn: string;
137 |   account_selection: boolean;
138 |   redirect_immediate: boolean;
139 | };
140 |
141 | export type GetRequisitionResponse = Requestion;
142 |
143 | export type GetRequisitionsResponse = {
144 |   count: number;
145 |   next: string;
146 |   previous: string;
147 |   results: Requestion[];
148 | };
149 |
150 | export type DeleteRequistionResponse = {
151 |   summary: string;
152 |   detail: string;
153 |   status_code: number;
154 | };
155 |
156 | export type GetBalanceRequest = {
157 |   amount: string;
158 |   currency: string;
159 | };
160 |
161 | export type GetAccountsResponse = {
162 |   id: string;
163 |   created: string;
164 |   last_accessed: string;
165 |   iban?: string;
166 |   institution_id: string;
167 |   status: string;
168 |   owner_name?: string;
169 |   account: Account;
170 |   balance?: GetBalanceRequest;
171 |   institution: Institution;
172 |   resourceId?: string;
173 | }[];
174 |
175 | export type GetTransactionsRequest = {
176 |   accountId: string;
177 |   latest?: boolean;
178 | };
179 |
180 | export type GetTransactionsResponse = {
181 |   transactions: {
182 |     booked: Transaction[];
183 |     posted: Transaction[];
184 |   };
185 | };
186 |
187 | export type TransactionDescription = {
188 |   transaction: Transaction;
189 |   name?: string;
190 | };
191 |
192 | export type TransformTransaction = Transaction;
193 |
194 | export type TransformInstitution = {
195 |   id: string;
196 |   name: string;
197 |   logo: string | null;
198 |   provider: Providers;
199 | };
200 |
201 | export type TransformAccount = GetAccountsResponse[0];
202 |
203 | export type TransformAccountName = {
[TRUNCATED]
```

apps/engine/src/providers/gocardless/utils.test.ts
```
1 | import { expect, test } from "bun:test";
2 | import { getAccessValidForDays, getMaxHistoricalDays } from "./utils";
3 |
4 | test("Should return 90 days", () => {
5 |   expect(
6 |     getMaxHistoricalDays({
7 |       institutionId: "SWEDBANK_SWEDSESS",
8 |       transactionTotalDays: 720,
9 |     }),
10 |   ).toEqual(90);
11 | });
12 |
13 | test("Should return 720 days", () => {
14 |   expect(
15 |     getMaxHistoricalDays({
16 |       institutionId: "NOT_RESTRICTED",
17 |       transactionTotalDays: 720,
18 |     }),
19 |   ).toEqual(720);
20 | });
21 |
22 | test("Should return 90 days", () => {
23 |   expect(
24 |     getAccessValidForDays({
25 |       institutionId: "CUMBERLAND_CMBSGB2A",
26 |     }),
27 |   ).toEqual(90);
28 | });
29 |
30 | test("Should return 720 days", () => {
31 |   expect(
32 |     getAccessValidForDays({
33 |       institutionId: "NOT_RESTRICTED",
34 |     }),
35 |   ).toEqual(180);
36 | });
```

apps/engine/src/providers/gocardless/utils.ts
```
1 | export function isError(error: unknown) {
2 |   if (!error) return false;
3 |
4 |   const goCardLessError = error as {
5 |     response: {
6 |       data: {
7 |         summary: string;
8 |         detail: string;
9 |         type?: string;
10 |       };
11 |     };
12 |   };
13 |
14 |   return {
15 |     code:
16 |       goCardLessError.response.data.type ||
17 |       goCardLessError.response.data.summary,
18 |     message: goCardLessError.response.data.detail,
19 |   };
20 | }
21 |
22 | type GetMaxHistoricalDays = {
23 |   transactionTotalDays: number;
24 |   institutionId: string;
25 | };
26 |
27 | // https://bankaccountdata.zendesk.com/hc/en-gb/articles/11529718632476-Extended-history-and-continuous-access-edge-cases
28 | export function getMaxHistoricalDays({
29 |   transactionTotalDays,
30 |   institutionId,
31 | }: GetMaxHistoricalDays) {
32 |   const RESTRICTED_TO_90DAYS = [
33 |     "BRED_BREDFRPP",
34 |     "SWEDBANK_SWEDSESS",
35 |     "INDUSTRA_MULTLV2X",
36 |     "MEDICINOSBANK_MDBALT22",
37 |     "CESKA_SPORITELNA_LONG_GIBACZPX",
38 |     "LHV_LHVBEE22",
39 |     "BRED_BREDFRPP",
40 |     "LABORALKUTXA_CLPEES2M",
41 |     "BANKINTER_BKBKESMM",
42 |     "CAIXABANK_CAIXESBB",
43 |     "JEKYLL_JEYKLL002",
44 |     "SANTANDER_DE_SCFBDE33",
45 |     "BBVA_BBVAESMM",
46 |     "BANCA_AIDEXA_AIDXITMM",
47 |     "BANCA_PATRIMONI_SENVITT1",
48 |     "BANCA_SELLA_SELBIT2B",
49 |     "CARTALIS_CIMTITR1",
50 |     "DOTS_HYEEIT22",
51 |     "HYPE_BUSINESS_HYEEIT22",
52 |     "HYPE_HYEEIT2",
53 |     "ILLIMITY_ITTPIT2M",
54 |     "SMARTIKA_SELBIT22",
55 |     "TIM_HYEEIT22",
56 |     "TOT_SELBIT2B",
57 |     "OPYN_BITAITRRB2B",
58 |     "PAYTIPPER_PAYTITM1",
59 |     "SELLA_PERSONAL_CREDIT_SELBIT22",
60 |     // "LUMINOR_", TODO: Fix based on country (all countries)
61 |     // 'SEB_', (Baltics)
62 |   ];
63 |
64 |   const RESTRICTED_TO_180DAYS = ["COOP_EKRDEE22"];
65 |
66 |   if (RESTRICTED_TO_90DAYS.some((str) => str.startsWith(institutionId))) {
67 |     return 90;
68 |   }
69 |
70 |   if (RESTRICTED_TO_180DAYS.some((str) => str.startsWith(institutionId))) {
71 |     return 180;
72 |   }
73 |
74 |   return transactionTotalDays;
75 | }
76 |
77 | type GetAccessValidForDays = {
78 |   institutionId: string;
79 | };
80 |
81 | export function getAccessValidForDays({
82 |   institutionId,
83 | }: GetAccessValidForDays) {
84 |   const RESTRICTED_TO_90DAYS = [
85 |     "CUMBERLAND_CMBSGB2A",
86 |     "NEWDAY_AMAZON_NEWDUK00X01",
87 |     "NEWDAY_NEWPAY_NEWDUK00X15",
88 |     "NEWDAY_BIP_NEWDUK00X05",
89 |     "NEWDAY_ARGOS_NEWDUK00X04",
90 |     "NEWDAY_MARBLES_NEWDUK00X13",
91 |     "NEWDAY_WALLIS_NEWDUK00X21",
92 |     "NEWDAY_HOUSEOFFRASER_NEWDUK00X11",
93 |     "NEWDAY_EVANS_NEWDUK00X09",
94 |     "NEWDAY_BURTON_NEWDUK00X06",
95 |     "NEWDAY_AQUA_NEWDUK00X02",
96 |     "NEWDAY_TUI_NEWDUK00X20",
97 |     "NEWDAY_DEBENHAMS_NEWDUK00X07",
98 |     "NEWDAY_OPUS_NEWDUK00X16",
99 |     "NEWDAY_FLUID_NEWDUK00X10",
100 |     "NEWDAY_PULSE_NEWDUK00X17",
101 |     "NEWDAY_DOROTHYPERKINS_NEWDUK00X08",
102 |     "CATER_ALLEN_CATEGB21",
103 |     "ONEPAY_1PAYGB00",
104 |     "BANK_OF_IRELAND_BUSINESS_ONLINE_BOFIGB2B",
105 |     "BANK_OF_IRELAND_B365_BOFIGB2B",
106 |     "LOMBARD_ODIER_GB_LOCYGB2L",
107 |     "HOARES_HOABGB2L",
108 |     "CHASE_CHASGB2L",
109 |     "ABNAMRO_ABNAGB2L",
110 |     "UBS_UBSWGB2L",
111 |     "CAXTON_CAXTGB2L",
112 |     "EBURY_EBURGB2L",
113 |     "COUTTS_COUTGB22",
114 |     "ALPHA_FX_APAHGB2L",
115 |     "CYNERGY_BCYPGB2L",
116 |     "CASHPLUS_NWBKGB2L",
117 |     "MONZO_MONZGB2L",
118 |     "HANDELSBANKEN_HANDGB22",
119 |     "HANDELSBANKEN_CORPORATE_HANDGB22",
120 |     "SAINSBURYS_SANBGB21",
121 |     "TESCOBANK_TPFGGB2E",
122 |     "BBVAUK_BBVAGB2L",
123 |     "STARLING_SRLGGB3L",
124 |     "REVOLUT_REVOGB21",
125 |     "SANTANDER_GB_ABBYGB2L",
126 |     "TIDE_TIDEGB00X01",
127 |     "SVB_SVBKGB2L",
128 |     "FIRST_DIRECT_MIDLGB22",
129 |     "MNS_MSFEGB21",
130 |     "HSBC_KINETIC_HBUKGB4B",
131 |     "HSBC_BUSINESS_HBUKGB4B",
132 |     "HSBC_HBUKGB4B",
133 |     "HSBC_NET_HBUKGB4B",
134 |     "ARBUTHNOT_LATHAM_ARBUGB2L",
135 |     "CHE_CHELGB21",
136 |     "YBS_YORBGB2V",
137 |     "NATWEST_NWBKGB2L",
138 |     "RBS_GB_RBSSGBKC",
139 |     "NATWEST_CORP_NWBKGB2L",
140 |     "ADAM_COMPANY_ACIMGB21",
141 |     "RBS_GB_CORP_RBSSGBKC",
142 |     "RBS_GB_CS_RBSSGBKC",
143 |     "NATWEST_CS_NWBKGB2L",
144 |     "ULSTER_ULSBGB2B",
145 |     "NATWEST_INTERNATONAL_RBOSGIGI",
146 |     "VANQUIS_VQISGB21",
147 |     "NATIONWIDE_NAIAGB21",
148 |     "CAPITALONE_NFBKUSF1",
149 |     "DANSKEBANK_DABAGB2B",
150 |     "DANSKEBANK_BUSINESS_DABAGB2B",
151 |     "UNION_UBPGGB2X",
152 |     "WISE_TRWIGB22",
153 |     "TRIODOS_TRIOGB22",
154 |     "AMERICAN_EXPRESS_AESUGB21",
155 |     "BARCLAYS_CORPORATE_BUKBGB22",
156 |     "BARCLAYS_BUSINESS_BUKBGB22",
157 |     "BARCLAYCARD_COMMERCIAL_BUKBGB22",
158 |     "BARCLAYCARD_BUKBGB22",
159 |     "BARCLAYS_BUKBGB22",
160 |     "BARCLAYS_WEALTH_BUKBGB22",
161 |     "VIRGIN_NRNBGB22",
162 |     "GLOBALREACH_GRPLGB2L",
163 |     "COOPERATIVE_CPBKGB22",
164 |     "UNITY_TRUST_UYTBGB22",
165 |     "AIRWALLEX_AIPTAU32",
166 |     "SOLDO_SOAVGB21",
167 |     "GOHENRY_IDFEGIG1",
168 |     "GHANA_GHIBGB2L",
169 |     "THINKMONEY_THKMGB21",
170 |     "METTLE_NWBKGB2L",
171 |     "HARGREAVES_LANSDOWN_HLSVGB22",
172 |     "MONESE_MNEEGB21",
173 |     "TSB_GB_TSBSGB2A",
174 |     "AIB_FTBKGB2B",
175 |     "AIB_AIBKGB2L",
176 |     "AIB_CORP_AIBKGB2L",
177 |     "FINECO_UK_FEBIITM2",
178 |     "CREDITSUISSE_CSUKGB2L",
179 |     "SMBC_SMBCGB2L",
180 |     "MBNA_MBNAGB22",
181 |     "LLOYDS_COMMERCIAL_LOYDGB2L",
182 |     "LLOYDS_BUSINESS_LOYDGB2L",
183 |     "BANK_OF_SCOTLAND_BOFSGBS1",
184 |     "BANK_OF_SCOTLAND_BUSINESS_BOFSGBS1",
[TRUNCATED]
```

apps/engine/src/providers/plaid/plaid-api.ts
```
1 | import { PLAID_COUNTRIES } from "@/utils/countries";
2 | import { ProviderError } from "@/utils/error";
3 | import { logger } from "@/utils/logger";
4 | import { paginate } from "@/utils/paginate";
5 | import { withRetry } from "@/utils/retry";
6 | import {
7 |   Configuration,
8 |   type CountryCode,
9 |   type ItemPublicTokenExchangeResponse,
10 |   type LinkTokenCreateResponse,
11 |   PlaidApi as PlaidBaseApi,
12 |   PlaidEnvironments,
13 |   Products,
14 |   type Transaction,
15 | } from "plaid";
16 | import type {
17 |   ConnectionStatus,
18 |   GetInstitutionsRequest,
19 |   ProviderParams,
20 | } from "../types";
21 | import type {
22 |   DisconnectAccountRequest,
23 |   GetAccountBalanceRequest,
24 |   GetAccountBalanceResponse,
25 |   GetAccountsRequest,
26 |   GetAccountsResponse,
27 |   GetConnectionStatusRequest,
28 |   GetStatusResponse,
29 |   GetTransactionsRequest,
30 |   GetTransactionsResponse,
31 |   ItemPublicTokenExchangeRequest,
32 |   LinkTokenCreateRequest,
33 | } from "./types";
34 | import { isError } from "./utils";
35 |
36 | export class PlaidApi {
37 |   #client: PlaidBaseApi;
38 |   #clientId: string;
39 |   #clientSecret: string;
40 |
41 |   #countryCodes = PLAID_COUNTRIES as CountryCode[];
42 |
43 |   constructor(params: Omit<ProviderParams, "provider">) {
44 |     this.#clientId = params.envs.PLAID_CLIENT_ID;
45 |     this.#clientSecret = params.envs.PLAID_SECRET;
46 |
47 |     const configuration = new Configuration({
48 |       basePath:
49 |         PlaidEnvironments[params.envs.PLAID_ENVIRONMENT || "production"],
50 |       baseOptions: {
51 |         headers: {
52 |           "PLAID-CLIENT-ID": this.#clientId,
53 |           "PLAID-SECRET": this.#clientSecret,
54 |         },
55 |       },
56 |     });
57 |
58 |     this.#client = new PlaidBaseApi(configuration);
59 |   }
60 |
61 |   #generateWebhookUrl(environment: "sandbox" | "production") {
62 |     if (environment === "sandbox") {
63 |       return "https://staging.app.midday.ai/api/webhook/plaid";
64 |     }
65 |
66 |     return "https://app.midday.ai/api/webhook/plaid";
67 |   }
68 |
69 |   async getHealthCheck() {
70 |     try {
71 |       const response = await fetch(
72 |         "https://status.plaid.com/api/v2/status.json",
73 |       );
74 |
75 |       const data = (await response.json()) as GetStatusResponse;
76 |
77 |       return (
78 |         data.status.indicator === "none" ||
79 |         data.status.indicator === "maintenance"
80 |       );
81 |     } catch {
82 |       return false;
83 |     }
84 |   }
85 |
86 |   async getAccountBalance({
87 |     accessToken,
88 |     accountId,
89 |   }: GetAccountBalanceRequest): Promise<GetAccountBalanceResponse | undefined> {
90 |     try {
91 |       const accounts = await this.#client.accountsGet({
92 |         access_token: accessToken,
93 |         options: {
94 |           account_ids: [accountId],
95 |         },
96 |       });
97 |
98 |       return accounts.data.accounts.at(0)?.balances;
99 |     } catch (error) {
100 |       const parsedError = isError(error);
101 |
102 |       if (parsedError) {
103 |         throw new ProviderError(parsedError);
104 |       }
105 |     }
106 |   }
107 |
108 |   async getAccounts({
109 |     accessToken,
110 |     institutionId,
111 |   }: GetAccountsRequest): Promise<GetAccountsResponse | undefined> {
112 |     try {
113 |       const accounts = await this.#client.accountsGet({
114 |         access_token: accessToken,
115 |       });
116 |
117 |       const institution = await this.institutionsGetById(institutionId);
118 |
119 |       return accounts.data.accounts.map((account) => ({
120 |         ...account,
121 |         institution: {
122 |           id: institution.data.institution.institution_id,
123 |           name: institution.data.institution.name,
124 |         },
125 |       }));
126 |     } catch (error) {
127 |       const parsedError = isError(error);
128 |
129 |       if (parsedError) {
130 |         throw new ProviderError(parsedError);
131 |       }
132 |     }
133 |   }
134 |
135 |   async getTransactions({
136 |     accessToken,
137 |     accountId,
138 |     latest,
139 |   }: GetTransactionsRequest): Promise<GetTransactionsResponse | undefined> {
140 |     let added: Array<Transaction> = [];
141 |     let cursor = undefined;
142 |     let hasMore = true;
143 |     try {
144 |       if (latest) {
145 |         const { data } = await this.#client.transactionsSync({
146 |           access_token: accessToken,
147 |           count: 100,
148 |         });
149 |
150 |         added = added.concat(data.added);
151 |       } else {
152 |         while (hasMore) {
153 |           const { data } = await this.#client.transactionsSync({
154 |             access_token: accessToken,
155 |             cursor,
156 |           });
157 |
158 |           added = added.concat(data.added);
159 |           hasMore = data.has_more;
160 |           cursor = data.next_cursor;
161 |         }
162 |       }
163 |
164 |       // NOTE: Plaid transactions for all accounts
165 |       // we need to filter based on the provided accountId and pending status
166 |       return added
167 |         .filter((transaction) => transaction.account_id === accountId)
168 |         .filter((transaction) => !transaction.pending);
169 |     } catch (error) {
170 |       const parsedError = isError(error);
171 |
172 |       if (parsedError) {
173 |         throw new ProviderError(parsedError);
174 |       }
175 |     }
176 |   }
177 |
178 |   async linkTokenCreate({
179 |     userId,
180 |     language = "en",
181 |     accessToken,
182 |     environment = "production",
183 |   }: LinkTokenCreateRequest): Promise<
184 |     import("axios").AxiosResponse<LinkTokenCreateResponse>
185 |   > {
186 |     return this.#client.linkTokenCreate({
187 |       client_id: this.#clientId,
188 |       secret: this.#clientSecret,
[TRUNCATED]
```

apps/engine/src/providers/plaid/plaid-provider.ts
```
1 | import type { Provider } from "../interface";
2 | import type {
3 |   DeleteAccountsRequest,
4 |   DeleteConnectionRequest,
5 |   GetAccountBalanceRequest,
6 |   GetAccountsRequest,
7 |   GetConnectionStatusRequest,
8 |   GetInstitutionsRequest,
9 |   GetTransactionsRequest,
10 |   ProviderParams,
11 | } from "../types";
12 | import { PlaidApi } from "./plaid-api";
13 | import {
14 |   transformAccount,
15 |   transformAccountBalance,
16 |   transformInstitution,
17 |   transformTransaction,
18 | } from "./transform";
19 |
20 | export class PlaidProvider implements Provider {
21 |   #api: PlaidApi;
22 |
23 |   constructor(params: Omit<ProviderParams, "provider">) {
24 |     this.#api = new PlaidApi(params);
25 |   }
26 |
27 |   async getTransactions({
28 |     accessToken,
29 |     accountId,
30 |     accountType,
31 |     latest,
32 |   }: GetTransactionsRequest) {
33 |     if (!accessToken || !accountId) {
34 |       throw Error("accessToken or accountId is missing");
35 |     }
36 |
37 |     const response = await this.#api.getTransactions({
38 |       accessToken,
39 |       accountId,
40 |       latest,
41 |     });
42 |
43 |     return (response ?? []).map((transaction) =>
44 |       transformTransaction({
45 |         transaction,
46 |         accountType,
47 |       }),
48 |     );
49 |   }
50 |
51 |   async getHealthCheck() {
52 |     return this.#api.getHealthCheck();
53 |   }
54 |
55 |   async getAccounts({ accessToken, institutionId }: GetAccountsRequest) {
56 |     if (!accessToken || !institutionId) {
57 |       throw Error("accessToken or institutionId is missing");
58 |     }
59 |
60 |     const response = await this.#api.getAccounts({
61 |       accessToken,
62 |       institutionId,
63 |     });
64 |
65 |     return (response ?? []).map(transformAccount);
66 |   }
67 |
68 |   async getAccountBalance({
69 |     accessToken,
70 |     accountId,
71 |   }: GetAccountBalanceRequest) {
72 |     if (!accessToken || !accountId) {
73 |       throw Error("Missing params");
74 |     }
75 |
76 |     const response = await this.#api.getAccountBalance({
77 |       accessToken,
78 |       accountId,
79 |     });
80 |
81 |     return transformAccountBalance(response);
82 |   }
83 |
84 |   async getInstitutions({ countryCode }: GetInstitutionsRequest) {
85 |     const response = await this.#api.getInstitutions({
86 |       countryCode,
87 |     });
88 |
89 |     return response.map(transformInstitution);
90 |   }
91 |
92 |   async deleteAccounts({ accessToken }: DeleteAccountsRequest) {
93 |     if (!accessToken) {
94 |       throw Error("accessToken is missing");
95 |     }
96 |
97 |     await this.#api.deleteAccounts({
98 |       accessToken,
99 |     });
100 |   }
101 |
102 |   async getConnectionStatus({ accessToken }: GetConnectionStatusRequest) {
103 |     if (!accessToken) {
104 |       throw Error("accessToken is missing");
105 |     }
106 |
107 |     const response = await this.#api.getConnectionStatus({ accessToken });
108 |
109 |     return response;
110 |   }
111 |
112 |   async deleteConnection({ accessToken }: DeleteConnectionRequest) {
113 |     if (!accessToken) {
114 |       throw Error("accessToken is missing");
115 |     }
116 |
117 |     await this.#api.deleteAccounts({ accessToken });
118 |   }
119 | }
```

apps/engine/src/providers/plaid/transform.test.ts
```
1 | import { expect, test } from "bun:test";
2 | import {
3 |   AccountSubtype,
4 |   AccountType,
5 |   CounterpartyType,
6 |   TransactionCode,
7 |   TransactionPaymentChannelEnum,
8 |   TransactionTransactionTypeEnum,
9 | } from "plaid";
10 | import {
11 |   transformAccount,
12 |   transformAccountBalance,
13 |   transformTransaction,
14 | } from "./transform";
15 |
16 | test("Transform pending transaction", () => {
17 |   expect(
18 |     transformTransaction({
19 |       accountType: "credit",
20 |       transaction: {
21 |         account_id: "AG7EkLW7DRSVaN8Z75jMT1DJN51QpWc9LKB7w",
22 |         account_owner: null,
23 |         amount: 5.4,
24 |         authorized_date: "2024-02-23",
25 |         authorized_datetime: null,
26 |         category: ["Travel", "Taxi"],
27 |         category_id: "22016000",
28 |         check_number: null,
29 |         counterparties: [
30 |           {
31 |             confidence_level: "VERY_HIGH",
32 |             entity_id: "eyg8o776k0QmNgVpAmaQj4WgzW9Qzo6O51gdd",
33 |             logo_url: "https://plaid-merchant-logos.plaid.com/uber_1060.png",
34 |             name: "Uber",
35 |             type: CounterpartyType.Merchant,
36 |             website: "uber.com",
37 |           },
38 |         ],
39 |         date: "2024-02-24",
40 |         datetime: null,
41 |         iso_currency_code: "CAD",
42 |         location: {
43 |           address: null,
44 |           city: null,
45 |           country: null,
46 |           lat: null,
47 |           lon: null,
48 |           postal_code: null,
49 |           region: null,
50 |           store_number: null,
51 |         },
52 |         logo_url: "https://plaid-merchant-logos.plaid.com/uber_1060.png",
53 |         merchant_entity_id: "eyg8o776k0QmNgVpAmaQj4WgzW9Qzo6O51gdd",
54 |         merchant_name: "Uber",
55 |         name: "Uber 063015 SF**POOL**",
56 |         payment_channel: TransactionPaymentChannelEnum.Online,
57 |         payment_meta: {
58 |           by_order_of: null,
59 |           payee: null,
60 |           payer: null,
61 |           payment_method: null,
62 |           payment_processor: null,
63 |           ppd_id: null,
64 |           reason: null,
65 |           reference_number: null,
66 |         },
67 |         pending: true,
68 |         pending_transaction_id: null,
69 |         personal_finance_category: {
70 |           confidence_level: "VERY_HIGH",
71 |           detailed: "TRANSPORTATION_TAXIS_AND_RIDE_SHARES",
72 |           primary: "TRANSPORTATION",
73 |         },
74 |         personal_finance_category_icon_url:
75 |           "https://plaid-category-icons.plaid.com/PFC_TRANSPORTATION.png",
76 |         transaction_code: null,
77 |         transaction_id: "NxkDjlyk45cQoDm5PEqJuKJaw6qrj9cy89zBA",
78 |         transaction_type: TransactionTransactionTypeEnum.Special,
79 |         unofficial_currency_code: null,
80 |         website: "uber.com",
81 |       },
82 |     }),
83 |   ).toMatchSnapshot();
84 | });
85 |
86 | test("Transform income transaction", () => {
87 |   expect(
88 |     transformTransaction({
89 |       accountType: "depository",
90 |       transaction: {
91 |         account_id: "AG7EkLW7DRSVaN8Z75jMT1DJN51QpWc9LKB7w",
92 |         account_owner: null,
93 |         amount: 1500,
94 |         authorized_date: "2024-02-22",
95 |         authorized_datetime: null,
96 |         category: ["Travel", "Airlines and Aviation Services"],
97 |         category_id: "22001000",
98 |         check_number: null,
99 |         counterparties: [
100 |           {
101 |             confidence_level: "VERY_HIGH",
102 |             entity_id: "NKDjqyAdQQzpyeD8qpLnX0D6yvLe2KYKYYzQ4",
103 |             logo_url:
104 |               "https://plaid-merchant-logos.plaid.com/united_airlines_1065.png",
105 |             name: "United Airlines",
106 |             type: CounterpartyType.Merchant,
107 |             website: "united.com",
108 |           },
109 |         ],
110 |         date: "2024-02-22",
111 |         datetime: null,
112 |         iso_currency_code: "CAD",
113 |         location: {
114 |           address: null,
115 |           city: null,
116 |           country: null,
117 |           lat: null,
118 |           lon: null,
119 |           postal_code: null,
120 |           region: null,
121 |           store_number: null,
122 |         },
123 |         logo_url:
124 |           "https://plaid-merchant-logos.plaid.com/united_airlines_1065.png",
125 |         merchant_entity_id: "NKDjqyAdQQzpyeD8qpLnX0D6yvLe2KYKYYzQ4",
126 |         merchant_name: "United Airlines",
127 |         name: "United Airlines",
128 |         payment_channel: TransactionPaymentChannelEnum.InStore,
129 |         payment_meta: {
130 |           by_order_of: null,
131 |           payee: null,
132 |           payer: null,
133 |           payment_method: null,
134 |           payment_processor: null,
135 |           ppd_id: null,
136 |           reason: null,
137 |           reference_number: null,
138 |         },
139 |         pending: false,
140 |         pending_transaction_id: null,
141 |         personal_finance_category: {
142 |           confidence_level: "VERY_HIGH",
143 |           detailed: "TRAVEL_FLIGHTS",
144 |           primary: "TRAVEL",
145 |         },
146 |         personal_finance_category_icon_url:
147 |           "https://plaid-category-icons.plaid.com/PFC_TRAVEL.png",
148 |         transaction_code: null,
149 |         transaction_id: "5QKmMdaKWgtzkvKEPmqriLZR1mV3kMF5X9EeX",
150 |         transaction_type: TransactionTransactionTypeEnum.Special,
151 |         unofficial_currency_code: null,
152 |         website: "united.com",
153 |       },
154 |     }),
155 |   ).toMatchSnapshot();
156 | });
157 |
158 | test("Transform type transfer", () => {
159 |   expect(
160 |     transformTransaction({
161 |       accountType: "credit",
162 |       transaction: {
163 |         account_id: "AG7EkLW7DRSVaN8Z75jMT1DJN51QpWc9LKB7w",
164 |         account_owner: null,
165 |         amount: 31.53,
166 |         authorized_date: "2024-02-23",
167 |         authorized_datetime: null,
168 |         category: ["Travel", "Taxi"],
169 |         category_id: "22016000",
170 |         check_number: null,
171 |         counterparties: [
172 |           {
173 |             confidence_level: "VERY_HIGH",
174 |             entity_id: "eyg8o776k0QmNgVpAmaQj4WgzW9Qzo6O51gdd",
175 |             logo_url: "https://plaid-merchant-logos.plaid.com/uber_1060.png",
[TRUNCATED]
```

apps/engine/src/providers/plaid/transform.ts
```
1 | import { Providers } from "@/common/schema";
2 | import { getType } from "@/utils/account";
3 | import { getLogoURL } from "@/utils/logo";
4 | import { capitalCase } from "change-case";
5 | import type { Transaction, TransactionCode } from "plaid";
6 | import type {
7 |   Account as BaseAccount,
8 |   Balance as BaseBalance,
9 |   Transaction as BaseTransaction,
10 | } from "../types";
11 | import type {
12 |   TransformAccount,
13 |   TransformAccountBalance,
14 |   TransformInstitution,
15 |   TransformTransactionPayload,
16 | } from "./types";
17 |
18 | export const mapTransactionMethod = (type?: TransactionCode | null) => {
19 |   switch (type) {
20 |     case "bill payment":
21 |       return "payment";
22 |     case "purchase":
23 |       return "card_purchase";
24 |     case "atm":
25 |       return "card_atm";
26 |     case "transfer":
27 |       return "transfer";
28 |     case "interest":
29 |       return "interest";
30 |     case "bank charge":
31 |       return "fee";
32 |     default:
33 |       return "other";
34 |   }
35 | };
36 |
37 | type MapTransactionCategory = {
38 |   transaction: Transaction;
39 |   amount: number;
40 | };
41 |
42 | export const mapTransactionCategory = ({
43 |   transaction,
44 |   amount,
45 | }: MapTransactionCategory) => {
46 |   if (transaction.personal_finance_category?.primary === "INCOME") {
47 |     return "income";
48 |   }
49 |
50 |   if (amount > 0) {
51 |     return "income";
52 |   }
53 |
54 |   if (
55 |     transaction.transaction_code === "bank charge" ||
56 |     transaction.personal_finance_category?.primary === "BANK_FEES"
57 |   ) {
58 |     return "fees";
59 |   }
60 |
61 |   if (transaction.personal_finance_category?.primary === "FOOD_AND_DRINK") {
62 |     return "meals";
63 |   }
64 |
65 |   if (
66 |     transaction.personal_finance_category?.primary === "TRANSPORTATION" ||
67 |     transaction.personal_finance_category?.primary === "TRAVEL"
68 |   ) {
69 |     return "travel";
70 |   }
71 |
72 |   if (
73 |     transaction.personal_finance_category?.detailed ===
74 |     "GENERAL_SERVICES_OTHER_GENERAL_SERVICES"
75 |   ) {
76 |     return "software";
77 |   }
78 |
79 |   if (
80 |     transaction.personal_finance_category?.detailed ===
81 |       "RENT_AND_UTILITIES_GAS_AND_ELECTRICITY" ||
82 |     transaction.personal_finance_category?.detailed ===
83 |       "RENT_AND_UTILITIES_SEWAGE_AND_WASTE_MANAGEMENT" ||
84 |     transaction.personal_finance_category?.detailed ===
85 |       "RENT_AND_UTILITIES_WATER" ||
86 |     transaction.personal_finance_category?.detailed ===
87 |       "RENT_AND_UTILITIES_OTHER_UTILITIES"
88 |   ) {
89 |     return "facilities-expenses";
90 |   }
91 |
92 |   if (
93 |     transaction.personal_finance_category?.detailed ===
94 |     "RENT_AND_UTILITIES_RENT"
95 |   ) {
96 |     return "rent";
97 |   }
98 |
99 |   if (
100 |     transaction.personal_finance_category?.detailed ===
101 |       "RENT_AND_UTILITIES_INTERNET_AND_CABLE" ||
102 |     transaction.personal_finance_category?.detailed ===
103 |       "RENT_AND_UTILITIES_TELEPHONE"
104 |   ) {
105 |     return "internet-and-telephone";
106 |   }
107 |
108 |   if (transaction.personal_finance_category?.primary === "HOME_IMPROVEMENT") {
109 |     return "office-supplies";
110 |   }
111 |
112 |   if (transaction.personal_finance_category?.primary === "ENTERTAINMENT") {
113 |     return "activity";
114 |   }
115 |
116 |   return null;
117 | };
118 |
119 | const formatAmout = (amount: number) => {
120 |   // Positive values when money moves out of the account; negative values when money moves in.
121 |   // For example, debit card purchases are positive; credit card payments, direct deposits, and refunds are negative.
122 |   return +(amount * -1);
123 | };
124 |
125 | const transformDescription = (transaction: Transaction) => {
126 |   const name = capitalCase(transaction.name);
127 |
128 |   if (
129 |     transaction?.original_description &&
130 |     transaction.original_description !== name
131 |   ) {
132 |     return capitalCase(transaction.original_description);
133 |   }
134 |
135 |   if (transaction?.merchant_name && transaction?.merchant_name !== name) {
136 |     return transaction?.merchant_name;
137 |   }
138 |
139 |   return null;
140 | };
141 |
142 | export const transformTransaction = ({
143 |   transaction,
144 | }: TransformTransactionPayload): BaseTransaction => {
145 |   const method = mapTransactionMethod(transaction?.transaction_code);
146 |   const amount = formatAmout(transaction.amount);
147 |   const description = transformDescription(transaction) ?? null;
148 |
149 |   return {
150 |     id: transaction.transaction_id,
151 |     date: transaction.date,
152 |     name: transaction.name,
153 |     description,
154 |     currency_rate: null,
155 |     currency_source: null,
156 |     method,
157 |     amount,
158 |     currency:
159 |       transaction?.iso_currency_code?.toUpperCase() ||
160 |       transaction?.unofficial_currency_code?.toUpperCase() ||
161 |       "USD",
162 |     category: mapTransactionCategory({ transaction, amount }),
163 |     balance: null,
164 |     status: transaction.pending ? "pending" : "posted",
165 |   };
166 | };
167 |
168 | export const transformAccount = ({
169 |   account_id,
170 |   name,
171 |   balances,
172 |   institution,
173 |   type,
174 | }: TransformAccount): BaseAccount => {
175 |   return {
176 |     id: account_id,
[TRUNCATED]
```

apps/engine/src/providers/plaid/types.ts
```
1 | import type { AccountType } from "@/utils/account";
2 | import type {
3 |   AccountsGetResponse,
4 |   Institution as BaseInstitution,
5 |   Transaction,
6 |   TransactionsSyncResponse,
7 | } from "plaid";
8 |
9 | export type LinkTokenCreateRequest = {
10 |   userId: string;
11 |   language?: string;
12 |   accessToken?: string;
13 |   environment?: "sandbox" | "production";
14 | };
15 |
16 | export type GetStatusResponse = {
17 |   page: {
18 |     id: string;
19 |     name: string;
20 |     url: string;
21 |     time_zone: string;
22 |     updated_at: string;
23 |   };
24 |   status: {
25 |     indicator: string;
26 |     description: string;
27 |   };
28 | };
29 |
30 | export type GetTransactionsRequest = {
31 |   accessToken: string;
32 |   accountId: string;
33 |   latest?: boolean;
34 | };
35 |
36 | export type GetAccountsRequest = {
37 |   accessToken: string;
38 |   institutionId: string;
39 | };
40 |
41 | export type ItemPublicTokenExchangeRequest = {
42 |   publicToken: string;
43 | };
44 |
45 | export type Institution = {
46 |   id: string;
47 |   name: string;
48 |   logo?: string | null;
49 | };
50 |
51 | export type TransformInstitution = BaseInstitution;
52 |
53 | export type AccountWithInstitution = AccountsGetResponse["accounts"][0] & {
54 |   institution: Institution;
55 | };
56 |
57 | export type GetAccountsResponse = AccountWithInstitution[];
58 |
59 | export type TransformAccount = AccountWithInstitution;
60 |
61 | export type TransformAccountBalance =
62 |   AccountsGetResponse["accounts"][0]["balances"];
63 |
64 | export type TransformTransaction = Transaction;
65 |
66 | export type GetTransactionsResponse = TransactionsSyncResponse["added"];
67 |
68 | export type GetAccountBalanceResponse =
69 |   AccountsGetResponse["accounts"][0]["balances"];
70 |
71 | export interface GetAccountBalanceRequest {
72 |   accessToken: string;
73 |   accountId: string;
74 | }
75 |
76 | export type TransformTransactionPayload = {
77 |   transaction: TransformTransaction;
78 |   accountType: AccountType;
79 | };
80 |
81 | export type DisconnectAccountRequest = {
82 |   accessToken: string;
83 | };
84 |
85 | export type GetConnectionStatusRequest = {
86 |   accessToken: string;
87 | };
```

apps/engine/src/providers/plaid/utils.ts
```
1 | import axios from "axios";
2 |
3 | export function isError(error: unknown) {
4 |   if (!error) return false;
5 |   if (!axios.isAxiosError(error)) return false;
6 |   if (typeof error.response?.data !== "object") return false;
7 |
8 |   const { data } = error.response;
9 |
10 |   return {
11 |     code: data.error_code,
12 |     message: data.error_message,
13 |   };
14 | }
```

apps/engine/src/providers/teller/teller-api.ts
```
1 | import { ProviderError } from "@/utils/error";
2 | import type {
3 |   GetConnectionStatusRequest,
4 |   GetConnectionStatusResponse,
5 |   ProviderParams,
6 | } from "../types";
7 | import type {
8 |   AuthenticatedRequest,
9 |   DisconnectAccountRequest,
10 |   GetAccountBalanceRequest,
11 |   GetAccountBalanceResponse,
12 |   GetAccountsResponse,
13 |   GetInstitutionsResponse,
14 |   GetTransactionsRequest,
15 |   GetTransactionsResponse,
16 | } from "./types";
17 | import { isError } from "./utils";
18 |
19 | export class TellerApi {
20 |   #baseUrl = "https://api.teller.io";
21 |
22 |   #fetcher: Fetcher;
23 |
24 |   constructor(params: Omit<ProviderParams, "provider">) {
25 |     this.#fetcher = params.fetcher as Fetcher;
26 |   }
27 |
28 |   async getHealthCheck() {
29 |     try {
30 |       await fetch(`${this.#baseUrl}/health`);
31 |       return true;
32 |     } catch (error) {
33 |       return false;
34 |     }
35 |   }
36 |
37 |   async getAccounts({
38 |     accessToken,
39 |   }: AuthenticatedRequest): Promise<GetAccountsResponse> {
40 |     const accounts: GetAccountsResponse = await this.#get(
41 |       "/accounts",
42 |       accessToken,
43 |     );
44 |
45 |     return Promise.all(
46 |       accounts?.map(async (account) => {
47 |         const balance = await this.getAccountBalance({
48 |           accountId: account.id,
49 |           accessToken,
50 |         });
51 |
52 |         return { ...account, balance };
53 |       }),
54 |     );
55 |   }
56 |
57 |   async getTransactions({
58 |     accountId,
59 |     accessToken,
60 |     latest,
61 |     count,
62 |   }: GetTransactionsRequest): Promise<GetTransactionsResponse> {
63 |     const result = await this.#get<GetTransactionsResponse>(
64 |       `/accounts/${accountId}/transactions`,
65 |       accessToken,
66 |       {
67 |         count: latest ? 100 : count,
68 |       },
69 |     );
70 |
71 |     // NOTE: Remove pending transactions until upsert issue is fixed
72 |     return result.filter((transaction) => transaction.status !== "pending");
73 |   }
74 |
75 |   async getAccountBalance({
76 |     accountId,
77 |     accessToken,
78 |   }: GetAccountBalanceRequest): Promise<GetAccountBalanceResponse> {
79 |     const transactions = await this.getTransactions({
80 |       accountId,
81 |       accessToken,
82 |       count: 20,
83 |     });
84 |
85 |     const amount = transactions.find(
86 |       (transaction) => transaction.running_balance !== null,
87 |     )?.running_balance;
88 |
89 |     return {
90 |       currency: "USD",
91 |       amount: +(amount ?? 0),
92 |     };
93 |   }
94 |
95 |   async getInstitutions(): Promise<GetInstitutionsResponse> {
96 |     return this.#get("/institutions");
97 |   }
98 |
99 |   async getConnectionStatus({
100 |     accessToken,
101 |   }: GetConnectionStatusRequest): Promise<GetConnectionStatusResponse> {
102 |     try {
103 |       const accounts = await this.#get("/accounts", accessToken);
104 |
105 |       if (!Array.isArray(accounts)) {
106 |         return { status: "disconnected" };
107 |       }
108 |
109 |       // If we can fetch any accounts, the connection is active
110 |       // Check all accounts in parallel
111 |       const results = await Promise.allSettled(
112 |         accounts.map((account) =>
113 |           this.#get(`/accounts/${account.id}`, accessToken),
114 |         ),
115 |       );
116 |
117 |       // If any account request succeeded, connection is valid
118 |       if (results.some((result) => result.status === "fulfilled")) {
119 |         return { status: "connected" };
120 |       }
121 |
122 |       // If we couldn't verify any accounts, assume disconnected
123 |       return { status: "disconnected" };
124 |     } catch (error) {
125 |       const parsedError = isError(error);
126 |
127 |       if (parsedError) {
128 |         const providerError = new ProviderError(parsedError);
129 |
130 |         if (providerError.code === "disconnected") {
131 |           return { status: "disconnected" };
132 |         }
133 |       }
134 |     }
135 |
136 |     // If we get here, the account is not disconnected
137 |     // But it could be a connection issue between Teller and the institution
138 |     return { status: "connected" };
139 |   }
140 |
141 |   async deleteAccounts({
142 |     accessToken,
143 |   }: DisconnectAccountRequest): Promise<void> {
144 |     await this.#fetcher.fetch(`${this.#baseUrl}/accounts`, {
145 |       method: "delete",
146 |       headers: new Headers({
147 |         Authorization: `Basic ${btoa(`${accessToken}:`)}`,
148 |       }),
149 |     });
150 |   }
151 |
152 |   async #get<TResponse>(
153 |     path: string,
154 |     token?: string,
155 |     params?: Record<string, string | number | undefined>,
156 |   ): Promise<TResponse> {
157 |     const url = new URL(`${this.#baseUrl}/${path}`);
158 |
159 |     if (params) {
160 |       for (const [key, value] of Object.entries(params)) {
161 |         if (value) {
162 |           url.searchParams.append(key, value.toString());
163 |         }
164 |       }
165 |     }
166 |
167 |     return <TResponse>this.#fetcher
168 |       .fetch(url.toString(), {
169 |         headers: new Headers({
170 |           Authorization: `Basic ${btoa(`${token}:`)}`,
171 |         }),
172 |       })
173 |       .then((response) => response.json())
174 |       .then((data) => {
175 |         const error = isError(data);
176 |
177 |         if (error) {
178 |           throw new ProviderError(error);
179 |         }
180 |
181 |         return data as TResponse;
182 |       });
183 |   }
184 | }
```

apps/engine/src/providers/teller/teller-provider.ts
```
1 | import type { Provider } from "../interface";
2 | import type {
3 |   DeleteAccountsRequest,
4 |   DeleteConnectionRequest,
5 |   GetAccountBalanceRequest,
6 |   GetAccountsRequest,
7 |   GetConnectionStatusRequest,
8 |   GetTransactionsRequest,
9 |   ProviderParams,
10 | } from "../types";
11 | import { TellerApi } from "./teller-api";
12 | import {
13 |   transformAccount,
14 |   transformInstitution,
15 |   transformTransaction,
16 | } from "./transform";
17 |
18 | export class TellerProvider implements Provider {
19 |   #api: TellerApi;
20 |
21 |   constructor(params: Omit<ProviderParams, "provider">) {
22 |     this.#api = new TellerApi(params);
23 |   }
24 |
25 |   async getHealthCheck() {
26 |     return this.#api.getHealthCheck();
27 |   }
28 |
29 |   async getTransactions({
30 |     accountId,
31 |     accessToken,
32 |     accountType,
33 |     latest,
34 |   }: GetTransactionsRequest) {
35 |     if (!accessToken) {
36 |       throw Error("accessToken missing");
37 |     }
38 |
39 |     const response = await this.#api.getTransactions({
40 |       accountId,
41 |       accessToken,
42 |       latest,
43 |     });
44 |
45 |     return response.map((transaction) =>
46 |       transformTransaction({
47 |         transaction,
48 |         accountType,
49 |       }),
50 |     );
51 |   }
52 |
53 |   async getAccounts({ accessToken }: GetAccountsRequest) {
54 |     if (!accessToken) {
55 |       throw Error("accessToken missing");
56 |     }
57 |
58 |     const response = await this.#api.getAccounts({ accessToken });
59 |
60 |     return response.map(transformAccount);
61 |   }
62 |
63 |   async getAccountBalance({
64 |     accessToken,
65 |     accountId,
66 |   }: GetAccountBalanceRequest) {
67 |     if (!accessToken || !accountId) {
68 |       throw Error("Missing params");
69 |     }
70 |
71 |     return this.#api.getAccountBalance({
72 |       accessToken,
73 |       accountId,
74 |     });
75 |   }
76 |
77 |   async getInstitutions() {
78 |     const response = await this.#api.getInstitutions();
79 |
80 |     return response.map(transformInstitution);
81 |   }
82 |
83 |   async deleteAccounts({ accessToken }: DeleteAccountsRequest) {
84 |     if (!accessToken) {
85 |       throw Error("accessToken is missing");
86 |     }
87 |
88 |     await this.#api.deleteAccounts({
89 |       accessToken,
90 |     });
91 |   }
92 |
93 |   async getConnectionStatus({ accessToken }: GetConnectionStatusRequest) {
94 |     if (!accessToken) {
95 |       throw Error("accessToken missing");
96 |     }
97 |
98 |     const response = await this.#api.getConnectionStatus({ accessToken });
99 |
100 |     return response;
101 |   }
102 |
103 |   async deleteConnection({ accessToken }: DeleteConnectionRequest) {
104 |     if (!accessToken) {
105 |       throw Error("accessToken missing");
106 |     }
107 |
108 |     await this.#api.deleteAccounts({ accessToken });
109 |   }
110 | }
```

apps/engine/src/providers/teller/transform.test.ts
```
1 | import { expect, test } from "bun:test";
2 | import {
3 |   transformAccount,
4 |   transformAccountBalance,
5 |   transformTransaction,
6 | } from "./transform";
7 |
8 | test("Transform pending transaction", () => {
9 |   expect(
10 |     transformTransaction({
11 |       accountType: "depository",
12 |       transaction: {
13 |         type: "check",
14 |         status: "pending",
15 |         running_balance: null,
16 |         links: {
17 |           self: "https://api.teller.io/accounts/acc_os41qe3a66ks2djhss000/transactions/txn_os41r5u90e29shubl2000",
18 |           account: "https://api.teller.io/accounts/acc_os41qe3a66ks2djhss000",
19 |         },
20 |         id: "txn_os41r5u90e29shubl2000",
21 |         details: {
22 |           processing_status: "complete",
23 |           counterparty: {
24 |             type: "organization",
25 |             name: "BANK OF MANY",
26 |           },
27 |           category: "general",
28 |         },
29 |         description: "Online Check Deposit",
30 |         date: "2024-03-05",
31 |         amount: "-83.62",
32 |         account_id: "acc_os41qe3a66ks2djhss000",
33 |       },
34 |     }),
35 |   ).toMatchSnapshot();
36 | });
37 |
38 | test("Transform pending transaction", () => {
39 |   expect(
40 |     transformTransaction({
41 |       accountType: "credit",
42 |       transaction: {
43 |         type: "check",
44 |         status: "pending",
45 |         running_balance: null,
46 |         links: {
47 |           self: "https://api.teller.io/accounts/acc_os41qe3a66ks2djhss000/transactions/txn_os41r5u90e29shubl2000",
48 |           account: "https://api.teller.io/accounts/acc_os41qe3a66ks2djhss000",
49 |         },
50 |         id: "txn_os41r5u90e29shubl2000",
51 |         details: {
52 |           processing_status: "complete",
53 |           counterparty: {
54 |             type: "organization",
55 |             name: "BANK OF MANY",
56 |           },
57 |           category: "general",
58 |         },
59 |         description: "Technology",
60 |         date: "2024-03-05",
61 |         amount: "29",
62 |         account_id: "acc_os41qe3a66ks2djhss000",
63 |       },
64 |     }),
65 |   ).toMatchSnapshot();
66 | });
67 |
68 | test("Transform card payment transaction", () => {
69 |   expect(
70 |     transformTransaction({
71 |       accountType: "depository",
72 |       transaction: {
73 |         type: "card_payment",
74 |         status: "posted",
75 |         running_balance: "83431.46",
76 |         links: {
77 |           self: "https://api.teller.io/accounts/acc_os41qe3a66ks2djhss000/transactions/txn_os41r5u90e29shubl2005",
78 |           account: "https://api.teller.io/accounts/acc_os41qe3a66ks2djhss000",
79 |         },
80 |         id: "txn_os41r5u90e29shubl2005",
81 |         details: {
82 |           processing_status: "complete",
83 |           counterparty: {
84 |             type: "organization",
85 |             name: "NORDSTROM",
86 |           },
87 |           category: "shopping",
88 |         },
89 |         description: "Nordstrom",
90 |         date: "2024-03-01",
91 |         amount: "-68.90",
92 |         account_id: "acc_os41qe3a66ks2djhss000",
93 |       },
94 |     }),
95 |   ).toMatchSnapshot();
96 | });
97 |
98 | test("Transform income transaction", () => {
99 |   expect(
100 |     transformTransaction({
101 |       accountType: "depository",
102 |       transaction: {
103 |         type: "card_payment",
104 |         status: "posted",
105 |         running_balance: "83296.40",
106 |         links: {
107 |           self: "https://api.teller.io/accounts/acc_os41qe3a66ks2djhss000/transactions/txn_os41r5u90e29shubl2002",
108 |           account: "https://api.teller.io/accounts/acc_os41qe3a66ks2djhss000",
109 |         },
110 |         id: "txn_os41r5u90e29shubl2002",
111 |         details: {
112 |           processing_status: "complete",
113 |           counterparty: {
114 |             type: "organization",
115 |             name: "EXXON MOBIL",
116 |           },
117 |           category: "fuel",
118 |         },
119 |         description: "Exxon Mobil",
120 |         date: "2024-03-03",
121 |         amount: "1000000",
122 |         account_id: "acc_os41qe3a66ks2djhss000",
123 |       },
124 |     }),
125 |   ).toMatchSnapshot();
126 | });
127 |
128 | test("Transform type transfer", () => {
129 |   expect(
130 |     transformTransaction({
131 |       accountType: "depository",
132 |       transaction: {
133 |         type: "transfer",
134 |         status: "posted",
135 |         running_balance: "85897.25",
136 |         links: {
137 |           self: "https://api.teller.io/accounts/acc_os41qe3a66ks2djhss000/transactions/txn_os41r5ua0e29shubl2001",
138 |           account: "https://api.teller.io/accounts/acc_os41qe3a66ks2djhss000",
139 |         },
140 |         id: "txn_os41r5ua0e29shubl2001",
141 |         details: {
142 |           processing_status: "complete",
143 |           counterparty: {
144 |             type: "person",
145 |             name: "YOURSELF",
146 |           },
147 |           category: "general",
148 |         },
149 |         description: "Recurring Transfer to Savings",
150 |         date: "2024-01-27",
151 |         amount: "-37.99",
152 |         account_id: "acc_os41qe3a66ks2djhss000",
153 |       },
154 |     }),
155 |   ).toMatchSnapshot();
156 | });
157 |
158 | test("Transform accounts", () => {
159 |   expect(
160 |     transformAccount({
161 |       type: "credit",
162 |       subtype: "credit_card",
163 |       status: "open",
164 |       name: "Platinum Card",
165 |       links: {
166 |         transactions:
167 |           "https://api.teller.io/accounts/acc_os557c2mge29shubl2000/transactions",
168 |         self: "https://api.teller.io/accounts/acc_os557c2mge29shubl2000",
169 |         balances:
170 |           "https://api.teller.io/accounts/acc_os557c2mge29shubl2000/balances",
171 |       },
172 |       last_four: "6587",
173 |       institution: {
174 |         name: "Mercury",
175 |         id: "mercury",
176 |       },
177 |       balance: {
178 |         currency: "USD",
179 |         amount: 2011100,
180 |       },
181 |       id: "acc_os557c2mge29shubl2000",
182 |       enrollment_id: "enr_os557c8pck2deoskak000",
183 |       currency: "USD",
184 |     }),
185 |   ).toMatchSnapshot();
186 | });
187 |
188 | test("Transform account balance", () => {
189 |   expect(
190 |     transformAccountBalance({
191 |       currency: "USD",
192 |       amount: 2011100,
193 |     }),
194 |   ).toMatchSnapshot();
195 | });
```

apps/engine/src/providers/teller/transform.ts
```
1 | import { Providers } from "@/common/schema";
2 | import { getType } from "@/utils/account";
3 | import { getLogoURL } from "@/utils/logo";
4 | import { capitalCase } from "change-case";
5 | import type {
6 |   Account as BaseAccount,
7 |   Balance as BaseAccountBalance,
8 |   Transaction as BaseTransaction,
9 | } from "../types";
10 | import type {
11 |   FormatAmount,
12 |   Transaction,
13 |   TransformAccount,
14 |   TransformAccountBalance,
15 |   TransformInstitution,
16 |   TransformTransaction,
17 | } from "./types";
18 |
19 | export const mapTransactionMethod = (type?: string) => {
20 |   switch (type) {
21 |     case "payment":
22 |     case "bill_payment":
23 |     case "digital_payment":
24 |       return "payment";
25 |     case "card_payment":
26 |       return "card_purchase";
27 |     case "atm":
28 |       return "card_atm";
29 |     case "transfer":
30 |       return "transfer";
31 |     case "ach":
32 |       return "ach";
33 |     case "interest":
34 |       return "interest";
35 |     case "deposit":
36 |       return "deposit";
37 |     case "wire":
38 |       return "wire";
39 |     case "fee":
40 |       return "fee";
41 |     default:
42 |       return "other";
43 |   }
44 | };
45 |
46 | type MapTransactionCategory = {
47 |   transaction: Transaction;
48 |   amount: number;
49 | };
50 |
51 | export const mapTransactionCategory = ({
52 |   transaction,
53 |   amount,
54 | }: MapTransactionCategory) => {
55 |   if (transaction.type === "fee") {
56 |     return "fees";
57 |   }
58 |
59 |   if (amount > 0) {
60 |     return "income";
61 |   }
62 |
63 |   switch (transaction?.details.category) {
64 |     case "bar":
65 |     case "dining":
66 |     case "groceries":
67 |       return "meals";
68 |     case "transport":
69 |     case "transportation":
70 |       return "travel";
71 |     case "tax":
72 |       return "taxes";
73 |     case "office":
74 |       return "office-supplies";
75 |     case "phone":
76 |       return "internet-and-telephone";
77 |     case "software":
78 |       return "software";
79 |     case "entertainment":
80 |     case "sport":
81 |       return "activity";
82 |     case "utilities":
83 |     case "electronics":
84 |       return "equipment";
85 |     default:
86 |       return null;
87 |   }
88 | };
89 |
90 | export const transformDescription = (transaction: Transaction) => {
91 |   const description =
92 |     transaction?.details?.counterparty?.name &&
93 |     capitalCase(transaction.details.counterparty.name);
94 |
95 |   if (transaction.description !== description && description) {
96 |     return capitalCase(description);
97 |   }
98 |
99 |   return null;
100 | };
101 |
102 | const formatAmout = ({ amount, accountType }: FormatAmount) => {
103 |   // NOTE: For account credit positive values when money moves out of the account; negative values when money moves in.
104 |   if (accountType === "credit") {
105 |     return +(amount * -1);
106 |   }
107 |
108 |   return +amount;
109 | };
110 |
111 | export const transformTransaction = ({
112 |   transaction,
113 |   accountType,
114 | }: TransformTransaction): BaseTransaction => {
115 |   const method = mapTransactionMethod(transaction.type);
116 |   const description = transformDescription(transaction);
117 |   const amount = formatAmout({
118 |     amount: +transaction.amount,
119 |     accountType,
120 |   });
121 |
122 |   return {
123 |     id: transaction.id,
124 |     date: transaction.date,
125 |     name: transaction.description && capitalCase(transaction.description),
126 |     description: description ?? null,
127 |     currency_rate: null,
128 |     currency_source: null,
129 |     method,
130 |     amount,
131 |     currency: "USD",
132 |     category: mapTransactionCategory({ transaction, amount }),
133 |     balance: transaction?.running_balance ? +transaction.running_balance : null,
134 |     status: transaction?.status === "posted" ? "posted" : "pending",
135 |   };
136 | };
137 |
138 | export const transformAccount = ({
139 |   id,
140 |   name,
141 |   currency,
142 |   enrollment_id,
143 |   type,
144 |   institution,
145 |   balance,
146 | }: TransformAccount): BaseAccount => {
147 |   return {
148 |     id,
149 |     name,
150 |     currency: currency.toUpperCase(),
151 |     enrollment_id: enrollment_id,
152 |     institution: transformInstitution(institution),
153 |     type: getType(type),
154 |     balance: transformAccountBalance(balance),
155 |     resource_id: null,
156 |   };
157 | };
158 |
159 | export const transformAccountBalance = (
160 |   account: TransformAccountBalance,
161 | ): BaseAccountBalance => ({
162 |   currency: account.currency.toUpperCase(),
163 |   amount: +account.amount,
164 | });
165 |
166 | export const transformInstitution = (institution: TransformInstitution) => ({
167 |   id: institution.id,
168 |   name: institution.name,
169 |   logo: getLogoURL(institution.id),
170 |   provider: Providers.Enum.teller,
171 | });
```

apps/engine/src/providers/teller/types.ts
```
1 | // Thank you: https://github.com/maybe-finance/maybe-archive/blob/04bf3d135bdbb1fdaa2dd669dca4738c797cc382/libs/teller-api/src/types/accounts.ts
2 |
3 | import type { AccountType } from "@/utils/account";
4 |
5 | export type DetailCategory =
6 |   | "accommodation"
7 |   | "advertising"
8 |   | "bar"
9 |   | "charity"
10 |   | "clothing"
11 |   | "dining"
12 |   | "education"
13 |   | "electronics"
14 |   | "entertainment"
15 |   | "fuel"
16 |   | "general"
17 |   | "groceries"
18 |   | "health"
19 |   | "home"
20 |   | "income"
21 |   | "insurance"
22 |   | "investment"
23 |   | "loan"
24 |   | "office"
25 |   | "phone"
26 |   | "service"
27 |   | "shopping"
28 |   | "software"
29 |   | "sport"
30 |   | "tax"
31 |   | "transport"
32 |   | "transportation"
33 |   | "utilities";
34 |
35 | type DetailProcessingStatus = "pending" | "complete";
36 |
37 | export type Transaction = {
38 |   details: {
39 |     category?: DetailCategory;
40 |     processing_status: DetailProcessingStatus;
41 |     counterparty?: {
42 |       name?: string;
43 |       type?: "organization" | "person";
44 |     };
45 |   };
46 |   running_balance: string | null;
47 |   description: string;
48 |   id: string;
49 |   date: string;
50 |   account_id: string;
51 |   links: {
52 |     self: string;
53 |     account: string;
54 |   };
55 |   amount: string;
56 |   status: "posted" | "pending";
57 |   type: string;
58 | };
59 |
60 | export type GetTransactionsResponse = Transaction[];
61 | export type GetTransactionResponse = Transaction;
62 |
63 | export type DisconnectAccountRequest = {
64 |   accessToken: string;
65 | };
66 |
67 | export interface GetTransactionsRequest extends AuthenticatedRequest {
68 |   accountId: string;
69 |   latest?: boolean;
70 |   count?: number;
71 | }
72 |
73 | export type AuthenticationResponse = {
74 |   token: string;
75 | };
76 |
77 | export type AuthenticatedRequest = {
78 |   accessToken: string;
79 | };
80 |
81 | type Institution = {
82 |   id: string;
83 |   name: string;
84 | };
85 |
86 | interface BaseAccount {
87 |   enrollment_id: string;
88 |   links: {
89 |     balances: string;
90 |     self: string;
91 |     transactions: string;
92 |   };
93 |   institution: Institution;
94 |   name: string;
95 |   currency: string;
96 |   id: string;
97 |   last_four: string;
98 |   status: AccountStatus;
99 | }
100 |
101 | export type CreditSubtype = "credit_card";
102 |
103 | export type AccountStatus = "open" | "closed";
104 |
105 | export type DepositorySubtypes =
106 |   | "checking"
107 |   | "savings"
108 |   | "money_market"
109 |   | "certificate_of_deposit"
110 |   | "treasury"
111 |   | "sweep";
112 |
113 | interface DepositoryAccount extends BaseAccount {
114 |   type: "depository";
115 |   subtype: DepositorySubtypes;
116 | }
117 |
118 | interface CreditAccount extends BaseAccount {
119 |   type: "credit";
120 |   subtype: CreditSubtype;
121 | }
122 |
123 | export type Account = DepositoryAccount | CreditAccount;
124 |
125 | export type TransformAccount = Account & {
126 |   balance: GetAccountBalanceResponse;
127 | };
128 |
129 | export type GetAccountsResponse = TransformAccount[];
130 |
131 | export interface GetAccountBalanceRequest extends AuthenticatedRequest {
132 |   accountId: string;
133 | }
134 |
135 | export type GetAccountBalanceResponse = {
136 |   currency: string;
137 |   amount: number;
138 | };
139 |
140 | export type TransformTransaction = {
141 |   transaction: Transaction;
142 |   accountType: AccountType;
143 | };
144 |
145 | export type FormatAmount = {
146 |   amount: number;
147 |   accountType: AccountType;
148 | };
149 |
150 | export type TransformAccountBalance = GetAccountBalanceResponse;
151 |
152 | export type GetInstitutionsResponse = Institution[];
153 |
154 | export type TransformInstitution = Institution;
```

apps/engine/src/providers/teller/utils.ts
```
1 | export function isError(
2 |   data: unknown,
3 | ): false | { code: string; message: string } {
4 |   if (typeof data !== "object" || data === null || !("error" in data)) {
5 |     return false;
6 |   }
7 |
8 |   const tellerError = data as { error: { code: string; message: string } };
9 |
10 |   return {
11 |     code: tellerError.error.code,
12 |     message: tellerError.error.message,
13 |   };
14 | }
```

apps/engine/src/routes/accounts/index.ts
```
1 | import type { Bindings } from "@/common/bindings";
2 | import { ErrorSchema } from "@/common/schema";
3 | import { Provider } from "@/providers";
4 | import { createErrorResponse } from "@/utils/error";
5 | import { createRoute } from "@hono/zod-openapi";
6 | import { OpenAPIHono } from "@hono/zod-openapi";
7 | import { env } from "hono/adapter";
8 | import {
9 |   AccountBalanceParamsSchema,
10 |   AccountBalanceSchema,
11 |   AccountsParamsSchema,
12 |   AccountsSchema,
13 |   DeleteAccountsParamsSchema,
14 |   DeleteSchema,
15 | } from "./schema";
16 |
17 | const app = new OpenAPIHono<{ Bindings: Bindings }>()
18 |   .openapi(
19 |     createRoute({
20 |       method: "get",
21 |       path: "/",
22 |       summary: "Get Accounts",
23 |       request: {
24 |         query: AccountsParamsSchema,
25 |       },
26 |       responses: {
27 |         200: {
28 |           content: {
29 |             "application/json": {
30 |               schema: AccountsSchema,
31 |             },
32 |           },
33 |           description: "Retrieve accounts",
34 |         },
35 |         400: {
36 |           content: {
37 |             "application/json": {
38 |               schema: ErrorSchema,
39 |             },
40 |           },
41 |           description: "Returns an error",
42 |         },
43 |       },
44 |     }),
45 |     async (c) => {
46 |       const envs = env(c);
47 |
48 |       const { provider, accessToken, institutionId, id } = c.req.valid("query");
49 |
50 |       const api = new Provider({
51 |         provider,
52 |         kv: c.env.KV,
53 |         fetcher: c.env.TELLER_CERT,
54 |         envs,
55 |       });
56 |
57 |       try {
58 |         const data = await api.getAccounts({
59 |           id,
60 |           accessToken,
61 |           institutionId,
62 |         });
63 |
64 |         return c.json(
65 |           {
66 |             data,
67 |           },
68 |           200,
69 |         );
70 |       } catch (error) {
71 |         const errorResponse = createErrorResponse(error, c.get("requestId"));
72 |
73 |         return c.json(errorResponse, 400);
74 |       }
75 |     },
76 |   )
77 |   .openapi(
78 |     createRoute({
79 |       method: "delete",
80 |       path: "/",
81 |       summary: "Delete Accounts",
82 |       request: {
83 |         query: DeleteAccountsParamsSchema,
84 |       },
85 |       responses: {
86 |         200: {
87 |           content: {
88 |             "application/json": {
89 |               schema: DeleteSchema,
90 |             },
91 |           },
92 |           description: "Retrieve accounts",
93 |         },
94 |         400: {
95 |           content: {
96 |             "application/json": {
97 |               schema: ErrorSchema,
98 |             },
99 |           },
100 |           description: "Returns an error",
101 |         },
102 |       },
103 |     }),
104 |     async (c) => {
105 |       const envs = env(c);
106 |       const { provider, accountId, accessToken } = c.req.valid("query");
107 |
108 |       const api = new Provider({
109 |         provider,
110 |         fetcher: c.env.TELLER_CERT,
111 |         kv: c.env.KV,
112 |         envs,
113 |       });
114 |
115 |       try {
116 |         await api.deleteAccounts({
117 |           accessToken,
118 |           accountId,
119 |         });
120 |
121 |         return c.json(
122 |           {
123 |             success: true,
124 |           },
125 |           200,
126 |         );
127 |       } catch (error) {
128 |         const errorResponse = createErrorResponse(error, c.get("requestId"));
129 |
130 |         return c.json(errorResponse, 400);
131 |       }
132 |     },
133 |   )
134 |   .openapi(
135 |     createRoute({
136 |       method: "get",
137 |       path: "/balance",
138 |       summary: "Get Account Balance",
139 |       request: {
140 |         query: AccountBalanceParamsSchema,
141 |       },
142 |       responses: {
143 |         200: {
144 |           content: {
145 |             "application/json": {
146 |               schema: AccountBalanceSchema,
147 |             },
148 |           },
149 |           description: "Retrieve account balance",
150 |         },
151 |         400: {
152 |           content: {
153 |             "application/json": {
154 |               schema: ErrorSchema,
155 |             },
156 |           },
157 |           description: "Returns an error",
158 |         },
159 |       },
160 |     }),
161 |     async (c) => {
162 |       const envs = env(c);
163 |       const { provider, accessToken, id } = c.req.valid("query");
164 |
165 |       const api = new Provider({
166 |         provider,
167 |         fetcher: c.env.TELLER_CERT,
168 |         kv: c.env.KV,
169 |         envs,
170 |       });
171 |
172 |       try {
173 |         const data = await api.getAccountBalance({
174 |           accessToken,
175 |           accountId: id,
176 |         });
177 |
178 |         return c.json(
179 |           {
180 |             data,
181 |           },
182 |           200,
183 |         );
184 |       } catch (error) {
185 |         const errorResponse = createErrorResponse(error, c.get("requestId"));
186 |
187 |         return c.json(errorResponse, 400);
188 |       }
189 |     },
190 |   );
191 |
192 | export default app;
```

apps/engine/src/routes/accounts/schema.ts
```
1 | import { Providers } from "@/common/schema";
2 | import { z } from "@hono/zod-openapi";
3 | import { InstitutionSchema } from "../institutions/schema";
4 |
5 | export const AccountsParamsSchema = z.object({
6 |   id: z
7 |     .string()
8 |     .optional()
9 |     .openapi({
10 |       description: "GoCardLess reference id",
11 |       param: {
12 |         name: "id",
13 |         in: "query",
14 |       },
15 |       example: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
16 |     }),
17 |   provider: Providers.openapi({
18 |     example: Providers.Enum.teller,
19 |   }),
20 |   accessToken: z
21 |     .string()
22 |     .optional()
23 |     .openapi({
24 |       description: "Teller or Plaid access token",
25 |       param: {
26 |         name: "accessToken",
27 |         in: "query",
28 |       },
29 |       example: "test_token_ky6igyqi3qxa4",
30 |     }),
31 |   institutionId: z
32 |     .string()
33 |     .optional()
34 |     .openapi({
35 |       description: "Plaid institution id",
36 |       param: {
37 |         name: "institutionId",
38 |         in: "query",
39 |       },
40 |       example: "ins_109508",
41 |     }),
42 | });
43 |
44 | export const AccountSchema = z
45 |   .object({
46 |     id: z.string().openapi({
47 |       example: "9293961c-df93-4d6d-a2cc-fc3e353b2d10",
48 |     }),
49 |     name: z.string().openapi({
50 |       example: "Savings account",
51 |     }),
52 |     type: z
53 |       .enum(["depository", "credit", "other_asset", "loan", "other_liability"])
54 |       .openapi({
55 |         example: "depository",
56 |       }),
57 |     balance: z.object({
58 |       amount: z.number().openapi({
59 |         example: 100.0,
60 |       }),
61 |       currency: z.string().openapi({
62 |         example: "USD",
63 |       }),
64 |     }),
65 |     currency: z.string().openapi({
66 |       example: "USD",
67 |     }),
68 |     institution: InstitutionSchema,
69 |     enrollment_id: z
70 |       .string()
71 |       .openapi({
72 |         description: "Teller/Plaid enrollment id",
73 |         example: "add29d44-1b36-4bcc-b317-b2cbc73ab8e7",
74 |       })
75 |       .nullable(),
76 |     resource_id: z
77 |       .string()
78 |       .openapi({
79 |         description: "GoCardLess reference id",
80 |         example: "GBRGZX62Y8",
81 |       })
82 |       .nullable(),
83 |   })
84 |   .openapi("AccountSchema");
85 |
86 | export const AccountsSchema = z
87 |   .object({
88 |     data: z.array(AccountSchema),
89 |   })
90 |   .openapi("AccountsSchema");
91 |
92 | export const AccountBalanceParamsSchema = z
93 |   .object({
94 |     id: z.string().openapi({
95 |       description: "Account id",
96 |       param: {
97 |         name: "id",
98 |         in: "query",
99 |       },
100 |       example: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
101 |     }),
102 |     provider: Providers.openapi({
103 |       example: Providers.Enum.teller,
104 |     }),
105 |     accessToken: z
106 |       .string()
107 |       .optional()
108 |       .openapi({
109 |         description: "Teller or Plaid access token",
110 |         param: {
111 |           name: "accessToken",
112 |           in: "query",
113 |         },
114 |         example: "test_token_ky6igyqi3qxa4",
115 |       }),
116 |   })
117 |   .openapi("AccountBalanceParamsSchema");
118 |
119 | export const AccountBalanceSchema = z
120 |   .object({
121 |     data: z
122 |       .object({
123 |         amount: z.number().openapi({
124 |           example: 20000,
125 |         }),
126 |         currency: z.string().openapi({
127 |           example: "USD",
128 |         }),
129 |       })
130 |       .nullable(),
131 |   })
132 |   .openapi("AccountBalanceSchema");
133 |
134 | export const DeleteAccountsParamsSchema = z
135 |   .object({
136 |     accountId: z.string().openapi({
137 |       description: "Account id (GoCardLess)",
138 |       param: {
139 |         name: "accountId",
140 |         in: "query",
141 |       },
142 |       example: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
143 |     }),
144 |     provider: Providers.openapi({
145 |       example: Providers.Enum.teller,
146 |     }),
147 |     accessToken: z
148 |       .string()
149 |       .optional()
150 |       .openapi({
151 |         description: "Teller or Plaid access token",
152 |         param: {
153 |           name: "accessToken",
154 |           in: "query",
155 |         },
156 |         example: "test_token_ky6igyqi3qxa4",
157 |       }),
158 |   })
159 |   .openapi("DeleteAccountsParamsSchema");
160 |
161 | export const DeleteSchema = z
162 |   .object({
163 |     success: z.boolean().openapi({
164 |       example: true,
165 |     }),
166 |   })
167 |   .openapi("DeleteSchema");
```

apps/engine/src/routes/auth/index.ts
```
1 | import type { Bindings } from "@/common/bindings";
2 | import { ErrorSchema } from "@/common/schema";
3 | import { GoCardLessApi } from "@/providers/gocardless/gocardless-api";
4 | import { PlaidApi } from "@/providers/plaid/plaid-api";
5 | import { createErrorResponse } from "@/utils/error";
6 | import { createRoute } from "@hono/zod-openapi";
7 | import { OpenAPIHono } from "@hono/zod-openapi";
8 | import { env } from "hono/adapter";
9 | import {
10 |   GoCardLessAgreementBodySchema,
11 |   GoCardLessAgreementSchema,
12 |   GoCardLessExchangeBodySchema,
13 |   GoCardLessExchangeSchema,
14 |   GoCardLessLinkBodySchema,
15 |   GoCardLessLinkSchema,
16 |   PlaidExchangeBodySchema,
17 |   PlaidExchangeSchema,
18 |   PlaidLinkBodySchema,
19 |   PlaidLinkSchema,
20 | } from "./schema";
21 |
22 | const app = new OpenAPIHono<{ Bindings: Bindings }>()
23 |   .openapi(
24 |     createRoute({
25 |       method: "post",
26 |       path: "/plaid/link",
27 |       summary: "Auth Link (Plaid)",
28 |       request: {
29 |         body: {
30 |           content: {
31 |             "application/json": {
32 |               schema: PlaidLinkBodySchema,
33 |             },
34 |           },
35 |         },
36 |       },
37 |       responses: {
38 |         200: {
39 |           content: {
40 |             "application/json": {
41 |               schema: PlaidLinkSchema,
42 |             },
43 |           },
44 |           description: "Retrieve Link",
45 |         },
46 |         400: {
47 |           content: {
48 |             "application/json": {
49 |               schema: ErrorSchema,
50 |             },
51 |           },
52 |           description: "Returns an error",
53 |         },
54 |       },
55 |     }),
56 |     async (c) => {
57 |       const envs = env(c);
58 |
59 |       const { userId, language, accessToken } = await c.req.json();
60 |
61 |       const api = new PlaidApi({
62 |         kv: c.env.KV,
63 |         envs,
64 |       });
65 |
66 |       try {
67 |         const { data } = await api.linkTokenCreate({
68 |           userId,
69 |           language,
70 |           accessToken,
71 |         });
72 |
73 |         return c.json(
74 |           {
75 |             data,
76 |           },
77 |           200,
78 |         );
79 |       } catch (error) {
80 |         const errorResponse = createErrorResponse(error, c.get("requestId"));
81 |
82 |         return c.json(errorResponse, 400);
83 |       }
84 |     },
85 |   )
86 |   .openapi(
87 |     createRoute({
88 |       method: "post",
89 |       path: "/plaid/exchange",
90 |       summary: "Exchange token (Plaid)",
91 |       request: {
92 |         body: {
93 |           content: {
94 |             "application/json": {
95 |               schema: PlaidExchangeBodySchema,
96 |             },
97 |           },
98 |         },
99 |       },
100 |       responses: {
101 |         200: {
102 |           content: {
103 |             "application/json": {
104 |               schema: PlaidExchangeSchema,
105 |             },
106 |           },
107 |           description: "Retrieve Exchange",
108 |         },
109 |         400: {
110 |           content: {
111 |             "application/json": {
112 |               schema: ErrorSchema,
113 |             },
114 |           },
115 |           description: "Returns an error",
116 |         },
117 |       },
118 |     }),
119 |     async (c) => {
120 |       const envs = env(c);
121 |
122 |       const { token } = await c.req.json();
123 |
124 |       const api = new PlaidApi({
125 |         kv: c.env.KV,
126 |         envs,
127 |       });
128 |
129 |       try {
130 |         const data = await api.itemPublicTokenExchange({
131 |           publicToken: token,
132 |         });
133 |
134 |         return c.json(data, 200);
135 |       } catch (error) {
136 |         const errorResponse = createErrorResponse(error, c.get("requestId"));
137 |
138 |         return c.json(errorResponse, 400);
139 |       }
140 |     },
141 |   )
142 |   .openapi(
143 |     createRoute({
144 |       method: "post",
145 |       path: "/gocardless/link",
146 |       summary: "Auth link (GoCardLess)",
147 |       request: {
148 |         body: {
149 |           content: {
150 |             "application/json": {
151 |               schema: GoCardLessLinkBodySchema,
152 |             },
153 |           },
154 |         },
155 |       },
156 |       responses: {
157 |         200: {
158 |           content: {
159 |             "application/json": {
160 |               schema: GoCardLessLinkSchema,
161 |             },
162 |           },
163 |           description: "Retrieve Link",
164 |         },
165 |         400: {
166 |           content: {
167 |             "application/json": {
168 |               schema: ErrorSchema,
169 |             },
170 |           },
171 |           description: "Returns an error",
172 |         },
173 |       },
174 |     }),
175 |     async (c) => {
176 |       const envs = env(c);
177 |
178 |       const { institutionId, agreement, redirect, reference } =
179 |         await c.req.json();
180 |
181 |       const api = new GoCardLessApi({
182 |         kv: c.env.KV,
183 |         envs,
184 |       });
185 |
186 |       try {
187 |         const data = await api.buildLink({
188 |           institutionId,
189 |           agreement,
190 |           redirect,
191 |           reference,
192 |         });
193 |
194 |         return c.json(
195 |           {
196 |             data,
197 |           },
198 |           200,
199 |         );
200 |       } catch (error) {
201 |         const errorResponse = createErrorResponse(error, c.get("requestId"));
202 |
203 |         return c.json(errorResponse, 400);
204 |       }
205 |     },
206 |   )
207 |   .openapi(
208 |     createRoute({
209 |       method: "post",
210 |       path: "/gocardless/agreement",
211 |       summary: "Agreement (GoCardLess)",
212 |       request: {
213 |         body: {
214 |           content: {
215 |             "application/json": {
216 |               schema: GoCardLessAgreementBodySchema,
217 |             },
218 |           },
219 |         },
220 |       },
221 |       responses: {
222 |         200: {
223 |           content: {
224 |             "application/json": {
[TRUNCATED]
```

apps/engine/src/routes/auth/schema.ts
```
1 | import { z } from "@hono/zod-openapi";
2 |
3 | export const PlaidLinkBodySchema = z
4 |   .object({
5 |     userId: z.string().optional().openapi({
6 |       example: "9293961c-df93-4d6d-a2cc-fc3e353b2d10",
7 |     }),
8 |     language: z.string().optional().openapi({
9 |       example: "en",
10 |     }),
11 |     accessToken: z.string().optional().openapi({
12 |       example: "ojwmef9823f892n9h98h2efoqed9823hdodfcoj13er92hef",
13 |       description: "Used when initiating the reconnect flow",
14 |     }),
15 |   })
16 |   .openapi("PlaidLinkBodySchema");
17 |
18 | export const PlaidLinkSchema = z
19 |   .object({
20 |     data: z.object({
21 |       link_token: z.string().openapi({
22 |         example: "ojwmef9823f892n9h98h2efoqed9823hdodfcoj13er92hef",
23 |       }),
24 |       expiration: z.string().openapi({
25 |         example: "2024-06-01",
26 |       }),
27 |     }),
28 |   })
29 |   .openapi("PlaidLinkSchema");
30 |
31 | export const PlaidExchangeBodySchema = z
32 |   .object({
33 |     token: z.string().openapi({
34 |       example: "ojwmef9823f892n9h98h2efoqed9823hdodfcoj13er92hef",
35 |     }),
36 |   })
37 |   .openapi("PlaidExchangeBodySchema");
38 |
39 | export const PlaidExchangeSchema = z
40 |   .object({
41 |     data: z.object({
42 |       access_token: z.string().openapi({
43 |         example: "access_9293961c",
44 |       }),
45 |       item_id: z.string().openapi({
46 |         example: "item_9293961c",
47 |       }),
48 |     }),
49 |   })
50 |   .openapi("PlaidExchangeSchema");
51 |
52 | export const GoCardLessLinkBodySchema = z
53 |   .object({
54 |     institutionId: z.string().openapi({
55 |       example: "REVOLUT_REVOGB21",
56 |     }),
57 |     redirect: z.string().openapi({
58 |       example: "http://www.yourwebpage.com",
59 |     }),
60 |     agreement: z
61 |       .string()
62 |       .openapi({
63 |         example: "2dea1b84-97b0-4cb4-8805-302c227587c8",
64 |       })
65 |       .nullable(),
66 |     reference: z.string().optional().openapi({
67 |       example: "1234567890",
68 |     }),
69 |   })
70 |   .openapi("GoCardLessLinkBodySchema");
71 |
72 | export const GoCardLessLinkSchema = z
73 |   .object({
74 |     data: z.object({
75 |       link: z.string().openapi({
76 |         example:
77 |           "https://ob.gocardless.com/psd2/start/3fa85f64-5717-4562-b3fc-2c963f66afa6/REVOLUT_REVOGB21",
78 |       }),
79 |     }),
80 |   })
81 |   .openapi("GoCardLessLinkSchema");
82 |
83 | export const GoCardLessExchangeBodySchema = z
84 |   .object({
85 |     institutionId: z.string().openapi({
86 |       example: "REVOLUT_REVOGB21",
87 |     }),
88 |     transactionTotalDays: z.number().openapi({
89 |       example: 90,
90 |     }),
91 |   })
92 |   .openapi("GoCardLessExchangeBodySchema");
93 |
94 | export const GoCardLessExchangeSchema = z
95 |   .object({
96 |     data: z.object({
97 |       id: z.string().openapi({
98 |         example: "2dea1b84-97b0-4cb4-8805-302c227587c8",
99 |       }),
100 |       access_valid_for_days: z.number().openapi({
101 |         example: 90,
102 |       }),
103 |       max_historical_days: z.number().openapi({
104 |         example: 90,
105 |       }),
106 |       institution_id: z.string().openapi({
107 |         example: "REVOLUT_REVOGB21",
108 |       }),
109 |     }),
110 |   })
111 |   .openapi("GoCardLessExchangeSchema");
112 |
113 | export const GoCardLessAgreementBodySchema = z
114 |   .object({
115 |     institutionId: z.string().openapi({
116 |       example: "REVOLUT_REVOGB21",
117 |     }),
118 |     transactionTotalDays: z.number().openapi({
119 |       example: 90,
120 |     }),
121 |   })
122 |   .openapi("GoCardLessAgreementBodySchema");
123 |
124 | export const GoCardLessAgreementSchema = z
125 |   .object({
126 |     data: z.object({
127 |       id: z.string().openapi({
128 |         example: "2dea1b84-97b0-4cb4-8805-302c227587c8",
129 |       }),
130 |       created: z.string().openapi({
131 |         example: "2024-01-01",
132 |       }),
133 |       access_valid_for_days: z.number().openapi({
134 |         example: 90,
135 |       }),
136 |       max_historical_days: z.number().openapi({
137 |         example: 90,
138 |       }),
139 |       institution_id: z.string().openapi({
140 |         example: "REVOLUT_REVOGB21",
141 |       }),
142 |       accepted: z.boolean().openapi({
143 |         example: true,
144 |       }),
145 |     }),
146 |   })
147 |   .openapi("GoCardLessAgreementSchema");
```

apps/engine/src/routes/connections/index.ts
```
1 | import type { Bindings } from "@/common/bindings";
2 | import { ErrorSchema, Providers } from "@/common/schema";
3 | import { Provider } from "@/providers";
4 | import { GoCardLessApi } from "@/providers/gocardless/gocardless-api";
5 | import { createErrorResponse } from "@/utils/error";
6 | import { createRoute } from "@hono/zod-openapi";
7 | import { OpenAPIHono } from "@hono/zod-openapi";
8 | import { env } from "hono/adapter";
9 | import {
10 |   ConnectionByReferenceParamsSchema,
11 |   ConnectionByReferenceSchema,
12 |   ConnectionDeletedSchema,
13 |   ConnectionStatusQuerySchema,
14 |   ConnectionStatusSchema,
15 |   DeleteConnectionBodySchema,
16 |   GoCardLessConnectionsSchema,
17 | } from "./schema";
18 |
19 | const app = new OpenAPIHono<{ Bindings: Bindings }>()
20 |   .openapi(
21 |     createRoute({
22 |       method: "get",
23 |       path: "/status",
24 |       summary: "Get Connection Status",
25 |       request: {
26 |         query: ConnectionStatusQuerySchema,
27 |       },
28 |       responses: {
29 |         200: {
30 |           content: {
31 |             "application/json": {
32 |               schema: ConnectionStatusSchema,
33 |             },
34 |           },
35 |           description: "Retrieve connection status",
36 |         },
37 |         400: {
38 |           content: {
39 |             "application/json": {
40 |               schema: ErrorSchema,
41 |             },
42 |           },
43 |           description: "Returns an error",
44 |         },
45 |       },
46 |     }),
47 |     async (c) => {
48 |       const envs = env(c);
49 |
50 |       const { id, provider, accessToken } = c.req.valid("query");
51 |
52 |       const api = new Provider({
53 |         provider,
54 |         kv: c.env.KV,
55 |         fetcher: c.env.TELLER_CERT,
56 |         envs,
57 |       });
58 |
59 |       try {
60 |         const data = await api.getConnectionStatus({
61 |           id,
62 |           accessToken,
63 |         });
64 |
65 |         return c.json(
66 |           {
67 |             data,
68 |           },
69 |           200,
70 |         );
71 |       } catch (error) {
72 |         const errorResponse = createErrorResponse(error, c.get("requestId"));
73 |
74 |         return c.json(errorResponse, 400);
75 |       }
76 |     },
77 |   )
78 |   .openapi(
79 |     createRoute({
80 |       method: "post",
81 |       path: "/delete",
82 |       summary: "Delete Connection",
83 |       request: {
84 |         body: {
85 |           content: {
86 |             "application/json": {
87 |               schema: DeleteConnectionBodySchema,
88 |             },
89 |           },
90 |         },
91 |       },
92 |       responses: {
93 |         200: {
94 |           content: {
95 |             "application/json": {
96 |               schema: ConnectionDeletedSchema,
97 |             },
98 |           },
99 |           description: "Connection deleted successfully",
100 |         },
101 |         400: {
102 |           content: {
103 |             "application/json": {
104 |               schema: ErrorSchema,
105 |             },
106 |           },
107 |           description: "Returns an error",
108 |         },
109 |       },
110 |     }),
111 |     async (c) => {
112 |       const envs = env(c);
113 |       const { id, provider, accessToken } = await c.req.json();
114 |
115 |       const api = new Provider({
116 |         provider,
117 |         kv: c.env.KV,
118 |         fetcher: c.env.TELLER_CERT,
119 |         envs,
120 |       });
121 |
122 |       try {
123 |         await api.deleteConnection({
124 |           id,
125 |           accessToken,
126 |         });
127 |
128 |         return c.json(
129 |           {
130 |             data: {
131 |               success: true,
132 |             },
133 |           },
134 |           200,
135 |         );
136 |       } catch (error) {
137 |         const errorResponse = createErrorResponse(error, c.get("requestId"));
138 |
139 |         return c.json(errorResponse, 400);
140 |       }
141 |     },
142 |   )
143 |   .openapi(
144 |     createRoute({
145 |       method: "get",
146 |       path: "/gocardless",
147 |       summary: "Get GoCardless Connections",
148 |       responses: {
149 |         200: {
150 |           content: {
151 |             "application/json": {
152 |               schema: GoCardLessConnectionsSchema,
153 |             },
154 |           },
155 |           description: "Retrieve GoCardless connections",
156 |         },
157 |         400: {
158 |           content: {
159 |             "application/json": {
160 |               schema: ErrorSchema,
161 |             },
162 |           },
163 |           description: "Returns an error",
164 |         },
165 |       },
166 |     }),
167 |     async (c) => {
168 |       const envs = env(c);
169 |
170 |       const api = new GoCardLessApi({
171 |         kv: c.env.KV,
172 |         envs,
173 |       });
174 |
175 |       try {
176 |         const data = await api.getRequisitions();
177 |
178 |         return c.json(
179 |           {
180 |             count: data.count,
181 |             next: data.next,
182 |             previous: data.previous,
183 |             results: data.results,
184 |           },
185 |           200,
186 |         );
187 |       } catch (error) {
188 |         const errorResponse = createErrorResponse(error, c.get("requestId"));
189 |
190 |         return c.json(errorResponse, 400);
191 |       }
192 |     },
193 |   )
194 |   .openapi(
195 |     createRoute({
196 |       method: "get",
197 |       path: "/:reference",
198 |       summary: "Get Connection by Reference",
199 |       request: {
200 |         params: ConnectionByReferenceParamsSchema,
201 |       },
202 |       responses: {
203 |         200: {
204 |           content: {
205 |             "application/json": {
206 |               schema: ConnectionByReferenceSchema,
207 |             },
208 |           },
209 |           description: "Retrieve connection by reference",
210 |         },
211 |         404: {
212 |           content: {
213 |             "application/json": {
214 |               schema: ErrorSchema,
215 |             },
216 |           },
217 |           description: "Connection not found",
218 |         },
219 |         400: {
220 |           content: {
[TRUNCATED]
```

apps/engine/src/routes/connections/schema.ts
```
1 | import { Providers } from "@/common/schema";
2 | import { z } from "@hono/zod-openapi";
3 |
4 | export const ConnectionStatusQuerySchema = z.object({
5 |   id: z
6 |     .string()
7 |     .optional()
8 |     .openapi({
9 |       description: "GoCardLess reference id",
10 |       param: {
11 |         name: "id",
12 |         in: "query",
13 |       },
14 |       example: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
15 |     }),
16 |   provider: Providers.openapi({
17 |     example: Providers.Enum.teller,
18 |   }),
19 |   accessToken: z
20 |     .string()
21 |     .optional()
22 |     .openapi({
23 |       description: "Teller or Plaid access token",
24 |       param: {
25 |         name: "accessToken",
26 |         in: "query",
27 |       },
28 |       example: "test_token_ky6igyqi3qxa4",
29 |     }),
30 | });
31 |
32 | export const ConnectionStatusSchema = z
33 |   .object({
34 |     data: z.object({
35 |       status: z.string().openapi({
36 |         example: "connected",
37 |       }),
38 |     }),
39 |   })
40 |   .openapi("ConnectionStatusSchema");
41 |
42 | export const ConnectionDeletedSchema = z.object({
43 |   data: z.object({
44 |     success: z.boolean(),
45 |   }),
46 | });
47 |
48 | export const DeleteConnectionBodySchema = z.object({
49 |   id: z
50 |     .string()
51 |     .optional()
52 |     .openapi({
53 |       description: "GoCardLess reference id",
54 |       param: {
55 |         name: "id",
56 |         in: "query",
57 |       },
58 |       example: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
59 |     }),
60 |   provider: Providers.openapi({
61 |     example: Providers.Enum.teller,
62 |   }),
63 |   accessToken: z
64 |     .string()
65 |     .optional()
66 |     .openapi({
67 |       description: "Teller or Plaid access token",
68 |       param: {
69 |         name: "accessToken",
70 |         in: "query",
71 |       },
72 |       example: "test_token_ky6igyqi3qxa4",
73 |     }),
74 | });
75 |
76 | export const ConnectionByReferenceParamsSchema = z.object({
77 |   reference: z.string().openapi({
78 |     description: "GoCardLess reference id",
79 |     param: {
80 |       name: "reference",
81 |       in: "path",
82 |     },
83 |   }),
84 | });
85 |
86 | export const ConnectionByReferenceSchema = z.object({
87 |   data: z.object({
88 |     id: z.string(),
89 |     accounts: z.array(z.string()),
90 |   }),
91 | });
92 |
93 | export const GoCardLessConnectionSchema = z.object({
94 |   id: z.string(),
95 |   created: z.string(),
96 |   redirect: z.string(),
97 |   status: z.enum(["CR", "GC", "UA", "RJ", "SA", "GA", "LN", "EX"]),
98 |   institution_id: z.string(),
99 |   agreement: z.string(),
100 |   reference: z.string(),
101 |   accounts: z.array(z.string()),
102 |   user_language: z.string(),
103 |   link: z.string(),
104 |   ssn: z.string(),
105 |   account_selection: z.boolean(),
106 |   redirect_immediate: z.boolean(),
107 | });
108 |
109 | export const GoCardLessConnectionsSchema = z.object({
110 |   count: z.number(),
111 |   next: z.string(),
112 |   previous: z.string(),
113 |   results: z.array(GoCardLessConnectionSchema),
114 | });
```

apps/engine/src/routes/enrich/index.ts
```
1 | import { GeneralErrorSchema } from "@/common/schema";
2 | import { enrichTransactionWithLLM } from "@/utils/enrich";
3 | import { OpenAPIHono, createRoute } from "@hono/zod-openapi";
4 | import type { Bindings } from "hono/types";
5 | import { EnrichBodySchema, EnrichSchema } from "./schema";
6 |
7 | const app = new OpenAPIHono<{ Bindings: Bindings }>().openapi(
8 |   createRoute({
9 |     method: "post",
10 |     path: "/",
11 |     summary: "Enrich transactions",
12 |     request: {
13 |       body: {
14 |         content: {
15 |           "application/json": {
16 |             schema: EnrichBodySchema,
17 |           },
18 |         },
19 |       },
20 |     },
21 |     responses: {
22 |       200: {
23 |         content: {
24 |           "application/json": {
25 |             schema: EnrichSchema,
26 |           },
27 |         },
28 |         description: "Enrich a transaction",
29 |       },
30 |       400: {
31 |         content: {
32 |           "application/json": {
33 |             schema: GeneralErrorSchema,
34 |           },
35 |         },
36 |         description: "Returns an error",
37 |       },
38 |     },
39 |   }),
40 |   async (c) => {
41 |     const { data } = c.req.valid("json");
42 |
43 |     try {
44 |       const enrichments = await Promise.all(
45 |         data.map(async ({ id, ...transaction }) => {
46 |           // @ts-ignore
47 |           const enrichment = await enrichTransactionWithLLM(c, transaction);
48 |           return {
49 |             id,
50 |             ...enrichment,
51 |           };
52 |         }),
53 |       );
54 |
55 |       return c.json(
56 |         {
57 |           data: enrichments,
58 |         },
59 |         200,
60 |       );
61 |     } catch (error) {
62 |       console.error(error);
63 |       return c.json(
64 |         {
65 |           error: "Internal server error",
66 |           message: "Internal server error",
67 |           requestId: c.get("requestId"),
68 |           code: "400",
69 |         },
70 |         400,
71 |       );
72 |     }
73 |   },
74 | );
75 |
76 | export default app;
```

apps/engine/src/routes/enrich/schema.ts
```
1 | import { z } from "@hono/zod-openapi";
2 |
3 | export const EnrichBodySchema = z.object({
4 |   data: z
5 |     .array(
6 |       z.object({
7 |         id: z.string().openapi("The id of the transaction"),
8 |         date: z.coerce.date().openapi("The date of the transaction"),
9 |         description: z.string().openapi("The description of the transaction"),
10 |         currency: z.string().openapi("The currency of the transaction"),
11 |         amount: z.number().openapi("The amount of the transaction"),
12 |         category: z
13 |           .string()
14 |           .optional()
15 |           .openapi("The category of the transaction"),
16 |       }),
17 |     )
18 |     .min(1)
19 |     .max(50)
20 |     .openapi("The transactions to enrich"),
21 | });
22 |
23 | export const EnrichSchema = z
24 |   .object({
25 |     data: z.array(
26 |       z.object({
27 |         category: z
28 |           .string()
29 |           .openapi("The category of the transaction")
30 |           .nullable(),
31 |         company: z.string().openapi("The company name").nullable(),
32 |         website: z
33 |           .string()
34 |           .url()
35 |           .openapi("The website of the company")
36 |           .nullable(),
37 |         subscription: z
38 |           .boolean()
39 |           .openapi(
40 |             "Whether the transaction is a recurring subscription payment",
41 |           ),
42 |       }),
43 |     ),
44 |   })
45 |   .openapi("EnrichSchema");
46 |
47 | export const OutputSchema = z.object({
48 |   category: z
49 |     .enum([
50 |       "travel",
51 |       "office_supplies",
52 |       "meals",
53 |       "software",
54 |       "rent",
55 |       "equipment",
56 |       "internet_and_telephone",
57 |       "facilities_expenses",
58 |       "activity",
59 |       "taxes",
60 |       "fees",
61 |     ])
62 |     .describe("The category of the transaction")
63 |     .nullable(),
64 |   company: z.string().describe("The company name").nullable(),
65 |   website: z
66 |     .string()
67 |     .describe("The website of the company, only root domains without protocol")
68 |     .nullable(),
69 |   subscription: z
70 |     .boolean()
71 |     .describe("Whether the transaction is a recurring subscription payment")
72 |     .default(false),
73 | });
74 |
75 | export type EnrichBody = z.infer<typeof EnrichBodySchema>;
```

apps/engine/src/routes/health/index.ts
```
1 | import type { Bindings } from "@/common/bindings";
2 | import { ErrorSchema } from "@/common/schema";
3 | import { Provider } from "@/providers";
4 | import { getHealthCheck } from "@/utils/search";
5 | import { createRoute } from "@hono/zod-openapi";
6 | import { OpenAPIHono } from "@hono/zod-openapi";
7 | import { env } from "hono/adapter";
8 | import { HealthSchema } from "./schema";
9 |
10 | const app = new OpenAPIHono<{ Bindings: Bindings }>().openapi(
11 |   createRoute({
12 |     method: "get",
13 |     path: "/",
14 |     summary: "Health",
15 |     responses: {
16 |       200: {
17 |         content: {
18 |           "application/json": {
19 |             schema: HealthSchema,
20 |           },
21 |         },
22 |         description: "Retrieve health",
23 |       },
24 |       400: {
25 |         content: {
26 |           "application/json": {
27 |             schema: ErrorSchema,
28 |           },
29 |         },
30 |         description: "Returns an error",
31 |       },
32 |     },
33 |   }),
34 |   async (c) => {
35 |     const envs = env(c);
36 |
37 |     const api = new Provider();
38 |
39 |     const providers = await api.getHealthCheck({
40 |       kv: c.env.KV,
41 |       fetcher: c.env.TELLER_CERT,
42 |       envs,
43 |     });
44 |
45 |     const search = await getHealthCheck(envs);
46 |
47 |     const allServices = {
48 |       ...providers,
49 |       search,
50 |     };
51 |
52 |     const isHealthy = Object.values(allServices).every(
53 |       (service) => service.healthy,
54 |     );
55 |
56 |     if (isHealthy) {
57 |       return c.json(
58 |         {
59 |           data: allServices,
60 |         },
61 |         200,
62 |       );
63 |     }
64 |
65 |     return c.json(
66 |       {
67 |         requestId: c.get("requestId"),
68 |         message: "Service unhelthy",
69 |         code: "bad_request",
70 |       },
71 |       400,
72 |     );
73 |   },
74 | );
75 |
76 | export default app;
```

apps/engine/src/routes/health/schema.ts
```
1 | import { z } from "zod";
2 |
3 | export const HealthSchema = z
4 |   .object({
5 |     data: z.object({
6 |       plaid: z.object({
7 |         healthy: z.boolean(),
8 |       }),
9 |       gocardless: z.object({
10 |         healthy: z.boolean(),
11 |       }),
12 |       teller: z.object({
13 |         healthy: z.boolean(),
14 |       }),
15 |       search: z.object({
16 |         healthy: z.boolean(),
17 |       }),
18 |     }),
19 |   })
20 |   .openapi("HealthSchema");
```

apps/engine/src/routes/institutions/index.ts
```
1 | import type { Bindings } from "@/common/bindings";
2 | import { ErrorSchema } from "@/common/schema";
3 | import type { Providers } from "@/providers/types";
4 | import { createErrorResponse } from "@/utils/error";
5 | import { SearchClient } from "@/utils/search";
6 | import { createRoute } from "@hono/zod-openapi";
7 | import { OpenAPIHono } from "@hono/zod-openapi";
8 | import { env } from "hono/adapter";
9 | import {
10 |   InstitutionParamsSchema,
11 |   InstitutionsSchema,
12 |   UpdateUsageParamsSchema,
13 |   UpdateUsageSchema,
14 | } from "./schema";
15 | import { excludedInstitutions } from "./utils";
16 |
17 | type Document = {
18 |   id: string;
19 |   name: string;
20 |   logo: string | null;
21 |   available_history: number | null;
22 |   provider: Providers;
23 |   popularity: number;
24 | };
25 |
26 | type SearchResult = {
27 |   hits: {
28 |     document: Document;
29 |   }[];
30 | };
31 |
32 | const app = new OpenAPIHono<{ Bindings: Bindings }>()
33 |   .openapi(
34 |     createRoute({
35 |       method: "get",
36 |       path: "/",
37 |       summary: "Get Institutions",
38 |       request: {
39 |         query: InstitutionParamsSchema,
40 |       },
41 |       responses: {
42 |         200: {
43 |           content: {
44 |             "application/json": {
45 |               schema: InstitutionsSchema,
46 |             },
47 |           },
48 |           description: "Retrieve institutions",
49 |         },
50 |         400: {
51 |           content: {
52 |             "application/json": {
53 |               schema: ErrorSchema,
54 |             },
55 |           },
56 |           description: "Returns an error",
57 |         },
58 |       },
59 |     }),
60 |     async (c) => {
61 |       const envs = env(c);
62 |       const { countryCode, q = "*", limit = "50" } = c.req.valid("query");
63 |
64 |       const typesense = SearchClient(envs);
65 |
66 |       const searchParameters = {
67 |         q,
68 |         query_by: "name",
69 |         filter_by: `countries:=[${countryCode}]`,
70 |         limit: +limit,
71 |       };
72 |
73 |       try {
74 |         const result = await typesense
75 |           .collections("institutions")
76 |           .documents()
77 |           .search(searchParameters);
78 |
79 |         const resultString: string =
80 |           typeof result === "string" ? result : JSON.stringify(result);
81 |
82 |         const data: SearchResult = JSON.parse(resultString);
83 |
84 |         const filteredInstitutions = data.hits.filter(
85 |           ({ document }) => !excludedInstitutions.includes(document.id),
86 |         );
87 |
88 |         return c.json(
89 |           {
90 |             data: filteredInstitutions.map(({ document }) => ({
91 |               id: document.id,
92 |               name: document.name,
93 |               logo: document.logo ?? null,
94 |               popularity: document.popularity,
95 |               available_history: document.available_history
96 |                 ? +document.available_history
97 |                 : null,
98 |               provider: document.provider,
99 |             })),
100 |           },
101 |           200,
102 |         );
103 |       } catch (error) {
104 |         const errorResponse = createErrorResponse(error, c.get("requestId"));
105 |
106 |         return c.json(errorResponse, 400);
107 |       }
108 |     },
109 |   )
110 |   .openapi(
111 |     createRoute({
112 |       method: "put",
113 |       path: "/{id}/usage",
114 |       summary: "Update Institution Usage",
115 |       request: {
116 |         params: UpdateUsageParamsSchema,
117 |       },
118 |       responses: {
119 |         200: {
120 |           content: {
121 |             "application/json": {
122 |               schema: UpdateUsageSchema,
123 |             },
124 |           },
125 |           description: "Update institution usage",
126 |         },
127 |         400: {
128 |           content: {
129 |             "application/json": {
130 |               schema: ErrorSchema,
131 |             },
132 |           },
133 |           description: "Returns an error",
134 |         },
135 |       },
136 |     }),
137 |     async (c) => {
138 |       const envs = env(c);
139 |       const id = c.req.param("id");
140 |
141 |       const typesense = SearchClient(envs);
142 |
143 |       try {
144 |         const original = await typesense
145 |           .collections("institutions")
146 |           .documents(id)
147 |           .retrieve();
148 |
149 |         const originalData: Document =
150 |           typeof original === "string" && JSON.parse(original);
151 |
152 |         const result = await typesense
153 |           .collections("institutions")
154 |           .documents(id)
155 |           .update({
156 |             popularity: originalData?.popularity + 1 || 0,
157 |           });
158 |
159 |         const data: Document =
160 |           typeof result === "string" ? JSON.parse(result) : [];
161 |
162 |         return c.json(
163 |           {
164 |             data,
165 |           },
166 |           200,
167 |         );
168 |       } catch (error) {
169 |         const errorResponse = createErrorResponse(error, c.get("requestId"));
170 |
171 |         return c.json(errorResponse, 400);
172 |       }
173 |     },
174 |   );
175 |
176 | export default app;
```

apps/engine/src/routes/institutions/schema.ts
```
1 | import { Providers } from "@/common/schema";
2 | import { ALL_COUNTRIES } from "@/utils/countries";
3 | import { z } from "@hono/zod-openapi";
4 |
5 | export const InstitutionSchema = z
6 |   .object({
7 |     id: z.string().openapi({
8 |       example: "9293961c-df93-4d6d-a2cc-fc3e353b2d10",
9 |     }),
10 |     name: z.string().openapi({
11 |       example: "Wells Fargo Bank",
12 |     }),
13 |     logo: z
14 |       .string()
15 |       .openapi({
16 |         example:
17 |           "https://cdn.midday.ai/institution/9293961c-df93-4d6d-a2cc-fc3e353b2d10.jpg",
18 |       })
19 |       .nullable(),
20 |     available_history: z
21 |       .number()
22 |       .optional()
23 |       .openapi({
24 |         example: 365,
25 |       })
26 |       .nullable(),
27 |     provider: Providers.openapi({
28 |       example: Providers.Enum.teller,
29 |     }),
30 |   })
31 |   .openapi("InstitutionSchema");
32 |
33 | export const InstitutionsSchema = z
34 |   .object({
35 |     data: z.array(InstitutionSchema),
36 |   })
37 |   .openapi("InstitutionsSchema");
38 |
39 | export const UpdateUsageParamsSchema = z
40 |   .object({
41 |     id: z.string().openapi({
42 |       param: {
43 |         name: "id",
44 |         in: "path",
45 |       },
46 |       example: "STARLING_SRLGGB3L",
47 |     }),
48 |   })
49 |   .openapi("UpdateUsageParamsSchema");
50 |
51 | export const UpdateUsageSchema = z
52 |   .object({
53 |     data: InstitutionSchema,
54 |   })
55 |   .openapi("UpdateUsageSchema");
56 |
57 | export const InstitutionParamsSchema = z
58 |   .object({
59 |     q: z
60 |       .string()
61 |       .optional()
62 |       .openapi({
63 |         description: "Search query",
64 |         param: {
65 |           name: "q",
66 |           in: "query",
67 |         },
68 |         example: "Swedbank",
69 |       }),
70 |     limit: z
71 |       .string()
72 |       .optional()
73 |       .openapi({
74 |         description: "Limit results",
75 |         param: {
76 |           name: "limit",
77 |           in: "query",
78 |         },
79 |         example: "50",
80 |       }),
81 |     countryCode: z.enum(ALL_COUNTRIES as [string, ...string[]]).openapi({
82 |       description: "Country code",
83 |       param: {
84 |         name: "countryCode",
85 |         in: "query",
86 |       },
87 |       example: ALL_COUNTRIES.at(1),
88 |     }),
89 |   })
90 |   .openapi("InstitutionParamsSchema");
```

apps/engine/src/routes/institutions/utils.ts
```
1 | import { GoCardLessProvider } from "@/providers/gocardless/gocardless-provider";
2 | import { PlaidProvider } from "@/providers/plaid/plaid-provider";
3 | import { TellerProvider } from "@/providers/teller/teller-provider";
4 | import type { ProviderParams } from "@/providers/types";
5 |
6 | export const excludedInstitutions = [
7 |   "ins_56", // Chase - Plaid
8 | ];
9 |
10 | export async function getInstitutions(
11 |   params: Omit<
12 |     ProviderParams & { countryCode: string; storage: R2Bucket },
13 |     "provider"
14 |   >,
15 | ) {
16 |   const { countryCode } = params;
17 |
18 |   const gocardless = new GoCardLessProvider(params);
19 |   const teller = new TellerProvider(params);
20 |   const plaid = new PlaidProvider(params);
21 |
22 |   const result = await Promise.all([
23 |     teller.getInstitutions(),
24 |     gocardless.getInstitutions({ countryCode }),
25 |     plaid.getInstitutions({ countryCode }),
26 |   ]);
27 |
28 |   return result.flat();
29 | }
```

apps/engine/src/routes/rates/index.ts
```
1 | import { GeneralErrorSchema } from "@/common/schema";
2 | import { getRates } from "@/utils/rates";
3 | import { OpenAPIHono, createRoute } from "@hono/zod-openapi";
4 | import type { Bindings } from "hono/types";
5 | import { RatesSchema } from "./schema";
6 |
7 | const app = new OpenAPIHono<{ Bindings: Bindings }>().openapi(
8 |   createRoute({
9 |     method: "get",
10 |     path: "/",
11 |     summary: "Get rates",
12 |     responses: {
13 |       200: {
14 |         content: {
15 |           "application/json": {
16 |             schema: RatesSchema,
17 |           },
18 |         },
19 |         description: "Retrieve rates",
20 |       },
21 |       400: {
22 |         content: {
23 |           "application/json": {
24 |             schema: GeneralErrorSchema,
25 |           },
26 |         },
27 |         description: "Returns an error",
28 |       },
29 |     },
30 |   }),
31 |   async (c) => {
32 |     try {
33 |       const data = await getRates();
34 |
35 |       return c.json(
36 |         {
37 |           data,
38 |         },
39 |         200,
40 |       );
41 |     } catch (error) {
42 |       return c.json(
43 |         {
44 |           error: "Internal server error",
45 |           message: "Internal server error",
46 |           requestId: c.get("requestId"),
47 |           code: "400",
48 |         },
49 |         400,
50 |       );
51 |     }
52 |   },
53 | );
54 |
55 | export default app;
```

apps/engine/src/routes/rates/schema.ts
```
1 | import { z } from "zod";
2 |
3 | export const RatesSchema = z
4 |   .object({
5 |     data: z.array(
6 |       z.object({
7 |         source: z.string().openapi({
8 |           example: "USD",
9 |         }),
10 |         date: z.string().openapi({
11 |           example: "2024-02-29",
12 |         }),
13 |         rates: z.record(z.string(), z.number()).openapi({
14 |           example: {
15 |             EUR: 0.925393,
16 |             GBP: 0.792256,
17 |             SEK: 10.0,
18 |             BDT: 200.0,
19 |           },
20 |         }),
21 |       }),
22 |     ),
23 |   })
24 |
25 |   .openapi("RatesSchema");
```

apps/engine/src/routes/transactions/index.ts
```
1 | import type { Bindings } from "@/common/bindings";
2 | import { ErrorSchema } from "@/common/schema";
3 | import { Provider } from "@/providers";
4 | import { createErrorResponse } from "@/utils/error";
5 | import { createRoute } from "@hono/zod-openapi";
6 | import { OpenAPIHono } from "@hono/zod-openapi";
7 | import { env } from "hono/adapter";
8 | import { TransactionsParamsSchema, TransactionsSchema } from "./schema";
9 |
10 | const app = new OpenAPIHono<{ Bindings: Bindings }>().openapi(
11 |   createRoute({
12 |     method: "get",
13 |     path: "/",
14 |     summary: "Get transactions",
15 |     request: {
16 |       query: TransactionsParamsSchema,
17 |     },
18 |     responses: {
19 |       200: {
20 |         content: {
21 |           "application/json": {
22 |             schema: TransactionsSchema,
23 |           },
24 |         },
25 |         description: "Retrieve transactions",
26 |       },
27 |       400: {
28 |         content: {
29 |           "application/json": {
30 |             schema: ErrorSchema,
31 |           },
32 |         },
33 |         description: "Returns an error",
34 |       },
35 |     },
36 |   }),
37 |   async (c) => {
38 |     const envs = env(c);
39 |     const { provider, accountId, accountType, latest, accessToken } =
40 |       c.req.valid("query");
41 |
42 |     const api = new Provider({
43 |       provider,
44 |       fetcher: c.env.TELLER_CERT,
45 |       kv: c.env.KV,
46 |       envs,
47 |     });
48 |
49 |     try {
50 |       const data = await api.getTransactions({
51 |         accountId,
52 |         accessToken,
53 |         accountType,
54 |         latest,
55 |       });
56 |
57 |       return c.json(
58 |         {
59 |           data,
60 |         },
61 |         200,
62 |       );
63 |     } catch (error) {
64 |       const errorResponse = createErrorResponse(error, c.get("requestId"));
65 |
66 |       return c.json(errorResponse, 400);
67 |     }
68 |   },
69 | );
70 |
71 | export default app;
```

apps/engine/src/routes/transactions/schema.ts
```
1 | import { Providers } from "@/common/schema";
2 | import { z } from "@hono/zod-openapi";
3 |
4 | export const TransactionsParamsSchema = z
5 |   .object({
6 |     provider: Providers.openapi({
7 |       param: {
8 |         name: "provider",
9 |         in: "query",
10 |       },
11 |       example: Providers.Enum.teller,
12 |     }),
13 |     accountId: z.string().openapi({
14 |       description: "Get transactions by accountId",
15 |       param: {
16 |         name: "accountId",
17 |         in: "query",
18 |       },
19 |       example: "5341343-4234-4c65-815c-t234213442",
20 |     }),
21 |     accountType: z.enum(["credit", "depository"]).openapi({
22 |       description:
23 |         "Get transactions with the correct amount depending on credit or depository",
24 |       param: {
25 |         name: "accountType",
26 |         in: "query",
27 |       },
28 |       example: "depository",
29 |     }),
30 |     accessToken: z
31 |       .string()
32 |       .optional()
33 |       .openapi({
34 |         description: "Used for Teller and Plaid",
35 |         param: {
36 |           name: "accessToken",
37 |           in: "query",
38 |         },
39 |         example: "token-123",
40 |       }),
41 |     latest: z
42 |       .preprocess((val) => val === "true", z.boolean().default(false))
43 |       .openapi({
44 |         description: "Get latest transactions",
45 |         param: {
46 |           name: "latest",
47 |           in: "query",
48 |         },
49 |         example: "true",
50 |       }),
51 |   })
52 |   .openapi("TransactionsParamsSchema");
53 |
54 | export const TransactionSchema = z
55 |   .object({
56 |     id: z.string().openapi({
57 |       example: "9293961c-df93-4d6d-a2cc-fc3e353b2d10",
58 |     }),
59 |     description: z
60 |       .string()
61 |       .openapi({
62 |         example: "Transfer to bank account",
63 |       })
64 |       .nullable(),
65 |     method: z
66 |       .string()
67 |       .openapi({
68 |         example: "other",
69 |       })
70 |       .nullable(),
71 |     amount: z.number().openapi({
72 |       example: 100,
73 |     }),
74 |     name: z.string().openapi({
75 |       example: "Vercel Inc.",
76 |     }),
77 |     date: z.string().openapi({
78 |       example: "2024-06-12",
79 |     }),
80 |     currency: z.string().openapi({
81 |       example: "USD",
82 |     }),
83 |     status: z.enum(["pending", "posted"]).openapi({
84 |       example: "posted",
85 |     }),
86 |     category: z
87 |       .string()
88 |       .openapi({
89 |         example: "travel",
90 |       })
91 |       .nullable(),
92 |     balance: z
93 |       .number()
94 |       .openapi({
95 |         example: 10000,
96 |       })
97 |       .nullable(),
98 |   })
99 |   .openapi("TransactionSchema");
100 |
101 | export const TransactionsSchema = z
102 |   .object({
103 |     data: z.array(TransactionSchema),
104 |   })
105 |   .openapi("TransactionsSchema");
```

apps/website/src/app/branding/page.tsx
```
1 | import { BrandCanvas } from "@/components/brand-canvas";
2 | import type { Metadata } from "next";
3 |
4 | export const metadata: Metadata = {
5 |   title: "Branding",
6 |   description: "Download branding assets, logo, screenshots and more.",
7 | };
8 |
9 | export default function Page() {
10 |   return <BrandCanvas />;
11 | }
```

apps/website/src/app/components/page.tsx
```
1 | import { Button } from "@midday/ui/button";
2 | import { Card } from "@midday/ui/card";
3 | import { cn } from "@midday/ui/cn";
4 | import type { Metadata } from "next";
5 | import Image from "next/image";
6 | import Link from "next/link";
7 | import editor from "./editor.png";
8 | import invoiceOg from "./invoice-og.png";
9 | import invoiceReact from "./invoice-react.png";
10 | import invoiceToolbar from "./invoice-toolbar.png";
11 | import invoice from "./invoice.png";
12 | import pdf from "./pdf.png";
13 |
14 | export const metadata: Metadata = {
15 |   title: "Components | Midday",
16 |   description:
17 |     "A list of open source components that can be used in your project.",
18 | };
19 |
20 | const components = [
21 |   {
22 |     name: "Editor",
23 |     description: "A rich text editor with AI tools powered by Vercel AI SDK.",
24 |     image: editor,
25 |     href: "/components/editor",
26 |     className: "mt-24 max-w-[300px]",
27 |     ready: true,
28 |   },
29 |
30 |   {
31 |     name: "Invoice PDF Template",
32 |     description: "A React PDF template supporting Tiptap JSON and more.",
33 |     image: pdf,
34 |     href: "/components/invoice",
35 |     ready: true,
36 |   },
37 |   {
38 |     name: "Invoice React Template",
39 |     description: "A React template for invoices supporting Tiptap JSON format.",
40 |     image: invoiceReact,
41 |     href: "/components/invoice-react",
42 |     ready: true,
43 |   },
44 |   {
45 |     name: "Invoice Open Graph Template",
46 |     description: "A Next.js Open Graph template for invoices.",
47 |     image: invoiceOg,
48 |     href: "/components/invoice-og",
49 |     ready: true,
50 |   },
51 |   {
52 |     name: "Invoice Toolbar",
53 |     description: "A toolbar for invoices with comments and avatars.",
54 |     image: invoiceToolbar,
55 |     href: "/components/invoice-toolbar",
56 |     ready: true,
57 |     className: "mt-24 max-w-[220px]",
58 |   },
59 |   {
60 |     name: "Invoice Editor",
61 |     description:
62 |       "A visual invoice editor thats highly customizable and easy to use.",
63 |     image: invoice,
64 |     href: "/components",
65 |     ready: false,
66 |   },
67 | ];
68 |
69 | export default function Page() {
70 |   return (
71 |     <div className="container mb-52">
72 |       <div className="mb-40 flex flex-col items-center">
73 |         <h1 className="mt-24 font-medium text-center text-[55px] md:text-[170px] mb-2 leading-none text-stroke">
74 |           Components
75 |         </h1>
76 |
77 |         <div className="flex items-center flex-col text-center relative">
78 |           <p className="text-lg mt-4 max-w-[600px]">
79 |             A collection of open-source components based on Midday features.
80 |           </p>
81 |         </div>
82 |
83 |         <a href="https://git.new/midday" target="_blank" rel="noreferrer">
84 |           <Button className="mt-8">View on Github</Button>
85 |         </a>
86 |       </div>
87 |
88 |       <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
89 |         {components.map(
90 |           ({ name, description, image, href, ready, className }) => (
91 |             <Link href={href} key={name} className="flex">
92 |               <Card className="p-6 flex flex-col group w-full">
93 |                 <div className="flex items-center justify-between mb-4">
94 |                   <h2 className="text-lg font-semibold">{name}</h2>
95 |                   {!ready && (
96 |                     <span className="text-[#F5F5F3] dark:border dark:border-border rounded-full text-[10px] font-mono px-1.5 py-1 bg-[#1D1D1D]">
97 |                       Coming soon
98 |                     </span>
99 |                   )}
100 |                 </div>
101 |                 <p className="text-sm text-[#878787]">{description}</p>
102 |
103 |                 <div className="flex justify-center mt-6 w-full">
104 |                   <Image
105 |                     src={image}
106 |                     alt={name}
107 |                     className={cn(
108 |                       "transition-transform duration-300 group-hover:-translate-y-2",
109 |                       className,
110 |                     )}
111 |                   />
112 |                 </div>
113 |               </Card>
114 |             </Link>
115 |           ),
116 |         )}
117 |       </div>
118 |     </div>
119 |   );
120 | }
```

apps/website/src/app/download/page.tsx
```
1 | import { CopyInput } from "@/components/copy-input";
2 | import { Keyboard } from "@/components/keyboard";
3 | import { Button } from "@midday/ui/button";
4 | import type { Metadata } from "next";
5 | import Image from "next/image";
6 | import appIcon from "public/app-icon.png";
7 |
8 | export const metadata: Metadata = {
9 |   title: "Download",
10 |   description:
11 |     "With Midday on Mac you have everything accessible just one click away.",
12 | };
13 |
14 | export default function Page() {
15 |   return (
16 |     <div className="container flex flex-col items-center mb-12 md:mb-48 text-center">
17 |       <h1 className="mt-24 font-medium text-center text-5xl mb-24">
18 |         Always at your fingertips.
19 |       </h1>
20 |
21 |       <Keyboard />
22 |
23 |       <Image
24 |         src={appIcon}
25 |         alt="Midday App"
26 |         width={120}
27 |         height={120}
28 |         quality={90}
29 |         className="w-[80px] h-[80px] mt-12 md:mt-0 md:h-auto md:w-auto"
30 |       />
31 |       <p className="mb-4 text-2xl	font-medium mt-8">Midday for Mac</p>
32 |       <p className="text-[#878787] font-sm max-w-[500px]">
33 |         With Midday on Mac you have everything <br />
34 |         accessible just one click away.
35 |       </p>
36 |
37 |       <a href="https://go.midday.ai/d" download>
38 |         <Button
39 |           variant="outline"
40 |           className="border border-primary h-12 px-6 mt-8"
41 |         >
42 |           Download
43 |         </Button>
44 |       </a>
45 |
46 |       <p className="text-xs text-[#878787] mt-4">
47 |         Supports apple silicon & intel
48 |       </p>
49 |
50 |       <CopyInput
51 |         value="curl -sL https://go.midday.ai/d | tar -xz"
52 |         className="max-w-[410px] mt-8 font-mono font-normal hidden md:block rounded-full"
53 |       />
54 |     </div>
55 |   );
56 | }
```

apps/website/src/app/engine/page.tsx
```
1 | import { DynamicImage } from "@/components/dynamic-image";
2 | import { SubscribeInput } from "@/components/subscribe-input";
3 | import type { Metadata } from "next";
4 | import Image from "next/image";
5 | import engineSDK from "public/engine-sdk.png";
6 | import engineLight from "public/engine-ui-light.png";
7 | import engineDark from "public/engine-ui.png";
8 |
9 | export const metadata: Metadata = {
10 |   title: "Engine",
11 |   description:
12 |     "Midday engine streamlines banking integrations with a single API effortlessly connecting to multiple providers and get one unified format.",
13 | };
14 |
15 | export default function Page() {
16 |   return (
17 |     <div className="w-full dark:bg-[#0C0C0C] flex flex-col items-center justify-center mt-24">
18 |       <h1 className="text-[100px] md:text-[170px] font-medium text-center text-primary relative z-20 leading-none">
19 |         One API
20 |       </h1>
21 |
22 |       <h2 className="text-[100px] md:text-[170px] leading-none text-dotted text-center">
23 |         to rule them all
24 |       </h2>
25 |
26 |       <div className="mb-2 mt-6">
27 |         <p className="text-[#707070] mt-4 mb-8 text-center max-w-[550px]">
28 |           Midday engine streamlines banking integrations with a single API
29 |           effortlessly connecting to multiple providers and get one unified
30 |           format.
31 |         </p>
32 |       </div>
33 |
34 |       <SubscribeInput />
35 |
36 |       <div className="text-center flex flex-col items-center mt-[140px]">
37 |         <h3 className="mb-4 text-2xl font-medium">
38 |           Unlimited bank connections
39 |         </h3>
40 |         <p className="text-[#878787] font-sm max-w-[600px]">
41 |           Expand your market reach by enabling multiple banking providers with
42 |           just one click. We add even more providers in the future.
43 |         </p>
44 |
45 |         <DynamicImage
46 |           lightSrc={engineLight}
47 |           darkSrc={engineDark}
48 |           alt="Engine UI"
49 |           width={1026}
50 |           height={552}
51 |           className="mt-16"
52 |           quality={90}
53 |         />
54 |       </div>
55 |
56 |       <div className="text-center flex flex-col items-center mt-24">
57 |         <h3 className="mb-4 text-2xl font-medium">
58 |           One SDK, implement in minutes
59 |         </h3>
60 |         <p className="text-[#878787] font-sm max-w-[600px]">
61 |           With Midday Engine SDK you can implement banking providers in matter
62 |           of minutes.
63 |         </p>
64 |
65 |         <Image
66 |           src={engineSDK}
67 |           alt="Engine SDK"
68 |           width={740}
69 |           height={420}
70 |           className="mt-8"
71 |         />
72 |       </div>
73 |     </div>
74 |   );
75 | }
```

apps/website/src/app/feature-request/features.tsx
```
1 | export const features = [
2 |   {
3 |     id: "xero",
4 |     name: "Xero",
5 |     description:
6 |       "Integrating with Xero allows you to synchronize transactions and attachments neatly organized in your bookkeeping software, making it easier for you or your accountant to close your books faster.",
7 |     logo: (
8 |       <svg
9 |         xmlns="http://www.w3.org/2000/svg"
10 |         width={60}
11 |         height={60}
12 |         fill="none"
13 |       >
14 |         <g clipPath="url(#a)">
15 |           <mask
16 |             id="b"
17 |             width={88}
18 |             height={88}
19 |             x={-14}
20 |             y={-14}
21 |             maskUnits="userSpaceOnUse"
22 |             style={{
23 |               maskType: "luminance",
24 |             }}
25 |           >
26 |             <path
27 |               fill="#fff"
28 |               d="M-13.205-13.275h86.464V73.19h-86.464v-86.464Z"
29 |             />
30 |           </mask>
31 |           <g mask="url(#b)">
32 |             <path
33 |               fill="white"
34 |               d="M30 59.885c16.505 0 29.886-13.38 29.886-29.885C59.886 13.494 46.505.114 30 .114S.114 13.494.114 30c0 16.505 13.38 29.885 29.886 29.885Z"
35 |             />
36 |             <path
37 |               fill="#121212"
38 |               d="m14.42 29.913 5.1-5.112a.914.914 0 0 0-1.3-1.285l-5.096 5.094-5.118-5.101a.914.914 0 1 0-1.285 1.299l5.1 5.098-5.097 5.107a.914.914 0 1 0 1.282 1.3l5.11-5.103 5.091 5.085a.911.911 0 0 0 1.576-.628.907.907 0 0 0-.266-.644l-5.097-5.11ZM44.74 29.912c0 .915.745 1.66 1.662 1.66.914 0 1.66-.745 1.66-1.66 0-.916-.746-1.66-1.66-1.66-.917 0-1.662.744-1.662 1.66Z"
39 |             />
40 |             <path
41 |               fill="#121212"
42 |               d="M41.59 29.912a4.814 4.814 0 0 1 4.81-4.809 4.815 4.815 0 0 1 4.808 4.81A4.814 4.814 0 0 1 46.4 34.72a4.814 4.814 0 0 1-4.81-4.808Zm-1.891 0c0 3.695 3.006 6.7 6.7 6.7 3.695 0 6.703-3.005 6.703-6.7 0-3.694-3.008-6.7-6.702-6.7a6.709 6.709 0 0 0-6.701 6.7ZM39.223 23.326h-.28a3.8 3.8 0 0 0-2.339.79.916.916 0 0 0-.892-.72.904.904 0 0 0-.906.907l.003 11.286a.915.915 0 0 0 1.827-.002v-6.939c0-2.313.212-3.247 2.193-3.494.184-.023.383-.02.383-.02.543-.018.928-.39.928-.894a.916.916 0 0 0-.917-.914ZM21.677 28.81l.003-.077a4.842 4.842 0 0 1 9.402.076h-9.405Zm11.276-.173c-.394-1.864-1.415-3.396-2.969-4.38-2.272-1.442-5.272-1.362-7.467.198a6.777 6.777 0 0 0-2.823 5.503c0 .538.065 1.081.2 1.616a6.754 6.754 0 0 0 5.687 5.006 6.379 6.379 0 0 0 2.41-.16c.701-.171 1.38-.455 2.004-.855.648-.417 1.19-.966 1.714-1.624l.032-.036c.364-.451.296-1.093-.104-1.4-.337-.258-.904-.363-1.35.208a6.233 6.233 0 0 1-.32.417c-.354.392-.794.771-1.32 1.065a4.81 4.81 0 0 1-2.247.568c-2.658-.03-4.08-1.885-4.586-3.21a4.806 4.806 0 0 1-.204-.768 1.715 1.715 0 0 1-.012-.14l9.538-.002c1.308-.028 2.011-.95 1.817-2.006Z"
43 |             />
44 |           </g>
45 |         </g>
46 |         <defs>
47 |           <clipPath id="a">
48 |             <path fill="#fff" d="M0 0h60v60H0z" />
49 |           </clipPath>
50 |         </defs>
51 |       </svg>
52 |     ),
53 |   },
54 |   {
55 |     id: "quickbooks",
56 |     name: "Quickbooks",
57 |     description:
58 |       "Integrating with QuickBooks enables you to synchronize transactions and attachments, neatly organizing them in your bookkeeping software. This streamlines the process for you or your accountant to close your books faster.",
59 |     logo: (
60 |       <svg
61 |         xmlns="http://www.w3.org/2000/svg"
62 |         width={60}
63 |         height={60}
64 |         fill="none"
65 |       >
66 |         <path
67 |           fill="white"
[TRUNCATED]
```

apps/website/src/app/feature-request/page.tsx
```
1 | import { AppDetails } from "@/components/app-details";
2 | import { FeatureRequestModal } from "@/components/feature-request-modal";
3 | import { Button } from "@midday/ui/button";
4 | import { Dialog, DialogTrigger } from "@midday/ui/dialog";
5 | import type { Metadata } from "next";
6 | import { features } from "./features";
7 |
8 | export const metadata: Metadata = {
9 |   title: "Feature Request",
10 |   description:
11 |     "Follow our roadmap and vote for what will be our next priority.",
12 | };
13 |
14 | export default async function Page() {
15 |   return (
16 |     <Dialog>
17 |       <div className="container max-w-[1050px]">
18 |         <h1 className="mt-24 font-medium text-center text-5xl mb-8">
19 |           Feature Request
20 |         </h1>
21 |
22 |         <p className="text-[#878787] font-sm text-center max-w-[550px] m-auto">
23 |           Follow our roadmap and vote for what will be our next priority.
24 |         </p>
25 |
26 |         <div className="flex justify-center mt-8">
27 |           <DialogTrigger asChild>
28 |             <Button
29 |               className="bg-transparent text-primary px-4 border-primary"
30 |               variant="outline"
31 |             >
32 |               Submit a request
33 |             </Button>
34 |           </DialogTrigger>
35 |         </div>
36 |
37 |         <div className="divide-y">
38 |           {features.map((feature) => {
39 |             return <AppDetails key={feature.id} {...feature} />;
40 |           })}
41 |         </div>
42 |       </div>
43 |
44 |       <FeatureRequestModal />
45 |     </Dialog>
46 |   );
47 | }
```

apps/website/src/app/inbox/page.tsx
```
1 | import { CopyInput } from "@/components/copy-input";
2 | import { CtaButton } from "@/components/cta-button";
3 | import { DynamicImage } from "@/components/dynamic-image";
4 | import type { Metadata } from "next";
5 | import BulkLight from "public/product-bulk-light.png";
6 | import BulkDark from "public/product-bulk.png";
7 | import InboxLight from "public/product-inbox-light.jpg";
8 | import InboxDark from "public/product-inbox.jpg";
9 | import MatchLight from "public/product-match-light.png";
10 | import MatchDark from "public/product-match.png";
11 |
12 | export const metadata: Metadata = {
13 |   title: "Inbox",
14 |   description:
15 |     "Automatically match incoming invoices or receipts to the correct transaction.",
16 | };
17 |
18 | export default function Page() {
19 |   return (
20 |     <div className="container mb-52">
21 |       <div className="mb-40">
22 |         <h1 className="mt-24 font-medium text-center text-[75px] md:text-[170px] mb-2 leading-none text-stroke">
23 |           Magic
24 |         </h1>
25 |
26 |         <h3 className="font-medium text-center text-[75px] md:text-[170px] mb-2 leading-none">
27 |           Inbox
28 |         </h3>
29 |
30 |         <div className="flex items-center flex-col text-center relative">
31 |           <p className="text-lg mt-4 max-w-[600px]">
32 |             Use your personalized email for invoices and receipts, with
33 |             transaction suggestions from Midday. Easily search, reconcile and
34 |             export documents to keep your business organized.
35 |           </p>
36 |
37 |           <CtaButton>Automate your reconciliation process</CtaButton>
38 |         </div>
39 |       </div>
40 |
41 |       <DynamicImage darkSrc={InboxDark} lightSrc={InboxLight} alt="Inbox" />
42 |
43 |       <div className="flex items-center flex-col text-center relative mt-28">
44 |         <div>
45 |           <h4 className="font-medium text-xl md:text-2xl mb-4">
46 |             Automatic reconciliation
47 |           </h4>
48 |           <p className="text-[#878787] text-sm">
49 |             1. Use your personalized email address for your invoices and
50 |             receipts.
51 |             <br /> 2. The invoice arrives in the inbox, Midday gives you a
52 |             transaction suggestion to match it with. <br />
53 |             3. Your transactions now have the correct attachments, making it
54 |             easy for you to export them.
55 |           </p>
56 |         </div>
57 |
58 |         <CopyInput
59 |           value="inbox.f3f1s@midday.ai"
60 |           className="max-w-[240px] mt-8"
61 |         />
62 |
63 |         <DynamicImage
64 |           darkSrc={MatchDark}
65 |           lightSrc={MatchLight}
66 |           alt="Matching"
67 |           className="mt-10 max-w-[834px] w-full"
68 |         />
69 |
70 |         <div className="mt-32 max-w-[600px]">
71 |           <h4 className="font-medium text-xl md:text-2xl mb-4">
72 |             Keep track and find that old receipt
73 |           </h4>
74 |           <p className="text-[#878787] text-sm mb-10">
75 |             Quickly search for specific content within your receipts and
76 |             invoices. Bulk upload by dragging and dropping, with automatic
77 |             storage in your vault. Keep everything organized and accessible to
78 |             simplify receipt reconciliation.
79 |           </p>
80 |         </div>
81 |
82 |         <DynamicImage
83 |           darkSrc={BulkDark}
84 |           lightSrc={BulkLight}
85 |           alt="Receipt"
86 |           className="mt-10 max-w-[1374px] w-full"
87 |         />
88 |       </div>
89 |     </div>
90 |   );
91 | }
```

apps/website/src/app/invoice/page.tsx
```
1 | import { CtaButton } from "@/components/cta-button";
2 | import { DynamicImage } from "@/components/dynamic-image";
3 | import type { Metadata } from "next";
4 | import InvoiceLight from "public/product-invoice-light.jpg";
5 | import InvoiceDark from "public/product-invoice.jpg";
6 | import PdfLight from "public/product-pdf-light.png";
7 | import PdfDark from "public/product-pdf.png";
8 | import StatusLight from "public/product-status-light.png";
9 | import StatusDark from "public/product-status.png";
10 |
11 | export const metadata: Metadata = {
12 |   title: "Invoice",
13 |   description:
14 |     "Create web-based invoices in seconds. Have an easy overview of all your invoices and see your outstanding balance.",
15 | };
16 |
17 | export default function Page() {
18 |   return (
19 |     <div className="container mb-52">
20 |       <div className="mb-40">
21 |         <div className="mt-24 text-center">
22 |           <h1 className="mt-24 font-medium text-center text-[75px] md:text-[170px] mb-2 leading-none text-stroke">
23 |             Seamless
24 |           </h1>
25 |         </div>
26 |
27 |         <h3 className="font-medium text-center text-[75px] md:text-[170px] mb-2 leading-none">
28 |           Invoice
29 |         </h3>
30 |
31 |         <div className="flex items-center flex-col text-center relative">
32 |           <p className="text-lg mt-4 max-w-[600px]">
33 |             Create web-based invoices in seconds. Have an easy overview of all
34 |             your invoices and see your outstanding balance.
35 |           </p>
36 |
37 |           <CtaButton>Create invoices in seconds</CtaButton>
38 |         </div>
39 |       </div>
40 |
41 |       <DynamicImage
42 |         darkSrc={InvoiceDark}
43 |         lightSrc={InvoiceLight}
44 |         alt="Invoice"
45 |       />
46 |
47 |       <div className="flex items-center flex-col text-center relative mt-28">
48 |         <div className="max-w-[600px]">
49 |           <h4 className="font-medium text-xl md:text-2xl mb-4">
50 |             Fast and easy
51 |           </h4>
52 |           <p className="text-[#878787] text-sm">
53 |             Create and send invoices to your customers with ease. Add essential
54 |             details like VAT, sales tax, discounts and a personalized logo to
55 |             make your invoices professional and tailored to your needs. You can
56 |             send web invoices, export them as PDFs, and even track whether your
57 |             invoices have been viewed by the recipient.
58 |           </p>
59 |         </div>
60 |
61 |         <DynamicImage
62 |           darkSrc={PdfDark}
63 |           lightSrc={PdfLight}
64 |           alt="Pdf"
65 |           className="mt-10 max-w-[536px] w-full"
66 |         />
67 |
68 |         <div className="mt-32 max-w-[600px]">
69 |           <h4 className="font-medium text-xl md:text-2xl mb-4">
70 |             Track payments and stay organized
71 |           </h4>
72 |           <p className="text-[#878787] text-sm mb-10">
73 |             Monitor your sent balance, stay on top of overdue payments, and send
74 |             reminders to ensure timely settlements. With these tools, managing
75 |             your invoicing process becomes streamlined and efficient, giving you
76 |             more time to focus on growing your business.
77 |           </p>
78 |         </div>
79 |
80 |         <DynamicImage
81 |           darkSrc={StatusDark}
82 |           lightSrc={StatusLight}
83 |           alt="Pdf"
84 |           className="mt-10 max-w-[736px] w-full"
85 |         />
86 |       </div>
87 |     </div>
88 |   );
89 | }
```

apps/website/src/app/open-startup/page.tsx
```
1 | import { BankAccountsChart } from "@/components/charts/bank-accounts-chart";
2 | import { BankConnectionsChart } from "@/components/charts/bank-connections-chart";
3 | import { InboxChart } from "@/components/charts/inbox-chart";
4 | import { InvoiceCustomersChart } from "@/components/charts/invoice-customers";
5 | import { InvoicesChart } from "@/components/charts/invoices-chart";
6 | import { ReportsChart } from "@/components/charts/reports-chart";
7 | import { TrackerEntriesChart } from "@/components/charts/tracker-entries-chart";
8 | import { TrackerProjectsChart } from "@/components/charts/tracker-projects-chart";
9 | import { TransactionEnrichmentsChart } from "@/components/charts/transaction-enrichments-chart";
10 | import { TransactionsChart } from "@/components/charts/transactions-chart";
11 | import { UsersChart } from "@/components/charts/users-chart";
12 | import { VaultChart } from "@/components/charts/vault-chart";
13 | import {
14 |   Table,
15 |   TableBody,
16 |   TableCell,
17 |   TableHead,
18 |   TableHeader,
19 |   TableRow,
20 | } from "@midday/ui/table";
21 | import { Tabs, TabsContent, TabsList, TabsTrigger } from "@midday/ui/tabs";
22 |
23 | import type { Metadata } from "next";
24 |
25 | export const metadata: Metadata = {
26 |   title: "Open Startup",
27 |   description:
28 |     "We value transparency and aim to keep you informed about our journey every step of the way.",
29 | };
30 |
31 | export default async function Page() {
32 |   return (
33 |     <div className="container max-w-[1050px]">
34 |       <h1 className="mt-24 font-medium text-center text-5xl mb-8">
35 |         Open Startup
36 |       </h1>
37 |
38 |       <p className="text-[#878787] font-sm text-center max-w-[550px] m-auto">
39 |         We value transparency and aim to keep you informed about our journey
40 |         every step of the way.
41 |       </p>
42 |
43 |       <Tabs defaultValue="metrics">
44 |         <TabsList className="p-0 h-auto space-x-6 bg-transparent flex items-center mt-8">
45 |           <TabsTrigger className="p-0 !bg-transparent" value="metrics">
46 |             Metrics
47 |           </TabsTrigger>
48 |           <TabsTrigger className="p-0 !bg-transparent" value="values">
49 |             Company values
50 |           </TabsTrigger>
51 |           <TabsTrigger className="p-0 !bg-transparent" value="table">
52 |             Cap table
53 |           </TabsTrigger>
54 |         </TabsList>
55 |
56 |         <TabsContent value="metrics" className="m-0 h-full">
57 |           <div className="grid md:grid-cols-2 gap-6 mt-12">
58 |             <UsersChart />
59 |             <TransactionsChart />
60 |             <TransactionEnrichmentsChart />
61 |             <BankAccountsChart />
62 |             <BankConnectionsChart />
63 |             <VaultChart />
64 |             <InvoicesChart />
65 |             <InvoiceCustomersChart />
66 |             <TrackerEntriesChart />
67 |             <TrackerProjectsChart />
68 |             <InboxChart />
69 |             <ReportsChart />
70 |           </div>
71 |         </TabsContent>
72 |
73 |         <TabsContent
74 |           value="values"
75 |           className="h-full max-w-[800px] m-auto mt-10"
76 |         >
77 |           <h2 className="text-2xl mb-4">Transparency</h2>
78 |           <p className="mb-10 text-[#878787]">
79 |             We prioritize transparency as we believe it is essential for
80 |             fostering trust and credibility in all aspects of our operations.
81 |             It's not just a value, it's the foundation of our relationships with
82 |             users alike. We prioritize clear and accurate information for users,
83 |             empowering them to make informed decisions confidently. We uphold
84 |             transparency with our users, offering open communication about
85 |             financial performance and strategies to maintain strong, mutually
86 |             beneficial relationships.
87 |           </p>
88 |
89 |           <h2 className="text-2xl mb-4">Expectation</h2>
90 |           <p className="mb-10 text-[#878787]">
91 |             Accurately setting expectations is crucial, directly tied to our
92 |             dedication to transparency. We've observed many startups fall short
93 |             due to overpromising, highlighting the importance of aligning
94 |             promises with reality. By maintaining this alignment, we cultivate
95 |             trust and integrity, fostering a culture of accountability guided by
96 |             transparency.
97 |           </p>
98 |
99 |           <h2 className="text-2xl mb-4">Strategic Growth</h2>
100 |           <p className="mb-10 text-[#878787]">
101 |             We firmly believe in the potential of assembling the right team to
102 |             build a highly profitable company. However, we also recognize that
103 |             size doesn't necessarily equate to success. Having experienced the
104 |             inefficiencies of overbloated organizations firsthand, we understand
105 |             the importance of agility and efficiency. For us, it's not about the
106 |             number of seats we fill, but rather the quality of individuals we
107 |             bring on board. Hence, our focus lies in growing intelligently,
108 |             prioritizing talent and effectiveness over sheer size.
109 |           </p>
110 |         </TabsContent>
111 |
112 |         <TabsContent
113 |           value="table"
114 |           className="h-full max-w-[800px] m-auto mt-10"
[TRUNCATED]
```

apps/website/src/app/oss-friends/page.tsx
```
1 | import type { Metadata } from "next";
2 |
3 | export const metadata: Metadata = {
4 |   title: "OSS Friends",
5 |   description:
6 |     "We believe in a better and more sustainable future powered by Open Source software.",
7 | };
8 |
9 | type Friend = {
10 |   name: string;
11 |   href: string;
12 |   description: string;
13 | };
14 |
15 | export default async function Page() {
16 |   const ossFriends: Friend[] = await fetch(
17 |     "https://formbricks.com/api/oss-friends",
18 |     {
19 |       next: {
20 |         revalidate: 3600,
21 |       },
22 |       cache: "force-cache",
23 |     },
24 |   )
25 |     .then(async (res) => res.json())
26 |     .then(({ data }) => data)
27 |     .catch(() => []);
28 |
29 |   return (
30 |     <div className="container max-w-[1050px]">
31 |       <h1 className="mt-24 font-medium text-center text-5xl mb-8">
32 |         Our Open Source Friends
33 |       </h1>
34 |
35 |       <p className="text-[#878787] font-sm text-center">
36 |         We believe in a better and more sustainable future powered by Open
37 |         Source software.
38 |         <br /> Below you can find a list of our friends who are just as
39 |         passionate about open source and the future as we are.
40 |       </p>
41 |
42 |       <div className="grid md:grid-cols-3 gap-6 mt-12">
43 |         {ossFriends.map((friend) => {
44 |           return (
45 |             <div
46 |               key={friend.name}
47 |               className="border border-border dark:bg-[#121212] p-4"
48 |             >
49 |               <div className="flex justify-between items-center mb-2">
50 |                 <a href={friend.href} target="_blank" rel="noreferrer">
51 |                   <h3 className="font-medium text-md">{friend.name}</h3>
52 |                 </a>
53 |                 <a href={friend.href} target="_blank" rel="noreferrer">
54 |                   <span className="sr-only">Open link</span>
55 |                   <svg
56 |                     xmlns="http://www.w3.org/2000/svg"
57 |                     width={24}
58 |                     height={24}
59 |                     className="fill-primary scale-75"
60 |                   >
61 |                     <path fill="none" d="M0 0h24v24H0V0z" />
62 |                     <path d="M19 19H5V5h7V3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z" />
63 |                   </svg>
64 |                 </a>
65 |               </div>
66 |               <p className="text-sm text-[#878787]">{friend.description}</p>
67 |             </div>
68 |           );
69 |         })}
70 |       </div>
71 |     </div>
72 |   );
73 | }
```

apps/website/src/app/overview/page.tsx
```
1 | import { Assistant } from "@/components/assistant";
2 | import { CtaButton } from "@/components/cta-button";
3 | import { DynamicImage } from "@/components/dynamic-image";
4 | import type { Metadata } from "next";
5 | import OverviewLight from "public/product-overview-light.jpg";
6 | import OverviewDark from "public/product-overview.jpg";
7 | import SpendingLight from "public/product-spending-light.png";
8 | import SpendingDark from "public/product-spending.png";
9 |
10 | export const metadata: Metadata = {
11 |   title: "Financial Overview",
12 |   description:
13 |     "Get real-time insight into your business's financial state. Keep track of your spending, income and overall financial health.",
14 | };
15 |
16 | export default function Page() {
17 |   return (
18 |     <div className="container mb-52">
19 |       <div className="mb-40">
20 |         <h1 className="mt-24 font-medium text-center text-[75px] md:text-[170px] mb-2 leading-none text-stroke">
21 |           Financial
22 |         </h1>
23 |
24 |         <h3 className="font-medium text-center text-[75px] md:text-[170px] mb-2 leading-none">
25 |           Overview
26 |         </h3>
27 |
28 |         <div className="flex items-center flex-col text-center relative">
29 |           <p className="text-lg mt-4 max-w-[600px]">
30 |             Track key financial metrics like revenue, profit and loss, burn
31 |             rate, and expenses. View a consolidated currency overview across all
32 |             your accounts, and generate shareable reports.
33 |           </p>
34 |
35 |           <CtaButton>Get on top of your finances</CtaButton>
36 |         </div>
37 |       </div>
38 |
39 |       <DynamicImage
40 |         darkSrc={OverviewDark}
41 |         lightSrc={OverviewLight}
42 |         alt="Overview"
43 |         className="mt-28"
44 |       />
45 |
46 |       <div className="flex items-center flex-col text-center relative mt-28">
47 |         <div className="max-w-[600px]">
48 |           <h4 className="font-medium text-xl md:text-2xl mb-4">
49 |             From revenue to spending
50 |           </h4>
51 |           <p className="text-[#878787] text-sm">
52 |             Connect your business with over 20,000 banks across 33 countries,
53 |             including the US, Canada, the UK, and Europe. Gain seamless insights
54 |             into your income and expenses by integrating your existing bank
55 |             accounts. With a unified view of all your finances, you’ll have a
56 |             clearer picture of your financial health and the tools to make
57 |             informed decisions about your business.
58 |           </p>
59 |         </div>
60 |
61 |         <DynamicImage
62 |           darkSrc={SpendingDark}
63 |           lightSrc={SpendingLight}
64 |           alt="Spending"
65 |           className="mt-10 max-w-[834px] w-full"
66 |         />
67 |
68 |         <div className="mt-32 max-w-[550px]">
69 |           <h4 className="font-medium text-xl md:text-2xl mb-4">Dive deeper</h4>
70 |           <p className="text-[#878787] text-sm md:mb-10">
71 |             Our assistant is here to help you navigate your financial data with
72 |             ease. Ask questions about your key financial metrics and get
73 |             instant, insightful answers. With access to real-time data across
74 |             your connected bank accounts, the assistant helps you make informed
75 |             decisions and stay on top of your business finances.
76 |           </p>
77 |         </div>
78 |
79 |         <div className="text-left scale-[0.45] md:scale-100 -mt-20 md:mt-0">
80 |           <Assistant />
81 |         </div>
82 |       </div>
83 |     </div>
84 |   );
85 | }
```

apps/website/src/app/policy/page.tsx
```
1 | import type { Metadata } from "next";
2 |
3 | export const metadata: Metadata = {
4 |   title: "Policy",
5 |   description: "Privacy Policy",
6 | };
7 |
8 | export default function Page() {
9 |   return (
10 |     <>
11 |       <div className="max-w-[600px] m-auto my-20">
12 |         <h1 className="scroll-m-20 text-2xl tracking-tight lg:text-3xl">
13 |           Privacy Policy
14 |         </h1>
15 |
16 |         <div className="text-component line-height-lg v-space-md">
17 |           <p className="leading-7 mt-8">Last updated: October 26, 2023</p>
18 |
19 |           <p className="leading-7 mt-8">
20 |             Midday Labs AB ("us", "we", or "our") operates the Midday
21 |             application (hereinafter referred to as the "Service").
22 |           </p>
23 |
24 |           <p className="leading-7 mt-8">
25 |             This page informs you of our policies regarding the collection, use
26 |             and disclosure of personal data when you use our Service and the
27 |             choices you have associated with that data.
28 |           </p>
29 |
30 |           <p className="leading-7 mt-8">
31 |             We use your data to provide and improve the Service. By using the
32 |             Service, you agree to the collection and use of information in
33 |             accordance with this policy. Unless otherwise defined in this
34 |             Privacy Policy, the terms used in this Privacy Policy have the same
35 |             meanings as in our Terms and Conditions.
36 |           </p>
37 |
38 |           <h2>Definitions</h2>
39 |           <ul>
40 |             <li>
41 |               <p className="leading-7 mt-8">
42 |                 <strong>Service</strong>
43 |               </p>
44 |               <p className="leading-7 mt-8">
45 |                 Service is the Midday application operated by Midday Labs AB
46 |               </p>
47 |             </li>
48 |             <li>
49 |               <p className="leading-7 mt-8">
50 |                 <strong>Personal Data</strong>
51 |               </p>
52 |               <p className="leading-7 mt-8">
53 |                 Personal Data means data about a living individual who can be
54 |                 identified from those data (or from those and other information
55 |                 either in our possession or likely to come into our possession).
56 |               </p>
57 |             </li>
58 |             <li>
59 |               <p className="leading-7 mt-8">
60 |                 <strong>Usage Data</strong>
61 |               </p>
62 |               <p className="leading-7 mt-8">
63 |                 Usage Data is data collected automatically either generated by
64 |                 the use of the Service or from the Service infrastructure itself
65 |                 (for example, the duration of a page visit).
66 |               </p>
67 |             </li>
68 |             <li>
69 |               <p className="leading-7 mt-8">
70 |                 <strong>Cookies</strong>
71 |               </p>
72 |               <p className="leading-7 mt-8">
73 |                 Cookies are small files stored on your device (computer or
74 |                 mobile device).
75 |               </p>
76 |             </li>
77 |             <li>
78 |               <p className="leading-7 mt-8">
79 |                 <strong>Data Controller</strong>
80 |               </p>
81 |               <p className="leading-7 mt-8">
82 |                 Data Controller means the natural or legal person who (either
83 |                 alone or jointly or in common with other persons) determines the
84 |                 purposes for which and the manner in which any personal
85 |                 information are, or are to be, processed.
86 |               </p>
87 |               <p className="leading-7 mt-8">
88 |                 For the purpose of this Privacy Policy, we are a Data Controller
89 |                 of your Personal Data.
90 |               </p>
91 |             </li>
92 |             <li>
93 |               <p className="leading-7 mt-8">
94 |                 <strong>Data Processors (or Service Providers)</strong>
95 |               </p>
96 |               <p className="leading-7 mt-8">
97 |                 Data Processor (or Service Provider) means any natural or legal
98 |                 person who processes the data on behalf of the Data Controller.
99 |               </p>
100 |               <p className="leading-7 mt-8">
101 |                 We may use the services of various Service Providers in order to
102 |                 process your data more effectively.
103 |               </p>
104 |             </li>
105 |             <li>
106 |               <p className="leading-7 mt-8">
107 |                 <strong>Data Subject (or User)</strong>
108 |               </p>
109 |               <p className="leading-7 mt-8">
110 |                 Data Subject is any living individual who is using our Service
111 |                 and is the subject of Personal Data.
112 |               </p>
113 |             </li>
114 |           </ul>
115 |
116 |           <h2>Information Collection and Use</h2>
[TRUNCATED]
```

apps/website/src/app/pricing/page.tsx
```
1 | import { Testimonials } from "@/components/testimonials";
2 | import {
3 |   Accordion,
4 |   AccordionContent,
5 |   AccordionItem,
6 |   AccordionTrigger,
7 | } from "@midday/ui/accordion";
8 | import { Button } from "@midday/ui/button";
9 | import type { Metadata } from "next";
10 | import Link from "next/link";
11 |
12 | export const metadata: Metadata = {
13 |   title: "Pricing",
14 |   description: "Midday's pricing",
15 | };
16 |
17 | export default function Page() {
18 |   return (
19 |     <>
20 |       <div className="container">
21 |         <div className="min-h-[950px]">
22 |           <h1 className="mt-24 font-medium text-center text-[100px] md:text-[170px] mb-2 leading-none">
23 |             Free
24 |           </h1>
25 |
26 |           <h3 className="font-medium text-center text-[100px] md:text-[170px] mb-2 text-stroke leading-none">
27 |             while in beta
28 |           </h3>
29 |
30 |           <div className="flex items-center flex-col text-center relative">
31 |             <div className="mt-12 mb-12" />
32 |             <p className="text-xl mt-4">Claim $49/mo deal</p>
33 |
34 |             <div className="mt-8">
35 |               <div className="flex items-center space-x-4">
36 |                 <Link
37 |                   href="https://cal.com/pontus-midday/15min"
38 |                   target="_blank"
39 |                   rel="noopener noreferrer"
40 |                 >
41 |                   <Button
42 |                     variant="outline"
43 |                     className="border border-primary h-12 px-6"
44 |                   >
45 |                     Talk to us
46 |                   </Button>
47 |                 </Link>
48 |
49 |                 <a
50 |                   target="_blank"
51 |                   rel="noreferrer"
52 |                   href="https://app.midday.ai"
53 |                 >
54 |                   <Button className="h-12 px-5">Get Started</Button>
55 |                 </a>
56 |               </div>
57 |             </div>
58 |           </div>
59 |         </div>
60 |
61 |         <div className="container  max-w-[800px]">
62 |           <div className="-mt-[200px] ">
63 |             <div className="text-center">
64 |               <h4 className="text-4xl">Frequently asked questions</h4>
65 |             </div>
66 |
67 |             <Accordion type="single" collapsible className="w-full mt-10 mb-48">
68 |               <AccordionItem value="item-1">
69 |                 <AccordionTrigger>
70 |                   <span className="truncate">Can I self-host Midday.ai?</span>
71 |                 </AccordionTrigger>
72 |                 <AccordionContent>
73 |                   Absolutely. We are currently writing the documentation for
74 |                   this. You can find the repository{" "}
75 |                   <a
76 |                     target="_blank"
77 |                     rel="noreferrer"
78 |                     href="https://git.new/midday"
79 |                     className="underline"
80 |                   >
81 |                     here
82 |                   </a>
83 |                   .
84 |                 </AccordionContent>
85 |               </AccordionItem>
86 |               <AccordionItem value="item-2">
87 |                 <AccordionTrigger>
88 |                   Can I run Midday.ai locally?
89 |                 </AccordionTrigger>
90 |                 <AccordionContent>
91 |                   Yes. We are currently writing documentation for this. You can
92 |                   find the repository{" "}
93 |                   <a
94 |                     target="_blank"
95 |                     rel="noreferrer"
96 |                     href="https://git.new/midday"
97 |                     className="underline"
98 |                   >
99 |                     here
100 |                   </a>
101 |                   .
102 |                 </AccordionContent>
103 |               </AccordionItem>
104 |               <AccordionItem value="item-3">
105 |                 <AccordionTrigger>Is Midday.ai open source?</AccordionTrigger>
106 |                 <AccordionContent>
107 |                   Yes. You can find the repository{" "}
108 |                   <a
109 |                     target="_blank"
110 |                     rel="noreferrer"
111 |                     href="https://git.new/midday"
112 |                     className="underline"
113 |                   >
114 |                     here
115 |                   </a>
116 |                   .
117 |                 </AccordionContent>
118 |               </AccordionItem>
119 |               <AccordionItem value="item-4">
120 |                 <AccordionTrigger>
121 |                   <span className="truncate max-w-[300px] md:max-w-full">
122 |                     What are your data privacy & security policies?
123 |                   </span>
124 |                 </AccordionTrigger>
125 |                 <AccordionContent>
126 |                   We take data privacy very seriously and implement
127 |                   state-of-the-art security measures to protect your data. We
128 |                   are also actively working towards SOC 2 Type II compliance. We
129 |                   encrypt data at rest, and sensitive data on row level. We also
130 |                   support 2FA authentication.
131 |                   <Link href="/policy">midday.ai/policy</Link>.
132 |                 </AccordionContent>
133 |               </AccordionItem>
134 |
135 |               <AccordionItem value="item-5">
136 |                 <AccordionTrigger>
137 |                   <span className="truncate max-w-[300px] md:max-w-full">
138 |                     Can I cancel my subscription at any time?
139 |                   </span>
140 |                 </AccordionTrigger>
141 |                 <AccordionContent>
142 |                   Yes, you can cancel your subscription at any time. If you
143 |                   cancel your subscription, you will still be able to use Midday
144 |                   until the end of your billing period.
145 |                 </AccordionContent>
[TRUNCATED]
```

apps/website/src/app/story/page.tsx
```
1 | import { DynamicImage } from "@/components/dynamic-image";
2 | import type { Metadata } from "next";
3 | import Image from "next/image";
4 | import signatureDark from "public/email/signature-dark.png";
5 | import signatureLight from "public/email/signature.png";
6 | import founders from "public/founders.png";
7 |
8 | export const metadata: Metadata = {
9 |   title: "Story",
10 |   description: "This is why we’re building Midday.",
11 | };
12 |
13 | export default function Page() {
14 |   return (
15 |     <div className="container max-w-[750px]">
16 |       <h1 className="mt-24 font-medium text-center text-5xl mb-16 leading-snug">
17 |         This is why we’re building <br />
18 |         Midday.
19 |       </h1>
20 |
21 |       <h3 className="font-medium text-xl mb-2">Problem</h3>
22 |       <p className="text-[#878787] mb-8">
23 |         After years of running our own businesses, we've always felt something
24 |         was missing, especially when it came to the mundane tasks. Your monthly
25 |         routine typically involves tracking time, sending invoices, collecting
26 |         receipts, and organizing documents. All which are scattered across
27 |         various platforms. We've observed that these tools are often provided by
28 |         large industry giants that struggle to adapt and innovate quickly.
29 |       </p>
30 |
31 |       <h3 className="font-medium text-xl mb-2">Solution</h3>
32 |       <p className="text-[#878787] mb-8">
33 |         So, we asked ourselves, why not create one comprehensive tool for all
34 |         these tasks? Inspired by companies like Notion that revolutionized
35 |         all-in-one tools, we embarked on developing an all-in-one business OS.
36 |         Our goal is to help entrepreneurs gain deeper business insights,
37 |         streamline tedious tasks, and serve as a bridge between you and your
38 |         accountant, allowing you to focus on the enjoyable aspects of your work.
39 |       </p>
40 |
41 |       <h3 className="font-medium text-xl mb-2">Open source</h3>
42 |       <p className="text-[#878787] mb-12">
43 |         We've always admired companies that prioritize transparency and
44 |         collaboration with users to build the best possible product. Whether
45 |         it's through 15-minute user calls, building in public, or open-sourcing
46 |         our system, these are values we hold dear and will continue to uphold,
47 |         regardless of how far or big we go.
48 |       </p>
49 |
50 |       <Image src={founders} width={800} height={514} alt="Pontus & Viktor" />
51 |
52 |       <div className="mt-6 mb-8">
53 |         <p className="text-sm text-[#878787] mb-2">Best regards, founders</p>
54 |
55 |         <DynamicImage
56 |           darkSrc={signatureDark}
57 |           lightSrc={signatureLight}
58 |           alt="Signature"
59 |           className="w-[143px] h-[20px]"
60 |         />
61 |       </div>
62 |     </div>
63 |   );
64 | }
```

apps/website/src/app/support/page.tsx
```
1 | import { SupportForm } from "@/components/support-form";
2 | import type { Metadata } from "next";
3 |
4 | export const metadata: Metadata = {
5 |   title: "Support",
6 |   description: "Get help with Midday",
7 | };
8 |
9 | export default function Page() {
10 |   return (
11 |     <div className="max-w-[750px] m-auto">
12 |       <h1 className="mt-24 font-medium text-center text-5xl mb-16 leading-snug">
13 |         Support
14 |       </h1>
15 |
16 |       <SupportForm />
17 |     </div>
18 |   );
19 | }
```

apps/website/src/app/terms/page.tsx
```
1 | import type { Metadata } from "next";
2 |
3 | export const metadata: Metadata = {
4 |   title: "Terms and Conditions",
5 |   description: "Terms and Conditions",
6 | };
7 |
8 | export default function Page() {
9 |   return (
10 |     <>
11 |       <div className="max-w-[600px] m-auto my-20">
12 |         <h1 className="scroll-m-20 text-2xl tracking-tight lg:text-3xl">
13 |           Terms and Conditions
14 |         </h1>
15 |
16 |         <div className="text-component line-height-lg v-space-md">
17 |           <p className="leading-7 mt-8">Last updated: October 26, 2023</p>
18 |
19 |           <p className="leading-7 mt-8">
20 |             These Terms and Conditions ("Terms", "Terms and Conditions") govern
21 |             your relationship with Midday application (the "Service") operated
22 |             by Midday Labs AB ("us", "we", or "our").
23 |           </p>
24 |
25 |           <p className="leading-7 mt-8">
26 |             Please read these Terms and Conditions carefully before using our
27 |             Midday application (the "Service").
28 |           </p>
29 |
30 |           <p className="leading-7 mt-8">
31 |             Your access to and use of the Service is conditioned on your
32 |             acceptance of and compliance with these Terms. These Terms apply to
33 |             all visitors, users and others who access or use the Service.
34 |           </p>
35 |
36 |           <p className="leading-7 mt-8">
37 |             By accessing or using the Service you agree to be bound by these
38 |             Terms. If you disagree with any part of the terms then you may not
39 |             access the Service.
40 |           </p>
41 |
42 |           <h2>Subscriptions</h2>
43 |
44 |           <p className="leading-7 mt-8">
45 |             Some parts of the Service are billed on a subscription basis
46 |             ("Subscription(s)"). You will be billed in advance on a recurring
47 |             and periodic basis ("Billing Cycle"). Billing cycles are set on a
48 |             monthly basis.
49 |           </p>
50 |
51 |           <p className="leading-7 mt-8">
52 |             At the end of each Billing Cycle, your Subscription will
53 |             automatically renew under the exact same conditions unless you
54 |             cancel it or Midday Labs AB cancels it. You may cancel your
55 |             Subscription renewal either through your online account management
56 |             page or by contacting Midday Labs AB customer support team.
57 |           </p>
58 |
59 |           <p className="leading-7 mt-8">
60 |             A valid payment method, including credit card, is required to
61 |             process the payment for your Subscription. You shall provide Midday
62 |             Labs AB with accurate and complete billing information including
63 |             full name, address, state, zip code, telephone number, and a valid
64 |             payment method information. By submitting such payment information,
65 |             you automatically authorize Midday Labs AB to charge all
66 |             Subscription fees incurred through your account to any such payment
67 |             instruments.
68 |           </p>
69 |
70 |           <p className="leading-7 mt-8">
71 |             Should automatic billing fail to occur for any reason, Midday Labs
72 |             AB will issue an electronic invoice indicating that you must proceed
73 |             manually, within a certain deadline date, with the full payment
74 |             corresponding to the billing period as indicated on the invoice.
75 |           </p>
76 |
77 |           <h2>Fee Changes</h2>
78 |
79 |           <p className="leading-7 mt-8">
80 |             Midday Labs AB, in its sole discretion and at any time, may modify
81 |             the Subscription fees for the Subscriptions. Any Subscription fee
82 |             change will become effective at the end of the then-current Billing
83 |             Cycle.
84 |           </p>
85 |
86 |           <p className="leading-7 mt-8">
87 |             Midday Labs AB will provide you with a reasonable prior notice of
88 |             any change in Subscription fees to give you an opportunity to
89 |             terminate your Subscription before such change becomes effective.
90 |           </p>
91 |
92 |           <p className="leading-7 mt-8">
93 |             Your continued use of the Service after the Subscription fee change
94 |             comes into effect constitutes your agreement to pay the modified
95 |             Subscription fee amount.
96 |           </p>
97 |
98 |           <h2>Refunds</h2>
99 |
100 |           <p className="leading-7 mt-8">
101 |             Certain refund requests for Subscriptions may be considered by
102 |             Midday Labs AB on a case-by-case basis and granted in sole
103 |             discretion of Midday Labs AB.
104 |           </p>
105 |
106 |           <h2>Content</h2>
107 |
[TRUNCATED]
```

apps/website/src/app/tracker/page.tsx
```
1 | import { CtaButton } from "@/components/cta-button";
2 | import { DynamicImage } from "@/components/dynamic-image";
3 | import type { Metadata } from "next";
4 | import ProjectsLight from "public/product-projects-light.png";
5 | import ProjectsDark from "public/product-projects.png";
6 | import SlotLight from "public/product-slot-light.png";
7 | import SlotDark from "public/product-slot.png";
8 | import TrackerLight from "public/product-tracker-light.jpg";
9 | import TrackerDark from "public/product-tracker.jpg";
10 |
11 | export const metadata: Metadata = {
12 |   title: "Time Tracker",
13 |   description:
14 |     "Track your projects time and gain insightful project overviews.",
15 | };
16 |
17 | export default function Page() {
18 |   return (
19 |     <div className="container mb-52">
20 |       <div className="mb-40">
21 |         <h1 className="mt-24 font-medium text-center text-[75px] md:text-[170px] mb-2 leading-none text-stroke">
22 |           Time
23 |         </h1>
24 |
25 |         <h3 className="font-medium text-center text-[75px] md:text-[170px] mb-2 leading-none">
26 |           Tracker
27 |         </h3>
28 |
29 |         <div className="flex items-center flex-col text-center relative">
30 |           <p className="text-lg mt-4 max-w-[600px]">
31 |             Track your hours with ease and gain a clear monthly breakdown of
32 |             billable amounts. Link tracked time to customers and generate
33 |             invoices.
34 |           </p>
35 |
36 |           <CtaButton>Start tracking time now</CtaButton>
37 |         </div>
38 |       </div>
39 |
40 |       <DynamicImage
41 |         darkSrc={TrackerDark}
42 |         lightSrc={TrackerLight}
43 |         alt="Tracker"
44 |       />
45 |
46 |       <div className="flex items-center flex-col text-center relative mt-28">
47 |         <div className="max-w-[600px]">
48 |           <h4 className="font-medium text-xl md:text-2xl mb-4">
49 |             Have an overview of whats going on
50 |           </h4>
51 |           <p className="text-[#878787] text-sm">
52 |             Get a clear monthly overview of your tracked hours, set rates and
53 |             view the total billable amount with a detailed monthly breakdown.
54 |             Stay on top of your projects and manage your time effectively.
55 |           </p>
56 |         </div>
57 |
58 |         <DynamicImage
59 |           darkSrc={ProjectsDark}
60 |           lightSrc={ProjectsLight}
61 |           alt="Slot"
62 |           className="mt-10 max-w-[450px] w-full"
63 |         />
64 |         <div className="mt-32 max-w-[600px]">
65 |           <h4 className="font-medium text-xl md:text-2xl mb-4">
66 |             Track all your projects
67 |           </h4>
68 |           <p className="text-[#878787] text-sm mb-10">
69 |             Easily link tracked time to a customer and generate invoices based
70 |             on recorded hours. Export your data as a CSV for seamless reporting
71 |             and analysis.
72 |           </p>
73 |         </div>
74 |
75 |         <DynamicImage
76 |           darkSrc={SlotDark}
77 |           lightSrc={SlotLight}
78 |           alt="Slot"
79 |           className="mt-10 max-w-[550px] w-full"
80 |         />
81 |       </div>
82 |     </div>
83 |   );
84 | }
```

apps/website/src/app/updates/page.tsx
```
1 | import { Article } from "@/components/article";
2 | import { UpdatesToolbar } from "@/components/updates-toolbar";
3 | import { getBlogPosts } from "@/lib/blog";
4 | import type { Metadata } from "next";
5 |
6 | export const metadata: Metadata = {
7 |   title: "Updates",
8 |   description: "Keep up to date with product updates and announcments.",
9 | };
10 |
11 | export default async function Page() {
12 |   const data = getBlogPosts();
13 |
14 |   const posts = data
15 |     .sort((a, b) => {
16 |       if (new Date(a.metadata.publishedAt) > new Date(b.metadata.publishedAt)) {
17 |         return -1;
18 |       }
19 |       return 1;
20 |     })
21 |     .map((post, index) => (
22 |       <Article data={post} firstPost={index === 0} key={post.slug} />
23 |     ));
24 |
25 |   return (
26 |     <div className="container flex justify-center scroll-smooth">
27 |       <div className="max-w-[680px] pt-[80px] md:pt-[150px] w-full">
28 |         {posts}
29 |       </div>
30 |
31 |       <UpdatesToolbar
32 |         posts={data.map((post) => ({
33 |           slug: post.slug,
34 |           title: post.metadata.title,
35 |         }))}
36 |       />
37 |     </div>
38 |   );
39 | }
```

apps/website/src/app/vault/page.tsx
```
1 | import { Assistant } from "@/components/assistant";
2 | import { CtaButton } from "@/components/cta-button";
3 | import { DynamicImage } from "@/components/dynamic-image";
4 | import type { Metadata } from "next";
5 | import FilesLight from "public/product-files-light.png";
6 | import FilesDark from "public/product-files.png";
7 | import VaultLight from "public/product-vault-light.jpg";
8 | import VaultDark from "public/product-vault.jpg";
9 |
10 | export const metadata: Metadata = {
11 |   title: "Vault",
12 |   description:
13 |     "Don’t waste time searching through old emails and random folders. Keep all your contracts, agreements and more safe in one place.",
14 | };
15 |
16 | export default function Page() {
17 |   return (
18 |     <div className="container mb-52">
19 |       <div className="mb-40">
20 |         <h1 className="mt-24 font-medium text-center text-[75px] md:text-[170px] mb-2 leading-none text-stroke">
21 |           Your Files
22 |         </h1>
23 |
24 |         <h3 className="font-medium text-center text-[75px] md:text-[170px] mb-2 leading-none">
25 |           Vault
26 |         </h3>
27 |
28 |         <div className="flex items-center flex-col text-center relative">
29 |           <p className="text-lg mt-4 max-w-[600px]">
30 |             Don’t waste time searching through old emails and random folders.
31 |             Keep all your contracts, agreements and more safe in one place
32 |           </p>
33 |
34 |           <CtaButton>Centralize Your Files now</CtaButton>
35 |         </div>
36 |       </div>
37 |
38 |       <DynamicImage darkSrc={VaultDark} lightSrc={VaultLight} alt="Vault" />
39 |
40 |       <div className="flex items-center flex-col text-center relative mt-28">
41 |         <div className="max-w-[600px]">
42 |           <h4 className="font-medium text-xl md:text-2xl mb-4">
43 |             All your files in one place
44 |           </h4>
45 |           <p className="text-[#878787] text-sm">
46 |             Store all your important files securely in Midday, including
47 |             contracts and agreements, keeping everything in one place for easy
48 |             access. Simplify your document management and stay organized with a
49 |             central repository for all your business needs.
50 |           </p>
51 |         </div>
52 |
53 |         <DynamicImage
54 |           darkSrc={FilesDark}
55 |           lightSrc={FilesLight}
56 |           alt="Files"
57 |           className="mt-10 max-w-[834px] w-full"
58 |         />
59 |
60 |         <div className="mt-32 max-w-[550px]">
61 |           <h4 className="font-medium text-xl md:text-2xl mb-4">
62 |             Find what you need faster
63 |           </h4>
64 |           <p className="text-[#878787] text-sm mb-10">
65 |             Use the assistant to search for your files or even within your
66 |             files. Say you want to find that old contract but can’t remember
67 |             which client it was for, just search for details around it and the
68 |             assistant will find it for you.
69 |           </p>
70 |         </div>
71 |
72 |         <div className="text-left scale-[0.45] md:scale-100 -mt-20 md:mt-0">
73 |           <Assistant />
74 |         </div>
75 |       </div>
76 |     </div>
77 |   );
78 | }
```

apps/website/src/components/assistant/chat-avatar.tsx
```
1 | "use client";
2 |
3 | import { Avatar, AvatarImage } from "@midday/ui/avatar";
4 |
5 | type Props = {
6 |   role: "assistant" | "user";
7 | };
8 |
9 | export function ChatAvatar({ role }: Props) {
10 |   switch (role) {
11 |     case "user": {
12 |       return (
13 |         <Avatar className="size-6">
14 |           <AvatarImage src="https://pbs.twimg.com/profile_images/1755611130368770048/JwLEqyeo_400x400.jpg" />
15 |         </Avatar>
16 |       );
17 |     }
18 |
19 |     default:
20 |       return (
21 |         <svg
22 |           xmlns="http://www.w3.org/2000/svg"
23 |           width={24}
24 |           height={24}
25 |           fill="none"
26 |         >
27 |           <path
28 |             fill="currentColor"
29 |             fillRule="evenodd"
30 |             d="M11.479 0a11.945 11.945 0 0 0-5.026 1.344l5.026 8.705V0Zm0 13.952-5.026 8.704A11.946 11.946 0 0 0 11.48 24V13.952ZM12.523 24V13.946l5.028 8.708A11.943 11.943 0 0 1 12.523 24Zm0-13.946V0c1.808.078 3.513.555 5.028 1.346l-5.028 8.708Zm-10.654 8.4 8.706-5.026-5.026 8.706a12.075 12.075 0 0 1-3.68-3.68ZM22.134 5.55l-8.706 5.026 5.027-8.706a12.075 12.075 0 0 1 3.679 3.68ZM1.868 5.547a12.075 12.075 0 0 1 3.68-3.68l5.028 8.708-8.708-5.028Zm-.523.904A11.945 11.945 0 0 0 0 11.479h10.054l-8.71-5.028Zm0 11.1A11.945 11.945 0 0 1 0 12.524h10.053L1.346 17.55Zm12.606-6.072H24a11.946 11.946 0 0 0-1.345-5.026l-8.705 5.026Zm8.705 6.07-8.704-5.025H24a11.945 11.945 0 0 1-1.344 5.025Zm-9.226-4.12 5.024 8.702a12.075 12.075 0 0 0 3.678-3.678l-8.702-5.025Z"
31 |             clipRule="evenodd"
32 |           />
33 |         </svg>
34 |       );
35 |   }
36 | }
```

apps/website/src/components/assistant/chat-empty.tsx
```
1 | import { Icons } from "@midday/ui/icons";
2 |
3 | export function ChatEmpty() {
4 |   return (
5 |     <div className="w-full mt-24 flex flex-col items-center justify-center text-center">
6 |       <Icons.LogoSmall />
7 |       <span className="font-medium text-xl mt-6">
8 |         Hello, how can I help <br />
9 |         you today?
10 |       </span>
11 |     </div>
12 |   );
13 | }
```

apps/website/src/components/assistant/chat-examples.tsx
```
1 | "use client";
2 |
3 | import { motion } from "framer-motion";
4 | import { useRef } from "react";
5 | import { useDraggable } from "react-use-draggable-scroll";
6 | import { chatExamples } from "./examples";
7 |
8 | const listVariant = {
9 |   hidden: { y: 45, opacity: 0 },
10 |   show: {
11 |     y: 0,
12 |     opacity: 1,
13 |     transition: {
14 |       duration: 0.3,
15 |       staggerChildren: 0.08,
16 |     },
17 |   },
18 | };
19 |
20 | const itemVariant = {
21 |   hidden: { y: 45, opacity: 0 },
22 |   show: { y: 0, opacity: 1 },
23 | };
24 |
25 | export function ChatExamples({ onSubmit }) {
26 |   const ref = useRef(undefined);
27 |   const { events } = useDraggable(ref);
28 |
29 |   const totalLength = chatExamples.reduce((accumulator, currentString) => {
30 |     return accumulator + currentString.title.length * 8.2 + 50;
31 |   }, 0);
32 |
33 |   return (
34 |     <div
35 |       className="absolute z-10 bottom-[100px] left-0 right-0 overflow-scroll scrollbar-hide cursor-grabbing"
36 |       {...events}
37 |       ref={ref}
38 |     >
39 |       <motion.ul
40 |         variants={listVariant}
41 |         initial="hidden"
42 |         animate="show"
43 |         className="flex space-x-4 ml-4 items-center"
44 |         style={{ width: `${totalLength}px` }}
45 |       >
46 |         {chatExamples.map((example) => (
47 |           <button
48 |             key={example.title}
49 |             type="button"
50 |             onClick={() => onSubmit(example.title)}
51 |           >
52 |             <motion.li
53 |               variants={itemVariant}
54 |               className="font-mono text-[#878787] text-xs dark:bg-[#1D1D1D] bg-white px-3 py-2 rounded-full cursor-default"
55 |             >
56 |               {example.title}
57 |             </motion.li>
58 |           </button>
59 |         ))}
60 |       </motion.ul>
61 |     </div>
62 |   );
63 | }
```

apps/website/src/components/assistant/chat-list.tsx
```
1 | "use client";
2 |
3 | type Props = {
4 |   messages: any;
5 | };
6 |
7 | export function ChatList({ messages }: Props) {
8 |   if (!messages.length) {
9 |     return null;
10 |   }
11 |
12 |   return (
13 |     <div className="flex flex-col  p-4 pb-8">
14 |       {messages
15 |         .filter((tool) => tool.display !== undefined)
16 |         .map((message, index) => (
17 |           <div key={message.id}>
18 |             {message.display}
19 |             {index < messages.length - 1 && <div className="my-6" />}
20 |           </div>
21 |         ))}
22 |     </div>
23 |   );
24 | }
```

apps/website/src/components/assistant/chat.tsx
```
1 | "use client";
2 |
3 | import { useEnterSubmit } from "@midday/ui/hooks";
4 | import { ScrollArea } from "@midday/ui/scroll-area";
5 | import { Textarea } from "@midday/ui/textarea";
6 | import { motion } from "framer-motion";
7 | import { nanoid } from "nanoid";
8 | import { useState } from "react";
9 | import { ChatEmpty } from "./chat-empty";
10 | import { ChatExamples } from "./chat-examples";
11 | import { ChatList } from "./chat-list";
12 | import { chatExamples } from "./examples";
13 | import { Footer } from "./footer";
14 | import { BotCard, SignUpCard, UserMessage } from "./messages";
15 |
16 | export function Chat({ messages, submitMessage, input, setInput }) {
17 |   const { formRef, onKeyDown } = useEnterSubmit();
18 |   const [isVisible, setVisible] = useState(false);
19 |
20 |   const onSubmit = (input: string) => {
21 |     const value = input.trim();
22 |
23 |     if (value.length === 0) {
24 |       return null;
25 |     }
26 |
27 |     setInput("");
28 |
29 |     submitMessage((message) => [
30 |       ...message,
31 |       {
32 |         id: nanoid(),
33 |         role: "user",
34 |         display: <UserMessage>{value}</UserMessage>,
35 |       },
36 |     ]);
37 |
38 |     const content = chatExamples.find(
39 |       (example) => example.title === input,
40 |     )?.content;
41 |
42 |     if (content) {
43 |       setTimeout(
44 |         () =>
45 |           submitMessage((message) => [
46 |             ...message,
47 |             {
48 |               id: nanoid(),
49 |               role: "assistant",
50 |               display: (
51 |                 <BotCard
52 |                   content={
53 |                     chatExamples.find((example) => example.title === input)
54 |                       ?.content
55 |                   }
56 |                 />
57 |               ),
58 |             },
59 |           ]),
60 |         500,
61 |       );
62 |     } else {
63 |       setTimeout(
64 |         () =>
65 |           submitMessage((message) => [
66 |             ...message,
67 |             {
68 |               id: nanoid(),
69 |               role: "assistant",
70 |               display: <SignUpCard />,
71 |             },
72 |           ]),
73 |         200,
74 |       );
75 |     }
76 |   };
77 |
78 |   const showExamples = isVisible && messages.length === 0 && !input;
79 |
80 |   return (
81 |     <div className="relative h-[420px]">
82 |       <ScrollArea className="h-[335px]">
83 |         {messages.length ? <ChatList messages={messages} /> : <ChatEmpty />}
84 |       </ScrollArea>
85 |
86 |       <div className="absolute bottom-[1px] left-[1px] right-[1px] h-[88px] border-border border-t-[1px]">
87 |         {showExamples && <ChatExamples onSubmit={onSubmit} />}
88 |
89 |         <form
90 |           ref={formRef}
91 |           onSubmit={(evt) => {
92 |             evt.preventDefault();
93 |             onSubmit(input);
94 |           }}
95 |         >
96 |           <Textarea
97 |             tabIndex={0}
98 |             rows={1}
99 |             spellCheck={false}
100 |             autoComplete="off"
101 |             autoCorrect="off"
102 |             value={input}
103 |             className="h-12 min-h-12 pt-3 resize-none border-none"
104 |             placeholder="Ask Midday a question..."
105 |             onKeyDown={onKeyDown}
106 |             onChange={(evt) => {
107 |               setInput(evt.target.value);
108 |             }}
109 |           />
110 |         </form>
111 |
112 |         <motion.div
113 |           onViewportEnter={() => {
114 |             if (!isVisible) {
115 |               setVisible(true);
116 |             }
117 |           }}
118 |           onViewportLeave={() => {
119 |             if (isVisible) {
120 |               setVisible(false);
121 |             }
122 |           }}
123 |         >
124 |           <Footer onSubmit={() => onSubmit(input)} />
125 |         </motion.div>
126 |       </div>
127 |     </div>
128 |   );
129 | }
```

apps/website/src/components/assistant/examples.tsx
```
1 | export const chatExamples = [
2 |   {
3 |     title: `What's my burn rate`,
4 |     content:
5 |       "Based on your historical data, your average burn rate is $8,933.33 per month. Your expected runway is 7 months, ending on January 5, 2025.",
6 |   },
7 |   {
8 |     title: `What's my runway`,
9 |     content:
10 |       "Based on your historical data, your expected runway is 7 months, ending in Jan 5, 2025.",
11 |   },
12 |   {
13 |     title: "What is my spending on Software",
14 |     content:
15 |       "You have spent $8,933.33 on Software between Jun 1, 2023 and Jun 5, 2024",
16 |   },
17 |   {
18 |     title: "Find a receipt or invoice",
19 |     content:
20 |       "Please provide the name of the receipt or invoice you are looking for.",
21 |   },
22 |   {
23 |     title: "Find a transaction",
24 |     content:
25 |       "Could you please provide more details about the transaction you are looking for?",
26 |   },
27 |   {
28 |     title: `What's my profit for last year`,
29 |     content:
30 |       "Based on the period from Jun 1, 2022 and Jun 1, 2023 your current profit is $18,933.33. In the previous period, your profit was $3,422.33",
31 |   },
32 |   {
33 |     title: `What's my revenue`,
34 |     content:
35 |       "Based on the period from Jun 1, 2023 and Jun 5, 2024 your revenue is $18,933.33. In the previous period, your profit was $20,933.33.",
36 |   },
37 |   {
38 |     title: "Create a report",
39 |     content:
40 |       "Could you please specify the type of report you would like to create?",
41 |   },
42 |   {
43 |     title: "Forecast profit",
44 |     content:
45 |       "Based on the last 12 months profit data, the forecasted profit for the next month is approximately $18,933.33. This is an indication of the forecast and should be verified.",
46 |   },
47 |   {
48 |     title: "Forecast revenue",
49 |     content:
50 |       "Based on the last 12 months revenue data, the average monthly revenue is $3,422.33. Therefore, the forecasted revenue for the next month is approximately $18,933.33. This is an indication of the forecast and should be verified.",
51 |   },
52 | ];
```

apps/website/src/components/assistant/footer.tsx
```
1 | import { Icons } from "@midday/ui/icons";
2 | import { Popover, PopoverContent, PopoverTrigger } from "@midday/ui/popover";
3 | import { useRouter } from "next/navigation";
4 |
5 | type Props = {
6 |   onSubmit: () => void;
7 | };
8 |
9 | export function Footer({ onSubmit }: Props) {
10 |   const router = useRouter();
11 |
12 |   return (
13 |     <div className="flex px-3 h-[40px] w-full border-t-[1px] items-center bg-background backdrop-filter dark:border-[#2C2C2C] backdrop-blur-lg dark:bg-[#151515]/[99]">
14 |       <Popover>
15 |         <PopoverTrigger>
16 |           <div className="scale-50 dark:opacity-50 -ml-2">
17 |             <Icons.LogoSmall />
18 |           </div>
19 |         </PopoverTrigger>
20 |
21 |         <PopoverContent
22 |           className="bg-background backdrop-filter dark:border-[#2C2C2C] backdrop-blur-lg dark:bg-[#1A1A1A]/95 p-2 rounded-lg -ml-2 w-auto"
23 |           side="top"
24 |           align="start"
25 |           sideOffset={10}
26 |         >
27 |           <ul className="flex flex-col space-y-2">
28 |             <li>
29 |               <button
30 |                 type="button"
31 |                 className="flex space-x-2 items-center text-xs hover:bg-[#2b2b2b] rounded-md transition-colors w-full p-1"
32 |                 onClick={() => router.push("https://x.com/middayai")}
33 |               >
34 |                 <Icons.X className="w-[16px] h-[16px]" />
35 |                 <span>Follow us</span>
36 |               </button>
37 |             </li>
38 |             <li>
39 |               <button
40 |                 type="button"
41 |                 className="flex space-x-2 items-center text-xs hover:bg-[#2b2b2b] rounded-md transition-colors w-full p-1"
42 |                 onClick={() => router.push("https://go.midday.ai/anPiuRx")}
43 |               >
44 |                 <Icons.Discord className="w-[16px] h-[16px]" />
45 |                 <span>Join Our Community</span>
46 |               </button>
47 |             </li>
48 |
49 |             <li>
50 |               <button
51 |                 type="button"
52 |                 className="flex space-x-2 items-center text-xs hover:bg-[#2b2b2b] rounded-md transition-colors w-full p-1"
53 |                 onClick={() => router.push("https://git.new/midday")}
54 |               >
55 |                 <Icons.GithubOutline className="w-[16px] h-[16px]" />
56 |                 <span>Github</span>
57 |               </button>
58 |             </li>
59 |           </ul>
60 |         </PopoverContent>
61 |       </Popover>
62 |
63 |       <div className="ml-auto flex space-x-4">
64 |         <button
65 |           className="flex space-x-2 items-center text-xs"
66 |           type="button"
67 |           onClick={onSubmit}
68 |         >
69 |           <span>Submit</span>
70 |           <kbd className="pointer-events-none h-5 select-none items-center gap-1 rounded border bg-accent px-1.5 font-mono text-[10px] font-medium">
71 |             <span>↵</span>
72 |           </kbd>
73 |         </button>
74 |       </div>
75 |     </div>
76 |   );
77 | }
```

apps/website/src/components/assistant/header.tsx
```
1 | import { Button } from "@midday/ui/button";
2 | import { Icons } from "@midday/ui/icons";
3 | // import { Experimental } from "../experimental";
4 |
5 | type Props = {
6 |   isExpanded: boolean;
7 |   toggleSidebar: () => void;
8 | };
9 |
10 | export function Header({ toggleSidebar, isExpanded }: Props) {
11 |   return (
12 |     <div className="px-4 py-3 flex justify-between items-center border-border border-b-[1px]">
13 |       <div className="flex items-center space-x-3">
14 |         <Button
15 |           variant="outline"
16 |           size="icon"
17 |           className="size-8 z-50 p-0"
18 |           onClick={toggleSidebar}
19 |         >
20 |           {isExpanded ? (
21 |             <Icons.SidebarFilled width={18} />
22 |           ) : (
23 |             <Icons.Sidebar width={18} />
24 |           )}
25 |         </Button>
26 |
27 |         <h2>Assistant</h2>
28 |       </div>
29 |
30 |       <div className="flex space-x-2 items-center">
31 |         {/* <Experimental className="border-border text-[#878787]" /> */}
32 |       </div>
33 |     </div>
34 |   );
35 | }
```

apps/website/src/components/assistant/index.tsx
```
1 | "use client";
2 |
3 | import { nanoid } from "nanoid";
4 | import { useState } from "react";
5 | import { useHotkeys } from "react-hotkeys-hook";
6 | import { Chat } from "./chat";
7 | import { chatExamples } from "./examples";
8 | import { Header } from "./header";
9 | import { BotCard, UserMessage } from "./messages";
10 | import { Sidebar } from "./sidebar";
11 |
12 | export function Assistant() {
13 |   const [isExpanded, setExpanded] = useState(false);
14 |   const [messages, setMessages] = useState([]);
15 |   const [input, setInput] = useState("");
16 |
17 |   const toggleOpen = () => setExpanded((prev) => !prev);
18 |
19 |   const onNewChat = () => {
20 |     setExpanded(false);
21 |     setInput("");
22 |     setMessages([]);
23 |   };
24 |
25 |   const handleOnSelect = (message: string) => {
26 |     const content = chatExamples.find(
27 |       (example) => example.title === message,
28 |     )?.content;
29 |
30 |     setExpanded(false);
31 |
32 |     if (content) {
33 |       setMessages([
34 |         {
35 |           id: nanoid(),
36 |           role: "user",
37 |           display: <UserMessage>{message}</UserMessage>,
38 |         },
39 |         {
40 |           id: nanoid(),
41 |           role: "assistant",
42 |           display: <BotCard content={content} />,
43 |         },
44 |       ]);
45 |     }
46 |   };
47 |
48 |   useHotkeys("meta+j", () => onNewChat(), {
49 |     enableOnFormTags: true,
50 |   });
51 |
52 |   return (
53 |     <div className="overflow-hidden p-0 w-[760px] h-full md:h-[480px] backdrop-filter backdrop-blur-xl dark:bg-[#121212] bg-white dark:bg-opacity-80 bg-opacity-95 border-border border rounded-md relative">
54 |       <Header toggleSidebar={toggleOpen} isExpanded={isExpanded} />
55 |       <Sidebar
56 |         setExpanded={setExpanded}
57 |         isExpanded={isExpanded}
58 |         onNewChat={onNewChat}
59 |         onSelect={handleOnSelect}
60 |       />
61 |
62 |       <Chat
63 |         onNewChat={onNewChat}
64 |         messages={messages}
65 |         setInput={setInput}
66 |         input={input}
67 |         submitMessage={setMessages}
68 |       />
69 |     </div>
70 |   );
71 | }
```

apps/website/src/components/assistant/message-uis.tsx
```
1 | export function BurnRateUI() {
2 |   return;
3 | }
```

apps/website/src/components/assistant/messages.tsx
```
1 | "use client";
2 |
3 | import { Button } from "@midday/ui/button";
4 | import { cn } from "@midday/ui/cn";
5 | import { motion } from "framer-motion";
6 | import { useEffect, useState } from "react";
7 | import { ChatAvatar } from "./chat-avatar";
8 | import { spinner } from "./spinner";
9 |
10 | function getRandomDelay(min, max) {
11 |   return Math.floor(Math.random() * (max - min + 1)) + min;
12 | }
13 |
14 | async function concatCharacter(inputString, callback) {
15 |   const words = inputString.split(" ");
16 |   let result = "";
17 |   for (let i = 0; i < words.length; i++) {
18 |     result += (i > 0 ? " " : "") + words[i];
19 |     await new Promise((resolve) =>
20 |       setTimeout(resolve, getRandomDelay(70, 100))
21 |     );
22 |     callback(result); // Call the callback with the intermediate result
23 |   }
24 | }
25 |
26 | export function UserMessage({ children }: { children: React.ReactNode }) {
27 |   return (
28 |     <div className="group relative flex items-start">
29 |       <div className="flex size-[25px] shrink-0 select-none items-center justify-center">
30 |         <ChatAvatar role="user" />
31 |       </div>
32 |
33 |       <div className="ml-4 flex-1 space-y-2 overflow-hidden pl-2 text-xs font-mono leading-relaxed">
34 |         {children}
35 |       </div>
36 |     </div>
37 |   );
38 | }
39 |
40 | export function SpinnerMessage() {
41 |   return (
42 |     <div className="group relative flex items-start">
43 |       <div className="flex size-[25px] shrink-0 select-none items-center justify-center">
44 |         <ChatAvatar role="assistant" />
45 |       </div>
46 |
47 |       <div className="ml-4 flex-1 space-y-2 overflow-hidden pl-2">
48 |         {spinner}
49 |       </div>
50 |     </div>
51 |   );
52 | }
53 |
54 | export function BotCard({
55 |   content,
56 |   showAvatar = true,
57 |   className,
58 | }: {
59 |   content: string;
60 |   showAvatar?: boolean;
61 |   className?: string;
62 | }) {
63 |   const [text, setText] = useState();
64 |
65 |   useEffect(() => {
66 |     concatCharacter(content, (intermediateResult) => {
67 |       setText(intermediateResult);
68 |     });
69 |   }, []);
70 |
71 |   return (
72 |     <div className="group relative flex items-start">
73 |       <div className="flex size-[25px] shrink-0 select-none items-center justify-center">
74 |         {showAvatar && <ChatAvatar role="assistant" />}
75 |       </div>
76 |
77 |       <div
78 |         className={cn(
79 |           "ml-4 flex-1 space-y-2 overflow-hidden pl-2 text-xs font-mono leading-relaxed",
80 |           className
81 |         )}
82 |       >
83 |         {text}
84 |       </div>
85 |     </div>
86 |   );
87 | }
88 |
89 | export function SignUpCard({
90 |   showAvatar = true,
91 |   className,
92 | }: {
93 |   showAvatar?: boolean;
94 |   className?: string;
95 | }) {
96 |   const [text, setText] = useState();
97 |
98 |   const content =
99 |     "I'm just a demo assistant. To ask questions about your business, you can sign up and get started in a matter of minutes.";
100 |
101 |   useEffect(() => {
102 |     concatCharacter(content, (intermediateResult) => {
103 |       setText(intermediateResult);
104 |     });
105 |   }, []);
106 |
107 |   return (
108 |     <div>
109 |       <div className="group relative flex items-start">
110 |         <div className="flex size-[25px] shrink-0 select-none items-center justify-center">
111 |           {showAvatar && <ChatAvatar role="assistant" />}
112 |         </div>
113 |
114 |         <div
115 |           className={cn(
116 |             "ml-4 flex-1 space-y-2 overflow-hidden pl-2 text-xs font-mono leading-relaxed",
117 |             className
118 |           )}
119 |         >
120 |           {text}
121 |         </div>
122 |       </div>
123 |
124 |       <motion.div
125 |         className="ml-12 mt-4"
126 |         initial={{ opacity: 0 }}
127 |         animate={{ opacity: 1 }}
128 |         transition={{ duration: 0.5, delay: 2.2 }}
129 |       >
130 |         <a href="https://app.midday.ai">
131 |           <Button>Sign up</Button>
132 |         </a>
133 |       </motion.div>
134 |     </div>
135 |   );
136 | }
```

apps/website/src/components/assistant/sidebar-item.tsx
```
1 | import { cn } from "@midday/ui/cn";
2 |
3 | interface SidebarItemProps {
4 |   chat: any;
5 |   onSelect: (message: string) => void;
6 | }
7 |
8 | export function SidebarItem({ chat, onSelect }: SidebarItemProps) {
9 |   return (
10 |     <button
11 |       type="button"
12 |       className={cn(
13 |         "text-left transition-colors px-0 py-1 rounded-lg w-full text-[#878787] hover:text-primary"
14 |       )}
15 |       onClick={() => onSelect(chat.title)}
16 |     >
17 |       <span className="text-xs line-clamp-1">{chat.title}</span>
18 |     </button>
19 |   );
20 | }
```

apps/website/src/components/assistant/sidebar-items.tsx
```
1 | import { chatExamples } from "./examples";
2 | import { SidebarItem } from "./sidebar-item";
3 |
4 | interface SidebarItemsProps {
5 |   onSelect: (id: string) => void;
6 |   chatId?: string;
7 | }
8 |
9 | const formatRange = (key: string) => {
10 |   switch (key) {
11 |     case "1d":
12 |       return "Today";
13 |     case "2d":
14 |       return "Yesterday";
15 |     case "7d":
16 |       return "Last 7 days";
17 |     case "30d":
18 |       return "Last 30 days";
19 |     default:
20 |       return null;
21 |   }
22 | };
23 |
24 | const items = {
25 |   "1d": [
26 |     {
27 |       id: "1",
28 |       title: chatExamples.at(0).title,
29 |     },
30 |     {
31 |       id: "2",
32 |       title: chatExamples.at(2).title,
33 |     },
34 |   ],
35 |   "2d": [
36 |     {
37 |       id: "1",
38 |       title: chatExamples.at(3).title,
39 |     },
40 |     {
41 |       id: "2",
42 |       title: chatExamples.at(4).title,
43 |     },
44 |   ],
45 |   "7d": [
46 |     {
47 |       id: "1",
48 |       title: chatExamples.at(5).title,
49 |     },
50 |     {
51 |       id: "2",
52 |       title: chatExamples.at(6).title,
53 |     },
54 |     {
55 |       id: "3",
56 |       title: chatExamples.at(0).title,
57 |     },
58 |     {
59 |       id: "4",
60 |       title: chatExamples.at(2).title,
61 |     },
62 |     {
63 |       id: "5",
64 |       title: chatExamples.at(3).title,
65 |     },
66 |   ],
67 |   "30d": [
68 |     {
69 |       id: "1",
70 |       title: chatExamples.at(2).title,
71 |     },
72 |     {
73 |       id: "2",
74 |       title: chatExamples.at(3).title,
75 |     },
76 |     {
77 |       id: "3",
78 |       title: chatExamples.at(4).title,
79 |     },
80 |     {
81 |       id: "4",
82 |       title: chatExamples.at(5).title,
83 |     },
84 |     {
85 |       id: "5",
86 |       title: chatExamples.at(6).title,
87 |     },
88 |   ],
89 | };
90 |
91 | export function SidebarItems({ onSelect }: SidebarItemsProps) {
92 |   return (
93 |     <div className="overflow-auto relative h-full md:h-[410px] mt-4 scrollbar-hide p-4 pt-0 pb-[70px] flex flex-col space-y-6">
94 |       {!Object.keys(items).length && (
95 |         <div className="flex flex-col justify-center items-center h-full">
96 |           <div className="flex flex-col items-center -mt-12 text-xs space-y-1">
97 |             <span className="text-[#878787]">History</span>
98 |             <span>No results found</span>
99 |           </div>
100 |         </div>
101 |       )}
102 |
103 |       {Object.keys(items).map((key) => {
104 |         const section = items[key];
105 |
106 |         return (
107 |           <div key={key}>
108 |             {section?.length > 0 && (
109 |               <div className="sticky top-0 z-20 w-full bg-background dark:bg-[#131313] pb-1">
110 |                 <span className="font-mono text-xs">{formatRange(key)}</span>
111 |               </div>
112 |             )}
113 |
114 |             <div className="mt-1">
115 |               {section?.map((chat) => {
116 |                 return (
117 |                   <SidebarItem key={chat.id} chat={chat} onSelect={onSelect} />
118 |                 );
119 |               })}
120 |             </div>
121 |           </div>
122 |         );
123 |       })}
124 |     </div>
125 |   );
126 | }
```

apps/website/src/components/assistant/sidebar.tsx
```
1 | import { cn } from "@midday/ui/cn";
2 | import { useClickAway } from "@uidotdev/usehooks";
3 | import { SidebarItems } from "./sidebar-items";
4 | import { Toolbar } from "./toolbar";
5 |
6 | type Props = {
7 |   isExpanded: boolean;
8 |   setExpanded: (value: boolean) => void;
9 |   onSelect: (id: string) => void;
10 |   onNewChat: () => void;
11 | };
12 |
13 | export function Sidebar({
14 |   isExpanded,
15 |   setExpanded,
16 |   onSelect,
17 |   onNewChat,
18 | }: Props) {
19 |   const ref = useClickAway(() => {
20 |     setExpanded(false);
21 |   });
22 |
23 |   return (
24 |     <div className="relative">
25 |       <div
26 |         ref={ref}
27 |         className={cn(
28 |           "w-[220px] h-full md:h-[422px] bg-background dark:bg-[#131313] absolute -left-[220px] top-0 bottom-[1px] duration-200 ease-out transition-all border-border border-r-[1px] z-20 invisible",
29 |           isExpanded && "visible translate-x-full"
30 |         )}
31 |       >
32 |         <Toolbar onNewChat={onNewChat} />
33 |         <SidebarItems onSelect={onSelect} />
34 |         <div className="absolute z-10 h-full md:h-[422px] w-[45px] bg-gradient-to-r from-background/30 dark:from-[#131313]/30 to-background right-0 top-0 pointer-events-none" />
35 |       </div>
36 |
37 |       <div
38 |         className={cn(
39 |           "duration-200 ease-out transition-all z-10 absolute left-[1px] right-[1px] top-[1px] bottom-[1px] invisible opacity-0 bg-background",
40 |           isExpanded && "visible opacity-80"
41 |         )}
42 |       />
43 |     </div>
44 |   );
45 | }
```

apps/website/src/components/assistant/spinner.tsx
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

apps/website/src/components/assistant/toolbar.tsx
```
1 | type Props = {
2 |   onNewChat: () => void;
3 | };
4 |
5 | export function Toolbar({ onNewChat }: Props) {
6 |   return (
7 |     <button
8 |       onClick={onNewChat}
9 |       type="button"
10 |       className="left-4 right-4 absolute z-50 bottom-4 "
11 |     >
12 |       <div className="flex items-center justify-center">
13 |         <div className="dark:bg-[#1A1A1A]/95 bg-[#F6F6F3]/95 h-8 w-full justify-between items-center flex px-2 rounded-lg space-x-4 text-[#878787]">
14 |           <div className="flex items-center space-x-3">
15 |             <kbd className="pointer-events-none h-5 select-none items-center gap-1.5 rounded border bg-accent px-1.5 font-mono text-[11px] font-medium flex bg-[#2C2C2C]">
16 |               <span className="text-[16px]">⌘</span>J
17 |             </kbd>
18 |             <span className="text-xs">New chat</span>
19 |           </div>
20 |         </div>
21 |       </div>
22 |     </button>
23 |   );
24 | }
```

apps/website/src/components/charts/bank-accounts-chart.tsx
```
1 | import { fetchStats } from "@/lib/fetch-stats";
2 |
3 | export async function BankAccountsChart() {
4 |   const { bankAccounts } = await fetchStats();
5 |
6 |   return (
7 |     <div className="flex border flex-col items-center justify-center border-border bg-background px-6 pt-8 pb-6 space-y-4">
8 |       <h2 className="text-2xl">Bank Accounts</h2>
9 |       <p className="text-[#878787] text-sm text-center">
10 |         Number of connected bank accounts.
11 |       </p>
12 |
13 |       <div className="flex items-center space-x-4">
14 |         <span className="relative ml-auto flex h-2 w-2">
15 |           <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 bg-green-400" />
16 |           <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
17 |         </span>
18 |
19 |         <span className="mt-auto font-mono text-[80px] md:text-[110px]">
20 |           {bankAccounts &&
21 |             Intl.NumberFormat("en", { notation: "compact" }).format(
22 |               bankAccounts,
23 |             )}
24 |         </span>
25 |       </div>
26 |     </div>
27 |   );
28 | }
```

apps/website/src/components/charts/bank-connections-chart.tsx
```
1 | import { fetchStats } from "@/lib/fetch-stats";
2 | import Link from "next/link";
3 |
4 | export async function BankConnectionsChart() {
5 |   const { bankConnections } = await fetchStats();
6 |
7 |   return (
8 |     <div className="flex border flex-col items-center justify-center border-border bg-background px-6 pt-8 pb-6 space-y-4">
9 |       <h2 className="text-2xl">Bank Connections</h2>
10 |       <p className="text-[#878787] text-sm text-center">
11 |         Number of connected bank connections using{" "}
12 |         <Link href="/engine" className="underline">
13 |           Midday Engine
14 |         </Link>
15 |         .
16 |       </p>
17 |
18 |       <div className="flex items-center space-x-4">
19 |         <span className="relative ml-auto flex h-2 w-2">
20 |           <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 bg-green-400" />
21 |           <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
22 |         </span>
23 |
24 |         <span className="mt-auto font-mono text-[80px] md:text-[110px]">
25 |           {bankConnections}
26 |         </span>
27 |       </div>
28 |     </div>
29 |   );
30 | }
```

apps/website/src/components/charts/inbox-chart.tsx
```
1 | import { fetchStats } from "@/lib/fetch-stats";
2 |
3 | export async function InboxChart() {
4 |   const { inboxItems } = await fetchStats();
5 |
6 |   return (
7 |     <div className="flex border flex-col items-center justify-center border-border bg-background px-6 pt-8 pb-6 space-y-4">
8 |       <h2 className="text-2xl">Inbox</h2>
9 |       <p className="text-[#878787] text-sm text-center">
10 |         Number of incoming inbox items.
11 |       </p>
12 |
13 |       <div className="flex items-center space-x-4">
14 |         <span className="relative ml-auto flex h-2 w-2">
15 |           <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 bg-green-400" />
16 |           <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
17 |         </span>
18 |
19 |         <span className="mt-auto font-mono text-[80px] md:text-[110px]">
20 |           {inboxItems &&
21 |             Intl.NumberFormat("en", { notation: "compact" }).format(inboxItems)}
22 |         </span>
23 |       </div>
24 |     </div>
25 |   );
26 | }
```

apps/website/src/components/charts/invoice-customers.tsx
```
1 | import { fetchStats } from "@/lib/fetch-stats";
2 |
3 | export async function InvoiceCustomersChart() {
4 |   const { invoiceCustomers } = await fetchStats();
5 |
6 |   return (
7 |     <div className="flex border flex-col items-center justify-center border-border bg-background px-6 pt-8 pb-6 space-y-4">
8 |       <h2 className="text-2xl">Invoice Customers</h2>
9 |       <p className="text-[#878787] text-sm text-center">
10 |         Number of invoice customers.
11 |       </p>
12 |
13 |       <div className="flex items-center space-x-4">
14 |         <span className="relative ml-auto flex h-2 w-2">
15 |           <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 bg-green-400" />
16 |           <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
17 |         </span>
18 |
19 |         <span className="mt-auto font-mono text-[80px] md:text-[110px]">
20 |           {invoiceCustomers &&
21 |             Intl.NumberFormat("en", { notation: "compact" }).format(
22 |               invoiceCustomers,
23 |             )}
24 |         </span>
25 |       </div>
26 |     </div>
27 |   );
28 | }
```

apps/website/src/components/charts/invoices-chart.tsx
```
1 | import { fetchStats } from "@/lib/fetch-stats";
2 |
3 | export async function InvoicesChart() {
4 |   const { invoices } = await fetchStats();
5 |
6 |   return (
7 |     <div className="flex border flex-col items-center justify-center border-border bg-background px-6 pt-8 pb-6 space-y-4">
8 |       <h2 className="text-2xl">Invoices</h2>
9 |       <p className="text-[#878787] text-sm text-center">
10 |         Number of invoices created.
11 |       </p>
12 |
13 |       <div className="flex items-center space-x-4">
14 |         <span className="relative ml-auto flex h-2 w-2">
15 |           <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 bg-green-400" />
16 |           <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
17 |         </span>
18 |
19 |         <span className="mt-auto font-mono text-[80px] md:text-[110px]">
20 |           {invoices &&
21 |             Intl.NumberFormat("en", { notation: "compact" }).format(invoices)}
22 |         </span>
23 |       </div>
24 |     </div>
25 |   );
26 | }
```

apps/website/src/components/charts/reports-chart.tsx
```
1 | import { fetchStats } from "@/lib/fetch-stats";
2 |
3 | export async function ReportsChart() {
4 |   const { reports } = await fetchStats();
5 |
6 |   return (
7 |     <div className="flex border flex-col items-center justify-center border-border bg-background px-6 pt-8 pb-6 space-y-4">
8 |       <h2 className="text-2xl">Reports</h2>
9 |       <p className="text-[#878787] text-sm text-center">
10 |         Number of generated reports.
11 |       </p>
12 |
13 |       <div className="flex items-center space-x-4">
14 |         <span className="relative ml-auto flex h-2 w-2">
15 |           <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 bg-green-400" />
16 |           <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
17 |         </span>
18 |
19 |         <span className="mt-auto font-mono text-[80px] md:text-[110px]">
20 |           {reports &&
21 |             Intl.NumberFormat("en", { notation: "compact" }).format(reports)}
22 |         </span>
23 |       </div>
24 |     </div>
25 |   );
26 | }
```

apps/website/src/components/charts/tracker-entries-chart.tsx
```
1 | import { fetchStats } from "@/lib/fetch-stats";
2 |
3 | export async function TrackerEntriesChart() {
4 |   const { trackerEntries } = await fetchStats();
5 |
6 |   return (
7 |     <div className="flex border flex-col items-center justify-center border-border bg-background px-6 pt-8 pb-6 space-y-4">
8 |       <h2 className="text-2xl">Time Tracker Entries</h2>
9 |       <p className="text-[#878787] text-sm text-center">
10 |         Number of tracked time entries.
11 |       </p>
12 |
13 |       <div className="flex items-center space-x-4">
14 |         <span className="relative ml-auto flex h-2 w-2">
15 |           <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 bg-green-400" />
16 |           <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
17 |         </span>
18 |
19 |         <span className="mt-auto font-mono text-[80px] md:text-[110px]">
20 |           {trackerEntries &&
21 |             Intl.NumberFormat("en", { notation: "compact" }).format(
22 |               trackerEntries,
23 |             )}
24 |         </span>
25 |       </div>
26 |     </div>
27 |   );
28 | }
```

apps/website/src/components/charts/tracker-projects-chart.tsx
```
1 | import { fetchStats } from "@/lib/fetch-stats";
2 |
3 | export async function TrackerProjectsChart() {
4 |   const { trackerProjects } = await fetchStats();
5 |   return (
6 |     <div className="flex border flex-col items-center justify-center border-border bg-background px-6 pt-8 pb-6 space-y-4">
7 |       <h2 className="text-2xl">Time Tracker Projects</h2>
8 |       <p className="text-[#878787] text-sm text-center">
9 |         Number of created tracker projects.
10 |       </p>
11 |
12 |       <div className="flex items-center space-x-4">
13 |         <span className="relative ml-auto flex h-2 w-2">
14 |           <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 bg-green-400" />
15 |           <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
16 |         </span>
17 |
18 |         <span className="mt-auto font-mono text-[80px] md:text-[110px]">
19 |           {trackerProjects &&
20 |             Intl.NumberFormat("en", { notation: "compact" }).format(
21 |               trackerProjects,
22 |             )}
23 |         </span>
24 |       </div>
25 |     </div>
26 |   );
27 | }
```

apps/website/src/components/charts/transaction-enrichments-chart.tsx
```
1 | import { fetchStats } from "@/lib/fetch-stats";
2 | import Link from "next/link";
3 |
4 | export async function TransactionEnrichmentsChart() {
5 |   const { transactionEnrichments } = await fetchStats();
6 |
7 |   return (
8 |     <div className="flex border flex-col items-center justify-center border-border bg-background px-6 pt-8 pb-6 space-y-4">
9 |       <h2 className="text-2xl">Enriched Categories</h2>
10 |       <p className="text-[#878787] text-sm text-center">
11 |         Number of enriched categories using{" "}
12 |         <Link href="/engine" className="underline">
13 |           Midday Engine
14 |         </Link>
15 |         .
16 |       </p>
17 |
18 |       <div className="flex items-center space-x-4">
19 |         <span className="relative ml-auto flex h-2 w-2">
20 |           <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 bg-green-400" />
21 |           <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
22 |         </span>
23 |
24 |         <span className="mt-auto font-mono text-[80px] md:text-[110px]">
25 |           {transactionEnrichments &&
26 |             Intl.NumberFormat("en", { notation: "compact" }).format(
27 |               transactionEnrichments,
28 |             )}
29 |         </span>
30 |       </div>
31 |     </div>
32 |   );
33 | }
```

apps/website/src/components/charts/transactions-chart.tsx
```
1 | import { fetchStats } from "@/lib/fetch-stats";
2 |
3 | export async function TransactionsChart() {
4 |   const { transactions } = await fetchStats();
5 |
6 |   return (
7 |     <div className="flex border flex-col items-center justify-center border-border bg-background px-6 pt-8 pb-6 space-y-4">
8 |       <h2 className="text-2xl">Transactions</h2>
9 |       <p className="text-[#878787] text-sm text-center">
10 |         We are already handling a significant amount of transactions.
11 |       </p>
12 |
13 |       <div className="flex items-center space-x-4">
14 |         <span className="relative ml-auto flex h-2 w-2">
15 |           <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 bg-green-400" />
16 |           <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
17 |         </span>
18 |
19 |         <span className="mt-auto font-mono text-[80px] md:text-[110px]">
20 |           {transactions &&
21 |             Intl.NumberFormat("en", { notation: "compact" }).format(
22 |               transactions,
23 |             )}
24 |         </span>
25 |       </div>
26 |     </div>
27 |   );
28 | }
```

apps/website/src/components/charts/users-chart.tsx
```
1 | import { fetchStats } from "@/lib/fetch-stats";
2 |
3 | export async function UsersChart() {
4 |   const { users } = await fetchStats();
5 |
6 |   return (
7 |     <div className="flex border flex-col items-center justify-center border-border bg-background px-6 pt-8 pb-6 space-y-4">
8 |       <h2 className="text-2xl">Businesses</h2>
9 |       <p className="text-[#878787] text-sm text-center">
10 |         This is the number of customers currently using Midday.
11 |       </p>
12 |
13 |       <div className="flex items-center space-x-4">
14 |         <span className="relative ml-auto flex h-2 w-2">
15 |           <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 bg-green-400" />
16 |           <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
17 |         </span>
18 |
19 |         <span className="mt-auto font-mono text-[80px] md:text-[110px]">
20 |           {new Intl.NumberFormat("en-US", {
21 |             minimumFractionDigits: 0,
22 |             maximumFractionDigits: 0,
23 |             useGrouping: true,
24 |           }).format(users)}
25 |         </span>
26 |       </div>
27 |     </div>
28 |   );
29 | }
```

apps/website/src/components/charts/vault-chart.tsx
```
1 | import { fetchStats } from "@/lib/fetch-stats";
2 |
3 | export async function VaultChart() {
4 |   const { vaultObjects } = await fetchStats();
5 |
6 |   return (
7 |     <div className="flex border flex-col items-center justify-center border-border bg-background px-6 pt-8 pb-6 space-y-4">
8 |       <h2 className="text-2xl">Vault</h2>
9 |       <p className="text-[#878787] text-sm text-center">
10 |         Number of files in Vault.
11 |       </p>
12 |
13 |       <div className="flex items-center space-x-4">
14 |         <span className="relative ml-auto flex h-2 w-2">
15 |           <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 bg-green-400" />
16 |           <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
17 |         </span>
18 |
19 |         <span className="mt-auto font-mono text-[80px] md:text-[110px]">
20 |           {vaultObjects &&
21 |             Intl.NumberFormat("en", { notation: "compact" }).format(
22 |               vaultObjects,
23 |             )}
24 |         </span>
25 |       </div>
26 |     </div>
27 |   );
28 | }
```

packages/app-store/src/cal/assets/logo.tsx
```
1 | export const Logo = () => {
2 |   return (
3 |     <svg
4 |       width="79"
5 |       height="17"
6 |       viewBox="0 0 79 17"
7 |       fill="none"
8 |       xmlns="http://www.w3.org/2000/svg"
9 |     >
10 |       <g clipPath="url(#clip0_1893_3733)">
11 |         <path
12 |           d="M8.27225 16.0859C3.83907 16.0859 0.5 12.5771 0.5 8.2453C0.5 3.89909 3.66857 0.36145 8.27225 0.36145C10.7162 0.36145 12.407 1.11229 13.7284 2.83057L11.5971 4.60661C10.7019 3.65361 9.62205 3.17712 8.27225 3.17712C5.27416 3.17712 3.62594 5.47297 3.62594 8.2453C3.62594 11.0177 5.43046 13.2702 8.27225 13.2702C9.60783 13.2702 10.7446 12.7937 11.6397 11.8407L13.7426 13.6889C12.478 15.335 10.7446 16.0859 8.27225 16.0859Z"
13 |           fill="currentColor"
14 |         />
15 |         <path
16 |           d="M22.9215 4.54829H25.7917V15.8109H22.9215V14.1649C22.3248 15.3345 21.3301 16.1142 19.4262 16.1142C16.3855 16.1142 13.9557 13.4718 13.9557 10.223C13.9557 6.97409 16.3855 4.3317 19.4262 4.3317C21.316 4.3317 22.3248 5.11142 22.9215 6.28101V4.54829ZM23.0068 10.223C23.0068 8.46137 21.799 7.00298 19.8951 7.00298C18.0621 7.00298 16.8685 8.47575 16.8685 10.223C16.8685 11.9267 18.0621 13.4429 19.8951 13.4429C21.7849 13.4429 23.0068 11.9701 23.0068 10.223Z"
17 |           fill="currentColor"
18 |         />
19 |         <path d="M27.8235 0H30.6937V15.7966H27.8235V0Z" fill="currentColor" />
20 |         <path
21 |           d="M31.9725 14.3095C31.9725 13.3854 32.7114 12.6057 33.7202 12.6057C34.729 12.6057 35.4395 13.3854 35.4395 14.3095C35.4395 15.2625 34.7148 16.0422 33.7202 16.0422C32.7256 16.0422 31.9725 15.2625 31.9725 14.3095Z"
22 |           fill="currentColor"
23 |         />
24 |         <path
25 |           d="M46.4229 13.9916C45.3572 15.2911 43.7374 16.1142 41.8192 16.1142C38.3949 16.1142 35.8799 13.4718 35.8799 10.223C35.8799 6.97409 38.3949 4.3317 41.8192 4.3317C43.6663 4.3317 45.272 5.11142 46.3376 6.33876L44.1211 8.20143C43.5669 7.50835 42.8422 6.98853 41.8192 6.98853C39.9863 6.98853 38.7927 8.46137 38.7927 10.2085C38.7927 11.9556 39.9863 13.4285 41.8192 13.4285C42.9275 13.4285 43.6948 12.8509 44.2631 12.0712L46.4229 13.9916Z"
26 |           fill="currentColor"
27 |         />
28 |         <path
29 |           d="M46.6644 10.223C46.6644 6.97409 49.1793 4.3317 52.6037 4.3317C56.028 4.3317 58.5429 6.97409 58.5429 10.223C58.5429 13.4718 56.028 16.1142 52.6037 16.1142C49.1793 16.0997 46.6644 13.4718 46.6644 10.223ZM55.6302 10.223C55.6302 8.46137 54.4366 7.00298 52.6037 7.00298C50.7708 6.98853 49.5772 8.46137 49.5772 10.223C49.5772 11.9701 50.7708 13.4429 52.6037 13.4429C54.4366 13.4429 55.6302 11.9701 55.6302 10.223Z"
30 |           fill="currentColor"
31 |         />
32 |         <path
33 |           d="M77.952 8.9236V15.7967H75.0821V9.63111C75.0821 7.68182 74.1727 6.84434 72.8087 6.84434C71.5298 6.84434 70.6205 7.47967 70.6205 9.63111V15.7967H67.7504V9.63111C67.7504 7.68182 66.8267 6.84434 65.4769 6.84434C64.1981 6.84434 63.0756 7.47967 63.0756 9.63111V15.7967H60.2054V4.53405H63.0756V6.09349C63.6724 4.88059 64.7522 4.27414 66.4147 4.27414C67.9919 4.27414 69.3133 5.05386 70.0379 6.36784C70.7626 5.02498 71.8283 4.27414 73.7606 4.27414C76.1193 4.28858 77.952 6.07905 77.952 8.9236Z"
34 |           fill="currentColor"
35 |         />
36 |       </g>
37 |       <defs>
38 |         <clipPath id="clip0_1893_3733">
39 |           <rect
40 |             width="78.0455"
41 |             height="17"
42 |             fill="white"
43 |             transform="translate(0.5)"
44 |           />
45 |         </clipPath>
46 |       </defs>
47 |     </svg>
48 |   );
49 | };
```

packages/app-store/src/fortnox/assets/logo.tsx
```
1 | export const Logo = () => {
2 |   return (
3 |     <svg
4 |       width="78"
5 |       height="17"
6 |       viewBox="0 0 78 17"
7 |       fill="none"
8 |       xmlns="http://www.w3.org/2000/svg"
9 |     >
10 |       <g clipPath="url(#clip0_1893_3670)">
11 |         <path
12 |           d="M9.59554 1.10556H5.58402C2.792 1.10556 0.89856 2.99623 0.89856 5.78417V15.8143C0.89856 16.1027 1.05902 16.263 1.34785 16.263H3.57825C3.86708 16.263 4.02755 16.1027 4.02755 15.8143V11.6484H9.61158C9.90041 11.6484 10.0609 11.4882 10.0609 11.1998V9.06881C10.0609 8.7804 9.90041 8.62017 9.61158 8.62017H4.0115V5.70406C4.0115 4.77474 4.6373 4.14986 5.56797 4.14986H9.59554C9.88437 4.14986 10.0448 3.98964 10.0448 3.70123V1.5542C10.0448 1.26579 9.88437 1.10556 9.59554 1.10556Z"
13 |           fill="currentColor"
14 |         />
15 |         <path
16 |           d="M17.2816 3.78134C13.591 3.78134 10.9434 6.56928 10.9434 10.1423C10.9434 13.7154 13.6071 16.5033 17.2816 16.5033C20.9562 16.5033 23.6198 13.7154 23.6198 10.1423C23.6198 6.56928 20.9722 3.78134 17.2816 3.78134ZM17.2816 13.5071C15.3882 13.5071 13.9922 12.0971 13.9922 10.1423C13.9922 8.18756 15.3721 6.77757 17.2816 6.77757C19.1911 6.77757 20.5711 8.18756 20.5711 10.1423C20.5711 12.0971 19.1911 13.5071 17.2816 13.5071Z"
17 |           fill="currentColor"
18 |         />
19 |         <path
20 |           d="M38.8155 4.00566H35.0126V1.10556C35.0126 0.817155 34.8521 0.656929 34.5633 0.656929H32.3329C32.044 0.656929 31.8836 0.817155 31.8836 1.10556V4.00566H29.2039C26.4279 4.00566 24.5184 5.89633 24.5184 8.68426V15.8143C24.5184 16.1027 24.6789 16.263 24.9677 16.263H27.1981C27.487 16.263 27.6474 16.1027 27.6474 15.8143V8.58813C27.6474 7.65881 28.2732 7.03393 29.2039 7.03393H31.8836V11.5844C31.8836 14.3723 33.777 16.263 36.569 16.263H38.7994C39.0883 16.263 39.2487 16.1027 39.2487 15.8143V13.6833C39.2487 13.3949 39.0883 13.2347 38.7994 13.2347H36.5851C35.6544 13.2347 35.0286 12.6098 35.0286 11.6805V7.03393H38.8315C39.1204 7.03393 39.2808 6.87371 39.2808 6.5853V4.45429C39.2648 4.14986 39.1043 4.00566 38.8155 4.00566Z"
21 |           fill="currentColor"
22 |         />
23 |         <path
24 |           d="M45.7474 3.78134C42.3777 3.78134 40.1633 5.94439 40.1633 9.24505V15.8304C40.1633 16.1188 40.3238 16.279 40.6126 16.279H42.843C43.1319 16.279 43.2923 16.1188 43.2923 15.8304V9.24505C43.2923 7.75495 44.2711 6.79359 45.7474 6.80961C47.2236 6.79359 48.2024 7.73893 48.2024 9.24505V15.8304C48.2024 16.1188 48.3629 16.279 48.6517 16.279H50.8821C51.1709 16.279 51.3314 16.1188 51.3314 15.8304V9.24505C51.3314 5.94439 49.117 3.78134 45.7474 3.78134Z"
25 |           fill="currentColor"
26 |         />
27 |         <path
28 |           d="M58.5682 3.78134C54.8776 3.78134 52.23 6.56928 52.23 10.1423C52.23 13.7154 54.8936 16.5033 58.5682 16.5033C62.2588 16.5033 64.9064 13.7154 64.9064 10.1423C64.9064 6.56928 62.2427 3.78134 58.5682 3.78134ZM58.5682 13.5071C56.6747 13.5071 55.2787 12.0971 55.2787 10.1423C55.2787 8.18756 56.6587 6.77757 58.5682 6.77757C60.4616 6.77757 61.8576 8.18756 61.8576 10.1423C61.8576 12.0971 60.4616 13.5071 58.5682 13.5071Z"
29 |           fill="currentColor"
30 |         />
31 |         <path
32 |           d="M73.3306 10.1103L77.2779 6.16871C77.4865 5.96042 77.4865 5.75212 77.2779 5.54383L75.7215 3.98963C75.5129 3.78134 75.3043 3.78134 75.0957 3.98963L71.1483 7.9312L67.201 3.98963C66.9924 3.78134 66.7838 3.78134 66.5752 3.98963L65.0187 5.54383C64.8101 5.75212 64.8101 5.96042 65.0187 6.16871L68.9661 10.1103L64.9866 14.0518C64.7781 14.2601 64.7781 14.4684 64.9866 14.6767L66.5431 16.2309C66.7517 16.4392 66.9603 16.4392 67.1689 16.2309L71.1163 12.2894L75.0636 16.2309C75.2722 16.4392 75.4808 16.4392 75.6894 16.2309L77.2459 14.6767C77.4545 14.4684 77.4545 14.2601 77.2459 14.0518L73.3306 10.1103Z"
33 |           fill="currentColor"
34 |         />
35 |       </g>
36 |       <defs>
37 |         <clipPath id="clip0_1893_3670">
[TRUNCATED]
```

packages/app-store/src/quick-books/assets/logo.tsx
```
1 | export const Logo = () => {
2 |   return (
3 |     <svg
4 |       width="41"
5 |       height="40"
6 |       viewBox="0 0 41 40"
7 |       fill="none"
8 |       xmlns="http://www.w3.org/2000/svg"
9 |     >
10 |       <path
11 |         d="M20.5 40C31.5456 40 40.5 31.0456 40.5 20C40.5 8.95437 31.5456 0 20.5 0C9.45437 0 0.5 8.95437 0.5 20C0.5 31.0456 9.45437 40 20.5 40Z"
12 |         fill="#F5F5F3"
13 |       />
14 |       <path
15 |         d="M6.05585 20C6.05585 22.0628 6.8753 24.0411 8.33392 25.4998C9.79255 26.9584 11.7709 27.7778 13.8337 27.7778H14.9446V24.8888H13.8337C13.1884 24.8939 12.5484 24.7713 11.9507 24.5279C11.3531 24.2845 10.8095 23.9252 10.3513 23.4707C9.8932 23.0163 9.52957 22.4756 9.28142 21.8799C9.03328 21.2841 8.90552 20.6452 8.90552 19.9999C8.90552 19.3545 9.03328 18.7156 9.28142 18.1199C9.52957 17.5242 9.8932 16.9835 10.3513 16.529C10.8095 16.0745 11.3531 15.7152 11.9507 15.4718C12.5484 15.2284 13.1884 15.1058 13.8337 15.111H16.5002V30.2222C16.5005 30.9883 16.8049 31.723 17.3466 32.2647C17.8883 32.8064 18.6229 33.1109 19.389 33.1113V12.2222H13.8337C12.8122 12.2222 11.8008 12.4233 10.8571 12.8142C9.91345 13.205 9.05599 13.7779 8.33372 14.5002C7.61145 15.2224 7.03851 16.0798 6.64762 17.0235C6.25673 17.9672 6.05585 18.9786 6.05585 20ZM27.1668 12.2222H26.0559V15.1113H27.1668C28.4538 15.1258 29.6831 15.6473 30.5881 16.5625C31.493 17.4778 32.0006 18.7129 32.0006 20C32.0006 21.2871 31.493 22.5223 30.5881 23.4375C29.6831 24.3527 28.4538 24.8742 27.1668 24.8888H24.5002V9.77815C24.5003 9.39876 24.4256 9.02309 24.2804 8.67257C24.1353 8.32206 23.9225 8.00357 23.6542 7.73529C23.386 7.46701 23.0675 7.2542 22.717 7.10901C22.3665 6.96381 21.9909 6.88908 21.6115 6.88908V27.7781H27.1668C29.2296 27.7781 31.2079 26.9587 32.6665 25.5001C34.1252 24.0415 34.9446 22.0631 34.9446 20.0003C34.9446 17.9375 34.1252 15.9592 32.6665 14.5006C31.2079 13.042 29.2296 12.2222 27.1668 12.2222Z"
16 |         fill="#121212"
17 |       />
18 |     </svg>
19 |   );
20 | };
```

packages/app-store/src/raycast/assets/logo.tsx
```
1 | export const Logo = () => {
2 |   return (
3 |     <svg
4 |       width="95"
5 |       height="25"
6 |       viewBox="0 0 95 25"
7 |       fill="none"
8 |       xmlns="http://www.w3.org/2000/svg"
9 |     >
10 |       <path
[TRUNCATED]
```

packages/app-store/src/slack/assets/logo.tsx
```
1 | export const Logo = () => {
2 |   return (
3 |     <svg
4 |       width="40"
5 |       height="40"
6 |       viewBox="0 0 40 40"
7 |       fill="none"
8 |       xmlns="http://www.w3.org/2000/svg"
9 |     >
10 |       <path
11 |         d="M9.85313 24.6172C9.85251 25.3442 9.63636 26.0547 9.23199 26.6589C8.82763 27.2631 8.25322 27.7339 7.58136 28.0117C6.9095 28.2895 6.17036 28.3618 5.45739 28.2196C4.74441 28.0774 4.0896 27.727 3.57574 27.2127C3.06187 26.6984 2.71203 26.0433 2.57042 25.3302C2.42881 24.6171 2.5018 23.878 2.78016 23.2064C3.05852 22.5348 3.52976 21.9607 4.1343 21.5569C4.73884 21.153 5.44954 20.9375 6.17656 20.9375H9.85313V24.6172Z"
12 |         fill="currentColor"
13 |       />
14 |       <path
15 |         d="M11.7063 24.6172C11.7063 23.6421 12.0936 22.7069 12.7831 22.0175C13.4726 21.328 14.4078 20.9406 15.3829 20.9406C16.3579 20.9406 17.2931 21.328 17.9826 22.0175C18.6721 22.7069 19.0594 23.6421 19.0594 24.6172V33.8234C19.0594 34.7985 18.6721 35.7337 17.9826 36.4231C17.2931 37.1126 16.3579 37.5 15.3829 37.5C14.4078 37.5 13.4726 37.1126 12.7831 36.4231C12.0936 35.7337 11.7063 34.7985 11.7063 33.8234V24.6172Z"
16 |         fill="currentColor"
17 |       />
18 |       <path
19 |         d="M15.3829 9.85313C14.6559 9.85251 13.9454 9.63636 13.3412 9.23199C12.737 8.82763 12.2662 8.25322 11.9884 7.58136C11.7106 6.9095 11.6383 6.17036 11.7805 5.45739C11.9227 4.74441 12.2731 4.0896 12.7874 3.57574C13.3017 3.06187 13.9568 2.71203 14.6699 2.57042C15.383 2.42881 16.1221 2.5018 16.7937 2.78016C17.4653 3.05852 18.0394 3.52976 18.4432 4.1343C18.8471 4.73884 19.0626 5.44954 19.0626 6.17656V9.85313H15.3829Z"
20 |         fill="currentColor"
21 |       />
22 |       <path
23 |         d="M15.3828 11.7062C16.3579 11.7062 17.293 12.0936 17.9825 12.7831C18.672 13.4726 19.0594 14.4077 19.0594 15.3828C19.0594 16.3579 18.672 17.293 17.9825 17.9825C17.293 18.672 16.3579 19.0594 15.3828 19.0594H6.17656C5.20148 19.0594 4.26633 18.672 3.57684 17.9825C2.88735 17.293 2.5 16.3579 2.5 15.3828C2.5 14.4077 2.88735 13.4726 3.57684 12.7831C4.26633 12.0936 5.20148 11.7062 6.17656 11.7062H15.3828Z"
24 |         fill="currentColor"
25 |       />
26 |       <path
27 |         d="M30.147 15.3828C30.1476 14.6558 30.3637 13.9453 30.7681 13.3411C31.1725 12.7369 31.7469 12.2661 32.4187 11.9883C33.0906 11.7106 33.8297 11.6382 34.5427 11.7804C35.2557 11.9226 35.9105 12.273 36.4244 12.7873C36.9382 13.3016 37.2881 13.9567 37.4297 14.6698C37.5713 15.3829 37.4983 16.122 37.2199 16.7936C36.9416 17.4652 36.4703 18.0393 35.8658 18.4431C35.2613 18.847 34.5506 19.0625 33.8235 19.0625H30.147V15.3828Z"
28 |         fill="currentColor"
29 |       />
30 |       <path
31 |         d="M28.2938 15.3828C28.2938 16.3579 27.9064 17.293 27.217 17.9825C26.5275 18.672 25.5923 19.0594 24.6172 19.0594C23.6422 19.0594 22.707 18.672 22.0175 17.9825C21.328 17.293 20.9407 16.3579 20.9407 15.3828V6.17656C20.9407 5.20148 21.328 4.26633 22.0175 3.57684C22.707 2.88735 23.6422 2.5 24.6172 2.5C25.5923 2.5 26.5275 2.88735 27.217 3.57684C27.9064 4.26633 28.2938 5.20148 28.2938 6.17656V15.3828Z"
32 |         fill="currentColor"
33 |       />
34 |       <path
35 |         d="M24.6172 30.1469C25.3442 30.1475 26.0547 30.3637 26.6589 30.768C27.2631 31.1724 27.7339 31.7468 28.0117 32.4186C28.2895 33.0905 28.3618 33.8296 28.2196 34.5426C28.0774 35.2556 27.727 35.9104 27.2127 36.4243C26.6984 36.9381 26.0433 37.288 25.3302 37.4296C24.6171 37.5712 23.878 37.4982 23.2064 37.2198C22.5348 36.9415 21.9607 36.4702 21.5569 35.8657C21.153 35.2612 20.9375 34.5505 20.9375 33.8234V30.1469H24.6172Z"
36 |         fill="currentColor"
37 |       />
38 |       <path
[TRUNCATED]
```

packages/app-store/src/slack/lib/client.ts
```
1 | import { LogLevel, App as SlackApp } from "@slack/bolt";
2 | import { InstallProvider } from "@slack/oauth";
3 | import { WebClient } from "@slack/web-api";
4 |
5 | const SLACK_CLIENT_ID = process.env.NEXT_PUBLIC_SLACK_CLIENT_ID;
6 | const SLACK_CLIENT_SECRET = process.env.SLACK_CLIENT_SECRET;
7 | const SLACK_OAUTH_REDIRECT_URL =
8 |   process.env.NEXT_PUBLIC_SLACK_OAUTH_REDIRECT_URL;
9 | const SLACK_STATE_SECRET = process.env.NEXT_PUBLIC_SLACK_STATE_SECRET;
10 | const SLACK_SIGNING_SECRET = process.env.SLACK_SIGNING_SECRET;
11 |
12 | export const slackInstaller = new InstallProvider({
13 |   clientId: SLACK_CLIENT_ID!,
14 |   clientSecret: SLACK_CLIENT_SECRET!,
15 |   stateSecret: SLACK_STATE_SECRET,
16 |   logLevel: process.env.NODE_ENV === "development" ? LogLevel.DEBUG : undefined,
17 | });
18 |
19 | export const createSlackApp = ({
20 |   token,
21 |   botId,
22 | }: { token: string; botId: string }) => {
23 |   return new SlackApp({
24 |     signingSecret: SLACK_SIGNING_SECRET,
25 |     token,
26 |     botId,
27 |   });
28 | };
29 |
30 | export const createSlackWebClient = ({
31 |   token,
32 | }: {
33 |   token: string;
34 | }) => {
35 |   return new WebClient(token);
36 | };
37 |
38 | export const getInstallUrl = ({
39 |   teamId,
40 |   userId,
41 | }: { teamId: string; userId: string }) => {
42 |   return slackInstaller.generateInstallUrl({
43 |     scopes: [
44 |       "incoming-webhook",
45 |       "chat:write",
46 |       "chat:write.public",
47 |       "team:read",
48 |       "assistant:write",
49 |       "im:history",
50 |       "commands",
51 |       "files:read",
52 |     ],
53 |     redirectUri: SLACK_OAUTH_REDIRECT_URL,
54 |     metadata: JSON.stringify({ teamId, userId }),
55 |   });
56 | };
57 |
58 | export const downloadFile = async ({
59 |   privateDownloadUrl,
60 |   token,
61 | }: { privateDownloadUrl: string; token: string }) => {
62 |   const response = await fetch(privateDownloadUrl, {
63 |     method: "GET",
64 |     headers: {
65 |       Authorization: `Bearer ${token}`,
66 |     },
67 |   });
68 |
69 |   return response.arrayBuffer();
70 | };
```

packages/app-store/src/slack/lib/index.ts
```
1 | export * from "./client";
2 | export * from "./events";
3 | export * from "./verify";
4 | export * from "./notifications";
```

packages/app-store/src/slack/lib/verify.ts
```
1 | import { createHmac } from "node:crypto";
2 |
3 | export async function verifySlackWebhook(req: Request) {
4 |   const SLACK_SIGNING_SECRET = process.env.SLACK_SIGNING_SECRET;
5 |
6 |   if (!SLACK_SIGNING_SECRET) {
7 |     throw new Error("SLACK_SIGNING_SECRET is not set");
8 |   }
9 |
10 |   const fiveMinutesInSeconds = 5 * 60;
11 |   const slackSignatureVersion = "v0";
12 |
13 |   const body = await req.text();
14 |   const timestamp = req.headers.get("x-slack-request-timestamp");
15 |   const slackSignature = req.headers.get("x-slack-signature");
16 |
17 |   if (!timestamp || !slackSignature) {
18 |     throw new Error("Missing required Slack headers");
19 |   }
20 |
21 |   const currentTime = Math.floor(Date.now() / 1000);
22 |   if (
23 |     Math.abs(currentTime - Number.parseInt(timestamp)) > fiveMinutesInSeconds
24 |   ) {
25 |     throw new Error("Request is too old");
26 |   }
27 |
28 |   const sigBasestring = `${slackSignatureVersion}:${timestamp}:${body}`;
29 |   const mySignature = createHmac("sha256", SLACK_SIGNING_SECRET)
30 |     .update(sigBasestring)
31 |     .digest("hex");
32 |
33 |   if (`${slackSignatureVersion}=${mySignature}` !== slackSignature) {
34 |     throw new Error("Invalid Slack signature");
35 |   }
36 |
37 |   return JSON.parse(body);
38 | }
```

packages/app-store/src/visma/assets/logo.tsx
```
1 | export const Logo = () => {
2 |   return (
3 |     <svg
4 |       width="92"
5 |       height="17"
6 |       viewBox="0 0 92 17"
7 |       fill="none"
8 |       xmlns="http://www.w3.org/2000/svg"
9 |     >
10 |       <g clipPath="url(#clip0_1893_3698)">
11 |         <path
12 |           d="M9.37462 0C14.3437 0.421606 19.8265 2.94144 22.9523 6.53C26.9566 11.1147 25.58 15.7034 19.8736 16.774C14.1672 17.8467 6.29591 14.9974 2.29163 10.4088C-0.771384 6.89866 -0.685102 3.38854 2.07985 1.45111L17.944 13.1678L9.37462 0Z"
13 |           fill="currentColor"
14 |         />
15 |         <path
16 |           fillRule="evenodd"
17 |           clipRule="evenodd"
18 |           d="M83.7518 0.0372314L79.124 16.7249H82.5752L84.5951 8.7635C84.8501 7.80263 84.9284 6.84191 85.1049 5.88104H85.144C85.3401 6.83407 85.4576 7.78486 85.7518 8.73592L87.735 16.7249H91.2624L86.4381 0.0372314H83.7518ZM87.735 16.7249H87.7127L87.7403 16.7468L87.735 16.7249ZM35.069 0.0586794L35.0694 0.0609777H35.071L35.069 0.0586794ZM35.0694 0.0609777H31.5294L36.3536 16.7487H39.0538L43.6777 0.0648074H40.2265L38.2142 8.02623C37.9475 9.00278 37.8809 9.954 37.7045 10.9286H37.6593C37.4612 9.97557 37.3496 9.0244 37.0633 8.07334L35.0694 0.0609777ZM46.1561 0.0586794V16.7468H49.4564V0.0586794H46.1561ZM57.63 0.0586794C57.612 0.0713512 57.5953 0.0867908 57.5776 0.100044H57.63V0.0586794ZM57.5776 0.100044H53.6844C53.6844 0.100044 53.4002 0.629656 53.2669 0.943409C51.8942 4.25743 53.1885 6.68886 54.4435 9.02241C55.4847 10.9638 56.561 12.9836 55.6492 15.1799C55.3785 15.827 54.8884 16.3957 54.4373 16.7487H58.4083C58.4083 16.7487 58.6281 16.3172 58.7262 16.0819C60.0537 12.8777 59.3477 10.6282 57.5691 7.57697C57.4534 7.36715 57.3298 7.15551 57.2122 6.94961C56.3945 5.53968 55.4727 3.94161 56.3355 1.86299C56.6203 1.17561 57.0353 0.505181 57.5776 0.100044ZM68.0955 0.0586794L68.099 0.0805104H68.1269L68.0955 0.0586794ZM68.099 0.0805104H63.7737L62.303 16.7682H65.8523L66.323 4.74736H66.3659V5.06142L66.9189 8.76733L68.5367 16.7487H71.0783L72.4977 8.84585L73.0274 4.74736H73.0726L73.8704 16.7487H77.2553L75.5058 0.0609775H71.0783L69.7524 9.90867H69.7095L68.099 0.0805104Z"
19 |           fill="currentColor"
20 |         />
21 |       </g>
22 |       <defs>
23 |         <clipPath id="clip0_1893_3698">
24 |           <rect width="91.2624" height="17" fill="currentColor" />
25 |         </clipPath>
26 |       </defs>
27 |     </svg>
28 |   );
29 | };
```

packages/app-store/src/xero/assets/logo.tsx
```
1 | export const Logo = () => {
2 |   return (
3 |     <svg
4 |       width="40"
5 |       height="40"
6 |       viewBox="0 0 40 40"
7 |       fill="none"
8 |       xmlns="http://www.w3.org/2000/svg"
9 |     >
10 |       <g clipPath="url(#clip0_1893_3614)">
11 |         <mask
12 |           id="mask0_1893_3614"
13 |           maskUnits="userSpaceOnUse"
14 |           x="-9"
15 |           y="-9"
16 |           width="58"
17 |           height="58"
18 |         >
19 |           <path
20 |             d="M-8.80334 -8.84987H48.8393V48.7927H-8.80334V-8.84987Z"
21 |             fill="white"
22 |           />
23 |         </mask>
24 |         <g mask="url(#mask0_1893_3614)">
25 |           <path
26 |             d="M20.0001 39.9237C31.0037 39.9237 39.9238 31.0037 39.9238 20C39.9238 8.99641 31.0037 0.0762529 20.0001 0.0762529C8.99645 0.0762529 0.0762939 8.99641 0.0762939 20C0.0762939 31.0037 8.99645 39.9237 20.0001 39.9237Z"
27 |             fill="#F5F5F3"
28 |           />
29 |           <path
30 |             d="M9.61353 19.9424L13.0137 16.5339C13.1264 16.419 13.1893 16.2669 13.1893 16.1055C13.1893 15.7693 12.916 15.4963 12.5798 15.4963C12.416 15.4963 12.2625 15.5605 12.1467 15.6777C12.1464 15.6784 8.74963 19.0732 8.74963 19.0732L5.33735 15.6726C5.22205 15.5589 5.06927 15.4963 4.90727 15.4963C4.57147 15.4963 4.2981 15.7692 4.2981 16.1051C4.2981 16.2689 4.36351 16.4226 4.48091 16.5385L7.88058 19.9377L4.48267 23.342C4.36324 23.4596 4.2981 23.6136 4.2981 23.7782C4.2981 24.1143 4.57147 24.387 4.90727 24.387C5.06954 24.387 5.22246 24.3241 5.33735 24.2091L8.74435 20.8067L12.1384 24.1967C12.2588 24.3212 12.4141 24.3874 12.5798 24.3874C12.9157 24.3874 13.189 24.1143 13.189 23.7782C13.189 23.616 13.1261 23.4636 13.0118 23.3487L9.61353 19.9424Z"
31 |             fill="#121212"
32 |           />
33 |           <path
34 |             d="M29.8268 19.9414C29.8268 20.5519 30.3232 21.0484 30.9344 21.0484C31.5441 21.0484 32.0407 20.5519 32.0407 19.9414C32.0407 19.3308 31.5441 18.8343 30.9344 18.8343C30.3232 18.8343 29.8268 19.3308 29.8268 19.9414Z"
35 |             fill="#121212"
36 |           />
37 |           <path
38 |             d="M27.7271 19.9419C27.7271 18.1741 29.1652 16.7358 30.9332 16.7358C32.7003 16.7358 34.1388 18.1741 34.1388 19.9419C34.1388 21.7093 32.7003 23.1471 30.9332 23.1471C29.1652 23.1471 27.7271 21.7093 27.7271 19.9419ZM26.4659 19.9419C26.4659 22.4048 28.47 24.4085 30.9332 24.4085C33.3964 24.4085 35.4014 22.4048 35.4014 19.9419C35.4014 17.4788 33.3964 15.4745 30.9332 15.4745C28.47 15.4745 26.4659 17.4788 26.4659 19.9419Z"
39 |             fill="#121212"
40 |           />
41 |           <path
42 |             d="M26.1489 15.5509L25.9614 15.5503C25.3988 15.5503 24.8561 15.7278 24.4028 16.0771C24.3431 15.8038 24.0988 15.5981 23.8078 15.5981C23.4729 15.5981 23.2045 15.8665 23.2037 16.2021C23.2037 16.2033 23.2058 23.726 23.2058 23.726C23.2066 24.061 23.4799 24.3333 23.815 24.3333C24.1501 24.3333 24.4232 24.061 24.4241 23.7253C24.4241 23.7238 24.4244 19.099 24.4244 19.099C24.4244 17.5571 24.5654 16.9343 25.8862 16.7693C26.0083 16.7541 26.1411 16.7565 26.1416 16.7565C26.503 16.7441 26.7599 16.4957 26.7599 16.16C26.7599 15.8242 26.4857 15.5509 26.1489 15.5509Z"
43 |             fill="#121212"
44 |           />
45 |           <path
[TRUNCATED]
```

packages/app-store/src/zapier/assets/logo.tsx
```
1 | export const Logo = () => {
2 |   return (
3 |     <svg
4 |       width="79"
5 |       height="22"
6 |       viewBox="0 0 79 22"
7 |       fill="none"
8 |       xmlns="http://www.w3.org/2000/svg"
9 |     >
10 |       <path
[TRUNCATED]
```

packages/documents/src/processors/expense/expense-processor.ts
```
1 | import {
2 |   type AnalyzeResultOperationOutput,
3 |   getLongRunningPoller,
4 |   isUnexpected,
5 | } from "@azure-rest/ai-document-intelligence";
6 | import { capitalCase } from "change-case";
7 | import type { Processor } from "../../interface";
8 | import { client } from "../../provider/azure";
9 | import type { GetDocumentRequest } from "../../types";
10 | import {
11 |   extractRootDomain,
12 |   getCurrency,
13 |   getDomainFromEmail,
14 | } from "../../utils";
15 | import { LlmProcessor } from "../llm/llm-processor";
16 |
17 | export class ExpenseProcessor implements Processor {
18 |   async #processDocument(content: string) {
19 |     const initialResponse = await client
20 |       .path("/documentModels/{modelId}:analyze", "prebuilt-receipt")
21 |       .post({
22 |         contentType: "application/json",
23 |         body: {
24 |           base64Source: content,
25 |         },
26 |         queryParameters: {
27 |           features: ["queryFields"],
28 |           queryFields: ["Email", "Website"],
29 |         },
30 |       });
31 |
32 |     if (isUnexpected(initialResponse)) {
33 |       throw initialResponse.body.error;
34 |     }
35 |     const poller = await getLongRunningPoller(client, initialResponse);
36 |     const result = (await poller.pollUntilDone())
37 |       .body as AnalyzeResultOperationOutput;
38 |
39 |     return this.#extractData(result);
40 |   }
41 |
42 |   #getWebsiteFromFields(
43 |     fields?: Record<string, { valueString?: string }>,
44 |     content?: string,
45 |   ) {
46 |     const website =
47 |       // First try to get the email domain
48 |       getDomainFromEmail(fields?.Email?.valueString) ||
49 |       fields?.Website?.valueString ||
50 |       // Then try to get the website from the content
51 |       extractRootDomain(content) ||
52 |       null;
53 |
54 |     return website;
55 |   }
56 |
57 |   async #extractData(data: AnalyzeResultOperationOutput) {
58 |     const fields = data.analyzeResult?.documents?.[0]?.fields;
59 |     const content = data.analyzeResult?.content;
60 |
61 |     const website = this.#getWebsiteFromFields(fields, content);
62 |
63 |     const result = {
64 |       name:
65 |         (fields?.MerchantName?.valueString &&
66 |           capitalCase(fields?.MerchantName?.valueString)) ??
67 |         null,
68 |       date: fields?.TransactionDate?.valueDate || null,
69 |       currency: getCurrency(fields?.Total),
70 |       amount: fields?.Total?.valueCurrency?.amount ?? null,
71 |       type: "expense",
72 |       website,
73 |     };
74 |
75 |     // Return if all values are not null
76 |     if (Object.values(result).every((value) => value !== null)) {
77 |       return result;
78 |     }
79 |
80 |     const fallback = content ? await this.#fallbackToLlm(content) : null;
81 |
82 |     // Only replace null values from LLM
83 |     const mappedResult = Object.fromEntries(
84 |       Object.entries(result).map(([key, value]) => [
85 |         key,
86 |         value ?? fallback?.[key as keyof typeof result] ?? null,
87 |       ]),
88 |     );
89 |
90 |     return {
91 |       ...mappedResult,
92 |       // We only have description from LLM
93 |       description: fallback?.description ?? null,
94 |     };
95 |   }
96 |
97 |   async #fallbackToLlm(content: string) {
98 |     const llm = new LlmProcessor();
99 |     const fallbackData = await llm.getStructuredData(content);
100 |     return { ...fallbackData, type: "expense" };
101 |   }
102 |
103 |   public async getDocument(params: GetDocumentRequest) {
104 |     return this.#processDocument(params.content);
105 |   }
106 | }
```

packages/documents/src/processors/invoice/invoice-processor.ts
```
1 | import {
2 |   type AnalyzeResultOperationOutput,
3 |   getLongRunningPoller,
4 |   isUnexpected,
5 | } from "@azure-rest/ai-document-intelligence";
6 | import { capitalCase } from "change-case";
7 | import type { Processor } from "../../interface";
8 | import { client } from "../../provider/azure";
9 | import type { GetDocumentRequest } from "../../types";
10 | import {
11 |   extractRootDomain,
12 |   getCurrency,
13 |   getDomainFromEmail,
14 | } from "../../utils";
15 | import { LlmProcessor } from "../llm/llm-processor";
16 |
17 | export class InvoiceProcessor implements Processor {
18 |   async #processDocument(content: string) {
19 |     const initialResponse = await client
20 |       .path("/documentModels/{modelId}:analyze", "prebuilt-invoice")
21 |       .post({
22 |         contentType: "application/json",
23 |         body: {
24 |           base64Source: content,
25 |         },
26 |         queryParameters: {
27 |           features: ["queryFields"],
28 |           queryFields: ["VendorEmail", "CustomerEmail"],
29 |           split: "none",
30 |         },
31 |       });
32 |
33 |     if (isUnexpected(initialResponse)) {
34 |       throw initialResponse.body.error;
35 |     }
36 |
37 |     const poller = await getLongRunningPoller(client, initialResponse);
38 |     const result = (await poller.pollUntilDone())
39 |       .body as AnalyzeResultOperationOutput;
40 |
41 |     return this.#extractData(result);
42 |   }
43 |
44 |   #getWebsiteFromFields(
45 |     fields?: Record<string, { valueString?: string }>,
46 |     content?: string,
47 |   ) {
48 |     const website =
49 |       // First try to get the email domain
50 |       getDomainFromEmail(fields?.VendorEmail?.valueString) ||
51 |       fields?.Website?.valueString ||
52 |       // Then try to get the website from the content
53 |       extractRootDomain(content) ||
54 |       null;
55 |
56 |     return website;
57 |   }
58 |
59 |   async #extractData(data: AnalyzeResultOperationOutput) {
60 |     const fields = data.analyzeResult?.documents?.[0]?.fields;
61 |     const content = data.analyzeResult?.content;
62 |
63 |     const website = this.#getWebsiteFromFields(fields, content);
64 |
65 |     const result = {
66 |       name:
67 |         (fields?.VendorName?.valueString &&
68 |           capitalCase(fields?.VendorName?.valueString)) ??
69 |         null,
70 |       date:
71 |         fields?.DueDate?.valueDate || fields?.InvoiceDate?.valueDate || null,
72 |       currency: getCurrency(fields?.InvoiceTotal),
73 |       amount: fields?.InvoiceTotal?.valueCurrency?.amount ?? null,
74 |       type: "invoice",
75 |       website,
76 |     };
77 |
78 |     // Return if all values are not null
79 |     if (Object.values(result).every((value) => value !== null)) {
80 |       return result;
81 |     }
82 |
83 |     const fallback = content ? await this.#fallbackToLlm(content) : null;
84 |
85 |     // Only replace null values from LLM
86 |     const mappedResult = Object.fromEntries(
87 |       Object.entries(result).map(([key, value]) => [
88 |         key,
89 |         value ?? fallback?.[key as keyof typeof result] ?? null,
90 |       ]),
91 |     );
92 |
93 |     return {
94 |       ...mappedResult,
95 |       // We only have description from LLM
96 |       description: fallback?.description ?? null,
97 |     };
98 |   }
99 |
100 |   async #fallbackToLlm(content: string) {
101 |     const llm = new LlmProcessor();
102 |     const fallbackData = await llm.getStructuredData(content);
103 |     return { ...fallbackData, type: "invoice" };
104 |   }
105 |
106 |   public async getDocument(params: GetDocumentRequest) {
107 |     return this.#processDocument(params.content);
108 |   }
109 | }
```

packages/documents/src/processors/layout/index.ts
```
1 | import {
2 |   type AnalyzeResultOperationOutput,
3 |   getLongRunningPoller,
4 |   isUnexpected,
5 | } from "@azure-rest/ai-document-intelligence";
6 | import { client } from "../../provider/azure";
7 | import type { GetDocumentRequest } from "../../types";
8 |
9 | export class LayoutProcessor {
10 |   async #processDocument(content: string) {
11 |     const initialResponse = await client
12 |       .path("/documentModels/{modelId}:analyze", "prebuilt-layout")
13 |       .post({
14 |         contentType: "application/json",
15 |         body: {
16 |           base64Source: content,
17 |         },
18 |       });
19 |
20 |     if (isUnexpected(initialResponse)) {
21 |       throw initialResponse.body.error;
22 |     }
23 |     const poller = await getLongRunningPoller(client, initialResponse);
24 |     const result = (await poller.pollUntilDone())
25 |       .body as AnalyzeResultOperationOutput;
26 |
27 |     return this.#extractData(result);
28 |   }
29 |
30 |   async #extractData(data: AnalyzeResultOperationOutput) {
31 |     const tables = data.analyzeResult?.tables;
32 |
33 |     const firstTable = tables?.at(0);
34 |
35 |     if (!firstTable?.cells?.length) return null;
36 |
37 |     const cellsByRow = firstTable.cells.reduce(
38 |       (acc, cell) => {
39 |         const rowIndex = cell.rowIndex ?? 0;
40 |
41 |         if (!acc[rowIndex]) acc[rowIndex] = [];
42 |
43 |         acc[rowIndex].push({
44 |           columnIndex: cell.columnIndex ?? 0,
45 |           content: cell.content ?? "",
46 |         });
47 |         return acc;
48 |       },
49 |       {} as Record<number, { columnIndex: number; content: string }[]>,
50 |     );
51 |
52 |     return Object.entries(cellsByRow)
53 |       .sort(([a], [b]) => Number(a) - Number(b))
54 |       .map(([rowIndex, cells]) => ({
55 |         rowIndex: Number(rowIndex),
56 |         cells: cells
57 |           .sort((a, b) => a.columnIndex - b.columnIndex)
58 |           .map((cell) => ({
59 |             columnIndex: cell.columnIndex,
60 |             content: cell.content,
61 |           })),
62 |       }));
63 |   }
64 |
65 |   public async getDocument(params: GetDocumentRequest) {
66 |     return this.#processDocument(params.content);
67 |   }
68 | }
```

packages/documents/src/processors/llm/llm-processor.ts
```
1 | import { openai } from "@ai-sdk/openai";
2 | import { generateObject } from "ai";
3 | import { z } from "zod";
4 |
5 | const schema = z.object({
6 |   name: z.string().describe("The supplier or company of the invoice."),
7 |   amount: z
8 |     .number()
9 |     .describe("The total amount of the invoice, usually the highest amount."),
10 |   date: z
11 |     .string()
12 |     .describe("The due date of the invoice (ISO 8601 date string)."),
13 |   website: z
14 |     .string()
15 |     .describe(
16 |       "Website of the supplier or company without protocol (e.g. example.com) and only return if it's not null otherwise get the domain namn from the supplier name.",
17 |     ),
18 |   currency: z.string().describe("Currency code of the invoice."),
19 |   description: z
20 |     .string()
21 |     .describe(
22 |       "Summarize the purchase details by focusing on the supplier name and the content of the purchase. Max 1 sentence. Ignore amounts.",
23 |     ),
24 | });
25 |
26 | export class LlmProcessor {
27 |   public async getStructuredData(content: string) {
28 |     try {
29 |       const { object } = await generateObject({
30 |         model: openai("gpt-4o-mini"),
31 |         mode: "json",
32 |         schema,
33 |         prompt: content,
34 |       });
35 |
36 |       return {
37 |         name: object.name,
38 |         amount: object.amount,
39 |         date: object.date,
40 |         website: object.website?.replace(/^https?:\/\//, ""),
41 |         currency: object.currency,
42 |         description: object.description,
43 |       };
44 |     } catch (error) {
45 |       return null;
46 |     }
47 |   }
48 | }
```

packages/invoice/src/templates/html/format.tsx
```
1 | import type { EditorDoc } from "../types";
2 |
3 | export function formatEditorContent(doc?: EditorDoc): JSX.Element | null {
4 |   if (!doc || !doc.content) {
5 |     return null;
6 |   }
7 |
8 |   return (
9 |     <>
10 |       {doc.content.map((node, nodeIndex) => {
11 |         if (node.type === "paragraph") {
12 |           return (
13 |             <p key={`paragraph-${nodeIndex.toString()}`}>
14 |               {node.content?.map((inlineContent, inlineIndex) => {
15 |                 if (inlineContent.type === "text") {
16 |                   let style = "text-[11px]";
17 |                   let href: string | undefined;
18 |
19 |                   if (inlineContent.marks) {
20 |                     for (const mark of inlineContent.marks) {
21 |                       if (mark.type === "bold") {
22 |                         style += " font-semibold";
23 |                       } else if (mark.type === "italic") {
24 |                         style += " italic";
25 |                       } else if (mark.type === "link") {
26 |                         href = mark.attrs?.href;
27 |                         style += " underline";
28 |                       } else if (mark.type === "strike") {
29 |                         style += " line-through";
30 |                       }
31 |                     }
32 |                   }
33 |
34 |                   const content = inlineContent.text || "";
35 |                   const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(content);
36 |
37 |                   if (href || isEmail) {
38 |                     const linkHref =
39 |                       href || (isEmail ? `mailto:${content}` : content);
40 |                     return (
41 |                       <a
42 |                         key={`link-${nodeIndex}-${inlineIndex.toString()}`}
43 |                         href={linkHref}
44 |                         className={`${style} underline`}
45 |                       >
46 |                         {content}
47 |                       </a>
48 |                     );
49 |                   }
50 |
51 |                   return (
52 |                     <span
53 |                       key={`text-${nodeIndex}-${inlineIndex.toString()}`}
54 |                       className={style}
55 |                     >
56 |                       {content}
57 |                     </span>
58 |                   );
59 |                 }
60 |
61 |                 if (inlineContent.type === "hardBreak") {
62 |                   return (
63 |                     <br key={`break-${nodeIndex}-${inlineIndex.toString()}`} />
64 |                   );
65 |                 }
66 |                 return null;
67 |               })}
68 |             </p>
69 |           );
70 |         }
71 |
72 |         return null;
73 |       })}
74 |     </>
75 |   );
76 | }
```

packages/invoice/src/templates/html/index.tsx
```
1 | import { ScrollArea } from "@midday/ui/scroll-area";
2 | import type { TemplateProps } from "../types";
3 | import { EditorContent } from "./components/editor-content";
4 | import { LineItems } from "./components/line-items";
5 | import { Logo } from "./components/logo";
6 | import { Meta } from "./components/meta";
7 | import { Summary } from "./components/summary";
8 |
9 | export function HtmlTemplate({
10 |   invoice_number,
11 |   issue_date,
12 |   due_date,
13 |   template,
14 |   line_items,
15 |   customer_details,
16 |   from_details,
17 |   payment_details,
18 |   note_details,
19 |   currency,
20 |   discount,
21 |   customer_name,
22 |   width,
23 |   height,
24 |   top_block,
25 |   bottom_block,
26 | }: TemplateProps) {
27 |   return (
28 |     <ScrollArea
29 |       className="bg-background border border-border w-full md:w-auto h-full [&>div]:h-full"
30 |       style={{
31 |         width: "100%",
32 |         maxWidth: width,
33 |         height,
34 |       }}
35 |       hideScrollbar
36 |     >
37 |       <div
38 |         className="p-4 sm:p-6 md:p-8 h-full flex flex-col"
39 |         style={{ minHeight: height - 5 }}
40 |       >
41 |         <div className="flex justify-between">
42 |           <Meta
43 |             template={template}
44 |             invoiceNumber={invoice_number}
45 |             issueDate={issue_date}
46 |             dueDate={due_date}
47 |             timezone={template.timezone}
48 |           />
49 |
50 |           {template.logo_url && (
51 |             <Logo logo={template.logo_url} customerName={customer_name || ""} />
52 |           )}
53 |         </div>
54 |
55 |         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mt-6 mb-4">
56 |           <div>
57 |             <p className="text-[11px] text-[#878787] font-mono mb-2 block">
58 |               {template.from_label}
59 |             </p>
60 |             <EditorContent content={from_details} />
61 |           </div>
62 |           <div className="mt-4 md:mt-0">
63 |             <p className="text-[11px] text-[#878787] font-mono mb-2 block">
64 |               {template.customer_label}
65 |             </p>
66 |             <EditorContent content={customer_details} />
67 |           </div>
68 |         </div>
69 |
70 |         <EditorContent content={top_block} />
71 |
72 |         <LineItems
73 |           lineItems={line_items}
74 |           currency={currency}
75 |           descriptionLabel={template.description_label}
76 |           quantityLabel={template.quantity_label}
77 |           priceLabel={template.price_label}
78 |           totalLabel={template.total_label}
79 |           includeDecimals={template.include_decimals}
80 |           locale={template.locale}
81 |           includeUnits={template.include_units}
82 |         />
83 |
84 |         <div className="mt-10 md:mt-12 flex justify-end mb-6 md:mb-8">
85 |           <Summary
86 |             includeVAT={template.include_vat}
87 |             includeTax={template.include_tax}
88 |             taxRate={template.tax_rate}
89 |             vatRate={template.vat_rate}
90 |             currency={currency}
91 |             vatLabel={template.vat_label}
92 |             taxLabel={template.tax_label}
93 |             totalLabel={template.total_summary_label}
94 |             lineItems={line_items}
95 |             includeDiscount={template.include_discount}
96 |             discountLabel={template.discount_label}
97 |             discount={discount}
98 |             locale={template.locale}
99 |             includeDecimals={template.include_decimals}
100 |             subtotalLabel={template.subtotal_label}
101 |           />
102 |         </div>
103 |
104 |         <div className="flex flex-col space-y-6 md:space-y-8 mt-auto">
105 |           <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
106 |             <div>
107 |               <p className="text-[11px] text-[#878787] font-mono mb-2 block">
108 |                 {template.payment_label}
109 |               </p>
110 |               <EditorContent content={payment_details} />
111 |             </div>
112 |             {note_details && (
113 |               <div className="mt-4 md:mt-0">
114 |                 <p className="text-[11px] text-[#878787] font-mono mb-2 block">
115 |                   {template.note_label}
116 |                 </p>
117 |                 <EditorContent content={note_details} />
118 |               </div>
119 |             )}
120 |           </div>
121 |
122 |           <EditorContent content={bottom_block} />
123 |         </div>
124 |       </div>
125 |     </ScrollArea>
126 |   );
127 | }
```

packages/invoice/src/templates/og/format.tsx
```
1 | import type { EditorDoc } from "../types";
2 |
3 | export function formatEditorContent(doc?: EditorDoc): JSX.Element | null {
4 |   if (!doc || !doc.content) {
5 |     return null;
6 |   }
7 |
8 |   return (
9 |     <div tw="flex flex-col text-white">
10 |       {doc.content.map((node, nodeIndex) => {
11 |         if (node.type === "paragraph") {
12 |           return (
13 |             <p
14 |               key={`paragraph-${nodeIndex.toString()}`}
15 |               tw="flex flex-col mb-0"
16 |             >
17 |               {node.content?.map((inlineContent, inlineIndex) => {
18 |                 if (inlineContent.type === "text") {
19 |                   let style = "text-[22px]";
20 |
21 |                   if (inlineContent.marks) {
22 |                     for (const mark of inlineContent.marks) {
23 |                       if (mark.type === "bold") {
24 |                         style += " font-medium";
25 |                       } else if (mark.type === "italic") {
26 |                         style += " italic";
27 |                       }
28 |                     }
29 |                   }
30 |
31 |                   if (inlineContent.text) {
32 |                     return (
33 |                       <span
34 |                         key={`text-${nodeIndex}-${inlineIndex.toString()}`}
35 |                         tw={style}
36 |                       >
37 |                         {inlineContent.text}
38 |                       </span>
39 |                     );
40 |                   }
41 |                 }
42 |
43 |                 if (inlineContent.type === "hardBreak") {
44 |                   return (
45 |                     <br key={`break-${nodeIndex}-${inlineIndex.toString()}`} />
46 |                   );
47 |                 }
48 |
49 |                 return null;
50 |               })}
51 |             </p>
52 |           );
53 |         }
54 |
55 |         return null;
56 |       })}
57 |     </div>
58 |   );
59 | }
```

packages/invoice/src/templates/og/index.tsx
```
1 | import type { TemplateProps } from "../types";
2 | import { EditorContent } from "./components/editor-content";
3 | import { Header } from "./components/header";
4 | import { Logo } from "./components/logo";
5 | import { Meta } from "./components/meta";
6 |
7 | type Props = TemplateProps & {
8 |   isValidLogo: boolean;
9 |   name: string;
10 |   logoUrl: string;
11 |   status: "draft" | "overdue" | "paid" | "unpaid" | "canceled";
12 | };
13 |
14 | export function OgTemplate({
15 |   invoice_number,
16 |   issue_date,
17 |   due_date,
18 |   template,
19 |   customer_details,
20 |   from_details,
21 |   status,
22 |   name,
23 |   logoUrl,
24 |   isValidLogo,
25 | }: Props) {
26 |   return (
27 |     <div tw="h-full w-full flex flex-col bg-[#0C0C0C] font-[GeistMono] p-16 py-8">
28 |       <Header
29 |         customerName={name}
30 |         status={status}
31 |         logoUrl={logoUrl}
32 |         isValidLogo={isValidLogo}
33 |       />
34 |
35 |       <div tw="flex flex-col">
36 |         <Logo src={template.logo_url} customerName={name} />
37 |       </div>
38 |
39 |       <Meta
40 |         template={template}
41 |         invoiceNumber={invoice_number}
42 |         issueDate={issue_date}
43 |         dueDate={due_date}
44 |       />
45 |
46 |       <div tw="flex justify-between mt-10">
47 |         <div tw="flex flex-col flex-1 max-w-[50%]">
48 |           <span tw="text-[#858585] text-[22px] font-[GeistMono] mb-1">
49 |             {template.from_label}
50 |           </span>
51 |           <EditorContent content={from_details} />
52 |         </div>
53 |
54 |         <div tw="w-12" />
55 |
56 |         <div tw="flex flex-col flex-1 max-w-[50%]">
57 |           <span tw="text-[#858585] text-[22px] font-[GeistMono] mb-1">
58 |             {template.customer_label}
59 |           </span>
60 |           <EditorContent content={customer_details} />
61 |         </div>
62 |       </div>
63 |     </div>
64 |   );
65 | }
```

packages/invoice/src/templates/pdf/format.tsx
```
1 | import { Link, Text, View } from "@react-pdf/renderer";
2 | import type { Style } from "@react-pdf/types";
3 | import type { EditorDoc } from "../types";
4 |
5 | type PDFTextStyle = Style & {
6 |   fontFamily?: string;
7 |   fontStyle?: "normal" | "italic" | "oblique";
8 |   textDecoration?:
9 |     | "none"
10 |     | "underline"
11 |     | "line-through"
12 |     | "underline line-through";
13 | };
14 |
15 | export function formatEditorContent(doc?: EditorDoc): JSX.Element | null {
16 |   if (!doc || !doc.content) {
17 |     return null;
18 |   }
19 |
20 |   return (
21 |     <>
22 |       {doc.content.map((node, nodeIndex) => {
23 |         if (node.type === "paragraph") {
24 |           return (
25 |             <View
26 |               key={`paragraph-${nodeIndex.toString()}`}
27 |               style={{ alignItems: "flex-start" }}
28 |             >
29 |               <Text>
30 |                 {node.content?.map((inlineContent, inlineIndex) => {
31 |                   if (inlineContent.type === "text") {
32 |                     const style: PDFTextStyle = { fontSize: 9 };
33 |                     let href: string | undefined;
34 |                     if (inlineContent.marks) {
35 |                       for (const mark of inlineContent.marks) {
36 |                         if (mark.type === "bold") {
37 |                           style.fontFamily = "Helvetica-Bold";
38 |                         } else if (mark.type === "italic") {
39 |                           style.fontFamily = "Helvetica-Oblique";
40 |                         } else if (mark.type === "link") {
41 |                           href = mark.attrs?.href;
42 |                           style.textDecoration = "underline";
43 |                         } else if (mark.type === "strike") {
44 |                           style.textDecoration = "line-through";
45 |                         }
46 |                       }
47 |                     }
48 |
49 |                     const content = inlineContent.text || "";
50 |                     const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(content);
51 |
52 |                     if (href || isEmail) {
53 |                       const linkHref =
54 |                         href || (isEmail ? `mailto:${content}` : content);
55 |
56 |                       return (
57 |                         <Link
58 |                           key={`link-${nodeIndex.toString()}-${inlineIndex.toString()}`}
59 |                           src={linkHref}
60 |                           style={{
61 |                             ...style,
62 |                             color: "black",
63 |                             textDecoration: "underline",
64 |                           }}
65 |                         >
66 |                           {content}
67 |                         </Link>
68 |                       );
69 |                     }
70 |
71 |                     return (
72 |                       <Text
73 |                         key={`text-${nodeIndex.toString()}-${inlineIndex.toString()}`}
74 |                         style={style}
75 |                       >
76 |                         {content}
77 |                       </Text>
78 |                     );
79 |                   }
80 |
81 |                   if (inlineContent.type === "hardBreak") {
82 |                     // This is a hack to force a line break in the PDF to look like the web editor
83 |                     return (
84 |                       <Text
85 |                         key={`hard-break-${nodeIndex.toString()}-${inlineIndex.toString()}`}
86 |                         style={{ height: 12, fontSize: 12 }}
87 |                       >
88 |                         {"\n"}
89 |                       </Text>
90 |                     );
91 |                   }
92 |
93 |                   return null;
94 |                 })}
95 |               </Text>
96 |             </View>
97 |           );
98 |         }
99 |
100 |         return null;
101 |       })}
102 |     </>
103 |   );
104 | }
```

packages/invoice/src/templates/pdf/index.tsx
```
1 | import { Document, Image, Page, Text, View } from "@react-pdf/renderer";
2 | import QRCodeUtil from "qrcode";
3 | import type { TemplateProps } from "../types";
4 | import { EditorContent } from "./components/editor-content";
5 | import { LineItems } from "./components/line-items";
6 | import { Meta } from "./components/meta";
7 | import { Note } from "./components/note";
8 | import { PaymentDetails } from "./components/payment-details";
9 | import { QRCode } from "./components/qr-code";
10 | import { Summary } from "./components/summary";
11 |
12 | export async function PdfTemplate({
13 |   invoice_number,
14 |   issue_date,
15 |   due_date,
16 |   template,
17 |   line_items,
18 |   customer_details,
19 |   from_details,
20 |   discount,
21 |   payment_details,
22 |   note_details,
23 |   currency,
24 |   vat,
25 |   tax,
26 |   amount,
27 |   subtotal,
28 |   top_block,
29 |   bottom_block,
30 |   size = "a4",
31 |   token,
32 | }: TemplateProps) {
33 |   let qrCode = null;
34 |
35 |   if (template.include_qr) {
36 |     qrCode = await QRCodeUtil.toDataURL(`https://app.midday.ai/i/${token}`, {
37 |       width: 40 * 3,
38 |       height: 40 * 3,
39 |       margin: 0,
40 |     });
41 |   }
42 |
43 |   return (
44 |     <Document>
45 |       <Page
46 |         wrap
47 |         size={size.toUpperCase() as "LETTER" | "A4"}
48 |         style={{
49 |           padding: 20,
50 |           backgroundColor: "#fff",
51 |           color: "#000",
52 |           fontFamily: "Helvetica",
53 |         }}
54 |       >
55 |         <View
56 |           style={{
57 |             marginBottom: 20,
58 |             flexDirection: "row",
59 |             justifyContent: "space-between",
60 |           }}
61 |         >
62 |           <Meta
63 |             invoiceNoLabel={template.invoice_no_label}
64 |             issueDateLabel={template.issue_date_label}
65 |             dueDateLabel={template.due_date_label}
66 |             invoiceNo={invoice_number}
67 |             issueDate={issue_date}
68 |             dueDate={due_date}
69 |             timezone={template.timezone}
70 |             dateFormat={template.date_format}
71 |             title={template.title}
72 |           />
73 |
74 |           {template?.logo_url && (
75 |             <Image
76 |               src={template.logo_url}
77 |               style={{
78 |                 height: 75,
79 |                 objectFit: "contain",
80 |               }}
81 |             />
82 |           )}
83 |         </View>
84 |
85 |         <View style={{ flexDirection: "row", marginTop: 20 }}>
86 |           <View style={{ flex: 1, marginRight: 10 }}>
87 |             <View style={{ marginBottom: 20 }}>
88 |               <Text style={{ fontSize: 9, fontWeight: 500 }}>
89 |                 {template.from_label}
90 |               </Text>
91 |               <EditorContent content={from_details} />
92 |             </View>
93 |           </View>
94 |
95 |           <View style={{ flex: 1, marginLeft: 10 }}>
96 |             <View style={{ marginBottom: 20 }}>
97 |               <Text style={{ fontSize: 9, fontWeight: 500 }}>
98 |                 {template.customer_label}
99 |               </Text>
100 |               <EditorContent content={customer_details} />
101 |             </View>
102 |           </View>
103 |         </View>
104 |
105 |         <EditorContent content={top_block} />
106 |
107 |         <LineItems
108 |           lineItems={line_items}
109 |           currency={currency}
110 |           descriptionLabel={template.description_label}
111 |           quantityLabel={template.quantity_label}
112 |           priceLabel={template.price_label}
113 |           totalLabel={template.total_label}
114 |           locale={template.locale}
115 |           includeDecimals={template.include_decimals}
116 |           includeUnits={template.include_units}
117 |         />
118 |
119 |         <View
120 |           style={{
121 |             flex: 1,
122 |             flexDirection: "column",
123 |             justifyContent: "flex-end",
124 |           }}
125 |         >
126 |           <Summary
127 |             amount={amount}
128 |             tax={tax}
129 |             vat={vat}
130 |             currency={currency}
131 |             totalLabel={template.total_summary_label}
132 |             taxLabel={template.tax_label}
133 |             vatLabel={template.vat_label}
134 |             taxRate={template.tax_rate}
135 |             vatRate={template.vat_rate}
136 |             locale={template.locale}
137 |             discount={discount}
138 |             discountLabel={template.discount_label}
139 |             includeDiscount={template.include_discount}
140 |             includeVAT={template.include_vat}
141 |             includeTax={template.include_tax}
142 |             includeDecimals={template.include_decimals}
143 |             subtotalLabel={template.subtotal_label}
144 |             subtotal={subtotal}
145 |           />
146 |
147 |           <View style={{ flexDirection: "row", marginTop: 20 }}>
148 |             <View style={{ flex: 1, marginRight: 10 }}>
149 |               <PaymentDetails
150 |                 content={payment_details}
151 |                 paymentLabel={template.payment_label}
152 |               />
153 |
154 |               {qrCode && <QRCode data={qrCode} />}
155 |             </View>
156 |
157 |             <View style={{ flex: 1, marginLeft: 10 }}>
158 |               <Note content={note_details} noteLabel={template.note_label} />
159 |             </View>
160 |           </View>
161 |
162 |           <EditorContent content={bottom_block} />
163 |         </View>
164 |       </Page>
165 |     </Document>
166 |   );
167 | }
```

packages/ui/src/components/editor/index.tsx
```
1 | "use client";
2 |
3 | import "./styles.css";
4 |
5 | import {
6 |   EditorContent,
7 |   type Editor as EditorInstance,
8 |   type JSONContent,
9 |   useEditor,
10 | } from "@tiptap/react";
11 | import { BubbleMenu } from "./extentions/bubble-menu";
12 | import { registerExtensions } from "./extentions/register";
13 |
14 | type EditorProps = {
15 |   initialContent?: JSONContent | string;
16 |   placeholder?: string;
17 |   onUpdate?: (editor: EditorInstance) => void;
18 |   onBlur?: () => void;
19 |   onFocus?: () => void;
20 |   className?: string;
21 |   tabIndex?: number;
22 | };
23 |
24 | export function Editor({
25 |   initialContent,
26 |   placeholder,
27 |   onUpdate,
28 |   onBlur,
29 |   onFocus,
30 |   className,
31 |   tabIndex,
32 | }: EditorProps) {
33 |   const editor = useEditor({
34 |     extensions: registerExtensions({ placeholder }),
35 |     content: initialContent,
36 |     immediatelyRender: false,
37 |     onBlur,
38 |     onFocus,
39 |     onUpdate: ({ editor }) => {
40 |       onUpdate?.(editor);
41 |     },
42 |   });
43 |
44 |   if (!editor) return null;
45 |
46 |   return (
47 |     <>
48 |       <EditorContent
49 |         editor={editor}
50 |         className={className}
51 |         tabIndex={tabIndex}
52 |       />
53 |       <BubbleMenu editor={editor} />
54 |     </>
55 |   );
56 | }
```

packages/ui/src/components/editor/styles.css
```
1 | .ProseMirror-focused {
2 |   @apply outline-none;
3 | }
4 |
5 | .tiptap {
6 |   @apply font-mono text-xs leading-loose;
7 | }
8 |
9 | .tiptap h2 {
10 |   @apply text-2xl;
11 |   @apply font-sans;
12 |   margin-bottom: 1.5rem;
13 | }
14 |
15 | .tiptap a {
16 |   @apply underline;
17 | }
18 |
19 | .tiptap .bubble-menu {
20 |   @apply flex gap-2;
21 | }
22 |
23 | .tiptap p.is-empty::before {
24 |   color: #404040;
25 |   content: attr(data-placeholder);
26 |   float: left;
27 |   height: 0;
28 |   pointer-events: none;
29 | }
```

packages/ui/src/components/editor/utils.ts
```
1 | export function isValidUrlFormat(urlString: string) {
2 |   try {
3 |     new URL(urlString);
4 |     return true;
5 |   } catch (_error) {
6 |     return false;
7 |   }
8 | }
9 |
10 | export function formatUrlWithProtocol(rawUrlString: string) {
11 |   if (isValidUrlFormat(rawUrlString)) return rawUrlString;
12 |   try {
13 |     if (rawUrlString.includes(".") && !rawUrlString.includes(" ")) {
14 |       return new URL(`https://${rawUrlString}`).toString();
15 |     }
16 |   } catch (_error) {
17 |     return null;
18 |   }
19 | }
```

apps/dashboard/jobs/tasks/bank/notifications/disconnected.tsx
```
1 | import { resend } from "@/utils/resend";
2 | import ConnectionIssueEmail from "@midday/email/emails/connection-issue";
3 | import { render } from "@react-email/components";
4 | import { schemaTask } from "@trigger.dev/sdk/v3";
5 | import { z } from "zod";
6 |
7 | export const disconnectedNotifications = schemaTask({
8 |   id: "disconnected-notifications",
9 |   maxDuration: 300,
10 |   queue: {
11 |     concurrencyLimit: 1,
12 |   },
13 |   schema: z.object({
14 |     users: z.array(
15 |       z.object({
16 |         bankName: z.string(),
17 |         teamName: z.string(),
18 |         user: z.object({
19 |           id: z.string(),
20 |           email: z.string(),
21 |           full_name: z.string(),
22 |           locale: z.string(),
23 |         }),
24 |       }),
25 |     ),
26 |   }),
27 |   run: async ({ users }) => {
28 |     const emailPromises = users.map(async ({ user, bankName, teamName }) => {
29 |       const html = await render(
30 |         <ConnectionIssueEmail
31 |           fullName={user.full_name}
32 |           bankName={bankName}
33 |           teamName={teamName}
34 |         />,
35 |       );
36 |
37 |       return {
38 |         from: "Middaybot <middaybot@midday.ai>",
39 |         to: [user.email],
40 |         subject: "Bank Connection Expiring Soon",
41 |         html,
42 |       };
43 |     });
44 |
45 |     const emails = await Promise.all(emailPromises);
46 |
47 |     await resend.batch.send(emails);
48 |   },
49 | });
```

apps/dashboard/jobs/tasks/bank/notifications/expiring.tsx
```
1 | import { resend } from "@/utils/resend";
2 | import ConnectionExpireEmail from "@midday/email/emails/connection-expire";
3 | import { render } from "@react-email/components";
4 | import { schemaTask } from "@trigger.dev/sdk/v3";
5 | import { z } from "zod";
6 |
7 | export const expiringNotifications = schemaTask({
8 |   id: "expiring-notifications",
9 |   maxDuration: 300,
10 |   queue: {
11 |     concurrencyLimit: 1,
12 |   },
13 |   schema: z.object({
14 |     users: z.array(
15 |       z.object({
16 |         bankName: z.string(),
17 |         teamName: z.string(),
18 |         expiresAt: z.string(),
19 |         user: z.object({
20 |           id: z.string(),
21 |           email: z.string(),
22 |           full_name: z.string(),
23 |           locale: z.string(),
24 |         }),
25 |       }),
26 |     ),
27 |   }),
28 |   run: async ({ users }) => {
29 |     const emailPromises = users.map(
30 |       async ({ user, bankName, teamName, expiresAt }) => {
31 |         const html = await render(
32 |           <ConnectionExpireEmail
33 |             fullName={user.full_name}
34 |             bankName={bankName}
35 |             teamName={teamName}
36 |             expiresAt={expiresAt}
37 |           />,
38 |         );
39 |
40 |         return {
41 |           from: "Middaybot <middaybot@midday.ai>",
42 |           to: [user.email],
43 |           subject: "Bank Connection Expiring Soon",
44 |           html,
45 |         };
46 |       },
47 |     );
48 |
49 |     const emails = await Promise.all(emailPromises);
50 |
51 |     await resend.batch.send(emails);
52 |   },
53 | });
```

apps/dashboard/jobs/tasks/bank/notifications/transactions.ts
```
1 | import { createClient } from "@midday/supabase/job";
2 | import { logger, schemaTask } from "@trigger.dev/sdk/v3";
3 | import {
4 |   handleTransactionEmails,
5 |   handleTransactionSlackNotifications,
6 | } from "jobs/utils/transaction-notifications";
7 | import { handleTransactionNotifications } from "jobs/utils/transaction-notifications";
8 | import { z } from "zod";
9 |
10 | export const transactionNotifications = schemaTask({
11 |   id: "transaction-notifications",
12 |   maxDuration: 300,
13 |   schema: z.object({
14 |     teamId: z.string(),
15 |   }),
16 |   run: async ({ teamId }) => {
17 |     const supabase = createClient();
18 |
19 |     try {
20 |       // Mark all transactions as notified and get the ones that need to be notified about
21 |       const { data: transactionsData } = await supabase
22 |         .from("transactions")
23 |         .update({ notified: true })
24 |         .eq("team_id", teamId)
25 |         .eq("notified", false)
26 |         .select("id, date, amount, name, currency, category, status")
27 |         .order("date", { ascending: false })
28 |         .throwOnError();
29 |
30 |       const { data: usersData } = await supabase
31 |         .from("users_on_team")
32 |         .select(
33 |           "id, team_id, team:teams(inbox_id, name), user:users(id, full_name, avatar_url, email, locale)",
34 |         )
35 |         .eq("team_id", teamId)
36 |         .eq("role", "owner")
37 |         .throwOnError();
38 |
39 |       const sortedTransactions = transactionsData?.sort((a, b) => {
40 |         return new Date(b.date).getTime() - new Date(a.date).getTime();
41 |       });
42 |
43 |       if (sortedTransactions && sortedTransactions.length > 0) {
44 |         await handleTransactionNotifications(usersData, sortedTransactions);
45 |         await handleTransactionEmails(usersData, sortedTransactions);
46 |         await handleTransactionSlackNotifications(teamId, sortedTransactions);
47 |       }
48 |     } catch (error) {
49 |       await logger.error("Transactions notification", { error });
50 |
51 |       throw error;
52 |     }
53 |   },
54 | });
```

apps/dashboard/jobs/tasks/bank/scheduler/bank-scheduler.ts
```
1 | import { createClient } from "@midday/supabase/job";
2 | import { logger, schedules } from "@trigger.dev/sdk/v3";
3 | import { syncConnection } from "../sync/connection";
4 |
5 | // This is a fan-out pattern. We want to trigger a job for each bank connection
6 | // Then in sync connection we check if the connection is connected and if not we update the status (Connected, Disconnected)
7 | export const bankSyncScheduler = schedules.task({
8 |   id: "bank-sync-scheduler",
9 |   maxDuration: 600,
10 |   run: async (payload) => {
11 |     // Only run in production (Set in Trigger.dev)
12 |     if (process.env.TRIGGER_ENVIRONMENT !== "production") return;
13 |
14 |     const supabase = createClient();
15 |
16 |     const teamId = payload.externalId;
17 |
18 |     if (!teamId) {
19 |       throw new Error("teamId is required");
20 |     }
21 |
22 |     try {
23 |       const { data: bankConnections } = await supabase
24 |         .from("bank_connections")
25 |         .select("id")
26 |         .eq("team_id", teamId)
27 |         .throwOnError();
28 |
29 |       const formattedConnections = bankConnections?.map((connection) => ({
30 |         payload: {
31 |           connectionId: connection.id,
32 |         },
33 |         tags: ["team_id", teamId],
34 |       }));
35 |
36 |       // If there are no bank connections to sync, return
37 |       if (!formattedConnections?.length) {
38 |         logger.info("No bank connections to sync");
39 |         return;
40 |       }
41 |
42 |       await syncConnection.batchTrigger(formattedConnections);
43 |     } catch (error) {
44 |       logger.error("Failed to sync bank connections", { error });
45 |
46 |       throw error;
47 |     }
48 |   },
49 | });
```

apps/dashboard/jobs/tasks/bank/scheduler/disconnected-scheduler.ts
```
1 | import { createClient } from "@midday/supabase/server";
2 | import { logger, schedules } from "@trigger.dev/sdk/v3";
3 | import { disconnectedNotifications } from "../notifications/disconnected";
4 |
5 | const BATCH_SIZE = 50;
6 |
7 | export const disconnectedScheduler = schedules.task({
8 |   id: "disconnected-scheduler",
9 |   // Every Monday at 2:30pm
10 |   cron: "30 14 * * 1",
11 |   run: async () => {
12 |     // Only run in production (Set in Trigger.dev)
13 |     if (process.env.TRIGGER_ENVIRONMENT !== "production") return;
14 |
15 |     // TODO: Enable soon
16 |     return null;
17 |
18 |     const supabase = createClient();
19 |
20 |     const { data: bankConnections } = await supabase
21 |       .from("bank_connections")
22 |       .select("name, team:team_id(id, name)")
23 |       .eq("status", "disconnected");
24 |
25 |     const usersPromises =
26 |       bankConnections?.map(async ({ team, name }) => {
27 |         const { data: users } = await supabase
28 |           .from("users_on_team")
29 |           .select("user:user_id(id, email, full_name, locale)")
30 |           .eq("team_id", team.id)
31 |           .eq("role", "owner");
32 |
33 |         return users?.map((user) => ({
34 |           ...user,
35 |           bankName: name,
36 |           teamName: team.name,
37 |         }));
38 |       }) ?? [];
39 |
40 |     const users = (await Promise.all(usersPromises)).flat();
41 |
42 |     if (users.length === 0) {
43 |       logger.info("No disconnected banks found");
44 |       return;
45 |     }
46 |
47 |     for (let i = 0; i < users.length; i += BATCH_SIZE) {
48 |       const userBatch = users.slice(i, i + BATCH_SIZE);
49 |       await disconnectedNotifications.triggerAndWait({
50 |         users: userBatch,
51 |       });
52 |     }
53 |   },
54 | });
```

apps/dashboard/jobs/tasks/bank/scheduler/expiring-scheduler.ts
```
1 | import { createClient } from "@midday/supabase/server";
2 | import { logger, schedules } from "@trigger.dev/sdk/v3";
3 | import { addDays } from "date-fns";
4 | import { expiringNotifications } from "../notifications/expiring";
5 |
6 | const BATCH_SIZE = 50;
7 |
8 | export const expiringScheduler = schedules.task({
9 |   id: "expiring-scheduler",
10 |   // Every Monday at 3:30pm
11 |   cron: "30 15 * * 1",
12 |   run: async () => {
13 |     // Only run in production (Set in Trigger.dev)
14 |     if (process.env.TRIGGER_ENVIRONMENT !== "production") return;
15 |
16 |     // TODO: Enable soon
17 |     return null;
18 |
19 |     const supabase = createClient();
20 |
21 |     const { data: bankConnections } = await supabase
22 |       .from("bank_connections")
23 |       .select("id, team:team_id(id, name), name, expires_at")
24 |       .eq("status", "connected")
25 |       .lte("expires_at", addDays(new Date(), 15).toISOString())
26 |       .gt("expires_at", new Date().toISOString());
27 |
28 |     const usersPromises =
29 |       bankConnections?.map(async ({ team, name, expires_at }) => {
30 |         const { data: users } = await supabase
31 |           .from("users_on_team")
32 |           .select("user:user_id(id, email, full_name, locale)")
33 |           .eq("team_id", team.id)
34 |           .eq("role", "owner");
35 |
36 |         return users?.map((user) => ({
37 |           ...user,
38 |           bankName: name,
39 |           teamName: team.name,
40 |           expiresAt: expires_at,
41 |         }));
42 |       }) ?? [];
43 |
44 |     const users = (await Promise.all(usersPromises)).flat();
45 |
46 |     if (users.length === 0) {
47 |       logger.info("No expiring banks found");
48 |       return;
49 |     }
50 |
51 |     for (let i = 0; i < users.length; i += BATCH_SIZE) {
52 |       const userBatch = users.slice(i, i + BATCH_SIZE);
53 |       await expiringNotifications.triggerAndWait({
54 |         users: userBatch,
55 |       });
56 |     }
57 |   },
58 | });
```

apps/dashboard/jobs/tasks/bank/setup/initial.ts
```
1 | import { schedules, schemaTask } from "@trigger.dev/sdk/v3";
2 | import { generateCronTag } from "jobs/utils/generate-cron-tag";
3 | import { z } from "zod";
4 | import { bankSyncScheduler } from "../scheduler/bank-scheduler";
5 | import { syncConnection } from "../sync/connection";
6 |
7 | // This task sets up the bank sync for a new team on a daily schedule and
8 | // runs the initial sync for transactions and balance
9 | export const initialBankSetup = schemaTask({
10 |   id: "initial-bank-setup",
11 |   schema: z.object({
12 |     teamId: z.string().uuid(),
13 |     connectionId: z.string().uuid(),
14 |   }),
15 |   maxDuration: 300,
16 |   queue: {
17 |     concurrencyLimit: 50,
18 |   },
19 |   run: async (payload) => {
20 |     const { teamId, connectionId } = payload;
21 |
22 |     // Schedule the bank sync task to run daily at a random time to distribute load
23 |     // Use a deduplication key to prevent duplicate schedules for the same team
24 |     // Add teamId as externalId to use it in the bankSyncScheduler task
25 |     await schedules.create({
26 |       task: bankSyncScheduler.id,
27 |       cron: generateCronTag(teamId),
28 |       timezone: "UTC",
29 |       externalId: teamId,
30 |       deduplicationKey: `${teamId}-${bankSyncScheduler.id}`,
31 |     });
32 |
33 |     // Run initial sync for transactions and balance for the connection
34 |     await syncConnection.triggerAndWait({
35 |       connectionId,
36 |       manualSync: true,
37 |     });
38 |
39 |     // And run once more to ensure all transactions are fetched on the providers side
40 |     // GoCardLess, Teller and Plaid can take up to 3 minutes to fetch all transactions
41 |     // For Teller and Plaid we also listen on the webhook to fetch any new transactions
42 |     await syncConnection.trigger(
43 |       {
44 |         connectionId,
45 |         manualSync: true,
46 |       },
47 |       {
48 |         delay: "5m",
49 |       },
50 |     );
51 |   },
52 | });
```

apps/dashboard/jobs/tasks/bank/sync/account.ts
```
1 | import { client } from "@midday/engine/client";
2 | import { createClient } from "@midday/supabase/job";
3 | import { logger, schemaTask } from "@trigger.dev/sdk/v3";
4 | import { parseAPIError } from "jobs/utils/parse-error";
5 | import { getClassification } from "jobs/utils/transform";
6 | import { z } from "zod";
7 | import { upsertTransactions } from "../transactions/upsert";
8 |
9 | const BATCH_SIZE = 500;
10 |
11 | export const syncAccount = schemaTask({
12 |   id: "sync-account",
13 |   maxDuration: 300,
14 |   retry: {
15 |     maxAttempts: 2,
16 |   },
17 |   schema: z.object({
18 |     id: z.string().uuid(),
19 |     teamId: z.string(),
20 |     accountId: z.string(),
21 |     accessToken: z.string().optional(),
22 |     errorRetries: z.number().optional(),
23 |     provider: z.enum(["gocardless", "plaid", "teller"]),
24 |     manualSync: z.boolean().optional(),
25 |     accountType: z.enum([
26 |       "credit",
27 |       "other_asset",
28 |       "other_liability",
29 |       "depository",
30 |       "loan",
31 |     ]),
32 |   }),
33 |   run: async ({
34 |     id,
35 |     teamId,
36 |     accountId,
37 |     accountType,
38 |     accessToken,
39 |     errorRetries,
40 |     provider,
41 |     manualSync,
42 |   }) => {
43 |     const supabase = createClient();
44 |     const classification = getClassification(accountType);
45 |
46 |     // Get the balance
47 |     try {
48 |       const balanceResponse = await client.accounts.balance.$get({
49 |         query: {
50 |           provider,
51 |           id: accountId,
52 |           accessToken,
53 |         },
54 |       });
55 |
56 |       if (!balanceResponse.ok) {
57 |         throw new Error("Failed to get balance");
58 |       }
59 |
60 |       const { data: balanceData } = await balanceResponse.json();
61 |
62 |       // Only update the balance if it's greater than 0
63 |       const balance = balanceData?.amount ?? undefined;
64 |
65 |       // Reset error details and retries if we successfully got the balance
66 |       await supabase
67 |         .from("bank_accounts")
68 |         .update({
69 |           balance,
70 |           error_details: null,
71 |           error_retries: null,
72 |         })
73 |         .eq("id", id);
74 |     } catch (error) {
75 |       const parsedError = parseAPIError(error);
76 |
77 |       logger.error("Failed to sync account balance", { error: parsedError });
78 |
79 |       if (parsedError.code === "disconnected") {
80 |         const retries = errorRetries ? errorRetries + 1 : 1;
81 |
82 |         // Update the account with the error details and retries
83 |         await supabase
84 |           .from("bank_accounts")
85 |           .update({
86 |             error_details: parsedError.message,
87 |             error_retries: retries,
88 |           })
89 |           .eq("id", id);
90 |
91 |         throw error;
92 |       }
93 |     }
94 |
95 |     // Get the transactions
96 |     try {
97 |       const transactionsResponse = await client.transactions.$get({
98 |         query: {
99 |           provider,
100 |           accountId,
101 |           accountType: classification,
102 |           accessToken,
103 |           // If the transactions are being synced manually, we want to get all transactions
104 |           latest: manualSync ? "false" : "true",
105 |         },
106 |       });
107 |
108 |       if (!transactionsResponse.ok) {
109 |         throw new Error("Failed to get transactions");
110 |       }
111 |
112 |       // Reset error details and retries if we successfully got the transactions
113 |       await supabase
114 |         .from("bank_accounts")
115 |         .update({
116 |           error_details: null,
117 |           error_retries: null,
118 |         })
119 |         .eq("id", id);
120 |
121 |       const { data: transactionsData } = await transactionsResponse.json();
122 |
123 |       if (!transactionsData) {
124 |         logger.info(`No transactions to upsert for account ${accountId}`);
125 |         return;
126 |       }
127 |
128 |       // Upsert transactions in batches of 500
129 |       // This is to avoid memory issues with the DB
130 |       for (let i = 0; i < transactionsData.length; i += BATCH_SIZE) {
131 |         const transactionBatch = transactionsData.slice(i, i + BATCH_SIZE);
132 |         await upsertTransactions.trigger({
133 |           transactions: transactionBatch,
134 |           teamId,
135 |           bankAccountId: id,
136 |           manualSync,
137 |         });
138 |       }
139 |     } catch (error) {
140 |       logger.error("Failed to sync transactions", { error });
141 |
142 |       throw error;
143 |     }
144 |   },
145 | });
```

apps/dashboard/jobs/tasks/bank/sync/connection.ts
```
1 | import { client } from "@midday/engine/client";
2 | import { createClient } from "@midday/supabase/job";
3 | import { logger, schemaTask } from "@trigger.dev/sdk/v3";
4 | import { revalidateCache } from "jobs/utils/revalidate-cache";
5 | import { triggerSequenceAndWait } from "jobs/utils/trigger-sequence";
6 | import { z } from "zod";
7 | import { transactionNotifications } from "../notifications/transactions";
8 | import { syncAccount } from "./account";
9 |
10 | // Fan-out pattern. We want to trigger a task for each bank account (Transactions, Balance)
11 | export const syncConnection = schemaTask({
12 |   id: "sync-connection",
13 |   maxDuration: 1000,
14 |   retry: {
15 |     maxAttempts: 2,
16 |   },
17 |   schema: z.object({
18 |     connectionId: z.string().uuid(),
19 |     manualSync: z.boolean().optional(),
20 |   }),
21 |   run: async ({ connectionId, manualSync }, { ctx }) => {
22 |     const supabase = createClient();
23 |
24 |     try {
25 |       const { data } = await supabase
26 |         .from("bank_connections")
27 |         .select("provider, access_token, reference_id, team_id")
28 |         .eq("id", connectionId)
29 |         .single()
30 |         .throwOnError();
31 |
32 |       if (!data) {
33 |         logger.error("Connection not found");
34 |         throw new Error("Connection not found");
35 |       }
36 |
37 |       const connectionResponse = await client.connections.status.$get({
38 |         query: {
39 |           id: data.reference_id,
40 |           provider: data.provider,
41 |           accessToken: data.access_token,
42 |         },
43 |       });
44 |
45 |       logger.info("Connection response", { connectionResponse });
46 |
47 |       if (!connectionResponse.ok) {
48 |         logger.error("Failed to get connection status");
49 |         throw new Error("Failed to get connection status");
50 |       }
51 |
52 |       const { data: connectionData } = await connectionResponse.json();
53 |
54 |       if (connectionData.status === "connected") {
55 |         await supabase
56 |           .from("bank_connections")
57 |           .update({
58 |             status: "connected",
59 |             last_accessed: new Date().toISOString(),
60 |           })
61 |           .eq("id", connectionId);
62 |
63 |         const query = supabase
64 |           .from("bank_accounts")
65 |           .select(
66 |             "id, team_id, account_id, type, bank_connection:bank_connection_id(id, provider, access_token, status)",
67 |           )
68 |           .eq("bank_connection_id", connectionId)
69 |           .eq("enabled", true)
70 |           .eq("manual", false);
71 |
72 |         // Skip accounts with more than 3 error retries during background sync
73 |         // Allow all accounts during manual sync to clear errors after reconnect
74 |         if (!manualSync) {
75 |           query.or("error_retries.lt.4,error_retries.is.null");
76 |         }
77 |
78 |         const { data: bankAccountsData } = await query.throwOnError();
79 |
80 |         if (!bankAccountsData) {
81 |           logger.info("No bank accounts found");
82 |           return;
83 |         }
84 |
85 |         const bankAccounts = bankAccountsData.map((account) => ({
86 |           id: account.id,
87 |           accountId: account.account_id,
88 |           accessToken: account.bank_connection?.access_token ?? undefined,
89 |           provider: account.bank_connection?.provider,
90 |           connectionId: account.bank_connection?.id,
91 |           teamId: account.team_id,
92 |           accountType: account.type ?? "depository",
93 |           manualSync,
94 |         }));
95 |
96 |         // Only run the sync if there are bank accounts enabled
97 |         // We don't want to delay the sync if it's a manual sync
98 |         // but we do want to delay it if it's an background sync to avoid rate limiting
99 |         if (bankAccounts.length > 0) {
100 |           await triggerSequenceAndWait(bankAccounts, syncAccount, {
101 |             tags: ctx.run.tags,
102 |             delayMinutes: manualSync ? 0 : 1,
103 |           });
104 |         }
105 |
106 |         logger.info("Synced bank accounts completed");
107 |
108 |         // Trigger a notification for new transactions if it's an background sync
109 |         // We delay it by 1 minutes to allow for more transactions to be notified
110 |         if (!manualSync) {
111 |           await transactionNotifications.trigger(
112 |             { teamId: data.team_id },
113 |             { delay: "1m" },
114 |           );
115 |         }
116 |
117 |         // Check connection status by accounts
118 |         // If all accounts have 3+ error retries, disconnect the connection
119 |         // So the user will get a notification and can reconnect the bank
120 |         try {
121 |           const { data: bankAccountsData } = await supabase
122 |             .from("bank_accounts")
123 |             .select("id, error_retries")
124 |             .eq("bank_connection_id", connectionId)
125 |             .eq("manual", false)
126 |             .eq("enabled", true)
127 |             .throwOnError();
128 |
129 |           if (
130 |             bankAccountsData?.every(
131 |               (account) => (account.error_retries ?? 0) >= 3,
132 |             )
133 |           ) {
134 |             logger.info(
135 |               "All bank accounts have 3+ error retries, disconnecting connection",
136 |             );
137 |
138 |             await supabase
139 |               .from("bank_connections")
140 |               .update({ status: "disconnected" })
141 |               .eq("id", connectionId);
142 |           }
143 |         } catch (error) {
144 |           logger.error("Failed to check connection status by accounts", {
145 |             error,
146 |           });
147 |         }
148 |
[TRUNCATED]
```

apps/dashboard/jobs/tasks/bank/transactions/upsert.ts
```
1 | import { createClient } from "@midday/supabase/job";
2 | import { logger, schemaTask } from "@trigger.dev/sdk/v3";
3 | import { transformTransaction } from "jobs/utils/transform";
4 | import { z } from "zod";
5 |
6 | const transactionSchema = z.object({
7 |   id: z.string(),
8 |   description: z.string().nullable(),
9 |   method: z.string().nullable(),
10 |   date: z.string(),
11 |   name: z.string(),
12 |   status: z.enum(["pending", "posted"]),
13 |   balance: z.number().nullable(),
14 |   currency: z.string(),
15 |   amount: z.number(),
16 |   category: z.string().nullable(),
17 | });
18 |
19 | export const upsertTransactions = schemaTask({
20 |   id: "upsert-transactions",
21 |   maxDuration: 300,
22 |   queue: {
23 |     concurrencyLimit: 10,
24 |   },
25 |   schema: z.object({
26 |     teamId: z.string().uuid(),
27 |     bankAccountId: z.string().uuid(),
28 |     manualSync: z.boolean().optional(),
29 |     transactions: z.array(transactionSchema),
30 |   }),
31 |   run: async ({ transactions, teamId, bankAccountId, manualSync }) => {
32 |     const supabase = createClient();
33 |
34 |     try {
35 |       // Transform transactions to match our DB schema
36 |       const formattedTransactions = transactions.map((transaction) => {
37 |         return transformTransaction({
38 |           transaction,
39 |           teamId,
40 |           bankAccountId,
41 |           notified: manualSync,
42 |         });
43 |       });
44 |
45 |       // Upsert transactions into the transactions table, skipping duplicates based on internal_id
46 |       await supabase
47 |         .from("transactions")
48 |         .upsert(formattedTransactions, {
49 |           onConflict: "internal_id",
50 |           ignoreDuplicates: true,
51 |         })
52 |         .throwOnError();
53 |     } catch (error) {
54 |       logger.error("Failed to upsert transactions", { error });
55 |
56 |       throw error;
57 |     }
58 |   },
59 | });
```

apps/dashboard/jobs/tasks/invoice/email/send-email.tsx
```
1 | import { resend } from "@/utils/resend";
2 | import InvoiceEmail from "@midday/email/emails/invoice";
3 | import { createClient } from "@midday/supabase/job";
4 | import { getAppUrl } from "@midday/utils/envs";
5 | import { render } from "@react-email/render";
6 | import { logger, schemaTask } from "@trigger.dev/sdk/v3";
7 | import { nanoid } from "nanoid";
8 | import { z } from "zod";
9 |
10 | export const sendInvoiceEmail = schemaTask({
11 |   id: "send-invoice-email",
12 |   schema: z.object({
13 |     invoiceId: z.string().uuid(),
14 |   }),
15 |   maxDuration: 300,
16 |   queue: {
17 |     concurrencyLimit: 10,
18 |   },
19 |   run: async ({ invoiceId }) => {
20 |     const supabase = createClient();
21 |
22 |     const { data: invoice } = await supabase
23 |       .from("invoices")
24 |       .select(
25 |         "id, token, customer:customer_id(name, website, email), team:team_id(name, email)",
26 |       )
27 |       .eq("id", invoiceId)
28 |       .single();
29 |
30 |     if (!invoice) {
31 |       logger.error("Invoice not found");
32 |       return;
33 |     }
34 |
35 |     const customerEmail = invoice?.customer?.email;
36 |
37 |     if (!customerEmail) {
38 |       logger.error("Invoice customer email not found");
39 |       return;
40 |     }
41 |
42 |     const response = await resend.emails.send({
43 |       from: "Midday <middaybot@midday.ai>",
44 |       to: customerEmail,
45 |       replyTo: invoice?.team.email ?? undefined,
46 |       subject: `${invoice?.team.name} sent you an invoice`,
47 |       headers: {
48 |         "X-Entity-Ref-ID": nanoid(),
49 |       },
50 |       html: await render(
51 |         <InvoiceEmail
52 |           customerName={invoice?.customer.name}
53 |           teamName={invoice?.team.name}
54 |           link={`${getAppUrl()}/i/${invoice?.token}`}
55 |         />,
56 |       ),
57 |     });
58 |
59 |     if (response.error) {
60 |       logger.error("Invoice email failed to send", {
61 |         invoiceId,
62 |         error: response.error,
63 |       });
64 |
65 |       throw new Error("Invoice email failed to send");
66 |     }
67 |
68 |     logger.info("Invoice email sent");
69 |
70 |     await supabase
71 |       .from("invoices")
72 |       .update({
73 |         status: "unpaid",
74 |         sent_to: customerEmail,
75 |       })
76 |       .eq("id", invoiceId);
77 |   },
78 | });
```

apps/dashboard/jobs/tasks/invoice/notifications/send-notifications.ts
```
1 | import { createClient } from "@midday/supabase/job";
2 | import { schemaTask } from "@trigger.dev/sdk/v3";
3 | import {
4 |   handleOverdueInvoiceNotifications,
5 |   handlePaidInvoiceNotifications,
6 | } from "jobs/utils/invoice-notifications";
7 | import { z } from "zod";
8 |
9 | export const sendInvoiceNotifications = schemaTask({
10 |   id: "invoice-notifications",
11 |   schema: z.object({
12 |     invoiceId: z.string().uuid(),
13 |     invoiceNumber: z.string(),
14 |     status: z.enum(["paid", "overdue"]),
15 |     teamId: z.string(),
16 |     customerName: z.string(),
17 |   }),
18 |   run: async ({ invoiceId, invoiceNumber, status, teamId, customerName }) => {
19 |     const supabase = createClient();
20 |
21 |     const { data: user } = await supabase
22 |       .from("users_on_team")
23 |       .select(
24 |         "id, team_id, user:users(id, full_name, avatar_url, email, locale)",
25 |       )
26 |       .eq("team_id", teamId)
27 |       .eq("role", "owner");
28 |
29 |     switch (status) {
30 |       case "paid":
31 |         await handlePaidInvoiceNotifications({
32 |           user,
33 |           invoiceId,
34 |           invoiceNumber,
35 |         });
36 |         break;
37 |       case "overdue":
38 |         await handleOverdueInvoiceNotifications({
39 |           user,
40 |           invoiceId,
41 |           invoiceNumber,
42 |           customerName,
43 |         });
44 |         break;
45 |     }
46 |   },
47 | });
```

apps/dashboard/jobs/tasks/invoice/operations/check-status.ts
```
1 | import { TZDate } from "@date-fns/tz";
2 | import { createClient } from "@midday/supabase/job";
3 | import { logger, schemaTask } from "@trigger.dev/sdk/v3";
4 | import { subDays } from "date-fns";
5 | import { updateInvoiceStatus } from "jobs/utils/update-invocie";
6 | import { z } from "zod";
7 |
8 | export const checkInvoiceStatus = schemaTask({
9 |   id: "check-invoice-status",
10 |   schema: z.object({
11 |     invoiceId: z.string().uuid(),
12 |   }),
13 |   queue: {
14 |     concurrencyLimit: 10,
15 |   },
16 |   run: async ({ invoiceId }) => {
17 |     const supabase = createClient();
18 |
19 |     const { data: invoice } = await supabase
20 |       .from("invoices")
21 |       .select(
22 |         "id, status, due_date, currency, amount, team_id, file_path, invoice_number, file_size, template",
23 |       )
24 |       .eq("id", invoiceId)
25 |       .single();
26 |
27 |     if (!invoice) {
28 |       logger.error("Invoice data is missing");
29 |       return;
30 |     }
31 |
32 |     if (!invoice.amount || !invoice.currency || !invoice.due_date) {
33 |       logger.error("Invoice data is missing");
34 |       return;
35 |     }
36 |
37 |     const timezone = invoice.template?.timezone || "UTC";
38 |
39 |     // Find recent transactions matching invoice amount, currency, and team_id
40 |     const { data: transactions } = await supabase
41 |       .from("transactions")
42 |       .select("id")
43 |       .eq("team_id", invoice.team_id)
44 |       .eq("amount", invoice.amount)
45 |       .eq("currency", invoice.currency?.toUpperCase())
46 |       .gte(
47 |         "date",
48 |         // Get the transactions from the last 3 days
49 |         subDays(new TZDate(new Date(), timezone), 3).toISOString(),
50 |       )
51 |       .eq("is_fulfilled", false);
52 |
53 |     // We have a match
54 |     if (transactions && transactions.length === 1) {
55 |       const transactionId = transactions.at(0)?.id;
56 |       const filename = `${invoice.invoice_number}.pdf`;
57 |
58 |       // Attach the invoice file to the transaction and mark as paid
59 |       await supabase
60 |         .from("transaction_attachments")
61 |         .insert({
62 |           type: "application/pdf",
63 |           path: invoice.file_path,
64 |           transaction_id: transactionId,
65 |           team_id: invoice.team_id,
66 |           name: filename,
67 |           size: invoice.file_size,
68 |         })
69 |         .select()
70 |         .single();
71 |
72 |       await updateInvoiceStatus({
73 |         invoiceId,
74 |         status: "paid",
75 |       });
76 |     } else {
77 |       // Check if the invoice is overdue
78 |       const isOverdue =
79 |         new TZDate(invoice.due_date, timezone) <
80 |         new TZDate(new Date(), timezone);
81 |
82 |       // Update invoice status to overdue if it's past due date and currently unpaid
83 |       if (isOverdue && invoice.status === "unpaid") {
84 |         await updateInvoiceStatus({
85 |           invoiceId,
86 |           status: "overdue",
87 |         });
88 |       }
89 |     }
90 |   },
91 | });
```

apps/dashboard/jobs/tasks/invoice/operations/generate-invoice.ts
```
1 | import { PdfTemplate, renderToBuffer } from "@midday/invoice";
2 | import { createClient } from "@midday/supabase/job";
3 | import { logger, schemaTask } from "@trigger.dev/sdk/v3";
4 | import { z } from "zod";
5 |
6 | export const generateInvoice = schemaTask({
7 |   id: "generate-invoice",
8 |   schema: z.object({
9 |     invoiceId: z.string().uuid(),
10 |   }),
11 |   maxDuration: 300,
12 |   queue: {
13 |     concurrencyLimit: 10,
14 |   },
15 |   run: async (payload) => {
16 |     const supabase = createClient();
17 |
18 |     const { invoiceId } = payload;
19 |
20 |     const { data: invoiceData } = await supabase
21 |       .from("invoices")
22 |       .select(
23 |         "*, team_id, customer:customer_id(name), user:user_id(timezone, locale)",
24 |       )
25 |       .eq("id", invoiceId)
26 |       .single()
27 |       .throwOnError();
28 |
29 |     const { user, ...invoice } = invoiceData;
30 |
31 |     const buffer = await renderToBuffer(await PdfTemplate(invoice));
32 |
33 |     const filename = `${invoiceData?.invoice_number}.pdf`;
34 |
35 |     await supabase.storage
36 |       .from("vault")
37 |       .upload(`${invoiceData?.team_id}/invoices/${filename}`, buffer, {
38 |         contentType: "application/pdf",
39 |         upsert: true,
40 |       });
41 |
42 |     logger.debug("PDF uploaded to storage");
43 |
44 |     await supabase
45 |       .from("invoices")
46 |       .update({
47 |         file_path: [invoiceData?.team_id, "invoices", filename],
48 |         file_size: buffer.length,
49 |       })
50 |       .eq("id", invoiceId);
51 |
52 |     logger.info("Invoice generation completed", { invoiceId, filename });
53 |   },
54 | });
```

apps/dashboard/jobs/tasks/invoice/scheduler/schedule-invoice.ts
```
1 | import { createClient } from "@midday/supabase/job";
2 | import { logger, schedules } from "@trigger.dev/sdk/v3";
3 | import { triggerBatch } from "jobs/utils/trigger-batch";
4 | import { checkInvoiceStatus } from "../operations/check-status";
5 |
6 | export const invoiceScheduler = schedules.task({
7 |   id: "invoice-scheduler",
8 |   cron: "0 0,12 * * *",
9 |   run: async () => {
10 |     // Only run in production (Set in Trigger.dev)
11 |     if (process.env.TRIGGER_ENVIRONMENT !== "production") return;
12 |
13 |     const supabase = createClient();
14 |
15 |     const { data: invoices } = await supabase
16 |       .from("invoices")
17 |       .select("id")
18 |       .in("status", ["unpaid", "overdue"]);
19 |
20 |     if (!invoices) return;
21 |
22 |     const formattedInvoices = invoices.map((invoice) => ({
23 |       invoiceId: invoice.id,
24 |     }));
25 |
26 |     await triggerBatch(formattedInvoices, checkInvoiceStatus);
27 |
28 |     logger.info("Invoice status check jobs started", {
29 |       count: invoices.length,
30 |     });
31 |   },
32 | });
```

apps/dashboard/src/actions/ai/chat/get-chats-action.ts
```
1 | "use server";
2 |
3 | import { addMonths, addWeeks, isAfter, isBefore, isToday } from "date-fns";
4 | import { getChats } from "../storage";
5 | import type { Chat } from "../types";
6 |
7 | export async function getChatsAction() {
8 |   const data = await getChats();
9 |
10 |   if (!data.length) {
11 |     return [];
12 |   }
13 |
14 |   const base: { "1d": Chat[]; "7d": Chat[]; "30d": Chat[] } = {
15 |     "1d": [],
16 |     "7d": [],
17 |     "30d": [],
18 |   };
19 |
20 |   for (const obj of data) {
21 |     const currentDate = new Date(obj.createdAt);
22 |
23 |     if (isToday(currentDate)) {
24 |       base["1d"].push(obj);
25 |     }
26 |
27 |     if (
28 |       !isToday(currentDate) &&
29 |       isBefore(currentDate, addWeeks(currentDate, 1))
30 |     ) {
31 |       base["7d"].push(obj);
32 |     }
33 |
34 |     if (
35 |       isAfter(currentDate, addWeeks(currentDate, 1)) &&
36 |       isBefore(currentDate, addMonths(currentDate, 1))
37 |     ) {
38 |       base["30d"].push(obj);
39 |     }
40 |   }
41 |
42 |   return base;
43 | }
```

apps/dashboard/src/actions/ai/chat/index.tsx
```
1 | "use server";
2 |
3 | import { BotMessage, SpinnerMessage } from "@/components/chat/messages";
4 | import { openai } from "@ai-sdk/openai";
5 | import { client as RedisClient } from "@midday/kv";
6 | import { getUser } from "@midday/supabase/cached-queries";
7 | import { Ratelimit } from "@upstash/ratelimit";
8 | import {
9 |   createAI,
10 |   createStreamableValue,
11 |   getMutableAIState,
12 |   streamUI,
13 | } from "ai/rsc";
14 | import { startOfMonth, subMonths } from "date-fns";
15 | import { nanoid } from "nanoid";
16 | import { headers } from "next/headers";
17 | import { getAssistantSettings, saveChat } from "../storage";
18 | import type { AIState, Chat, ClientMessage, UIState } from "../types";
19 | import { getBurnRateTool } from "./tools/burn-rate";
20 | import { getForecastTool } from "./tools/forecast";
21 | import { getDocumentsTool } from "./tools/get-documents";
22 | import { getInvoicesTool } from "./tools/get-invoces";
23 | import { getTransactionsTool } from "./tools/get-transactions";
24 | import { getProfitTool } from "./tools/profit";
25 | import { createReport } from "./tools/report";
26 | import { getRevenueTool } from "./tools/revenue";
27 | import { getRunwayTool } from "./tools/runway";
28 | import { getSpendingTool } from "./tools/spending";
29 |
30 | const ratelimit = new Ratelimit({
31 |   limiter: Ratelimit.fixedWindow(10, "10s"),
32 |   redis: RedisClient,
33 | });
34 |
35 | export async function submitUserMessage(
36 |   content: string,
37 | ): Promise<ClientMessage> {
38 |   "use server";
39 |   const ip = headers().get("x-forwarded-for");
40 |   const { success } = await ratelimit.limit(ip);
41 |
42 |   const aiState = getMutableAIState<typeof AI>();
43 |
44 |   if (!success) {
45 |     aiState.update({
46 |       ...aiState.get(),
47 |       messages: [
48 |         ...aiState.get().messages,
49 |         {
50 |           id: nanoid(),
51 |           role: "assistant",
52 |           content:
53 |             "Not so fast, tiger. You've reached your message limit. Please wait a minute and try again.",
54 |         },
55 |       ],
56 |     });
57 |
58 |     return {
59 |       id: nanoid(),
60 |       role: "assistant",
61 |       display: (
62 |         <BotMessage content="Not so fast, tiger. You've reached your message limit. Please wait a minute and try again." />
63 |       ),
64 |     };
65 |   }
66 |
67 |   const user = await getUser();
68 |   const teamId = user?.data?.team_id as string;
69 |
70 |   const defaultValues = {
71 |     from: subMonths(startOfMonth(new Date()), 12).toISOString(),
72 |     to: new Date().toISOString(),
73 |   };
74 |
75 |   aiState.update({
76 |     ...aiState.get(),
77 |     messages: [
78 |       ...aiState.get().messages,
79 |       {
80 |         id: nanoid(),
81 |         role: "user",
82 |         content,
83 |       },
84 |     ],
85 |   });
86 |
87 |   let textStream: undefined | ReturnType<typeof createStreamableValue<string>>;
88 |   let textNode: undefined | React.ReactNode;
89 |
90 |   const result = await streamUI({
91 |     model: openai("gpt-4o-mini"),
92 |     initial: <SpinnerMessage />,
93 |     system: `\
94 |     You are a helpful assistant in Midday who can help users ask questions about their transactions, revenue, spending find invoices and more.
95 |
96 |     If the user wants the burn rate, call \`getBurnRate\` function.
97 |     If the user wants the runway, call \`getRunway\` function.
98 |     If the user wants the profit, call \`getProfit\` function.
99 |     If the user wants to find transactions or expenses, call \`getTransactions\` function.
100 |     If the user wants to see spending based on a category, call \`getSpending\` function.
101 |     If the user wants to find invoices or receipts, call \`getInvoices\` function.
102 |     If the user wants to find documents, call \`getDocuments\` function.
103 |     Don't return markdown, just plain text.
104 |
105 |     Always try to call the functions with default values, otherwise ask the user to respond with parameters.
106 |     Current date is: ${new Date().toISOString().split("T")[0]} \n
107 |     `,
108 |     messages: [
109 |       ...aiState.get().messages.map((message: any) => ({
110 |         role: message.role,
111 |         content: message.content,
112 |         name: message.name,
113 |         display: null,
114 |       })),
115 |     ],
116 |     text: ({ content, done, delta }) => {
117 |       if (!textStream) {
118 |         textStream = createStreamableValue("");
119 |         textNode = <BotMessage content={textStream.value} />;
120 |       }
121 |
122 |       if (done) {
123 |         textStream.done();
124 |         aiState.done({
125 |           ...aiState.get(),
126 |           messages: [
127 |             ...aiState.get().messages,
128 |             {
129 |               id: nanoid(),
130 |               role: "assistant",
131 |               content,
132 |             },
133 |           ],
134 |         });
135 |       } else {
136 |         textStream.update(delta);
137 |       }
138 |
139 |       return textNode;
140 |     },
141 |     tools: {
142 |       getSpending: getSpendingTool({
143 |         aiState,
144 |         dateFrom: defaultValues.from,
145 |         dateTo: defaultValues.to,
146 |       }),
147 |       getBurnRate: getBurnRateTool({
148 |         aiState,
149 |         dateFrom: defaultValues.from,
150 |         dateTo: defaultValues.to,
151 |       }),
152 |       getRunway: getRunwayTool({
153 |         aiState,
[TRUNCATED]
```

apps/dashboard/src/actions/ai/chat/utils.tsx
```
1 | import { BotMessage, UserMessage } from "@/components/chat/messages";
2 | import type { Chat } from "../types";
3 | import { BurnRateUI } from "./tools/ui/burn-rate-ui";
4 | import { DocumentsUI } from "./tools/ui/documents-ui";
5 | import { ProfitUI } from "./tools/ui/profit-ui";
6 | import { ReportUI } from "./tools/ui/report-ui";
7 | import { RevenueUI } from "