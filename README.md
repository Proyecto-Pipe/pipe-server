# P.I.P.E

[![Logo de Pipe](https://raw.githubusercontent.com/santigo171/pipe-frontend/main/src/assets/logo.png "Logo de Pipe")](# "Logo de Pipe")

### Proyecto Invernadero Pedagógico Estudiantil

Presentación el proyecto: https://drive.google.com/file/d/1l-ndVBoZgVm_VMkF270SU4DZTlN-6F5f/view?usp=sharing

**P.I.P.E** es un invernadero inteligente enfocado a instituciones educativas que busca promover en sus estudiantes un compromiso hacia el medio ambiente.

- **Didáctico**: Orientado al aprendizaje para todos los rangos de edad.

- **Asequible**: Creado con componentes de electrónica y programación.

- **Sostenible**: Encaminado al cumplimiento el [Objetivo de Desarrollo Sostenible # 13][objetivo de desarrollo sostenible # 13].

## Documentación

El código de P.I.P.E está dividido en 3 partes. **En cada uno de los repositorios se encuentra documentación más detallada**.

[![documentacion imagen](https://i.ibb.co/TmvpHF7/Screenshot-153.jpg "documentacion imagen")](# "documentacion imagen")

- **[pipe-arduino:][pipe-arduino]** Sketch de Arduino programado en C++. Su función es recolectar mediante sensores y posteriormente enviar al servidor la humedad, temperatura y luminosidad del invernadero y verifica cada determinado tiempo si en el servidor hay una petición pendiente para activar una bombilla o una bomba de agua. Este corre en cualquier placa de desarrollo, se recomienda ESP 32.

- **[pipe-server:][pipe-server]** Servidor escrito con Node.js. Este recibe los datos (humedad, temperatura, luminosidad) de la placa y los envía al frontend del usuario mediante una API. Mediante la misma API recibe las peticiones (activar bombilla, activar bomba de agua) del usuario para que la placa procese y ejecute. Corre en cualquier servicio de hosting que soporte Javascript.

- **[pipe-frontend:][pipe-frontend]** Página web programada con React. Muestra los datos del invernadero y envía las peticiones al servidor. Es hosteado mediante Github Pages.

## Autores

P.I.P.E ha sido creado por **[Julian Franco][julian franco]**, **Zaida Guzman** y **[David Hurtado][david hurtado]**, estudiantes del **[Colegio Agustiniano Norte][colegio agustiniano norte]**, apoyados por el profesor **[William Andres Granada Campos][william andres granada campos]**.

[objetivo de desarrollo sostenible # 13]: https://www.un.org/sustainabledevelopment/es/climate-change-2/ "Objetivo de Desarrollo Sostenible # 13"
[david hurtado]: https://santigo171.github.io/ "David Hurtado"
[william andres granada campos]: https://www.linkedin.com/in/william-andres-granada-campos-b4017116/ "William Andres Granada Campos"
[colegio agustiniano norte]: https://agustinianonorte.edu.co/ "Colegio Agustiniano Norte"
[pipe-arduino]: https://github.com/santigo171/pipe-arduino "pipe-arduino"
[julian franco]: https://www.instagram.com/Julianfranco_07/ "Julian Franco"
[pipe-server]: https://github.com/santigo171/pipe-server "pipe-server"
[pipe-frontend]: https://github.com/santigo171/pipe-frontend "pipe-frontend"
