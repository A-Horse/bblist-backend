import * as colors from 'colors';
import * as express from 'express';
import * as http from 'http';

import { configure } from './config/configure';
import { hashPasswd } from './domain/auth/createUser';

export function startToolServer() {
  const app = express();

  app.get('/hash-passwd/:password', (req, res) => {
    const password = req.params.password;
    res.status(200).send(hashPasswd(password));
  });

  const server = http.createServer(app);
  const port = configure.get('TOOL_SERVE_PORT');
  server.listen(port as number, '0.0.0.0');

  // tslint:disable-next-line
  console.log(colors.green(`Octopus tool serve on http://0.0.0.0:${port}`));
}
