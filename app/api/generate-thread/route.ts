import { NextResponse } from 'next/server';
// import { supabase } from '@/lib/supabase';
// import { generateThreadFromContent } from '@/lib/anthropic';
// import { handlers } from '@/lib/handlers';

export async function POST() {
  return NextResponse.json({ message: "API endpoint not implemented yet" }, { status: 501 });
}



// export async function POST(req: Request) {
//   try {
//     const { resources } = await req.json();

//     // Process each resource
//     const processedContent = await Promise.all(
//       resources.map(r => handlers[r.type](r.content))
//     );

//     // Combine content
//     const combinedContent = processedContent
//       .map(r => r.content)
//       .join('\n\n');

//     // Generate thread using Anthropic
//     const thread = await generateThreadFromContent(combinedContent);

//     // Store in Supabase
//     const { data, error } = await supabase
//       .from('threads')
//       .insert({
//         content: thread,
//         resources: resources,
//         status: 'draft'
//       })
//       .select()
//       .single();

//     if (error) throw error;

//     return NextResponse.json({ thread: data });

//   } catch (error) {
//     console.error('Error generating thread:', error);
//     return NextResponse.json(
//       { error: 'Failed to generate thread' },
//       { status: 500 }
//     );
//   }
// }
