import { Injectable } from '@nestjs/common';
import { createReadStream } from 'fs';
import axios, { AxiosRequestConfig } from 'axios';
import * as FormData from 'form-data';
import { ClientSecretCredential } from '@azure/identity';

@Injectable()
export class OneDriveService {
  private readonly graphAPIEndpoint = 'https://graph.microsoft.com/v1.0';

  async uploadImageToOneDrive(filePath: string, fileName: string): Promise<string> {
    const accessToken = await this.getAccessToken(); // Implement this method to retrieve the access token
    console.log('accessToken: '+ accessToken);
    const url = `${this.graphAPIEndpoint}/me/drive/root:/kma-eventhub/${fileName}:/content`;
    const formData = new FormData();
    formData.append('file', createReadStream(filePath));

    const options: AxiosRequestConfig = {
      method: 'PUT',
      url,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        ...formData.getHeaders(),
      },
      data: formData,
    };

    await axios(options);

    // Retrieve the uploaded file URL
    const driveItemUrl = `${this.graphAPIEndpoint}/me/drive/root:/kma-eventhub/${fileName}`;
    const driveItemOptions = {
      method: 'GET',
      url: driveItemUrl,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      json: true,
    };

    const driveItem = await axios(driveItemOptions);
    const fileUrl = driveItem['@microsoft.graph.downloadUrl'];

    return fileUrl;
  }

  async getAccessToken(): Promise<string> {
    const tenantId = 'f8cdef31-a31e-4b4a-93e4-5f571e91255a'; // 'b8cbfe43-c90c-4bea-84ae-be5d6d8a5f52';
    const clientId = '372ec198-9227-4a1f-9f7b-a10533fa6061'; //"f1bbaed2-be06-492a-a749-7a7676337d66";
    const clientSecret = 'CNE8Q~EdiCCvT-L9Nd.P~jPHQ7CdEorNaXLXqbbv'; // 'Gda8Q~bK~T2vE6zBFsbOwzHSKgSyg8KN15M3Zar3';
    const scopes = ['https://management.azure.com/.default'];

    const credential = new ClientSecretCredential(tenantId, clientId, clientSecret);
    const tokenResponse = await credential.getToken(scopes);
  
    return tokenResponse.token;
  }
}
