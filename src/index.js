import express from "express";
import morgan from "morgan";
import cors from "cors";
import "dotenv/config";
import { client } from "./database/elastic/client.js";
//import { dataset } from "./database/dataset.js";

const PORT = process.env.PORT | 3333;

const server = express();

server.use(cors());
server.use(express.json());
server.use(express.static("public"));
server.use(morgan('dev'));


//Test drive routes
server.post('/dataset', async(req, res)=>{
    const {dataset} = req.body;
    try {
        const result = await client.helpers.bulk({
            datasource: dataset,
            pipeline: "ent-search-generic-ingestion",
            onDocument: (doc) => ({ index: { _index: 'search-restaurants' }}),
        });
        res.json(result);
    } catch (error) {
        res.status(500).json(error);
    }
    
    //console.log(result);
    /**
        {
            total: 6,
            failed: 0,
            retry: 0,
            successful: 6,
            noop: 0,
            time: 82,
            bytes: 1273,
            aborted: false
        }
    */
});
server.get('/test', async(req, response)=>{
    // API Key should have cluster monitor rights.
    try {
        const resp = await client.info(); 
        response.json(resp);
        //console.log(resp);
        /**
        {
        name: 'instance-0000000000',
        cluster_name: 'd9dcd35d12fe46dfaa28ec813f65d57b',
        cluster_uuid: 'iln8jaivThSezhTkzp0Knw',
        version: {
            build_flavor: 'default',
            build_type: 'docker',
            build_hash: 'ca3dc3a882d76f14d2765906ce3b1cf421948d19',
            build_date: '2023-08-28T11:24:16.383660553Z',
            build_snapshot: true,
            lucene_version: '9.7.0',
            minimum_wire_compatibility_version: '7.17.0',
            minimum_index_compatibility_version: '7.0.0'
        },
        tagline: 'You Know, for Search'
        }
        */
    } catch (error) {
        res.status(500).json(error);
    }
    
});
server.get('/search', async(req, res)=>{
    const {q} = req.query
    try {
        // Let's search!
        const searchResult = await client.search({
            index: 'search-restaurants',
            q//: 'snow'
        });
        //console.log(searchResult.hits.hits);
        res.json(searchResult);
    } catch (error) {
        res.status(500).json(error);
    }
});

server.listen(PORT, async ()=>{
    console.log("bysElasticSearch server is running...");
});