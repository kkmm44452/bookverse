
// import { Injectable } from '@angular/core';
// import {
//   createClient,
//   Entry,
//   EntryFieldTypes,
//   EntrySkeletonType
// } from 'contentful';

// export type NcertBookSkeleton = EntrySkeletonType<
//   {
//     booktitle: EntryFieldTypes.Text;
//     class: EntryFieldTypes.Text;
//     subject: EntryFieldTypes.Text;
//     lang: EntryFieldTypes.Text;
//     description: EntryFieldTypes.Text;
//     coverimage: EntryFieldTypes.AssetLink;
//     ncerturl: EntryFieldTypes.Text;
//     academicyear: EntryFieldTypes.Date;
//   },
//   'bookverse'
// >;

// @Injectable({
//   providedIn: 'root'
// })
// export class ContentfulService {

//   private client = createClient({
//     space: process.env['CONTENTFUL_SPACE_ID'],
//     accessToken: process.env['CONTENTFUL_ACCESS_TOKEN'],
//     environment: Process.env['CONTENTFUL_ENVIRONMENT']
//   });

//   async getNcertBooks(): Promise<Entry<NcertBookSkeleton>[]> {

//     const response = await this.client.getEntries<NcertBookSkeleton>({
//       content_type: 'bookverse',
//       include: 2
//     });

//     return response.items;
//   }
// }

import { Injectable } from '@angular/core';
import {
  createClient,
  Entry,
  EntryFieldTypes,
  EntrySkeletonType
} from 'contentful';

export type NcertBookSkeleton = EntrySkeletonType<
  {
    booktitle: EntryFieldTypes.Text;
    class: EntryFieldTypes.Text;
    subject: EntryFieldTypes.Text;
    price : EntryFieldTypes.Number;
    lang: EntryFieldTypes.Text;
    description: EntryFieldTypes.Text;
    coverimage: EntryFieldTypes.AssetLink;
    ncerturl: EntryFieldTypes.Text;
    academicyear: EntryFieldTypes.Date;
  },
  'bookverse'
>;

@Injectable({
  providedIn: 'root'
})
export class ContentfulService {

  private client = createClient({
    space: import.meta.env['NG_APP_CONTENTFUL_SPACE_ID'],
    accessToken: import.meta.env['NG_APP_CONTENTFUL_ACCESS_TOKEN'],
    environment: import.meta.env['NG_APP_CONTENTFUL_ENVIRONMENT'] || 'master'
  });

  async getNcertBooks(): Promise<Entry<NcertBookSkeleton>[]> {

    const response = await this.client.getEntries<NcertBookSkeleton>({
      content_type: 'bookverse',
      include: 2
    });

   // console.log(response);
    return response.items;
  }
}