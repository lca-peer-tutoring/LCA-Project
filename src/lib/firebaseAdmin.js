// /lib/firebaseAdmin.js

import admin from "firebase-admin";

const adminApp = admin.apps.length
  ? admin.app()
  : admin.initializeApp({
      type: "service_account",
      project_id: "lca-peer-tutoring",
      private_key_id: "ef0dacc2555eca3fb7eca448b3a80ce131d82561",
      private_key:
        "-----BEGIN PRIVATE KEY-----\nMIIEuwIBADANBgkqhkiG9w0BAQEFAASCBKUwggShAgEAAoIBAQDaEUZ7/KMWnvXn\nTVXVrZVJ/VJ+Tf4LokTbGOc02c8wPNZlSTXcBklvxiUeyhGXhusnqXsI0tPaXAuv\neDTvR9X5AY8wL697M2G+9EDxjKY7btlNkWMtWhSODD/YO6h6EShfl98mxsRqwoRj\nFZAVYsb75YujQ9ChAsd/IiosriYiAHYI1FLNs1oEgGSHn5IwOJGQbzoui4bB7IEa\nWRqdBbkWBbTZ0YUFDIX+SU9GkFpRBdUnLEILQ/9TDE+tMxWEX8ngb7f0Bt71NfR+\ndKxFtHx4TOpCFnr6OLtDHSa779VwqkD6Gz8YoVpeGRJT90rJ+HFswMTbWjW4u4Nu\ngaObLEexAgMBAAECgf8YEE/23qoglOoN3DrcmYsf3xR7W5/tKLrwco8RBfgXGp+O\nDcYjwY3ZB8SQ4TuPvRO2DL3G+3zlW8LuWhV9UjAKimGCr8Btl/3xVILWJO8zH8hb\nBvAq0QXzpuZktjChR8NsyRWW8dg677wsMvTzZzMOGQaPvawIGIZrQRnmVFFg7vfs\nq0SDvGH/2Bm1yO7VvXPkAD4cOar5aherSUUWdg0PlzsWleO2o284KIOOIptD2f/Q\noD4oKS71Ef06Sng+UA8ItyF9DGQuso7erptVF3cm94WvXNe8EvmTazbOo3A3f7bp\nMG1B8CjENV1X8RI/SgLMWI75dJIyX76sdj7iAQECgYEA8xJnbGsA7LQ3pn6Ld+81\nEEb8WNQ7hawFG9laOCLRhErnYvVCoHGXMSZLSwAzXhcsz2U0+KqcD8B8KAK91c7e\nfMoxxoNmL8C/MD1imxWVdEbQTEbW/7Fucr8x+GG/9K/o3kXUBwY2t5o1lFSAzhoR\nnE7+pyf8KpBGzztDMTPZB/ECgYEA5aprKK+xF1vSCE4VEl8prWmV66wpPHILCeCt\n4VqowQ3MYmUXBh1mZf2qWG3Kh1Ml61QWeuu5PcsqsW0Ec4Ea4btnflGNYlosF3eI\nFZaJE5OEGTTtrD43ZJuJZzUCm9W2rkhoaCE70HyXix6rXYYfZVDlZY7+ew3EhnVV\n1ToE+8ECgYAH9350Sz2IhI+eYV9o2uo+UlVLBAm/Y9f3BbSzSlDbqSjUUX2RjKeL\n8Nle5+7HErNhSMvnqo/a5FAtb4mRTGp2ZJolC4F55zNc/WYR9y8i1H9XQKsjTkl0\ncVfN8EY+WtWjE17TrBx3ABLpfauLFcel++DU0bauHnRzrlmRb0WZwQKBgAPgNmK/\nZEuynv7I4o4m0Ps+Nut9Qkzk187Y3dZZw1NOuk5Gynat9FZwS3mmkK5r9s3b4207\noSqrzRKldlfErAF3Oi3ljm9Eek4DFGbY3YNZD/ek7wXjHugxv8XgHSUoHCcgzbJE\nLVA9aglNATNY2hrJnLV0DlNhThm+zS4GBqOBAoGBALmIeFIKE1dlfEGDyrmYJh1V\nMeUk3q7l0XhZl/Ct2xQzfd+0+Z27RYrkrCj4UApZbx+R+p2/DVdKJ4Tqpc4GNQiZ\npoLXtT8uHt4OS1e2L6LpC7v6tvYL/XvmlzW6rUY5lCCR7o/YeTk4uLMjROYTxbwC\nEtSrKBMTGL4K6ZWafi2e\n-----END PRIVATE KEY-----\n",
      client_email:
        "firebase-adminsdk-l3n3w@lca-peer-tutoring.iam.gserviceaccount.com",
      client_id: "118344144925420328825",
      auth_uri: "https://accounts.google.com/o/oauth2/auth",
      token_uri: "https://oauth2.googleapis.com/token",
      auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
      client_x509_cert_url:
        "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-l3n3w%40lca-peer-tutoring.iam.gserviceaccount.com",
      universe_domain: "googleapis.com",
    });

export default adminApp;
