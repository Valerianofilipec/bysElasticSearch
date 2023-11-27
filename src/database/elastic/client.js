import {Client} from "@elastic/elasticsearch"

const apiKey = process.env.ELASTIC_API_KEY;

export const client = new Client({
  node: 'https://4f764dc6d6fe4394aa2a259204e53164.us-central1.gcp.cloud.es.io:443',
  auth: {
      apiKey
  }
});